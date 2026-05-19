# Event Management System (EMS)

ระบบบริหารจัดการกิจกรรมแบบ Full-stack Web Application ที่พัฒนาด้วย **Nuxt 3** และ **Drizzle ORM** พร้อมระบบ Type Safety ตั้งแต่เลเยอร์ฐานข้อมูลจนถึงหน้าจอผู้ใช้งาน (End-to-End Type Safety)

---

## คุณสมบัติของระบบ (Features)

- **CRUD Operations:** รองรับการสร้าง, ดึงข้อมูล, แก้ไข และลบกิจกรรมได้อย่างสมบูรณ์
- **Reactive Filtering & Sorting:** ค้นหาด้วยชื่อ เลือกตัวกรองตามวันที่ หรือสถานะ (Upcoming, Today, Past) และเรียงลำดับตามจำนวนผู้สมัครอัตโนมัติ (Auto-refetch) ผ่าน `useFetch`
- **Participant Controls:** ระบบปุ่มเพิ่ม/ลดจำนวนผู้สมัครเข้าร่วมกิจกรรม พร้อมระบบล็อกปุ่มอัตโนมัติเมื่อจำนวนผู้สมัครเต็มความจุที่กำหนด (`isFull` UI Feedback)
- **Modular Component Design:** แยกสัดส่วนหน้าที่ของ UI ออกเป็นคอมโพเนนต์ย่อยอย่างชัดเจน (`FilterBar`, `EventCard`, `EventForm`) เพื่อให้หน้าหลักผอมและบางที่สุด (Keep it thin)

---

## เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend & Backend:** [Nuxt 3](https://nuxt.com/) (Vue 3, TypeScript, Nitro Server)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS

---

## โครงสร้างโปรเจกต์ (Project Structure)

โปรเจกต์นี้ถูกจัดสรรในรูปแบบ Monorepo Workspace โดยแยกส่วนเนื้อหาหลักไว้ในโฟลเดอร์ `app`:

```text
event-management/
├── app/                      # โฟลเดอร์หลักของระบบ Nuxt 3
│   ├── .nuxt/                # แคชและไฟล์ตั้งค่าอัตโนมัติของ Nuxt
│   ├── components/           # UI Components (EventCard, FilterBar, EventForm)
│   ├── composables/          # ตัวจัดการ State หน้าบ้าน (useEvents)
│   ├── pages/                # หน้าหลักของเว็บไซต์ (index.vue)
│   ├── server/               # Backend API Layer
│   │   └── api/
│   │       └── events/       # Event Endpoints (GET, POST, PUT, DELETE, PATCH)
│   ├── types/                # สัญญาณข้อมูลสากล (AppEvent, EventFilters)
│   └── app.vue               # ไฟล์หลักในการเรนเดอร์หน้าจอ (<NuxtPage />)
└── README.md
```