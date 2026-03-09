<div align="center">

# 🧪 LabFlow

### Laboratory Information Management System

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)](https://maven.apache.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> **LabFlow** is a cloud-based Laboratory Information Management System (LIMS) designed to streamline sample tracking, experiment management, and result documentation for modern biotech and research laboratories.

<br/>

[Features](#-features) • [Architecture](#-architecture) • [User Flow](#-user-flow) • [Data Model](#-data-model) • [Getting Started](#-getting-started) • [API Docs](#-api-documentation)

</div>

---

## ✨ Features

| Module | Capabilities |
|---|---|
| 🔐 **Authentication** | JWT-based login, role-based access (Admin, Researcher, Technician) |
| 🧫 **Sample Management** | Create, track and update lab samples with full status lifecycle |
| 🔬 **Experiment Management** | Link experiments to samples and researchers |
| 📊 **Results** | Attach files and notes to experiment results |
| 📈 **Dashboard** | Real-time lab statistics and KPIs |
| 📖 **API Docs** | Interactive Swagger UI for all endpoints |

---

## 🏗️ Architecture

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           LABFLOW — SYSTEM ARCHITECTURE                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

  ┌─────────────────────────────┐         ┌──────────────────────────────────┐
  │        FRONTEND             │         │            BACKEND               │
  │     React 18 + Vite         │         │        Spring Boot 3.2           │
  │      Vercel (prod)          │         │        Railway (prod)            │
  │                             │         │                                  │
  │  ┌───────────────────────┐  │  HTTPS  │  ┌────────────────────────────┐ │
  │  │       Pages           │  │◄───────►│  │      REST Controllers      │ │
  │  │                       │  │  JSON   │  │                            │ │
  │  │  /login               │  │  + JWT  │  │  POST /api/auth/login      │ │
  │  │  /dashboard           │  │         │  │  POST /api/auth/register   │ │
  │  │  /samples             │  │         │  │  GET  /api/samples         │ │
  │  │  /experiments         │  │         │  │  GET  /api/experiments     │ │
  │  │  /results             │  │         │  │  GET  /api/results         │ │
  │  └───────────────────────┘  │         │  │  GET  /api/dashboard       │ │
  │                             │         │  └────────────┬───────────────┘ │
  │  ┌───────────────────────┐  │         │               │                  │
  │  │   Auth Context        │  │         │  ┌────────────▼───────────────┐ │
  │  │   (JWT in localStorage│  │         │  │      Security Layer        │ │
  │  │   + auto-redirect)    │  │         │  │                            │ │
  │  └───────────────────────┘  │         │  │  JwtAuthFilter             │ │
  │                             │         │  │  UserDetailsService        │ │
  │  ┌───────────────────────┐  │         │  │  BCrypt Password Encoder   │ │
  │  │   Axios API Client    │  │         │  └────────────┬───────────────┘ │
  │  │   + Interceptors      │  │         │               │                  │
  │  └───────────────────────┘  │         │  ┌────────────▼───────────────┐ │
  └─────────────────────────────┘         │  │      Service Layer         │ │
                                          │  │                            │ │
                                          │  │  AuthService               │ │
                                          │  │  SampleService             │ │
                                          │  │  ExperimentService         │ │
                                          │  │  ResultService             │ │
                                          │  │  DashboardService          │ │
                                          │  └────────────┬───────────────┘ │
                                          │               │                  │
                                          │  ┌────────────▼───────────────┐ │
                                          │  │    JPA Repositories        │ │
                                          │  │    Hibernate ORM           │ │
                                          │  └────────────┬───────────────┘ │
                                          └───────────────┼──────────────────┘
                                                          │
                                          ┌───────────────▼──────────────────┐
                                          │         PostgreSQL 16             │
                                          │                                   │
                                          │  users · samples · experiments    │
                                          │  results                          │
                                          └──────────────────────────────────┘
```

---

## 🔄 User Flow

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           LABFLOW — USER FLOW                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

  [User visits LabFlow]
          │
          ▼
  ┌───────────────┐      credentials      ┌──────────────────┐
  │  Login Page   │──────────────────────►│  POST /auth/login │
  └───────────────┘                       └────────┬─────────┘
                                                   │
                              ┌────────────────────┼────────────────────┐
                              │ Invalid            │ Valid               │
                              ▼                    ▼                     │
                       ┌────────────┐      ┌──────────────┐             │
                       │   Error    │      │  JWT Token   │             │
                       │  message   │      │  generated   │             │
                       └────────────┘      └──────┬───────┘             │
                                                  │                     │
                                                  ▼
                                    ┌─────────────────────────┐
                                    │       Dashboard          │
                                    │  • Total Samples         │
                                    │  • Total Experiments     │
                                    │  • Experiments In Progress│
                                    │  • Completed Experiments │
                                    └──────────┬──────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
          ┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
          │    Samples       │       │   Experiments    │       │     Results      │
          ├─────────────────┤       ├──────────────────┤       ├──────────────────┤
          │ • Create sample  │       │ • Create exp.    │       │ • Add result     │
          │ • List samples   │──────►│ • Link to sample │──────►│ • Attach file    │
          │ • Update status  │       │ • Assign researcher│     │ • Add notes      │
          │ • Delete sample  │       │ • Track status   │       │ • Filter by exp. │
          └─────────────────┘       └──────────────────┘       └──────────────────┘

  Sample Status Flow:                   Experiment Status Flow:
  ┌──────────┐                          ┌─────────┐
  │ RECEIVED │                          │ PENDING │
  └────┬─────┘                          └────┬────┘
       │                                     │
       ▼                                     ▼
  ┌────────────┐                       ┌─────────────┐
  │ IN_PROCESS │                       │ IN_PROGRESS │
  └─────┬──────┘                       └──────┬──────┘
        │                                     │
        ▼                              ┌──────┴──────┐
   ┌──────────┐                        │             │
   │ COMPLETED│                        ▼             ▼
   └────┬─────┘                   ┌─────────┐  ┌────────┐
        │                         │COMPLETED│  │ FAILED │
        ▼                         └─────────┘  └────────┘
   ┌──────────┐
   │ ARCHIVED │
   └──────────┘
```

---

## 🗃️ Data Model

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           LABFLOW — DATA MODEL                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

  ┌──────────────────────┐           ┌──────────────────────┐
  │        users         │           │       samples         │
  ├──────────────────────┤           ├──────────────────────┤
  │ PK  id               │           │ PK  id               │
  │     name             │     ┌────►│     sample_code (UQ) │
  │     email (UQ)       │     │     │     sample_type      │
  │     password         │     │     │     collection_date  │
  │     role             │     │     │     status           │
  │     created_at       │─────┘     │ FK  created_by       │
  └──────────┬───────────┘           │     created_at       │
             │                       └──────────┬───────────┘
             │                                  │
             │  researcher                       │ sample
             │                                  │
             └──────────────┐    ┌──────────────┘
                            │    │
                            ▼    ▼
                  ┌──────────────────────┐
                  │      experiments     │
                  ├──────────────────────┤
                  │ PK  id               │
                  │     name             │
                  │     type             │
                  │     date             │
                  │     status           │
                  │ FK  researcher_id    │
                  │ FK  sample_id        │
                  │     created_at       │
                  └──────────┬───────────┘
                             │
                             │ experiment
                             │
                             ▼
                  ┌──────────────────────┐
                  │       results        │
                  ├──────────────────────┤
                  │ PK  id               │
                  │ FK  experiment_id    │
                  │     file_path        │
                  │     notes            │
                  │     created_at       │
                  └──────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- Docker & Docker Compose
- Node.js 18+

### Run with Docker (recommended)

```bash
# Clone the repository
git clone https://github.com/juancarlosrozoa/LabFlow.git
cd LabFlow

# Start everything
docker-compose up
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |

### Run locally (development)

```bash
# 1. Start the database
docker-compose up postgres

# 2. Start the backend (new terminal)
mvn spring-boot:run

# 3. Start the frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Default credentials

| Email | Password | Role |
|---|---|---|
| `admin@labflow.com` | `admin123` | ADMIN |

---

## 📁 Project Structure

```
LabFlow/
├── src/main/java/com/labflow/
│   ├── config/               # Security, CORS, Swagger, Exception handler
│   ├── controller/           # REST API endpoints
│   ├── dto/
│   │   ├── request/          # Input DTOs (LoginRequest, SampleRequest...)
│   │   └── response/         # Output DTOs (AuthResponse, SampleResponse...)
│   ├── model/                # JPA entities (User, Sample, Experiment, Result)
│   ├── repository/           # Spring Data JPA repositories
│   ├── security/             # JWT filter and UserDetailsService
│   └── service/              # Business logic layer
├── src/main/resources/
│   └── application.properties
├── frontend/
│   └── src/
│       ├── components/       # Layout, shared UI components
│       ├── context/          # AuthContext (global auth state)
│       ├── pages/            # Login, Dashboard, Samples, Experiments, Results
│       └── services/         # Axios API client with JWT interceptors
├── Dockerfile                # Multi-stage Docker build
└── docker-compose.yml        # PostgreSQL + backend orchestration
```

---

## 📖 API Documentation

Interactive documentation available at:
```
http://localhost:8080/swagger-ui.html
```

### Endpoints Summary

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and get JWT token | ❌ |
| `GET` | `/api/samples` | List all samples | ✅ |
| `POST` | `/api/samples` | Create a new sample | ✅ |
| `GET` | `/api/samples/{id}` | Get sample by ID | ✅ |
| `PUT` | `/api/samples/{id}` | Update a sample | ✅ |
| `DELETE` | `/api/samples/{id}` | Delete a sample | ✅ |
| `GET` | `/api/experiments` | List all experiments | ✅ |
| `POST` | `/api/experiments` | Create a new experiment | ✅ |
| `GET` | `/api/experiments/{id}` | Get experiment by ID | ✅ |
| `PUT` | `/api/experiments/{id}` | Update an experiment | ✅ |
| `DELETE` | `/api/experiments/{id}` | Delete an experiment | ✅ |
| `GET` | `/api/results/experiment/{id}` | Get results by experiment | ✅ |
| `POST` | `/api/results` | Add a result | ✅ |
| `DELETE` | `/api/results/{id}` | Delete a result | ✅ |
| `GET` | `/api/dashboard` | Get lab statistics | ✅ |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.2 | Application framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | Database abstraction layer |
| Hibernate | ORM |
| JWT (jjwt 0.12) | Stateless token authentication |
| Springdoc OpenAPI | Swagger UI documentation |
| Lombok | Boilerplate reduction |
| PostgreSQL 16 | Relational database |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Lucide React | Icon library |

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Local service orchestration |
| Railway | Backend & database hosting |
| Vercel | Frontend hosting |

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | Coming soon |
| Backend API | Coming soon |
| Swagger UI | Coming soon |

---

## 🔒 Environment Variables

### Backend
| Variable | Description | Default |
|---|---|---|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/labflow` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `labflow` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `labflow123` |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | — |
| `JWT_EXPIRATION` | Token expiration in milliseconds | `86400000` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |

### Frontend
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api` |

---

## 📄 License

This project is licensed under the MIT License.
