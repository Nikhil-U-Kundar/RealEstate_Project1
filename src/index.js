

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const flash = require('connect-flash');

const app = express();
const port = 3000;

// Set view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());

// Connect to MongoDB
mongoose.connect('mongodb+srv://realestate:9945994323@cluster0.vfyccaa.mongodb.net/feedback', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  phone: String,
  email: String,
  password: String,
  gender: String,
  profilePhoto: String
});
const User = mongoose.model('User', userSchema);

// Define Feedback Schema and Model
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Multer setup for profile photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Sample properties and cart
let candy = [];
let cart = [];
const properties = [
  {
    propertyName: "Cozy Cottage",
    location: "Hyderabad",
    address: "123 Main St",
    country: "India",
    price: 150000,
    amount: 1,
    owner: "John Doe",
    imageUrl: "https://gos3.ibcdn.com/62130acaf00211e9934d0242ac110002.jpeg",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },{
    propertyName: "Cozy Cottage",
    location: "Hyderabad",
    address: "123 Main St",
    country: "India",
    price: 150000,
    amount: 1,
    owner: "John Doe",
    imageUrl: "https://gos3.ibcdn.com/62130acaf00211e9934d0242ac110002.jpeg",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Urban Apartment",
    location: "Hyderabad",
    address: "456 Elm St",
    country: "India",
    price: 250000,
    amount: 1,
    owner: "Jane Doe",
    imageUrl: "https://images.nobroker.in/images/8a9f85838d96f721018d9814949e1ab3/8a9f85838d96f721018d9814949e1ab3_93471_1843_medium.jpg",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Suburban House",
    location: "Hyderabad",
    address: "789 Maple St",
    country: "India",
    price: 350000,
    amount: 1,
    owner: "Jaggesh yadav",
    imageUrl: "https://ysrealty.co.in/wp-content/uploads/2022/11/Praneeth-Pranav-Grove-Park.jpeg",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Beachfront Villa",
    location: "Pune",
    address: "123 Ocean Ave",
    country: "India",
    price: 500000,
    amount: 1,
    owner: "Sarah Johnson",
    imageUrl: "https://im.whatshot.in/img/2018/Jun/1493447573-anjarle-beach1-1-1530265709.jpg",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Downtown Loft",
    location: "Pune",
    address: "789 Pine St",
    country: "India",
    price: 400000,
    amount: 1,
    owner: "Chris Lee",
    imageUrl: "https://images.nobroker.in/images/8a9fb1838b364357018b372f888c73ef/8a9fb1838b364357018b372f888c73ef_53150_883559_medium.jpg",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Mountain Retreat",
    location: "Pune",
    address: "456 Hilltop Rd",
    country: "India",
    price: 750000,
    amount: 1,
    owner: "Alice Brown",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/512906358.jpg?k=cdabb1c0181d2ad6966fabba9fde16d2f1d5af81f26b99968589dcf66e26ac25&o=&hp=1",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Urban Loft",
    location: "Lucknow",
    address: "789 Downtown St",
    country: "India",
    price: 650000,
    amount: 1,
    owner: "David Clark",
    imageUrl: "https://img.squareyards.com/secondaryPortal/638253577617523629-190723100241241.jpg",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Countryside Cottage",
    location: "Ruralville",
    address: "321 Meadow Lane",
    country: "USA",
    price: 300000,
    amount: 1,
    owner: "Emma Davis",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    propertyName: "Luxury Condo",
    location: "Uptown",
    address: "234 Elm St",
    country: "USA",
    price: 850000,
    amount: 1,
    owner: "Lucas Miller",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
      propertyName: "Omaze Properties",
      location: "Lucknow",
      address: "123 Main St",
      country: "India",
      price: 150000,
      amount: 1,
      owner: "John Doe",
      imageUrl: "https://www.omaxe.com/projectgallery/gallery_1670829819644.jpg",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Premier Commercial",
      location: "Lucknow",
      address: "456 Elm St",
      country: "India",
      price: 250000,
      amount: 1,
      owner: "Jane Doe",
      imageUrl: "https://www.ravgroup.org/Content/images/s-2.jpg",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Residential Property",
      location: "Ahmedabad",
      address: "789 Maple St",
      country: "USA",
      price: 350000,
      amount: 1,
      owner: "Jack Smith",
      imageUrl: "https://www.buylanddholera.com/wp-content/uploads/2022/08/Residential-Property-in-Ahmedabad.jpg",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Luxury Villa",
      location: "Ahmedabad",
      address: "123 Ocean Ave",
      country: "India",
      price: 500000,
      amount: 1,
      owner: "Sarah Johnson",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbiN7FqcnWY8qDFtNqgfESlRvXR38a2YBxtA&s",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Vintage Space",
      location: "Ahmedabad",
      address: "789 Pine St",
      country: "India",
      price: 400000,
      amount: 1,
      owner: "Chris Lee",
      imageUrl: "https://is1-2.housingcdn.com/4f2250e8/e706aee6828d62432d5a095aca6ac9a9/v0/fs/hill_park-ghuma-ahmedabad-vintage_space_llp.jpeg",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Mountain Retreat",
      location: "Highlands",
      address: "456 Hilltop Rd",
      country: "USA",
      price: 750000,
      amount: 1,
      owner: "Alice Brown",
      imageUrl: "https://images.unsplash.com/photo-1573652102907-b75d25910c11",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Lakefront House",
      location: "Thane",
      address: "654 Lakeside Ave",
      country: "India",
      price: 7000000,
      amount: 1,
      owner: "Rajesh Gupta",
      imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Urban Loft",
      location: "Thane",
      address: "789 Downtown St",
      country: "India",
      price: 650000,
      amount: 1,
      owner: "David Clark",
      imageUrl: "https://housing-images.n7net.in/01c16c28/e997848f2bc5455f2b6e5e90900d0835/v0/medium/1_bhk_apartment-for-sale-dombivli_east-Thane-balcony.jpg",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Countryside Cottage",
      location: "Ruralville",
      address: "321 Meadow Lane",
      country: "USA",
      price: 300000,
      amount: 1,
      owner: "Emma Davis",
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "Urban Apartment",
      location: "Mumbai",
      address: "789 Andheri St",
      country: "India",
      price: 350000,
      amount: 1,
      owner: "Arjun Singh",
      imageUrl: "https://images.unsplash.com/photo-1542893403-1375e8123dfb",
      ownerImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
     },
   
    {
      propertyName: "Luxury Condo",
      location: "Uptown",
      address: "234 Elm St",
      country: "USA",
      price: 850000,
      amount: 1,
      owner: "Lucas Miller",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      ownerImageUrl:"https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    },
    {
      propertyName: "City Studio",
      location: "Mumbai",
      address: "123 Bandra Rd",
      country: "India",
      price: 150000,
      amount: 1,
      owner: "Priya Sharma",
      imageUrl: "https://images.unsplash.com/photo-1632323091845-f636f89749fa",
      ownerImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
  },
  {
    propertyName: "Noida Heights",
    location: "Noida",
    address: "Sector 62, Block A",
    country: "India",
    price: 4000000,
    amount: 1,
    owner: "Ankita Joshi",
    imageUrl: "https://images.unsplash.com/photo-1592394675778-4239b838fb2c",
    ownerImageUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
},
{
  propertyName: "Contemporary Duplex",
  location: "Noida",
  address: "123 Sector 16",
  country: "India",
  price: 8000000,
  amount: 1,
  owner: "Nidhi Verma",
  imageUrl: "https://imagecdn.99acres.com/media1/24304/12/486092940M-1713025027100.jpg",
  ownerImageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df"
},
{
  propertyName: "Sunset Villa",
  location: "Thane",
  address: "321 Horizon Blvd",
  country: "India",
  price: 8500000,
  amount: 1,
  owner: "Pooja Rao",
  imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/315839815.jpg?k=469c805262d8e526449d58fa3af622c71fd27b6435a5d7930e2edc152a3f109e&o=&hp=1",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Urban Oasis",
  location: "Bangalore",
  address: "123 MG Road",
  country: "India",
  price: 8500000,
  amount: 1,
  owner: "Anil Kapoor",
  imageUrl: "https://teja12.kuikr.com/is/a/c/655x525/gallery_images/original/cf5f1e92e35d0bb.gif",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Hilltop Mansion",
  location: "Bangalore",
  address: "456 Nandi Hills Rd",
  country: "India",
  price: 9500000,
  amount: 1,
  owner: "Sunita Reddy",
  imageUrl: "https://media.istockphoto.com/id/686721598/photo/beach-front-homes-in-malibu-ca.jpg?s=612x612&w=0&k=20&c=sHfgorQAFfY6c2yKdBDiyXR_1o3QNCSDw34347oO--E=",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Garden Retreat",
  location: "Bangalore",
  address: "789 Whitefield",
  country: "India",
  price: 7500000,
  amount: 1,
  owner: "Rahul Patel",
  imageUrl: "https://miro.medium.com/v2/resize:fit:1400/1*SzCNY2zVWyI4DHZzOcYx8g.png",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Coastal Serenity",
  location: "Chennai",
  address: "123 Marina Beach Road",
  country: "India",
  price: 8900000,
  amount: 1,
  owner: "Priya Nair",
  imageUrl:"https://coloursholidays.com/wp-content/uploads/2023/07/WhatsApp-Image-2023-11-12-at-14.36.06.jpeg",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Heritage Home",
  location: "Chennai",
  address: "456 Mylapore",
  country: "India",
  price: 7500000,
  amount: 1,
  owner: "Sivakumar",
  imageUrl: "https://as1.ftcdn.net/v2/jpg/04/63/08/92/1000_F_463089208_FeZ6np9y1zeYbU34y79xlQRQtKEZ0bVN.jpg",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Luxury Heaven",
  location: "Chennai",
  address: "123 Poonamallee Rd",
  country: "India",
  price: 8800000,
  amount: 1,
  owner: "Nithya Raman",
  imageUrl: "https://www.travelcodex.com/wp-content/uploads/2015/03/itc-grand-chola-chennai-pool.jpg",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Prestige Park",
  location: "Chennai",
  address: "321 T. Nagar",
  country: "India",
  price: 6500000,
  amount: 1,
  owner: "Sundar Rajan",
  imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Elite Enclave",
  location: "Kolkata",
  address: "654 New Alipore",
  country: "India",
  price: 7800000,
  amount: 1,
  owner: "Mitali Das",
  imageUrl: "https://is1-3.housingcdn.com/01c16c28/fffd9c0e36f58bd3df2b827227385199/v0/fs/2_bhk_apartment-for-sale-rajarhat-Kolkata-others.jpg",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Modern Manor",
  location: "Kolkata",
  address: "456 Jodhpur Park",
  country: "India",
  price: 9000000,
  amount: 1,
  owner: "Nisha Basu",
  imageUrl: "https://thearchitectsdiary.com/wp-content/uploads/2024/01/Modern-Mansion-Design-2-4.webp",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
},
{
  propertyName: "Royal Residency",
  location: "Kolkata",
  address: "987 Rajarhat New Town",
  country: "India",
  price: 8500000,
  amount: 1,
  owner: "Ankit Sengupta",
  imageUrl: "https://images.trvl-media.com/lodging/38000000/37600000/37590700/37590630/9af1822c.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
  ownerImageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
}];


// Routes for property listings and cart management
app.get('/', (req, res) => {
  res.render('home', { properties, cart });
});

app.get('/contact', (req, res) => {
  res.render('contact', { properties, cart });
});

app.get('/home', (req, res) => {
  res.render('home', { properties, cart });
});

app.get('/feedback', (req, res) => {
  res.render('feedback', { properties, cart });
});

app.get('/properties', (req, res) => {
  res.render('index', { properties, cart });
});

app.get('/terms&conditions', (req, res) => {
  res.render('terms&conditions', { properties, cart });
});

app.post('/add_cart', (req, res) => {
  const { propertyName, location, address, country, price, amount, owner, imageUrl, ownerImageUrl } = req.body;
  const property = { propertyName, location, address, country, price: parseFloat(price), amount: parseInt(amount), owner, imageUrl, ownerImageUrl };
  cart.push(property);
  res.redirect('/cart');
});

app.get('/cart', (req, res) => {
  const getTotalPrice = cart => cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  const cartWithImageUrl = cart.map(item => {
    const property = properties.find(prop => prop.propertyName === item.propertyName);
    return { ...item, imageUrl: property ? property.imageUrl : '', location: item.location, country: item.country, amount: item.amount };
  });
  res.render('cart', { cart: cartWithImageUrl, getTotalPrice: getTotalPrice(cart) });
});

app.post('/remove_cart', (req, res) => {
  const { index } = req.body;
  cart.splice(index, 1);
  res.redirect('/cart');
});

app.get('/contactus', (req, res) => {
  res.render('contactus', { cart });
});

app.get('/city', (req, res) => {
  res.render('city', { cart });
});

// Routes for user authentication and profile management
app.get('/signup', (req, res) => {
  res.render('signup', { success_msg: req.flash('success'), error_msg: req.flash('error'), cart });
});

app.post('/signup', upload.single('profilePhoto'), async (req, res) => {
  const { username, phone, email, password, gender } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    req.flash('error', 'Email already registered');
    return res.redirect('/signup');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    phone,
    email,
    password: hashedPassword,
    gender,
    profilePhoto: req.file ? req.file.filename : ''
  });
  await newUser.save();
  req.flash('success', 'Registration successful! Please log in.');
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { success_msg: req.flash('success'), error_msg: req.flash('error'), cart });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.flash('success', 'Login successful!');
    res.redirect('/home');
  } else {
    req.flash('error', 'Invalid email or password');
    res.redirect('/login');
  }
});

