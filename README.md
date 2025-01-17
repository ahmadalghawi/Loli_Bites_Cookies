# Loli_Bites_Cookies Shop 🍪

A modern e-commerce application for a cookie shop built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- 🛍️ Product Catalog
  - Browse cookies by category
  - View product details
  - Sale items and discounts
  - Real-time stock updates

- 🛒 Shopping Cart
  - Add/remove items
  - Adjust quantities
  - Persistent cart storage

- 👤 User Authentication
  - Email/password login
  - User profile management
  - Role-based access (Admin/Customer)

- 🔐 Admin Dashboard
  - Product management (CRUD operations)
  - Inventory control
  - Sales monitoring

- 💅 Modern UI/UX
  - Responsive design
  - Dark/light mode
  - Beautiful animations
  - Loading states

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - React
  - Tailwind CSS
  - shadcn/ui Components
  - Lucide Icons

- **Backend**
  - Supabase (PostgreSQL)
  - Row Level Security
  - Real-time subscriptions

- **Authentication**
  - Supabase Auth
  - Role-based authorization

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sweet-bites.git
cd sweet-bites
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials in `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema

The application uses the following main tables:

- `users`: User profiles and authentication
- `products`: Cookie products catalog
- `orders`: Customer orders
- `order_items`: Individual items in orders

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)