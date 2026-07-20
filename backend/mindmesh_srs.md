# MindMesh — AI-Driven Knowledge Graph Platform

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Dependencies and Configuration](#4-dependencies-and-configuration)
5. [Database Configuration](#5-database-configuration)
6. [Entity Models](#6-entity-models)
7. [Repositories](#7-repositories)
8. [Service Layer](#8-service-layer)
9. [Controller Layer](#9-controller-layer)
10. [Security Implementation](#10-security-implementation)
11. [Exception Handling](#11-exception-handling)
12. [Data Transfer Objects (DTOs)](#12-data-transfer-objects-dtos)
13. [Utility Classes](#13-utility-classes)
14. [API Endpoints](#14-api-endpoints)
15. [Frontend Component Specifications](#15-frontend-component-specifications)
16. [Frontend Service Configurations](#16-frontend-service-configurations)
17. [Frontend Store Configurations (Redux Toolkit)](#17-frontend-store-configurations-redux-toolkit)
18. [Event Publishing & Activity Logging](#18-event-publishing--activity-logging)
19. [Demo UI](#19-demo-ui)
20. [End of Documentation](#20-end-of-documentation)

---

## 1. Project Overview

This is a Spring Boot-based REST API application designed to manage complex knowledge graphs, research domains, and analytical networks. The system provides a secure platform for strategists to oversee conceptual graph architectures and for analysts to navigate and extract insights from the data structures.

The application supports role-based access where strategists (`ROLE_RESEARCH_STRATEGIST`) have broad access to create, update, and manage knowledge meshes, while analysts (`ROLE_ANALYST`) have read-oriented capabilities to interact with the existing graphs. The API is securely protected using HS256-signed JWT tokens.

---

## 2. Technology Stack

| Category | Technology |
|---|---|
| Framework | Spring Boot 3.1.2 |
| Java Version | Java 17 |
| Build Tool | Maven |
| Frontend | React / Redux Toolkit / Standard CSS |
| Database | MySQL |
| ORM | Hibernate / JPA |
| Security | Spring Security with JWT (HS256) |
| Backend Testing | TestNG with Strict Java Reflection API Mapping |
| Frontend Testing | Jest + React Testing Library |
| Password Encoding | BCrypt (10 rounds) |

---

## 3. Project Structure

### BackEnd

```
backend
└── src
    └── main
        └── java/com/example/demo
            ├── config
            │   ├── DatabaseCheckConfig.java
            │   ├── DatabaseSeeder.java
            │   ├── SecurityConfig.java
            │   └── WebConfig.java
            ├── controller
            │   ├── AuthController.java
            │   ├── CollaborationController.java
            │   ├── EdgeController.java
            │   ├── GraphController.java
            │   ├── InsightController.java
            │   └── NodeController.java
            ├── entity
            │   ├── ActivityLog.java
            │   ├── CollaborationInvite.java
            │   ├── ConceptNode.java
            │   ├── KnowledgeGraph.java
            │   ├── SemanticEdge.java
            │   └── SystemAccount.java
            ├── event
            │   ├── ComplexityEventListener.java
            │   └── GraphComplexityEvent.java
            ├── exception
            │   └── GlobalExceptionHandler.java
            ├── repository
            │   ├── ActivityLogRepository.java
            │   ├── CollaborationInviteRepository.java
            │   ├── ConceptNodeRepository.java
            │   ├── KnowledgeGraphRepository.java
            │   ├── SemanticEdgeRepository.java
            │   └── SystemAccountRepository.java
            ├── security
            │   └── JwtUtil.java
            ├── service
            │   ├── AuthService.java
            │   ├── CollaborationService.java
            │   ├── GraphOrchestratorService.java
            │   ├── InsightService.java
            │   └── SpatialLogicService.java
            └── MindMeshApplication.java
```

### Front End

```
frontend
├── node_modules/
├── public
│   └── index.html
└── src
    ├── __mocks__
    │   └── axios.js
    ├── components
    │   ├── canvas
    │   │   ├── EdgeElement.jsx
    │   │   ├── GraphCanvas.jsx
    │   │   ├── MeshPreview.jsx
    │   │   └── NodeElement.jsx
    │   ├── common
    │   │   ├── CapacityBar.jsx
    │   │   ├── EmptyState.jsx
    │   │   └── SearchFilterBar.jsx
    │   ├── dashboard
    │   │   ├── RecentActivity.jsx
    │   │   └── StatCards.jsx
    │   ├── graphs
    │   │   ├── GraphForm.jsx
    │   │   └── GraphList.jsx
    │   ├── layout
    │   │   └── Navbar.jsx
    │   ├── nodes
    │   │   └── NodeForm.jsx
    │   ├── processes
    │   │   ├── ActivityLog.jsx
    │   │   ├── AIOrchestrator.jsx
    │   │   ├── Discovery.jsx
    │   │   ├── ExportHub.jsx
    │   │   ├── GlobalMetrics.jsx
    │   │   ├── SemanticSearch.jsx
    │   │   └── SystemHealth.jsx
    │   ├── ErrorHandler.jsx
    │   ├── Login.jsx
    │   ├── NotificationStack.jsx
    │   └── Register.jsx
    ├── services
    │   ├── api.js
    │   ├── authService.js
    │   └── graphService.js
    └── store
        ├── slices
        │   ├── authSlice.js
        │   └── graphSlice.js
        └── index.js
```

---

## 4. Dependencies and Configuration

- MySQL Connector/J
- JJWT Library (HS256)
- TestNG & Jest for Reflection and UI evaluations
- Swagger-UI

### Configuration Layer

#### 1. CorsConfig.java

**Purpose:** Dictates global Cross-Origin Resource Sharing rules.

**Implementation Requirements:**
- Allows external frontend origins (`http://localhost:3000`)
- Allows credentials
- Maps across HTTP methods (GET, POST, PUT, DELETE, OPTIONS)

#### 2. SecurityConfig.java

**Purpose:** Determines exact Spring Security protocols.

**Implementation Requirements:**
- `@Bean passwordEncoder()` returning `BCryptPasswordEncoder` with strength 10
- `@Bean securityFilterChain()` configuring:
  - Public endpoints: `/api/auth/login`, `/api/auth/register`, `/api/graphs/public`
  - Protected endpoints: all others
  - Role-based: `/api/graphs/**` requires `RESEARCH_STRATEGIST` for write operations
  - Stateless session management
  - JWT filter before `UsernamePasswordAuthenticationFilter`

---

## 5. Database Configuration

**URL:** `jdbc:mysql://localhost:3306/mindmesh?useSSL=false&allowPublicKeyRetrieval=true`

**Username/Password:** Standard credentials configured per environment

---

## 6. Entity Models

### 1. SystemAccount Entity (Table: `system_account`)

**Fields:**

| Field | Type | Constraints |
|---|---|---|
| id | Long | `@Id`, `@GeneratedValue` |
| username | String | `@Column(unique=true, nullable=false, length=100)` |
| password_hash | String | `@Column(nullable=false)` |
| role | String | `@Column(nullable=false)` |
| status | String | `@Column(nullable=false)` |

**Purpose:** Master record mapping authentication and authorization contexts securely.

**Implementation Requirements:**
- `username` must be unique and non-null
- `password_hash` strictly captures BCrypt encodings (10 rounds)
- `@Table(name = "system_account")` explicitly maps the persistent SQL constraint

### 2. KnowledgeGraph Entity (Table: `knowledge_graphs`)

**Fields:**

| Field | Type | Constraints |
|---|---|---|
| id | Long | `@Id`, `@GeneratedValue` |
| title | String | `@Column(nullable=false, length=200)` |
| description | String | `@Column(length=2000)` |
| domain | String | `@Column(length=100)` |
| complexityScore | Double | `@Column(nullable=false, columnDefinition="DOUBLE DEFAULT 0.0")` |
| isPublic | Boolean | `@Column(nullable=false, columnDefinition="BOOLEAN DEFAULT FALSE")` |
| createdAt | LocalDateTime | `@Column(nullable=false)` |
| updatedAt | LocalDateTime | — |
| owner | SystemAccount | `@ManyToOne(fetch=FetchType.LAZY)` |

**Relationships:**
- `@ManyToOne(fetch = FetchType.LAZY)` with `SystemAccount owner`
- `@OneToMany(mappedBy = "knowledgeGraph", cascade = CascadeType.ALL)` with `List<Node> nodes`
- `@OneToMany(mappedBy = "knowledgeGraph", cascade = CascadeType.ALL)` with `List<Edge> edges`

**Implementation Requirements:**
- `title` cannot be blank
- Must utilize `@Table(name = "knowledge_graph")` natively
- Must include JPA relationship mappings using `@ManyToOne` with `SystemAccount owner`

### 3. ActivityLog Entity (Table: `activity_logs`)

**Fields:**

| Field | Type | Description |
|---|---|---|
| id | Long | Primary key |
| graphId | Long | ID of affected knowledge graph |
| userId | Long | ID of user who performed action |
| action | String | CREATE, UPDATE, DELETE, CALCULATE_COMPLEXITY |
| timestamp | LocalDateTime | When action occurred |
| details | String | Additional context (JSON string) |

**Purpose:** Track all CRUD and calculation operations for audit trail.

### 4. Node Entity (Table: `nodes`)

**Fields:**

| Field | Type | Constraints |
|---|---|---|
| id | Long | `@Id`, `@GeneratedValue` |
| label | String | `@Column(nullable=false)` |
| xPosition | Double | — |
| yPosition | Double | — |
| knowledgeGraph | KnowledgeGraph | `@ManyToOne` |

### 5. Edge Entity (Table: `edges`)

**Fields:**

| Field | Type | Constraints |
|---|---|---|
| id | Long | `@Id`, `@GeneratedValue` |
| sourceNodeId | Long | `@Column(nullable=false)` |
| targetNodeId | Long | `@Column(nullable=false)` |
| relationshipType | String | `@Column(nullable=false)` |
| knowledgeGraph | KnowledgeGraph | `@ManyToOne` |

---

## 7. Repositories

All repositories must interface securely with `JpaRepository<Entity, Long>` natively abstracting generic SQL.

### 1. SystemAccountRepository

**Purpose:** Resolves persistent authentication loops cleanly against raw string usernames.

**Implementation Requirements:**
- `Optional<SystemAccount> findByUsername(String username)` returning strict optional unwrappers reliably

### 2. KnowledgeGraphRepository

**Purpose:** Connects macro queries natively isolating target structures robustly.

**Implementation Requirements:**
- Inherits generic `JpaRepository` supporting pagination endpoints
- `Page<KnowledgeGraph> findByOwnerId(Long ownerId, Pageable pageable)`
- `Page<KnowledgeGraph> findByIsPublicTrue(Pageable pageable)`
- `@Query("SELECT kg FROM KnowledgeGraph kg WHERE kg.isPublic = true") Page<KnowledgeGraph> findAllPublicGraphs(Pageable pageable)`
- `boolean existsByOwnerIdAndTitleIgnoreCase(Long ownerId, String title)`
- Custom `findBy` methods for filtering

### 3. ActivityLogRepository

**Purpose:** Manages audit trail records.

**Implementation Requirements:**
- `Page<ActivityLog> findByUserId(Long userId, Pageable pageable)`
- `Page<ActivityLog> findAll(Pageable pageable)`
- `List<ActivityLog> findByGraphId(Long graphId)`

---

## 8. Service Layer

### 1. AuthService

**Purpose:** Governs secure cryptographic handshakes resolving JWT derivations predictably.

**Implementation Requirements:**
- Authenticates users and must actively validate passwords utilizing BCrypt
- Generates securely signed tokens via `JwtUtil` upon successful verifications

### 2. GraphService

**Purpose:** Routes dynamic knowledge meshes abstracting persistent SQL interactions smoothly.

**Implementation Requirements:**
- Creates, fetches, updates, and deletes `KnowledgeGraph` objects
- Maps targets reliably and natively unbinds explicit records cleanly upon deletion

### 3. GraphOrchestratorService

**Purpose:** Handles complex operations and event publishing.

**Implementation Requirements:**
- `calculateComplexity(Long graphId)` — computes score based on nodes/edges count and updates entity
- Delegates to repository for data operations
- Publishes events via `ApplicationEventPublisher`

---

## 9. Controller Layer

### 1. AuthController (`/api/auth`)

**Purpose:** Provides stateless HTTP gates mapping initial session generations accurately.

**Implementation Requirements:**
- `POST /login`: (Public Access) 200 OK, returns JWT token payload
- `POST /register`: (Public Access) 201 Created
- `GET /ping`: Verify service reachability

### 2. GraphController (`/api/graphs`)

**Purpose:** Connects frontend components strictly to GraphService mappings cleanly.

**Implementation Requirements:**

| Method | Endpoint | Access | Response |
|---|---|---|---|
| GET | `/` | Authenticated | 200 OK, paginated list |
| GET | `/my` | Authenticated | User's graphs (paginated) |
| GET | `/public` | Public | Public graphs (paginated) |
| GET | `/search` | Authenticated | Search by title/description |
| GET | `/{id}` | Authenticated | Single graph |
| POST | `/` | RESEARCH_STRATEGIST | 201 Created, returns graph |
| PUT | `/{id}` | RESEARCH_STRATEGIST | 200 OK, updates graph |
| DELETE | `/{id}` | RESEARCH_STRATEGIST | 200 OK, returns "KnowledgeGraph deleted successfully." (plain text, not JSON) |
| POST | `/{id}/calculate-complexity` | RESEARCH_STRATEGIST | 200 OK, returns complexity score |
| GET | `/activity` | Authenticated | User activity logs |
| GET | `/activity/all` | RESEARCH_STRATEGIST | All platform activity logs |

> **Important:** `createGraph` endpoint must use `@Valid` on request body. DELETE response must be plain text, not JSON.

### 3. NodeController (`/api/nodes`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/validate-layout/{graphId}` | Validate spatial layout and add/offset concept nodes |
| GET | `/graph/{graphId}` | Retrieve all concept nodes for a graph |

### 4. EdgeController (`/api/edges`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a new semantic edge linking two concept nodes |
| GET | `/graph/{graphId}` | Retrieve all semantic edges for a graph |

### 5. CollaborationController (`/api/collab`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/respond` | Respond to a collaboration invite (Accept/Reject) |

### 6. InsightController (`/api/insights`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Retrieve platform-wide metrics and statistical insights |

---

## 10. Security Implementation

### 1. JwtUtil.java

**Purpose:** Orchestrates HS256 token generation and validation protocols mathematically.

**Implementation Requirements:**
- Must contain a **private** field `secret` injected via `@Value("${jwt.secret}")` (not hardcoded)
- `generateToken(UserDetails userDetails)` — returns HS256 signed JWT with subject=username, issuedAt, expiration (24 hours)
- `validateToken(String token, UserDetails userDetails)` — verifies signature, expiration, and username match
- `extractUsername(String token)` — retrieves subject claim from token
- Token must have 3 parts separated by dots (header.payload.signature)

### 2. JwtRequestFilter.java

**Purpose:** Acts as a security interceptor for every inbound HTTP request to validate JWT authenticity safely.

**Implementation Requirements:**
- Must extend `OncePerRequestFilter` successfully
- Intercepts `Authorization: Bearer` headers securely
- Injects validated subjects directly into the `SecurityContextHolder`

---

## 11. Exception Handling

### 1. ResourceNotFoundException.java

**Purpose:** Provides a highly specialized exception hook exclusively targeting missing backend entities cleanly.

**Implementation Requirements:**
- Extends standard Java `RuntimeException`
- Constructor accepts message: `"KnowledgeGraph not found with id: {id}"`

### 2. GlobalExceptionHandler.java

**Purpose:** Functions as a central `@RestControllerAdvice` safety net intercepting unhandled server boundaries comprehensively.

**Implementation Requirements:**
- Intercepts `ResourceNotFoundException` → returns HTTP 404 with JSON: `{"message": "KnowledgeGraph not found with id: 99"}`
- Intercepts `MethodArgumentNotValidException` → returns HTTP 400 with validation errors
- Intercepts generic `Exception` → returns HTTP 500 with `{"message": "An unexpected error occurred in MindMesh"}`
- All error responses must be unified JSON shells containing exactly the format `{"message": "..."}`

---

## 12. Data Transfer Objects (DTOs)

### 1. AuthRequestDto
- Captures login inputs: `username`, `password`

### 2. AuthResponseDto
- Contains: `token`, `username`, `role`

### 3. GraphDto
- Serializes flat mesh data: `id`, `title`, `description`, `domain`, `isPublic`, `complexityScore`, `createdAt`, `ownerId`

### 4. ActivityLogDto
- Contains: `id`, `graphId`, `userId`, `action`, `timestamp`, `details`

---

## 13. Utility Classes

- **JwtUtil** — JWT operations (see [Security Implementation](#10-security-implementation))
- **PasswordEncoderUtil** — BCrypt encoding (handled by Spring Security)

---

## 14. API Endpoints

### Authentication Endpoints (AuthController)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | User authentication and JWT token generation |
| POST | `/api/auth/register` | Register a new user credential |
| GET | `/api/auth/ping` | Verify service reachability |

### Knowledge Graph Endpoints (GraphController)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/graphs` | Create new knowledge graph |
| GET | `/api/graphs/my` | User's graphs (paginated) |
| GET | `/api/graphs/public` | Public graphs (paginated) |
| GET | `/api/graphs/search` | Search by title/description |
| GET | `/api/graphs/{id}` | Get single graph |
| PUT | `/api/graphs/{id}` | Update graph |
| DELETE | `/api/graphs/{id}` | Delete graph (returns plain text) |
| POST | `/api/graphs/{id}/calculate-complexity` | Calculate complexity score |
| GET | `/api/graphs/activity` | User activity logs |
| GET | `/api/graphs/activity/all` | All activity logs |

### Concept Node Endpoints (NodeController)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/nodes/validate-layout/{graphId}` | Validate and add nodes |
| GET | `/api/nodes/graph/{graphId}` | Get all nodes for graph |

### Semantic Edge Endpoints (EdgeController)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/edges` | Create semantic edge |
| GET | `/api/edges/graph/{graphId}` | Get all edges for graph |

### Collaboration Endpoints (CollaborationController)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/collab/respond` | Respond to collaboration invite |

### Insights & Metrics (InsightController)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/insights/stats` | Platform-wide metrics |

---

## 15. Frontend Component Specifications

### 1. Login.jsx

**Purpose:** Primary entry point for credential validation.

**Implementation Requirements:**
- Username input placeholder: `"MindMesh Username"`
- Password input placeholder: `"Enter Password"` with `type='password'`
- Submit button triggers login API call
- On success: stores token in `localStorage`, redirects to dashboard
- On failure: displays error via `ErrorHandler`

### 2. components/layout/Navbar.jsx

**Purpose:** Role-aware navigation bar mapping UI strictly for either `RESEARCH_STRATEGIST` or `ANALYST`.

**Implementation Requirements:**
- Conditionally renders menus based on user role from Redux
- Logout button clears `localStorage` and Redux state
- Navigation links: Dashboard, My Graphs, Public Graphs (Logout always shown)

### 3. components/graphs/GraphList.jsx

**Purpose:** Renders backend knowledge meshes explicitly.

**Implementation Requirements:**
- For `RESEARCH_STRATEGIST`: shows "+ Create New Mesh" button
- For `ANALYST`: hides this button
- API calls mounted in `useEffect` to fetch graphs via `getMyGraphs()`
- Empty state: `"You haven't built any interactive graphs yet"`
- Pagination controls (Next/Previous)
- Edit and Delete buttons for each graph (strategist only)
- Delete calls `deleteGraph()` and shows success message

### 4. components/graphs/GraphForm.jsx

**Purpose:** Gathers data for new/edit meshes.

**Implementation Requirements:**
- "Mesh Title" input field with HTML `required` attribute
- Focus input actively via `useRef`
- Description textarea (optional)
- Public/Private checkbox
- Submit button text: `"Build Mesh"` (create) or `"Update Mesh"` (edit)
- On submit: calls `createGraph()` or `updateGraph()`
- Displays success alert: `"KnowledgeGraph created successfully."` or `"KnowledgeGraph updated successfully."`
- Modal logic for edit mode

### 5. components/ErrorHandler.jsx

**Purpose:** Global error boundary and notification sink.

**Implementation Requirements:**
- Expects an `error` object prop with `message` field
- Displays error message
- If message is undefined: displays `"An unexpected error occurred in MindMesh"`
- If `onRetry` callback exists: renders button with exact text `"Retry Action"`
- Supports success messages (green) and errors (red)

---

## 16. Frontend Service Configurations

### Axios API

#### 1. services/api.js

**Implementation Requirements:**
- Core Axios instance with `baseURL`: `http://localhost:8080/api`
- Request interceptor: attaches JWT token from `localStorage.getItem('token')` to `Authorization: Bearer` header
- Response interceptor: handles 401 by clearing `localStorage` and redirecting to login

#### 2. services/authService.js

**Implementation Requirements:**
- `login(credentials)` — POST to `/auth/login`, returns token and user data
- `logout()` — clears `localStorage`
- `register(userData)` — POST to `/auth/register`

#### 3. services/graphService.js

**Implementation Requirements:**
- `getMyGraphs(page = 0, size = 10)` — GET to `/graphs/my`
- `getPublicGraphs(page = 0, size = 10)` — GET to `/graphs/public`
- `getGraphById(id)` — GET to `/graphs/{id}`
- `createGraph(graphData)` — POST to `/graphs`
- `updateGraph(id, graphData)` — PUT to `/graphs/{id}`
- `deleteGraph(id)` — DELETE to `/graphs/{id}`, expects plain text response `"KnowledgeGraph deleted successfully."`
- `calculateComplexity(id)` — POST to `/graphs/{id}/calculate-complexity`

---

## 17. Frontend Store Configurations (Redux Toolkit)

### 1. store/index.js

**Implementation Requirements:**
- Uses `configureStore()` with reducers: `{ auth: authReducer, graphs: graphReducer }`

### 2. store/slices/authSlice.js

**Implementation Requirements:**
- State: `{ user: null, token: null, isLoading: false, error: null }`
- `login/fulfilled` — stores user object `{ id, username, role }` and token
- `auth/logout` — resets state to null, clears `localStorage`
- Handles login pending/rejected states

### 3. store/slices/graphSlice.js

**Implementation Requirements:**
- State: `{ items: [], loading: false, error: null, totalPages: 0, currentPage: 0 }`
- Async thunks: `fetchMyGraphs`, `createGraph`, `updateGraph`, `deleteGraph`
- Tracks loading, error, and items array states natively
- On successful create/update/delete: refreshes list

### localStorage Management

**Implementation Requirements:**
- Upon successful login: store JWT token in `localStorage` under key `'token'`
- Store user role in Redux (not `localStorage`, for security)
- On logout: clear `'token'` from `localStorage`
- On page load: check `localStorage` for existing token and restore session

---

## 18. Event Publishing & Activity Logging

### Event Classes

The following events must be published during corresponding operations:

| Event Class | Trigger | Publisher |
|---|---|---|
| GraphCreatedEvent | After successful graph creation | GraphOrchestratorService |
| GraphUpdatedEvent | After successful graph update | GraphOrchestratorService |
| GraphDeletedEvent | After successful graph deletion | GraphOrchestratorService |
| ComplexityCalculatedEvent | After complexity calculation | GraphOrchestratorService |

### Activity Logging Requirements

- An `ActivityLogEventListener` must listen to all graph events
- For each event, create an `ActivityLog` entry and save via `ActivityLogRepository`
- Activity logs must be retrievable via `/api/graphs/activity` and `/api/graphs/activity/all` endpoints

---

## 19. Demo UI

The following screens illustrate the expected end-to-end user experience:

- **Join MindMesh** — Registration screen with Username, Email Address, Password, and Domain Role selection fields, plus a "Register" button and a link for existing users to log in.
- **Login to MindMesh** — Login screen with Username and Password fields and a "Login" button, plus a link to register.
- **Platform Governance & Orchestration** — Strategist dashboard ("Master control center for MindMesh knowledge architecture and global intelligence flow") showing summary cards for Total Knowledge Meshes, Public Intelligence, and Registered Architects, plus a Real-Time Governance Logs table (Event Timestamp, Action Node, Target Intelligence, Governance Status).
- **Global Network Analytics** — Metrics view showing Total Network Nodes, Average Complexity, Network Density, and Public Reach, with an Analytics Summary panel.
- **My Knowledge Meshes** — Analyst/strategist workspace listing graphs with Title, Complexity, Visibility, and Actions (Open Canvas / Edit Info / Delete), with a "+ Create New Mesh" button and pagination.
- **Deep Semantic Search** — Search interface to "find non-obvious relationships across the entire knowledge network," with a search bar and results list.
- **Knowledge Discovery** — Public gallery of meshes ("Explore public meshes and find inspiration for your own work") with card previews and a Trending Topics section.
- **Mesh Insights** — Modal dialog showing a mesh's Complexity Score, Node Count, and a "Conceptual Framework" summary, with a "Close Insight" button.

---

## 20. End of Documentation

---

## Appendix: Platform Summary

**MindMesh – Knowledge Graph Management Platform**

The MindMesh Knowledge Graph Management Platform is a full-stack web application built using ReactJS (frontend) and Spring Boot (backend). It allows research strategists and knowledge architects to manage semantic domains by creating, viewing, editing, and deleting entries for knowledge graphs, concept nodes, and semantic edges. Each graph entry represents an interactive domain of knowledge, including details like title, description, owner details, and calculated complexity scores.

The application ensures a modular architecture with a clear separation between controller, service, model, and repository layers on the backend, and a component-driven approach on the frontend. Robust security is maintained via Spring Security with integrated JWT Token Authentication to protect all sensitive management endpoints.
