<div align="center">
  <img src="public/hero-banner.png" alt="SOLARA." width="100%" />

  <br />
  <br />

  <h1>☀️ SOLARA.</h1>
  <p><b>Precision Solar Planning powered by NASA POWER Data.</b></p>

  <p>
    <a href="#english">English</a> | <a href="#thai">ภาษาไทย</a>
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

---

<a name="english"></a>
## 🇺🇸 English Version

### 📖 The "Why" (Core Features)

Solara is not just a calculator; it's an **Intelligence Engine** designed to demystify solar investments and prevent unnecessary overspending on oversized panels.

*   🧠 **The 'Humble Optimizer' Logic:** Most calculators recommend panels to cover your *entire* bill. Solara realizes this is flawed. Without a battery, energy generated at night is 0, and energy generated during the day can only offset daytime usage. The Humble Optimizer aggressively prioritizes 100% self-consumption, capping the recommendation to strictly match your **Daytime Usage Ceiling**—resulting in a vastly faster payback period.
*   🛰️ **NASA Surface Meteorology Integration:** Real-world ROI requires real-world data. We fetch live irradiance and meteorological data exactly at your coordinates via the **NASA POWER API**, adjusting peak sun hours to mathematical exactness, ensuring our yield equations match geographic reality.
*   🔥 **Orbital Dashboard & Cinematic UX:** Premium interfaces build trust. Solara utilizes `framer-motion` to orchestrate fluid animations, a glowing responsive chart mapped to regional generation models, interactive Leaflet maps, and an architecture that strictly segregates calculation histories smoothly inside atomic Next.js routes.

### 🛠️ Technical Showcase (The Stack)

| Category | Technologies Used |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, React Server Actions) |
| **Database** | Prisma ORM, PostgreSQL (Vercel Postgres, Supabase, or self-hosted) |
| **UI Engine** | Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Deployment** | Docker & Docker Compose (Containerized for DigitalOcean/AWS) |
| **Integrations**| Leaflet.js (Geospatial Mapping), NASA POWER (Meteorology) |

### 🐳 Docker Tutorial (Recommended)

```bash
# 1. Clone & Setup
git clone https://github.com/your-username/solara.git
cd solara

# 2. Launch
docker-compose up -d --build

# 3. Sync Database
docker exec -it solara_app npx prisma db push
```
Access at: **[http://localhost:3000](http://localhost:3000)**

---

<a name="thai"></a>
## 🇹🇭 ฉบับภาษาไทย

### 📖 ทำไมต้อง Solara? (คุณสมบัติหลัก)

Solara ไม่ใช่แค่เครื่องคิดเลขคำนวณค่าไฟธรรมดา แต่คือ **Intelligence Engine** ที่ออกแบบมาเพื่อลดความซับซ้อนในการลงทุนโซลาร์เซลล์ และป้องกันการลงทุนเกินตัว (Oversized) โดยไม่จำเป็น

*   🧠 **ตรรกะ 'Humble Optimizer':** เราวิเคราะห์และแนะนำจำนวนแผงที่สอดรับกับ **เพดานการใช้ไฟช่วงกลางวัน** ของคุณจริงๆ ทำให้ได้จุดคุ้มทุนที่รวดเร็วที่สุด
*   🛰️ **การผสานข้อมูลจาก NASA:** ดึงข้อมูลความเข้มแสงอาทิตย์ (Irradiance) และสภาพอากาศสดๆ จากพิกัดของคุณผ่านมายัง **NASA POWER API** เพื่อคำนวณชั่วโมงแดดเฉลี่ยที่แม่นยำที่สุด
*   🔥 **แดชบอร์ดระดับพรีเมียม (Cinematic UX):** ใช้ `framer-motion` ในการสร้างแอนิเมชันที่ลื่นไหล, กราฟแสดงผลที่ตอบสนองตามรุ่นการผลิตจริงในพื้นที่ และแผนที่แบบโต้ตอบได้

### 🛠️ เทคโนโลยีที่ใช้ (The Stack)

| หมวดหมู่ | เทคโนโลยีที่ใช้ |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, React Server Actions) |
| **Database** | Prisma ORM, PostgreSQL (Vercel Postgres หรือ Docker) |
| **Deployment** | Docker & Docker Compose (พร้อมสำหรับ DigitalOcean/AWS) |

### 🐳 คู่มือการใช้งานผ่าน Docker

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/your-username/solara.git
cd solara

# 2. เริ่มต้นระบบ
docker-compose up -d --build

# 3. ซิงค์โครงสร้างฐานข้อมูล
docker exec -it solara_app npx prisma db push
```
เข้าใช้งานที่: **[http://localhost:3000](http://localhost:3000)**

---

<div align="center">
  <p>🛠 Built with precision by <strong>Thee Banda</strong>.</p>
</div>
