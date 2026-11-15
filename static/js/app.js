/**
 * Amazon Clone Main Frontend Application & Global Shared Logic
 * Handles Global Navigation, Search Autocomplete, State Persistence,
 * Catalog Browsing, Cart Drawer, and Authentication across all pages.
 * Author: Bhuvan Kolisetti
 * Repository: https://github.com/bhuvankolisetti/e-commerce
 */

// Global Application State
const state = {
  products: [],
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
  
  // If on homepage (has productsGrid)
  if (document.getElementById('productsGrid')) {
    initHeroSlider();
    // Read URL params if any
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

// Toast notification system
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3500);
}

// -------------------------------------------------------------
// GLOBAL NAVBAR & SEARCH AUTOCOMPLETE
// -------------------------------------------------------------
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
    const query = e.target.value.trim();

    if (query.length < 2) {
      box.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.suggestions && data.suggestions.length) {
          box.innerHTML = data.suggestions.map(s => `
            <a href="/product?id=${s.id}" class="suggestion-item">
              <img src="${escapeHtml(s.image_url)}" class="suggestion-img" alt="${escapeHtml(s.title)}">
              <span class="suggestion-title">${escapeHtml(s.title)}</span>
              <span class="suggestion-price">$${s.price.toFixed(2)}</span>
            </a>
          `).join('');
          box.style.display = 'block';
        } else {
          box.style.display = 'none';
        }
      } catch (err) {
        box.style.display = 'none';
      }
    }, 250);
  });

  // Hide on click outside
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

  // If already on homepage, filter in-place
  if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '') {
    state.searchQuery = query;
    state.currentCategory = cat;
    loadProducts();
  } else {
    // Navigate to homepage with query params
    window.location.href = `/?search=${encodeURIComponent(query)}&category=${encodeURIComponent(cat)}`;
  }
}

// -------------------------------------------------------------
// CART MANAGEMENT (GLOBAL)
// -------------------------------------------------------------
function addToCartById(productId) {
  fetch(`/api/products/${productId}`)
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const p = data.product;
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

        // If drawer exists on page, open it
        if (document.getElementById('cartDrawer')) {
          renderCartDrawer();
          openCartDrawer();
        }
      }
    })
    .catch(() => showToast('Failed to add product', 'error'));
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
        <a href="/" class="btn-add-cart" style="display: inline-block; padding: 6px 20px; margin-top: 10px;">Explore Store</a>
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

  grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">Loading latest Amazon products...</div>';

  let url = `/api/products?sort=${encodeURIComponent(state.sortBy)}`;
  if (state.currentCategory && state.currentCategory !== 'All') {
    url += `&category=${encodeURIComponent(state.currentCategory)}`;
  }
  if (state.searchQuery) {
    url += `&search=${encodeURIComponent(state.searchQuery)}`;
  }

  // Check price inputs if present
  const minP = document.getElementById('minPriceFilter')?.value;
  const maxP = document.getElementById('maxPriceFilter')?.value;
  if (minP) url += `&min_price=${encodeURIComponent(minP)}`;
  if (maxP) url += `&max_price=${encodeURIComponent(maxP)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      state.products = data.products;
      renderProducts(data.products);
    } else {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: red;">Failed to load products.</div>';
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: red;">Unable to connect to product server.</div>';
  }
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
        <a href="/product?id=${product.id}" style="text-decoration: none; color: inherit;">
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
          <button class="btn-buy-now" onclick="addToCartById(${product.id}); window.location.href='/checkout';">Buy Now</button>
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

// -------------------------------------------------------------
// LOGOUT UTILITY
// -------------------------------------------------------------
function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('amz_user');
  initGlobalAuthUI();
  showToast('You have signed out from Amazon Clone.', 'info');
}

// Modal Backdrop dismissal
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

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
