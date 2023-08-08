package main

import (
	"context"
	"encoding/json"
	"flag"
	"log"
	"os"
	"time"

	"github.com/gofrs/uuid"
	"go.flipt.io/flipt/rpc/flipt/evaluation"
	sdk "go.flipt.io/flipt/sdk/go"
	grpcflipt "go.flipt.io/flipt/sdk/go/grpc"
	"google.golang.org/grpc"
)

type Duration time.Duration

func (d *Duration) UnmarshalJSON(v []byte) error {
	var s string
	err := json.Unmarshal(v, &s)
	if err != nil {
		return err
	}

	dur, err := time.ParseDuration(s)

	*d = Duration(dur)

	return err
}

type EvaluationSpec struct {
	Interval   Duration                     `json:"interval"`
	Concurrent int                          `json:"concurrent"`
	Type       string                       `json:"type"`
	Request    evaluation.EvaluationRequest `json:"request"`
}

func main() {
	var (
		fliptAddr = flag.String("addr", "localhost:9000", "Host address of Flipt instance.")
		path      = flag.String("evaluations-path", "evaluations.json", "Path to the evaluations file to run.")
	)
	flag.Parse()

	conn, err := grpc.Dial(*fliptAddr, grpc.WithInsecure())
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	log.Printf("connected to Flipt server at: %s\n", *fliptAddr)

	client := sdk.New(grpcflipt.NewTransport(conn)).Evaluation()

	data, err := os.ReadFile(*path)
	if err != nil {
		log.Fatal(err)
	}

	var specs map[string]EvaluationSpec
	if err := json.Unmarshal(data, &specs); err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	for name, spec := range specs {
		if spec.Concurrent < 1 {
			spec.Concurrent = 1
		}

		for i := 0; i < spec.Concurrent; i++ {
			go func(name string, spec EvaluationSpec) {
				req := spec.Request
				if req.EntityId == "" {
					req.EntityId = uuid.Must(uuid.NewV4()).String()
				}

				ticker := time.NewTicker(time.Duration(spec.Interval))
				for range ticker.C {
					switch spec.Type {
					case "", "variant":
						_, err := client.Variant(ctx, &req)
						if err != nil {
							log.Println("error", err)
						}
					case "boolean":
						_, err := client.Boolean(ctx, &req)
						if err != nil {
							log.Println("error", err)
						}
					}
				}
			}(name, spec)
		}
	}

	select {}
}
