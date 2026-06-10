/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - SCRIPT.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Navigation Scroll Behavior --- */
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    function checkHeaderScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Run on startup and on scroll
    checkHeaderScroll();
    window.addEventListener('scroll', checkHeaderScroll);


    /* --- Mobile Navigation Menu --- */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navbar = document.getElementById('primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMobileMenu() {
        const isOpen = navbar.classList.toggle('open');
        mobileNavToggle.classList.toggle('open');
        
        // Update accessibility attributes
        mobileNavToggle.setAttribute('aria-expanded', isOpen);
        mobileNavToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        
        // Prevent body scrolling when mobile menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    mobileNavToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu if clicked outside the navbar or toggle button
    document.addEventListener('click', (event) => {
        if (navbar.classList.contains('open') && 
            !navbar.contains(event.target) && 
            !mobileNavToggle.contains(event.target)) {
            toggleMobileMenu();
        }
    });


    /* --- Scroll Spy (Highlight active section link) --- */
    const sections = document.querySelectorAll('section[id], header[id]');
    
    function scrollSpy() {
        const scrollPosition = window.scrollY + 100; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Find matching link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial run


    /* --- Skills Category Filtering --- */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade transition styles dynamically
                card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    // Trigger reflow for transition effect
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });


    /* --- Lecturer Modal Overlay --- */
    const lecturerTriggerCards = document.querySelectorAll('.lecturer-trigger-card');
    const lecturerModal = document.getElementById('lecturerModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalLecturerImage = document.getElementById('modal-lecturer-image');
    const modalLecturerName = document.getElementById('modal-lecturer-name');
    const modalLectureCount = document.getElementById('modal-lecture-count');
    const modalLecturesList = document.getElementById('modal-lectures-list');

    lecturerTriggerCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.lecturer-name').textContent;
            const count = card.querySelector('.lecture-count').innerHTML;
            const imageSrc = card.querySelector('.lecture-image').src;
            const hiddenData = card.querySelector('.lecture-details-data').innerHTML;

            // Populate Modal Content
            modalLecturerName.textContent = name;
            modalLecturerImage.src = imageSrc;
            modalLecturerImage.alt = name;
            modalLectureCount.innerHTML = count;
            modalLecturesList.innerHTML = hiddenData;

            // Show Modal with class
            lecturerModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent main page scrolling
        });
    });

    function closeModal() {
        lecturerModal.classList.remove('open');
        document.body.style.overflow = ''; // Restore main page scrolling
    }

    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal on click of backdrop
    lecturerModal.addEventListener('click', (e) => {
        if (e.target === lecturerModal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lecturerModal.classList.contains('open')) {
            closeModal();
        }
    });


    /* --- Contact Form Validation & Submission --- */
    const contactForm = document.getElementById('contactForm');
    const formFields = {
        name: document.getElementById('form-name'),
        email: document.getElementById('form-email'),
        message: document.getElementById('form-message')
    };
    const errorMessages = {
        name: document.getElementById('name-error'),
        email: document.getElementById('email-error'),
        message: document.getElementById('message-error')
    };
    const formFeedback = document.getElementById('formFeedback');
    const successAlert = formFeedback.querySelector('.success-alert');
    const errorAlert = formFeedback.querySelector('.error-alert');
    const submitBtn = document.getElementById('btn-submit');

    // Email regex helper
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Helper to show error
    function showError(fieldKey, show) {
        const field = formFields[fieldKey];
        const errorMsg = errorMessages[fieldKey];
        
        if (show) {
            field.classList.add('error');
            errorMsg.style.display = 'block';
        } else {
            field.classList.remove('error');
            errorMsg.style.display = 'none';
        }
    }

    // Clear errors when typing
    Object.keys(formFields).forEach(key => {
        formFields[key].addEventListener('input', () => {
            showError(key, false);
            errorAlert.style.display = 'none';
        });
    });

    // Validate form inputs
    function validateForm() {
        let isFormValid = true;

        // Name Validation
        if (formFields.name.value.trim() === '') {
            showError('name', true);
            isFormValid = false;
        } else {
            showError('name', false);
        }

        // Email Validation
        const emailVal = formFields.email.value.trim();
        if (emailVal === '' || !isValidEmail(emailVal)) {
            showError('email', true);
            isFormValid = false;
        } else {
            showError('email', false);
        }



        // Message Validation
        if (formFields.message.value.trim() === '') {
            showError('message', true);
            isFormValid = false;
        } else {
            showError('message', false);
        }

        return isFormValid;
    }

    // Submit handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide existing alerts
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';

        if (validateForm()) {
            // Form is valid - display sending state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            // Gather form data
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Submit form to Web3Forms API
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                const result = await response.json();
                if (response.status === 200) {
                    // Success path
                    successAlert.style.display = 'flex';
                    contactForm.reset();
                    
                    // Smoothly fade out success alert after 5 seconds
                    setTimeout(() => {
                        successAlert.style.opacity = '0';
                        successAlert.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => {
                            successAlert.style.display = 'none';
                            successAlert.style.opacity = '1';
                        }, 500);
                    }, 5000);
                } else {
                    console.error(result);
                    errorAlert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${result.message || 'Error! Please check your form fields and try again.'}`;
                    errorAlert.style.display = 'flex';
                }
            })
            .catch(error => {
                console.error(error);
                errorAlert.innerHTML = '<i class="fas fa-exclamation-circle"></i> Connection error. Please try again later.';
                errorAlert.style.display = 'flex';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        } else {
            // Form validation failed
            errorAlert.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error! Please check your form fields and try again.';
            errorAlert.style.display = 'flex';
        }
    });

});
