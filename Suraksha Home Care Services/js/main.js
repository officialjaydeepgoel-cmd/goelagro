// ===== CONFIGURATION =====
const CONFIG = {
  API_BASE: window.location.origin,
  WHATSAPP_NUMBER: '919876543210',
  WHATSAPP_MSG: 'Hi! I need home services. Please help.',
  PHONE: '+91-98765-43210'
};

// ===== UTILITY FUNCTIONS =====
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

// ===== NAVIGATION =====
function initNavigation() {
  const header = $('#header');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const overlay = $('#mobileOverlay');
  const closeBtn = $('#closeMenu');
  const mobileLinks = $$('.mobile-nav-link');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (current > lastScroll && current > 300) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScroll = current;
  }, { passive: true });

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenuFunc() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenuFunc);
  overlay.addEventListener('click', closeMenuFunc);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenuFunc));

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active link highlighting
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a, .mobile-nav-link');

  function highlightActive() {
    let current = '';
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightActive, { passive: true });
  highlightActive();
}

// ===== PAGE LOADER =====
function initPageLoader() {
  const loader = $('#pageLoader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
  }
}

// ===== STATS COUNTER =====
function initStatsCounter() {
  const statNumbers = $$('[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);

          if (el.id === 'statCities') {
            el.textContent = current + '+';
          } else if (target >= 1000) {
            el.textContent = current.toLocaleString() + '+';
          } else {
            el.textContent = current + '+';
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (el.id === 'statCities') {
              el.textContent = target + '+';
            } else if (target >= 1000) {
              el.textContent = target.toLocaleString() + '+';
            } else {
              el.textContent = target + '+';
            }
          }
        }
        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

// ===== SERVICES =====
async function loadServices() {
  const grid = $('#servicesGrid');
  if (!grid) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/services`);
    if (!res.ok) throw new Error('Failed to load services');
    const services = await res.json();

    grid.innerHTML = services.map(service => `
      <div class="service-card fade-in">
        <div class="service-icon"><i class="${service.icon || 'fas fa-broom'}"></i></div>
        <h3>${service.name}</h3>
        <p>${service.shortDesc || service.description}</p>
        <ul class="service-features">
          ${(service.features || []).slice(0, 3).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
        </ul>
        <div class="service-footer">
          <span class="service-price">Starting ${service.packages && service.packages[0] ? service.packages[0].price : 'Contact'}</span>
          <button class="btn btn-sm btn-primary" onclick="openBookingModal('${service.name}')">
            <i class="fas fa-calendar-check"></i> Book Now
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Services error:', err);
    grid.innerHTML = `<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load services. Please refresh or call us.</p></div>`;
  }
}

// ===== PRICING =====
async function loadPricing(serviceId) {
  const container = $('#pricingGrid');
  if (!container) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/services${serviceId ? '/' + serviceId : ''}`);
    if (!res.ok) throw new Error('Failed to load pricing');
    const data = await res.json();
    const services = serviceId ? [data] : data;

    container.innerHTML = services.slice(0, 3).map(service => `
      <div class="pricing-card fade-in">
        <h3>${service.name}</h3>
        <div class="price-amount">${service.packages && service.packages[1] ? service.packages[1].price : 'Contact'} <span>/ service</span></div>
        <div class="price-desc">${service.shortDesc || ''}</div>
        <ul class="pricing-features">
          ${(service.features || []).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
        </ul>
        <button class="btn btn-primary" onclick="openBookingModal('${service.name}')"><i class="fas fa-calendar-check"></i> Book Now</button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Pricing error:', err);
  }
}

// ===== TESTIMONIALS =====
function initTestimonialSlider() {
  const track = $('#testimonialTrack');
  const prev = $('#testPrev');
  const next = $('#testNext');
  const dots = $$('#testDots span');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  if (!cards.length) return;

  let currentIndex = 0;
  let autoRotate;
  const AUTO_INTERVAL = 5000;

  function getCardWidth() {
    const card = cards[0];
    const style = getComputedStyle(card);
    const gap = parseFloat(style.marginRight) || 24;
    return card.offsetWidth + gap;
  }

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateSlider() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    let offset = 0;
    for (let i = 0; i < currentIndex; i++) {
      offset += cards[i].offsetWidth + 24;
    }
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((dot, i) => {
      const ratio = dots.length - 1;
      const dotIndex = Math.round((i / ratio) * maxIdx);
      dot.classList.toggle('active', dotIndex === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = index;
    updateSlider();
    resetAutoRotate();
  }

  function nextSlide() {
    const maxIdx = getMaxIndex();
    currentIndex = currentIndex < maxIdx ? currentIndex + 1 : 0;
    updateSlider();
    resetAutoRotate();
  }

  function prevSlide() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
    updateSlider();
    resetAutoRotate();
  }

  function startAutoRotate() {
    autoRotate = setInterval(nextSlide, AUTO_INTERVAL);
  }

  function resetAutoRotate() {
    clearInterval(autoRotate);
    startAutoRotate();
  }

  if (next) next.addEventListener('click', nextSlide);
  if (prev) prev.addEventListener('click', prevSlide);
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const maxIdx = getMaxIndex();
      const steps = dots.length - 1;
      goTo(Math.round((i / steps) * maxIdx));
    });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateSlider, 100);
  }, { passive: true });

  updateSlider();
  startAutoRotate();
}

