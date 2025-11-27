// Hero Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let carouselInterval;

    // Debug: Check if elements are found
    if (slides.length === 0) {
        console.error('No carousel slides found!');
        return;
    }
    if (dots.length === 0) {
        console.warn('No carousel dots found!');
    }

    // Preload all images to prevent loading delays
    function preloadImages() {
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                const imageLoader = new Image();
                imageLoader.onload = function() {
                    // Image loaded successfully
                };
                imageLoader.onerror = function() {
                    console.warn(`Image ${index + 1} failed to load, skipping...`);
                    // Mark slide as invalid by adding a data attribute
                    slide.setAttribute('data-error', 'true');
                };
                imageLoader.src = img.src;
            }
        });
    }

    // Function to get next valid slide index
    function getNextValidSlide(currentIndex) {
        let nextIndex = (currentIndex + 1) % slides.length;
        let attempts = 0;
        
        // Skip slides with errors, max attempts to prevent infinite loop
        while (slides[nextIndex] && slides[nextIndex].getAttribute('data-error') === 'true' && attempts < slides.length) {
            nextIndex = (nextIndex + 1) % slides.length;
            attempts++;
        }
        
        return nextIndex;
    }

    // Function to show a specific slide with smooth dissolve effect
    function showSlide(index) {
        // Validate index
        if (index < 0 || index >= slides.length) {
            index = 0;
        }

        // Skip slides with errors
        if (slides[index] && slides[index].getAttribute('data-error') === 'true') {
            index = getNextValidSlide(index);
        }

        // Remove active class from all slides and dots
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Add active class to current slide and dot
        if (slides[index]) {
            slides[index].classList.add('active');
            currentSlide = index;
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    // Function to go to next slide with error handling
    function nextSlide() {
        const previousSlide = currentSlide;
        
        // Simply move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Skip slides with errors
        if (slides[currentSlide] && slides[currentSlide].getAttribute('data-error') === 'true') {
            currentSlide = getNextValidSlide(previousSlide);
        }
        
        // Always show the slide
        showSlide(currentSlide);
    }

    // Auto-play carousel
    function startCarousel() {
        // Clear any existing interval
        if (carouselInterval) {
            clearInterval(carouselInterval);
            carouselInterval = null;
        }
        // Change slide every 5 seconds
        carouselInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    // Stop carousel completely
    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
            carouselInterval = null;
        }
    }

    // Get hero section reference for hover and spotlight effects
    const heroSection = document.getElementById('hero');
    
    // Stop carousel on hover
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            stopCarousel();
        });

        heroSection.addEventListener('mouseleave', () => {
            startCarousel();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (slides[index] && slides[index].getAttribute('data-error') !== 'true') {
                currentSlide = index;
                showSlide(currentSlide);
                if (carouselInterval) {
                    clearInterval(carouselInterval);
                }
                startCarousel();
            }
        });
    });

    // Error handling for images
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img) {
            img.onerror = function() {
                console.warn(`Image ${index + 1} failed to load`);
                slide.setAttribute('data-error', 'true');
                // If current slide fails, move to next
                if (slide.classList.contains('active')) {
                    nextSlide();
                }
            };
            
            img.onload = function() {
                // Image loaded successfully, remove error flag if it was set
                slide.removeAttribute('data-error');
            };
        }
    });

    // Preload images
    preloadImages();

    // Initialize carousel
    if (slides.length > 0) {
        // Set initial slide
        showSlide(0);
        // Start the carousel
        setTimeout(() => {
            startCarousel();
        }, 1000);
    }

    // Pause carousel when tab is not visible
    let visibilityHandler = () => {
        if (document.hidden) {
            stopCarousel();
        } else {
            // Resume carousel when tab becomes visible
            requestAnimationFrame(() => {
                const activeSlide = slides[currentSlide];
                if (activeSlide && !activeSlide.classList.contains('active')) {
                    activeSlide.classList.add('active');
                }
                setTimeout(() => {
                    startCarousel();
                }, 300);
            });
        }
    };
    
    document.addEventListener('visibilitychange', visibilityHandler);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        stopCarousel();
    });
    
    // Fix for page focus/blur events
    window.addEventListener('focus', () => {
        requestAnimationFrame(() => {
            const activeSlide = slides[currentSlide];
            if (activeSlide && !activeSlide.classList.contains('active')) {
                activeSlide.classList.add('active');
            }
            setTimeout(() => {
                startCarousel();
            }, 300);
        });
    });
    
    window.addEventListener('blur', () => {
        stopCarousel();
    });
    
    // Prevent animation reset on page show
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            requestAnimationFrame(() => {
                const activeSlide = slides[currentSlide];
                if (activeSlide && !activeSlide.classList.contains('active')) {
                    activeSlide.classList.add('active');
                }
                setTimeout(() => {
                    startCarousel();
                }, 300);
            });
        }
    });
});

