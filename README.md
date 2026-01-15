# 🧵 Embroidery Studio - E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application for embroidered clothing with **multilingual support** (English, French, Albanian), **shopping cart functionality**, and **comprehensive admin panel** for product management.

## 🌟 Key Features

### 👥 Customer Features
✅ **Multilingual Support** - Full i18n implementation (English 🇬🇧, French 🇫🇷, Albanian 🇦🇱)  
✅ **Product Catalog** - Browse embroidered products with detailed descriptions  
✅ **Shopping Cart** - Add/remove items with persistent cart context  
✅ **Product Details** - Language-specific descriptions with specifications  
✅ **Responsive Design** - Mobile, tablet, and desktop optimized  
✅ **Contact Form** - Submit inquiries with database storage  
✅ **About Page** - Company information and core values  

### 🔧 Admin Features
✅ **Product Management** - Full CRUD operations with validation  
✅ **Multilingual Descriptions** - Store products in 3 languages (EN, FR, SQ)  
✅ **Image Support** - Product images via URL  
✅ **Admin Panel** - Secure credentials-based access  
✅ **Product Table** - View all products with edit/delete  

### 🎯 Technical Highlights
✅ **Responsive Grid Layout** - Bootstrap-based mobile-first design  
✅ **Form Validation** - Client & server-side validation  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Skeleton loaders for better UX  
✅ **Real-time Language Switching** - Change UI language instantly  

## 🛠 Tech Stack

### Frontend
- **React.js 18** - Modern UI with hooks
- **React Router v6** - Client-side routing
- **React Bootstrap 5** - Responsive UI components
- **i18next** - Internationalization engine
- **Axios** - HTTP client
- **Context API** - State management (Cart)
- **CSS3** - Modern styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 8** - Schema validation & ODM
- **CORS** - Cross-origin requests
- **dotenv** - Environment management

## 📋 Prerequisites

- **Node.js** v14+ with npm
- **MongoDB Atlas** account or local MongoDB
- **Git** for version control

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd embroidery-studio
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>" >> .env

npm start
# Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

## 🔐 Admin Access

Configure admin credentials in the application to manage products via Admin Panel.

Navigate to **Admin Panel** in navbar to manage products.

## 📚 API Endpoints

### Products
```
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

### Contacts
```
GET    /api/contacts              # Get all messages
POST   /api/contacts              # Submit contact form
DELETE /api/contacts/:id          # Delete message
```

## 📁 Project Structure

```
embroidery-studio/
│
├── 📂 backend/
│   ├── models/
│   │   ├── Product.js            ← Product schema (multilingual)
│   │   └── Contact.js            ← Contact messages
│   ├── routes/
│   │   ├── productRoutes.js       ← Product endpoints
│   │   └── contactRoutes.js       ← Contact endpoints
│   ├── server.js                 ← Express app
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── 📂 frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         ← Navigation & language switcher
│   │   │   ├── Footer.js         ← Footer with links
│   │   │   ├── LanguageSwitcher.js
│   │   │   ├── Skeleton.js       ← Loading component
│   │   │   └── *.css files
│   │   ├── context/
│   │   │   └── CartContext.js    ← Cart state management
│   │   ├── pages/
│   │   │   ├── Home.js           ← Product listing
│   │   │   ├── ProductDetail.js  ← Product page
│   │   │   ├── ProductManagement.js  ← Admin panel
│   │   │   ├── Cart.js           ← Shopping cart
│   │   │   ├── Contact.js        ← Contact form
│   │   │   ├── About.js          ← About page
│   │   │   └── *.css files
│   │   ├── services/
│   │   │   └── api.js            ← Axios client
│   │   ├── i18n.js               ← i18next config
│   │   ├── App.js
│   │   ├── index.js
│   │   └── *.css
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 🗺 Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| 🏠 Home | `/` | Product catalog |
| 📦 Product | `/product/:id` | Single product details |
| 🛒 Cart | `/cart` | Shopping cart |
| ℹ️ About | `/about` | Company info |
| 📧 Contact | `/contact` | Contact form |
| ⚙️ Admin | `/admin` | Product management |

## 🌐 Internationalization (i18n)

The app supports **3 languages**:
- 🇬🇧 English
- 🇫🇷 Français
- 🇦🇱 Shqip

**Product Descriptions** are stored as multilingual objects:
```javascript
{
  description: {
    en: "Premium embroidered t-shirt...",
    fr: "T-shirt brodé premium...",
    sq: "Këmishe e male me qëndisje..."
  }
}
```

Switch language using the **Language Selector** in the navbar.

## 📦 Product Schema

```javascript
{
  _id: ObjectId,
  name: String (required, min: 3),
  description: {
    en: String (required, min: 10),
    fr: String (required, min: 10),
    sq: String (required, min: 10)
  },
  price: Number (required, > 0),
  category: String (required),
  embroideryType: String,
  imageUrl: String (valid URL),
  inStock: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛒 Shopping Cart

Managed via **React Context API**:
- ✅ Add/remove items
- ✅ Update quantities
- ✅ Persistent state
- ✅ Cart summary

## ⚡ Development Workflow

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# http://localhost:3000
```

**Terminal 3 (Optional) - Dev Mode:**
```bash
cd backend
npm run dev  # With auto-reload (nodemon)
```

## 🧪 Testing Admin Panel

1. Open **http://localhost:3000/admin**
2. Login: `admin` / `2468`
3. Add product with:
   - Name (3+ chars)
   - Descriptions in all 3 languages (10+ chars each)
   - Price (positive number)
   - Category
   - Image URL (http/https)
4. Submit and verify in product list

## 🐛 Troubleshooting

### MongoDB Connection Failed
- ✅ Verify `.env` has correct `MONGODB_URI`
- ✅ Check IP whitelist in MongoDB Atlas
- ✅ Ensure database user has read/write permissions

### Port Already in Use
- **Backend:** Change `PORT` in `.env` or kill process on 5000
- **Frontend:** Let it prompt to use port 3001

### Products Not Loading
- ✅ Backend running on port 5000?
- ✅ MongoDB connected?
- ✅ Check browser console (F12) for errors

### Language Not Switching
- ✅ Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- ✅ Clear cache: DevTools → Storage → Clear All

### Admin Panel Login Fails
- ✅ Check admin credentials are configured correctly
- ✅ Check console for error messages

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### Frontend (src/services/api.js)
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🔄 Deployment Checklist

- [ ] Remove `.env` from git (use `.gitignore`)
- [ ] Add environment variables to hosting platform
- [ ] Update `MONGODB_URI` to production database
- [ ] Update API base URL in frontend for production
- [ ] Run `npm run build` in frontend
- [ ] Test all features in production
- [ ] Set up HTTPS/SSL certificate

## 📄 License

MIT License - Educational & Commercial Use

## 👨‍💻 Author

**Kejdi** - Full Stack Developer  
[GitHub](https://github.com/Kejdi09) | [LinkedIn](https://www.linkedin.com/in/kejdi-mu%C3%A7i)

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
