document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content Loaded");

    // Video playback handling
    const video = document.querySelector('video');
    if (video) {
        // Function to handle video play with sound
        function playVideoWithSound() {
            video.muted = false;
            video.volume = 1;
            video.play().catch(function(error) {
                console.log("Video play failed:", error);
            });
        }

        // Add click handler for the video container
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.addEventListener('click', function(e) {
                if (e.target === video) {
                    if (video.paused) {
                        playVideoWithSound();
                    } else {
                        video.pause();
                    }
                }
            });
        }

        // Handle controls interaction
        video.addEventListener('play', function() {
            video.muted = false;
            video.volume = 1;
        });

        // Handle video loading
        video.addEventListener('canplay', function() {
            console.log("Video can play");
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    video.muted = false;
                    video.volume = 1;
                }).catch(error => {
                    console.log("Autoplay prevented:", error);
                });
            }
        });

        // Handle video errors
        video.addEventListener('error', function() {
            console.error("Error loading video:", video.error);
        });
    }

    // Button hover effects
    const buttons = document.querySelectorAll(".details-btn");
    buttons.forEach((button) => {
        button.addEventListener("mouseover", function () {
            this.style.backgroundColor = "#007bff";
            this.style.transition = "0.3s ease-in-out";
        });

        button.addEventListener("mouseout", function () {
            this.style.backgroundColor = "black";
        });
    });

    // Purchase page functionality
    if (document.querySelector("#purchase")) {
        console.log("Purchase section found");
        
        const modelSelect = document.querySelector("#model");
        const packageCheckboxes = document.querySelectorAll('input[name="package"]');
        const purchaseForm = document.querySelector("#purchaseForm");
        const state = {
            basePrice: 50000,
            selectedPackages: 0
        };

        // Update price based on selected packages
        function updatePrice() {
            console.log("Updating prices. Current state:", state);
            
            let packageTotal = 0;
            packageCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    switch(checkbox.id) {
                        case 'sport':
                            packageTotal += 2500;
                            break;
                        case 'premium':
                            packageTotal += 1500;
                            break;
                        case 'technology':
                            packageTotal += 1000;
                            break;
                    }
                }
            });

            state.selectedPackages = packageTotal;
            const totalPrice = state.basePrice + state.selectedPackages;
            const tax = totalPrice * 0.09;

            try {
                // Update display prices with proper formatting
                const priceItems = document.querySelectorAll('.price-summary .price-item');
                console.log("Found price items:", priceItems.length);

                if (priceItems.length >= 4) {
                    // Base Price
                    priceItems[0].querySelector('span:last-child').textContent = `$${state.basePrice.toLocaleString()}`;
                    // Selected Packages
                    priceItems[1].querySelector('span:last-child').textContent = `$${state.selectedPackages.toLocaleString()}`;
                    // Estimated Tax
                    priceItems[2].querySelector('span:last-child').textContent = `$${Math.round(tax).toLocaleString()}`;
                    // Total
                    priceItems[3].querySelector('span:last-child').textContent = `$${Math.round(totalPrice + tax).toLocaleString()}`;
                    
                    console.log("Prices updated successfully:", {
                        basePrice: state.basePrice,
                        packages: state.selectedPackages,
                        tax: Math.round(tax),
                        total: Math.round(totalPrice + tax)
                    });
                } else {
                    console.error("Price items not found in expected structure");
                }
            } catch (error) {
                console.error("Error updating prices:", error);
            }
        }

        // Model selection handler
        if (modelSelect) {
            console.log("Model select found");

            // Create a MutationObserver to watch for value changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        const selectedModel = modelSelect.value;
                        console.log(`Model value changed to: ${selectedModel}`);
                        updateModelPrice(selectedModel);
                    }
                });
            });

            // Start observing the select element
            observer.observe(modelSelect, {
                attributes: true,
                attributeFilter: ['value']
            });

            // Function to update price based on model
            function updateModelPrice(selectedModel) {
                console.log(`Updating price for model: ${selectedModel}`);
                switch(selectedModel) {
                    case '7':
                    case '8':
                    case 'm':
                        state.basePrice = 85000;
                        break;
                    case '5':
                    case '6':
                        state.basePrice = 65000;
                        break;
                    case '3':
                    case '4':
                    case 'x':
                        state.basePrice = 55000;
                        break;
                    default:
                        state.basePrice = 50000;
                }
                console.log(`Base price updated to: ${state.basePrice}`);
                updatePrice();
            }

            // Handle change event
            modelSelect.addEventListener('change', function() {
                const selectedModel = this.value;
                console.log(`Model change event triggered: ${selectedModel}`);
                updateModelPrice(selectedModel);
            });

            // Handle click events on options
            modelSelect.addEventListener('click', function() {
                console.log('Model select clicked');
            });

            // Handle keyboard events
            modelSelect.addEventListener('keydown', function(e) {
                console.log(`Key pressed on model select: ${e.key}`);
                if (e.key >= '0' && e.key <= '9') {
                    const options = this.options;
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].value === e.key) {
                            this.selectedIndex = i;
                            this.dispatchEvent(new Event('change'));
                            break;
                        }
                    }
                }
            });
        } else {
            console.error("Model select element not found");
        }

        // Package selection handler
        packageCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log(`Package ${this.id} ${this.checked ? 'selected' : 'unselected'}`);
                updatePrice();
            });
        });

        // Color selection preview
        const colorInputs = document.querySelectorAll('input[name="color"]');
        colorInputs.forEach(input => {
            input.addEventListener('change', function() {
                const selectedColor = this.value;
                const colorOptions = document.querySelector('.color-options');
                if (colorOptions) {
                    colorOptions.style.borderColor = selectedColor;
                    console.log(`Color selected: ${selectedColor}`);
                }
            });
        });

        // Form validation and submission
        if (purchaseForm) {
            purchaseForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log("Form submission attempted");
                
                const name = document.querySelector('#name').value.trim();
                const email = document.querySelector('#email').value.trim();
                const phone = document.querySelector('#phone').value.trim();
                const payment = document.querySelector('#payment').value;
                const model = modelSelect.value;
                const color = document.querySelector('input[name="color"]:checked');

                // Basic validation
                if (!name || !email || !phone || !payment || !model || !color) {
                    alert('Please fill in all required fields');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }

                // Phone validation
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                if (!phoneRegex.test(phone)) {
                    alert('Please enter a valid phone number');
                    return;
                }

                // If validation passes, show success message
                alert('Thank you for your purchase! Our team will contact you shortly to finalize the details.');
                purchaseForm.reset();
                modelSelect.value = ""; // Reset model selection
                // Reset state and update display
                state.basePrice = 50000;
                state.selectedPackages = 0;
                updatePrice();
                console.log("Form submitted successfully");
            });
        }

        // Initialize price display
        console.log("Initializing price display");
        updatePrice();
    }

    // Contact page functionality
    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
        console.log("Contact form found");
        
        // Add floating label effect
        const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Add initial focused class if input has value
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        // Form validation and submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Contact form submission attempted");

            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const subject = document.querySelector('#subject').value;
            const message = document.querySelector('#message').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Message length validation
            if (message.length < 10) {
                alert('Please enter a message with at least 10 characters');
                return;
            }

            // If validation passes, show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();

            // Remove focused class from all inputs after form reset
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            console.log("Contact form submitted successfully");
        });

        // Social media icon hover effects
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.transition = '0.3s ease';
            });

            icon.addEventListener('mouseout', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
});