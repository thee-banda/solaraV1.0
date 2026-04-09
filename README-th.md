<div align="center">
  <img src="public/hero-banner.png" alt="SOLARA." width="100%" />

  <br />
  <br />

  <h1>☀️ SOLARA.</h1>
  <p><b>ระบบวางแผนโซลาร์เซลล์แม่นยำสูง ขับเคลื่อนด้วยข้อมูลอุตุนิยมวิทยาจาก NASA POWER</b></p>
  
  <p>
    <a href="README.md">English</a> | <b>ภาษาไทย</b>
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

## 📖 ทำไมต้อง Solara? (คุณสมบัติหลัก)

Solara ไม่ใช่แค่เครื่องคิดเลขคำนวณค่าไฟธรรมดา แต่คือ **Intelligence Engine** ที่ออกแบบมาเพื่อลดความซับซ้อนในการลงทุนโซลาร์เซลล์ และป้องกันการลงทุนเกินตัว (Oversized) โดยไม่จำเป็น

*   🧠 **ตรรกะ 'Humble Optimizer':** เครื่องคิดเลขส่วนใหญ่มักแนะนำจำนวนแผงที่ครอบคลุมค่าไฟ *ทั้งหมด* ของคุณ ซึ่งนั่นเป็นวิธีที่ผิดพลาดสำหรับระบบที่ไม่มีแบตเตอรี่ เพราะพลังงานกลางคืนเป็น 0 และพลังงานกลางวันก็ใช้ได้เฉพาะช่วงที่มีแดด Solara จึงใช้ 'Humble Optimizer' ในการวิเคราะห์และแนะนำจำนวนแผงที่สอดรับกับ **เพดานการใช้ไฟช่วงกลางวัน** ของคุณจริงๆ ทำให้ได้จุดคุ้มทุนที่รวดเร็วที่สุด
*   🛰️ **การผสานข้อมูลจาก NASA:** การคำนวณ ROI ที่แม่นยำต้องใช้ข้อมูลจริง เราดึงข้อมูลความเข้มแสงอาทิตย์ (Irradiance) และสภาพอากาศสดๆ จากพิกัดของคุณผ่านมายัง **NASA POWER API** เพื่อคำนวณชั่วโมงแดดเฉลี่ย (Peak Sun Hours) ตามหลักคณิตศาสตร์ที่ถูกต้องที่สุด
*   🔥 **แดชบอร์ดระดับพรีเมียม (Cinematic UX):** อินเทอร์เฟซที่สวยงามสร้างความเชื่อมั่น Solara ใช้ `framer-motion` ในการสร้างแอนิเมชันที่ลื่นไหล, กราฟแสดงผลที่ตอบสนองตามรุ่นการผลิตจริงในพื้นที่, แผนที่ Leaflet แบบโต้ตอบได้ และโครงสร้าง Next.js ที่จัดการข้อมูลได้อย่างรวดเร็ว

---

## 🛠️ เทคโนโลยีที่ใช้ (The Stack)

Solara ถูกสร้างขึ้นด้วยเทคโนโลยีเว็บที่ทันสมัยที่สุด เน้นประสิทธิภาพและความลื่นไหลในการใช้งาน

| หมวดหมู่ | เทคโนโลยีที่ใช้ |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, React Server Actions) |
| **Database** | Prisma ORM, PostgreSQL (Vercel Postgres หรือ Docker) |
| **UI Engine** | Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Deployment** | Docker & Docker Compose (พร้อมสำหรับ DigitalOcean/AWS) |
| **Integrations**| Leaflet.js (ระบบแผนที่), NASA POWER (ข้อมูลอุตุนิยมวิทยา) |

---

## 🐳 คู่มือการใช้งานผ่าน Docker (แนะนำ)

วิธีที่เร็วที่สุดในการรัน Solara คือการใช้ Docker ซึ่งจะรวมทั้งตัวแอปพลิเคชันและฐานข้อมูล PostgreSQL มาให้พร้อมกัน

### 1. ความต้องการเบื้องต้น
- ติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/) และเปิดให้ทำงาน
- ติดตั้ง [Git](https://git-scm.com/)

### 2. เริ่มต้นการใช้งาน
Copy (Clone) โปรเจกต์และสั่งรันผ่าน Docker:

```bash
# Clone โปรเจกต์
git clone https://github.com/your-username/solara.git
cd solara

# เริ่มต้นระบบและฐานข้อมูล
docker-compose up -d --build
```

### 3. ตั้งค่าฐานข้อมูล (Database Sync)
เมื่อ Container ทำงานแล้ว ให้ทำการสร้าง Table ในฐานข้อมูล:

```bash
# ซิงค์โครงสร้างฐานข้อมูล
docker exec -it solara_app npx prisma db push
```

### 4. เข้าใช้งาน
เปิดเบราว์เซอร์แล้วไปที่:
**[http://localhost:3000](http://localhost:3000)**

---

## 🚀 การติดตั้งแบบปกติ (Native Alternative)

สำหรับนักพัฒนาที่ต้องการรันในสภาพแวดล้อมปกติ

### 1. Clone & Initialize

```bash
git clone https://github.com/your-username/solara.git
cd solara
npm install
```

### 2. การตั้งค่า Environment

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```bash
cp .env.example .env
```

### 3. การจัดการฐานข้อมูล

```bash
npx prisma db push
npx prisma generate
```

### 4. รันเซิร์ฟเวอร์

```bash
npm run dev
```

---

## 🔬 ปรัชญาของโปรเจกต์: Smart Daytime Cap

เครื่องคำนวณโซลาร์เซลล์ทั่วไปพยายามจะขายแผงให้คุณมากที่สุด *แต่เราพยายามทำให้คุณได้ทุนคืนเร็วที่สุด*

หากค่าไฟของคุณคือ 5,000 บาท แต่คุณใช้ไฟช่วงกลางวันเพียง 60% Solara จะมองเห็นว่า "เป้าหมายโซลาร์" ที่แท้จริงของคุณคือ 3,000 บาทเท่านั้น การติดตั้งระบบที่ผลิตได้ 5,000 บาท หมายความว่าคุณกำลังปล่อยพลังงานส่วนเกินทิ้งไปฟรีๆ หรือขายคืนการไฟฟ้าในราคาที่ต่ำมาก

ด้วยการใช้ **Smart Daytime Cap** เราคำนวณจำนวนหน่วยไฟฟ้าที่ต้องการจริงสำหรับช่วงกลางวัน และใช้ฟังก์ชัน **"Minus One"** เพื่อความปลอดภัยของระบบ ทำให้ระบบที่ได้มีประสิทธิภาพสูงสุด คุ้มค่าเงินลงทุน และทำให้อัตราการคืนทุน (Payback Period) อยู่ในช่วงที่เหมาะสมที่สุดคือ 4-6 ปี

---

<div align="center">
  <p>🛠 สร้างสรรค์ด้วยความแม่นยำโดย <strong>Thee Banda</strong>.</p>
</div>
