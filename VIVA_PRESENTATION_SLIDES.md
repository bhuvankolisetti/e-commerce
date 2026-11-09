# 🎓 FINAL YEAR PROJECT DEFENSE & VIVA PRESENTATION SLIDES

**Project Title:** Design and Implementation of an Enterprise-Grade E-Commerce Platform (Amazon Clone)  
**Student Name:** Bhuvan Kolisetti  
**Repository:** [https://github.com/bhuvankolisetti/e-commerce](https://github.com/bhuvankolisetti/e-commerce)  
**Technology Stack:** Python 3, SQLite, HTML5, CSS3, JavaScript (REST Architecture)  

---

## 📽️ Slide Outline & Presentation Script

### Slide 1: Title & Introduction
- **Slide Heading**: Amazon Clone: Full-Stack E-Commerce System
- **Subheading**: Final Year Capstone Project
- **Presented by**: Bhuvan Kolisetti
- **Speaker Notes**:
  > *"Good morning respected evaluators and panel members. Today, I am presenting my final year project: an enterprise-grade full-stack e-commerce web platform inspired by Amazon. This system incorporates end-to-end shopping workflows including inventory exploration, real-time search, cart management, secure checkout, order fulfillment, and seller analytics."*

---

### Slide 2: Problem Statement & Motivation
- **Key Points**:
  - Traditional retail requires physical presence and high operational overhead.
  - Many existing e-commerce templates suffer from heavy framework dependencies, bloated load times, and complex database management.
  - Need for a lightweight, zero-dependency, yet feature-complete architecture that runs reliably across any hardware.
- **Speaker Notes**:
  > *"Our primary motivation was to engineer an e-commerce platform that eliminates heavyweight deployment dependencies while preserving the rich, responsive user experience expected of modern retail giants like Amazon."*

---

### Slide 3: System Architecture & Design
- **Architecture Diagram**:
  - Client Layer (Browser SPA, Responsive UI, Amazon theme)
  - Application Service Layer (Python `ThreadingHTTPServer`, REST Endpoints, JSON Routing)
  - Persistence Layer (SQLite Relational Database, ACID Compliance)
- **Design Pattern**: Model-View-Controller (MVC) with Decoupled RESTful APIs
- **Speaker Notes**:
  > *"The system follows a clean Model-View-Controller pattern. The frontend communicates with the server through standardized JSON REST APIs, allowing the client and backend to scale and evolve independently."*

---

### Slide 4: Database Schema & Entity Relationships
- **5 Core Relational Tables**:
  1. `users`: Stores customer and administrator profiles with salted SHA-256 password hashing.
  2. `products`: Catalog items with pricing, category tags, ratings, Prime status, and inventory flags.
  3. `orders`: Transactions, shipping destinations, payment methods, and delivery statuses.
  4. `order_items`: Line-item breakdown linking orders with products and historical unit prices.
  5. `reviews`: Customer ratings and feedback linked by product foreign keys.
- **Speaker Notes**:
  > *"We engineered a normalized relational database in SQLite with foreign-key constraints and indexes on high-frequency lookup columns like category and order IDs to ensure sub-millisecond query execution."*

---

### Slide 5: Core Features & User Workflow
- **Customer Experience**:
  - Department search & live multi-criteria filtering
  - Promotional carousel & Amazon 4-card department discovery
  - Slide-out Cart Drawer with dynamic **FREE shipping progress indicator ($35 threshold)**
  - Multi-step checkout with simulated 1-click Amazon Pay, Card, UPI, and Cash on Delivery
  - Generated Order ID with printable receipts & package tracking
- **Seller / Administrator Portal**:
  - Live business metrics (Total Revenue, Orders Placed, Product Count, Registered Customers)
  - Full CRUD inventory management
  - Order fulfillment state transitions (`Processing` ➔ `Shipped` ➔ `Delivered`)

---

### Slide 6: Security & Data Integrity
- **Security Mechanisms**:
  - **Password Protection**: One-way SHA-256 cryptographic hashing.
  - **SQL Injection Prevention**: Parameterized prepared statements across all database queries.
  - **Cross-Site Scripting (XSS) Prevention**: Strict DOM string escaping for user-submitted reviews.
  - **Client Isolation**: CORS headers and separated administrative endpoints.

---

### Slide 7: Testing & Verification
- **Automated Test Results (`test_app.py`)**:
  - `6/6` Automated unit and integration tests passing in `0.028s`.
  - Schema integrity, password hashing, catalog seeding, price/discount sanity, admin verification, and transaction rollback verified.
- **Manual Verification**:
  - Tested across cross-browser environments (Chrome, Edge, Firefox, Mobile viewports).

---

### Slide 8: Live Demonstration Highlights
1. Catalog navigation and keyword search for "MacBook" / "Sony".
2. Adding items to cart and observing the free shipping threshold progress.
3. Completing checkout and generating the official invoice.
4. Logging into the **Seller Central Portal** to view updated revenue and manage orders.

---

### Slide 9: Conclusion & Future Scope
- **Conclusion**:
  - Delivered a robust, self-contained, enterprise-style e-commerce platform meeting all final year capstone benchmarks.
- **Future Enhancements**:
  - Integration of live payment gateways (Stripe / Razorpay webhooks).
  - Machine learning recommendation engine based on user browsing history.
  - Mobile application wrapper using React Native or Flutter.

---

### Slide 10: Acknowledgments & Questions (Q&A)
- **Thank you to**: Project Guide, Faculty, and Panel Examiners.
- **Project Repository**: `https://github.com/bhuvankolisetti/e-commerce`
- **Ready for Questions!**

