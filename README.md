<div align="center">
  <img src="public/hero-banner.png" alt="SOLARA." width="100%" />

  <br />
  <br />

  <h1>SOLARA.</h1>
  <p><b>Solar ROI optimization driven by NASA POWER meteorological data.</b></p>

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
## English Version

### Core Logic

Solara optimizes solar panel recommendations by prioritizing self-consumption over grid export, minimizing payback periods.

*   **Smart Daytime Cap:** Recommendations are capped by daytime energy usage to prevent oversizing in systems without battery storage.
*   **Meteorological Precision:** Integrates solar irradiance and weather data from the **NASA POWER API** based on exact GPS coordinates.
*   **Architecture:** Built with Next.js 15, Framer Motion for data visualization, and Prisma for scalable history tracking.

### Technical Stack

| Category | Component |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, Server Actions) |
| **Data Engine** | Prisma ORM, PostgreSQL |
| **UI/UX** | Tailwind CSS, Framer Motion, Recharts |
| **Integration**| Leaflet.js, NASA POWER API |

### Deployment (Docker)

```bash
git clone https://github.com/your-username/solara.git
cd solara
docker-compose up -d --build
docker exec -it solara_app npx prisma db push
```
Access at: **[http://localhost:3000](http://localhost:3000)**

---

<a name="thai"></a>
## ภาษาไทย (Thai Version)

### ระบบการคำนวณ

Solara คำนวณจุดคุ้มทุนโซลาร์เซลล์โดยเน้นสัดส่วนการใช้เอง (Self-consumption) เพื่อคืนทุนให้เร็วที่สุด

*   **Smart Daytime Cap:** จำกัดการแนะนำจำนวนแผงให้ไม่เกินยอดการใช้ไฟช่วงกลางวัน ป้องกันการลงทุนเกินตัวในระบบที่ไม่มีแบตเตอรี่
*   **ข้อมูล NASA POWER:** ใช้ข้อมูลความเข้มแสงอาทิตย์จริงตามพิกัดรุ้งแวง (GPS) จาก NASA เพื่อความแม่นยำทางสถิติ
*   **สถาปัตยกรรม:** พัฒนาด้วย Next.js 15 พร้อมระบบจัดการฐานข้อมูล Prisma และการแสดงผลข้อมูลด้วย Recharts

### เทคโนโลยี

| หมวดหมู่ | เทคโนโลยีที่ใช้ |
| :--- | :--- |
| **Framework** | Next.js 15+ |
| **Database** | Prisma ORM, PostgreSQL |
| **API**| NASA POWER, Leaflet.js |

### การติดตั้ง (Docker)

```bash
git clone https://github.com/your-username/solara.git
cd solara
docker-compose up -d --build
docker exec -it solara_app npx prisma db push
```
เข้าใช้งานที่: **[http://localhost:3000](http://localhost:3000)**

---

<div align="center">
  <p>Built with precision by <strong>Thee Banda</strong>.</p>
</div>
