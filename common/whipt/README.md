whipt - Load testing tool for Flipt
-----------------------------------

This is just a little experimental load testing tool for Flipt.
The purpose of the tool is to run a bunch of configurable evaluation calls over time.

## Running

```
go run main.go [-addr="flipt.address"] [-evaluations-path="evaluations.json"]
```

## Evaluations file

See: the example [evaluations JSON file](./evaluations.example.json) to get an idea of the format.

```CUE
[string]: {
  interval: string // interval between requests by single goroutine (go duration)
  concurrent: int // number of concurrent goroutines running the evaluation
  request: { // the evaluation request payload (as per OpenAPI spec)
    namespace_key: string
    flag_key: string
    entity_id: string
    context: [string]: string 
  }
}
```
