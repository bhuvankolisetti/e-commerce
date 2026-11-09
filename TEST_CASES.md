# SOFTWARE TEST SPECIFICATION & VIVA TEST CASES

## Project: Amazon Clone Full-Stack E-Commerce Platform
**Author:** Bhuvan Kolisetti  
**Repository:** [https://github.com/bhuvankolisetti/e-commerce](https://github.com/bhuvankolisetti/e-commerce)  

---

## 1. Automated Unit & Integration Tests (`test_app.py`)

Run automated tests anytime using:
```bash
python test_app.py
```

| Test Case ID | Test Function | Target Component | Expected Result | Status |
|---|---|---|---|:---:|
| `TC-AUTO-01` | `test_01_database_tables_exist` | Database Schema | Tables (`users`, `products`, `orders`, `order_items`, `reviews`) exist | **PASS** |
| `TC-AUTO-02` | `test_02_password_hashing` | Security / Auth | Passwords hashed using standard SHA-256 algorithm | **PASS** |
| `TC-AUTO-03` | `test_03_products_catalog_seeded` | Product Engine | Minimum 10 products across 4 departments | **PASS** |
| `TC-AUTO-04` | `test_04_discount_calculation` | Business Logic | Deal Price $\le$ Original MRP; Discount $\ge 0\%$ | **PASS** |
| `TC-AUTO-05` | `test_05_admin_user_exists` | User Roles | Default Administrator profile initialized | **PASS** |
| `TC-AUTO-06` | `test_06_order_and_order_items_creation`| Transaction Engine | Relational linking of orders and line items | **PASS** |

---

## 2. Functional System Test Matrix (Manual Testing Guide)

| Test ID | Module | Scenario / Test Procedure | Test Data | Expected Output | Actual Output | Result |
|---|---|---|---|---|---|:---:|
| `TC-SYS-01` | **Navigation** | Search bar keyword querying | Search "MacBook" | Only matching laptops displayed in grid | Matches displayed | **PASS** |
| `TC-SYS-02` | **Navigation** | Department filter pills | Click "Fashion" | Only clothing, shoes & watches displayed | Filtered correctly | **PASS** |
| `TC-SYS-03` | **Catalog** | Sorting selection | Sort by "Price: High to Low" | Highest priced products appear first | Sorted descending | **PASS** |
| `TC-SYS-04` | **Cart Drawer** | Add to cart from card & modal | Click "Add to Cart" | Cart badge count increments; Drawer slides open | Count updated; Drawer opened | **PASS** |
| `TC-SYS-05` | **Cart Drawer** | Free delivery threshold computation | Order subtotal < $35 vs $\ge$ $35 | Shows remaining amount for FREE shipping or "Qualified!" | Dynamic bar adjusts | **PASS** |
| `TC-SYS-06` | **Cart Drawer** | Quantity modification & deletion | Click `+`, `-`, or "Delete" | Cart recalculates subtotal immediately | Subtotal updated | **PASS** |
| `TC-SYS-07` | **Reviews** | Customer submit review | 5 stars + review comment | Review added and average rating recomputed | Review visible | **PASS** |
| `TC-SYS-08` | **Checkout** | Complete multi-step order flow | Address + Payment option | Order placed; Invoice modal displays Order ID | AMZ-XXXXX generated | **PASS** |
| `TC-SYS-09` | **Auth** | Sign in with demo admin credentials | `admin@amazon.com` / `admin123` | Logged in as Admin; Seller Portal icon unlocked | Seller portal active | **PASS** |
| `TC-SYS-10` | **Seller Portal** | Add new product to store | Title, Category, Price, Image | Product immediately visible in user storefront | Appears in catalog | **PASS** |
| `TC-SYS-11` | **Seller Portal** | Fulfillment status update | Change order from `Processing` to `Shipped` | Status updated in customer "My Orders" modal | Updated live | **PASS** |

---

## 3. Security & Non-Functional Testing

1. **SQL Injection Resistance**: All SQL statements in `app.py` and `database.py` use parameterized queries (`?` placeholders) preventing SQL injection attacks.
2. **Cross-Site Scripting (XSS) Mitigation**: Frontend user input rendering uses HTML entity escaping (`escapeHtml()`) before DOM insertion.
3. **Data Integrity (ACID)**: Relational integrity with Foreign Keys between `orders`, `users`, and `order_items`.

