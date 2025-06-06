// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data
const products = {
    'coconut-vanilla-100g': {
        name: 'Coconut and Vanilla Soap',
        mass: '100g',
        price: 1.80,
        description: 'The beautiful creamy Coconut fragrance is intoxicating with notes of fresh coconut and warm vanilla. This luxurious soap is perfect for daily use and leaves your skin feeling soft and moisturised.',
        image: 'resources/coconut-vanilla.png'
    },
    'coconut-vanilla-200g': {
        name: 'Coconut and Vanilla Soap',
        mass: '200g',
        price: 2.75,
        description: 'The beautiful creamy Coconut fragrance is intoxicating with notes of fresh coconut and warm vanilla. This luxurious soap is perfect for daily use and leaves your skin feeling soft and moisturised.',
        image: 'resources/coconut-vanilla.png'
    },
    'almond-milk-100g': {
        name: 'Almond Milk Soap',
        mass: '100g',
        price: 1.80,
        description: 'Almond milk is a very good daily beauty bar that cleanses gently while nourishing your skin. Rich in vitamins and minerals, this soap is perfect for sensitive skin types.',
        image: 'resources/almond-milk.png'
    },
    'almond-milk-200g': {
        name: 'Almond Milk Soap',
        mass: '200g',
        price: 2.75,
        description: 'Almond milk is a very good daily beauty bar that cleanses gently while nourishing your skin. Rich in vitamins and minerals, this soap is perfect for sensitive skin types.',
        image: 'resources/almond-milk.png'
    },
    'frangipani-100g': {
        name: 'Frangipani Soap',
        mass: '100g',
        price: 1.80,
        description: 'Relaxing frangipani scent for a calming experience. This soap combines the soothing properties of frangipani essential oil with our natural soap base for a truly therapeutic bathing experience.',
        image: 'resources/frangipani.png'
    },
    'frangipani-200g': {
        name: 'Frangipani Soap',
        mass: '200g',
        price: 2.75,
        description: 'Relaxing frangipani scent for a calming experience. This soap combines the soothing properties of frangipani essential oil with our natural soap base for a truly therapeutic bathing experience.',
        image: 'resources/frangipani.png'
    }
};

// Initialise the page
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    setupProductGrid();
    
    // Set up event listeners
    document.getElementById('cart-icon')?.addEventListener('click', toggleCart);
    document.getElementById('close-cart')?.addEventListener('click', toggleCart);
    document.getElementById('checkout-btn')?.addEventListener('click', proceedToCheckout);
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the card's click event
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            addToCart(productId, productName, productPrice);
        });
    });
    
    // Product detail page specific functionality
    if (document.getElementById('add-to-cart-detail')) {
        setupProductDetailPage();
    }
    
    // Checkout form submission
    document.getElementById('checkout-form')?.addEventListener('submit', processOrder);
    
    // Quantity controls
    document.getElementById('increase-quantity')?.addEventListener('click', function() {
        changeQuantity(1);
    });
    
    document.getElementById('decrease-quantity')?.addEventListener('click', function() {
        changeQuantity(-1);
    });
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle')?.addEventListener('click', function() {
        const sidebar = document.getElementById('mobile-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    });

    // Close sidebar when clicking close button
    document.getElementById('close-sidebar')?.addEventListener('click', function() {
        closeSidebar();
    });

    // Close sidebar when clicking overlay
    document.getElementById('sidebar-overlay')?.addEventListener('click', function() {
        closeSidebar();
    });

    // Close sidebar function
    function closeSidebar() {
        const sidebar = document.getElementById('mobile-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
});

function setupProductGrid() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; // Clear existing content

    Object.entries(products).forEach(([id, product]) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = id; // Store product ID on the card
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                ${product.mass ? `<p class="product-mass">${product.mass}</p>` : ''}
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" 
                    data-id="${id}" 
                    data-name="${product.name}${product.mass ? ' ' + product.mass : ''}" 
                    data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        `;

        productGrid.appendChild(productCard);
    });

    // Single event listener for the entire grid
    productGrid.addEventListener('click', function(e) {
        // Handle card clicks (navigation to product detail)
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            const productId = card.dataset.productId;
            window.location.href = `product-detail.html?product=${productId}`;
        }
        
        // Handle add to cart button clicks
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target;
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            addToCart(productId, productName, productPrice);
        }
    });
}

// Product detail page setup
// Product detail page setup
function setupProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId && products[productId]) {
        const product = products[productId];
        document.getElementById('product-detail-name').textContent = product.name;
        document.getElementById('product-detail-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-detail-mass').textContent = `${product.mass}`;
        document.getElementById('product-detail-description').textContent = product.description;
        document.getElementById('product-breadcrumb').textContent = product.name;
        
        // Set the product image
        document.getElementById('product-detail-img').src = product.image;
        document.getElementById('product-detail-img').alt = product.name;
        
        // Load related products
        loadRelatedProducts(productId);
        
        document.getElementById('add-to-cart-detail').addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(productId, product.name, product.price, quantity);
        });
    } else {
        // Product not found, redirect to products page
        window.location.href = 'products.html';
    }
}

// Function to load related products
function loadRelatedProducts(currentProductId) {
    const currentProduct = products[currentProductId];
    const relatedProductsGrid = document.getElementById('related-products-grid');
    
    if (!currentProduct || !relatedProductsGrid) return;
    
    // Find products with the same name but different mass (variants)
    const relatedProducts = Object.entries(products).filter(([id, product]) => {
        return id !== currentProductId && 
               product.name === currentProduct.name && 
               product.mass !== currentProduct.mass;
    });
    
    // If no variants found, get random products from different soap types
    if (relatedProducts.length === 0) {
        const otherProducts = Object.entries(products).filter(([id, product]) => {
            return id !== currentProductId && product.name !== currentProduct.name;
        });
        
        // Get up to 3 random other products
        const shuffled = otherProducts.sort(() => 0.5 - Math.random());
        relatedProducts.push(...shuffled.slice(0, 3));
    }
    
    // Clear existing content
    relatedProductsGrid.innerHTML = '';
    
    // Add related products to the grid
    relatedProducts.forEach(([id, product]) => {
        const productElement = document.createElement('div');
        productElement.className = 'related-product-item';
        productElement.onclick = () => {
            window.location.href = `product-detail.html?product=${id}`;
        };
        
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="related-product-name">${product.name}</div>
            <div class="related-product-mass">${product.mass}</div>
            <div class="related-product-price">$${product.price.toFixed(2)}</div>
        `;
        
        relatedProductsGrid.appendChild(productElement);
    });
    
    // Hide the section if no related products
    const relatedSection = document.querySelector('.related-products');
    if (relatedProducts.length === 0) {
        relatedSection.style.display = 'none';
    } else {
        relatedSection.style.display = 'block';
    }
}

