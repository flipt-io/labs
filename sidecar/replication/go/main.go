package main

import (
	"context"
	_ "embed"
	"fmt"
	"html/template"
	"log"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"go.flipt.io/flipt/rpc/flipt/evaluation"
	sdk "go.flipt.io/flipt/sdk/go"
	sdkgrpc "go.flipt.io/flipt/sdk/go/grpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
)

//go:embed index.html.tmpl
var indexTmplContent string

var t = template.Must(template.New("").Parse(indexTmplContent))

type Evaluation struct {
	Value string
}

type TemplateData struct {
	Evaluation []*Evaluation
}

func getClientFromAddr(addr string) (sdk.SDK, error) {
	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return sdk.SDK{}, err
	}

	transport := sdkgrpc.NewTransport(conn)

	return sdk.New(transport), nil
}

func invokeEvaluation(ctx context.Context, evaluationClient *sdk.Evaluation, flagName, contextKey, contextValue string) (*evaluation.VariantEvaluationResponse, time.Duration, error) {
	now := time.Now()
	e, err := evaluationClient.Variant(ctx, &evaluation.EvaluationRequest{
		NamespaceKey: "default",
		FlagKey:      flagName,
		Context: map[string]string{
			contextKey: contextValue,
		},
	})
	if err != nil {
		return nil, 0, err
	}
	difference := time.Since(now)

	return e, difference, nil
}

func run() error {
	evaluations := make([]*Evaluation, 0)

	masterAddr := os.Getenv("FLIPT_MASTER_ADDR")
	if masterAddr == "" {
		masterAddr = "flipt-master:9000"
	}

	sidecarClient, err := getClientFromAddr("localhost:9000")
	if err != nil {
		return err
	}

	masterClient, err := getClientFromAddr(masterAddr)
	if err != nil {
		return err
	}
	slog.Info("master address", "master-addr", masterAddr)

	r := chi.NewRouter()

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		tmplData := TemplateData{
			Evaluation: evaluations,
		}

		if err := t.Execute(w, tmplData); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	r.Post("/evaluation", func(w http.ResponseWriter, r *http.Request) {
		flagKey := r.FormValue("flagKey")
		contextKey := r.FormValue("contextKey")
		contextValue := r.FormValue("contextValue")
		backend := r.FormValue("backend")

		var client = sidecarClient
		if backend == "master" {
			client = masterClient
		}

		variantResponse, difference, err := invokeEvaluation(r.Context(), client.Evaluation(), flagKey, contextKey, contextValue)
		if err != nil {
			if e, ok := status.FromError(err); ok {
				switch e.Code() {
				case codes.NotFound:
					evaluations = append(evaluations, &Evaluation{
						Value: fmt.Sprintf("The flag: %s is not found on server took %s to complete evaluation from the backend: %s", flagKey, difference, backend),
					})
					http.Redirect(w, r, r.Referer(), http.StatusFound)
				default:
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}
			}
			return
		}

		variantKey := variantResponse.VariantKey
		if variantKey == "" {
			variantKey = "None"
		}
		evaluation := &Evaluation{
			Value: fmt.Sprintf("The %s value from evaluation is: %s and took %s to complete evaluation from the backend: %s", flagKey, variantKey, difference, backend),
		}

		evaluations = append(evaluations, evaluation)

		http.Redirect(w, r, r.Referer(), http.StatusFound)
	})

	r.Get("/cli/backend/{backend}/evaluation/{flagKey}", func(w http.ResponseWriter, r *http.Request) {
		flagKey := chi.URLParam(r, "flagKey")
		backend := chi.URLParam(r, "backend")

		if backend != "sidecar" && backend != "master" {
			http.Error(w, "please enter either sidecar or master for backend", http.StatusNotFound)
			return
		}

		var client = sidecarClient
		if backend == "master" {
			client = masterClient
		}

		variantResponse, difference, err := invokeEvaluation(r.Context(), client.Evaluation(), flagKey, "in_segment", "segment_001")
		if err != nil {
			if e, ok := status.FromError(err); ok {
				switch e.Code() {
				case codes.NotFound:
					w.Write([]byte(fmt.Sprintf("The flag: %s is not found on server took %s to complete evaluation from the backend: %s", flagKey, difference, backend)))
					return
				default:
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}
			}
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Write([]byte(fmt.Sprintf("The %s value from evaluation is: %s and took %s to complete evaluation from the backend: %s", flagKey, variantResponse.VariantKey, difference, backend)))
	})

	server := &http.Server{
		Addr:    ":8000",
		Handler: r,
	}

	slog.Info("staring http server on :8000")
	return server.ListenAndServe()
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
