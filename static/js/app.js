/**
 * Amazon Clone Main Frontend Application
 * Handles Catalog, Dynamic Search/Filter, Cart, Checkout, Auth, and Admin Dashboard
 * Author: Bhuvan Kolisetti
 * Repository: https://github.com/bhuvankolisetti/e-commerce
 */

// Application State
const state = {
  products: [],
  cart: JSON.parse(localStorage.getItem('amz_cart') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('amz_user') || 'null'),
  currentCategory: 'All',
  searchQuery: '',
  sortBy: 'featured',
  activeSlide: 0
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initAuthUI();
  updateCartBadge();
  loadProducts();
  setupEventListeners();
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
// HERO SLIDER
// -------------------------------------------------------------
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    state.activeSlide = index;
  }

  const nextBtn = document.getElementById('sliderNext');
  const prevBtn = document.getElementById('sliderPrev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let nextIndex = (state.activeSlide + 1) % slides.length;
      showSlide(nextIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let prevIndex = (state.activeSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    });
  }

  // Auto slide every 6 seconds
  setInterval(() => {
    let nextIndex = (state.activeSlide + 1) % slides.length;
    showSlide(nextIndex);
  }, 6000);
}

// -------------------------------------------------------------
// PRODUCTS CATALOG & FILTERING
// -------------------------------------------------------------
async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">Loading latest products...</div>';

  let url = `/api/products?sort=${encodeURIComponent(state.sortBy)}`;
  if (state.currentCategory && state.currentCategory !== 'All') {
    url += `&category=${encodeURIComponent(state.currentCategory)}`;
  }
  if (state.searchQuery) {
    url += `&search=${encodeURIComponent(state.searchQuery)}`;
  }

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
        <p style="color: #666;">Try adjusting your search terms or category filters.</p>
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
        <div class="product-img-box" onclick="openProductModal(${product.id})">
          <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.title)}" loading="lazy">
        </div>
        <div class="product-category">${escapeHtml(product.category)}</div>
        <h3 class="product-title" onclick="openProductModal(${product.id})">${escapeHtml(product.title)}</h3>
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
        <div class="card-actions">
          <button class="btn-add-cart" onclick="addToCartById(${product.id})">Add to Cart</button>
          <button class="btn-buy-now" onclick="buyNowById(${product.id})">Buy Now</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterByCategory(category) {
  state.currentCategory = category;
  
  // Update Pills
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  // Update Nav selector
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

// -------------------------------------------------------------
// PRODUCT DETAIL MODAL & REVIEWS
// -------------------------------------------------------------
async function openProductModal(productId) {
  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');
  if (!modal || !content) return;

  content.innerHTML = '<div style="text-align: center; padding: 40px;">Loading product details...</div>';
  modal.classList.add('open');

  try {
    const res = await fetch(`/api/products/${productId}`);
    const data = await res.json();
    if (!data.success) {
      content.innerHTML = '<div style="color: red;">Product not found.</div>';
      return;
    }

    const p = data.product;
    const reviews = data.reviews || [];
    const featuresList = (p.features && p.features.length) 
      ? p.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')
      : '<li>High quality genuine product with official manufacturer warranty.</li>';

    const starString = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));

    content.innerHTML = `
      <div class="detail-grid">
        <div class="detail-img-box">
          <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.title)}">
        </div>
        <div class="detail-info">
          <div style="font-size: 13px; color: var(--amz-link); margin-bottom: 4px;">Brand Store &gt; ${escapeHtml(p.category)}</div>
          <h2 class="detail-title">${escapeHtml(p.title)}</h2>
          <div class="product-rating detail-rating">
            <span class="stars">${starString}</span>
            <span style="font-weight: 700; margin-left: 4px;">${p.rating} out of 5</span>
            <span class="rating-count">(${p.rating_count.toLocaleString()} customer reviews)</span>
          </div>

          <div class="detail-price-box">
            <div style="font-size: 14px; color: #565959;">List Price: <span style="text-decoration: line-through;">$${p.original_price.toFixed(2)}</span></div>
            <div style="font-size: 26px; font-weight: 700; color: var(--amz-red);">
              <span style="font-size: 14px;">With Deal: </span>$${p.price.toFixed(2)}
              <span style="font-size: 14px; color: #565959; font-weight: 400;"> (Save ${p.discount_pct}%)</span>
            </div>
            <div style="font-size: 13px; color: var(--amz-green); font-weight: 700; margin-top: 4px;">
              ✓ In Stock (${p.in_stock ? 'Available for immediate dispatch' : 'Backorder'})
            </div>
          </div>

          <h4 style="font-size: 15px; margin-bottom: 6px;">About this item:</h4>
          <ul class="features-list">
            ${featuresList}
          </ul>

          <div style="display: flex; gap: 12px; margin-top: 16px;">
            <button class="btn-add-cart" style="flex: 1; padding: 12px;" onclick="addToCartById(${p.id}); closeModal('productModal');">Add to Cart</button>
            <button class="btn-buy-now" style="flex: 1; padding: 12px;" onclick="buyNowById(${p.id}); closeModal('productModal');">Buy Now</button>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h3 style="font-size: 18px; margin-bottom: 14px;">Customer Reviews & Ratings</h3>
        
        <!-- Add Review Form -->
        <div style="background: #f7fafa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
          <h4 style="font-size: 14px; margin-bottom: 10px;">Write a Customer Review</h4>
          <form onsubmit="submitReview(event, ${p.id})">
            <div style="display: flex; gap: 12px; margin-bottom: 10px;">
              <input type="text" id="reviewerName" class="form-control" placeholder="Your Name" value="${state.currentUser ? escapeHtml(state.currentUser.name) : ''}" required style="flex: 1;">
              <select id="reviewRating" class="form-control" style="width: 130px;">
                <option value="5">★★★★★ (5.0)</option>
                <option value="4">★★★★☆ (4.0)</option>
                <option value="3">★★★☆☆ (3.0)</option>
                <option value="2">★★☆☆☆ (2.0)</option>
                <option value="1">★☆☆☆☆ (1.0)</option>
              </select>
            </div>
            <textarea id="reviewComment" class="form-control" placeholder="What did you like or dislike? How does it perform?" rows="3" required style="margin-bottom: 10px;"></textarea>
            <button type="submit" class="btn-add-cart" style="padding: 6px 18px;">Submit Review</button>
          </form>
        </div>

        <!-- Existing Reviews -->
        <div>
          ${reviews.length ? reviews.map(r => `
            <div class="review-item">
              <div style="display: flex; justify-content: space-between;">
                <span class="review-user">👤 ${escapeHtml(r.user_name)}</span>
                <span class="stars">${'★'.repeat(Math.floor(r.rating))}</span>
              </div>
              <div class="review-comment">${escapeHtml(r.comment)}</div>
              <div style="font-size: 11px; color: #888; margin-top: 4px;">Verified Purchase • ${r.created_at || 'Recently'}</div>
            </div>
          `).join('') : '<p style="color: #666; font-size: 13px;">No customer reviews yet. Be the first to review this product!</p>'}
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Error loading product details:', err);
    content.innerHTML = '<div style="color: red;">Error retrieving product details.</div>';
  }
}

async function submitReview(e, productId) {
  e.preventDefault();
  const name = document.getElementById('reviewerName').value;
  const rating = parseFloat(document.getElementById('reviewRating').value);
  const comment = document.getElementById('reviewComment').value;

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, user_name: name, rating, comment })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Review submitted! Thank you.', 'success');
      openProductModal(productId); // Reload modal
      loadProducts(); // Update rating in main grid
    } else {
      showToast(data.error || 'Failed to post review', 'error');
    }
  } catch (err) {
    showToast('Network error submitting review', 'error');
  }
}

// -------------------------------------------------------------
// CART MANAGEMENT
// -------------------------------------------------------------
function addToCartById(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  openCartDrawer();
  showToast(`Added "${product.title.substring(0, 30)}..." to cart!`, 'success');
}

function buyNowById(productId) {
  addToCartById(productId);
  closeCartDrawer();
  openCheckoutModal();
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
  renderCartDrawer();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter(it => it.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast('Item removed from cart', 'info');
}

function saveCart() {
  localStorage.setItem('amz_cart', JSON.stringify(state.cart));
}

function updateCartBadge() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('navCartCount');
  if (badge) badge.textContent = count;
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

  // Amazon $35 Free Shipping Threshold
  const freeThreshold = 35.00;
  if (subtotal >= freeThreshold) {
    if (freeShippingText) freeShippingText.innerHTML = '🎉 <strong>You qualify for FREE Delivery!</strong>';
    if (freeShippingBar) freeShippingBar.style.width = '100%';
  } else {
    const diff = (freeThreshold - subtotal).toFixed(2);
    if (freeShippingText) freeShippingText.innerHTML = `Add <strong>$${diff}</strong> more for <strong>FREE Delivery</strong>`;
    if (freeShippingBar) freeShippingBar.style.width = `${Math.min(100, (subtotal / freeThreshold) * 100)}%`;
  }

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <svg style="width: 60px; height: 60px; fill: #bbb; margin-bottom: 12px;" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <h4 style="font-size: 16px; margin-bottom: 6px;">Your Amazon Cart is empty</h4>
        <p style="font-size: 13px; color: #666; margin-bottom: 16px;">Shop today's deals or browse categories.</p>
        <button class="btn-add-cart" onclick="closeCartDrawer(); filterByCategory('All');">Explore Products</button>
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
// CHECKOUT & ORDER SUBMISSION
// -------------------------------------------------------------
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty. Please add items to checkout.', 'error');
    return;
  }

  const modal = document.getElementById('checkoutModal');
  if (!modal) return;

  const subtotal = getCartSubtotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 35.0 ? 0.0 : 5.99;
  const total = subtotal + tax + shipping;

  document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;

  if (state.currentUser) {
    document.getElementById('checkoutName').value = state.currentUser.name || '';
    document.getElementById('checkoutEmail').value = state.currentUser.email || '';
    document.getElementById('checkoutAddress').value = state.currentUser.address || '';
  }

  modal.classList.add('open');
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const customerName = document.getElementById('checkoutName').value.trim();
  const customerEmail = document.getElementById('checkoutEmail').value.trim();
  const shippingAddress = document.getElementById('checkoutAddress').value.trim();
  const city = document.getElementById('checkoutCity').value.trim();
  const postalCode = document.getElementById('checkoutPostal').value.trim();
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'Credit Card';

  const orderPayload = {
    user_id: state.currentUser ? state.currentUser.id : null,
    customer_name: customerName,
    customer_email: customerEmail,
    shipping_address: shippingAddress,
    city: city,
    postal_code: postalCode,
    payment_method: paymentMethod,
    items: state.cart
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();

    if (data.success) {
      // Clear Cart
      state.cart = [];
      saveCart();
      updateCartBadge();

      closeModal('checkoutModal');
      openOrderConfirmationModal(data.order, customerName, shippingAddress);
      showToast('Order placed successfully! 🎉', 'success');
    } else {
      showToast(data.error || 'Failed to place order', 'error');
    }
  } catch (err) {
    showToast('Network error while placing order', 'error');
  }
}

function openOrderConfirmationModal(order, name, address) {
  const modal = document.getElementById('orderSuccessModal');
  const details = document.getElementById('orderSuccessDetails');
  if (!modal || !details) return;

  details.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-block; background: #e6f4ea; color: #137333; width: 64px; height: 64px; line-height: 64px; border-radius: 50%; font-size: 32px; margin-bottom: 10px;">✓</div>
      <h2 style="font-size: 24px; color: #0f1111;">Order Placed, Thank You!</h2>
      <p style="color: #565959; font-size: 14px;">Confirmation will be sent to your email.</p>
    </div>

    <div style="background: #f7fafa; border: 1px solid var(--amz-border); border-radius: 6px; padding: 16px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: 700;">Order Number:</span>
        <span style="color: var(--amz-link); font-family: monospace; font-size: 14px;">${order.order_number}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: 700;">Estimated Delivery:</span>
        <span style="color: var(--amz-green); font-weight: 700;">Tomorrow by 8 PM</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: 700;">Payment Method:</span>
        <span>${order.payment_method}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px;">
        <span>Total Amount:</span>
        <span style="color: var(--amz-red);">$${order.total_amount.toFixed(2)}</span>
      </div>
    </div>

    <div style="display: flex; gap: 12px;">
      <button class="btn-add-cart" style="flex: 1;" onclick="window.print()">🖨️ Print Receipt</button>
      <button class="btn-buy-now" style="flex: 1;" onclick="closeModal('orderSuccessModal'); openOrdersModal();">View My Orders</button>
    </div>
  `;

  modal.classList.add('open');
}

