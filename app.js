document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Drawer Navigation
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
    };

    mobileToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    // ==========================================
    // 2. Sticky Navbar & Active Section Highlights
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight section when user scrolled halfway through it
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 3. Interactive Pricing Estimator & Sync
    // ==========================================
    const hoursSlider = document.getElementById('hours-slider');
    const hoursDisplay = document.getElementById('hours-display');
    const promoBreakdown = document.getElementById('promo-breakdown');
    const standardBreakdown = document.getElementById('standard-breakdown');
    const totalPrice = document.getElementById('total-price');
    const savingsDisplay = document.getElementById('savings-display');
    
    // Form items
    const formHoursInput = document.getElementById('form-hours');
    const formCalculatedTotal = document.getElementById('form-calculated-total');

    // Rates configuration
    const PROMO_RATE = 20; // First 6 hours rate
    const STANDARD_RATE = 25; // Standard rate after 6 hours

    const calculateEstimate = (hours) => {
        let promoCost = 0;
        let standardCost = 0;
        
        if (hours <= 6) {
            promoCost = hours * PROMO_RATE;
            standardCost = 0;
        } else {
            promoCost = 6 * PROMO_RATE;
            standardCost = (hours - 6) * STANDARD_RATE;
        }

        const totalCost = promoCost + standardCost;
        
        // Calculate savings (what it would cost if everything was standard rate $25/hour)
        const regularTotal = hours * STANDARD_RATE;
        const savings = regularTotal - totalCost;

        return {
            promoCost,
            standardCost,
            totalCost,
            savings
        };
    };

    const updateUIEstimates = (hours) => {
        const results = calculateEstimate(hours);
        
        // Update display text
        hoursDisplay.textContent = hours;
        promoBreakdown.textContent = `$${results.promoCost.toFixed(2)}`;
        standardBreakdown.textContent = `$${results.standardCost.toFixed(2)}`;
        totalPrice.textContent = `$${results.totalCost.toFixed(2)}`;
        savingsDisplay.textContent = `$${results.savings.toFixed(2)}`;
        
        // Sync with Booking Form values
        formHoursInput.value = hours;
        formCalculatedTotal.textContent = `$${results.totalCost.toFixed(2)}`;
    };

    // Event listener for the range slider
    hoursSlider.addEventListener('input', (e) => {
        const hours = parseFloat(e.target.value);
        updateUIEstimates(hours);
    });

    // Event listener for the form's hour input to sync backwards to the slider
    formHoursInput.addEventListener('input', (e) => {
        let hours = parseFloat(e.target.value);
        if (isNaN(hours) || hours < 2) hours = 2;
        if (hours > 24) hours = 24;
        
        hoursSlider.value = hours;
        updateUIEstimates(hours);
    });

    // Initialize with default value (4 hours)
    updateUIEstimates(4);


    // ==========================================
    // 4. Contact & Booking Form Simulation
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Read form inputs
        const name = document.getElementById('form-name').value;
        const phone = document.getElementById('form-phone').value;
        const email = document.getElementById('form-email').value;
        const address = document.getElementById('form-address').value;
        const serviceSelect = document.getElementById('form-service');
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        const hours = document.getElementById('form-hours').value;
        const msg = document.getElementById('form-message').value;
        const estimatedQuote = formCalculatedTotal.textContent;

        // Build the shared email content
        const emailTo = 'tabathamarsland1@gmail.com';
        const rawSubject = `New Cleaning Inquiry from ${name}`;
        const rawBody =
            `Hi Tabatha,\n\n` +
            `I would like to request a cleaning estimate/consultation. Here are the details:\n\n` +
            `Name: ${name}\n` +
            `Phone: ${phone}\n` +
            `Email: ${email}\n` +
            `Cleaning Address: ${address}\n` +
            `Service Requested: ${serviceText}\n` +
            `Estimated Hours: ${hours} hours\n` +
            `Estimated Quote: ${estimatedQuote}\n\n` +
            `Special Details:\n${msg || 'None provided'}\n\n` +
            `Thank you!`;

        const subject = encodeURIComponent(rawSubject);
        const body    = encodeURIComponent(rawBody);

        // Build links for each email provider
        const mailtoLink  = `mailto:${emailTo}?subject=${subject}&body=${body}`;
        const gmailLink   = `https://mail.google.com/mail/?view=cm&to=${emailTo}&su=${subject}&body=${body}`;
        const outlookLink = `https://outlook.live.com/mail/0/deeplink/compose?to=${emailTo}&subject=${subject}&body=${body}`;
        const yahooLink   = `https://compose.mail.yahoo.com/?to=${emailTo}&subject=${subject}&body=${body}`;

        // Populate the modal buttons with the correct links
        document.getElementById('email-gmail').href   = gmailLink;
        document.getElementById('email-outlook').href = outlookLink;
        document.getElementById('email-yahoo').href   = yahooLink;
        document.getElementById('email-default').href = mailtoLink;

        // Show the email picker modal
        document.getElementById('email-picker-modal').classList.remove('hidden');
    });

    // Close email picker modal
    document.getElementById('email-picker-close').addEventListener('click', () => {
        document.getElementById('email-picker-modal').classList.add('hidden');
        // Show success banner after they close the picker (they've picked their client)
        contactForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
    });

    // Any email client button click also triggers success state
    document.querySelectorAll('.email-client-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                document.getElementById('email-picker-modal').classList.add('hidden');
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            }, 300);
        });
    });

    resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        formSuccess.classList.add('hidden');
        // Reset default values
        updateUIEstimates(4);
    });


    // ==========================================
    // 5. QR Code Generator Utility
    // ==========================================
    const qrUrlInput = document.getElementById('qr-url');
    const qrSizeSelect = document.getElementById('qr-size');
    const qrTargetDiv = document.getElementById('qrcode-target');
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const downloadQrBtn = document.getElementById('download-qr-btn');

    // Default to the live Netlify domain
    const currentLoc = window.location.origin + window.location.pathname;
    if (currentLoc.startsWith('http') && !currentLoc.startsWith('file://')) {
        qrUrlInput.value = currentLoc;
    } else {
        qrUrlInput.value = 'https://tts-cleaning.netlify.app/';
    }

    const generateQRCode = () => {
        const url = qrUrlInput.value.trim() || 'https://tts-cleaning.netlify.app/';
        const size = parseInt(qrSizeSelect.value) || 350;
        
        // Get checked color
        const colorRadio = document.querySelector('input[name="qr-color"]:checked');
        const colorHex = colorRadio ? colorRadio.value : '000000';

        // Clear previous QR Code
        qrTargetDiv.innerHTML = '';
        downloadQrBtn.classList.add('disabled');
        downloadQrBtn.href = '#';

        // Use QRCode.js library to render the code
        try {
            const qrcode = new QRCode(qrTargetDiv, {
                text: url,
                width: size,
                height: size,
                colorDark: `#${colorHex}`,
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H // High error correction (good for printing)
            });

            // Wait a small window for the canvas/image to draw, then configure download button
            setTimeout(() => {
                const canvas = qrTargetDiv.querySelector('canvas');
                const img = qrTargetDiv.querySelector('img');

                if (canvas) {
                    downloadQrBtn.href = canvas.toDataURL('image/png');
                    downloadQrBtn.classList.remove('disabled');
                } else if (img && img.src) {
                    downloadQrBtn.href = img.src;
                    downloadQrBtn.classList.remove('disabled');
                }
            }, 250);

        } catch (err) {
            console.error('Failed to generate QR Code:', err);
            qrTargetDiv.innerHTML = `<p style="color:red; font-size:0.9rem;">Error generating QR code. Make sure URL is valid.</p>`;
        }
    };

    // Event listener for generating
    generateQrBtn.addEventListener('click', generateQRCode);
    
    // Add change listeners to inputs for auto-updating experience
    qrSizeSelect.addEventListener('change', generateQRCode);
    document.querySelectorAll('input[name="qr-color"]').forEach(radio => {
        radio.addEventListener('change', generateQRCode);
    });

    // Generate initial QR Code on load
    setTimeout(generateQRCode, 500);

});
