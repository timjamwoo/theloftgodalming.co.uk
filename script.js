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
        mobileMenuButton.style.color = '#2c5530';
        
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
            color: #2c5530;
            font-weight: 600;
        }
    }
`;

// Add mobile menu styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);