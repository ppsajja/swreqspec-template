# agent-pack สำหรับ repo <ทีม>-swreqspec

ชุดไฟล์นี้ทำให้ Copilot, Claude Code และ Cursor มีคำสั่ง `/clarify` และ `/plan` เหมือนกัน
ไม่ต้องติดตั้งโปรแกรมเพิ่ม แค่วางไฟล์ลง repo แล้ว commit

## ไฟล์ในชุด

| ไฟล์ | ใครอ่าน | ทำอะไร |
|---|---|---|
| `AGENTS.md` | Copilot, Cursor | กติกาของโปรเจกต์ AI อ่านเองทุกครั้ง |
| `CLAUDE.md` | Claude Code | ชี้ไปที่ AGENTS.md |
| `.github/prompts/clarify.prompt.md`, `plan.prompt.md` | Copilot | คำสั่ง /clarify และ /plan |
| `.claude/commands/clarify.md`, `plan.md` | Claude Code | คำสั่ง /clarify และ /plan |
| `.cursor/commands/clarify.md`, `plan.md` | Cursor | คำสั่ง /clarify และ /plan |
| `.devcontainer/devcontainer.json` | Codespaces | เปิด Copilot Chat ให้อัตโนมัติเมื่อสร้าง Codespace ใหม่ |
| `docs/prompt-log-template.md` | ทีม | แบบฟอร์มบันทึกการใช้ AI |

เนื้อหาคำสั่งทั้ง 3 เครื่องมือเหมือนกันทุกตัวอักษร ต่างกันแค่โฟลเดอร์ที่วาง

## วิธีติดตั้ง (ทำครั้งเดียวต่อทีม)

เปิด terminal ที่ root ของ repo แล้วรัน

```bash
curl -sL https://github.com/ppsajja/swreqspec-template/archive/refs/heads/main.tar.gz | tar xz --strip-components=1 --exclude='*/specs' --exclude='*/specs/*' --exclude='*/README.md' --exclude='*/.gitignore'
git add -A
git commit -m "add agent-pack"
git push
```

(repo ที่สร้างจาก template ของรายวิชามีชุดนี้อยู่แล้ว ไม่ต้องรัน)

เสร็จแล้วเพื่อนในทีมแค่ `git pull` หรือเปิด Codespace ใหม่ ก็ได้คำสั่งเหมือนกัน

## วิธีใช้

1. เปิดแชตของเครื่องมือที่ใช้ (Copilot Chat ต้องเป็นโหมด **Agent**)
2. พิมพ์ `/clarify specs/001-<feature>/spec.md`
3. อ่านคำถาม ตอบในแชต (ตอบไม่ได้ให้บอกว่า "ไม่รู้ ต้องถาม...")
4. AI แก้ spec.md เป็น v2 และเขียน prompt-log.md ให้ ตรวจ diff แล้ว commit ว่า `spec v2`
5. พิมพ์ `/plan` ได้ plan.md ตรวจตารางข้อ 5 (Constraints) แล้ว commit

## ถ้าเครื่องมือใช้ไม่ได้

เปิดไฟล์ `.github/prompts/clarify.prompt.md` คัดลอกเนื้อหาทั้งหมด วางในแชต AI ตัวไหนก็ได้
ตามด้วยเนื้อหา spec.md ของทีม จะได้คำถามแบบเดียวกัน แล้วแก้ spec.md เอง
