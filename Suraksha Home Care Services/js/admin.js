// ===== CONFIG =====
const API = window.location.origin;
let currentEditId = null;

// ===== AUTH =====
function checkAuth() {
  const token = localStorage.getItem('adminToken');
  const loginPage = window.location.pathname.includes('login');
  if (!token && !loginPage) {
    window.location.href = '/admin/index.html';
    return;
  }
  if (token && loginPage) {
    window.location.href = '/admin/dashboard.html';
    return;
  }
  if (token) {
    document.body.style.display = '';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username')?.value;
  const password = document.getElementById('password')?.value;
  const btn = event.target.querySelector('button[type="submit"]');
  if (!username || !password) {
    showAlert('Please enter username and password', 'error');
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  setTimeout(() => {
    if (username === 'admin' && password === 'suraksha2024') {
      localStorage.setItem('adminToken', btoa(Date.now().toString()));
      localStorage.setItem('adminUser', username);
      showAlert('Login successful! Redirecting...', 'success');
      setTimeout(() => { window.location.href = '/admin/dashboard.html'; }, 800);
    } else {
      showAlert('Invalid credentials. Use admin / suraksha2024', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
  }, 600);
}

function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin/index.html';
}

// ===== SIDEBAR =====
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('.html', '').replace('/admin/', ''))) {
      link.classList.add('active');
    }
  });
  const userEl = document.getElementById('sidebarUser');
  if (userEl) {
    userEl.textContent = localStorage.getItem('adminUser') || 'Admin';
  }
}

// ===== DASHBOARD =====
async function loadDashboardStats() {
  const stats = {
    services: 0, bookings: 0, reviews: 0, contacts: 0, blog: 0
  };
  try {
    const [services, bookings, reviews, contacts, blog] = await Promise.all([
      fetch(`${API}/api/services`).then(r => r.json()),
      fetch(`${API}/api/bookings`).then(r => r.json()),
      fetch(`${API}/api/reviews`).then(r => r.json()),
      fetch(`${API}/api/contacts`).then(r => r.json()),
      fetch(`${API}/api/blog`).then(r => r.json())
    ]);
    stats.services = Array.isArray(services) ? services.length : 0;
    stats.bookings = Array.isArray(bookings) ? bookings.length : 0;
    stats.reviews = Array.isArray(reviews) ? reviews.length : 0;
    stats.contacts = Array.isArray(contacts) ? contacts.length : 0;
    stats.blog = Array.isArray(blog) ? blog.length : 0;

    const pendingBookings = Array.isArray(bookings) ? bookings.filter(b => b.status === 'pending').length : 0;

    const statEls = {
      'statServices': stats.services,
      'statBookings': stats.bookings,
      'statPending': pendingBookings,
      'statReviews': stats.reviews,
      'statContacts': stats.contacts,
      'statBlog': stats.blog
    };
    Object.keys(statEls).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = statEls[id];
    });
  } catch (err) {
    showAlert('Failed to load dashboard stats: ' + err.message, 'error');
  }
  loadRecentBookings();
}

