
// Cart functionality
let cart = [];
let currentProduct = null;

// Product data
const soaps = {
    'coconut-vanilla': {
        name: 'Coconut and Vanilla Soap',
        price: 8.99,
        description: 'The beautiful creamy Coconut fragrance is intoxicating with notes of fresh coconut and warm vanilla. This luxurious soap is perfect for daily use and leaves your skin feeling soft and moisturized.',
        image: 'Coconut and Vanilla Soap - Creamy white bar with natural ingredients'
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

// Page navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Close cart if open
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    cartSidebar.classList.remove('open');
    cartOverlay.style.display = 'none';
}

// Product detail functionality
function showProduct(productId) {
    currentProduct = productId;
    const product = soaps[productId];
    
    if (product) {
        document.getElementById('product-detail-name').textContent = product.name;
        document.getElementById('product-detail-price').textContent = `${product.price.toFixed(2)}`;
        document.getElementById('product-detail-description').textContent = product.description;
        document.getElementById('product-detail-image').textContent = product.image;
        document.getElementById('product-breadcrumb').textContent = product.name;
        document.getElementById('quantity').value = 1;
        
        showPage('product-detail');
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
function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartMessage();
}

function addToCartFromDetail() {
    if (currentProduct) {
        const product = soaps[currentProduct];
        const quantity = parseInt(document.getElementById('quantity').value);
        
        const existingItem = cart.find(item => item.id === currentProduct);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: currentProduct,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        
        updateCartUI();
        showCartMessage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
        }
    }
}

// Cart UI update
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
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
                    <div class="cart-item-price">${item.price.toFixed(2)}</div>
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
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
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
    
    // Update checkout summary
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${item.name} × ${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = total.toFixed(2);
    
    showPage('checkout');
}

// Order processing
function processOrder(event) {
    event.preventDefault();
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        updateCartUI();
        
        // Show thank you page
        showPage('thank-you');
    }, 1000);
}

// Show cart message
function showCartMessage() {
    // Simple notification (you could enhance this with a toast notification)
    const originalText = document.querySelector('.cart-count').textContent;
    const cartCount = document.querySelector('.cart-count');
    cartCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

// Mobile menu toggle (placeholder for future enhancement)
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    // Toggle mobile menu - placeholder for future enhancement
    alert('Mobile menu functionality would be implemented here');
});

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});

// Add some CSS for cart item controls
const additionalStyles = `
    <style>
        .cart-item-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .cart-item-controls button {
            background: #5a7c65;
            color: white;
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .cart-item-controls button:hover {
            background: #4a6b55;
        }
        
        .cart-item-controls span {
            min-width: 20px;
            text-align: center;
        }
        
        .total-line {
            border-top: 2px solid #5a7c65;
            padding-top: 1rem;
            margin-top: 1rem;
            font-size: 1.2rem;
        }
        
        .checkout-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        /* Better mobile cart experience */
        @media (max-width: 480px) {
            .cart-item {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .cart-item-info {
                width: 100%;
            }
            
            .cart-item-controls {
                justify-content: space-between;
            }
        }
        
        /* Form validation styles */
        .form-group input:invalid,
        .form-group select:invalid {
            border-color: #e74c3c;
        }
        
        .form-group input:valid,
        .form-group select:valid {
            border-color: #27ae60;
        }
        
        /* Loading state for checkout */
        .checkout-btn.loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .checkout-btn.loading::after {
            content: " Processing...";
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Initialise when document is ready
document.addEventListener('DOMContentLoaded', initializeApp);