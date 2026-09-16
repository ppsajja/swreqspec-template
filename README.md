# <ชื่อทีม>-swreqspec

repo สำหรับงาน Spec-Driven Development ในรายวิชา 520461-165 Software Requirement Specification and Management
ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยศิลปากร

## ทีม

- ชื่อทีม:
- สมาชิก:
- เครื่องมือ AI ที่ใช้: (Copilot ใน Codespaces / Claude Code / Cursor)

## โครงของ repo

```
README.md                    ไฟล์นี้ (ใส่ชื่อทีม สมาชิก และ reflection ท้ายคาบ)
AGENTS.md                    กติกาที่ AI ต้องทำตาม (Copilot และ Cursor อ่านเอง)
CLAUDE.md                    ชี้ไป AGENTS.md (สำหรับ Claude Code)
docs/srs/                    SRS ฉบับเต็มและ diagram ของทีม (สำหรับคนอ่าน)
specs/README.md              ดัชนีว่าฟีเจอร์ไหนอยู่โฟลเดอร์ไหน
specs/001-booking/spec.md    ตัวอย่าง spec.md ของรายวิชา (ใช้ฝึกในคาบ)
specs/00N-<feature>/spec.md  spec.md ของทีม 1 โฟลเดอร์ต่อ 1 ฟีเจอร์
prompt-log.md                AI สร้างให้เมื่อใช้ /clarify (บันทึกคำถามและคำตอบ)
.github/prompts/             คำสั่ง /clarify และ /plan สำหรับ Copilot
.claude/commands/            คำสั่ง /clarify และ /plan สำหรับ Claude Code
.cursor/commands/            คำสั่ง /clarify และ /plan สำหรับ Cursor
```

## วิธีเริ่ม

1. กด Code แล้วเลือก Codespaces สร้างเครื่องใหม่ (หรือ clone ลงเครื่องแล้วเปิดด้วย Cursor / Claude Code)
2. เปิด Copilot Chat สลับเป็นโหมด Agent
3. พิมพ์ `/clarify specs/001-booking/spec.md`
4. ตอบคำถาม แล้วดู diff ของ spec.md ก่อน commit

รายละเอียดคำสั่งอยู่ที่ `docs/agent-pack-README.md`

## ถ้าเป็น repo ของทีม

- แก้ชื่อ repo เป็น `<ชื่อทีม>-swreqspec` และตั้งเป็น public
- ลบโฟลเดอร์ `specs/001-booking/` แล้วสร้าง `specs/001-<ชื่อฟีเจอร์ของทีม>/spec.md`
- อัปโหลด SRS และ diagram ของทีมไว้ที่ `docs/srs/`

## Reflection

(เขียนท้ายคาบ 5 บรรทัด)
