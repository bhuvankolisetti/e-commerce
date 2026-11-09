"""
Amazon Clone E-Commerce Application Backend
Built with Python standard library (zero external dependencies)
Provides high-performance REST APIs and serves responsive frontend views.
Author: Bhuvan Kolisetti
Repository: https://github.com/bhuvankolisetti/e-commerce
"""

import os
import sys
import json
import sqlite3
import mimetypes
import urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from datetime import datetime

# Import database module
from database import get_db, init_db, hash_password

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
PORT = 5000

class AmazonRequestHandler(BaseHTTPRequestHandler):

    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def _read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            body = self.rfile.read(content_length).decode('utf-8')
            return json.loads(body)
        return {}

    def _send_json(self, data, status=200):
        self._set_headers(status, 'application/json')
        self.wfile.write(json.dumps(data, default=str).encode('utf-8'))

    def _send_error_json(self, message, status=400):
        self._send_json({'error': message, 'success': False}, status)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # 1. Root & HTML Views
        if path == '/' or path == '/index.html':
            index_path = os.path.join(TEMPLATES_DIR, 'index.html')
            if os.path.exists(index_path):
                self._set_headers(200, 'text/html; charset=utf-8')
                with open(index_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "index.html template not found")
            return

        # 2. Static Assets (/static/...)
        if path.startswith('/static/'):
            relative_path = path[len('/static/'):].replace('/', os.sep)
            file_path = os.path.join(STATIC_DIR, relative_path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                mime_type, _ = mimetypes.guess_type(file_path)
                self._set_headers(200, mime_type or 'application/octet-stream')
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, f"File {path} not found")
                return

        # 3. REST API - Products List
        if path == '/api/products':
            category = query.get('category', [None])[0]
            search = query.get('search', [None])[0]
            sort_by = query.get('sort', ['featured'])[0]

            conn = get_db()
            cursor = conn.cursor()

            sql = "SELECT * FROM products WHERE 1=1"
            params = []

            if category and category.lower() != 'all':
                sql += " AND LOWER(category) = LOWER(?)"
                params.append(category)

            if search:
                sql += " AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))"
                search_term = f"%{search}%"
                params.extend([search_term, search_term])

            if sort_by == 'price_low':
                sql += " ORDER BY price ASC"
            elif sort_by == 'price_high':
                sql += " ORDER BY price DESC"
            elif sort_by == 'rating':
                sql += " ORDER BY rating DESC"
            elif sort_by == 'discount':
                sql += " ORDER BY discount_pct DESC"
            else:
                sql += " ORDER BY id ASC"

            cursor.execute(sql, params)
            rows = cursor.fetchall()

            products = []
            for row in rows:
                p = dict(row)
                if p.get('features'):
                    try:
                        p['features'] = json.loads(p['features'])
                    except Exception:
                        p['features'] = []
                products.append(p)

            conn.close()
            self._send_json({'success': True, 'count': len(products), 'products': products})
            return

        # 4. REST API - Single Product Details
        if path.startswith('/api/products/'):
            product_id = path.split('/')[-1]
            if product_id.isdigit():
                conn = get_db()
                cursor = conn.cursor()

                cursor.execute("SELECT * FROM products WHERE id = ?", (int(product_id),))
                product = cursor.fetchone()
                if not product:
                    conn.close()
                    self._send_error_json("Product not found", 404)
                    return

                p = dict(product)
                if p.get('features'):
                    try:
                        p['features'] = json.loads(p['features'])
                    except Exception:
                        p['features'] = []

                # Fetch reviews
                cursor.execute("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC", (int(product_id),))
                reviews = [dict(r) for r in cursor.fetchall()]

                # Fetch related products
                cursor.execute("SELECT id, title, price, original_price, image_url, rating FROM products WHERE category = ? AND id != ? LIMIT 4", 
                               (p['category'], int(product_id)))
                related = [dict(r) for r in cursor.fetchall()]

                conn.close()
                self._send_json({'success': True, 'product': p, 'reviews': reviews, 'related': related})
                return

        # 5. REST API - Get Orders
        if path == '/api/orders':
            user_id = query.get('user_id', [None])[0]
            conn = get_db()
            cursor = conn.cursor()

            if user_id and user_id.isdigit():
                cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", (int(user_id),))
            else:
                cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")

            orders = [dict(o) for o in cursor.fetchall()]

            # Attach items for each order
            for o in orders:
                cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (o['id'],))
                o['items'] = [dict(it) for it in cursor.fetchall()]

            conn.close()
            self._send_json({'success': True, 'orders': orders})
            return

        # 6. REST API - Categories list
        if path == '/api/categories':
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT category, COUNT(*) as count FROM products GROUP BY category")
            categories = [dict(c) for c in cursor.fetchall()]
            conn.close()
            self._send_json({'success': True, 'categories': categories})
            return

        # 7. REST API - Admin Stats
        if path == '/api/admin/stats':
            conn = get_db()
            cursor = conn.cursor()

            cursor.execute("SELECT COUNT(*), COALESCE(SUM(total_amount), 0) FROM orders")
            total_orders, total_revenue = cursor.fetchone()

            cursor.execute("SELECT COUNT(*) FROM products")
            total_products = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'customer'")
            total_users = cursor.fetchone()[0]

            cursor.execute("SELECT category, COUNT(*) as count FROM products GROUP BY category")
            category_counts = [dict(c) for c in cursor.fetchall()]

            cursor.execute("SELECT status, COUNT(*) as count FROM orders GROUP BY status")
            order_statuses = [dict(s) for s in cursor.fetchall()]

            conn.close()
            self._send_json({
                'success': True,
                'stats': {
                    'total_revenue': round(total_revenue, 2),
                    'total_orders': total_orders,
                    'total_products': total_products,
                    'total_users': total_users,
                    'category_counts': category_counts,
                    'order_statuses': order_statuses
                }
            })
            return

        self._send_error_json("Endpoint not found", 404)

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        body = self._read_json_body()

        # 1. Auth - Register
        if path == '/api/auth/register':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            address = body.get('address', '')

            if not name or not email or not password:
                self._send_error_json("Please provide name, email, and password", 400)
                return

            conn = get_db()
            cursor = conn.cursor()
            try:
                cursor.execute("""
                INSERT INTO users (name, email, password_hash, role, address)
                VALUES (?, ?, ?, 'customer', ?)
                """, (name, email, hash_password(password), address))
                conn.commit()
                user_id = cursor.lastrowid
                conn.close()
                self._send_json({
                    'success': True,
                    'message': 'Account created successfully!',
                    'user': {'id': user_id, 'name': name, 'email': email, 'role': 'customer', 'address': address}
                })
            except sqlite3.IntegrityError:
                conn.close()
                self._send_error_json("An account with this email already exists", 409)
            return

        # 2. Auth - Login
        if path == '/api/auth/login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')

            if not email or not password:
                self._send_error_json("Please provide email and password", 400)
                return

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email, password_hash, role, address FROM users WHERE LOWER(email) = ?", (email,))
            user = cursor.fetchone()
            conn.close()

            if user and user['password_hash'] == hash_password(password):
                user_dict = dict(user)
                del user_dict['password_hash']
                self._send_json({'success': True, 'message': 'Login successful!', 'user': user_dict})
            else:
                self._send_error_json("Invalid email or password", 401)
            return

        # 3. Create Order
        if path == '/api/orders':
            user_id = body.get('user_id')
            customer_name = body.get('customer_name', '').strip()
            customer_email = body.get('customer_email', '').strip()
            shipping_address = body.get('shipping_address', '').strip()
            city = body.get('city', '').strip()
            postal_code = body.get('postal_code', '').strip()
            payment_method = body.get('payment_method', 'Credit Card')
            items = body.get('items', [])

            if not customer_name or not customer_email or not shipping_address or not items:
                self._send_error_json("Missing required order information or items", 400)
                return

            subtotal = sum(item.get('price', 0) * item.get('quantity', 1) for item in items)
            tax = round(subtotal * 0.08, 2)
            shipping = 0.00 if subtotal >= 35.00 else 5.99  # Amazon-style free delivery over $35
            total_amount = round(subtotal + tax + shipping, 2)

            order_number = f"AMZ-{datetime.now().strftime('%Y%m%d%H%M%S')}-{int(datetime.now().timestamp() % 1000)}"

            conn = get_db()
            cursor = conn.cursor()

            cursor.execute("""
            INSERT INTO orders 
            (order_number, user_id, customer_name, customer_email, shipping_address, city, postal_code, payment_method, subtotal, tax, shipping, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing')
            """, (order_number, user_id, customer_name, customer_email, shipping_address, city, postal_code, payment_method, subtotal, tax, shipping, total_amount))

            order_id = cursor.lastrowid

            for item in items:
                cursor.execute("""
                INSERT INTO order_items (order_id, product_id, product_title, product_image, quantity, unit_price)
                VALUES (?, ?, ?, ?, ?, ?)
                """, (order_id, item.get('id', 0), item.get('title', 'Product'), item.get('image_url', ''), item.get('quantity', 1), item.get('price', 0)))

            conn.commit()
            conn.close()

            self._send_json({
                'success': True,
                'message': 'Order placed successfully!',
                'order': {
                    'id': order_id,
                    'order_number': order_number,
                    'subtotal': subtotal,
                    'tax': tax,
                    'shipping': shipping,
                    'total_amount': total_amount,
                    'payment_method': payment_method,
                    'status': 'Processing',
                    'created_at': datetime.now().isoformat()
                }
            })
            return

        # 4. Admin - Add Product
        if path == '/api/admin/products':
            title = body.get('title', '').strip()
            category = body.get('category', 'Electronics')
            price = float(body.get('price', 0))
            original_price = float(body.get('original_price', price))
            discount_pct = int(body.get('discount_pct', round((1 - price/original_price)*100) if original_price > price else 0))
            image_url = body.get('image_url', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800')
            description = body.get('description', '')
            badge = body.get('badge', '')
            features = body.get('features', [])

            if not title or price <= 0:
                self._send_error_json("Product title and valid price are required", 400)
                return

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO products 
            (title, category, price, original_price, discount_pct, rating, rating_count, image_url, description, features, in_stock, prime_eligible, badge)
            VALUES (?, ?, ?, ?, ?, 4.8, 1, ?, ?, ?, 1, 1, ?)
            """, (title, category, price, original_price, discount_pct, image_url, description, json.dumps(features), badge))
            conn.commit()
            new_id = cursor.lastrowid
            conn.close()

            self._send_json({'success': True, 'message': 'Product created successfully', 'product_id': new_id})
            return

        # 5. Add Review
        if path == '/api/reviews':
            product_id = body.get('product_id')
            user_name = body.get('user_name', 'Verified Customer')
            rating = float(body.get('rating', 5.0))
            comment = body.get('comment', '').strip()

            if not product_id or not comment:
                self._send_error_json("Product ID and comment are required", 400)
                return

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO reviews (product_id, user_name, rating, comment)
            VALUES (?, ?, ?, ?)
            """, (product_id, user_name, rating, comment))

            # Update product rating and count
            cursor.execute("""
            UPDATE products 
            SET rating_count = rating_count + 1,
                rating = ROUND((rating * rating_count + ?) / (rating_count + 1), 1)
            WHERE id = ?
            """, (rating, product_id))

            conn.commit()
            conn.close()

            self._send_json({'success': True, 'message': 'Review added successfully!'})
            return

        self._send_error_json("Endpoint not found", 404)

    def do_PUT(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        body = self._read_json_body()

        # Admin - Update Product
        if path.startswith('/api/admin/products/'):
            product_id = path.split('/')[-1]
            if product_id.isdigit():
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE products 
                SET title = ?, category = ?, price = ?, original_price = ?, discount_pct = ?, image_url = ?, description = ?, in_stock = ?, badge = ?
                WHERE id = ?
                """, (
                    body.get('title'),
                    body.get('category'),
                    float(body.get('price', 0)),
                    float(body.get('original_price', 0)),
                    int(body.get('discount_pct', 0)),
                    body.get('image_url'),
                    body.get('description'),
                    int(body.get('in_stock', 1)),
                    body.get('badge', ''),
                    int(product_id)
                ))
                conn.commit()
                conn.close()
                self._send_json({'success': True, 'message': 'Product updated successfully!'})
                return

        self._send_error_json("Endpoint not found", 404)

    def do_PATCH(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        body = self._read_json_body()

        # Admin - Update Order Status
        if path.startswith('/api/orders/') and path.endswith('/status'):
            parts = path.split('/')
            order_id = parts[3]
            new_status = body.get('status', 'Shipped')

            if order_id.isdigit():
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (new_status, int(order_id)))
                conn.commit()
                conn.close()
                self._send_json({'success': True, 'message': f'Order status updated to {new_status}'})
                return

        self._send_error_json("Endpoint not found", 404)

    def do_DELETE(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        # Admin - Delete Product
        if path.startswith('/api/admin/products/'):
            product_id = path.split('/')[-1]
            if product_id.isdigit():
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute("DELETE FROM products WHERE id = ?", (int(product_id),))
                cursor.execute("DELETE FROM reviews WHERE product_id = ?", (int(product_id),))
                conn.commit()
                conn.close()
                self._send_json({'success': True, 'message': 'Product deleted successfully!'})
                return

        self._send_error_json("Endpoint not found", 404)

def run():
    init_db()
    server_address = ('', PORT)
    httpd = ThreadingHTTPServer(server_address, AmazonRequestHandler)
    print("=" * 60)
    print(" 🚀 Amazon Clone E-Commerce Server Running!")
    print(f" 🌐 Local URL: http://localhost:{PORT}")
    print(f" 👨‍💻 Author: Bhuvan Kolisetti")
    print(" 📦 Database: SQLite (ecommerce.db)")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully...")
        httpd.server_close()

if __name__ == '__main__':
    run()
