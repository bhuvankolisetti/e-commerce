"""
Database Module for Amazon Clone E-Commerce Application
Uses Python's built-in sqlite3 - zero external dependencies required!
"""

import sqlite3
import hashlib
import os
import json
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ecommerce.db')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Products table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        original_price REAL NOT NULL,
        discount_pct INTEGER NOT NULL,
        rating REAL DEFAULT 4.5,
        rating_count INTEGER DEFAULT 120,
        image_url TEXT NOT NULL,
        description TEXT NOT NULL,
        features TEXT,
        in_stock INTEGER DEFAULT 1,
        prime_eligible INTEGER DEFAULT 1,
        badge TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. Orders table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        city TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        subtotal REAL NOT NULL,
        tax REAL NOT NULL,
        shipping REAL NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'Processing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """)

    # 4. Order items table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_title TEXT NOT NULL,
        product_image TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
    );
    """)

    # 5. Reviews table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        rating REAL NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
    """)

    conn.commit()

    # Seed Default Admin & Demo User
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO users (name, email, password_hash, role, address)
        VALUES 
        ('Admin Manager', 'admin@amazon.com', ?, 'admin', 'Amazon HQ, 410 Terry Ave N, Seattle, WA'),
        ('Bhuvan Kolisetti', 'bhuvan@amazon.com', ?, 'customer', 'Flat 402, Skyline Residency, Tech Park Road')
        """, (hash_password('admin123'), hash_password('user123')))
        conn.commit()

    # Seed Sample Products if empty
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        sample_products = [
            # Electronics
            (
                "Apple MacBook Pro 16\" (M3 Pro, 36GB Unified Memory, 512GB SSD) - Space Black",
                "Electronics",
                2499.00,
                2799.00,
                11,
                4.9,
                3420,
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                "The ultimate pro laptop with Apple M3 Pro chip, liquid retina XDR display, up to 22 hours of battery life, and pro connectivity ports.",
                json.dumps(["M3 Pro chip with 12-core CPU", "Liquid Retina XDR display", "Up to 22 hours battery", "Studio-quality three-mic array"]),
                1, 1, "Best Seller"
            ),
            (
                "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones",
                "Electronics",
                348.00,
                399.99,
                13,
                4.7,
                8920,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                "Two processors and 8 microphones for unprecedented noise cancellation. Exceptional sound quality with newly developed 30mm driver unit.",
                json.dumps(["Auto NC Optimizer", "30-hour battery with quick charge", "Crystal clear hands-free calling", "Multipoint connection"]),
                1, 1, "Amazon's Choice"
            ),
            (
                "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB Storage, 12GB RAM)",
                "Electronics",
                1199.99,
                1419.99,
                15,
                4.8,
                5120,
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
                "Welcome to the era of mobile AI with Galaxy AI. 200MP camera resolution and AI processing to capture the highest picture quality.",
                json.dumps(["Circle to Search with Google", "Titanium armor frame", "Built-in S Pen", "Snapdragon 8 Gen 3 for Galaxy"]),
                1, 1, "Top Deal"
            ),
            (
                "PlayStation 5 Console (Slim) - 1TB SSD with DualSense Controller",
                "Electronics",
                449.99,
                499.99,
                10,
                4.9,
                14200,
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
                "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.",
                json.dumps(["Slim Design with 1TB SSD", "Ray Tracing & 4K-TV Gaming", "Up to 120fps with 120Hz output", "Tempest 3D AudioTech"]),
                1, 1, "Best Seller"
            ),
            (
                "Apple Watch Ultra 2 (GPS + Cellular 49mm) Titanium Case with Trail Loop",
                "Electronics",
                749.00,
                799.00,
                6,
                4.8,
                1840,
                "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
                "Rugged and capable, built to meet the demands of endurance athletes, outdoor adventurers, and water sport explorers.",
                json.dumps(["Brightest Always-On display at 3000 nits", "Precision dual-frequency GPS", "36 hours of normal battery life", "100m water resistance"]),
                1, 1, "Trending"
            ),

            # Fashion & Apparel
            (
                "Men's Waterproof Windproof Mountain Hooded Softshell Ski Jacket",
                "Fashion",
                69.99,
                119.99,
                42,
                4.5,
                2380,
                "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
                "Durable soft shell jacket with warm fleece lining. Highly windproof and water repellent for skiing, hiking, and daily winter commuting.",
                json.dumps(["Waterproof index: 10000mm/H2O", "Fleece inner lining", "Adjustable detachable storm hood", "Multiple secure zippered pockets"]),
                1, 1, "Limited Time Deal"
            ),
            (
                "Nike Air Max 270 Men's Running & Lifestyle Athletic Sneakers",
                "Fashion",
                129.95,
                160.00,
                19,
                4.6,
                6710,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                "The Nike Air Max 270 boasts Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
                json.dumps(["Large Max Air heel unit", "Breathable mesh engineered upper", "Stretchy inner sleeve for snug fit", "Dual-density foam cushioning"]),
                1, 1, "Popular"
            ),
            (
                "Fossil Grant Chronograph Genuine Brown Leather Men's Watch",
                "Fashion",
                89.00,
                145.00,
                39,
                4.6,
                4120,
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
                "Inspired by the vintage clock designs, this Grant timepiece has an artistic balance and roman numeral hour markers.",
                json.dumps(["44mm stainless steel case", "Quartz movement with analog chronograph", "Genuine calfskin leather strap", "Water resistant to 50m"]),
                1, 1, "Deal of the Day"
            ),

            # Home & Kitchen
            (
                "De'Longhi Magnifica S Automatic Bean-to-Cup Espresso Coffee Machine",
                "Home & Kitchen",
                549.95,
                699.95,
                21,
                4.7,
                3890,
                "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
                "Create barista quality freshly ground espresso, cappuccino, and latte at home with intuitive control panel and manual steam wand.",
                json.dumps(["15-bar professional pump pressure", "Integrated burr grinder with 13 settings", "Traditional manual milk frother", "Easy cleaning with removable drip tray"]),
                1, 1, "Amazon's Choice"
            ),
            (
                "Ninja AF101 Air Fryer that Crisps, Roasts, Reheats & Dehydrates (4-Quart)",
                "Home & Kitchen",
                89.99,
                129.99,
                31,
                4.8,
                19500,
                "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
                "Enjoy guilt-free food: air fry with up to 75% less fat than traditional frying methods. Tested against deep-fried hand-cut fries.",
                json.dumps(["4-quart ceramic-coated basket", "Wide temperature range: 105°F to 400°F", "One-touch control panel", "Dishwasher safe parts"]),
                1, 1, "Best Seller"
            ),
            (
                "iRobot Roomba j7+ Self-Emptying Robot Vacuum with Obstacle Avoidance",
                "Home & Kitchen",
                599.00,
                799.99,
                25,
                4.6,
                2980,
                "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80",
                "Identifies and avoids pet waste and cords. Empties itself into the Clean Base Automatic Dirt Disposal for up to 60 days.",
                json.dumps(["PrecisionVision navigation", "Clean Base Automatic Dirt Disposal", "10x Power-Lifting Suction", "Smart mapping by room"]),
                1, 1, "Trending"
            ),

            # Books & Study
            (
                "Designing Data-Intensive Applications: The Big Ideas Behind Reliable Systems",
                "Books",
                34.99,
                49.99,
                30,
                4.9,
                7850,
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
                "The definitive guide to architecture of data systems, scalability, consistency, reliability, and maintainability by Martin Kleppmann.",
                json.dumps(["Core principles of distributed data systems", "Transactions, replication, and partitioning", "Batch and stream processing", "Peer-reviewed industry standard"]),
                1, 1, "Best Seller"
            ),
            (
                "Cracking the Coding Interview: 189 Programming Questions and Solutions",
                "Books",
                28.50,
                39.95,
                29,
                4.8,
                12400,
                "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
                "Learn how to uncover the hints and hidden details in questions, discover how to break problems down into manageable chunks.",
                json.dumps(["189 programming interview questions", "Big O and algorithm design strategies", "Behind the scenes at Google, Apple & Microsoft", "Soft skills & interview etiquette"]),
                1, 1, "Amazon's Choice"
            )
        ]

        cursor.executemany("""
        INSERT INTO products 
        (title, category, price, original_price, discount_pct, rating, rating_count, image_url, description, features, in_stock, prime_eligible, badge)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_products)
        conn.commit()

        # Seed sample reviews for the first product
        cursor.execute("""
        INSERT INTO reviews (product_id, user_name, rating, comment)
        VALUES 
        (1, 'Alex M.', 5.0, 'Incredible laptop! The battery life easily lasts two full workdays. Display is breathtaking.'),
        (1, 'Sarah Chen', 4.5, 'Blazing fast for compilation and video rendering. Worth every penny for engineers.'),
        (2, 'David R.', 5.0, 'Best noise cancellation on the market. Extremely lightweight and comfortable for long flights.')
        """)
        conn.commit()

    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully at:", DB_FILE)
