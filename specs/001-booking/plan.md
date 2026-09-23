# Plan: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | Updated: 2569-09-22 | สร้างด้วย /plan แล้วทีมตรวจแล้ว (plan v1)

## 1. สรุปแนวทาง
- ผู้รับบริการที่ยืนยันตัวตนแล้ว ค้นช่วงเวลาว่าง เลือก แล้วยืนยันการจอง ได้หมายเลขคิวกลับทันที
- หลังบ้านเป็น API (Python FastAPI) เก็บข้อมูลใน PostgreSQL ตาม CON-TECH-01 ผ่าน SQLAlchemy
- การส่งข้อความยืนยันไม่รอผล (IF-NOT-01): API แค่วางงานลงคิว แล้วตัวส่งแยกทำงานเบื้องหลัง
- ทุกการเข้าถึงข้อมูลการจองถูกบันทึก audit log (DOM-PDPA-01) และเก็บเฉพาะ HN ไม่เก็บเลขบัตรประชาชน (IF-HIS-01)
- ส่วนที่ติด Q-02 (รูปแบบหมายเลขคิว) ยังไม่สร้าง ใช้ช่องเก็บเลขคิวไว้ก่อนแต่ยังไม่กำหนดวิธีออกเลข

## 2. เทคโนโลยีที่ใช้
| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| PostgreSQL 16 | CON-TECH-01 | บังคับโดยฝ่าย IT โรงพยาบาล ใช้ในระบบจริง |
| Python 3.12 + FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | ค่าเริ่มต้นของรายวิชา |
| SQLAlchemy 2 | ทีมเลือกเอง ไม่ได้มาจาก spec | ต่อฐานข้อมูลผ่านตัวแปร `DATABASE_URL` สลับฐานข้อมูลได้โดยไม่แก้โค้ด |
| pytest | ทีมเลือกเอง ไม่ได้มาจาก spec | ตอน test ใช้ SQLite ในหน่วยความจำ (`sqlite:///:memory:`) แทน PostgreSQL เพราะ Codespace ไม่มีเครื่องฐานข้อมูลรันอยู่ ไม่ต้องติดตั้งอะไรเพิ่ม |
| React (Vite) + Tailwind CSS | ทีมเลือกเอง ไม่ได้มาจาก spec | ค่าเริ่มต้นของรายวิชา โครงเริ่มต้นอยู่ใน `frontend/` แล้ว |
| Vitest + React Testing Library | ทีมเลือกเอง ไม่ได้มาจาก spec | test หน้าจอ ใช้ API จำลอง ไม่ต้องรันหลังบ้านจริง |
| Redis (คิวส่งข้อความ) | ทีมเลือกเอง ไม่ได้มาจาก spec | รองรับ IF-NOT-01 แบบ async ตอน test ใช้คิวจำลองในหน่วยความจำ ไม่ต้องมี Redis จริง |

library ทั้งหมดอยู่ใน `backend/requirements.txt` (Codespace ติดตั้งให้ตอนสร้างเครื่อง)
รัน test หลังบ้านด้วยคำสั่ง `cd backend && pytest` (ตั้งค่าไว้แล้วใน `backend/pytest.ini`)
เปิดหลังบ้านให้หน้าจอเรียกได้ด้วยคำสั่ง `cd backend && uvicorn app.main:app --reload --port 8000` (หน้าจอเรียกผ่าน `/api` ซึ่ง Vite ส่งต่อไปให้)
รัน test หน้าจอด้วยคำสั่ง `cd frontend && npm test` และเปิดดูหน้าจอด้วย `cd frontend && npm run dev` (Codespace ติดตั้ง library ของหน้าจอให้ตอนสร้างเครื่อง)

