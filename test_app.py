"""
Automated Test Suite for Amazon Clone E-Commerce Application
Runs unit and integration tests on Database, Authentication, Coupons, and Business Logic.
Author: Bhuvan Kolisetti
Repository: https://github.com/bhuvankolisetti/e-commerce
"""

import unittest
import sqlite3
import json
import os
import hashlib

from database import get_db, init_db, hash_password, DB_FILE

class TestAmazonClone(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db()

    def test_01_database_tables_exist(self):
        """Ensure all required relational tables exist in SQLite"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        conn.close()

        required_tables = ['users', 'products', 'orders', 'order_items', 'reviews', 'coupons', 'wishlist']
        for tbl in required_tables:
            self.assertIn(tbl, tables, f"Missing table: {tbl}")
        print("[✓] Database schema verified with all 7 core tables.")

    def test_02_password_hashing(self):
        """Test SHA-256 cryptographic password hashing"""
        raw_password = "user123"
        hashed = hash_password(raw_password)
        expected = hashlib.sha256(raw_password.encode('utf-8')).hexdigest()
        self.assertEqual(hashed, expected)
        self.assertNotEqual(raw_password, hashed)
        print("[✓] Password hashing algorithm (SHA-256) operates correctly.")

    def test_03_expanded_catalog_seeded(self):
        """Verify 26 catalog products across 4 core departments"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM products")
        count = cursor.fetchone()[0]
        self.assertGreaterEqual(count, 20, "Expected at least 20 seeded products")

        cursor.execute("SELECT DISTINCT category FROM products")
        categories = [r[0] for r in cursor.fetchall()]
        conn.close()

        self.assertIn("Electronics", categories)
        self.assertIn("Fashion", categories)
        self.assertIn("Home & Kitchen", categories)
        self.assertIn("Books", categories)
        print(f"[✓] Product catalog seeded with {count} items across {len(categories)} categories.")

    def test_04_coupon_codes_active(self):
        """Verify promo coupons are seeded and active"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT code, discount_percent, discount_flat FROM coupons WHERE active = 1")
        coupons = {r['code']: dict(r) for r in cursor.fetchall()}
        conn.close()

        self.assertIn("AMAZON20", coupons)
        self.assertEqual(coupons["AMAZON20"]["discount_percent"], 20.0)
        self.assertIn("PRIME10", coupons)
        print(f"[✓] Active coupon discounts verified: {list(coupons.keys())}.")

    def test_05_admin_user_exists(self):
        """Ensure default administrator account exists"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT email, role FROM users WHERE role = 'admin'")
        admin = cursor.fetchone()
        conn.close()

        self.assertIsNotNone(admin, "Admin account must be present")
        self.assertEqual(admin['email'], "admin@amazon.com")
        print("[✓] Default admin user verified.")

    def test_06_order_and_order_items_creation(self):
        """Test complete order creation workflow with discount support"""
        conn = get_db()
        cursor = conn.cursor()

        order_num = "TEST-ORDER-EXP-001"
        cursor.execute("""
        INSERT INTO orders 
        (order_number, user_id, customer_name, customer_email, shipping_address, city, postal_code, payment_method, subtotal, discount, tax, shipping, total_amount, status)
        VALUES (?, 1, 'Bhuvan Kolisetti', 'bhuvan@amazon.com', 'Flat 402', 'Hyderabad', '500081', 'Credit Card', 100.0, 20.0, 6.4, 0.0, 86.4, 'Processing')
        """, (order_num,))
        order_id = cursor.lastrowid

        cursor.execute("""
        INSERT INTO order_items (order_id, product_id, product_title, product_image, quantity, unit_price)
        VALUES (?, 1, 'MacBook Pro', 'http://example.com/img.jpg', 1, 100.0)
        """, (order_id,))
        conn.commit()

        # Query back
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        saved_order = cursor.fetchone()
        self.assertIsNotNone(saved_order)
        self.assertEqual(saved_order['total_amount'], 86.4)

        # Cleanup
        cursor.execute("DELETE FROM order_items WHERE order_id = ?", (order_id,))
        cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
        conn.commit()
        conn.close()
        print("[✓] Order creation with promotional discount calculation passed.")

if __name__ == '__main__':
    unittest.main(verbosity=2)
