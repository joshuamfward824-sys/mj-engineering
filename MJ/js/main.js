// MJ Engineering - Main JavaScript
// Real functional logic for navigation, interactions, and accessibility

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initSmoothScrolling();
    initNavbarScrollEffects();
    initActiveNavigationState();
    initRevealAnimations();
    initCopyrightYear();
    initExternalLinks();
    initFormInteractions();
    initIndustryModals();
});

// Mobile Navigation Toggle with ARIA support
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mainNav = document.getElementById('mainNav');
    
    if (!hamburger || !navLinks) return;
    
    // Handle click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu(hamburger, navLinks);
    });
    
    // Handle keyboard activation (Enter/Space)
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu(hamburger, navLinks);
        }
    });
    
    // Close menu when clicking on links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu(hamburger, navLinks);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && navLinks.classList.contains('active')) {
            closeMobileMenu(hamburger, navLinks);
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu(hamburger, navLinks);
            hamburger.focus();
        }
    });
    
    // Handle window resize - close menu if switching to desktop
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu(hamburger, navLinks);
        }
    }, 150));
}

function toggleMobileMenu(hamburger, navLinks) {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
}

function closeMobileMenu(hamburger, navLinks) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

// Industry Modal System
function initIndustryModals() {
    const modal = document.getElementById('industryModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = modal?.querySelector('.modal-close');
    
    if (!modal) return;
    
    // Close modal handlers
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Industry card click handlers
    document.querySelectorAll('.industry-card[data-industry]').forEach(card => {
        card.addEventListener('click', () => {
            const industry = card.getAttribute('data-industry');
            openIndustryModal(industry);
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const industry = card.getAttribute('data-industry');
                openIndustryModal(industry);
            }
        });
    });
    
    function openIndustryModal(industry) {
        const config = getIndustryConfig(industry);
        modalTitle.textContent = config.title;
        modalSubtitle.textContent = config.subtitle;
        modalBody.innerHTML = config.form;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            modalBody.querySelector('input, select, textarea')?.focus();
        }, 100);
        
        // Attach form handler
        const form = modalBody.querySelector('form');
        if (form) {
            form.addEventListener('submit', handleIndustryFormSubmit);
        }
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function handleIndustryFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // In real implementation, this would send to server
        console.log('Industry Solution Request:', data);
        
        // Show success message
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
                <h3 style="color: #d4af37; margin-bottom: 1rem;">Request Received</h3>
                <p style="color: #aaa; line-height: 1.6;">Thank you for your inquiry. Our team will analyze your requirements and contact you within 24 hours with a customized solution proposal.</p>
                <button onclick="document.getElementById('industryModal').classList.remove('active'); document.body.style.overflow='';" 
                        style="margin-top: 2rem; padding: 1rem 2rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    Close
                </button>
            </div>
        `;
    }
}

function getIndustryConfig(industry) {
    const configs = {
        'oil-gas': {
            title: 'Oil & Gas Solutions',
            subtitle: 'Configure your pipeline monitoring and safety systems',
            form: `
                <form>
                    <div class="question-group">
                        <h3>Operation Type</h3>
                        <label><input type="radio" name="operation" value="upstream" required> Upstream (Exploration/Production)</label>
                        <label><input type="radio" name="operation" value="midstream"> Midstream (Transportation/Storage)</label>
                        <label><input type="radio" name="operation" value="downstream"> Downstream (Refining/Distribution)</label>
                    </div>
                    <div class="question-group">
                        <h3>Infrastructure Needs</h3>
                        <label><input type="checkbox" name="needs" value="scada"> SCADA System Integration</label>
                        <label><input type="checkbox" name="needs" value="leak"> Leak Detection Systems</label>
                        <label><input type="checkbox" name="needs" value="telemetry"> Equipment Telemetry</label>
                        <label><input type="checkbox" name="needs" value="safety"> Safety Automation</label>
                    </div>
                    <div class="question-group">
                        <h3>Pipeline Length (approximate)</h3>
                        <select name="pipeline_length" required>
                            <option value="">Select range...</option>
                            <option value="0-10">Under 10 miles</option>
                            <option value="10-50">10-50 miles</option>
                            <option value="50-200">50-200 miles</option>
                            <option value="200+">200+ miles</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Contact Information</h3>
                        <input type="text" name="company" placeholder="Company Name" required style="margin-bottom: 1rem;">
                        <input type="email" name="email" placeholder="Email Address" required style="margin-bottom: 1rem;">
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <button type="submit" class="btn-submit-modal">Get Custom Quote</button>
                </form>
            `
        },
        'manufacturing': {
            title: 'Manufacturing Solutions',
            subtitle: 'Build your smart factory configuration',
            form: `
                <form>
                    <div class="question-group">
                        <h3>Facility Size</h3>
                        <select name="facility_size" required>
                            <option value="">Select facility size...</option>
                            <option value="small">Small (Under 50,000 sq ft)</option>
                            <option value="medium">Medium (50,000-200,000 sq ft)</option>
                            <option value="large">Large (200,000+ sq ft)</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Automation Priorities</h3>
                        <label><input type="checkbox" name="priorities" value="predictive"> Predictive Maintenance</label>
                        <label><input type="checkbox" name="priorities" value="quality"> Quality Control Systems</label>
                        <label><input type="checkbox" name="priorities" value="inventory"> Inventory Management</label>
                        <label><input type="checkbox" name="priorities" value="network"> Industrial Network Upgrade</label>
                    </div>
                    <div class="question-group">
                        <h3>Current Challenges</h3>
                        <textarea name="challenges" rows="3" placeholder="Describe your current operational challenges..."></textarea>
                    </div>
                    <div class="question-group">
                        <h3>Contact Information</h3>
                        <input type="text" name="company" placeholder="Company Name" required style="margin-bottom: 1rem;">
                        <input type="email" name="email" placeholder="Email Address" required style="margin-bottom: 1rem;">
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <button type="submit" class="btn-submit-modal">Get Custom Quote</button>
                </form>
            `
        },
        'telecommunications': {
            title: 'Telecommunications Solutions',
            subtitle: 'Design your network infrastructure project',
            form: `
                <form>
                    <div class="question-group">
                        <h3>Project Type</h3>
                        <label><input type="radio" name="project" value="cell-tower" required> Cell Tower Infrastructure</label>
                        <label><input type="radio" name="project" value="fiber"> Fiber Optic Deployment</label>
                        <label><input type="radio" name="project" value="5g"> Private 5G Network</label>
                        <label><input type="radio" name="project" value="backbone"> Network Backbone</label>
                    </div>
                    <div class="question-group">
                        <h3>Project Scope</h3>
                        <select name="scope" required>
                            <option value="">Select scope...</option>
                            <option value="single">Single Site</option>
                            <option value="regional">Regional (Multiple Sites)</option>
                            <option value="statewide">Statewide Deployment</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Timeline</h3>
                        <select name="timeline">
                            <option value="">Preferred timeline...</option>
                            <option value="immediate">Immediate (ASAP)</option>
                            <option value="3months">Within 3 months</option>
                            <option value="6months">Within 6 months</option>
                            <option value="planning">Planning phase only</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Contact Information</h3>
                        <input type="text" name="company" placeholder="Company Name" required style="margin-bottom: 1rem;">
                        <input type="email" name="email" placeholder="Email Address" required style="margin-bottom: 1rem;">
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <button type="submit" class="btn-submit-modal">Get Custom Quote</button>
                </form>
            `
        },
        'construction': {
            title: 'Construction Solutions',
            subtitle: 'Configure your project management and tracking systems',
            form: `
                <form>
                    <div class="question-group">
                        <h3>Company Focus</h3>
                        <label><input type="radio" name="focus" value="heavy-civil" required> Heavy Civil</label>
                        <label><input type="radio" name="focus" value="commercial"> Commercial Building</label>
                        <label><input type="radio" name="focus" value="residential"> Residential</label>
                        <label><input type="radio" name="focus" value="industrial"> Industrial</label>
                    </div>
                    <div class="question-group">
                        <h3>Equipment Tracking Needs</h3>
                        <label><input type="checkbox" name="equipment" value="gps"> GPS Fleet Tracking</label>
                        <label><input type="checkbox" name="equipment" value="telemetry"> Equipment Telemetry</label>
                        <label><input type="checkbox" name="equipment" value="fuel"> Fuel Monitoring</label>
                        <label><input type="checkbox" name="equipment" value="maintenance"> Maintenance Scheduling</label>
                    </div>
                    <div class="question-group">
                        <h3>Fleet Size</h3>
                        <select name="fleet_size">
                            <option value="">Select fleet size...</option>
                            <option value="small">1-20 units</option>
                            <option value="medium">21-100 units</option>
                            <option value="large">100+ units</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Contact Information</h3>
                        <input type="text" name="company" placeholder="Company Name" required style="margin-bottom: 1rem;">
                        <input type="email" name="email" placeholder="Email Address" required style="margin-bottom: 1rem;">
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <button type="submit" class="btn-submit-modal">Get Custom Quote</button>
                </form>
            `
        },
        'energy': {
            title: 'Energy & Utilities Solutions',
            subtitle: 'Design your smart grid infrastructure',
            form: `
                <form>
                    <div class="question-group">
                        <h3>Utility Type</h3>
                        <label><input type="radio" name="utility" value="electric" required> Electric Utility</label>
                        <label><input type="radio" name="utility" value="water"> Water/Wastewater</label>
                        <label><input type="radio" name="utility" value="gas"> Natural Gas</label>
                        <label><input type="radio" name="utility" value="renewable"> Renewable Energy</label>
                    </div>
                    <div class="question-group">
                        <h3>Service Area</h3>
                        <select name="service_area" required>
                            <option value="">Select service area...</option>
                            <option value="municipal">Municipal</option>
                            <option value="regional">Regional Co-op</option>
                            <option value="state">State-wide</option>
                            <option value="private">Private Industrial</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Smart Grid Components</h3>
                        <label><input type="checkbox" name="components" value="meters"> Smart Metering</label>
                        <label><input type="checkbox" name="components" value="substation"> Substation Automation</label>
                        <label><input type="checkbox" name="components" value="analytics"> Grid Analytics</label>
                        <label><input type="checkbox" name="components" value="renewable"> Renewable Integration</label>
                    </div>
                    <div class="question-group">
                        <h3>Contact Information</h3>
                        <input type="text" name="company" placeholder="Utility/Company Name" required style="margin-bottom: 1rem;">
                        <input type="email" name="email" placeholder="Email Address" required style="margin-bottom: 1rem;">
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <button type="submit" class="btn-submit-modal">Get Custom Quote</button>
                </form>
            `
        },
        'dealership': {
            title: 'Automotive Dealership DMS',
            subtitle: 'Configure your Fortress DMS implementation',
            form: `
                <form>
                    <div class="question-group">
                        <h3>Dealership Size</h3>
                        <select name="dealership_size" required>
                            <option value="">Select dealership size...</option>
                            <option value="single">Single Point</option>
                            <option value="small-group">Small Group (2-5 stores)</option>
                            <option value="large-group">Large Group (6+ stores)</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Current DMS</h3>
                        <select name="current_dms">
                            <option value="">Current system...</option>
                            <option value="cdk">CDK Drive</option>
                            <option value="reynolds">Reynolds & Reynolds</option>
                            <option value="dealertrack">Dealertrack</option>
                            <option value="other">Other</option>
                            <option value="none">None (New Dealership)</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Required Modules</h3>
                        <label><input type="checkbox" name="modules" value="sales"> Sales & F&I</label>
                        <label><input type="checkbox" name="modules" value="service"> Service Department</label>
                        <label><input type="checkbox" name="modules" value="parts"> Parts & Inventory</label>
                        <label><input type="checkbox" name="modules" value="crm"> CRM & Marketing</label>
                        <label><input type="checkbox" name="modules" value="ai"> AI Automation Tools</label>
                    </div>
                    <div class="question-group">
                        <h3>Monthly Transaction Volume</h3>
                        <select name="volume">
                            <option value="">Select volume...</option>
                            <option value="low">Under 100 deals/month</option>
                            <option value="medium">100-500 deals/month</option>
                            <option value="high">500+ deals/month</option>
                        </select>
                    </div>
                    <div class="question-group">
                        <h3>Contact Information</h3>
                        <input type="text" name="dealership_name" placeholder="Dealership Name" required style="margin-bottom: 1rem;">
                        <input type="text" name="contact" placeholder="Contact Name" required style="margin-bottom: 1rem;">
                        <input type="email" name="email" placeholder="Email Address" required style="margin-bottom: 1rem;">
                        <input type="tel" name="phone" placeholder="Phone Number" required>
                    </div>
                    <button type="submit" class="btn-submit-modal">Get DMS Quote</button>
                </form>
            `
        }
    };
    
    return configs[industry] || configs['oil-gas'];
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#services') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
                
                // Set focus to target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });
}

// Navbar Scroll Effects
function initNavbarScrollEffects() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Active Navigation State based on current page
function initActiveNavigationState() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Subtle Reveal Animations using Intersection Observer
function initRevealAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elements = document.querySelectorAll(
        '.hero-brand, .service-card, .industry-card, .pricing-card, .equipment-card, .tier-card, .stat-item, .feature-box, .dms-feature, .ops-item, .detail-card, .contact-method, .hours-box, .form-container'
    );
    
    elements.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
}

// Dynamic Copyright Year
function initCopyrightYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// External Links Security
function initExternalLinks() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('//')) && !href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('aria-label', `${link.textContent} (opens in new tab)`);
        }
    });
}

// Form Interactions
function initFormInteractions() {
    // Handle all forms for validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            // Skip if it's the industry modal form (handled separately)
            if (form.closest('.modal-body')) return;
            
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    field.addEventListener('input', () => field.classList.remove('error'), {once: true});
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Focus first error
                const firstError = form.querySelector('.error');
                if (firstError) firstError.focus();
            }
        });
    });
    
    // Handle contact links with analytics tracking
    document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Real analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_click', {
                    method: link.getAttribute('href').startsWith('mailto:') ? 'email' : 'phone',
                    destination: link.getAttribute('href')
                });
            }
        });
    });
}

// Utility: Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});
