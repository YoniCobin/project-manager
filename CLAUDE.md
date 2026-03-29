# CLAUDE.md — Project Manager Dashboard

## מטרת הפרויקט
לוח ניהול פרויקטים לפרילנסר/סוכנות.
מאפשר מעקב אחר פרויקטים, משימות, לקוחות ו-deadlines.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (Auth + Database)
- TypeScript

## פיצ'רים
1. רשימת פרויקטים עם סטטוס (פעיל / הושלם / מושהה)
2. משימות לכל פרויקט עם checkbox
3. לקוחות מקושרים לפרויקט
4. תאריכי deadline עם התראה ויזואלית

## Supabase — טבלאות
- clients: id, name, email, phone
- projects: id, name, client_id, status, deadline
- tasks: id, project_id, title, done

## Coding Conventions
- TypeScript strict mode
- פונקציות קצרות, שמות ברורים
- כל fetch דרך lib/supabase.ts
- UI בעברית, קוד באנגלית

## פקודות
- npm run dev — שרת פיתוח
- npm run build — build לפרודקשן
