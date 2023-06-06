package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/milvus-io/milvus-sdk-go/v2/entity"
	"github.com/pkoukk/tiktoken-go"
)

const (
	encoding  = "cl100k_base"
	grpcAddr  = "standalone:19530"
	mysqlAddr = "mysql:3306"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("mysql:password@tcp(%s)/mysql", mysqlAddr))
	if err != nil {
		log.Fatal(err)
	}

	mclient, err := client.NewGrpcClient(context.Background(), grpcAddr)
	if err != nil {
		log.Fatal(err)
	}

	tkm, err := tiktoken.GetEncoding(encoding)
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()

	// Endpoint for similarity search on milvus
	mux.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			var prompt struct {
				Prompt string `json:"prompt"`
			}

			if err := json.NewDecoder(r.Body).Decode(&prompt); err != nil {
				w.WriteHeader(500)
				return
			}

			token := tkm.Encode(prompt.Prompt, nil, nil)

			tks := make([]float32, 0)
			for _, t := range token {
				tks = append(tks, float32(t))
			}

			for i := 0; i < 768-len(token); i++ {
				tks = append(tks, rand.Float32())
			}

			err := mclient.LoadCollection(context.Background(), "qa", false)
			if err != nil {
				w.WriteHeader(500)
				return
			}

			sp, _ := entity.NewIndexIvfFlatSearchParam(10)

			sr, err := mclient.Search(
				context.Background(),
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
				w.WriteHeader(500)
				return
			}

			col := sr[0].IDs

			firstNum, _ := col.GetAsInt64(0)
			row := db.QueryRow("SELECT answer FROM qa WHERE milvus_id = ?", firstNum)

			var answer string
			err = row.Scan(&answer)
			if err != nil {
				w.WriteHeader(500)
				return
			}

			w.Header().Add("Content-Type", "application/json")
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
		panic(err)
	}
}