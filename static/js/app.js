/**
 * Amazon Clone Main Frontend Application & Global Shared Logic
 * Dual-Mode: Works seamlessly with Python Backend OR as a fully autonomous
 * static web application on GitHub Pages using in-browser persistence (localStorage).
 * Author: Bhuvan Kolisetti
 * Repository: https://github.com/bhuvankolisetti/e-commerce
 */

// Embedded Fallback Catalog for GitHub Pages (26 Products across 4 departments)
const STATIC_CATALOG = [
  // Electronics
  {
    id: 1,
    title: "Apple MacBook Pro 16\" (M3 Pro, 36GB Unified Memory, 512GB SSD) - Space Black",
    category: "Electronics",
    price: 2499.00,
    original_price: 2799.00,
    discount_pct: 11,
    rating: 4.9,
    rating_count: 3420,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    description: "The ultimate pro laptop with Apple M3 Pro chip, liquid retina XDR display, up to 22 hours of battery life, and pro connectivity ports.",
    features: ["M3 Pro chip with 12-core CPU", "Liquid Retina XDR display with 1600 nits peak", "Up to 22 hours battery life", "Studio-quality three-mic array"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 1
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Black",
    category: "Electronics",
    price: 348.00,
    original_price: 399.99,
    discount_pct: 13,
    rating: 4.7,
    rating_count: 8920,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Two processors and 8 microphones for unprecedented noise cancellation. Exceptional sound quality with newly developed 30mm driver unit.",
    features: ["Auto NC Optimizer", "30-hour battery with quick charge", "Crystal clear hands-free calling", "Multipoint device connection"],
    in_stock: 1, prime_eligible: 1, badge: "Amazon's Choice", deal_of_day: 1
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB Storage, 12GB RAM)",
    category: "Electronics",
    price: 1199.99,
    original_price: 1419.99,
    discount_pct: 15,
    rating: 4.8,
    rating_count: 5120,
    image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    description: "Welcome to the era of mobile AI with Galaxy AI. 200MP camera resolution and AI processing to capture the highest picture quality.",
    features: ["Circle to Search with Google", "Titanium armor frame", "Built-in S Pen stylus", "Snapdragon 8 Gen 3 for Galaxy"],
    in_stock: 1, prime_eligible: 1, badge: "Top Deal", deal_of_day: 0
  },
  {
    id: 4,
    title: "PlayStation 5 Console (Slim) - 1TB SSD with DualSense Wireless Controller",
    category: "Electronics",
    price: 449.99,
    original_price: 499.99,
    discount_pct: 10,
    rating: 4.9,
    rating_count: 14200,
    image_url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.",
    features: ["Slim Design with 1TB SSD", "Ray Tracing & 4K-TV Gaming", "Up to 120fps with 120Hz output", "Tempest 3D AudioTech"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 1
  },
  {
    id: 5,
    title: "Apple Watch Ultra 2 (GPS + Cellular 49mm) Titanium Case with Trail Loop",
    category: "Electronics",
    price: 749.00,
    original_price: 799.00,
    discount_pct: 6,
    rating: 4.8,
    rating_count: 1840,
    image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    description: "Rugged and capable, built to meet the demands of endurance athletes, outdoor adventurers, and water sport explorers.",
    features: ["Brightest Always-On display at 3000 nits", "Precision dual-frequency GPS", "36 hours of normal battery life", "100m water resistance rating"],
    in_stock: 1, prime_eligible: 1, badge: "Trending", deal_of_day: 0
  },
  {
    id: 6,
    title: "Canon EOS R6 Mark II Mirrorless Camera with 24-105mm f/4L IS USM Lens",
    category: "Electronics",
    price: 2099.00,
    original_price: 2499.00,
    discount_pct: 16,
    rating: 4.8,
    rating_count: 920,
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "High image quality with 24.2 Megapixel Full-Frame CMOS sensor. 6K oversampled uncropped 4K movie at up to 60 fps.",
    features: ["24.2MP full-frame CMOS sensor", "Dual Pixel CMOS AF II", "Up to 40 fps electronic shutter", "In-body image stabilizer with 8 stops"],
    in_stock: 1, prime_eligible: 1, badge: "Top Deal", deal_of_day: 0
  },
  {
    id: 7,
    title: "Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones",
    category: "Electronics",
    price: 279.00,
    original_price: 329.00,
    discount_pct: 15,
    rating: 4.6,
    rating_count: 6420,
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    description: "Iconic quiet, comfort, and sound. The perfect balance of quiet, comfort, and clear acoustic architecture for all-day listening.",
    features: ["Acoustic Noise Cancelling", "TriPort acoustic architecture", "24 hours battery life", "Aware mode to hear surroundings"],
    in_stock: 1, prime_eligible: 1, badge: "Amazon's Choice", deal_of_day: 1
  },
  {
    id: 8,
    title: "Dell UltraSharp 32\" 4K UHD USB-C Hub Monitor (IPS Black, 98% DCI-P3)",
    category: "Electronics",
    price: 679.99,
    original_price: 799.99,
    discount_pct: 15,
    rating: 4.7,
    rating_count: 1430,
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    description: "Be your most productive on a 31.5-inch 4K monitor with brilliant color and contrast with groundbreaking IPS Black technology.",
    features: ["31.5-inch 4K UHD (3840 x 2160)", "IPS Black technology with 2000:1 contrast", "Power delivery up to 90W via USB-C", "ComfortView Plus low blue light"],
    in_stock: 1, prime_eligible: 1, badge: "Popular", deal_of_day: 0
  },

  // Fashion & Apparel
  {
    id: 9,
    title: "Men's Waterproof Windproof Mountain Hooded Softshell Ski Jacket",
    category: "Fashion",
    price: 69.99,
    original_price: 119.99,
    discount_pct: 42,
    rating: 4.5,
    rating_count: 2380,
    image_url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
    description: "Durable soft shell jacket with warm fleece lining. Highly windproof and water repellent for skiing, hiking, and daily winter commuting.",
    features: ["Waterproof index: 10000mm/H2O", "Warm fleece inner lining", "Adjustable detachable storm hood", "Multiple secure zippered pockets"],
    in_stock: 1, prime_eligible: 1, badge: "Limited Time Deal", deal_of_day: 1
  },
  {
    id: 10,
    title: "Nike Air Max 270 Men's Running & Lifestyle Athletic Sneakers",
    category: "Fashion",
    price: 129.95,
    original_price: 160.00,
    discount_pct: 19,
    rating: 4.6,
    rating_count: 6710,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "The Nike Air Max 270 boasts Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks.",
    features: ["Large Max Air heel unit", "Breathable mesh engineered upper", "Stretchy inner sleeve for snug fit", "Dual-density foam cushioning"],
    in_stock: 1, prime_eligible: 1, badge: "Popular", deal_of_day: 0
  },
  {
    id: 11,
    title: "Fossil Grant Chronograph Genuine Brown Leather Men's Watch",
    category: "Fashion",
    price: 89.00,
    original_price: 145.00,
    discount_pct: 39,
    rating: 4.6,
    rating_count: 4120,
    image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    description: "Inspired by vintage clocks, this Grant timepiece has an artistic balance and roman numeral hour markers.",
    features: ["44mm stainless steel case", "Quartz movement with analog chronograph", "Genuine calfskin leather strap", "Water resistant to 50m"],
    in_stock: 1, prime_eligible: 1, badge: "Deal of the Day", deal_of_day: 1
  },
  {
    id: 12,
    title: "Ray-Ban Classic Aviator Polarized Sunglasses (Gold Frame / Green Lens)",
    category: "Fashion",
    price: 163.00,
    original_price: 213.00,
    discount_pct: 23,
    rating: 4.7,
    rating_count: 7820,
    image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    description: "The world's most iconic sunglasses. Classic Aviator design engineered for US aviators in 1937 with 100% UV protection.",
    features: ["Polarized crystal green lenses", "Classic lightweight metal frame", "100% UV400 protective coating", "Includes authentic protective leather case"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 0
  },
  {
    id: 13,
    title: "Levi's Men's 511 Slim Fit Stretch Denim Jeans (Clean Dark Wash)",
    category: "Fashion",
    price: 49.99,
    original_price: 69.50,
    discount_pct: 28,
    rating: 4.5,
    rating_count: 12900,
    image_url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    description: "A modern slim with room to move. The 511 Slim Fit Jeans are a classic since right now with upgraded comfort stretch fabric.",
    features: ["99% Cotton, 1% Elastane", "Zip fly with button closure", "Slim through seat and thigh", "Sits below your waist"],
    in_stock: 1, prime_eligible: 1, badge: "Amazon's Choice", deal_of_day: 0
  },
  {
    id: 14,
    title: "Michael Kors Women's Jet Set Travel Large Saffiano Leather Tote Bag",
    category: "Fashion",
    price: 119.00,
    original_price: 198.00,
    discount_pct: 40,
    rating: 4.6,
    rating_count: 3210,
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    description: "Crafted from premium Saffiano leather, this Jet Set tote bag is the ultimate carryall for work, travel, and everyday elegance.",
    features: ["100% Saffiano genuine leather", "Gold-tone hardware accents", "Padded center zip compartment for tablets", "Dual top carry handles"],
    in_stock: 1, prime_eligible: 1, badge: "Top Deal", deal_of_day: 0
  },
  {
    id: 15,
    title: "Under Armour Men's Tech 2.0 Short-Sleeve Quick-Dry Gym T-Shirt",
    category: "Fashion",
    price: 19.99,
    original_price: 25.00,
    discount_pct: 20,
    rating: 4.6,
    rating_count: 18400,
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    description: "UA Tech fabric is quick-drying, ultra-soft & has a more natural feel. Anti-odor technology prevents the growth of odor-causing microbes.",
    features: ["100% Polyester Tech fabric", "Material wicks sweat and dries fast", "Streamlined fit and shaped hem", "Machine washable"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 0
  },

  // Home & Kitchen
  {
    id: 16,
    title: "De'Longhi Magnifica S Automatic Bean-to-Cup Espresso Coffee Machine",
    category: "Home & Kitchen",
    price: 549.95,
    original_price: 699.95,
    discount_pct: 21,
    rating: 4.7,
    rating_count: 3890,
    image_url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
    description: "Create barista quality freshly ground espresso, cappuccino, and latte at home with intuitive control panel and manual steam wand.",
    features: ["15-bar professional pump pressure", "Integrated burr grinder with 13 settings", "Traditional manual milk frother", "Easy cleaning with removable drip tray"],
    in_stock: 1, prime_eligible: 1, badge: "Amazon's Choice", deal_of_day: 1
  },
  {
    id: 17,
    title: "Ninja AF101 Air Fryer that Crisps, Roasts, Reheats & Dehydrates (4-Quart)",
    category: "Home & Kitchen",
    price: 89.99,
    original_price: 129.99,
    discount_pct: 31,
    rating: 4.8,
    rating_count: 19500,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    description: "Enjoy guilt-free food: air fry with up to 75% less fat than traditional frying methods. Tested against deep-fried hand-cut fries.",
    features: ["4-quart ceramic-coated basket", "Wide temperature range: 105°F to 400°F", "One-touch control panel", "Dishwasher safe parts"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 1
  },
  {
    id: 18,
    title: "iRobot Roomba j7+ Self-Emptying Robot Vacuum with Obstacle Avoidance",
    category: "Home & Kitchen",
    price: 599.00,
    original_price: 799.99,
    discount_pct: 25,
    rating: 4.6,
    rating_count: 2980,
    image_url: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80",
    description: "Identifies and avoids pet waste and cords. Empties itself into the Clean Base Automatic Dirt Disposal for up to 60 days.",
    features: ["PrecisionVision navigation", "Clean Base Automatic Dirt Disposal", "10x Power-Lifting Suction", "Smart mapping by room"],
    in_stock: 1, prime_eligible: 1, badge: "Trending", deal_of_day: 0
  },
  {
    id: 19,
    title: "KitchenAid Artisan Series 5-Quart Tilt-Head Stand Mixer - Empire Red",
    category: "Home & Kitchen",
    price: 379.99,
    original_price: 449.99,
    discount_pct: 16,
    rating: 4.9,
    rating_count: 11200,
    image_url: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=800&q=80",
    description: "Make up to 9 dozen cookies in a single batch with the KitchenAid 5 Quart Stand Mixer featuring 10 speeds and 59 touchpoints.",
    features: ["5-quart stainless steel bowl with handle", "10 optimized mixing speeds", "Tilt-back head design for easy bowl access", "Includes flat beater, dough hook, and wire whip"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 0
  },
  {
    id: 20,
    title: "Philips Sonicare DiamondClean Smart 9500 Rechargeable Electric Toothbrush",
    category: "Home & Kitchen",
    price: 199.96,
    original_price: 279.96,
    discount_pct: 29,
    rating: 4.7,
    rating_count: 5420,
    image_url: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
    description: "Complete oral care solution with smart sensors providing real-time feedback via the smartphone app to improve brushing technique.",
    features: ["Removes up to 10x more plaque than manual", "5 brushing modes and 3 intensity levels", "Smart brush head recognition", "Premium USB charging travel case included"],
    in_stock: 1, prime_eligible: 1, badge: "Deal of the Day", deal_of_day: 0
  },
  {
    id: 21,
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker (6-Quart)",
    category: "Home & Kitchen",
    price: 79.95,
    original_price: 99.95,
    discount_pct: 20,
    rating: 4.7,
    rating_count: 34100,
    image_url: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80",
    description: "Combines 7 kitchen appliances in 1: Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and food warmer.",
    features: ["13 customizable one-touch smart programs", "Fingerprint-resistant stainless steel sides", "Over 10 proven safety mechanisms", "Cooks up to 70% faster"],
    in_stock: 1, prime_eligible: 1, badge: "Amazon's Choice", deal_of_day: 0
  },

  // Books & Study
  {
    id: 22,
    title: "Designing Data-Intensive Applications: The Big Ideas Behind Reliable Systems",
    category: "Books",
    price: 34.99,
    original_price: 49.99,
    discount_pct: 30,
    rating: 4.9,
    rating_count: 7850,
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    description: "The definitive guide to architecture of data systems, scalability, consistency, reliability, and maintainability by Martin Kleppmann.",
    features: ["Core principles of distributed data systems", "Transactions, replication, and partitioning", "Batch and stream processing", "Peer-reviewed industry standard"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 1
  },
  {
    id: 23,
    title: "Cracking the Coding Interview: 189 Programming Questions and Solutions",
    category: "Books",
    price: 28.50,
    original_price: 39.95,
    discount_pct: 29,
    rating: 4.8,
    rating_count: 12400,
    image_url: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
    description: "Learn how to uncover the hints and hidden details in questions, discover how to break problems down into manageable chunks.",
    features: ["189 programming interview questions", "Big O and algorithm design strategies", "Behind the scenes at Google, Apple & Microsoft", "Soft skills & interview etiquette"],
    in_stock: 1, prime_eligible: 1, badge: "Amazon's Choice", deal_of_day: 0
  },
  {
    id: 24,
    title: "Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin",
    category: "Books",
    price: 37.99,
    original_price: 54.99,
    discount_pct: 31,
    rating: 4.7,
    rating_count: 9820,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Master software craftsmanship.",
    features: ["Principles, patterns, and practices of writing clean code", "How to write good tests and refactor legacy code", "Meaningful naming and formatting standards", "Real-world case studies"],
    in_stock: 1, prime_eligible: 1, badge: "Popular", deal_of_day: 0
  },
  {
    id: 25,
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear",
    category: "Books",
    price: 14.99,
    original_price: 27.00,
    discount_pct: 44,
    rating: 4.9,
    rating_count: 48200,
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day from world-renowned habit formation expert James Clear.",
    features: ["Over 15 million copies sold worldwide", "The Four Laws of Behavior Change", "Practical strategies to overcome lack of motivation", "Design your environment for success"],
    in_stock: 1, prime_eligible: 1, badge: "Best Seller", deal_of_day: 1
  },
  {
    id: 26,
    title: "Python Crash Course: A Hands-On, Project-Based Introduction to Programming",
    category: "Books",
    price: 24.50,
    original_price: 39.95,
    discount_pct: 39,
    rating: 4.8,
    rating_count: 6310,
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "The world's bestselling programming book. A fast-paced, thorough introduction to Python that will have you writing code in no time.",
    features: ["Updated for modern Python 3", "Build 2D arcade games with Pygame", "Data visualization with Matplotlib and Plotly", "Deploy real web applications"],
    in_stock: 1, prime_eligible: 1, badge: "Top Deal", deal_of_day: 0
  }
];

// Fallback coupons
const STATIC_COUPONS = {
  'AMAZON20': { percent: 20, min: 50 },
  'PRIME10': { flat: 10, min: 35 },
  'WELCOME50': { flat: 50, min: 200 }
};

// Global Application State
const state = {
  products: [...STATIC_CATALOG],
  cart: JSON.parse(localStorage.getItem('amz_cart') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('amz_user') || 'null'),
  currentCategory: 'All',
  searchQuery: '',
  sortBy: 'featured',
  activeSlide: 0
};

// Initialize Global UI on every page
document.addEventListener('DOMContentLoaded', () => {
  initGlobalAuthUI();
  updateCartBadge();
  setupSearchAutocomplete();
  
  if (document.getElementById('productsGrid')) {
    initHeroSlider();
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    if (catParam) state.currentCategory = catParam;
    if (searchParam) {
      state.searchQuery = searchParam;
      const input = document.getElementById('navSearchInput');
      if (input) input.value = searchParam;
    }
    loadProducts();
    setupHomepageEventListeners();
  }
});

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

function initGlobalAuthUI() {
  const accountText = document.getElementById('navAccountName');
  const adminSubnav = document.getElementById('adminSubnavLink');

  if (state.currentUser) {
    if (accountText) accountText.textContent = `Hello, ${state.currentUser.name.split(' ')[0]}`;
    if (adminSubnav) adminSubnav.style.display = 'flex';
  } else {
    if (accountText) accountText.textContent = 'Hello, sign in';
  }
}

function updateCartBadge() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#navCartCount, .nav-cart-count').forEach(el => {
    el.textContent = count;
  });
}

function setupSearchAutocomplete() {
  const input = document.getElementById('navSearchInput');
  const box = document.getElementById('searchSuggestionsBox');
  if (!input || !box) return;

  let debounceTimer;

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      box.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(() => {
      // Search in static catalog
      const matches = STATIC_CATALOG.filter(p => p.title.toLowerCase().includes(query)).slice(0, 5);
      if (matches.length) {
        box.innerHTML = matches.map(s => `
          <a href="product.html?id=${s.id}" class="suggestion-item">
            <img src="${escapeHtml(s.image_url)}" class="suggestion-img" alt="${escapeHtml(s.title)}">
            <span class="suggestion-title">${escapeHtml(s.title)}</span>
            <span class="suggestion-price">$${s.price.toFixed(2)}</span>
          </a>
        `).join('');
        box.style.display = 'block';
      } else {
        box.style.display = 'none';
      }
    }, 200);
  });

  document.addEventListener('click', (e) => {
    if (!box.contains(e.target) && e.target !== input) {
      box.style.display = 'none';
    }
  });
}

function handleNavSearch(e) {
  e.preventDefault();
  const input = document.getElementById('navSearchInput');
  const cat = document.getElementById('searchCategorySelect')?.value || 'All';
  const query = input ? input.value.trim() : '';

  const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
  if (isHome) {
    state.searchQuery = query;
    state.currentCategory = cat;
    loadProducts();
  } else {
    window.location.href = `index.html?search=${encodeURIComponent(query)}&category=${encodeURIComponent(cat)}`;
  }
}

// -------------------------------------------------------------
// CART MANAGEMENT (GLOBAL)
// -------------------------------------------------------------
function addToCartById(productId) {
  const p = STATIC_CATALOG.find(it => it.id === productId);
  if (!p) return;

  const existing = state.cart.find(it => it.id === p.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: p.id,
      title: p.title,
      price: p.price,
      image_url: p.image_url,
      quantity: 1
    });
  }
  saveCart();
  updateCartBadge();
  showToast(`Added "${p.title.substring(0, 30)}..." to your Cart!`, 'success');

  if (document.getElementById('cartDrawer')) {
    renderCartDrawer();
    openCartDrawer();
  }
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(it => it.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(it => it.id !== productId);
  }

  saveCart();
  updateCartBadge();
  if (document.getElementById('cartDrawer')) renderCartDrawer();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter(it => it.id !== productId);
  saveCart();
  updateCartBadge();
  if (document.getElementById('cartDrawer')) renderCartDrawer();
  showToast('Item removed from cart', 'info');
}