async function loadRecentBookings() {
  const tbody = document.getElementById('recentBookingsBody');
  if (!tbody) return;
  try {
    const bookings = await fetch(`${API}/api/bookings`).then(r => r.json());
    if (!Array.isArray(bookings) || bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No bookings yet</td></tr>';
      return;
    }
    const recent = bookings.slice(-5).reverse();
    tbody.innerHTML = recent.map(b => `
      <tr>
        <td>${escapeHTML(b.name || 'N/A')}</td>
        <td>${escapeHTML(b.service || 'N/A')}</td>
        <td>${escapeHTML(b.phone || '')}</td>
        <td>${formatDate(b.createdAt)}</td>
        <td>${getStatusBadge(b.status || 'pending')}</td>
        <td>
          <a href="/admin/bookings.html" class="btn btn-sm btn-outline">View All</a>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Failed to load bookings</td></tr>';
  }
}

// ===== SERVICES CRUD =====
async function loadServices() {
  const tbody = document.getElementById('servicesBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading services...</td></tr>';
  try {
    const services = await fetch(`${API}/api/services`).then(r => r.json());
    if (!Array.isArray(services) || services.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No services found. Click "Add Service" to create one.</td></tr>';
      return;
    }
    tbody.innerHTML = services.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>
          ${s.image ? `<img src="${s.image}" alt="${escapeHTML(s.name)}" class="table-thumb">` : ''}
          ${escapeHTML(s.name || 'Unnamed')}
        </td>
        <td>${escapeHTML(s.category || 'general')}</td>
        <td>${escapeHTML((s.shortDesc || '').substring(0, 60))}${(s.shortDesc || '').length > 60 ? '...' : ''}</td>
        <td>${s.features ? s.features.length : 0} features</td>
        <td class="action-cell">
          <button class="btn btn-sm btn-outline" onclick="editService('${s.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteService('${s.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading services: ' + err.message + '</td></tr>';
  }
}

async function deleteService(id) {
  const confirmed = await confirmAction('Are you sure you want to delete this service? This cannot be undone.');
  if (!confirmed) return;
  try {
    const res = await fetch(`${API}/api/services/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showAlert('Service deleted successfully', 'success');
    loadServices();
  } catch (err) {
    showAlert('Failed to delete service: ' + err.message, 'error');
  }
}

async function editService(id) {
  try {
    const res = await fetch(`${API}/api/services/${id}`);
    if (!res.ok) throw new Error('Service not found');
    const service = await res.json();
    openServiceModal(service);
  } catch (err) {
    showAlert('Failed to load service: ' + err.message, 'error');
  }
}

function openServiceModal(serviceData) {
  const modal = document.getElementById('serviceModal');
  const form = document.getElementById('serviceForm');
  const title = document.getElementById('serviceModalTitle');
  if (!modal || !form) return;
  form.reset();
  document.getElementById('featuresContainer').innerHTML = '';
  document.getElementById('packagesContainer').innerHTML = '';
  document.getElementById('faqsContainer').innerHTML = '';
  document.getElementById('imagePreview').innerHTML = '';
  currentEditId = null;

  if (serviceData) {
    currentEditId = serviceData.id;
    title.textContent = 'Edit Service';
    document.getElementById('serviceName').value = serviceData.name || '';
    document.getElementById('serviceCategory').value = serviceData.category || 'cleaning';
    document.getElementById('serviceShortDesc').value = serviceData.shortDesc || '';
    document.getElementById('serviceDescription').value = serviceData.description || '';
    document.getElementById('serviceIcon').value = serviceData.icon || 'fas fa-broom';

    if (serviceData.image) {
      document.getElementById('imagePreview').innerHTML = `<img src="${serviceData.image}" class="preview-img">`;
    }
    if (serviceData.features && Array.isArray(serviceData.features)) {
      serviceData.features.forEach(f => addFeature(f));
    }
    if (serviceData.packages && Array.isArray(serviceData.packages)) {
      serviceData.packages.forEach(p => addPackage(p));
    }
    if (serviceData.faqs && Array.isArray(serviceData.faqs)) {
      serviceData.faqs.forEach(f => addFAQ(f));
    }
  } else {
    title.textContent = 'Add New Service';
  }
  modal.classList.add('open');
}

function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (modal) modal.classList.remove('open');
  currentEditId = null;
}

async function saveService(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  const features = [];
  document.querySelectorAll('.feature-item').forEach(el => {
    const val = el.querySelector('input')?.value;
    if (val) features.push(val);
  });
  const packages = [];
  document.querySelectorAll('.package-item').forEach(el => {
    const name = el.querySelector('.pkg-name')?.value;
    const price = el.querySelector('.pkg-price')?.value;
    if (name && price) packages.push({ name, price });
  });
  const faqs = [];
  document.querySelectorAll('.faq-item').forEach(el => {
    const q = el.querySelector('.faq-q')?.value;
    const a = el.querySelector('.faq-a')?.value;
    if (q && a) faqs.push({ question: q, answer: a });
  });

  const formData = new FormData(form);
  formData.set('features', JSON.stringify(features));
  formData.set('packages', JSON.stringify(packages));
  formData.set('faqs', JSON.stringify(faqs));

  try {
    const url = currentEditId ? `${API}/api/services/${currentEditId}` : `${API}/api/services`;
    const method = currentEditId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, body: formData });
    if (!res.ok) throw new Error('Failed to save service');
    showAlert(currentEditId ? 'Service updated successfully' : 'Service created successfully', 'success');
    closeServiceModal();
    loadServices();
  } catch (err) {
    showAlert('Error saving service: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = currentEditId ? '<i class="fas fa-save"></i> Update Service' : '<i class="fas fa-plus"></i> Create Service';
  }
}

