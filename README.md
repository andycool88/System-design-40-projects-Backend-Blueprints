# Backend System Design — 40 Project Blueprints

> **A practical backend system-design cheat sheet built around 40 core concepts for designing scalable, reliable applications.**

This repository is a collection of **40 focused backend blueprints**, each designed to explore one fundamental architecture, pattern, or scalability problem.

The goal isn't to build 40 massive applications.

Instead, each project isolates a specific backend concept so you can **build it, understand the architecture behind it, and see how it applies to real-world systems**.

---

## 🎯 What This Repository Is

This is a hands-on **Backend & System Design study guide** covering the building blocks used to design modern scalable applications.

The 40 projects progress from fundamental API concepts into databases, caching, distributed systems, and production reliability.

### The 5 Learning Areas

| # | Area                                  | Concepts                                                                                               |
| - | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1 | **Core Concepts**                     | APIs, REST, HTTP, authentication, authorization, rate limiting, idempotency                            |
| 2 | **Databases & Data Handling**         | SQL/NoSQL, indexes, transactions, pagination, sharding, replication, locking                           |
| 3 | **Caching & Performance**             | Caching, TTL, LRU, cache consistency, CDN, stale data                                                  |
| 4 | **Distributed Systems & Scaling**     | Load balancing, scaling, microservices, communication, message queues                                  |
| 5 | **Reliability & Real-World Problems** | Retries, race conditions, distributed locks, events, sagas, observability, deployments, traffic spikes |

---

# 📚 The 40 Blueprints

## 01 — Core Concepts

### 1. API Fundamentals

Understand how APIs expose functionality and data to clients through defined requests and responses.

### 2. REST vs GraphQL

Explore the differences between resource-based REST APIs and flexible GraphQL queries.

### 3. HTTP Methods

Work with `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` and understand when each should be used.

### 4. HTTP Status Codes

Learn how `2xx`, `3xx`, `4xx`, and `5xx` responses communicate the result of an HTTP request.

### 5. Stateless vs Stateful APIs

Understand the architectural differences between stateless and stateful backend systems.

### 6. Authentication vs Authorization

Separate identity verification from permission management.

### 7. Session Authentication vs JWT

Compare server-managed sessions with token-based authentication.

### 8. OAuth 2.0

Understand the architecture behind "Login with Google", GitHub, and other third-party authentication flows.

### 9. Rate Limiting vs Throttling

Learn how systems control excessive traffic and protect backend resources.

### 10. Idempotency

Build systems where repeating the same request does not accidentally produce duplicate operations — especially important for payments.

---

# 🗄️ 02 — Databases & Data Handling

### 11. SQL vs NoSQL

Understand when relational databases and document-based databases are appropriate.

### 12. Database Indexes

Learn how indexes reduce expensive database scans and improve query performance.

### 13. ACID Properties

Explore Atomicity, Consistency, Isolation, and Durability.

### 14. Transactions & Isolation Levels

Understand how databases safely execute multiple operations and manage concurrent transactions.

### 15. Normalization vs Denormalization

Learn when to eliminate duplicated data and when deliberately duplicating data can improve read performance.

### 16. Pagination

Compare offset-based pagination with cursor-based pagination.

### 17. Sharding & Partitioning

Understand how large datasets can be divided across tables and database servers.

### 18. Read Replicas

Separate read workloads from write workloads to improve database scalability.

### 19. Duplicate Record Handling

Learn how unique constraints, deduplication, and idempotency prevent duplicate data.

### 20. Optimistic vs Pessimistic Locking

Understand different strategies for preventing conflicting updates in concurrent systems.

---

# ⚡ 03 — Caching & Performance

### 21. Caching

Understand where caching can be introduced — browser, CDN, application, memory, Redis, and database layers.

### 22. Cache Eviction

Explore strategies such as:

* TTL — Time To Live
* LRU — Least Recently Used

### 23. Cache Consistency

Understand stale data, cache invalidation, and synchronization between caches and databases.

### 24. CDN & Edge Caching

Learn how geographically distributed caching reduces latency and backend load.

### 25. When Caching Makes Systems Wrong

Understand the trade-off between **performance and correctness** when cached data becomes stale.

---

# 🌐 04 — Distributed Systems & Scaling

### 26. Load Balancing

Explore:

* Round-robin
* Least connections
* Hashing
* Sticky sessions

### 27. Horizontal vs Vertical Scaling

Understand the difference between making one machine stronger and adding more machines.

### 28. Monolith vs Microservices

Explore the trade-offs between a single application and independently deployable services.

### 29. Synchronous vs Asynchronous Communication

Understand when services should wait for responses and when work should happen asynchronously.

### 30. Message Queues

Explore asynchronous communication using technologies such as:

* Kafka
* RabbitMQ
* Amazon SQS

