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

//go:embed index.tmpl
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
		flagName := r.FormValue("flagName")
		contextKey := r.FormValue("contextKey")
		contextValue := r.FormValue("contextValue")
		backend := r.FormValue("backend")

		var client = sidecarClient
		if backend == "master" {
			client = masterClient
		}

		now := time.Now()
		e, err := client.Evaluation().Variant(context.Background(), &evaluation.EvaluationRequest{
			NamespaceKey: "default",
			FlagKey:      flagName,
			Context: map[string]string{
				contextKey: contextValue,
			},
		})
		difference := time.Since(now)

		if err != nil {
			if e, ok := status.FromError(err); ok {
				switch e.Code() {
				case codes.NotFound:
					evaluations = append(evaluations, &Evaluation{
						Value: fmt.Sprintf("The flag: %s is not found on server took %s to complete evaluation from the backend: %s", flagName, difference, backend),
					})
					http.Redirect(w, r, r.Referer(), http.StatusFound)
				default:
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}
			}
			return
		}

		variantKey := e.VariantKey
		if variantKey == "" {
			variantKey = "None"
		}
		evaluation := &Evaluation{
			Value: fmt.Sprintf("The %s value from evaluation is: %s and took %s to complete evaluation from the backend: %s", flagName, variantKey, difference, backend),
		}

		evaluations = append(evaluations, evaluation)

		http.Redirect(w, r, r.Referer(), http.StatusFound)
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
