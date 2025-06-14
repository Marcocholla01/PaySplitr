# 💸 Daily Payment Distribution Platform

A secure, web-based platform to streamline daily payment processing and data distribution between admins and distributors.

---

## 🚀 Overview

This platform was built for a company that processes daily payments to 100 recipients via CSV uploads and distributes them across 20 payment agents (distributors).

---

## 🔐 Security Features

- **NextAuth.js** for secure authentication and role-based access control (RBAC)
- **JWT sessions** for stateless session management
- **Bcrypt password hashing** to protect user credentials
- **Protected routes** with backend access control

---

## 👨‍💼 Admin Features

- Upload CSV file daily
- Auto-validate and store uploaded data
- Automatically assign 5 unique records to each of the 20 distributors
- View real-time statistics (total, assigned, completed)
- Track historical uploads and assignments

---

## 👥 Distributor Features

- Secure login with unique credentials
- View exactly 5 assigned payment records
- Update payment status (e.g., pending/completed)
- No overlapping of records between distributors

---

## 🗄️ Database Schema (Supabase)

- `users`: Stores admin & distributor details with roles
- `payment_records`: Contains parsed data from CSV uploads
- `assignments`: Links distributor to their 5 unique records
- Indexing for optimized queries and real-time performance

---

## ⚙️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth), Node APIs
- **Authentication**: NextAuth.js with Credentials Provider
- **Deployment**: Vercel (or your host URL here)
- **Storage**: Supabase storage & database

---

## 🌍 Live Demo

🔗 [View Live Platform](https://your-live-link.com)

---

## 📩 Want to Collaborate?

This is a functional demo and can be customized for your specific use case (e.g., NGO payments, vendor distribution, agent tracking).

📧 Reach out via [LinkedIn](https://linkedin.com/in/marcocholla) or email `marcochollapaul01@gmail.com`.

---

> Built with love by `MArcocholla01` 💻
