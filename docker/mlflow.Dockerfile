# MLflow tracking server with Postgres backend + S3 (MinIO) artifact store.
FROM python:3.11-slim

RUN pip install --no-cache-dir \
    "mlflow==2.14.1" \
    "psycopg2-binary>=2.9" \
    "boto3>=1.34"

EXPOSE 5000
# Command is provided by docker-compose (mlflow server ...).
