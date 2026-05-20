# 🫙 Pickle House — Taste the Original

> Authentic Handcrafted Hyderabadi Pickles | Premium E-Commerce Website

Built by **AlphaDevs** | [alphadevs.in](https://alphadevs.in)

---

## 🏪 Business Details

- **Brand:** Pickle House
- **Tagline:** ...taste the original
- **Location:** #5-4-99/1, Kamala Nagar Road, Near Rythu Bazar, Vanasthalipuram, Hyderabad - 500070
- **Phone:** 9262342344 | 8801101745
- **Rating:** ⭐ 5.0 (100+ Google Reviews)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Animations | Framer Motion + GSAP + Vanilla Tilt |
| Icons | Lucide React |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Payments | Razorpay |
| Images | Cloudinary |
| Routing | React Router v6 |

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Edit .env with your values
npm run dev
```

### 3. Vercel Deployment

To deploy the frontend on Vercel:

1. Connect the `picklehouse` GitHub repository to Vercel.
2. Set the project root to the `frontend` folder.
3. In Vercel Environment Variables, add:
   - `VITE_API_URL=https://your-railway-backend.up.railway.app/api`
4. Set `Build Command` to `npm run build` and `Output Directory` to `dist` if Vercel does not detect them automatically.

> If your backend is hosted on Railway, also set `CLIENT_URL` in Railway to your Vercel deployment domain.

### 4. Seed Database

After starting the backend, visit the Admin panel at `/admin` and click **"🌱 Seed Data"** to populate products and reviews.

Or call the API directly (requires admin token):
```
POST /api/products/admin/seed
POST /api/reviews/admin/seed
```

### 4. Create Admin User

Register a user, then manually set `isAdmin: true` in MongoDB:
```js
db.users.updateOne({ email: "admin@picklehouse.com" }, { $set: { isAdmin: true } })
```

---

## 📁 Project Structure

```
pickle-house/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   └── uploadController.js
│   ├── middleware/authMiddleware.js
│   ├── models/ (User, Product, Order, Review)
│   ├── routes/ (auth, products, orders, payment, reviews, upload)
│   └── server.js
└── frontend/
    └── src/
        ├── app/ (Home, Products, About, NRIPacking, Gallery, Reviews, Contact, Checkout, Auth, Admin)
        ├── components/ (Navbar, Hero, ProductCard, CartDrawer, Footer, WhatsAppButton, BackToTop, QuickViewModal, LoadingScreen)
        ├── context/ (CartContext, AuthContext, LangContext)
        ├── hooks/ (useCursor)
        └── lib/ (api.js)
```

---

## 🌟 Features

- ✅ Cinematic hero with GSAP spice particle system
- ✅ Auto-scrolling featured products strip
- ✅ 3D tilt product cards (Vanilla Tilt)
- ✅ Slide-in cart drawer with animations
- ✅ Razorpay + COD checkout
- ✅ Admin dashboard (products, orders, analytics)
- ✅ Cloudinary image upload
- ✅ Bilingual English + Telugu
- ✅ Dark / Light mode
- ✅ NRI packing page with WhatsApp inquiry
- ✅ Masonry gallery with lightbox
- ✅ Custom warm glow cursor
- ✅ WhatsApp floating button
- ✅ Loading screen with logo animation
- ✅ Mobile-first responsive design
- ✅ JWT authentication
- ✅ Product seeding (30+ products)

---

## ⚙️ Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

---

## 📞 Support

Built by **AlphaDevs** — Premium Software Agency, Hyderabad  
🌐 [alphadevs.in](https://alphadevs.in)

---

*© 2026 Pickle House. All rights reserved.*
