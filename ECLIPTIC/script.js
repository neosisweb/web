// script.js
document.addEventListener('DOMContentLoaded', () => {
    // === 1. Custom Cursor Logic ===
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        const cursorSpeed = 0.1;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCustomCursor() {
            const distX = mouseX - cursorX;
            const distY = mouseY - cursorY;
            cursorX += distX * cursorSpeed;
            cursorY += distY * cursorSpeed;
            customCursor.style.left = cursorX + 'px';
            customCursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCustomCursor);
        }
        animateCustomCursor();

        const interactiveElementsForCursor = document.querySelectorAll('a, button, .arrival-item, .product-item-collection, input[type="email"], .product-link-v2, .category-list-v2 a, .product-link-shop');
        interactiveElementsForCursor.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('hovering')); // CSS can style .custom-cursor.hovering
            el.addEventListener('mouseleave', () => customCursor.classList.remove('hovering'));
        });
    }

    // === 2. Scroll Animations for Content Sections ===
    const contentSections = document.querySelectorAll('.content-section');
    if (contentSections.length > 0) {
        const sectionObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, sectionObserverOptions);
        contentSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // === 3. Mobile Navigation Toggle ===
    // Handles different menu toggles if class names vary (e.g., .menu-toggle, .menu-toggle-journal)
    const menuToggles = document.querySelectorAll('.menu-toggle, .menu-toggle-journal');
    menuToggles.forEach(menuToggle => {
        // Try to find a corresponding nav menu. Assumes nav is a sibling or has a common parent.
        // This might need adjustment based on your exact HTML structure for different headers.
        let mainNav = menuToggle.closest('.site-header, .site-header-journal')?.querySelector('.main-nav, .main-nav-journal');

        if (mainNav) {
            menuToggle.addEventListener('click', () => {
                const isActive = mainNav.classList.toggle('is-active');
                if (isActive) {
                    menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                    menuToggle.setAttribute('aria-expanded', 'true');
                } else {
                    menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });


    // === 4. Active Nav Link Styling on Scroll (General) ===
    const navLinks = document.querySelectorAll('.nav-link'); // General nav links
    const pageSections = document.querySelectorAll('main > section[id]'); // Sections in main with an ID
    const siteHeaderGlobal = document.querySelector('.site-header'); // Assuming one main header type for height calculation
    const headerHeight = siteHeaderGlobal ? parseInt(getComputedStyle(siteHeaderGlobal).height) : 70;

    function changeNavOnScroll() {
        let fromTop = window.scrollY + headerHeight + 50; // Offset a bit more
        let currentActive = null;

        pageSections.forEach(section => {
            if (section.offsetTop <= fromTop && (section.offsetTop + section.offsetHeight) > fromTop) {
                currentActive = `#${section.id}`;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Handle base page links (e.g. shop.html) and anchor links (e.g. index.html#home)
            if (href) {
                const linkPath = new URL(href, window.location.origin).pathname + new URL(href, window.location.origin).hash;
                const currentPath = window.location.pathname + (currentActive || window.location.hash || '#home'); // Fallback to #home

                // Check if the link's target matches the current section or if it's the current page's base link
                if (linkPath.endsWith(currentPath) || (currentActive && href.endsWith(currentActive))) {
                    link.classList.add('active');
                } else if (!currentActive && pageYOffset < (pageSections[0]?.offsetTop - headerHeight - 50 || 0) && href.endsWith('#home')) {
                    // Special case for "Home" when at the very top
                     const homeLink = document.querySelector('.nav-link[href$="#home"]'); // More specific selector
                     if (homeLink) homeLink.classList.add('active');
                }
            }
        });
    }
    if (navLinks.length > 0 && pageSections.length > 0) {
        window.addEventListener('scroll', changeNavOnScroll);
        changeNavOnScroll(); // Initial check
    }


    // === 5. Update Current Year in Footer ===
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // === 6. Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute !== '#') { // Ensure it's a valid anchor
                try {
                    const targetElement = document.querySelector(hrefAttribute);
                    if (targetElement) {
                        e.preventDefault();
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight; // Use calculated headerHeight

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });

                        // Close mobile nav if open after click
                        const activeMobileNav = document.querySelector('.main-nav.is-active, .main-nav-journal.is-active');
                        if (activeMobileNav) {
                            activeMobileNav.classList.remove('is-active');
                            const activeMenuToggle = activeMobileNav.closest('.site-header, .site-header-journal')?.querySelector('.menu-toggle, .menu-toggle-journal');
                            if (activeMenuToggle) {
                                activeMenuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
                                activeMenuToggle.setAttribute('aria-expanded', 'false');
                            }
                        }
                    }
                } catch (error) {
                    console.warn(`Smooth scroll target not found or invalid selector: ${hrefAttribute}`, error);
                }
            }
        });
    });

    // === Global Cart Helper Functions ===
    const headerCartCountEl = document.getElementById('headerCartCount');
    const toastMessageEl = document.getElementById('toastMessage');

    function getCart() {
        return JSON.parse(localStorage.getItem('eclipticCart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('eclipticCart', JSON.stringify(cart));
        updateHeaderCartCount();
        // If popup cart is open, re-render it (logic for this is in popup cart section)
        const cartPopupInstance = document.getElementById('cartPopup');
        if (cartPopupInstance && cartPopupInstance.classList.contains('open')) {
            renderPopupCartItems();
        }
    }

    function updateHeaderCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (headerCartCountEl) {
            headerCartCountEl.textContent = totalItems;
        }
    }

    function showToast(message) {
        if (toastMessageEl) {
            toastMessageEl.textContent = message;
            toastMessageEl.classList.add('show');
            setTimeout(() => {
                toastMessageEl.classList.remove('show');
            }, 3000);
        } else {
            console.warn("Toast message element not found. Ensure it's in your HTML.");
        }
    }

    // === Global "Feature Unavailable" Modal Logic ===
    const featureUnavailableModal = document.getElementById('featureUnavailableModal');
    const closeUnavailableModalBtn = document.getElementById('closeUnavailableModalBtnPopup') || document.getElementById('closeUnavailableModalBtn'); // Check both possible IDs

    function showUnavailableModal() {
        if (featureUnavailableModal) {
            featureUnavailableModal.style.display = 'flex';
        } else {
            alert("This feature is currently unavailable in the demo version."); // Fallback
        }
    }

    if (closeUnavailableModalBtn) {
        closeUnavailableModalBtn.addEventListener('click', () => {
            if (featureUnavailableModal) featureUnavailableModal.style.display = 'none';
        });
    }
    if (featureUnavailableModal && !featureUnavailableModal.dataset.listenerAttached) { // Prevent multiple listeners
        window.addEventListener('click', (event) => {
            if (event.target == featureUnavailableModal) {
                featureUnavailableModal.style.display = 'none';
            }
        });
        featureUnavailableModal.dataset.listenerAttached = 'true';
    }
    
    // === Pop-up Cart Functionality ===
    const cartPopup = document.getElementById('cartPopup');
    const closeCartPopupBtn = document.getElementById('closeCartPopupBtn');
    const cartPopupOverlay = document.querySelector('.cart-popup-overlay');
    const headerCartIconLinks = document.querySelectorAll('.header-actions a[href="cart.html"]');
    const popupCartItemsContainer = document.getElementById('popupCartItemsContainer');
    const popupCartSubtotalEl = document.getElementById('popupCartSubtotal');
    const popupCartTotalEl = document.getElementById('popupCartTotal');
    const popupCartSummaryContainer = document.getElementById('popupCartSummaryContainer');
    const popupProceedToCheckoutBtn = document.getElementById('popupProceedToCheckoutBtn');

    function openCartPopup() {
        if (cartPopup) {
            renderPopupCartItems();
            cartPopup.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCartPopup() {
        if (cartPopup) {
            cartPopup.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    function renderPopupCartItems() {
        if (!cartPopup || !popupCartItemsContainer || !popupCartSubtotalEl || !popupCartTotalEl || !popupCartSummaryContainer) {
            // console.error("Popup cart elements not found. Ensure HTML is correct and on the page.");
            return; // Silently fail if cart popup isn't on the current page
        }

        const cart = getCart();
        popupCartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            popupCartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is currently empty. <a href="shop.html">Continue Shopping</a></p>';
            popupCartSummaryContainer.style.display = 'none';
            return;
        }
        popupCartSummaryContainer.style.display = 'block';
        let subtotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image || 'https://placehold.co/70x90/0A0A0A/333333?text=N/A'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <label for="popup-qty-${item.cartId}" class="visually-hidden">Quantity for ${item.name}</label>
                    <input type="number" id="popup-qty-${item.cartId}" class="cart-item-qty-input" value="${item.quantity}" min="1" data-cartid="${item.cartId}">
                </div>
                <p class="cart-item-total-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="cart-item-remove" data-cartid="${item.cartId}" aria-label="Remove ${item.name}">&times;</button>
            `;
            popupCartItemsContainer.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        popupCartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        popupCartTotalEl.textContent = `$${subtotal.toFixed(2)}`;

        popupCartItemsContainer.querySelectorAll('.cart-item-qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const cartId = e.target.dataset.cartid;
                const newQuantity = parseInt(e.target.value);
                updateItemQuantityInCart(cartId, newQuantity);
            });
        });

        popupCartItemsContainer.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const cartId = e.target.dataset.cartid;
                removeItemFromCart(cartId);
            });
        });
    }

    function updateItemQuantityInCart(cartId, newQuantity) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.cartId === cartId);
        if (itemIndex > -1 && newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
            showToast("Cart updated.");
        } else if (itemIndex > -1 && newQuantity <= 0) {
            cart.splice(itemIndex, 1);
            showToast("Item removed from cart.");
        }
        saveCart(cart); // saveCart will call renderPopupCartItems if popup is open
    }

    function removeItemFromCart(cartId) {
        let cart = getCart();
        cart = cart.filter(item => item.cartId !== cartId);
        saveCart(cart);
        showToast("Item removed from cart.");
    }

    if (headerCartIconLinks.length > 0) {
        headerCartIconLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openCartPopup();
            });
        });
    }
    if (closeCartPopupBtn) closeCartPopupBtn.addEventListener('click', closeCartPopup);
    if (cartPopupOverlay) cartPopupOverlay.addEventListener('click', closeCartPopup);
    if (popupProceedToCheckoutBtn) {
        popupProceedToCheckoutBtn.addEventListener('click', () => {
            closeCartPopup();
            showUnavailableModal();
        });
    }


    // === 7. Product Detail Page Specific Logic ===
    // This section will only execute fully if the current page is product-detail.html
    // and has the necessary elements.
    const productDetailPage = document.getElementById('product-detail-page');
    let currentProduct = null; // Define currentProduct in a scope accessible to PDP logic

    if (productDetailPage && typeof products !== 'undefined') { // `products` comes from product-data.js
        const mainProductImageEl = document.getElementById('mainProductImage');
        const thumbnailGalleryEl = document.getElementById('thumbnailGallery');
        const productNameElPDP = document.getElementById('productName');
        const productPriceElPDP = document.getElementById('productPrice');
        const productSKU_ElPDP = document.getElementById('productSKU');
        const productSizeElPDP = document.getElementById('productSize');
        const productDescriptionElPDP = document.getElementById('productDescription');
        const productDeliveryReturnsElPDP = document.getElementById('productDeliveryReturns');
        const productFabricStructureElPDP = document.getElementById('productFabricStructure');
        const relatedProductsGridEl = document.getElementById('relatedProductsGrid');
        const addToCartBtnPDP = document.getElementById('addToCartBtn');
        const buyNowBtnPDP = document.getElementById('buyNowBtn');
        const productQuantityElPDP = document.getElementById('productQuantity');


        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        currentProduct = products.find(p => p.id === productId); // Assign to the shared currentProduct

        if (currentProduct) {
            document.title = `${currentProduct.name} - ECLIPTIC`;
            if(productNameElPDP) productNameElPDP.textContent = currentProduct.name;
            if(productPriceElPDP) productPriceElPDP.textContent = `$ ${currentProduct.price.toFixed(2)}`;
            if(productSKU_ElPDP && currentProduct.sku) productSKU_ElPDP.textContent = currentProduct.sku;

            if (mainProductImageEl && currentProduct.images && currentProduct.images.length > 0) {
                mainProductImageEl.src = currentProduct.images[0];
                mainProductImageEl.alt = currentProduct.name;

                if (thumbnailGalleryEl) {
                    thumbnailGalleryEl.innerHTML = '';
                    currentProduct.images.forEach((imgSrc, index) => {
                        const thumb = document.createElement('img');
                        thumb.src = imgSrc;
                        thumb.alt = `${currentProduct.name} thumbnail ${index + 1}`;
                        thumb.classList.add('thumbnail-image');
                        if (index === 0) thumb.classList.add('active');
                        thumb.addEventListener('click', () => {
                            mainProductImageEl.src = imgSrc;
                            thumbnailGalleryEl.querySelectorAll('.thumbnail-image.active').forEach(activeThumb => activeThumb.classList.remove('active'));
                            thumb.classList.add('active');
                        });
                        thumbnailGalleryEl.appendChild(thumb);
                    });
                }
            }

            if (productSizeElPDP && currentProduct.sizes && currentProduct.sizes.length > 0) {
                productSizeElPDP.innerHTML = '';
                currentProduct.sizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    productSizeElPDP.appendChild(option);
                });
            } else if (productSizeElPDP) {
                const sizeLabel = document.querySelector('label[for="size"]');
                if(sizeLabel) sizeLabel.style.display = 'none';
                productSizeElPDP.style.display = 'none';
            }

            if(productDescriptionElPDP) productDescriptionElPDP.textContent = currentProduct.description;
            if(productDeliveryReturnsElPDP) productDeliveryReturnsElPDP.textContent = currentProduct.deliveryReturns;
            if(productFabricStructureElPDP) productFabricStructureElPDP.textContent = currentProduct.fabricStructure;

            if (relatedProductsGridEl && typeof getRelatedProducts === 'function') {
                const related = getRelatedProducts(productId);
                relatedProductsGridEl.innerHTML = '';
                related.forEach(relProduct => {
                    const item = document.createElement('div');
                    item.classList.add('related-product-item');
                    item.innerHTML = `
                        <a href="product-detail.html?id=${relProduct.id}">
                            <img src="${relProduct.images[0]}" alt="${relProduct.name}">
                            <h4>${relProduct.name}</h4>
                            <p>$ ${relProduct.price.toFixed(2)}</p>
                        </a>
                    `;
                    relatedProductsGridEl.appendChild(item);
                });
            }

            // PDP Add to Cart Button
            if (addToCartBtnPDP) {
                addToCartBtnPDP.addEventListener('click', () => {
                    if (!currentProduct) return; // Should be defined if we are here
                    const cart = getCart();
                    const quantity = parseInt(productQuantityElPDP.value) || 1;
                    const size = productSizeElPDP.value;
                    const cartItemId = `${currentProduct.id}-${size || 'default'}`; // Handle cases with no size

                    const existingItemIndex = cart.findIndex(item => item.cartId === cartItemId);

                    if (existingItemIndex > -1) {
                        cart[existingItemIndex].quantity += quantity;
                    } else {
                        cart.push({
                            cartId: cartItemId,
                            id: currentProduct.id,
                            name: currentProduct.name,
                            price: currentProduct.price,
                            size: size || 'N/A',
                            quantity: quantity,
                            image: currentProduct.images[0]
                        });
                    }
                    saveCart(cart);
                    showToast(`${currentProduct.name} (${size || ''}) added to cart!`);
                    openCartPopup(); // Open cart popup after adding
                });
            }
            if(buyNowBtnPDP) buyNowBtnPDP.addEventListener('click', showUnavailableModal);


        } else if (productNameElPDP) { // Product not found, but on product detail page
            const productDetailContainer = document.querySelector('.product-detail-container');
            if (productDetailContainer) {
                productDetailContainer.innerHTML = '<p class="product-not-found">Sorry, the product you are looking for could not be found.</p>';
            }
            if(relatedProductsGridEl) relatedProductsGridEl.innerHTML = '';
            if(addToCartBtnPDP) addToCartBtnPDP.disabled = true;
            if(buyNowBtnPDP) buyNowBtnPDP.disabled = true;
        }

        // PDP Accordion functionality
        const accordionButtons = productDetailPage.querySelectorAll('.accordion-button');
        accordionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', String(!isExpanded));
                button.classList.toggle('active');
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.style.opacity = 1;
                } else {
                    content.style.maxHeight = null;
                    content.style.opacity = 0;
                }
            });
        });
    } // End of Product Detail Page specific logic

    // Initial cart count update for all pages
    updateHeaderCartCount();

}); // End of DOMContentLoaded