async function loadTestimonials() {
  const track = $('#testimonialTrack');
  if (!track) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/reviews`);
    if (!res.ok) throw new Error('Failed to load reviews');
    const reviews = await res.json();

    if (reviews.length === 0) return;

    track.innerHTML = reviews.map(review => {
      const initials = review.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      return `
        <div class="testimonial-card">
          <div class="stars">${'<i class="fas fa-star"></i>'.repeat(Math.min(review.rating, 5))}</div>
          <div class="text">"${review.review}"</div>
          <div class="author">
            <div class="author-avatar">${initials}</div>
            <div class="author-info">
              <h4>${review.name}</h4>
              <span>${review.service || 'Verified Customer'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Testimonials error:', err);
  }
}

// ===== FAQ =====
function initFAQ() {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isActive = item.classList.contains('active');
      $$('.faq-item.active').forEach(el => el.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ===== BLOG =====
async function loadBlogPosts() {
  const grid = $('#blogGrid');
  if (!grid) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/blog`);
    if (!res.ok) throw new Error('Failed to load blog posts');
    const posts = await res.json();

    if (posts.length === 0) {
      grid.innerHTML = '';
      return;
    }

    grid.innerHTML = posts.slice(0, 3).map(post => `
      <div class="blog-card fade-in">
        <div class="blog-img">
          <img src="${post.image || '/assets/images/blog-placeholder.jpg'}" alt="${post.title}" loading="lazy" onerror="this.parentElement.classList.add('no-img')">
          <div class="blog-category">${post.category || 'General'}</div>
        </div>
        <div class="blog-body">
          <div class="blog-meta"><i class="far fa-calendar-alt"></i> ${post.date} <span class="blog-meta-divider">|</span> <i class="far fa-user"></i> ${post.author || 'Suraksha Team'}</div>
          <h3>${post.title}</h3>
          <p>${post.excerpt || ''}</p>
          <button class="btn btn-link" onclick="openBlogModal(${post.id})">Read More <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Blog error:', err);
    grid.innerHTML = `<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load blog posts.</p></div>`;
  }
}

// ===== GALLERY - Before/After Comparison =====
function initBeforeAfter() {
  $$('.before-after').forEach(container => {
    const beforeImg = container.querySelector('.before-img');
    const afterImg = container.querySelector('.after-img');
    const handle = container.querySelector('.ba-handle');

    if (!beforeImg || !afterImg || !handle) return;

    let isDragging = false;

    function updatePosition(x) {
      const rect = container.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      const pct = pos * 100;
      beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = `${pct}%`;
    }

    function onStart(e) {
      isDragging = true;
      container.classList.add('dragging');
      const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      updatePosition(x);
    }

    function onMove(e) {
      if (!isDragging) return;
      const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      updatePosition(x);
    }

    function onEnd() {
      isDragging = false;
      container.classList.remove('dragging');
    }

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);

    // Init at 50%
    updatePosition(container.getBoundingClientRect().left + container.offsetWidth / 2);
  });
}