function addFeature(value) {
  const container = document.getElementById('featuresContainer');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'feature-item input-group';
  div.innerHTML = `
    <input type="text" class="form-control" placeholder="Enter feature" value="${escapeHTML(value || '')}">
    <button type="button" class="btn btn-sm btn-danger" onclick="removeFeature(this)"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(div);
}

function removeFeature(btn) {
  btn.closest('.feature-item')?.remove();
}

function addPackage(pkg) {
  const container = document.getElementById('packagesContainer');
  if (!container) return;
  const name = typeof pkg === 'string' ? pkg : (pkg?.name || '');
  const price = typeof pkg === 'object' && pkg ? (pkg?.price || '') : '';
  const div = document.createElement('div');
  div.className = 'package-item input-group';
  div.innerHTML = `
    <input type="text" class="form-control pkg-name" placeholder="Package name (e.g. 2BHK)" value="${escapeHTML(name)}">
    <input type="text" class="form-control pkg-price" placeholder="Price (e.g. ₹4,999)" value="${escapeHTML(price)}">
    <button type="button" class="btn btn-sm btn-danger" onclick="removePackage(this)"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(div);
}

function removePackage(btn) {
  btn.closest('.package-item')?.remove();
}

function addFAQ(faq) {
  const container = document.getElementById('faqsContainer');
  if (!container) return;
  const q = typeof faq === 'object' && faq ? (faq?.question || '') : '';
  const a = typeof faq === 'object' && faq ? (faq?.answer || '') : '';
  const div = document.createElement('div');
  div.className = 'faq-item input-group input-group-vertical';
  div.innerHTML = `
    <input type="text" class="form-control faq-q" placeholder="Question" value="${escapeHTML(q)}">
    <textarea class="form-control faq-a" placeholder="Answer" rows="2">${escapeHTML(a)}</textarea>
    <button type="button" class="btn btn-sm btn-danger" onclick="removeFAQ(this)"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(div);
}

function removeFAQ(btn) {
  btn.closest('.faq-item')?.remove();
}

// ===== GALLERY =====
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading gallery...</div>';
  try {
    const gallery = await fetch(`${API}/api/gallery`).then(r => r.json());
    const items = gallery.beforeAfter || gallery;
    if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = '<div class="empty-state">No gallery images yet. Drag and drop images to upload.</div>';
      return;
    }
    grid.innerHTML = items.map(img => `
      <div class="gallery-card">
        <img src="${img.before || img.image || ''}" alt="${escapeHTML(img.title || 'Gallery')}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="gallery-card-info">
          <h4>${escapeHTML(img.title || 'Untitled')}</h4>
          <p>${escapeHTML((img.description || '').substring(0, 50))}</p>
        </div>
        <button class="btn btn-sm btn-danger gallery-delete-btn" onclick="deleteGalleryEntry(${img.id})"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<div class="empty-state">Error loading gallery: ' + err.message + '</div>';
  }
}

