# RetailRec MLOps — Production Recommendation System Platform

> End-to-end RecSys MLOps: **two-tower neural retrieval → XGBoost learning-to-rank reranker**, backed by a **Feast feature store**, **MLflow** registry, **Kubernetes**/SageMaker serving, **Evidently** drift monitoring with automated retraining, and an **A/B testing framework** with statistical auto-rollback.

[![CI](https://github.com/Murali-Sai/1ForAll/actions/workflows/ci.yml/badge.svg)](https://github.com/Murali-Sai/1ForAll/actions)
![Python](https://img.shields.io/badge/python-3.11-blue)
![License](https://img.shields.io/badge/license-MIT-green)

This is not a notebook demo. It is the infrastructure that decides **which model serves traffic, when it gets retrained, and why a variant gets rolled back** — built on the H&M Personalized Fashion dataset (1.37M users, 105K items, 31M transactions).

---

## Architecture

```
                       ┌─────────────────────── MLOps Loop ───────────────────────┐
                       │  Airflow DAG (drift-triggered OR scheduled)               │
                       │  ingest → GE validate → PySpark features → Feast          │
                       │  materialize → train → MLflow eval gate → promote/canary  │
                       └───────────────▲───────────────────────────┬──────────────┘
                                       │ drift alert               │ promote
        Evidently (PSI / cosine drift) │                           ▼
                                       │            ┌──────────────────────────────┐
   request ─▶ FastAPI /recommend/{id} ─┼──────────▶ │ Stage 1: Two-Tower retrieval │
                                       │            │   FAISS IVFFlat top-200      │
                                       │            ├──────────────────────────────┤
   Feast online (Redis, <20ms) ───────┘            │ Stage 2: XGBoost LambdaRank  │
                                                    │   rank:ndcg → top-K          │
                                                    └──────────────┬───────────────┘
                                                                   ▼  ranked JSON
                              A/B splitter (deterministic hash) → control / variant
                              z-test significance → auto-promote or rollback
```

Two cleanly separated stages so each is independently versioned, retrained, and deployed.

| Stage | Model | Serving |
|-------|-------|---------|
| **1. Candidate retrieval** | PyTorch two-tower (64-dim, in-batch negatives) → FAISS IVFFlat ANN | ONNX + Triton |
| **2. Reranking** | XGBoost LambdaRank (`rank:ndcg`) over Feast features | FastAPI / SageMaker |
| Baselines | ALS (implicit) + content-based (SBERT) | — |

---

## Tech Stack

| Domain | Tools |
|--------|-------|
| **RecSys algorithms** | PyTorch two-tower, XGBoost LambdaRank, ALS (implicit), SBERT content embeddings |
| **Data engineering** | PySpark, Great Expectations, Feast (Redis + Parquet/S3), Apache Airflow |
| **ANN / retrieval** | FAISS IVFFlat |
| **Model lifecycle** | MLflow (tracking + registry), ONNX / TorchScript |
| **Serving** | FastAPI, Triton, Redis cache, ONNX runtime |
| **Infra** | Docker, Kubernetes (k3d / EKS), AWS SageMaker, Terraform, ECR, S3 |
| **CI/CD** | GitHub Actions (lint, test, build, deploy) |
| **Monitoring** | Evidently AI (drift), Prometheus + Grafana (latency/throughput) |
| **Evaluation** | NDCG@10, MAP@10, MRR, Precision@K, Recall@K, Hit Rate; A/B z-test engine |

---

## Quickstart (local)

> Prereqs: Docker Desktop, [`uv`](https://docs.astral.sh/uv/), and a Kaggle account.

```powershell
# 1. Python env (isolated 3.11)
.\tasks.ps1 setup

# 2. Local infra: Postgres + Redis + MinIO + MLflow
.\tasks.ps1 up            # MLflow UI -> http://localhost:5000, MinIO -> http://localhost:9001

# 3. Verify config
.\tasks.ps1 info

# (subsequent phases add: data download, training, serving, ...)
```

Install per-phase extras as needed, e.g. `uv pip install -e ".[data]"` (Phase 1), `".[ml,tracking]"` (Phases 3–5), `".[serving]"` (Phase 6).

---

## Build Status

This project is built in 10 phases (see the [spec](RetailRec_MLOps_Project_Spec.docx)). Local-runnable + cloud-ready (AWS IaC is apply-ready but not auto-applied).

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Repo scaffold, Python 3.11 env, local infra (compose) | 🟡 In progress |
| 1 | Data ingestion + Great Expectations + PySpark features | ⬜ Planned |
| 2 | Feast feature store (offline Parquet + online Redis) | ⬜ Planned |
| 3 | ALS + content-based baselines (MLflow) | ⬜ Planned |
| 4 | Two-Tower retrieval (PyTorch) + FAISS + ONNX | ⬜ Planned |
| 5 | XGBoost LambdaRank reranker + full pipeline | ⬜ Planned |
| 6 | Docker + Kubernetes (k3d) + SageMaker/Terraform (apply-ready) | ⬜ Planned |
| 7 | CI/CD (GitHub Actions) + PyTest suite | ⬜ Planned |
| 8 | Evidently drift + automated retraining DAG | ⬜ Planned |
| 9 | A/B framework + offline evaluation report | ⬜ Planned |
| 10 | Hybrid model + load test + docs/ADRs + demo | ⬜ Planned |

---

## Repository Layout

```
src/retailrec/        # core package (config, data, features, models, serving, ...)
feature_repo/         # Feast feature definitions
airflow/dags/         # retraining + materialization DAGs
k8s/                  # Kubernetes manifests (Deployment, Service, HPA, Ingress)
terraform/            # AWS IaC (ECR, S3, SageMaker, IAM) — apply-ready
docker/               # Dockerfiles + local infra config
tests/                # PyTest unit + integration
docs/adr/             # architecture decision records
notebooks/            # exploration
```

---

**Author:** Murali Sai Buddakkagari Venkata · murali140824@gmail.com · [linkedin.com/in/muralisaibk](https://linkedin.com/in/muralisaibk)
