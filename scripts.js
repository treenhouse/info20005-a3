// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data
const products = {
    'coconut-vanilla': {
        name: 'Coconut and Vanilla Soap',
        price: 8.99,
        description: 'The beautiful creamy Coconut fragrance is intoxicating with notes of fresh coconut and warm vanilla. This luxurious soap is perfect for daily use and leaves your skin feeling soft and moisturized.',
        image: '/resources/COCONUT_and_VANILLA_SOAP_100g.png'
    },
    'almond-milk': {
        name: 'Almond Milk Soap',
        price: 8.99,
        description: 'Almond milk is a very good daily beauty bar that cleanses gently while nourishing your skin. Rich in vitamins and minerals, this soap is perfect for sensitive skin types.',
        image: 'Almond Milk Soap - Gentle beige colored bar with almond essence'
    },
    'lavender': {
        name: 'Lavender Soap',
        price: 8.99,
        description: 'Relaxing lavender scent for a calming experience. This soap combines the soothing properties of lavender essential oil with our natural soap base for a truly therapeutic bathing experience.',
        image: 'Lavender Soap - Purple-tinted bar with dried lavender petals'
    },
    'eucalyptus': {
        name: 'Eucalyptus Soap',
        price: 8.99,
        description: 'Refreshing eucalyptus for an invigorating clean. This energizing soap is perfect for morning use and helps clear your mind while cleansing your skin.',
        image: 'Eucalyptus Soap - Green-tinted bar with eucalyptus leaves'
    },
    'tea-tree': {
        name: 'Tea Tree Soap',
        price: 9.99,
        description: 'Antibacterial tea tree oil for problem skin. This therapeutic soap helps combat acne and other skin conditions while providing a deep, purifying cleanse.',
        image: 'Tea Tree Soap - Natural colored bar with tea tree oil'
    },
    'oatmeal': {
        name: 'Oatmeal Soap',
        price: 8.99,
        description: 'Gentle exfoliating oatmeal for sensitive skin. This soap provides mild exfoliation while being gentle enough for daily use on even the most sensitive skin.',
        image: 'Oatmeal Soap - Beige bar with visible oatmeal pieces'
    }
};

// Initialise the page
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Set up event listeners
    document.getElementById('cart-icon')?.addEventListener('click', toggleCart);
    document.getElementById('close-cart')?.addEventListener('click', toggleCart);
    document.getElementById('checkout-btn')?.addEventListener('click', proceedToCheckout);
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
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
        alert('Mobile menu functionality would be implemented here');
    });
});

// Product detail page setup
function setupProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId && products[productId]) {
        const product = products[productId];
        document.getElementById('product-detail-name').textContent = product.name;
        document.getElementById('product-detail-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-detail-description').textContent = product.description;
        document.getElementById('product-breadcrumb').textContent = product.name;
        
        // Set the product image
        document.getElementById('product-detail-img').src = `resources/${productId}.png`;
        document.getElementById('product-detail-img').alt = product.name;
        
        document.getElementById('add-to-cart-detail').addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(productId, product.name, product.price, quantity);
        });
    } else {
        // Product not found, redirect to products page
        window.location.href = 'products.html';
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
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
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

// Initialize scroll animations
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
        <p>At Australian Natural Soap, we believe that skincare should be simple, natural, and free from harmful chemicals. Our journey began with a passion for sustainable living and a love for Triple Milled Soap.</p>
        
        <p>Frustrated with mass-produced soaps filled with synthetic ingredients, we set out to create something better. Using traditional soap-making methods and the finest natural ingredients sourced from across Australia, we craft each bar with care and attention to detail.</p>
        
        <p>Our commitment to sustainability extends beyond our products. We use eco-friendly packaging, support local suppliers, and ensure our manufacturing processes have minimal environmental impact. Every purchase supports Australian communities and sustainable practices.</p>
        
        <p>Today, Australian Natural Soap continues to grow while maintaining our core values of quality, sustainability, and natural beauty. We're proud to bring you soaps that not only care for your skin but also care for our planet.</p>
    `;
    
    if (this.textContent === 'Read More') {
        storyText.innerHTML = fullText + '<button class="read-more-btn">Read Less</button>';
        this.textContent = 'Read Less';
    } else {
        storyText.innerHTML = `
            <p>At Australian Natural Soap, we believe that skincare should be simple, natural, and free from harmful chemicals. Our journey began with a passion for sustainable living and a love for Triple Milled Soap.</p>
            
            <p>Frustrated with mass-produced soaps filled with synthetic ingredients, we set out to create...</p>
            
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