async function loadGallery() {
  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/gallery`);
    if (!res.ok) throw new Error('Failed to load gallery');
    const data = await res.json();
    const items = data.beforeAfter || [];
    const container = $('#galleryBeforeAfter');
    if (container && items.length) {
      container.innerHTML = items.map(item => `
        <div class="before-after fade-in">
          <div class="ba-img before-img" style="background-image:url('${item.before}')"></div>
          <div class="ba-img after-img" style="background-image:url('${item.after}')"></div>
          <div class="ba-handle"><i class="fas fa-arrows-alt-h"></i></div>
          <div class="ba-label ba-label-before">Before</div>
          <div class="ba-label ba-label-after">After</div>
        </div>
      `).join('');
      initBeforeAfter();
    }
  } catch (err) {
    console.error('Gallery error:', err);
  }
}

// ===== BOOKING MODAL =====
function initBookingModal() {
  const modal = $('#bookingModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close, .close-modal');
  const overlay = modal.querySelector('.modal-overlay');

  function openModal(serviceName) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const serviceSelect = modal.querySelector('#bookingService');
    if (serviceSelect && serviceName) {
      serviceSelect.value = serviceName;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  const form = modal.querySelector('#bookingForm');
  if (form) {
    form.addEventListener('submit', submitBooking);
  }

  window.closeBookingModal = closeModal;
}

function openBookingModal(serviceName) {
  let modal = $('#bookingModal');
  if (!modal) {
    modal = createBookingModal();
    document.body.appendChild(modal);
    initBookingModal();
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const serviceSelect = modal.querySelector('#bookingService');
  if (serviceSelect && serviceName) {
    serviceSelect.value = serviceName;
  }
}

function createBookingModal() {
  const modal = document.createElement('div');
  modal.id = 'bookingModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close" onclick="closeBookingModal()" aria-label="Close"><i class="fas fa-times"></i></button>
      <div class="modal-header">
        <h2><i class="fas fa-calendar-check"></i> Book a Service</h2>
        <p>Fill in your details and we'll confirm your booking within 30 minutes.</p>
      </div>
      <div class="modal-body">
        <div class="form-success" id="bookingSuccess" style="display:none">
          <i class="fas fa-check-circle"></i>
          <h4>Booking Confirmed!</h4>
          <p>Thank you! We've received your booking request. Our team will contact you within 30 minutes to confirm the details.</p>
        </div>
        <form id="bookingForm" onsubmit="return false;">
          <div class="form-row">
            <div class="form-group">
              <label for="bookingName">Full Name *</label>
              <input type="text" id="bookingName" name="name" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
              <label for="bookingPhone">Phone Number *</label>
              <input type="tel" id="bookingPhone" name="phone" placeholder="Enter 10-digit phone number" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="bookingEmail">Email Address</label>
              <input type="email" id="bookingEmail" name="email" placeholder="Enter your email">
            </div>
            <div class="form-group">
              <label for="bookingService">Service Required *</label>
              <select id="bookingService" name="service" required>
                <option value="">Select a service</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Regular Cleaning">Regular Cleaning</option>
                <option value="Kitchen Cleaning">Kitchen Cleaning</option>
                <option value="Bathroom Cleaning">Bathroom Cleaning</option>
                <option value="Sofa Cleaning">Sofa Cleaning</option>
                <option value="Carpet Cleaning">Carpet Cleaning</option>
                <option value="Pest Control">Pest Control</option>
                <option value="AC Service">AC Service</option>
                <option value="Water Tank Cleaning">Water Tank Cleaning</option>
                <option value="Office Cleaning">Office Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="bookingDate">Preferred Date *</label>
              <input type="date" id="bookingDate" name="date" required>
            </div>
            <div class="form-group">
              <label for="bookingTime">Preferred Time</label>
              <select id="bookingTime" name="time">
                <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="bookingAddress">Service Address *</label>
            <textarea id="bookingAddress" name="address" placeholder="Enter your full address with landmark, city, pincode" required rows="2"></textarea>
          </div>
          <div class="form-group">
            <label for="bookingMessage">Additional Notes</label>
            <textarea id="bookingMessage" name="message" placeholder="Any special requirements or instructions" rows="2"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="bookingSubmitBtn"><i class="fas fa-paper-plane"></i> Confirm Booking</button>
        </form>
      </div>
    </div>
  `;
  return modal;
}

async function submitBooking(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const name = form.querySelector('#bookingName').value.trim();
  const phone = form.querySelector('#bookingPhone').value.trim();
  const email = form.querySelector('#bookingEmail').value.trim();
  const service = form.querySelector('#bookingService').value;
  const date = form.querySelector('#bookingDate').value;
  const time = form.querySelector('#bookingTime').value;
  const address = form.querySelector('#bookingAddress').value.trim();
  const message = form.querySelector('#bookingMessage').value.trim();

  // Validation
  if (!name) { showFormError(form, '#bookingName', 'Please enter your name'); return; }
  if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    showFormError(form, '#bookingPhone', 'Please enter a valid 10-digit phone number');
    return;
  }
  if (!service) { showFormError(form, '#bookingService', 'Please select a service'); return; }
  if (!date) { showFormError(form, '#bookingDate', 'Please select a preferred date'); return; }
  if (!address) { showFormError(form, '#bookingAddress', 'Please enter your service address'); return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormError(form, '#bookingEmail', 'Please enter a valid email address');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone: phone.replace(/\D/g, ''),
        email,
        service,
        date,
        time,
        address,
        message
      })
    });

    if (!res.ok) throw new Error('Booking submission failed');

    const success = form.parentElement.querySelector('#bookingSuccess');
    form.style.display = 'none';
    if (success) {
      success.style.display = 'block';
      success.classList.add('show');
    }

    // Auto close after 5 seconds
    setTimeout(() => {
      const modal = form.closest('.modal');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
      // Reset for next time
      form.reset();
      form.style.display = '';
      if (success) success.style.display = 'none';
    }, 5000);

    // Also send WhatsApp notification
    openWhatsApp(`Hi! I want to book ${service} on ${date}. My name is ${name}, phone: ${phone}.`);
  } catch (err) {
    console.error('Booking error:', err);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirm Booking';
    alert('Sorry, something went wrong. Please try again or call us at ' + CONFIG.PHONE);
  }
}