### โครงไฟล์
```
backend/
  requirements.txt
  pytest.ini                   ตั้งค่า pytest ให้หา app/ เจอ
  app/
    main.py                    สร้าง FastAPI app และรวม router
    config.py                  อ่าน DATABASE_URL
    db/
      models.py                ตาราง slots, bookings, audit_logs (SQLAlchemy)
      session.py               สร้าง engine และ session
      migrations/
        001_init.py            ฟังก์ชัน upgrade(engine) สร้างทุกตาราง
    auth/
      idp.py                   ตรวจผลยืนยันตัวตนจากระบบยืนยันตัวตน (IF-IDP-01)
    his/
      client.py                ค้น HN จาก HIS ด้วยเลขบัตร (IF-HIS-01)
    audit/
      middleware.py            บันทึก audit log ทุก request ที่แตะข้อมูลการจอง (DOM-PDPA-01)
    slots/
      router.py                GET /slots
      service.py               คำนวณช่วงว่าง และหาช่วงใกล้เคียง
    booking/
      router.py                POST /bookings, GET /bookings/{id}
      service.py               กันจองซ้ำ ตัดที่นั่ง บันทึกการจอง
    notify/
      queue.py                 วางงานส่งข้อความลงคิว และส่งซ้ำตาม ASM-03
  tests/
    conftest.py                เตรียมฐานข้อมูล SQLite ในหน่วยความจำให้ทุก test
    test_*.py                  1 ไฟล์ต่อ 1 task หรือ 1 AC
frontend/                      React (Vite) + Tailwind CSS มีโครงเริ่มต้นให้แล้ว
  package.json                 คำสั่ง npm run dev, npm test
  vite.config.js               ตั้งค่า Vite, Tailwind และ Vitest
  src/
    App.jsx                    หน้าแรก ใส่หน้าจอของแต่ละ task เข้ามาที่นี่
    index.css                  เปิดใช้ Tailwind
    api/client.js              เรียก API หลังบ้านผ่าน /api (Vite ส่งต่อไป port 8000) ตอน test ส่ง client จำลองเข้าหน้าจอแทน
    pages/SlotPicker.jsx       หน้าเลือกแพ็กเกจและช่วงเวลา
    pages/ConfirmBooking.jsx   หน้ายืนยัน และแจ้ง "ช่วงเวลาเต็ม" พร้อม 3 ตัวเลือก
    pages/BookingResult.jsx    หน้าแสดงผลการจองและหมายเลขคิว
    __tests__/                 test หน้าจอ ตั้งชื่อไฟล์ตาม AC เช่น AC-BKG-03.test.jsx
```

## 3. โมเดลข้อมูล
| ตาราง | ฟิลด์หลัก | รองรับ |
|---|---|---|
| slots | id, slot_date, start_time, package_code, capacity, remaining | FR-BKG-01, FR-BKG-06, ASM-01 |
| bookings | id, hn, slot_id, booking_date, queue_no (ว่างได้ รอ Q-02), status, created_at | FR-BKG-02, FR-BKG-04, IF-HIS-01 |
| audit_logs | id, actor_id, action, hn, accessed_at | DOM-PDPA-01 |

- ตาราง bookings เก็บเฉพาะ `hn` **ไม่มีคอลัมน์เลขบัตรประชาชน (national_id)** ตาม IF-HIS-01
- `queue_no` มีคอลัมน์ไว้ แต่ยังไม่กำหนดรูปแบบและวิธีออกเลข จนกว่า Q-02 จะได้คำตอบ
- รายการค้างส่งข้อความ (ASM-03) เก็บในคิว Redis ไม่ใช่ตารางใน PostgreSQL

## 4. API / หน้าจอ
| รายการ | input / output หลัก | รองรับ |
|---|---|---|
| GET /slots | in: date_from, package_code / out: รายการช่วงเวลา + ที่นั่งคงเหลือ | FR-BKG-01, FR-BKG-06 |
| POST /bookings | in: slot_id / out: booking id, queue_no หรือ 409 พร้อมช่วงใกล้เคียง 3 ช่วง | FR-BKG-02, FR-BKG-03, FR-BKG-04 |
| GET /bookings/{id} | out: รายละเอียดการจอง + queue_no | FR-BKG-05 |
| GET /patients/lookup | in: เลขบัตร (ส่งต่อไป HIS ไม่เก็บ) / out: hn | IF-HIS-01 |
| หน้าเลือกแพ็กเกจและเวลา (SlotPicker) | เรียก GET /slots เปลี่ยนแพ็กเกจแล้วโหลดช่วงเวลาใหม่ | FR-BKG-01, FR-BKG-06 |
| หน้ายืนยัน (ConfirmBooking) | เรียก POST /bookings ถ้าได้ 409 แสดง "ช่วงเวลาเต็ม" และ 3 ตัวเลือก | FR-BKG-03, FR-BKG-04 |
| หน้าแสดงผลการจอง (BookingResult) | แสดงหมายเลขคิว แม้ส่งข้อความไม่สำเร็จ | FR-BKG-04, FR-BKG-05 |

## 5. ตารางตรวจ Constraints
| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| CON-TECH-01 | ข้อ 2 และข้อ 3 (ตารางทั้งหมดอยู่ใน PostgreSQL ในระบบจริง) | ใช้แล้ว |
| DOM-PDPA-01 | ตาราง audit_logs และ audit/middleware.py | ใช้แล้ว |
| IF-IDP-01 | auth/idp.py ทุก endpoint ตรวจผลยืนยันตัวตนก่อน | ใช้แล้ว |
| IF-HIS-01 | GET /patients/lookup และ bookings เก็บเฉพาะ hn | ใช้แล้ว |
| IF-NOT-01 | notify/queue.py POST /bookings ไม่รอผลการส่งข้อความ | ใช้แล้ว ตาม ASM-03 |

