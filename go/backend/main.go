package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/milvus-io/milvus-sdk-go/v2/entity"
	"github.com/pkoukk/tiktoken-go"
)

const (
	maxRetry       = 5
	encoding       = "cl100k_base"
	grpcAddr       = "standalone:19530"
	mysqlAddr      = "mysql:3306"
	scoreThreshold = 8.5e8
)

func run() error {
	db, err := sql.Open("mysql", fmt.Sprintf("mysql:password@tcp(%s)/mysql", mysqlAddr))
	if err != nil {
		return err
	}

	// retry until db is ready or max retry count is reached
	for i := 1; i <= maxRetry; i++ {
		err = db.Ping()
		if err == nil {
			log.Println("Mysql ready!")
			break
		}
		log.Printf("Attempt: %d Mysql not ready...", i)
		time.Sleep(time.Duration(i) * time.Second)
	}

	if err != nil {
		return err
	}

	mclient, err := client.NewDefaultGrpcClient(context.Background(), grpcAddr)
	if err != nil {
		return err
	}

	tkm, err := tiktoken.GetEncoding(encoding)
	if err != nil {
		return err
	}

	mux := http.NewServeMux()

	// Endpoint for AI response
	mux.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			ctx := r.Context()

			var prompt struct {
				Prompt string `json:"prompt"`
			}

			if err := json.NewDecoder(r.Body).Decode(&prompt); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			token := tkm.Encode(prompt.Prompt, nil, nil)

			tks := make([]float32, 0, 100)
			for _, t := range token {
				tks = append(tks, float32(t))
			}

			for i := 0; i < 100-len(token); i++ {
				tks = append(tks, 1000.0)
			}

			err := mclient.LoadCollection(ctx, "qa", false)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			sp, _ := entity.NewIndexIvfFlatSearchParam(10)

			sr, err := mclient.Search(
				ctx,
				"qa",
				[]string{},
				"",
				[]string{"answer"},
				[]entity.Vector{entity.FloatVector(tks)},
				"embedding",
				entity.L2,
				10,
				sp,
			)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			answer := "The flipt model does not have the domain knowledge to provide helpful tips for this question.. Sorry!"

			if sr[0].Scores[0] < scoreThreshold {
				col := sr[0].IDs
				firstNum, _ := col.GetAsInt64(0)

				row := db.QueryRow("SELECT answer FROM qa WHERE milvus_id = ?", strconv.FormatInt(firstNum, 10))

				err = row.Scan(&answer)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			}

			w.Header().Add("Content-Type", "application/json")
			w.WriteHeader(200)
			json.NewEncoder(w).Encode(struct {
				Answer string `json:"answer"`
			}{
				Answer: answer,
			})
		}
	})

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	err = server.ListenAndServe()
	if err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
