# 🧵 Embroidery E-Commerce (NOT FINISHED)

Full-stack MERN e-commerce platform for embroidered clothing with multilingual support (English, French, Albanian).

## Features

### Customer Features
- 🌐 **Multilingual Interface** - Full support for English, French, and Albanian
- 🛍️ **Product Catalog** - Browse embroidered clothing with detailed descriptions
- 🛒 **Shopping Cart** - Add, remove, and manage items
- 📦 **Product Details** - View specifications, pricing, and images
- 📧 **Contact Form** - Submit inquiries
- ℹ️ **About Page** - Learn about the company

### Admin Features
- ⚙️ **Product Management** - Create, edit, and delete products
- 🌍 **Multilingual Products** - Add descriptions in 3 languages
- 📊 **Product Dashboard** - View and manage all products
- 🔐 **Secure Login** - Admin authentication

### Technical Features
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Form Validation** - Both client and server-side
- 🎨 **Modern UI** - Clean interface with React Bootstrap
- 🔄 **Real-time Language Switching** - Change language instantly

## Tech Stack

**Frontend:** React.js, React Router, React Bootstrap, i18next, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**State Management:** Context API  
**Styling:** CSS3, Bootstrap 5

## Installation

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**  
Backend runs on **http://localhost:5000**

## Project Structure

```
├── backend/
│   ├── models/       # Product & Contact schemas
│   ├── routes/       # API endpoints
│   └── server.js
│
└── frontend/
    ├── components/   # Navbar, Footer, etc.
    ├── pages/        # Home, Cart, Admin, etc.
    ├── context/      # Shopping cart state
    └── services/     # API calls
```

## Pages

- **Home** - Product catalog with filters
- **Product Detail** - Individual product page
- **Cart** - Shopping cart
- **Admin Panel** - Product management
- **Contact** - Contact form
- **About** - Company information

## Author

**Kejdi** - Full Stack Developer  
[GitHub](https://github.com/Kejdi09) | [LinkedIn](https://www.linkedin.com/in/kejdi-mu%C3%A7i)
