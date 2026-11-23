# SLN Engineers Projects Pvt. Ltd. — Official Web & Customer Engagement Platform

> **“Restoration for Three Generations”**
>
> Commercial, Industrial & Residential Waterproofing, Structural Restoration, and Painting Contracting Services.

---

## 1. Project Overview

**SLN Engineers Projects Pvt. Ltd.** is a full-stack MERN (MongoDB, Express, React, Node.js) web application and customer engagement portal. Built specifically for high-durability waterproofing contractors, the platform highlights the company's 40-year, 3-generation engineering heritage, showcases verified completed projects with before-and-after photographic comparisons, manages customer enquiries, and incorporates a cryptographically secure QR-code review collection and social media sharing engine.

---

## 2. Key Architecture & Features

### Public Website
- **Hero Section**: Showcases the brand emblem, the signature tagline *“Restoration for Three Generations”*, and three immediate call-to-action buttons (**Request a Quote**, **Call Us**, and **WhatsApp Us**).
- **Interactive Before & After Comparison**: Real-time draggable slider comparing deteriorated substrate conditions with the cured waterproof membrane.
- **Configurable Services Module**: 7 specialized waterproofing categories (Terrace & roof, Bathroom & wet areas, Basement tanking, Wall dampness, External walls, Painting & restoration, Crack repair & coatings) with technical specifications and performance advantages.
- **Completed Project Portfolio**: Case studies filterable by category and location, with inspection findings, materials used, warranty details, and photographic evidence.
- **Customer Reviews**: Verified client testimonials with aggregate rating breakdown.
- **Customer Enquiry Form**: Captures customer name, phone, property location, service required, problem description, optional photo attachments, preferred contact method, and privacy consent.
- **SEO & Performance**: Dynamic OpenGraph tags, semantic HTML, `/sitemap.xml`, and `/robots.txt`.

### QR-Code Customer Review System (Primary Feature)
- **Cryptographic Unguessable Tokens**: Generated per completed project using `crypto.randomBytes(16)`.
- **Scannable QR Codes**: Produced dynamically using the `qrcode` library.
- **Handover Print Cards**: Generates high-resolution PNG downloads and print-friendly review cards formatted for invoices and warranty certificates.
- **Mobile Review Interface (`/scan-review/:token`)**:
  - Interactive 1–5 star rating input with hover feedback.
  - Written feedback textarea and optional customer name.
  - Optional publication consent checkbox.
  - **Independent Google Review Button**: Reviewers of any rating can independently access the official Google Business review destination.
  - Scan counters and active/deactivated token controls.

### Social Media & Outbound Click Tracking
- Configurable links for Google Business Profile, WhatsApp, Instagram, Facebook, and YouTube.
- Outbound click redirect tracking via `/api/social/click/:platform`.
- **Project Social Share Assistant**: Generates prefilled captions and hashtags for staff with 1-click clipboard copy and approved image downloads.

### Admin Dashboard & Management Portal
- **Executive Operations Dashboard**: KPI cards for Total Enquiries, New Leads, Active/Completed Projects, Website Reviews, Average Rating, QR Scans, and Outbound Clicks.
- **Recharts Analytics**: Visual charts for Customer Rating Distribution and Enquiry Pipeline Stages.
- **Enquiry Pipeline Manager**: Track statuses (`New` → `Contacted` → `Site Inspection` → `Quotation Sent` → `Converted` → `Closed`), assign staff, and log timestamped internal notes.
- **Customer Feedback Moderation**: 1-click Approve, Unpublish, or Flag Spam.
- **Customer Directory**: Centralized client phone numbers, locations, and service histories.
- **Company Settings**: Configurable phones, emergency helpline, email, address, working hours, and review base domain.
- **System Audit Trail**: Immutable log of administrative operations with timestamps, resources, and IP addresses.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, React Router DOM, Tailwind-style responsive CSS, Lucide Icons, Recharts, Canvas-Confetti.
- **Backend**: Node.js, Express.js (modular monolithic architecture), Multer file upload handling.
- **Database**: MongoDB with Mongoose (12 schemas with indexes and validation).
- **Security**: JWT authentication, bcryptjs password hashing, Helmet HTTP headers, CORS origin filtering, and Express Rate Limiters.

---

## 4. Local Setup & Installation

### Prerequisites
- **Node.js**: v18+ (tested on Node v22.14.0)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI.

### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-org/sln-waterproofing-platform.git
cd sln-waterproofing-platform

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/sln_waterproofing
JWT_SECRET=sln_engineers_secure_jwt_secret_key_2026_three_generations
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PUBLIC_DOMAIN=http://localhost:5173
UPLOAD_DIR=uploads
```

### Step 3: Seed Demonstration Data
Run the database seeder to populate all 12 MongoDB collections with realistic demonstration services, projects, and administrative accounts:
```bash
# From workspace root:
npm run seed

# Or from inside server/:
node src/utils/seed.js
```

### Demonstration Login Credentials
| Role | Identifier / Email | Password |
|---|---|---|
| **Superadmin** | `slnadmin` / `admin@slnengineers.com` | `Admin@12345` |
| **Staff Member** | `slnstaff` / `staff@slnengineers.com` | `Staff@12345` |

---

## 5. Running the Application

### Development Mode
```bash
# Terminal 1: Start Backend (Port 5000)
npm run start:server

# Terminal 2: Start Frontend (Port 5173)
npm run dev:client
```

- **Public Website**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend API Base**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 6. Automated Testing

To run the full end-to-end integration test suite verifying health check, services, projects, enquiry registration, JWT auth, dashboard analytics, QR token generation, review submission, social redirect tracking, and SEO endpoints:
```bash
node test_suite.js
```

---

## 7. Deploying the Backend to Railway

1. Create a Railway project and deploy this repository from GitHub.
2. Set the service **Root Directory** to `/server`. Railway will use `server/package-lock.json` and `server/railway.json`.
3. Add these variables in the Railway service's **Variables**:
   - `NODE_ENV=production`
   - `MONGODB_URI` with your MongoDB Atlas connection string; allow Railway access in the Atlas network settings.
   - `JWT_SECRET` with a newly generated, high-entropy secret.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`, or a `CLOUDINARY_URL`.
   - `CLIENT_URL` set to the deployed frontend origin.
   - `PUBLIC_DOMAIN` set to the public website origin.
4. Deploy. Railway starts the service with `npm start`, provides `PORT` automatically, and checks `/api/health`.
5. After the first deployment, replace the seeded administrator password before sharing the service publicly.

Uploaded media is streamed from memory to Cloudinary; Railway's local filesystem is not used for new uploads. Configure MongoDB Atlas backups separately.

---

## 8. License & Notice
All rights reserved © 2026 SLN Engineers Projects Pvt. Ltd.
*Demonstration content notice: Sample customer testimonials and project references are simulated for evaluation purposes and can be customized via the Admin Portal.*
