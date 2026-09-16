# tasks-pack: คำสั่ง /tasks เผื่อคาบไปเร็ว

ชุดนี้เพิ่มคำสั่ง `/tasks` ให้ 3 เครื่องมือ (Copilot, Claude Code, Cursor) เหมือน agent-pack
ใช้ต่อจาก /plan: อ่าน spec.md v2 + plan.md แล้วแตกเป็น tasks.md (งานย่อยเรียงลำดับ ทุกงานอ้าง FR/AC ยังไม่เขียนโค้ด)

## วิธีเพิ่มเข้า template repo (แนะนำ ทำก่อนคาบ ทุกคนได้พร้อมกัน)

แตก zip นี้ลงในโฟลเดอร์ template ที่ push ไว้ (ไฟล์จะไปอยู่ในโฟลเดอร์ .github/prompts, .claude/commands, .cursor/commands ข้าง clarify กับ plan) แล้ว

```bash
git add -A
git commit -m "add /tasks"
git push
```

- repo ที่นักศึกษาสร้างจาก template **หลัง** push จะมี /tasks ทันที
- repo ทีมที่มีอยู่แล้ว: คำสั่ง curl ในหัวข้อ // 03 ของหน้าเว็บจะดึง /tasks มาด้วยเอง (ดึงจาก template repo เวอร์ชันล่าสุด)
- repo ที่สร้างจาก template **ก่อน** push (เช่น demo-swreqspec ของผู้สอน): รัน curl เดียวกันนั้น 1 ครั้ง

## วิธีใช้ในคาบ (ถ้าเวลาเหลือหลัง /plan)

1. ตรวจ plan.md ตาม Checklist หัวข้อ // 08 ให้เสร็จก่อน อย่าให้ AI แตกงานจาก plan ที่ยังผิด
2. พิมพ์ `/tasks specs/001-<feature>/spec.md`
3. ตรวจ 3 อย่าง
   - ตารางท้ายไฟล์: AC ทุกตัวมี task ตรวจ และ Constraint ทุกตัวมี task รองรับ (ไม่มีช่องว่าง)
   - task ที่เกี่ยวกับ Q-xx ต้องมีสถานะ "รอ Q-xx" ไม่ใช่เดาแล้วทำต่อ
   - ไม่มี task ที่ไม่มี FR รองรับ (AI ชอบแอบเพิ่ม "ตั้งค่า CI" "ทำหน้า login")
4. commit "tasks v1"
5. **ยังไม่ให้ AI เริ่มทำ task** สัปดาห์หน้าจะทำ implement พร้อมกันทั้งห้องด้วย Spec Kit ตัวจริง

## ถ้าจะพูดถึงในหน้าเว็บ

หน้า Week 05 ยังไม่มีหัวข้อ /tasks (ตั้งใจให้เป็นของสัปดาห์หน้า) ถ้าอยากใส่ ให้เพิ่มเป็นกล่องเล็กท้ายหัวข้อ // 08 ว่า "ทีมที่เสร็จก่อนเวลา ลอง /tasks ได้ ดูวิธีตรวจใน docs/README-tasks-pack.md" ไม่ต้องเพิ่มหัวข้อใหม่