function saveCart() {
  localStorage.setItem('amz_cart', JSON.stringify(state.cart));
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCartDrawer() {
  const container = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartDrawerSubtotal');
  const freeShippingText = document.getElementById('freeShippingText');
  const freeShippingBar = document.getElementById('freeShippingProgress');

  if (!container) return;

  const subtotal = getCartSubtotal();
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  if (subtotal >= 35.00) {
    if (freeShippingText) freeShippingText.innerHTML = '🎉 <strong>You qualify for FREE Delivery!</strong>';
    if (freeShippingBar) freeShippingBar.style.width = '100%';
  } else {
    const diff = (35.00 - subtotal).toFixed(2);
    if (freeShippingText) freeShippingText.innerHTML = `Add <strong>$${diff}</strong> more for <strong>FREE Delivery</strong>`;
    if (freeShippingBar) freeShippingBar.style.width = `${Math.min(100, (subtotal / 35.00) * 100)}%`;
  }

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <svg style="width: 50px; height: 50px; fill: #bbb; margin-bottom: 12px;" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
        <h4 style="font-size: 16px; margin-bottom: 6px;">Your Amazon Cart is empty</h4>
        <a href="index.html" class="btn-add-cart" style="display: inline-block; padding: 6px 20px; margin-top: 10px;">Explore Store</a>
      </div>
    `;
    return;
  }

  container.innerHTML = state.cart.map(item => `
    <div class="cart-item-row">
      <img src="${escapeHtml(item.image_url)}" class="cart-item-img" alt="${escapeHtml(item.title)}">
      <div class="cart-item-info">
        <div class="cart-item-title">${escapeHtml(item.title)}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span style="font-weight: 700; font-size: 14px; min-width: 20px; text-align: center;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
          <span class="cart-item-delete" onclick="removeCartItem(${item.id})">Delete</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

// -------------------------------------------------------------
// HOMEPAGE CATALOG & FILTERING
// -------------------------------------------------------------
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    state.activeSlide = index;
  }

  const nextBtn = document.getElementById('sliderNext');
  const prevBtn = document.getElementById('sliderPrev');

  if (nextBtn) nextBtn.addEventListener('click', () => showSlide((state.activeSlide + 1) % slides.length));
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide((state.activeSlide - 1 + slides.length) % slides.length));

  setInterval(() => {
    showSlide((state.activeSlide + 1) % slides.length);
  }, 6000);
}