// -------------------------------------------------------------
// USER AUTHENTICATION
// -------------------------------------------------------------
function initAuthUI() {
  const accountText = document.getElementById('navAccountName');
  const adminSubnav = document.getElementById('adminSubnavLink');

  if (state.currentUser) {
    if (accountText) accountText.textContent = `Hello, ${state.currentUser.name.split(' ')[0]}`;
    if (adminSubnav) adminSubnav.style.display = state.currentUser.role === 'admin' ? 'flex' : 'none';
  } else {
    if (accountText) accountText.textContent = 'Hello, sign in';
    if (adminSubnav) adminSubnav.style.display = 'none';
  }
}

function openAuthModal(mode = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  switchAuthTab(mode);
  modal.classList.add('open');
}

function switchAuthTab(tab) {
  document.getElementById('loginFormTab').classList.toggle('active', tab === 'login');
  document.getElementById('registerFormTab').classList.toggle('active', tab === 'register');
  document.getElementById('loginFormContainer').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerFormContainer').style.display = tab === 'register' ? 'block' : 'none';
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      state.currentUser = data.user;
      localStorage.setItem('amz_user', JSON.stringify(data.user));
      initAuthUI();
      closeModal('authModal');
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      if (data.user.role === 'admin') {
        openAdminModal();
      }
    } else {
      showToast(data.error || 'Login failed', 'error');
    }
  } catch (err) {
    showToast('Network error during login', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const address = document.getElementById('regAddress').value.trim();

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, address })
    });
    const data = await res.json();
    if (data.success) {
      state.currentUser = data.user;
      localStorage.setItem('amz_user', JSON.stringify(data.user));
      initAuthUI();
      closeModal('authModal');
      showToast('Registration successful! Welcome to Amazon Clone.', 'success');
    } else {
      showToast(data.error || 'Registration failed', 'error');
    }
  } catch (err) {
    showToast('Network error during registration', 'error');
  }
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('amz_user');
  initAuthUI();
  showToast('You have signed out.', 'info');
}

