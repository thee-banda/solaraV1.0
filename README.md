<div align="center">
  <img src="public/hero-banner.png" alt="SOLARA." width="100%" />

  <br />
  <br />

  <h1>☀️ SOLARA.</h1>
  <p><b>Precision Solar Planning powered by NASA POWER Data.</b></p>

  <p>
    <b>English</b> | <a href="README-th.md">ภาษาไทย</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/NASA_POWER-API-0b3d91?style=for-the-badge&logo=nasa" alt="NASA POWER" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
</div>

<br />

## 📖 The "Why" (Core Features)

Solara is not just a calculator; it's an **Intelligence Engine** designed to demystify solar investments and prevent unnecessary overspending on oversized panels.

*   🧠 **The 'Humble Optimizer' Logic:** Most calculators recommend panels to cover your *entire* bill. Solara realizes this is flawed. Without a battery, energy generated at night is 0, and energy generated during the day can only offset daytime usage. The Humble Optimizer aggressively prioritizes 100% self-consumption, capping the recommendation to strictly match your **Daytime Usage Ceiling**—resulting in a vastly faster payback period.
*   🛰️ **NASA Surface Meteorology Integration:** Real-world ROI requires real-world data. We fetch live irradiance and meteorological data exactly at your coordinates via the **NASA POWER API**, adjusting peak sun hours to mathematical exactness, ensuring our yield equations match geographic reality.
*   🔥 **Orbital Dashboard & Cinematic UX:** Premium interfaces build trust. Solara utilizes `framer-motion` to orchestrate fluid animations, a glowing responsive chart mapped to regional generation models, interactive Leaflet maps, and an architecture that strictly segregates calculation histories smoothly inside atomic Next.js routes.

---

## 🛠️ Technical Showcase (The Stack)

Solara is built with a modern, high-performance web stack focused on edge delivery and fluid interaction.

| Category | Technologies Used |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, React Server Actions) |
| **Database** | Prisma ORM, PostgreSQL (Vercel Postgres, Supabase, or self-hosted) |
| **UI Engine** | Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Deployment** | Docker & Docker Compose (Containerized for DigitalOcean/AWS) |
| **Integrations**| Leaflet.js (Geospatial Mapping), NASA POWER (Meteorology) |

---

## 🐳 Docker Tutorial (Recommended)

The fastest way to get Solara running is using Docker. This setup includes the application engine and a local PostgreSQL database.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Git](https://git-scm.com/) installed.

### 2. Launch the Application
Clone the repository and run the pre-configured compose file:

```bash
# Clone the repository
git clone https://github.com/your-username/solara.git
cd solara

# Start the engine and database
docker-compose up -d --build
```

### 3. Initialize Database
Once the containers are healthy, run the Prisma sync to set up your tables:

```bash
# Sync database schema
docker exec -it solara_app npx prisma db push

# (Optional) Seed the database if you have seeds
# docker exec -it solara_app npx prisma db seed
```

### 4. Access the Dashboard
Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Native Installation (Alternative)

Follow these steps to deploy natively for local development.

### 1. Clone & Initialize

```bash
# Clone the repository
git clone https://github.com/your-username/solara.git
cd solara

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file at the root. Use the provided example template:

```bash
cp .env.example .env
```

### 3. Database Migration

```bash
# Synchronize the schema
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

---

## 🔬 Project Philosophy: The Smart Daytime Cap

Standard solar calculators try to sell you more panels. *We try to get your money back faster.* 

If your monthly bill is 5,000 THB, but your daytime usage is only 60%, Solara recognizes your actual "Solar Target" is 3,000 THB. Recommending a 5,000 THB solar array means you are either pushing excess power back to the grid for pennies, or watching it go to waste. 

By employing the **Smart Daytime Cap**, we calculate the exact number of equivalent daily units needed for daytime operations, apply a ceiling function, and execute the **"Minus One"** constraint buffer. This creates a lean, highly efficient system out of the gate, maximizing ROI and bringing the payback period into the hyper-optimal range of 4-6 years. 

---

<div align="center">
  <p>🛠 Built with precision by <strong>Thee Banda</strong>.</p>
</div>