async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // Try fetching from local server API; if 404 (GitHub Pages static host), fallback cleanly to STATIC_CATALOG
  let products = [...STATIC_CATALOG];

  try {
    const res = await fetch(`/api/products?sort=${encodeURIComponent(state.sortBy)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.products.length) {
        products = data.products;
      }
    }
  } catch (err) {
    // Expected on static GitHub Pages
  }

  // Filter in memory
  let filtered = products;

  if (state.currentCategory && state.currentCategory !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === state.currentCategory.toLowerCase());
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  const minP = parseFloat(document.getElementById('minPriceFilter')?.value);
  const maxP = parseFloat(document.getElementById('maxPriceFilter')?.value);
  if (!isNaN(minP)) filtered = filtered.filter(p => p.price >= minP);
  if (!isNaN(maxP)) filtered = filtered.filter(p => p.price <= maxP);

  // Sorting
  if (state.sortBy === 'price_low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price_high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'discount') {
    filtered.sort((a, b) => b.discount_pct - a.discount_pct);
  }

  state.products = filtered;
  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 20px; margin-bottom: 8px;">No products match your criteria</h3>
        <p style="color: #666;">Try adjusting your search terms or filters.</p>
        <button onclick="resetFilters()" class="btn-add-cart" style="margin-top: 16px; padding: 8px 24px;">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => {
    const starString = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    const badgeHtml = product.badge ? `<span class="badge-tag">${escapeHtml(product.badge)}</span>` : '';
    const primeHtml = product.prime_eligible ? `
      <div class="prime-badge">
        <span class="prime-icon">prime</span>
        <span>Get it by <strong>Tomorrow</strong></span>
      </div>
    ` : '';

    return `
      <div class="product-card">
        ${badgeHtml}
        <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit;">
          <div class="product-img-box">
            <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.title)}" loading="lazy">
          </div>
          <div class="product-category">${escapeHtml(product.category)}</div>
          <h3 class="product-title">${escapeHtml(product.title)}</h3>
          <div class="product-rating">
            <span class="stars">${starString}</span>
            <span class="rating-count">(${product.rating_count.toLocaleString()})</span>
          </div>
          <div class="price-row">
            <span class="price-symbol">$</span>
            <span class="price-whole">${product.price.toFixed(2)}</span>
            ${product.original_price > product.price ? `
              <span class="mrp-strike">$${product.original_price.toFixed(2)}</span>
              <span class="discount-badge">-${product.discount_pct}%</span>
            ` : ''}
          </div>
          ${primeHtml}
          <div class="delivery-text">FREE delivery on eligible orders</div>
        </a>
        <div class="card-actions">
          <button class="btn-add-cart" onclick="addToCartById(${product.id})">Add to Cart</button>
          <button class="btn-buy-now" onclick="addToCartById(${product.id}); window.location.href='checkout.html';">Buy Now</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterByCategory(category) {
  state.currentCategory = category;
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  const navSelect = document.getElementById('searchCategorySelect');
  if (navSelect) navSelect.value = category;
  loadProducts();
}

function resetFilters() {
  state.currentCategory = 'All';
  state.searchQuery = '';
  state.sortBy = 'featured';
  const searchInput = document.getElementById('navSearchInput');
  if (searchInput) searchInput.value = '';
  filterByCategory('All');
}

function setupHomepageEventListeners() {
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      loadProducts();
    });
  }

  const cartOverlay = document.getElementById('cartDrawerOverlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('amz_user');
  initGlobalAuthUI();
  showToast('You have signed out from Amazon Clone.', 'info');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
