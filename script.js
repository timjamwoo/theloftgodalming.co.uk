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
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize lightbox functionality
    initializeLightbox();
    
    // Initialize availability calendar
    initializeAvailabilityCalendar();
    
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

// Contact Form Functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    
    if (!form) {
        console.warn('Contact form not found');
        return;
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    checkInInput.min = today;
    checkOutInput.min = today;
    
    // Helper function for consistent date parsing
    function parseDate(dateString) {
        return new Date(dateString + 'T00:00:00');
    }
    
    // Update check-out min date when check-in changes
    checkInInput.addEventListener('change', function() {
        const checkInDate = parseDate(this.value);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(checkInDate.getDate() + 1);
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        
        // Clear check-out if it's before new minimum
        if (checkOutInput.value && parseDate(checkOutInput.value) <= checkInDate) {
            checkOutInput.value = '';
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        hideMessage();
        
        try {
            const formData = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showMessage('Thank you for your enquiry! We\'ll get back to you within 24 hours.', 'success');
                form.reset();
                // Reset date minimums
                checkInInput.min = today;
                checkOutInput.min = today;
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        // Additional validation for date logic
        const checkIn = parseDate(checkInInput.value);
        const checkOut = parseDate(checkOutInput.value);
        
        if (checkInInput.value && checkOutInput.value) {
            if (checkOut <= checkIn) {
                showFieldError(checkOutInput, 'Check-out date must be after check-in date');
                isValid = false;
            }
            
            const daysDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            if (daysDiff < 4) {
                showFieldError(checkOutInput, 'Minimum stay is 4 nights');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        
        // Clear previous errors
        clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Date validation
        if (fieldType === 'date' && value) {
            const selectedDate = parseDate(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError(field, 'Date cannot be in the past');
                isValid = false;
            }
        }
        
        // Name validation
        if (field.id === 'name' && value) {
            if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters long');
                isValid = false;
            }
        }
        
        // Message validation
        if (field.id === 'message' && value) {
            if (value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters long');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }
    
    function hideMessage() {
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
        formMessage.textContent = '';
    }
}

// Availability Calendar Functionality

function initializeAvailabilityCalendar() {
    // Configuration constants
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const CALENDAR_GRID_SIZE = 6 * 7; // 6 rows × 7 days = 42 cells
    
    // DOM elements
    const calendarContainer = document.getElementById('availability-calendar');
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const loadingElement = document.getElementById('calendar-loading');
    const errorElement = document.getElementById('calendar-error');
    
    // Date selection elements
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const checkInDisplay = document.getElementById('check-in-display');
    const checkOutDisplay = document.getElementById('check-out-display');
    const clearDatesBtn = document.getElementById('clear-dates');
    const dateWarning = document.getElementById('date-warning');
    const dateWarningText = document.getElementById('date-warning-text');
    
    if (!calendarContainer) {
        console.log('Calendar container not found, skipping calendar initialization');
        return;
    }
    
    // Calendar state
    let currentDate = new Date();
    let bookedDates = new Set();
    let isLoading = false;
    let selectedStartDate = null;
    let selectedEndDate = null;
    let isSelectingRange = false;
    
    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
        
    
    // Show loading state
    function showLoading() {
        isLoading = true;
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        calendarContainer.style.opacity = '0.7';
    }
    
    // Hide loading state
    function hideLoading() {
        isLoading = false;
        loadingElement.style.display = 'none';
        calendarContainer.style.opacity = '1';
    }
    
    // Show error state
    function showError() {
        hideLoading();
        errorElement.style.display = 'block';
    }
    
    // Create cache key with date for daily cache busting
    function getCacheKey() {
        const today = new Date().toDateString();
        return `airbnb_ical_${today}`;
    }
    
    // Get cached data
    function getCachedData() {
        try {
            const cached = localStorage.getItem(getCacheKey());
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                const now = Date.now();
                if (now - timestamp < CACHE_DURATION) {
                    return data;
                }
            }
        } catch (error) {
            console.warn('Error reading cache:', error);
        }
        return null;
    }
    
    // Cache data
    function setCachedData(data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Error writing cache:', error);
        }
    }
    
    // Attempt to fetch availability data from Airbnb
    async function fetchAvailabilityData() {
        // Check cache first
        const cachedData = getCachedData();
        if (cachedData) {
            bookedDates = new Set(cachedData);
            renderCalendar();
            return;
        }
        
        showLoading();
        
        try {
            // For production, this would attempt to fetch the iCal feed
            const response = await fetch('data/airbnb-calendar.json', {
                cache: 'no-store' // always get the latest
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch calendar data: ${response.status}`);
            }

            const bookings = await response.json();

            // Convert each booking range into individual booked days
            bookings.forEach(({ start, end }) => {
                const startDate = new Date(start);
                const endDate = new Date(end);
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    bookedDates.add(d.toDateString());
                }
            });
            // Cache the mock data
            setCachedData(Array.from(bookedDates));
            
            hideLoading();
            renderCalendar();
            
        } catch (error) {
            console.error('Error fetching availability data:', error);
            showError();
            
            // Still render the calendar without booking data
            bookedDates = new Set();
            renderCalendar();
        }
    }
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    function getFirstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }
    
    // Get the number of days in a month
    function getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }
    
    // Check if a date is today
    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    // Check if a date is booked
    function isDateBooked(date) {
        return bookedDates.has(date.toDateString());
    }
    
    // Check if a date is in the past
    function isPastDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }
    
    // Check if a date is available for selection
    function isDateAvailable(date) {
        return !isDateBooked(date) && !isPastDate(date);
    }
    
    // Format date for display
    function formatDateForDisplay(date) {
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Format date for form input (YYYY-MM-DD)
    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }
    
    // Clear date selection
    function clearDateSelection() {
        selectedStartDate = null;
        selectedEndDate = null;
        isSelectingRange = false;
        hideDateWarning();
        updateDateDisplay();
        renderCalendar();
    }
    
    // Show date warning
    function showDateWarning(message) {
        if (dateWarning && dateWarningText) {
            dateWarningText.textContent = message;
            dateWarning.style.display = 'flex';
        }
    }
    
    // Hide date warning
    function hideDateWarning() {
        if (dateWarning) {
            dateWarning.style.display = 'none';
        }
    }
    
    // Calculate number of nights between two dates
    function calculateNights(startDate, endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    
    // Validate minimum stay requirement
    function validateMinimumStay(startDate, endDate) {
        const nights = calculateNights(startDate, endDate);
        const minNights = 4;
        
        if (nights < minNights) {
            const message = `Minimum stay is ${minNights} nights. Your selection is ${nights} night${nights === 1 ? '' : 's'}. Please select a longer stay.`;
            showDateWarning(message);
            return false;
        }
        
        hideDateWarning();
        return true;
    }
    
    // Update the date display
    function updateDateDisplay() {
        if (selectedStartDate) {
            checkInDisplay.textContent = formatDateForDisplay(selectedStartDate);
            checkInInput.value = formatDateForInput(selectedStartDate);
        } else {
            checkInDisplay.textContent = 'Select start date';
            checkInInput.value = '';
        }
        
        if (selectedEndDate) {
            checkOutDisplay.textContent = formatDateForDisplay(selectedEndDate);
            checkOutInput.value = formatDateForInput(selectedEndDate);
        } else {
            checkOutDisplay.textContent = 'Select end date';
            checkOutInput.value = '';
        }
        
        // Show/hide clear button
        if (selectedStartDate || selectedEndDate) {
            clearDatesBtn.style.display = 'block';
        } else {
            clearDatesBtn.style.display = 'none';
        }
    }
    
    // Handle date selection
    function handleDateClick(date) {
        if (!isDateAvailable(date)) {
            return; // Can't select unavailable dates
        }
        
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Start new selection
            selectedStartDate = new Date(date);
            selectedEndDate = null;
            isSelectingRange = true;
            hideDateWarning(); // Clear any previous warnings
        } else if (selectedStartDate && !selectedEndDate) {
            // Complete the range
            if (date < selectedStartDate) {
                // If selected date is before start date, swap them
                selectedEndDate = selectedStartDate;
                selectedStartDate = new Date(date);
            } else {
                selectedEndDate = new Date(date);
            }
            isSelectingRange = false;
            
            // Check if range includes any booked dates
            if (hasBookedDatesInRange(selectedStartDate, selectedEndDate)) {
                alert('Your selected range includes booked dates. Please select different dates.');
                clearDateSelection();
                return;
            }
            
            // Validate minimum stay requirement
            if (!validateMinimumStay(selectedStartDate, selectedEndDate)) {
                // Warning is shown by validateMinimumStay function
                // Don't clear selection, just show warning
                updateDateDisplay();
                renderCalendar();
                return;
            }
        }
        
        updateDateDisplay();
        renderCalendar();
    }
    
    // Check if there are booked dates in the selected range
    function hasBookedDatesInRange(startDate, endDate) {
        const current = new Date(startDate);
        while (current <= endDate) {
            if (isDateBooked(current)) {
                return true;
            }
            current.setDate(current.getDate() + 1);
        }
        return false;
    }
    
    // Check if a date is in the selected range
    function isDateInRange(date) {
        if (!selectedStartDate || !selectedEndDate) return false;
        return date >= selectedStartDate && date <= selectedEndDate;
    }
    
    // Safely navigate to a new month/year
    function navigateToMonth(year, month) {
        // Create a new date object to avoid mutations
        const newDate = new Date(year, month, 1);
        currentDate = newDate;
    }
    
    // Render the calendar
    function renderCalendar() {
        // Update the month/year display
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Clear existing calendar days
        calendarDays.innerHTML = '';
        
        // Get calendar information
        const firstDay = getFirstDayOfMonth(currentDate);
        const daysInMonth = getDaysInMonth(currentDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Get previous month info for leading days
        const prevMonth = new Date(year, month - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        // Add leading days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(dayElement);
        }
        
        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Add appropriate classes
            if (isToday(date)) {
                dayElement.classList.add('today');
            }
            
            if (isDateBooked(date)) {
                dayElement.classList.add('booked');
                dayElement.title = 'Not available - booked on Airbnb';
            } else if (isPastDate(date)) {
                dayElement.classList.add('other-month'); // Style past dates like other month
                dayElement.title = 'Past date';
            } else {
                dayElement.classList.add('available');
                dayElement.title = 'Available for booking';
                
                // Add click handler for available dates
                dayElement.addEventListener('click', () => handleDateClick(date));
            }
            
            // Handle selection styling
            if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) {
                dayElement.classList.add('selected', 'range-start');
            }
            if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) {
                dayElement.classList.add('selected', 'range-end');
            }
            if (selectedStartDate && selectedEndDate && isDateInRange(date) && 
                date.toDateString() !== selectedStartDate.toDateString() && 
                date.toDateString() !== selectedEndDate.toDateString()) {
                dayElement.classList.add('in-range');
            }
            
            calendarDays.appendChild(dayElement);
        }
        
        // Add trailing days from next month
        const totalCells = calendarDays.children.length;
        const remainingCells = CALENDAR_GRID_SIZE - totalCells;
        
        for (let day = 1; day <= Math.min(remainingCells, 14); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = day;
            calendarDays.appendChild(dayElement);
        }
    }
    
    // Navigate to previous month
    function goToPreviousMonth() {
        if (isLoading) return;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() - 1;
        navigateToMonth(year, month);
        renderCalendar();
    }
    
    // Navigate to next month
    function goToNextMonth() {
        if (isLoading) return;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        navigateToMonth(year, month);
        renderCalendar();
    }
    
    // Event listeners
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', goToPreviousMonth);
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', goToNextMonth);
    }
    
    if (clearDatesBtn) {
        clearDatesBtn.addEventListener('click', clearDateSelection);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!calendarContainer.contains(document.activeElement)) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPreviousMonth();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNextMonth();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            clearDateSelection();
        }
    });
    
    // Initialize the calendar
    fetchAvailabilityData();
}