// -------------------------------------------------------------
// MY ORDERS VIEW
// -------------------------------------------------------------
async function openOrdersModal() {
  const modal = document.getElementById('ordersModal');
  const container = document.getElementById('ordersListContainer');
  if (!modal || !container) return;

  container.innerHTML = '<div style="text-align:center; padding: 40px;">Fetching your orders...</div>';
  modal.classList.add('open');

  const userId = state.currentUser ? state.currentUser.id : null;
  const url = userId ? `/api/orders?user_id=${userId}` : '/api/orders';

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.success && data.orders.length) {
      container.innerHTML = data.orders.map(order => `
        <div style="border: 1px solid #d5d9d9; border-radius: 8px; margin-bottom: 20px; overflow: hidden; background: #fff;">
          <div style="background: #f0f2f2; padding: 12px 18px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 13px;">
            <div>
              <div style="color: #565959; text-transform: uppercase; font-size: 11px;">Order Placed</div>
              <div style="font-weight: 700;">${new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <div>
              <div style="color: #565959; text-transform: uppercase; font-size: 11px;">Total</div>
              <div style="font-weight: 700;">$${order.total_amount.toFixed(2)}</div>
            </div>
            <div>
              <div style="color: #565959; text-transform: uppercase; font-size: 11px;">Ship To</div>
              <div style="font-weight: 700; color: var(--amz-link);">${escapeHtml(order.customer_name)}</div>
            </div>
            <div>
              <div style="color: #565959; text-transform: uppercase; font-size: 11px;">Order # ${order.order_number}</div>
              <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-weight: 700; font-size: 11px; background: ${order.status === 'Delivered' ? '#e6f4ea' : '#fff3e0'}; color: ${order.status === 'Delivered' ? '#137333' : '#e65100'};">
                ● ${order.status}
              </span>
            </div>
          </div>
          <div style="padding: 16px;">
            ${(order.items || []).map(item => `
              <div style="display: flex; gap: 16px; margin-bottom: 12px; align-items: center;">
                <img src="${escapeHtml(item.product_image)}" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid #eee; border-radius: 4px;">
                <div style="flex: 1;">
                  <h4 style="font-size: 14px; font-weight: 600;">${escapeHtml(item.product_title)}</h4>
                  <div style="font-size: 13px; color: #565959;">Qty: ${item.quantity} | Unit Price: $${item.unit_price.toFixed(2)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h3 style="font-size: 18px; margin-bottom: 6px;">No orders found</h3>
          <p style="color: #666; font-size: 14px;">Looks like you haven't placed any orders yet.</p>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = '<div style="color: red; text-align: center;">Error loading orders.</div>';
  }
}

// -------------------------------------------------------------
// ADMIN DASHBOARD
// -------------------------------------------------------------
async function openAdminModal() {
  const modal = document.getElementById('adminModal');
  if (!modal) return;
  modal.classList.add('open');
  loadAdminStats();
  loadAdminProducts();
  loadAdminOrders();
}

async function loadAdminStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    if (data.success) {
      const s = data.stats;
      document.getElementById('statRevenue').textContent = `$${s.total_revenue.toLocaleString()}`;
      document.getElementById('statOrders').textContent = s.total_orders;
      document.getElementById('statProducts').textContent = s.total_products;
      document.getElementById('statUsers').textContent = s.total_users;
    }
  } catch (err) {
    console.error('Error fetching admin stats:', err);
  }
}

