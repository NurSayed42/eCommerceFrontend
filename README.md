# 🛍️ ShopBD - React E-Commerce Frontend

## Tech Stack
- **Framework:** React 18 + React Router 6
- **State:** Redux Toolkit
- **Styling:** Tailwind CSS v3
- **HTTP:** Axios (with JWT interceptor)
- **UI:** Headless UI, Lucide Icons, Framer Motion
- **Carousel:** Swiper / React Slick
- **Forms:** React Hook Form + Yup

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (proxies to Spring Boot on :8080)
npm start

# Build for production
npm run build
```

Frontend runs on: **http://localhost:3000**

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/         # Reusable: ProductCard, Skeleton, Breadcrumb...
│   ├── layout/         # Navbar, Footer
│   ├── home/           # CountdownTimer, HeroBanner
│   └── account/        # ProfileTab, AddressTab, SecurityTab
├── pages/
│   ├── HomePage.js      # Banner + Categories + Flash Sale + Featured
│   ├── ProductListPage  # Filter sidebar + sort + pagination
│   ├── ProductPage      # Gallery + variants + reviews + FAQ
│   ├── CartPage         # Cart items + coupon + summary
│   ├── CheckoutPage     # Address + payment + order placement
│   ├── OrderSuccess     # Confirmation page
│   ├── OrdersPage       # Order history
│   ├── OrderDetail      # Order tracking timeline
│   ├── LoginPage        # JWT login
│   ├── RegisterPage     # OTP registration
│   ├── ForgotPassword   # Password reset flow
│   ├── AccountPage      # Profile + addresses + security
│   ├── WishlistPage     # Saved products
│   ├── SearchPage       # Full-text search results
│   └── NotFound         # 404 page
├── store/
│   └── slices/          # authSlice, cartSlice, productSlice, wishlistSlice
├── services/
│   └── api.js           # All Axios API calls
└── App.js               # Routes + protected routes
```

---

## 🔗 API Connection
Backend API: `http://localhost:8080/api/v1`

Make sure Spring Boot backend is running before starting React.

---

## ✅ Features
- Mobile-first responsive design
- JWT auth with auto refresh
- Product search + filters (price, category, rating, stock)
- Sort: newest, price, popularity, rating
- Cart with save for later + coupon
- COD + SSLCommerz payment
- Order tracking with timeline
- Wishlist with price drop alerts
- Product image gallery + zoom
- Flash sale countdown timer
- OTP registration flow
- Protected routes
- Redux state management
- Skeleton loaders
- Lazy loaded pages
