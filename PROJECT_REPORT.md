# FINAL YEAR PROJECT REPORT & SYNOPSIS

## Project Title: Design and Implementation of an Enterprise-Grade E-Commerce Platform (Amazon Clone)
**Author:** Bhuvan Kolisetti  
**Repository:** [https://github.com/bhuvankolisetti/e-commerce](https://github.com/bhuvankolisetti/e-commerce)  
**Academic Year:** 2026  

---

## 1. Abstract
The rapid evolution of web technologies has transformed traditional brick-and-mortar retail into seamless electronic commerce ecosystems. This project presents the design and realization of a full-stack, enterprise-style e-commerce platform patterned after Amazon. The application features a lightweight, zero-dependency Python service architecture integrated with an SQLite relational database and a responsive, modern frontend. The system provides core e-commerce capabilities: catalog discovery, dynamic search and filtering, customer review aggregation, session-persisted cart state, multi-step simulated checkout, order fulfillment tracking, and a comprehensive seller administration panel.

---

## 2. Problem Statement & Motivation
Building modern commercial web platforms requires balancing rich user interfaces, responsive state management, secure transaction processing, and operational simplicity. Many modern frameworks introduce dependency bloat, intricate deployment pipelines, and high hosting costs. This project addresses these challenges by demonstrating that a zero-external-dependency, standard-library backend combined with modular front-end architecture can deliver high-performance, robust e-commerce capabilities suitable for enterprise operations and academic evaluation.

---

## 3. System Architecture & Modules

### 3.1 Architectural Pattern: Model-View-Controller (MVC) / REST
```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (Browser)                 │
│  - Amazon Navigation & Search     - Cart Slide-out Drawer   │
│  - Product Grid & Detail Modal   - Multi-Step Checkout UI  │
│  - Seller Dashboard & Metrics    - Order Tracker & Invoice  │
└──────────────────────────────▲──────────────────────────────┘
                               │ HTTP / JSON REST APIs
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Server Layer                 │
│                      (Python app.py)                        │
│  - Request Router & Static File Handler                     │
│  - Authentication & Password Hashing Engine (SHA-256)       │
│  - Order Processing & Tax Calculation Logic                 │
│  - Admin Business Logic & Real-time Metrics Aggregator      │
└──────────────────────────────▲──────────────────────────────┘
                               │ SQLite Database Driver
┌──────────────────────────────▼──────────────────────────────┐
│                      Data Storage Layer                     │
│                     (ecommerce.db)                          │
│  - users         - products      - orders                   │
│  - order_items   - reviews                                  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Core Functional Modules
1. **User Authentication & Authorization Module**:
   - Customer and Administrator role-based access.
   - Salted SHA-256 password hashing.
   - Persistent client-side session control.
2. **Catalog & Search Engine Module**:
   - Multi-category indexing (Electronics, Fashion, Home & Kitchen, Books).
   - Case-insensitive substring query execution.
   - Dynamic sorting algorithms (price ascending/descending, rating, discount).
3. **Shopping Cart & Checkout Module**:
   - Real-time subtotal, 8% sales tax, and automated free shipping logic ($35 threshold).
   - Simulated payment gateways: Amazon Pay, Credit/Debit card, UPI/QR, Cash on Delivery.
4. **Order Fulfillment & Tracking Module**:
   - Unique order identifier generation (`AMZ-YYYYMMDD...`).
   - Order status progression: `Processing` → `Shipped` → `Delivered`.
   - Browser-native printable invoice generation.
5. **Seller Central & Administrative Portal**:
   - Real-time business analytics (Total Revenue, Total Volume, Catalog count, Registered Users).
   - Full CRUD (Create, Read, Update, Delete) inventory management.

---

## 4. Entity-Relationship (ER) Schema Overview

```text
  +------------------+             +-------------------+
  |      USERS       |             |     PRODUCTS      |
  +------------------+             +-------------------+
  | id (PK)          |<------+     | id (PK)           |<-----+
  | name             |       |     | title             |      |
  | email (UNIQUE)   |       |     | category          |      |
  | password_hash    |       |     | price             |      |
  | role             |       |     | original_price    |      |
  | address          |       |     | rating            |      |
  | created_at       |       |     | in_stock          |      |
  +------------------+       |     +-------------------+      |
                             |                                |
  +------------------+       |     +-------------------+      |
  |      ORDERS      |       |     |    ORDER_ITEMS    |      |
  +------------------+       |     +-------------------+      |
  | id (PK)          |       |     | id (PK)           |      |
  | order_number     |       |     | order_id (FK)-----+      |
  | user_id (FK)-----+-------+     | product_id (FK)---+------+
  | customer_name    |             | quantity          |
  | total_amount     |             | unit_price        |
  | status           |             +-------------------+
  +------------------+
```

---

## 5. Viva Voce Preparation (Questions & Answers)

### Q1: Why did you choose Python's built-in `http.server` and SQLite rather than heavyweight frameworks?
**Answer:** Python's built-in standard library provides robust networking (`http.server.ThreadingHTTPServer`) and a complete ACID-compliant relational database (`sqlite3`). This guarantees zero external dependency issues, instant portability on any machine, and maximum transparency for academic evaluation.

### Q2: How does the application safeguard passwords?
**Answer:** Passwords are never stored in plaintext. They are processed using the SHA-256 cryptographic hashing algorithm with UTF-8 encoding before storage in the database (`hashlib.sha256()`).

### Q3: How is the state of the shopping cart preserved if the user refreshes the page?
**Answer:** The shopping cart is managed through a hybrid model: client-side persistence via `localStorage` with JSON serialization, synchronizing dynamically with the UI badge and calculating live totals upon every mutation.

### Q4: How is free shipping computed?
**Answer:** The server and client evaluate the subtotal against Amazon's standard $35 threshold. If subtotal $\ge \$35.00$, shipping fee is set to $\$0.00$; otherwise, standard shipping is $\$5.99$.

### Q5: What makes the search function performant?
**Answer:** SQL substring matching (`LIKE %term%`) combined with database index structures (`CREATE INDEX idx_products_category ON products(category)`) ensures low latency lookups even under large product volumes.

---

## 6. Conclusion
The Amazon Clone E-Commerce project fulfills all core academic and practical objectives of an enterprise shopping platform. It successfully demonstrates the complete software development life cycle (SDLC), from database modeling and REST API design to responsive user experience engineering and continuous version control integration via GitHub.