async function loadAdminProducts() {
  const container = document.getElementById('adminProductsTableBody');
  if (!container) return;

  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) {
      container.innerHTML = data.products.map(p => `
        <tr>
          <td><img src="${escapeHtml(p.image_url)}" style="width: 36px; height: 36px; object-fit: contain;"></td>
          <td style="font-weight: 600; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(p.title)}</td>
          <td>${escapeHtml(p.category)}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>${p.in_stock ? '<span style="color: green;">In Stock</span>' : '<span style="color: red;">Out of Stock</span>'}</td>
          <td>
            <button onclick="deleteProduct(${p.id})" style="background: #b12704; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Delete</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadAdminOrders() {
  const container = document.getElementById('adminOrdersTableBody');
  if (!container) return;

  try {
    const res = await fetch('/api/orders');
    const data = await res.json();
    if (data.success) {
      container.innerHTML = data.orders.map(o => `
        <tr>
          <td style="font-family: monospace;">${o.order_number}</td>
          <td>${escapeHtml(o.customer_name)}</td>
          <td>$${o.total_amount.toFixed(2)}</td>
          <td>
            <select onchange="changeOrderStatus(${o.id}, this.value)" style="padding: 4px; border-radius: 4px; font-size: 12px;">
              <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleAddProduct(e) {
  e.preventDefault();
  const title = document.getElementById('newProdTitle').value.trim();
  const category = document.getElementById('newProdCategory').value;
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const original_price = parseFloat(document.getElementById('newProdOriginalPrice').value || price);
  const image_url = document.getElementById('newProdImage').value.trim();
  const description = document.getElementById('newProdDesc').value.trim();
  const badge = document.getElementById('newProdBadge').value.trim();

  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, price, original_price, image_url, description, badge })
    });
    const data = await res.json();
    if (data.success) {
      showToast('New product added to inventory!', 'success');
      document.getElementById('addProductForm').reset();
      loadAdminProducts();
      loadAdminStats();
      loadProducts();
    } else {
      showToast(data.error || 'Failed to add product', 'error');
    }
  } catch (err) {
    showToast('Network error adding product', 'error');
  }
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to permanently delete this product?')) return;
  try {
    const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Product deleted from inventory', 'info');
      loadAdminProducts();
      loadAdminStats();
      loadProducts();
    }
  } catch (err) {
    showToast('Failed to delete product', 'error');
  }
}

async function changeOrderStatus(orderId, status) {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Order status updated to: ${status}`, 'success');
      loadAdminOrders();
    }
  } catch (err) {
    showToast('Failed to update order status', 'error');
  }
}

// -------------------------------------------------------------
// EVENT LISTENERS & MODAL UTILITIES
// -------------------------------------------------------------
function setupEventListeners() {
  // Search Form
  const searchForm = document.getElementById('navSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('navSearchInput');
      const catSelect = document.getElementById('searchCategorySelect');
      state.searchQuery = input ? input.value.trim() : '';
      if (catSelect) state.currentCategory = catSelect.value;
      loadProducts();
    });
  }

  // Sort Select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      loadProducts();
    });
  }

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // Cart Drawer close when clicking overlay
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
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

