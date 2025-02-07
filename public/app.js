const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Use helmet to set CSP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  })
);

let candy = []; // Changed from properties to candy

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/add-property', upload.fields([{ name: 'image' }, { name: 'ownerImage' }]), (req, res) => {
  const { placeName, location, ownerName, amount } = req.body;
  const image = req.files['image'][0].filename;
  const ownerImage = req.files['ownerImage'][0].filename;

  candy.push({ // Changed from properties.push to candy.push
    id: candy.length + 1, // Changed from properties.length to candy.length
    placeName,
    location,
    ownerName,
    amount: parseFloat(amount),
    imageUrl: `/uploads/${image}`,
    ownerImageUrl: `/uploads/${ownerImage}`,
    description: "A beautiful property.", // Add a description if needed
  });

  res.redirect('/addproperties');
});

app.get('/addproperties', (req, res) => {
  res.render('addproperties', { candy }); // Changed from properties to candy
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