## 6. แผนทดสอบจาก Acceptance Criteria
| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-BKG-01 | test_AC_BKG_01 | สร้างช่วง 09.00 ที่เหลือ 1 ที่ จองผ่าน API แล้วตรวจว่าบันทึกสำเร็จ และ remaining เป็น 0 |
| AC-BKG-02 | test_AC_BKG_02 | สร้างการจองวันเดียวกันไว้ 1 รายการ จองซ้ำ แล้วตรวจว่าถูกปฏิเสธและได้ booking เดิมกลับ |
| AC-BKG-03 | test_AC_BKG_03 | ทำให้ช่วง 09.00 เต็มก่อนยืนยัน แล้วตรวจว่าได้ 409 พร้อม 3 ช่วงที่ใกล้ที่สุดในวันเดียวกันและวันถัดไป และไม่มีการจองซ้อน |
| AC-BKG-04 | test_AC_BKG_04 | ใช้คิวจำลองที่ส่งไม่สำเร็จ ตรวจว่าการจองยังถูกบันทึก และมีงานส่งซ้ำกำหนดภายใน 5 นาที |
| AC-BKG-05 | test_AC_BKG_05 | ยิง GET /slots พร้อมกัน 200 ครั้งแบบย่อส่วนใน Codespace แล้ววัด p95 (ผลจริงต้องวัดบนเครื่องทดสอบ) |
| AC-BKG-06 | test_AC_BKG_06 | เปิดดูการจอง 1 ครั้ง แล้วตรวจว่ามี audit log ที่มี actor_id, accessed_at และ hn |
| AC-BKG-03 (หน้าจอ) | AC-BKG-03.test.jsx | ให้ API จำลองตอบ 409 พร้อม 3 ช่วง แล้วตรวจว่าหน้าจอแสดง "ช่วงเวลาเต็ม" และปุ่ม 3 ตัวเลือก |

หลักแยกง่าย ๆ: AC ที่ Then บอกว่า "บันทึก" ตรวจที่หลังบ้าน AC ที่ Then บอกว่า "แสดง" หรือ "แจ้ง" ต้องมี test หน้าจอด้วย
FR-BKG-06 ยังไม่มี AC ใน spec จึงยังไม่มี test ที่ตรวจการเปลี่ยนแพ็กเกจ (ควรเสนอทีมเพิ่ม AC)

## 7. ลำดับงาน
หลังบ้าน
1. สร้างตารางและ migration (CON-TECH-01, DOM-PDPA-01, IF-HIS-01)
2. GET /slots และการคำนวณช่วงว่างตามแพ็กเกจ (FR-BKG-01, FR-BKG-06, AC-BKG-05)
3. POST /bookings พื้นฐาน ตัดที่นั่งและบันทึก (FR-BKG-04, AC-BKG-01)
4. กันจองซ้ำวันเดียวกัน (FR-BKG-02, AC-BKG-02)
5. เสนอช่วงใกล้เคียงเมื่อเต็ม (FR-BKG-03, AC-BKG-03)
6. คิวส่งข้อความและการส่งซ้ำ (FR-BKG-05, IF-NOT-01, AC-BKG-04)
7. audit log middleware (DOM-PDPA-01, AC-BKG-06)
8. ค้น HN จาก HIS (IF-HIS-01)
9. ออกหมายเลขคิวและแสดงบนหน้าจอ (FR-BKG-04) รอ Q-02

หน้าจอ (ใช้ API จำลองตามสัญญาในข้อ 4 จึงเริ่มพร้อมหลังบ้านได้)
10. หน้าเลือกแพ็กเกจและช่วงเวลา (FR-BKG-01, FR-BKG-06) เริ่มได้เลย
11. หน้ายืนยัน และแจ้ง "ช่วงเวลาเต็ม" พร้อม 3 ตัวเลือก (FR-BKG-03, AC-BKG-03) ทำหลังข้อ 10
12. ต่อหน้าจอกับ API จริง (FR-BKG-01, FR-BKG-03) ทำหลังข้อ 2, ข้อ 5 และข้อ 11

## 8. สิ่งที่ยังไม่ทำ
- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร -> ถามเจ้าหน้าที่เวชระเบียน
  ส่วนที่เกี่ยวข้องกับข้อนี้ (วิธีออกเลขคิว และการแสดงเลขคิว) จะยังไม่สร้างจนกว่าจะได้คำตอบ