// Fade-in Animations for Sections on Scroll
document.addEventListener('DOMContentLoaded', function() {
    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
    
    // Observe project cards individually for staggered animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('fade-in-section');
        observer.observe(card);
    });
    
    // Observe skill items for staggered animation
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
        item.classList.add('fade-in-section');
        observer.observe(item);
    });
    
    // Observe hobby items for staggered animation
    const hobbyItems = document.querySelectorAll('.hobby-item');
    hobbyItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        item.classList.add('fade-in-section');
        observer.observe(item);
    });
});

// Enhanced Hover Animations for Project Cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        // Add mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click effect for better interactivity
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-6px) scale(1.01)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
    });
});


// Image Modal Functions for Fullscreen View
function openImageModal(imageSrc, imageAlt) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.querySelector('.modal-caption');
    
    if (modal && modalImg) {
        modalImg.src = imageSrc;
        modalImg.alt = imageAlt;
        if (modalCaption) {
            modalCaption.textContent = imageAlt;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeImageModal(event) {
    // Only close if clicking on the modal background or close button
    if (event) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        if (event.target === modal || event.target.classList.contains('modal-close')) {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        }
    } else {
        // Called without event (e.g., from keyboard)
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});

// Touch support for mobile devices
document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project-image');
    
    projectImages.forEach(imageContainer => {
        // Add touch event for mobile
        imageContainer.addEventListener('touchend', function(e) {
            e.preventDefault();
            const img = imageContainer.querySelector('.project-screenshot');
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });
    });
});

// Navigation Menu Toggle (Mobile)
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    function closeMenu() {
        if (navToggle) navToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (body) body.classList.remove('menu-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
    
    function openMenu() {
        if (navToggle) navToggle.classList.add('active');
        if (navMenu) navMenu.classList.add('active');
        if (body) body.classList.add('menu-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    }
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navMenu.classList.contains('active');
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close menu on window resize (if resizing to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
});

// Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// Active Navigation Link Highlighting
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navLinks.length > 0 && sections.length > 0) {
        function updateActiveNav() {
            let current = '';
            const scrollPosition = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}` || (current === 'hero' && href === '#hero')) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Initial call
    }
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Set Current Year in Footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Enhanced Smooth Scrolling with offset for navbar
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') {
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Loading Screen Handler
document.addEventListener('DOMContentLoaded', function() {
    const loaderWrapper = document.getElementById('loaderWrapper');
    
    if (loaderWrapper) {
        // Hide loader when page is fully loaded
        window.addEventListener('load', function() {
            setTimeout(() => {
                loaderWrapper.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => {
                    loaderWrapper.style.display = 'none';
                }, 500);
            }, 800);
        });
        
        // Fallback: Hide loader after max 3 seconds
        setTimeout(() => {
            if (loaderWrapper && !loaderWrapper.classList.contains('hidden')) {
                loaderWrapper.classList.add('hidden');
                setTimeout(() => {
                    loaderWrapper.style.display = 'none';
                }, 500);
            }
        }, 3000);
    }
});

// Add subtle micro-interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .contact-button, .project-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhanced hover interactions
    const interactiveElements = document.querySelectorAll('.skill-item, .hobby-item, .project-card, .timeline-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
});