app.get('/profile', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  res.render('profile', { user, cart });
});

app.get('/edit-profile', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  res.render('edit-profile', { user, cart });
});

app.post('/edit-profile', upload.single('profilePhoto'), async (req, res) => {
  const { username, phone, email, gender } = req.body;
  const updatedData = {
    username,
    phone,
    email,
    gender
  };
  if (req.file) {
    updatedData.profilePhoto = req.file.filename;
  }
  await User.findByIdAndUpdate(req.session.userId, updatedData);
  req.flash('success', 'Profile updated successfully!');
  res.redirect('/profile');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/profile');
    }
    res.redirect('/signup');
  });
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nikhilukundar.iet@srinivasuniversity.edu.in',
    pass: 'jyve lyol uuua nigh'  // Replace with your app password if you have 2-step verification enabled
  }
});

// Route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, phone, email, reason, dealer, planningTime, homeLoan, siteVisits } = req.body;

  const mailOptions = {
    from: 'nikhilukundar.iet@srinivasuniversity.edu.in',
    to: 'nikhilukundar.iet@srinivasuniversity.edu.in',
    subject: 'New contact form submission',
    text: `
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      Reason to buy: ${reason}
      Property dealer: ${dealer}
      Planning time: ${planningTime}
      Interested in home loan: ${homeLoan ? 'Yes' : 'No'}
      Interested in site visits: ${siteVisits ? 'Yes' : 'No'}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to send email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Route to serve feedback form
app.get('/feedback-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/feedback', (req, res) => {
  const newFeedback = new Feedback({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  newFeedback.save()
    .then(feedback => {
      res.send('Thank you for your feedback!');
    })
    .catch(err => {
      console.error('Error saving feedback:', err);
      res.status(500).send('Unable to save feedback');
    });
});

// Routes to handle property management
app.get('/addproperty', (req, res) => {
  res.render('form');
});

app.post('/add-property', upload.fields([{ name: 'image' }, { name: 'ownerImage' }]), (req, res) => {
  const { placeName, location, ownerName, amount } = req.body;
  const image = req.files['image'][0].filename;
  const ownerImage = req.files['ownerImage'][0].filename;

  candy.push({
    id: candy.length + 1,
    placeName,
    location,
    ownerName,
    amount: parseFloat(amount),
    imageUrl: `/uploads/${image}`,
    ownerImageUrl: `/uploads/${ownerImage}`,
    description: "A beautiful property.",
  });

  res.redirect('/addproperties');
});

app.get('/addproperties', (req, res) => {
  res.render('addproperties', { candy });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
