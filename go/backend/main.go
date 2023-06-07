package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/milvus-io/milvus-sdk-go/v2/entity"
	"github.com/pkoukk/tiktoken-go"
)

const (
	maxRetry  = 5
	encoding  = "cl100k_base"
	grpcAddr  = "standalone:19530"
	mysqlAddr = "mysql:3306"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("mysql:password@tcp(%s)/mysql", mysqlAddr))
	if err != nil {
		log.Fatal(err)
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
		log.Fatal(err)
	}

	var mclient client.Client
	// retry until milvus is ready or max retry count is reached
	for i := 1; i <= maxRetry; i++ {
		mclient, err = client.NewGrpcClient(context.Background(), grpcAddr)
		if err == nil {
			log.Println("Milvus ready!")
			break
		}
		log.Printf("Attempt: %d Milvus not ready...", i)
		time.Sleep(time.Duration(i) * time.Second)
	}

	if err != nil {
		log.Fatal(err)
	}

	tkm, err := tiktoken.GetEncoding(encoding)
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()

	// Endpoint for AI response
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

			tks := make([]float32, 0, 100)
			for _, t := range token {
				tks = append(tks, float32(t))
			}

			for i := 0; i < 100-len(token); i++ {
				tks = append(tks, 1000.0)
			}

			err := mclient.LoadCollection(context.Background(), "qa", false)
			if err != nil {
				http.Error(w, err.Error(), 500)
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
				http.Error(w, err.Error(), 500)
				return
			}

			col := sr[0].IDs

			firstNum, _ := col.GetAsInt64(0)

			row := db.QueryRow("SELECT answer FROM qa WHERE milvus_id = ?", fmt.Sprint(firstNum))

			var answer string
			err = row.Scan(&answer)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
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
		panic(err)
	}
}
