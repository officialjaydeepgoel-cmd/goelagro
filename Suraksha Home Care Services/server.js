const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for file uploads with drag-drop support
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Helper: read JSON file
function readJSON(file) {
  const fp = path.join(__dirname, 'data', `${file}.json`);
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

// Helper: write JSON file
function writeJSON(file, data) {
  const fp = path.join(__dirname, 'data', `${file}.json`);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

// ===== API ROUTES =====

// Services
app.get('/api/services', (req, res) => {
  const services = readJSON('services');
  res.json(services);
});

app.get('/api/services/:id', (req, res) => {
  const services = readJSON('services');
  const service = services.find(s => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

app.post('/api/services', upload.single('image'), (req, res) => {
  const services = readJSON('services');
  const newService = {
    id: req.body.id || uuidv4(),
    name: req.body.name,
    category: req.body.category || 'cleaning',
    description: req.body.description,
    shortDesc: req.body.shortDesc,
    icon: req.body.icon || 'fas fa-broom',
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || ''),
    features: req.body.features ? (typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features) : [],
    packages: req.body.packages ? (typeof req.body.packages === 'string' ? JSON.parse(req.body.packages) : req.body.packages) : [],
    faqs: req.body.faqs ? (typeof req.body.faqs === 'string' ? JSON.parse(req.body.faqs) : req.body.faqs) : []
  };
  services.push(newService);
  writeJSON('services', services);
  res.status(201).json(newService);
});

app.put('/api/services/:id', upload.single('image'), (req, res) => {
  const services = readJSON('services');
  const idx = services.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  const updated = { ...services[idx], ...req.body, id: req.params.id };
  if (req.file) updated.image = `/uploads/${req.file.filename}`;
  if (req.body.features && typeof req.body.features === 'string') updated.features = JSON.parse(req.body.features);
  if (req.body.packages && typeof req.body.packages === 'string') updated.packages = JSON.parse(req.body.packages);
  if (req.body.faqs && typeof req.body.faqs === 'string') updated.faqs = JSON.parse(req.body.faqs);
  services[idx] = updated;
  writeJSON('services', services);
  res.json(updated);
});

app.delete('/api/services/:id', (req, res) => {
  let services = readJSON('services');
  services = services.filter(s => s.id !== req.params.id);
  writeJSON('services', services);
  res.json({ success: true });
});

// Gallery
app.get('/api/gallery', (req, res) => {
  const gallery = readJSON('gallery');
  res.json(gallery);
});

app.post('/api/gallery/before-after', upload.single('image'), (req, res) => {
  const gallery = readJSON('gallery');
  const entry = {
    id: Date.now(),
    before: req.body.before || (req.file ? `/uploads/${req.file.filename}` : ''),
    after: req.body.after || '',
    title: req.body.title || 'Gallery Image',
    description: req.body.description || ''
  };
  gallery.beforeAfter.push(entry);
  writeJSON('gallery', gallery);
  res.status(201).json(entry);
});

app.post('/api/gallery/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

app.delete('/api/gallery/:id', (req, res) => {
  const gallery = readJSON('gallery');
  gallery.beforeAfter = gallery.beforeAfter.filter(g => g.id != req.params.id);
  writeJSON('gallery', gallery);
  res.json({ success: true });
});

// Bookings
app.get('/api/bookings', (req, res) => {
  const bookings = readJSON('bookings');
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const bookings = readJSON('bookings');
  const booking = {
    id: uuidv4(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  writeJSON('bookings', bookings);
  res.status(201).json(booking);
});

app.put('/api/bookings/:id', (req, res) => {
  const bookings = readJSON('bookings');
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  bookings[idx] = { ...bookings[idx], ...req.body };
  writeJSON('bookings', bookings);
  res.json(bookings[idx]);
});

app.delete('/api/bookings/:id', (req, res) => {
  let bookings = readJSON('bookings');
  bookings = bookings.filter(b => b.id !== req.params.id);
  writeJSON('bookings', bookings);
  res.json({ success: true });
});

// Contacts
app.get('/api/contacts', (req, res) => {
  const contacts = readJSON('contacts');
  res.json(contacts);
});

app.post('/api/contacts', (req, res) => {
  const contacts = readJSON('contacts');
  const contact = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  contacts.push(contact);
  writeJSON('contacts', contacts);
  res.status(201).json(contact);
});

app.delete('/api/contacts/:id', (req, res) => {
  let contacts = readJSON('contacts');
  contacts = contacts.filter(c => c.id !== req.params.id);
  writeJSON('contacts', contacts);
  res.json({ success: true });
});

// Reviews
app.get('/api/reviews', (req, res) => {
  const reviews = readJSON('reviews');
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const reviews = readJSON('reviews');
  const review = { id: uuidv4(), ...req.body, date: new Date().toISOString().split('T')[0] };
  reviews.push(review);
  writeJSON('reviews', reviews);
  res.status(201).json(review);
});

// Blog
app.get('/api/blog', (req, res) => {
  const blogs = readJSON('blog');
  res.json(blogs);
});

app.get('/api/blog/:slug', (req, res) => {
  const blogs = readJSON('blog');
  const blog = blogs.find(b => b.slug === req.params.slug);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

app.post('/api/blog', upload.single('image'), (req, res) => {
  const blogs = readJSON('blog');
  const newBlog = {
    id: Date.now(),
    title: req.body.title,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    author: req.body.author || 'Suraksha Team',
    date: new Date().toISOString().split('T')[0],
    category: req.body.category || 'General',
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || ''),
    tags: req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : []
  };
  blogs.push(newBlog);
  writeJSON('blog', blogs);
  res.status(201).json(newBlog);
});

app.put('/api/blog/:id', upload.single('image'), (req, res) => {
  const blogs = readJSON('blog');
  const idx = blogs.findIndex(b => b.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });
  blogs[idx] = { ...blogs[idx], ...req.body, id: blogs[idx].id };
  if (req.file) blogs[idx].image = `/uploads/${req.file.filename}`;
  writeJSON('blog', blogs);
  res.json(blogs[idx]);
});

app.delete('/api/blog/:id', (req, res) => {
  let blogs = readJSON('blog');
  blogs = blogs.filter(b => b.id != req.params.id);
  writeJSON('blog', blogs);
  res.json({ success: true });
});

// Settings
app.get('/api/settings', (req, res) => {
  const settings = readJSON('settings');
  res.json(settings);
});

app.put('/api/settings', upload.single('logo'), (req, res) => {
  const settings = readJSON('settings');
  const updated = { ...settings, ...req.body };
  if (req.file) updated.logo = `/uploads/${req.file.filename}`;
  writeJSON('settings', updated);
  res.json(updated);
});

// File upload (generic)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.filename });
});

// Start server
app.listen(PORT, () => {
  console.log(`Suraksha Home Services server running on http://localhost:${PORT}`);
});
