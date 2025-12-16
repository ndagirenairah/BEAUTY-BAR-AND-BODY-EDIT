# The Beauty Bar UG - Booking Platform 💅✨

> Premium IV infusions, body sculpting, lash extensions & wellness treatments in Kampala, Uganda.

![The Beauty Bar](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-blue)

## 🌐 Live Demo

**Frontend:** [thebeautybarug.vercel.app](https://thebeautybarug.vercel.app)

## 📱 Connect With Us

- **TikTok:** [@thebeautybarug0](https://www.tiktok.com/@thebeautybarug0)
- **WhatsApp:** [+256 700 980 021](https://wa.me/256700980021)
- **Location:** Kampala, Uganda

---

## ✨ Features

### 🎯 Booking System
- **4-Step Booking Wizard** - Intuitive step-by-step booking flow
- **Service Categories** - Infusion Bar, Edit Studio, Lash Lounge
- **Real-time Availability** - Date and time slot selection
- **Instant Confirmation** - Booking reference generation

### 💉 Services Offered

#### Infusion Bar
- Total Body Edit
- NAD+ Cellular Regeneration
- Glow & Radiance Infusion
- Weight Management Mix
- Detoxification & Recovery
- Skin Whitening & Anti-Aging

#### Edit Studio
- Cryolipolysis Fat Freezing
- Body Contouring & Tightening
- Female Intimate Wellness
- Facial Rejuvenation
- Micro-Needling Therapy

#### Lash Lounge
- Classic, Hybrid, Volume, Mega Volume
- Wispy, Anime, Wet Set styles
- Lash Infills & Removal
- Professional Products

### 🎨 Design
- Elegant cream & gold color scheme
- Mobile-responsive design
- Smooth animations
- Professional typography

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/beauty-bar-body-edit.git

# Navigate to frontend
cd beauty-bar-body-edit

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
beauty-bar-body-edit/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page
│   │   ├── layout.tsx        # Root layout with navigation
│   │   ├── book/
│   │   │   └── page.tsx      # Booking wizard
│   │   └── api/
│   │       ├── bookings/     # Booking API
│   │       ├── chat/         # AI chatbot API
│   │       └── webhook/      # Payment webhooks
│   ├── components/
│   │   ├── AIChatBot.tsx     # AI assistant
│   │   └── PaymentModal.tsx  # Stripe payments
│   └── globals.css           # Global styles
├── public/
│   └── images/               # Service images
├── vercel.json               # Vercel deployment config
└── package.json
```

---

## 🎓 Deployment (GitHub Student Pack)

### Deploy to Vercel (Recommended for Next.js)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/beauty-bar-body-edit.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Your site will be live at:**
   ```
   https://your-project.vercel.app
   ```

### Environment Variables (Optional)
Set these in Vercel Dashboard → Settings → Environment Variables:

```env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
OPENAI_API_KEY=sk-xxx
```

---

## 🔧 Django Backend (Optional)

For the full-stack version with Django backend:

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed initial data
python manage.py seed_services

# Run server
python manage.py runserver
```

---

## 🎯 For Internship Portfolio

This project demonstrates:
- ✅ Full-stack development (Next.js + Django)
- ✅ Modern React patterns (hooks, state management)
- ✅ RESTful API design
- ✅ Database modeling
- ✅ Payment integration (Stripe)
- ✅ Responsive UI/UX design
- ✅ Production deployment

---

## 📞 Contact

**The Beauty Bar UG**
- 📍 Kampala, Uganda
- 📱 [+256 700 980 021](tel:+256700980021)
- 🎵 [@thebeautybarug0](https://www.tiktok.com/@thebeautybarug0)

---

*Built with ❤️ for The Beauty Bar UG*

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
