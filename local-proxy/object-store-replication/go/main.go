package main

import (
	"context"
	_ "embed"
	"fmt"
	"html/template"
	"log"
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

func run() error {
	evaluations := make([]*Evaluation, 0)

	fliptEvaluationAddr := os.Getenv("FLIPT_EVALUATION_ADDR")
	if fliptEvaluationAddr == "" {
		fliptEvaluationAddr = "localhost:9000"
	}

	conn, err := grpc.Dial(fliptEvaluationAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return err
	}

	transport := sdkgrpc.NewTransport(conn)

	client := sdk.New(transport)

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
						Value: fmt.Sprintf("The flag: %s is not found on server took %s to complete evaluation", flagName, difference),
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
			Value: fmt.Sprintf("The %s value from evaluation is: %s and took %s to complete evaluation", flagName, variantKey, difference),
		}

		evaluations = append(evaluations, evaluation)

		http.Redirect(w, r, r.Referer(), http.StatusFound)
	})

	server := &http.Server{
		Addr:    ":8000",
		Handler: r,
	}

	return server.ListenAndServe()
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