function showFormError(form, selector, msg) {
  const input = form.querySelector(selector);
  if (input) {
    input.classList.add('error');
    input.focus();
    const existing = input.parentElement.querySelector('.error-msg');
    if (!existing) {
      const err = document.createElement('small');
      err.className = 'error-msg';
      err.textContent = msg;
      input.parentElement.appendChild(err);
    }
    input.addEventListener('input', function clearErr() {
      this.classList.remove('error');
      const e = this.parentElement.querySelector('.error-msg');
      if (e) e.remove();
      this.removeEventListener('input', clearErr);
    }, { once: true });
  }
}

function closeBookingModal() {
  const modal = $('#bookingModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', submitContact);
}

async function submitContact(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const success = $('#formSuccess');

  const name = form.querySelector('#formName').value.trim();
  const phone = form.querySelector('#formPhone').value.trim();
  const email = form.querySelector('#formEmail').value.trim();
  const service = form.querySelector('#formService').value;
  const message = form.querySelector('#formMessage').value.trim();

  // Validation
  if (!name) { showFormError(form, '#formName', 'Please enter your name'); return; }
  if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    showFormError(form, '#formPhone', 'Please enter a valid 10-digit phone number');
    return;
  }
  if (!service) { showFormError(form, '#formService', 'Please select a service'); return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormError(form, '#formEmail', 'Please enter a valid email address');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone: phone.replace(/\D/g, ''), email, service, message })
    });

    if (!res.ok) throw new Error('Contact submission failed');

    form.style.display = 'none';
    if (success) {
      success.classList.add('show');
    }
  } catch (err) {
    console.error('Contact error:', err);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Enquiry';
    alert('Something went wrong. Please try again or call us at ' + CONFIG.PHONE);
  }
}

// ===== WHATSAPP =====
function openWhatsApp(message) {
  const text = encodeURIComponent(message || CONFIG.WHATSAPP_MSG);
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${text}`, '_blank');
}

// ===== CALL NOW =====
function callNow() {
  window.location.href = `tel:${CONFIG.PHONE.replace(/\D/g, '')}`;
}

// ===== BLOG MODAL =====
async function openBlogModal(postId) {
  try {
    const res = await fetch(`${CONFIG.API_BASE}/api/blog`);
    if (!res.ok) throw new Error('Failed to load post');
    const posts = await res.json();
    const post = posts.find(p => p.id == postId);
    if (!post) return;

    const existing = $('#blogModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'blogModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
      <div class="modal-content modal-content-lg">
        <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="Close"><i class="fas fa-times"></i></button>
        <div class="modal-body blog-modal-body">
          ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-modal-img" onerror="this.style.display='none'">` : ''}
          <div class="blog-modal-meta">
            <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
            <span><i class="far fa-user"></i> ${post.author || 'Suraksha Team'}</span>
            <span><i class="fas fa-tag"></i> ${post.category || 'General'}</span>
          </div>
          <h2>${post.title}</h2>
          ${post.content || post.excerpt ? `<div class="blog-modal-content">${post.content || post.excerpt}</div>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('open'), 10);
    document.body.style.overflow = 'hidden';

    // Close on escape
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  } catch (err) {
    console.error('Blog modal error:', err);
  }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });
}

// ===== SKELETON LOADING STATES =====
function hideSkeletons(containerId) {
  const container = $(containerId);
  if (container) {
    container.querySelectorAll('.service-skeleton, .blog-skeleton').forEach(s => s.remove());
  }
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const existing = $('#backToTop');
  if (existing) return;

  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.className = 'back-to-top';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== ANNOUNCEMENT BAR =====
function initAnnouncementBar() {
  const bar = $('#announcementBar');
  if (bar) {
    const close = bar.querySelector('.announcement-close');
    if (close) {
      close.addEventListener('click', () => {
        bar.classList.add('hidden');
      });
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
  initPageLoader();
  initNavigation();
  initFAQ();
  initScrollAnimations();
  initStatsCounter();
  initTestimonialSlider();
  initBeforeAfter();
  initBookingModal();
  initContactForm();
  initBackToTop();
  initAnnouncementBar();
  loadServices();
  loadTestimonials();
  loadBlogPosts();
  loadGallery();
});
