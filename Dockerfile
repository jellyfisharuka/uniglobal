FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/main .

COPY --from=builder /app/internal/config ./internal/config
COPY --from=builder /app/docs ./docs
COPY --from=builder /app/static ./static

ENV DB="host=dpg-d06btjjuibrs73ee7r3g-a user=root password=KLbOmqsrOKgkxneVf5jAS0mWYuHKQbl1 dbname=chatbot_k3qg port=5432 sslmode=disable"
ENV PORT=8080
ENV FRONTEND_URL="http://frontend:3000"

EXPOSE 8080

CMD ["/app/main"]