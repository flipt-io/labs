package main

import (
	"context"
	"database/sql"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/milvus-io/milvus-sdk-go/v2/entity"
	"github.com/pkoukk/tiktoken-go"
)

const (
	maxRetry       = 5
	collectionName = "qa"
	dataFile       = "data/example_data.csv"
	encoding       = "cl100k_base"
	grpcAddr       = "standalone:19530"
	mysqlAddr      = "mysql:3306"
)

func run() error {
	schema := &entity.Schema{
		CollectionName: collectionName,
		Description:    "collection that has various questions and answers.",
		Fields: []*entity.Field{
			{
				Name:       "id",
				DataType:   entity.FieldTypeInt64,
				PrimaryKey: true,
				AutoID:     true,
			},
			{
				Name:       "question",
				DataType:   entity.FieldTypeVarChar,
				PrimaryKey: false,
				AutoID:     false,
				TypeParams: map[string]string{
					"max_length": "65535",
				},
			},
			{
				Name:       "answer",
				DataType:   entity.FieldTypeVarChar,
				PrimaryKey: false,
				AutoID:     false,
				TypeParams: map[string]string{
					"max_length": "65535",
				},
			},
			{
				Name:     "embedding",
				DataType: entity.FieldTypeFloatVector,
				TypeParams: map[string]string{
					"dim": "100",
				},
			},
		},
	}

	fmt.Println("Reading CSV and building schema...")
	qCol, aCol, eCol, err := readCSVAndBuildSchema()
	if err != nil {
		return err
	}

	mclient, err := client.NewGrpcClient(context.Background(), grpcAddr)
	if err != nil {
		return err
	}

	fmt.Println("Creating collection...")
	err = mclient.CreateCollection(context.Background(), schema, 2)
	if err != nil {
		return err
	}

	_, err = mclient.Insert(context.Background(), collectionName, "", qCol, aCol, eCol)
	if err != nil {
		return err
	}

	idx, err := entity.NewIndexIvfFlat(entity.L2, 1024)
	if err != nil {
		return err
	}

	fmt.Println("Creating index...")
	err = mclient.CreateIndex(context.Background(), collectionName, "embedding", idx, false)
	if err != nil {
		return err
	}

	err = mclient.LoadCollection(context.Background(), "qa", false)
	if err != nil {
		return err
	}

	rs, err := mclient.Query(context.Background(), "qa", nil, "id != -1", []string{"id", "question", "answer"})
	if err != nil {
		return err
	}

	idColumn := rs.GetColumn("id")
	questionColumn := rs.GetColumn("question")
	answerColumn := rs.GetColumn("answer")

	colLen := idColumn.Len()

	ids := make([]int64, 0, colLen)
	questions := make([]string, 0, colLen)
	answers := make([]string, 0, colLen)

	for i := 0; i < colLen; i++ {
		id, _ := idColumn.GetAsInt64(i)
		q, _ := questionColumn.GetAsString(i)
		a, _ := answerColumn.GetAsString(i)

		ids = append(ids, id)
		questions = append(questions, q)
		answers = append(answers, a)
	}

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
		log.Fatal(err)
	}

	_, err = db.ExecContext(context.Background(), `CREATE TABLE IF NOT EXISTS qa (
		milvus_id TEXT,
		question TEXT,
		answer TEXT
	)`)
	if err != nil {
		return err
	}

	for i := 0; i < colLen; i++ {
		// Ignore insertion errors
		_, _ = db.ExecContext(context.Background(), "INSERT INTO `qa` (`milvus_id`, `question`, `answer`) VALUES (?, ?, ?)", ids[i], questions[i], answers[i])
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func readCSVAndBuildSchema() (*entity.ColumnVarChar, *entity.ColumnVarChar, *entity.ColumnFloatVector, error) {
	file, err := os.Open(dataFile)
	if err != nil {
		return nil, nil, nil, err
	}

	creader := csv.NewReader(file)

	records, err := creader.ReadAll()
	if err != nil {
		return nil, nil, nil, err
	}

	questions := make([]string, 0, len(records)-1)
	answers := make([]string, 0, len(records)-1)

	// Build questions and answers here
	tkm, err := tiktoken.GetEncoding(encoding)
	if err != nil {
		return nil, nil, nil, err
	}

	embedValues := make([][]float32, 0, len(records))
	for i := 1; i < len(records); i++ {
		questions = append(questions, records[i][0])
		answers = append(answers, records[i][1])

		tokens := tkm.Encode(records[i][0], nil, nil)
		e := make([]float32, 0, 100)

		for _, t := range tokens {
			e = append(e, float32(t))
		}

		for i := 0; i < 100-len(tokens); i++ {
			e = append(e, 1000.0)
		}

		embedValues = append(embedValues, e)
	}

	questionsColumn := entity.NewColumnVarChar("question", questions)
	answersColumn := entity.NewColumnVarChar("answer", answers)
	embeddingsColumn := entity.NewColumnFloatVector("embedding", 100, embedValues)

	return questionsColumn, answersColumn, embeddingsColumn, nil
}