---

# 🛡️ 05 — Reliability & Real-World Problems

### 31. Exactly-Once vs At-Least-Once Processing

Understand message delivery guarantees and why idempotent consumers are important.

### 32. Retries, Timeouts & Circuit Breakers

Learn how distributed systems recover from temporary failures without creating cascading failures.

### 33. Race Conditions

Understand what happens when multiple requests attempt to modify the same resource simultaneously.

### 34. Distributed Locking

Learn how multiple application instances coordinate access to shared resources.

### 35. Event-Driven Architecture

Build systems around events rather than tightly coupled service-to-service calls.

### 36. Saga Pattern

Understand how distributed transactions can be coordinated through local transactions and compensating actions.

### 37. Graceful Degradation

Design systems that continue providing core functionality even when individual components fail.

### 38. Observability

Understand the three major pillars:

* **Logs**
* **Metrics**
* **Traces**

### 39. Deployment Strategies

Explore:

* Blue-Green Deployments
* Rolling Deployments

### 40. Handling Traffic Spikes

Learn how systems survive sudden traffic increases using:

* Auto-scaling
* Caching
* Queues
* Load balancing
* Load shedding

---

# 🧠 How to Use This Repository

The recommended approach is simple:

```text
Learn → Build → Break → Analyze → Improve
```

For every blueprint:

1. **Understand the problem**
2. **Build the simplest working solution**
3. **Identify the bottleneck**
4. **Apply the relevant architecture or pattern**
5. **Test the behavior under realistic conditions**
6. **Understand the scalability trade-offs**

The objective is not simply to make the application work.

The objective is to understand **why the architecture works** and **when you would use it in a real production system**.

---

# 🏗️ Architecture Progression

The projects are intentionally arranged to build your system-design knowledge progressively:

```text
                    BACKEND SYSTEM DESIGN
                            │
          ┌─────────────────┴─────────────────┐
          │                                   │
      FUNDAMENTALS                         SCALABILITY
          │                                   │
     APIs & HTTP                       Load Balancing
     Authentication                    Horizontal Scaling
     Authorization                     Microservices
     Rate Limiting                     Message Queues
     Idempotency                       Event-Driven Systems
          │                                   │
          └──────────────┬────────────────────┘
                         │
                    DATA LAYER
                         │
              ┌──────────┴──────────┐
              │                     │
          Databases              Caching
              │                     │
        Transactions             Redis
        Indexes                  TTL / LRU
        Replication              CDN
        Sharding                 Consistency
        Locking
              │                     │
              └──────────┬──────────┘
                         │
                      RELIABILITY
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Retries        Events        Observability
       Timeouts       Sagas         Deployments
       Circuit        Locks         Traffic Spikes
       Breakers
```

---

# 🎓 What You'll Learn

By working through the 40 blueprints, you'll build practical understanding of:

* REST API architecture
* Authentication and authorization
* API security and traffic control
* Database design
* SQL and NoSQL trade-offs
* Query optimization
* Transactions and concurrency
* Caching strategies
* Distributed systems
* Horizontal scaling
* Microservices
* Asynchronous processing
* Message queues
* Event-driven architecture
* Distributed transactions
* Fault tolerance
* Observability
* Deployment strategies
* High-traffic system design

---

# 🔧 Technologies

The specific technology used by each blueprint may vary depending on the concept being demonstrated.

Typical technologies and tools include:

```text
Node.js
Express.js
PostgreSQL
MongoDB
Redis
Kafka
RabbitMQ
Amazon SQS
Docker
Kubernetes
NGINX
AWS
```

The technology is secondary.

**The architecture is the lesson.**

---

# 📁 Repository Philosophy

Each project should remain **small and focused**.

A blueprint should demonstrate one primary concept rather than hide the concept inside a huge production application.

For example:

```text
01-api/
02-rest-vs-graphql/
03-http-methods/
...
26-load-balancer/
27-horizontal-scaling/
...
40-traffic-spikes/
```

Each project can have its own README explaining:

* The problem
* The architecture
* How it works
* Key implementation details
* How to run it
* What to learn
* Possible improvements

This keeps the repository useful as both a **learning path and a future reference/cheat sheet**.

---

# 🚀 Learning Goal

The ultimate goal of this repository is to move from:

```text
"I know how to write backend code."
```

to:

```text
"I understand how to design backend systems."
```

And eventually:

```text
"I can choose the right architecture
based on scale, performance, reliability,
consistency, and business requirements."
```

---

## 📌 Reference

The concepts in this repository are organized around the 40-topic Backend & System Design study notes covering APIs, databases, caching, distributed systems, and reliability.

---

## ⭐ If You're Learning Backend

Don't just read the concepts.

**Build them. Break them. Scale them. Understand them.**
