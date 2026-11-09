# 🛒 Amazon Clone - Full-Stack E-Commerce Platform

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-SQLite3-003B57.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-bhuvankolisetti%2Fe--commerce-orange.svg)](https://github.com/bhuvankolisetti/e-commerce)

A production-grade, responsive, full-featured **Amazon Clone E-Commerce Web Application** developed as a **Final Year Capstone Project**. Built with an ultra-lightweight, zero-dependency Python backend, SQLite relational database, and modern interactive responsive frontend.

---

## 🌟 Key Features

### 1. 🛍️ Customer Storefront & Navigation
- **Authentic Amazon Navbar**: Logo branding, delivery address selector, department search dropdown, user greeting, returns & orders, and real-time cart badge.
- **Dynamic Hero Banner**: Auto-advancing promotional carousel with category call-to-actions.
- **Amazon 4-Card Category Grids**: High-impact promotional cards for Electronics, Fashion, Home & Kitchen, and Books.
- **Advanced Catalog Search & Filters**: Instant multi-category filtering, live search queries, and dynamic sorting (Price low/high, Highest rated, Biggest discounts).

### 2. 🔍 Product Details & Customer Reviews
- **High-Resolution Showcase**: Rich product photography with in-stock indicators and Prime delivery badges.
- **Full Specifications**: Detailed feature bullet points and savings calculation (`-$XX.XX (Save XX%)`).
- **Review System**: Real-time customer feedback submission with 5-star ratings and verified purchase timestamps.

### 3. 🛒 Interactive Shopping Cart & Free Shipping
- **Slide-out Cart Drawer**: Smooth slide-over drawer with instant quantity increments, decrements, and deletions.
- **Free Delivery Progress Indicator**: Visual progress bar tracking eligible free shipping over $35.00 threshold.
- **Persistent Cart**: Automatically saved across browser sessions using `localStorage`.

### 4. 💳 Multi-Step Checkout & Simulated Payment
- **Step 1: Shipping Address**: Form with validation for recipient, street address, city, and postal code.
- **Step 2: Payment Gateways**: Simulated 1-Click Amazon Pay Balance, Credit/Debit Card, UPI / QR Code, and Cash on Delivery.
- **Step 3: Review & Place Order**: Automated calculation of subtotal, 8% sales tax, shipping fee, and grand total.

### 5. 🧾 Order Confirmation & Print Invoice
- **Order Generation**: Unique order identifier (`AMZ-YYYYMMDD...`).
- **Package Tracking**: Order status tracking (`Processing`, `Shipped`, `Delivered`).
- **Printable Receipt**: Instant 1-click printable order invoice.

### 6. ⚙️ Seller Central & Admin Portal
- **Business KPI Metrics**: Live dashboard displaying Total Revenue, Total Orders, Active Catalog Items, and Registered Users.
- **Catalog Management (CRUD)**: Create new products with custom deal prices, badges, categories, and image URLs; edit or delete items in real-time.
- **Order Fulfillment**: Track placed orders and update customer fulfillment statuses live.

### 7. 🔐 User Authentication
- **Secure Authentication**: Customer and Admin login/registration with SHA-256 password hashing.
- **Pre-configured Demo Credentials**:
  - **Admin Manager**: `admin@amazon.com` / `admin123`
  - **Demo Customer**: `bhuvan@amazon.com` / `user123`

---

## 🏗️ Project Architecture & File Structure

```text
c:\e commerce\
├── app.py                     # Main application server (REST API + static file server, 0 dependencies)
├── database.py                # Database models, SQLite setup & sample product seeding
├── schema.sql                 # SQL schema DDL for documentation & viva
├── requirements.txt           # Dependencies specification
├── push_to_github.ps1         # One-click PowerShell script to push to GitHub
├── push_to_github.bat         # One-click Windows batch script to push to GitHub
├── github_sync.py             # Python sync utility (Git CLI & GitHub REST API support)
├── test_app.py                # Automated unit & integration test suite (6 passing tests)
├── TEST_CASES.md              # Test specifications & system test cases for viva
├── VIVA_PRESENTATION_SLIDES.md # Slide-by-slide presentation script & notes for viva
├── PROJECT_REPORT.md          # Complete Final Year Project Synopsis & Viva Q&A Guide
├── README.md                  # Project documentation
├── .gitignore                 # Standard Python git exclusions
├── static/
│   ├── css/
│   │   └── style.css          # Authentic Amazon design system (CSS variables, responsive grid)
│   └── js/
│       └── app.js             # Main SPA controller (state, catalog, cart, checkout, admin)
└── templates/
    └── index.html             # Single-Page Application Amazon clone storefront
```

---

## 🚀 Quick Start Guide

### Step 1: Run the Server
The project runs out-of-the-box on any machine with **Python 3.8+** without needing to install external packages:

```bash
# Navigate to the project directory
cd "c:\e commerce"

# Start the application server
python app.py
```

### Step 2: Open in Your Browser
Open your browser and navigate to:
```text
http://localhost:5000
```

---

## 🔄 How to Push Updates to GitHub

To push all files to your GitHub repository ([`bhuvankolisetti/e-commerce`](https://github.com/bhuvankolisetti/e-commerce)):

### Option A: One-Click Windows Script (Easiest)
Simply double-click:
```text
push_to_github.bat
```
or run in PowerShell:
```powershell
.\push_to_github.ps1
```

### Option B: Using Git CLI Directly
```bash
git init
git branch -M main
git remote add origin https://github.com/bhuvankolisetti/e-commerce.git
git add .
git commit -m "Amazon Clone Final Year Project update"
git push -u origin main
```

### Option C: Using the Python Sync Tool with a GitHub Token
If Git CLI is not installed on your system, you can upload directly using a GitHub Personal Access Token:
```bash
python github_sync.py --token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

---

## 📊 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (supports `?category=`, `?search=`, `?sort=`) |
| `GET` | `/api/products/<id>` | Retrieve single product details, reviews, and related products |
| `POST` | `/api/products` | Add a new product (Admin) |
| `PUT` | `/api/admin/products/<id>` | Update an existing product (Admin) |
| `DELETE` | `/api/admin/products/<id>` | Delete a product from inventory (Admin) |
| `POST` | `/api/orders` | Submit a new order |
| `GET` | `/api/orders` | Retrieve order list (supports `?user_id=`) |
| `PATCH` | `/api/orders/<id>/status` | Update fulfillment status (Admin) |
| `POST` | `/api/auth/login` | User login verification |
| `POST` | `/api/auth/register` | Create a new customer account |
| `POST` | `/api/reviews` | Submit product review and rating |
| `GET` | `/api/admin/stats` | Retrieve platform revenue and performance metrics |

---

## 👨‍💻 Author & Project Credits
- **Project Lead**: Bhuvan Kolisetti
- **Target Repository**: [https://github.com/bhuvankolisetti/e-commerce](https://github.com/bhuvankolisetti/e-commerce)
- **Course**: Final Year Capstone Project (B.Tech / B.E. / BCA / MCA)
- **Year**: 2026

