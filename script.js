// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add smooth scrolling behavior to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to navigation links based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + document.querySelector('.header').offsetHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    
    // Add fade-in animation for feature cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Mobile menu toggle (if we add a mobile menu in the future)
    const createMobileMenu = () => {
        const navbar = document.querySelector('.navbar');
        const navContainer = document.querySelector('.nav-container');
        
        // Create mobile menu button
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'mobile-menu-button';
        mobileMenuButton.innerHTML = '☰';
        mobileMenuButton.style.display = 'none';
        mobileMenuButton.style.background = 'none';
        mobileMenuButton.style.border = 'none';
        mobileMenuButton.style.fontSize = '1.5rem';
        mobileMenuButton.style.cursor = 'pointer';
        mobileMenuButton.style.color = '#1a4d2e';
        
        // Insert button before nav menu
        const navMenu = document.querySelector('.nav-menu');
        navContainer.insertBefore(mobileMenuButton, navMenu);
        
        // Toggle mobile menu
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-menu-open');
        });
        
        // Show/hide mobile menu button based on screen size
        function checkScreenSize() {
            if (window.innerWidth <= 768) {
                mobileMenuButton.style.display = 'block';
                navMenu.style.display = navMenu.classList.contains('mobile-menu-open') ? 'flex' : 'none';
            } else {
                mobileMenuButton.style.display = 'none';
                navMenu.style.display = 'flex';
                navMenu.classList.remove('mobile-menu-open');
            }
        }
        
        // Check screen size on load and resize
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
    };
    
    // Initialize mobile menu
    createMobileMenu();
    
    // Initialize lightbox functionality
    initializeLightbox();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
    
    // Email click tracking (for analytics if needed)
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function() {
            // Could add analytics tracking here
            console.log('Email contact initiated');
        });
    }
});

// Lightbox functionality
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        console.warn('Lightbox element not found');
        return;
    }
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Check if all required elements are present
    if (!lightboxImage || !lightboxCaption || !closeBtn || !prevBtn || !nextBtn) {
        console.warn('Required lightbox elements not found');
        return;
    }
    
    let currentImageIndex = 0;
    let currentImageSet = [];
    
    // Get all clickable images
    const clickableImages = document.querySelectorAll('.gallery-item img, .feature-image, .location-image');
    
    // Make images clickable and add cursor pointer style
    clickableImages.forEach((img, index) => {
        img.classList.add('clickable-image');
        img.addEventListener('click', () => openLightbox(img, index));
    });
    
    // Keyboard navigation
    let keydownHandler = null;
    
    function addKeyboardListener() {
        if (keydownHandler) return; // Prevent duplicate listeners
        
        keydownHandler = (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    if (currentImageSet.length > 1) showPrevImage();
                    break;
                case 'ArrowRight':
                    if (currentImageSet.length > 1) showNextImage();
                    break;
            }
        };
        
        document.addEventListener('keydown', keydownHandler);
    }
    
    function removeKeyboardListener() {
        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler);
            keydownHandler = null;
        }
    }
    
    function openLightbox(clickedImage, index) {
        // Determine which set of images we're working with
        if (clickedImage.closest('.gallery-item')) {
            // Gallery images
            currentImageSet = document.querySelectorAll('.gallery-item img');
            currentImageIndex = Array.from(currentImageSet).indexOf(clickedImage);
        } else if (clickedImage.classList.contains('feature-image')) {
            // Feature images
            currentImageSet = document.querySelectorAll('.feature-image');
            currentImageIndex = Array.from(currentImageSet).indexOf(clickedImage);
        } else if (clickedImage.classList.contains('location-image')) {
            // Location images
            currentImageSet = document.querySelectorAll('.location-image');
            currentImageIndex = Array.from(currentImageSet).indexOf(clickedImage);
        } else {
            // Single image
            currentImageSet = [clickedImage];
            currentImageIndex = 0;
        }
        
        updateLightboxImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Add keyboard listener when lightbox opens
        addKeyboardListener();
        
        // Focus management for accessibility
        closeBtn.focus();
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Remove keyboard listener when lightbox closes
        removeKeyboardListener();
    }
    
    function updateLightboxImage() {
        const currentImage = currentImageSet[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        
        // Get caption text
        let captionText = '';
        if (currentImage.closest('.gallery-item')) {
            const captionElement = currentImage.closest('.gallery-item').querySelector('.gallery-caption');
            captionText = captionElement ? captionElement.textContent : currentImage.alt;
        } else if (currentImage.closest('.feature-card')) {
            const titleElement = currentImage.closest('.feature-card').querySelector('h3');
            captionText = titleElement ? titleElement.textContent : currentImage.alt;
        } else {
            captionText = currentImage.alt;
        }
        
        lightboxCaption.textContent = captionText;
        
        // Show/hide navigation buttons based on image set size
        if (currentImageSet.length > 1) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentImageSet.length;
        updateLightboxImage();
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking on the background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Add CSS for mobile menu
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 1rem 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .nav-menu.mobile-menu-open {
            display: flex !important;
        }
        
        .nav-link.active {
            color: #1a4d2e;
            font-weight: 600;
        }
    }
`;

// Add mobile menu styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);