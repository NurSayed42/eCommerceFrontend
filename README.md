# E-Commerce Frontend (React)

React storefront for the **[ECommerceBackend](https://github.com/NurSayed42/ECommerceBackend)** Spring Boot API — product browsing, cart, checkout, order tracking and account management.

**Live demo:** [e-commerce-frontend-five-snowy.vercel.app](https://e-commerce-frontend-five-snowy.vercel.app)

---

## Key Features

- Responsive, mobile-first layout
- JWT authentication with automatic token refresh (Axios interceptors)
- OTP-based registration, password reset and optional Google sign-in
- Product search, category / price / rating / stock filters, sorting and pagination
- Product gallery with variants, reviews and ratings
- Cart with coupons, wishlist, and checkout with cash-on-delivery or SSLCommerz
- Order history with a status timeline
- Account area for profile, addresses and security settings
- Flash-sale countdown, skeleton loaders and lazy-loaded routes
- Protected routes for authenticated pages

## Tech Stack

| Area | Technology |
|---|---|
| Framework | React 18, React Router 6 |
| State | Redux Toolkit |
| Styling | Tailwind CSS 3, Headless UI, Lucide icons, Framer Motion |
| HTTP | Axios with JWT request / refresh interceptors |
| Forms | React Hook Form + Yup |
| Carousels | Swiper, React Slick |
| Hosting | Vercel |

## Project Structure

```
src/
├── components/
│   ├── account/      # profile, address and security tabs
│   ├── auth/         # OTP modal
│   ├── cart/         # cart item + summary
│   ├── checkout/     # address form
│   ├── common/       # product card, skeletons, breadcrumb, rating, loaders
│   ├── home/         # countdown timer
│   ├── layout/       # navbar, footer
│   ├── order/        # order card + timeline
│   ├── product/      # filters
│   └── review/       # review form
├── pages/            # home, listing, product, cart, checkout, orders, account, auth, search, wishlist
├── store/slices/     # auth, cart, product, wishlist slices
├── services/api.js   # Axios instance and API calls
└── App.js            # routes + protected routes
```

## Getting Started

```bash
git clone https://github.com/NurSayed42/eCommerceFrontend.git
cd eCommerceFrontend
npm install
npm start          # http://localhost:3000
```

Run the [backend](https://github.com/NurSayed42/ECommerceBackend) first. In development, API requests are proxied to `http://localhost:8085`.

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `REACT_APP_API_URL` | Base URL of the Spring Boot API | `http://localhost:8085` |
| `REACT_APP_GOOGLE_CLIENT_ID` | Enables Google sign-in | not set (Google sign-in hidden) |

## Build

```bash
npm run build
```

## Author

**Nur Sayed** — Lead Engineer at VecoSoft · [GitHub](https://github.com/NurSayed42)
