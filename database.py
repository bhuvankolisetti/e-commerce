"""
Database Module for Amazon Clone E-Commerce Application
Uses Python's built-in sqlite3 - zero external dependencies required!
Author: Bhuvan Kolisetti
Repository: https://github.com/bhuvankolisetti/e-commerce
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
        deal_of_day INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Ensure deal_of_day column exists on existing databases
    try:
        cursor.execute("ALTER TABLE products ADD COLUMN deal_of_day INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE orders ADD COLUMN discount REAL DEFAULT 0")
    except sqlite3.OperationalError:
        pass

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
        discount REAL DEFAULT 0,
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

    # 6. Coupons table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        discount_percent REAL DEFAULT 0,
        discount_flat REAL DEFAULT 0,
        min_amount REAL DEFAULT 0,
        active INTEGER DEFAULT 1
    );
    """)

    # 7. Wishlist table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
    );
    """)

    conn.commit()

    # Seed Default Users if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO users (name, email, password_hash, role, address)
        VALUES 
        ('Admin Manager', 'admin@amazon.com', ?, 'admin', 'Amazon HQ, 410 Terry Ave N, Seattle, WA'),
        ('Bhuvan Kolisetti', 'bhuvan@amazon.com', ?, 'customer', 'Flat 402, Skyline Residency, Tech Park Road, Hyderabad')
        """, (hash_password('admin123'), hash_password('user123')))
        conn.commit()

    # Seed Coupons if empty
    cursor.execute("SELECT COUNT(*) FROM coupons")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO coupons (code, discount_percent, discount_flat, min_amount)
        VALUES 
        ('AMAZON20', 20.0, 0, 50.0),
        ('PRIME10', 0, 10.0, 35.0),
        ('WELCOME50', 0, 50.0, 200.0)
        """)
        conn.commit()

    # Seed Sample Products if empty
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] < 20:
        cursor.execute("DELETE FROM products")
        cursor.execute("DELETE FROM reviews")

        sample_products = [
            # === ELECTRONICS (8 Items) ===
            (
                "Apple MacBook Pro 16\" (M3 Pro, 36GB Unified Memory, 512GB SSD) - Space Black",
                "Electronics",
                2499.00, 2799.00, 11, 4.9, 3420,
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                "The ultimate pro laptop with Apple M3 Pro chip, liquid retina XDR display, up to 22 hours of battery life, and pro connectivity ports.",
                json.dumps(["M3 Pro chip with 12-core CPU", "Liquid Retina XDR display with 1600 nits peak", "Up to 22 hours battery life", "Studio-quality three-mic array"]),
                1, 1, "Best Seller", 1
            ),
            (
                "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Black",
                "Electronics",
                348.00, 399.99, 13, 4.7, 8920,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                "Two processors and 8 microphones for unprecedented noise cancellation. Exceptional sound quality with newly developed 30mm driver unit.",
                json.dumps(["Auto NC Optimizer", "30-hour battery with quick charge", "Crystal clear hands-free calling", "Multipoint device connection"]),
                1, 1, "Amazon's Choice", 1
            ),
            (
                "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB Storage, 12GB RAM)",
                "Electronics",
                1199.99, 1419.99, 15, 4.8, 5120,
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
                "Welcome to the era of mobile AI with Galaxy AI. 200MP camera resolution and AI processing to capture the highest picture quality.",
                json.dumps(["Circle to Search with Google", "Titanium armor frame", "Built-in S Pen stylus", "Snapdragon 8 Gen 3 for Galaxy"]),
                1, 1, "Top Deal", 0
            ),
            (
                "PlayStation 5 Console (Slim) - 1TB SSD with DualSense Wireless Controller",
                "Electronics",
                449.99, 499.99, 10, 4.9, 14200,
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
                "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.",
                json.dumps(["Slim Design with 1TB SSD", "Ray Tracing & 4K-TV Gaming", "Up to 120fps with 120Hz output", "Tempest 3D AudioTech"]),
                1, 1, "Best Seller", 1
            ),
            (
                "Apple Watch Ultra 2 (GPS + Cellular 49mm) Titanium Case with Trail Loop",
                "Electronics",
                749.00, 799.00, 6, 4.8, 1840,
                "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
                "Rugged and capable, built to meet the demands of endurance athletes, outdoor adventurers, and water sport explorers.",
                json.dumps(["Brightest Always-On display at 3000 nits", "Precision dual-frequency GPS", "36 hours of normal battery life", "100m water resistance rating"]),
                1, 1, "Trending", 0
            ),
            (
                "Canon EOS R6 Mark II Mirrorless Camera with 24-105mm f/4L IS USM Lens",
                "Electronics",
                2099.00, 2499.00, 16, 4.8, 920,
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                "High image quality with 24.2 Megapixel Full-Frame CMOS sensor. 6K oversampled uncropped 4K movie at up to 60 fps.",
                json.dumps(["24.2MP full-frame CMOS sensor", "Dual Pixel CMOS AF II", "Up to 40 fps electronic shutter", "In-body image stabilizer with 8 stops"]),
                1, 1, "Top Deal", 0
            ),
            (
                "Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones",
                "Electronics",
                279.00, 329.00, 15, 4.6, 6420,
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
                "Iconic quiet, comfort, and sound. The perfect balance of quiet, comfort, and clear acoustic architecture for all-day listening.",
                json.dumps(["Acoustic Noise Cancelling", "TriPort acoustic architecture", "24 hours battery life", "Aware mode to hear surroundings"]),
                1, 1, "Amazon's Choice", 1
            ),
            (
                "Dell UltraSharp 32\" 4K UHD USB-C Hub Monitor (IPS Black, 98% DCI-P3)",
                "Electronics",
                679.99, 799.99, 15, 4.7, 1430,
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
                "Be your most productive on a 31.5-inch 4K monitor with brilliant color and contrast with groundbreaking IPS Black technology.",
                json.dumps(["31.5-inch 4K UHD (3840 x 2160)", "IPS Black technology with 2000:1 contrast", "Power delivery up to 90W via USB-C", "ComfortView Plus low blue light"]),
                1, 1, "Popular", 0
            ),

            # === FASHION & APPAREL (7 Items) ===
            (
                "Men's Waterproof Windproof Mountain Hooded Softshell Ski Jacket",
                "Fashion",
                69.99, 119.99, 42, 4.5, 2380,
                "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
                "Durable soft shell jacket with warm fleece lining. Highly windproof and water repellent for skiing, hiking, and daily winter commuting.",
                json.dumps(["Waterproof index: 10000mm/H2O", "Warm fleece inner lining", "Adjustable detachable storm hood", "Multiple secure zippered pockets"]),
                1, 1, "Limited Time Deal", 1
            ),
            (
                "Nike Air Max 270 Men's Running & Lifestyle Athletic Sneakers",
                "Fashion",
                129.95, 160.00, 19, 4.6, 6710,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                "The Nike Air Max 270 boasts Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
                json.dumps(["Large Max Air heel unit", "Breathable mesh engineered upper", "Stretchy inner sleeve for snug fit", "Dual-density foam cushioning"]),
                1, 1, "Popular", 0
            ),
            (
                "Fossil Grant Chronograph Genuine Brown Leather Men's Watch",
                "Fashion",
                89.00, 145.00, 39, 4.6, 4120,
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
                "Inspired by vintage clocks, this Grant timepiece has an artistic balance and roman numeral hour markers.",
                json.dumps(["44mm stainless steel case", "Quartz movement with analog chronograph", "Genuine calfskin leather strap", "Water resistant to 50m"]),
                1, 1, "Deal of the Day", 1
            ),
            (
                "Ray-Ban Classic Aviator Polarized Sunglasses (Gold Frame / Green Lens)",
                "Fashion",
                163.00, 213.00, 23, 4.7, 7820,
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
                "The world's most iconic sunglasses. Classic Aviator design engineered for US aviators in 1937 with 100% UV protection.",
                json.dumps(["Polarized crystal green lenses", "Classic lightweight metal frame", "100% UV400 protective coating", "Includes authentic protective leather case"]),
                1, 1, "Best Seller", 0
            ),
            (
                "Levi's Men's 511 Slim Fit Stretch Denim Jeans (Clean Dark Wash)",
                "Fashion",
                49.99, 69.50, 28, 4.5, 12900,
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
                "A modern slim with room to move. The 511 Slim Fit Jeans are a classic since right now with upgraded comfort stretch fabric.",
                json.dumps(["99% Cotton, 1% Elastane", "Zip fly with button closure", "Slim through seat and thigh", "Sits below your waist"]),
                1, 1, "Amazon's Choice", 0
            ),
            (
                "Michael Kors Women's Jet Set Travel Large Saffiano Leather Tote Bag",
                "Fashion",
                119.00, 198.00, 40, 4.6, 3210,
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
                "Crafted from premium Saffiano leather, this Jet Set tote bag is the ultimate carryall for work, travel, and everyday elegance.",
                json.dumps(["100% Saffiano genuine leather", "Gold-tone hardware accents", "Padded center zip compartment for tablets", "Dual top carry handles"]),
                1, 1, "Top Deal", 0
            ),
            (
                "Under Armour Men's Tech 2.0 Short-Sleeve Quick-Dry Gym T-Shirt",
                "Fashion",
                19.99, 25.00, 20, 4.6, 18400,
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
                "UA Tech fabric is quick-drying, ultra-soft & has a more natural feel. Anti-odor technology prevents the growth of odor-causing microbes.",
                json.dumps(["100% Polyester Tech fabric", "Material wicks sweat and dries fast", "Streamlined fit and shaped hem", "Machine washable"]),
                1, 1, "Best Seller", 0
            ),

            # === HOME & KITCHEN (6 Items) ===
            (
                "De'Longhi Magnifica S Automatic Bean-to-Cup Espresso Coffee Machine",
                "Home & Kitchen",
                549.95, 699.95, 21, 4.7, 3890,
                "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
                "Create barista quality freshly ground espresso, cappuccino, and latte at home with intuitive control panel and manual steam wand.",
                json.dumps(["15-bar professional pump pressure", "Integrated burr grinder with 13 settings", "Traditional manual milk frother", "Easy cleaning with removable drip tray"]),
                1, 1, "Amazon's Choice", 1
            ),
            (
                "Ninja AF101 Air Fryer that Crisps, Roasts, Reheats & Dehydrates (4-Quart)",
                "Home & Kitchen",
                89.99, 129.99, 31, 4.8, 19500,
                "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
                "Enjoy guilt-free food: air fry with up to 75% less fat than traditional frying methods. Tested against deep-fried hand-cut fries.",
                json.dumps(["4-quart ceramic-coated basket", "Wide temperature range: 105°F to 400°F", "One-touch control panel", "Dishwasher safe parts"]),
                1, 1, "Best Seller", 1
            ),
            (
                "iRobot Roomba j7+ Self-Emptying Robot Vacuum with Obstacle Avoidance",
                "Home & Kitchen",
                599.00, 799.99, 25, 4.6, 2980,
                "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80",
                "Identifies and avoids pet waste and cords. Empties itself into the Clean Base Automatic Dirt Disposal for up to 60 days.",
                json.dumps(["PrecisionVision navigation", "Clean Base Automatic Dirt Disposal", "10x Power-Lifting Suction", "Smart mapping by room"]),
                1, 1, "Trending", 0
            ),
            (
                "KitchenAid Artisan Series 5-Quart Tilt-Head Stand Mixer - Empire Red",
                "Home & Kitchen",
                379.99, 449.99, 16, 4.9, 11200,
                "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=800&q=80",
                "Make up to 9 dozen cookies in a single batch with the KitchenAid 5 Quart Stand Mixer featuring 10 speeds and 59 touchpoints.",
                json.dumps(["5-quart stainless steel bowl with handle", "10 optimized mixing speeds", "Tilt-back head design for easy bowl access", "Includes flat beater, dough hook, and wire whip"]),
                1, 1, "Best Seller", 0
            ),
            (
                "Philips Sonicare DiamondClean Smart 9500 Rechargeable Electric Toothbrush",
                "Home & Kitchen",
                199.96, 279.96, 29, 4.7, 5420,
                "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
                "Complete oral care solution with smart sensors providing real-time feedback via the smartphone app to improve brushing technique.",
                json.dumps(["Removes up to 10x more plaque than manual", "5 brushing modes and 3 intensity levels", "Smart brush head recognition", "Premium USB charging travel case included"]),
                1, 1, "Deal of the Day", 0
            ),
            (
                "Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker (6-Quart)",
                "Home & Kitchen",
                79.95, 99.95, 20, 4.7, 34100,
                "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80",
                "Combines 7 kitchen appliances in 1: Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and food warmer.",
                json.dumps(["13 customizable one-touch smart programs", "Fingerprint-resistant stainless steel sides", "Over 10 proven safety mechanisms", "Cooks up to 70% faster"]),
                1, 1, "Amazon's Choice", 0
            ),

            # === BOOKS & STUDY (5 Items) ===
            (
                "Designing Data-Intensive Applications: The Big Ideas Behind Reliable Systems",
                "Books",
                34.99, 49.99, 30, 4.9, 7850,
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
                "The definitive guide to architecture of data systems, scalability, consistency, reliability, and maintainability by Martin Kleppmann.",
                json.dumps(["Core principles of distributed data systems", "Transactions, replication, and partitioning", "Batch and stream processing", "Peer-reviewed industry standard"]),
                1, 1, "Best Seller", 1
            ),
            (
                "Cracking the Coding Interview: 189 Programming Questions and Solutions",
                "Books",
                28.50, 39.95, 29, 4.8, 12400,
                "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
                "Learn how to uncover the hints and hidden details in questions, discover how to break problems down into manageable chunks.",
                json.dumps(["189 programming interview questions", "Big O and algorithm design strategies", "Behind the scenes at Google, Apple & Microsoft", "Soft skills & interview etiquette"]),
                1, 1, "Amazon's Choice", 0
            ),
            (
                "Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin",
                "Books",
                37.99, 54.99, 31, 4.7, 9820,
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
                "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Master software craftsmanship.",
                json.dumps(["Principles, patterns, and practices of writing clean code", "How to write good tests and refactor legacy code", "Meaningful naming and formatting standards", "Real-world case studies"]),
                1, 1, "Popular", 0
            ),
            (
                "Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear",
                "Books",
                14.99, 27.00, 44, 4.9, 48200,
                "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
                "No matter your goals, Atomic Habits offers a proven framework for improving every day from world-renowned habit formation expert James Clear.",
                json.dumps(["Over 15 million copies sold worldwide", "The Four Laws of Behavior Change", "Practical strategies to overcome lack of motivation", "Design your environment for success"]),
                1, 1, "Best Seller", 1
            ),
            (
                "Python Crash Course: A Hands-On, Project-Based Introduction to Programming",
                "Books",
                24.50, 39.95, 39, 4.8, 6310,
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                "The world's bestselling programming book. A fast-paced, thorough introduction to Python that will have you writing code in no time.",
                json.dumps(["Updated for modern Python 3", "Build 2D arcade games with Pygame", "Data visualization with Matplotlib and Plotly", "Deploy real web applications"]),
                1, 1, "Top Deal", 0
            )
        ]

        cursor.executemany("""
        INSERT INTO products 
        (title, category, price, original_price, discount_pct, rating, rating_count, image_url, description, features, in_stock, prime_eligible, badge, deal_of_day)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_products)
        conn.commit()

        # Seed realistic reviews
        cursor.execute("""
        INSERT INTO reviews (product_id, user_name, rating, comment)
        VALUES 
        (1, 'Alex M. (Verified Purchase)', 5.0, 'Incredible laptop! The battery life easily lasts two full workdays. Display is breathtaking and Xcode compiles in seconds.'),
        (1, 'Sarah Chen', 4.5, 'Blazing fast for compilation and 4K video rendering. Worth every penny for software engineers and creators.'),
        (2, 'David R.', 5.0, 'Best noise cancellation on the market. Extremely lightweight and comfortable for long transcontinental flights.'),
        (3, 'Michael B.', 5.0, 'Galaxy AI circle to search is a gamechanger. Camera zoom clarity is unbelievable at 100x.'),
        (4, 'Jason K.', 5.0, 'Spider-Man 2 running at 60fps with Ray Tracing is sublime. DualSense haptics are second to none.'),
        (9, 'Emily Watson', 5.0, 'Real barista quality espresso at home! Grinds fresh beans and produces perfect crema every morning.')
        """)
        conn.commit()

    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database re-initialized and seeded with 26 products across 4 departments!")
