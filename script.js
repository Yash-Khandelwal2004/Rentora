(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // User Authentication
  const USER_KEY = 'rentx_user';
  let currentUser = null;

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  }

  function setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      currentUser = user;
    } else {
      localStorage.removeItem(USER_KEY);
      currentUser = null;
    }
    updateUserUI();
  }

  function updateUserUI() {
    const loginBtn = $('#loginBtn');
    const userDropdown = $('#userDropdown');
    const userAvatar = $('#userAvatar');
    const userName = $('#userName');
    
    if (currentUser) {
      // User is logged in
      if (loginBtn) loginBtn.style.display = 'none';
      if (userDropdown) userDropdown.style.display = 'block';
      
      // Set user avatar/initial
      if (userAvatar) {
        if (currentUser.avatar) {
          userAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}">`;
        } else {
          // Use first initial as fallback
          const initial = currentUser.name.charAt(0).toUpperCase();
          userAvatar.textContent = initial;
        }
      }
      
      if (userName) {
        userName.textContent = currentUser.name;
      }
    } else {
      // User is not logged in
      if (loginBtn) loginBtn.style.display = 'block';
      if (userDropdown) userDropdown.style.display = 'none';
    }
  }

  function initAuth() {
    // Check if user is already logged in
    currentUser = getUser();
    updateUserUI();
    
    // Handle login form submission
    const loginForm = $('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('#loginEmail').value;
        const password = $('#loginPassword').value;
        
        // Simple validation - in a real app, you'd verify credentials with a server
        if (email && password) {
          // For demo purposes, create a user object
          const user = {
            id: 'user_' + Date.now(),
            email: email,
            name: email.split('@')[0], // Use part of email as name
            avatar: null
          };
          
          setUser(user);
          toast('Logged in successfully!');
          
          // Redirect to home page after a brief delay
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 100);
        }
      });
    }
    
    // Handle signup form submission
    const signupForm = $('#signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#signupName').value;
        const email = $('#signupEmail').value;
        const password = $('#signupPassword').value;
        const confirmPassword = $('#signupConfirmPassword').value;
        
        // Simple validation
        if (password !== confirmPassword) {
          toast('Passwords do not match!');
          return;
        }
        
        if (name && email && password) {
          // For demo purposes, create a user object
          const user = {
            id: 'user_' + Date.now(),
            email: email,
            name: name,
            avatar: null
          };
          
          setUser(user);
          toast('Account created successfully!');
          
          // Redirect to home page after a brief delay
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 100);
        }
      });
    }
    
    // Handle logout
    const logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setUser(null);
        toast('Logged out successfully!');
      });
    }
  }

  // Theme
    const THEME_KEY = 'rentora_theme';
  function applyTheme(theme){
    if(theme==='dark'){ document.documentElement.classList.add('dark'); }
    else { document.documentElement.classList.remove('dark'); }
  }
  function initTheme(){
    const toggle = $('#themeToggle');
    const input = $('#themeToggle .input');
    if(input){
      // Set initial state of the checkbox based on the <html> class
      input.checked = document.documentElement.classList.contains('dark');
      input.addEventListener('change', ()=>{
        const next = input.checked ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }
  }

  // Nav
  function initNav(){
    const links = $$('.nav-links > a:not(.dropdown-item)');
    const path = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a=>{
      if(a.getAttribute('href')===path){ a.classList.add('active'); }
    });
    // Toggle mobile menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    // User dropdown functionality
    const userDropdownBtn = document.querySelector('.user-dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (userDropdownBtn && dropdownMenu) {
      // Toggle dropdown on button click
      userDropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = userDropdownBtn.getAttribute('aria-expanded') === 'true';
        userDropdownBtn.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.style.display = isExpanded ? 'none' : 'block';
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!userDropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
          userDropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.style.display = 'none';
        }
      });

      // Handle keyboard navigation
      userDropdownBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isExpanded = userDropdownBtn.getAttribute('aria-expanded') === 'true';
          userDropdownBtn.setAttribute('aria-expanded', !isExpanded);
          dropdownMenu.style.display = isExpanded ? 'none' : 'block';
          
          if (!isExpanded) {
            // Focus first item when opening
            const firstItem = dropdownMenu.querySelector('.dropdown-item');
            if (firstItem) firstItem.focus();
          }
        } else if (e.key === 'Escape') {
          userDropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.style.display = 'none';
          userDropdownBtn.focus();
        }
      });

      // Handle keyboard navigation within dropdown
      dropdownMenu.addEventListener('keydown', (e) => {
        const items = Array.from(dropdownMenu.querySelectorAll('.dropdown-item'));
        const currentItem = document.activeElement;
        const currentIndex = items.indexOf(currentItem);

        if (e.key === 'Escape') {
          userDropdownBtn.setAttribute('aria-expanded', 'false');
          dropdownMenu.style.display = 'none';
          userDropdownBtn.focus();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].focus();
        }
      });
    }
    hamburger && hamburger.addEventListener('click', ()=> navLinks.classList.toggle('show'));
    // Year
    const yearEl = $('#year'); if(yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Cart storage
  const CART_KEY = 'rentx_cart';
  function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch{ return [] } }
  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartPill(); }
  function updateCartPill(){
    const count = getCart().reduce((n,i)=>n+i.qty,0);
    const pill = $('#nav-cart-count'); if(pill){ pill.textContent = count; }

    // Update floating cart button
    const cartBtn = $('.btn-cart');
    if (cartBtn) {
      cartBtn.dataset.quantity = count;
      const quantityEl = $('.quantity', cartBtn);
      if (quantityEl) {
        quantityEl.textContent = count;
      }
    }
  }
  function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.qty += item.qty || 1;
    } else {
        cart.push({ ...item, qty: item.qty || 1 });
    }
    saveCart(cart);
    toast('Added to cart');
}
  function removeFromCart(id){
    const cart = getCart().filter(i=>i.id!==id);
    saveCart(cart);
    renderCart();
  }
  function changeQty(id, delta){
    const cart = getCart();
    const idx = cart.findIndex(i=>i.id===id);
    if(idx > -1){
      const newQty = cart[idx].qty + delta;
      if (newQty < 1) {
        removeFromCart(id);
      } else {
        cart[idx].qty = newQty;
        saveCart(cart);
        renderCart();
      }
    }
  }

  // Products data (demo)
  const PRODUCTS = [
    {id:'p1', title:'Wireless Headphones', cat:'electronics', price:149, thumb:'🎧', img:'', desc:'Over-ear, noise isolated', featured: true},
    {id:'p2', title:'Power Bank 20,000mAh', cat:'electronics', price:79, thumb:'🔋', img:'', desc:'Fast charging, USB-C'},
    {id:'p3', title:'Smartwatch', cat:'electronics', price:129, thumb:'⌚', img:'', desc:'Fitness + notifications'},
    {id:'p4', title:'Induction Cooktop', cat:'utilities', price:99, thumb:'🍳', img:'', desc:'1200W portable', featured: true},
    {id:'p5', title:'Electric Kettle', cat:'utilities', price:39, thumb:'🫖', img:'', desc:'1.8L auto-off'},
    {id:'p6', title:'Steam Iron', cat:'utilities', price:29, thumb:'👕', img:'', desc:'Non-stick soleplate'},
    {id:'p7', title:'Dumbbells (Pair)', cat:'fitness', price:49, thumb:'🏋️', img:'', desc:'Adjustable 2–10kg', featured: true},
    {id:'p8', title:'Yoga Mat', cat:'fitness', price:19, thumb:'🧘', img:'', desc:'6mm TPE comfort'},
    {id:'p9', title:'Resistance Bands', cat:'fitness', price:15, thumb:'🪢', img:'', desc:'Set of 5 levels'},
  ];

  // Render products page
  function renderProducts(){
    const grid = $('#productsGrid');
    if(!grid) return;
    const search = $('#productSearch');
    const filterBtns = $$('.filter-btn');
    let currentFilter = 'all';
    function draw(){
      const q = (search?.value || '').toLowerCase();
      grid.innerHTML = '';
      PRODUCTS.filter(p => {
        const matchesFilter = currentFilter === 'all' ? true : (currentFilter === 'featured' ? p.featured : p.cat === currentFilter);
        const matchesSearch = (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
        return matchesFilter && matchesSearch;
      })
      .forEach(p=>{
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-thumb">${p.thumb}</div>
          <div class="product-body">
            <div class="product-meta">
              <h4>${p.title}</h4>
              <span class="item-price">₹${p.price}/day</span>
            </div>
            <p>${p.desc}</p>
            <div class="product-actions">
              <button class="btn btn-primary add-btn">Add to Cart</button>
            </div>
          </div>`;
        const addButton = card.querySelector('.add-btn');
        addButton.addEventListener('click', (e)=> {
            e.stopPropagation(); // Prevent card click from firing
            addToCart({id:p.id, title:p.title, price:p.price, img:p.img, thumb:p.thumb, qty: 1});
        });

        // Add click listener to the card itself to show the modal
        card.addEventListener('click', () => showProductModal(p));

        grid.appendChild(card);
      });
    }
    search && search.addEventListener('input', draw);
    filterBtns.forEach(b=> b.addEventListener('click', ()=>{
      filterBtns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      currentFilter = b.dataset.filter;
      draw();
    }));
    draw();
  }

  // Product Detail Modal
  function showProductModal(product) {
    const modal = $('#productModal');
    if (!modal) return;

    // Populate modal content
    $('.modal-thumb', modal).textContent = product.thumb;
    $('.modal-title', modal).textContent = product.title;
    $('.modal-desc', modal).textContent = product.desc;
    $('.modal-price', modal).textContent = `₹${product.price}/day`;

    // Handle 'Add to Cart' from modal
    const addButton = $('.add-btn', modal);
    const newAddButton = addButton.cloneNode(true); // Clone to remove old listeners
    addButton.parentNode.replaceChild(newAddButton, addButton);
    newAddButton.addEventListener('click', () => {
        addToCart({id:product.id, title:product.title, price:product.price, img:product.img, thumb:product.thumb, qty: 1});
        hideProductModal();
    });

    modal.classList.add('show');
  }

  function hideProductModal() {
    const modal = $('#productModal');
    if (modal) {
        modal.classList.remove('show');
    }
  }

  function initProductModal() {
    const modal = $('#productModal');
    const closeBtn = $('#modalCloseBtn');
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', hideProductModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Close if clicking on the overlay
                hideProductModal();
            }
        });
    }
  }

  // Render cart page
  function renderCart(){
    const wrap = $('#cartItems');
    const summary = $('#cartSummary');
    const empty = $('#emptyCart');
    if(!wrap || !summary) return;
    const cart = getCart();
    if(cart.length===0){
      wrap.innerHTML = '';
      summary.innerHTML = '';
      if(empty) empty.style.display = 'block';
      return;
    } else if(empty){ empty.style.display = 'none'; }

    wrap.innerHTML = '';
    let subtotal = 0;
    
    // Function to update cart item days and refresh cart
    const updateItemDays = (id, days) => {
      const cart = getCart();
      const item = cart.find(item => item.id === id);
      if (item) {
        item.days = Math.max(1, parseInt(days) || 1);
        saveCart(cart);
        renderCart();
      }
    };
    
    cart.forEach(it=>{
      const itemTotal = it.price * it.qty * (it.days || 1);
      subtotal += itemTotal;
      const row = document.createElement('div');
      row.className = 'cart-item';
      // Set default days to 1 if not already set
      if (typeof it.days === 'undefined') it.days = 1;
      
      row.innerHTML = `
        <div class="item-image"><div class="product-thumb">${it.thumb||'📦'}</div></div>
        <div class="item-details">
          <h3>${it.title}</h3>
          <div class="item-meta">
            <div class="quantity-controls">
              <span>Qty: </span>
              <button class="qty-btn" data-act="dec">-</button>
              <span class="qty-display">${it.qty}</span>
              <button class="qty-btn" data-act="inc">+</button>
            </div>
            <div class="days-selector">
              <label>Days: </label>
              <input type="number" min="1" value="${it.days || 1}" class="days-input" data-id="${it.id}">
            </div>
          </div>
          <div class="item-price">₹${it.price}/day</div>
          <div class="item-total">Total: ₹${it.price * it.qty * (it.days || 1)}</div>
        </div>
        <div class="item-actions">
          <button class="remove-btn btn" data-act="remove">Remove</button>
        </div>`;
      row.querySelector('[data-act="dec"]').addEventListener('click', ()=> changeQty(it.id, -1));
      row.querySelector('[data-act="inc"]').addEventListener('click', ()=> changeQty(it.id, +1));
      row.querySelector('[data-act="remove"]').addEventListener('click', ()=> removeFromCart(it.id));
      
      // Add event listener for days input
      const daysInput = row.querySelector('.days-input');
      if (daysInput) {
        daysInput.addEventListener('change', (e) => {
          updateItemDays(it.id, e.target.value);
        });
      }
      
      wrap.appendChild(row);
    });

    const shipping = subtotal > 0 ? 19 : 0;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    
    // Save the updated cart with days
    saveCart(cart);

    summary.innerHTML = `
          <h3>Summary</h3>
      <div class="summary-line"><span>Subtotal</span><strong>₹${subtotal}</strong></div>
      <div class="summary-line"><span>Shipping</span><span>₹${shipping}</span></div>
      <div class="summary-line"><span>GST (18%)</span><span>₹${tax}</span></div>
      <div class="summary-line total"><span>Total</span><span>₹${total}</span></div>
      <div class="cart-actions">
        <a class="btn" href="products.html">Continue Shopping</a>
        <a href="checkout.html" class="btn btn-primary" id="checkoutBtn">Proceed to Checkout</a>
      </div>`;
    const checkout = $('#checkoutBtn');
    checkout && checkout.addEventListener('click', ()=>{
      // alert('Demo checkout — not implemented');
    });
  }

  // Rentals tabs
  function initTabs(){
    const btns = $$('.tab-btn');
    const panes = $$('.tab-pane');
    btns.forEach(b=> b.addEventListener('click', ()=>{
      btns.forEach(x=>x.classList.remove('active'));
      panes.forEach(p=>p.classList.remove('active'));
      b.classList.add('active');
      $('#tab-'+b.dataset.tab).classList.add('active');
    }));
  }

  // FAQ toggle
  function initFAQ(){
    $$('.faq-item').forEach(item=>{
      const q = $('.faq-question', item);
      q && q.addEventListener('click', ()=> item.classList.toggle('active'));
    });
  }

  // Toast
  let toastTimer=null;
  function toast(msg){
    let t = $('.toast');
    if(!t){
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> t.classList.remove('show'), 180);
  }

  // Contact form
  function initContact(){
    const form = $('#contactForm');
    const note = $('#contactNotice');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      note.style.display = 'block';
      form.reset();
    });
  }

  // Categories -> pass selected filter (optional enhancement)
  function initCategoryLinks(){
    $$('.category-card').forEach(c=> c.addEventListener('click', (e)=>{
      const cat = c.dataset.cat;
      // Save a hint for products page to pre-filter
      localStorage.setItem('rentx_prefilter', cat);
    }));
  }

  // Page transitions
  function initPageTransitions(){
    const links = $$('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      // Only apply to internal, non-hash links
      if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          document.body.classList.add('fade-out');
          setTimeout(() => {
            window.location.href = href;
          }, 100); // Match CSS transition duration
        });
      }
    });
  }

  // On load
  document.addEventListener('DOMContentLoaded', ()=>{
    document.body.classList.add('fade-in');
    initPageTransitions();
    initTheme();
    initNav();
    initAuth(); // Initialize authentication
    initContact();
    initFAQ();
    initTabs();
    initProductModal();
    renderProducts();
    renderCart();
    initCategoryLinks();
    updateCartPill();

    // Apply prefilter if set
    const pre = localStorage.getItem('rentx_prefilter');
    if(pre && location.pathname.endsWith('products.html')){
      const btn = document.querySelector(`.filter-btn[data-filter="${pre}"]`);
      if(btn){ btn.click(); localStorage.removeItem('rentx_prefilter'); }
    }
  });
})();






document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");

  // Check login state from localStorage
  function checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // Show user avatar + dropdown
     authLink.innerHTML = `
     <div class="user-dropdown">
    <button class="user-dropdown-btn">
      <div class="user-avatar">
        ${user.avatar ? `<img src="${user.avatar}" alt="avatar">` : user.name.charAt(0).toUpperCase()}
      </div>
    </button>
    <div class="dropdown-menu">
      <a href="cart.html" class="dropdown-item">My Cart</a>
      <a href="#" id="logoutBtn" class="dropdown-item">Logout</a>
    </div>
  </div>
  `;

      // Toggle dropdown
      const dropdownBtn = authLink.querySelector(".user-dropdown-btn");
      const dropdownMenu = authLink.querySelector(".dropdown-menu");
      dropdownBtn.addEventListener("click", () => {
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      });

      // Logout
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        location.reload();
      });
    } else {
      // Show login/signup
      authLink.innerHTML = `<a href="login.html">Login / Signup</a>`;
    }
  }

  // Signup form handling
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify({ name, email }));
      alert("Signup successful!");
      window.location.href = "index.html";
    });
  }

  // Login form handling
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;

      // Get saved user
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.email === email) {
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert("Invalid credentials or user not found!");
      }
    });
  }

  // Run on load
  checkAuth();
});
