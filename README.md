# 🛒 Amazon Clone - Full-Stack E-Commerce Platform

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-SQLite3-003B57.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-bhuvankolisetti%2Fe--commerce-orange.svg)](https://github.com/bhuvankolisetti/e-commerce)

A production-grade, responsive, full-featured **Amazon Clone E-Commerce Web Application** developed as an engineering **Final Year Capstone Project**. Built with a zero-dependency Python backend, SQLite relational database, and modern responsive frontend.

---

## 🌟 Key Pages & Functional Modules

### 1. 🛍️ Storefront & Dynamic Navigation (`/`)
- **Authentic Amazon Navbar**: Logo branding, deliver-to location indicator (`Deliver to Bhuvan, Hyderabad`), department selector dropdown, and real-time cart badge.
- **Instant Search Autocomplete**: As-you-type live suggestions dropdown showing matching products, thumbnail previews, and instant price lookups.
- **Department & Price Range Filtering**: Filter by category (Electronics, Fashion, Home & Kitchen, Books) or enter custom Min/Max price boundaries.
- **Hero Promotional Banner Carousel**: Auto-advancing slider with high-resolution slides for Prime Day Deals, Fashion, and Smart Home Upgrades.
- **4-Card Category Grids**: Amazon-style teaser cards for fast departmental exploration.
- **Catalog of 26 High-Res Products**: Realistic product listings with star ratings, review counts, deal tags, Prime badges, and discount calculations.

### 2. 🔍 Dedicated Product Details Page (`/product?id=...`)
- **Gallery & Visual Showcase**: High-resolution image preview with thumbnail switcher.
- **Full Specifications & Bullet Points**: In-depth feature list, warranty details, and description.
- **Interactive Rating Breakdown**: 5-star distribution percentage bars.
- **Customer Reviews & Testimonials**: List of verified customer reviews with star ratings and a live submission form to post new reviews.
- **Related Products Carousel**: "Customers who viewed this item also bought" recommendation grid.
- **Quantity Selector, Add to Cart & Buy Now**: Direct integration with cart and checkout.

### 3. 🛒 Dedicated Shopping Cart Page (`/cart`)
- **Full-Width Item Management**: Product thumbnail, title, price, quantity increment/decrement, and deletion.
- **Save for Later**: Move items to wishlist with 1-click.
- **Promotional Coupon Code Engine**: Apply promo codes (`AMAZON20` for 20% off, `PRIME10` for $10 off, `WELCOME50` for $50 off).
- **Free Delivery Progress Indicator**: Visual bar tracking progress toward the $35.00 free shipping threshold.
- **Gift Option**: "This order contains a gift" checkbox.

### 4. 💳 Dedicated Multi-Step Checkout Page (`/checkout`)
- **Step 1 - Shipping Address**: Recipient name, mobile, email, street address, city, state, and postal code.
- **Step 2 - Payment Gateway Selection**:
  - ⚡ *Amazon Pay Balance (1-Click Instant Checkout)*
  - 💳 *Credit or Debit Card (Visa, MasterCard, RuPay)*
  - 📱 *UPI / QR Code (Google Pay, PhonePe, Paytm)*
  - 💵 *Cash on Delivery (COD)*
- **Step 3 - Review Items & Place Order**: Automated computation of subtotal, coupon savings, 8% sales tax, shipping fee, and grand total.

### 5. 🧾 Order Confirmation & Package Tracking (`/orders`)
- **Order Generation**: Unique order identifier (`AMZ-YYYYMMDD...`).
- **Visual Delivery Timeline**: Interactive progress bar (`Ordered` ➔ `Shipped` ➔ `Delivered`).
- **Printable Invoices**: 1-click browser-native printable receipt.
- **Search Past Orders**: Filter orders by keyword or order ID.

### 6. 🔥 Today's Deals Page (`/deals`)
- **Live Countdown Timer**: "Deals end in: 06h : 42m : 18s" timer.
- **Lightning Deals**: Dynamic % claimed progress indicators.
- **Department Filters**: One-click filters for Electronics, Fashion, Home, and Books.

### 7. ⚙️ Seller Central & Admin Portal (`/admin`)
- **Business KPI Metrics**: Live dashboard displaying Total Revenue, Total Orders, Active Catalog Items, and Registered Customers.
- **Catalog Management (CRUD)**: Create new products with custom deal prices, badges, categories, and image URLs with live image preview; edit or delete items in real-time.
- **Customer Order Fulfillment**: Track placed orders and update fulfillment statuses (`Processing` ➔ `Shipped` ➔ `Delivered`).

### 8. 🔐 Authentication & Accounts (`/login`)
- **Secure Authentication**: Customer and Admin login/registration with SHA-256 password hashing.
- **Pre-configured Demo Credentials**:
  - **Admin Manager**: `admin@amazon.com` / `admin123`
  - **Demo Customer**: `bhuvan@amazon.com` / `user123`

---

## 🏗️ Project Architecture & File Structure

```text
c:\e commerce\
├── app.py                     # Main application server & REST APIs (ThreadingHTTPServer)
├── database.py                # Database models, SQLite setup & 26 product seed items
├── ecommerce.db               # SQLite database with 7 relational tables
├── schema.sql                 # SQL schema DDL for documentation & viva
├── requirements.txt           # Dependencies specification
├── run_website.bat            # 1-Click launcher (starts server + opens browser to localhost:5000)
├── push_to_github.bat         # 1-Click Windows batch script to push to GitHub
├── push_to_github.ps1         # 1-Click PowerShell script to push to GitHub
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
│       └── app.js             # Global state controller, live search, cart & auth
└── templates/
    ├── index.html             # Homepage catalog & hero banner
    ├── product.html           # Dedicated product details & reviews page
    ├── cart.html              # Dedicated shopping cart page with coupon engine
    ├── checkout.html          # Dedicated multi-step checkout page
    ├── orders.html            # Dedicated order history & tracking page
    ├── deals.html             # Dedicated Today's Deals & lightning deals page
    ├── admin.html             # Dedicated Amazon Seller Central & Admin Portal
    └── login.html             # Dedicated Amazon Sign In & Account Registration page
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
*(Or simply double-click [`run_website.bat`](run_website.bat))*.

### Step 2: Open in Your Browser
Visit:
```text
http://localhost:5000
```

---

## 📊 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (supports `?category=`, `?search=`, `?sort=`, `?min_price=`, `?max_price=`) |
| `GET` | `/api/products/<id>` | Retrieve single product details, reviews, rating breakdown, and related items |
| `GET` | `/api/search/suggestions` | Instant live search auto-complete endpoint (`?q=...`) |
| `GET` | `/api/deals` | Retrieve products with Deal of the Day and >20% discounts |
| `POST` | `/api/coupon/validate` | Validate coupon code (`AMAZON20`, `PRIME10`, `WELCOME50`) |
| `POST` | `/api/orders` | Submit a new order with discount support |
| `GET` | `/api/orders` | Retrieve order list (supports `?user_id=`) |
| `PATCH` | `/api/orders/<id>/status` | Update fulfillment status (Admin) |
| `POST` | `/api/auth/login` | User login verification |
| `POST` | `/api/auth/register` | Create a new customer account |
| `POST` | `/api/reviews` | Submit product review and rating |
| `GET` | `/api/admin/stats` | Retrieve platform revenue and performance metrics |
| `POST` | `/api/wishlist` | Toggle item in wishlist |

---

## 👨‍💻 Author & Project Credits
- **Project Lead**: Bhuvan Kolisetti
- **Target Repository**: [https://github.com/bhuvankolisetti/e-commerce](https://github.com/bhuvankolisetti/e-commerce)
- **Course**: Final Year Capstone Project (B.Tech / B.E. / BCA / MCA)
- **Year**: 2026