// Quantity controls
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    let newValue = currentValue + change;
    
    if (newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

// Add to cart functionality
function addToCart(productId, productName, price, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showCartMessage();
    
    // Open cart when adding an item
    if (!document.getElementById('cart-sidebar').classList.contains('open')) {
        toggleCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartUI();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cart UI update
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            <button onclick="removeFromCart('${item.id}')" style="margin-left: 10px; color: red;">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (checkoutTotal) checkoutTotal.textContent = total.toFixed(2);
    
    // Update checkout items
    if (checkoutItems) {
        checkoutItems.innerHTML = cart.map(item => `
            <div style="color: #666; font-size: 0.9rem; line-height: 1.2rem; display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
}

// Cart toggle
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
        cartOverlay.style.display = 'none';
    } else {
        cartSidebar.classList.add('open');
        cartOverlay.style.display = 'block';
    }
}

// Checkout functionality
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Order processing
function processOrder(event) {
    if (event) event.preventDefault();
    
    // Simulate order processing
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('loading');
    }
    
    setTimeout(() => {
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Show thank you page
        window.location.href = 'thank-you.html';
    }, 1000);
}

// Show cart message
function showCartMessage() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

/* ANIMATIONS */
// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background Change on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Scroll Animation for Elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .story-content, .features .feature');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialise scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.product-card, .story-content, .features .feature');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run animation on load
    animateOnScroll();
});

// CTA Button Click Handler
document.querySelector('.cta-button').addEventListener('click', function() {
    // Scroll to products section
    const productsSection = document.getElementById('products');
    const offsetTop = productsSection.offsetTop - 80;
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
});

// Product Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Read More Button Functionality
document.querySelector('.read-more-btn').addEventListener('click', function() {
    const storyText = document.querySelector('.story-text');
    const fullText = `
        <p>After many years of attending many markets with our beautiful soaps and other products, we have our website operating. </p>

        <p>During the many COVID-19 lockdowns, we were able continue serving our valued customers thru our website. We subsidised the postal cost making it easy for our customers to still be able to obtain our soaps. We also operate our shop at Dandenong Market, Stalls B1-2 in the Bazaar area. </p>
        
        <p>We were able to expand our products to a large range of incense Sticks. Incense cones and resins. Added essential and fragrance oils. We also have a beautiful selection of crystals and stones. Handmade jewelry with our beautiful crystal set in sterling Silver. </p>

        <p>Our shop has a lovely relaxing atmosphere with the soft music in the background.  Come and visit us.</p>
        
    `;
    
    if (this.textContent === 'Read More') {
        storyText.innerHTML = fullText + '<button class="read-more-btn">Read Less</button>';
        this.textContent = 'Read Less';
    } else {
        storyText.innerHTML = `
            <p>After many years of attending many markets with our beautiful soaps and other products, we have our website operating. During the many COVID-19 lockdowns, we were able continue serving our valued customers thru our website. We subsidised the postal cost making it easy for our customers to still be able to obtain our soaps. We also operate our shop at Dandenong Market, Stalls B1-2 in the Bazaar area. We were able to expand our products to a large range of incense Sticks. Incense cones and resins. Added essential and fragrance oils. We also have... </p>
            
            <button class="read-more-btn">Read More</button>
        `;
    }
    
    // Re-attach event listener to new button
    document.querySelector('.read-more-btn').addEventListener('click', arguments.callee);
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});