async function addGalleryEntry(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
  try {
    const formData = new FormData(form);
    const res = await fetch(`${API}/api/gallery/before-after`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    showAlert('Gallery image added successfully', 'success');
    form.reset();
    document.getElementById('galleryPreview').innerHTML = '';
    loadGallery();
  } catch (err) {
    showAlert('Failed to add gallery entry: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-upload"></i> Upload';
  }
}

async function deleteGalleryEntry(id) {
  const confirmed = await confirmAction('Delete this gallery image?');
  if (!confirmed) return;
  try {
    const res = await fetch(`${API}/api/gallery/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showAlert('Gallery entry deleted', 'success');
    loadGallery();
  } catch (err) {
    showAlert('Failed to delete: ' + err.message, 'error');
  }
}

function initGalleryDragDrop() {
  initDragDrop('#galleryDropZone', (files) => {
    if (files.length === 0) return;
    const file = files[0];
    const preview = document.getElementById('galleryPreview');
    if (preview) {
      preview.innerHTML = `<img src="${URL.createObjectURL(file)}" class="preview-img">`;
    }
    const input = document.getElementById('galleryImageInput');
    if (input) {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
    }
  });
}

// ===== BOOKINGS =====
async function loadBookings() {
  const tbody = document.getElementById('bookingsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading bookings...</td></tr>';
  try {
    let bookings = await fetch(`${API}/api/bookings`).then(r => r.json());
    if (!Array.isArray(bookings)) bookings = [];
    if (bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No bookings found</td></tr>';
      return;
    }
    bookings.reverse();
    tbody.innerHTML = bookings.map(b => `
      <tr class="booking-row status-${b.status || 'pending'}">
        <td>${escapeHTML(b.name || 'N/A')}</td>
        <td>${escapeHTML(b.phone || '')}</td>
        <td>${escapeHTML(b.email || '-')}</td>
        <td>${escapeHTML(b.service || 'N/A')}</td>
        <td>${formatDate(b.createdAt)}</td>
        <td>${getStatusBadge(b.status || 'pending')}</td>
        <td class="action-cell">
          <select class="form-control form-control-sm" onchange="updateBookingStatus('${b.id}', this.value)">
            <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="in-progress" ${b.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
          <button class="btn btn-sm btn-danger" onclick="deleteBooking('${b.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading bookings: ' + err.message + '</td></tr>';
  }
}

async function updateBookingStatus(id, status) {
  try {
    const res = await fetch(`${API}/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Update failed');
    showAlert('Booking status updated to ' + status, 'success');
    loadBookings();
  } catch (err) {
    showAlert('Failed to update status: ' + err.message, 'error');
  }
}

async function deleteBooking(id) {
  const confirmed = await confirmAction('Delete this booking?');
  if (!confirmed) return;
  try {
    const res = await fetch(`${API}/api/bookings/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showAlert('Booking deleted', 'success');
    loadBookings();
  } catch (err) {
    showAlert('Failed to delete booking: ' + err.message, 'error');
  }
}

function filterBookings(status) {
  const rows = document.querySelectorAll('.booking-row');
  if (!rows.length) return;
  if (!status || status === 'all') {
    rows.forEach(r => r.style.display = '');
    return;
  }
  rows.forEach(r => {
    r.style.display = r.classList.contains('status-' + status) ? '' : 'none';
  });
}

// ===== REVIEWS =====
async function loadReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;
  container.innerHTML = '<div class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading reviews...</div>';
  try {
    const reviews = await fetch(`${API}/api/reviews`).then(r => r.json());
    if (!Array.isArray(reviews) || reviews.length === 0) {
      container.innerHTML = '<div class="empty-state">No reviews yet</div>';
      return;
    }
    container.innerHTML = reviews.map(r => {
      const rating = parseInt(r.rating) || 5;
      const stars = Array.from({ length: 5 }, (_, i) =>
        `<i class="fas fa-star${i < rating ? '' : '-o'}"></i>`
      ).join('');
      return `
        <div class="review-card">
          <div class="review-header">
            <div class="review-avatar">${(r.name || 'A')[0].toUpperCase()}</div>
            <div>
              <h4>${escapeHTML(r.name || 'Anonymous')}</h4>
              <span class="review-date">${r.date || ''}</span>
            </div>
            <div class="review-stars">${stars}</div>
          </div>
          <p class="review-text">${escapeHTML(r.comment || r.message || '')}</p>
          <div class="review-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteReview('${r.id}')"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<div class="empty-state">Error loading reviews: ' + err.message + '</div>';
  }
}

async function deleteReview(id) {
  const confirmed = await confirmAction('Delete this review?');
  if (!confirmed) return;
  try {
    const res = await fetch(`${API}/api/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showAlert('Review deleted', 'success');
    loadReviews();
  } catch (err) {
    showAlert('Failed to delete review: ' + err.message, 'error');
  }
}

// ===== BLOG =====
function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function loadBlogPosts() {
  const tbody = document.getElementById('blogBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading posts...</td></tr>';
  try {
    const posts = await fetch(`${API}/api/blog`).then(r => r.json());
    if (!Array.isArray(posts) || posts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No blog posts yet</td></tr>';
      return;
    }
    tbody.innerHTML = posts.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>
          ${p.image ? `<img src="${p.image}" alt="" class="table-thumb">` : ''}
          ${escapeHTML(p.title || 'Untitled')}
        </td>
        <td>${escapeHTML(p.author || 'Suraksha Team')}</td>
        <td>${p.date || ''}</td>
        <td>${escapeHTML(p.category || 'General')}</td>
        <td class="action-cell">
          <button class="btn btn-sm btn-outline" onclick="editBlogPost(${p.id})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteBlogPost(${p.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading posts: ' + err.message + '</td></tr>';
  }
}

async function deleteBlogPost(id) {
  const confirmed = await confirmAction('Delete this blog post?');
  if (!confirmed) return;
  try {
    const res = await fetch(`${API}/api/blog/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showAlert('Blog post deleted', 'success');
    loadBlogPosts();
  } catch (err) {
    showAlert('Failed to delete: ' + err.message, 'error');
  }
}

async function editBlogPost(id) {
  try {
    const res = await fetch(`${API}/api/blog/${id}`);
    if (!res.ok) throw new Error('Post not found');
    const post = await res.json();
    const modal = document.getElementById('blogModal');
    const form = document.getElementById('blogForm');
    if (!modal || !form) return;
    form.reset();
    document.getElementById('blogModalTitle').textContent = 'Edit Post';
    document.getElementById('blogId').value = post.id;
    document.getElementById('blogTitle').value = post.title || '';
    document.getElementById('blogSlug').value = post.slug || '';
    document.getElementById('blogExcerpt').value = post.excerpt || '';
    document.getElementById('blogContent').value = post.content || '';
    document.getElementById('blogAuthor').value = post.author || '';
    document.getElementById('blogCategory').value = post.category || 'General';
    document.getElementById('blogTags').value = (post.tags && Array.isArray(post.tags)) ? post.tags.join(', ') : '';
    if (post.image) {
      document.getElementById('blogImagePreview').innerHTML = `<img src="${post.image}" class="preview-img">`;
    }
    modal.classList.add('open');
  } catch (err) {
    showAlert('Failed to load post: ' + err.message, 'error');
  }
}

async function saveBlogPost(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  const id = document.getElementById('blogId')?.value;
  const title = document.getElementById('blogTitle')?.value;
  let slug = document.getElementById('blogSlug')?.value;
  if (!slug) slug = generateSlug(title || '');

  const tags = (document.getElementById('blogTags')?.value || '').split(',').map(t => t.trim()).filter(Boolean);
  const formData = new FormData(form);
  formData.set('slug', slug);
  formData.set('tags', JSON.stringify(tags));

  try {
    const url = id ? `${API}/api/blog/${id}` : `${API}/api/blog`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, body: formData });
    if (!res.ok) throw new Error('Failed to save post');
    showAlert(id ? 'Post updated' : 'Post created', 'success');
    document.getElementById('blogModal')?.classList.remove('open');
    loadBlogPosts();
    form.reset();
    document.getElementById('blogImagePreview').innerHTML = '';
    document.getElementById('blogId').value = '';
  } catch (err) {
    showAlert('Error saving post: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = id ? '<i class="fas fa-save"></i> Update Post' : '<i class="fas fa-plus"></i> Publish Post';
  }
}

// ===== CONTACTS =====
async function loadContacts() {
  const tbody = document.getElementById('contactsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading enquiries...</td></tr>';
  try {
    const contacts = await fetch(`${API}/api/contacts`).then(r => r.json());
    if (!Array.isArray(contacts) || contacts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No enquiries yet</td></tr>';
      return;
    }
    contacts.reverse();
    tbody.innerHTML = contacts.map(c => `
      <tr>
        <td>${escapeHTML(c.name || 'N/A')}</td>
        <td>${escapeHTML(c.phone || '')}</td>
        <td>${escapeHTML(c.email || '-')}</td>
        <td>${escapeHTML(c.service || c.message?.substring(0, 30) || '-')}</td>
        <td>${formatDate(c.createdAt)}</td>
        <td class="action-cell">
          <button class="btn btn-sm btn-danger" onclick="deleteContact('${c.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading enquiries: ' + err.message + '</td></tr>';
  }
}

async function deleteContact(id) {
  const confirmed = await confirmAction('Delete this enquiry?');
  if (!confirmed) return;
  try {
    const res = await fetch(`${API}/api/contacts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showAlert('Enquiry deleted', 'success');
    loadContacts();
  } catch (err) {
    showAlert('Failed to delete: ' + err.message, 'error');
  }
}

// ===== SETTINGS =====
async function loadSettings() {
  const form = document.getElementById('settingsForm');
  if (!form) return;
  try {
    const settings = await fetch(`${API}/api/settings`).then(r => r.json());
    if (!settings || Object.keys(settings).length === 0) return;
    Object.keys(settings).forEach(key => {
      const el = document.getElementById('settings_' + key);
      if (el) el.value = settings[key] || '';
    });
    if (settings.logo) {
      const preview = document.getElementById('settingsLogoPreview');
      if (preview) preview.innerHTML = `<img src="${settings.logo}" class="preview-img" alt="Logo">`;
    }
  } catch (err) {
    showAlert('Failed to load settings: ' + err.message, 'error');
  }
}

async function saveSettings(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  try {
    const formData = new FormData(form);
    const res = await fetch(`${API}/api/settings`, { method: 'PUT', body: formData });
    if (!res.ok) throw new Error('Failed to save settings');
    showAlert('Settings saved successfully', 'success');
  } catch (err) {
    showAlert('Error saving settings: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Save Settings';
  }
}

function initSettingsForm() {
  loadSettings();
}

// ===== DRAG & DROP UPLOAD =====
function initDragDrop(zoneSelector, callback) {
  const zone = document.querySelector(zoneSelector);
  if (!zone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    zone.addEventListener(eventName, () => zone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, () => zone.classList.remove('dragover'), false);
  });

  zone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0 && typeof callback === 'function') {
      callback(files);
    }
  }, false);

  const fileInput = zone.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0 && typeof callback === 'function') {
        callback(e.target.files);
      }
    });
  }
}

function initUniversalUpload() {
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const id = zone.id || 'dropZone_' + Math.random().toString(36).substr(2, 9);
    if (!zone.id) zone.id = id;
    const input = zone.querySelector('input[type="file"]');
    const preview = zone.querySelector('.drop-zone-preview');

    initDragDrop('#' + zone.id, (files) => {
      if (files.length === 0) return;
      const file = files[0];
      if (preview) {
        preview.innerHTML = `<img src="${URL.createObjectURL(file)}" class="preview-img">`;
      }
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
      }
      const previewClass = zone.dataset.previewTarget;
      if (previewClass) {
        const target = document.querySelector(previewClass);
        if (target) target.innerHTML = `<img src="${URL.createObjectURL(file)}" class="preview-img">`;
      }
    });
  });
}

// ===== UTILITY =====
function showAlert(message, type) {
  const container = document.getElementById('alertContainer');
  if (!container) return;
  const alert = document.createElement('div');
  alert.className = 'alert alert-' + (type === 'error' ? 'danger' : type || 'success');
  alert.innerHTML = `
    <span>${message}</span>
    <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  container.appendChild(alert);
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => alert.remove(), 300);
  }, 4000);
}

function confirmAction(message) {
  return new Promise((resolve) => {
    const container = document.getElementById('confirmContainer');
    if (!container) {
      resolve(confirm(message));
      return;
    }
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
      <p>${message}</p>
      <div class="confirm-actions">
        <button class="btn btn-outline" id="confirmCancel">Cancel</button>
        <button class="btn btn-danger" id="confirmOk">Delete</button>
      </div>
    `;
    overlay.appendChild(dialog);
    container.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { cleanup(); resolve(false); }
    });
    document.getElementById('confirmCancel').addEventListener('click', () => { cleanup(); resolve(false); });
    document.getElementById('confirmOk').addEventListener('click', () => { cleanup(); resolve(true); });
    function cleanup() { overlay.remove(); }
  });
}

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str || '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getStatusBadge(status) {
  const badges = {
    'pending': '<span class="badge badge-warning">Pending</span>',
    'confirmed': '<span class="badge badge-info">Confirmed</span>',
    'in-progress': '<span class="badge badge-primary">In Progress</span>',
    'completed': '<span class="badge badge-success">Completed</span>',
    'cancelled': '<span class="badge badge-danger">Cancelled</span>'
  };
  return badges[status] || '<span class="badge badge-secondary">' + escapeHTML(status) + '</span>';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  checkAuth();
  initSidebar();
  initUniversalUpload();
  const page = window.location.pathname;
  if (page.includes('dashboard')) loadDashboardStats();
  if (page.includes('services')) {
    loadServices();
    const form = document.getElementById('serviceForm');
    if (form) form.addEventListener('submit', saveService);
  }
  if (page.includes('gallery')) {
    loadGallery();
    initGalleryDragDrop();
    const form = document.getElementById('galleryForm');
    if (form) form.addEventListener('submit', addGalleryEntry);
  }
  if (page.includes('bookings')) loadBookings();
  if (page.includes('reviews')) loadReviews();
  if (page.includes('blog')) {
    loadBlogPosts();
    const form = document.getElementById('blogForm');
    if (form) form.addEventListener('submit', saveBlogPost);
    const titleInput = document.getElementById('blogTitle');
    const slugInput = document.getElementById('blogSlug');
    if (titleInput && slugInput) {
      titleInput.addEventListener('input', function () {
        if (!slugInput.dataset.manual) slugInput.value = generateSlug(this.value);
      });
      slugInput.addEventListener('input', function () { this.dataset.manual = this.value.length > 0 ? 'true' : ''; });
    }
  }
  if (page.includes('contacts')) loadContacts();
  if (page.includes('settings')) {
    initSettingsForm();
    const form = document.getElementById('settingsForm');
    if (form) form.addEventListener('submit', saveSettings);
  }
});
