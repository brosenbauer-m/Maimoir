#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations");

function die(msg) { console.error(`\n❌ ${msg}\n`); process.exit(1); }
function slugify(input) {
  return String(input).trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80);
}
function parseTs(filename) {
  const m = path.basename(filename).match(/^(\d{14})_.+\.sql$/);
  return m ? Number(m[1]) : null;
}
function pad14(n) { const s = String(n); return s.length >= 14 ? s : "0".repeat(14 - s.length) + s; }
function utcNowTs14() {
  const d = new Date();
  return Number(`${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,"0")}${String(d.getUTCDate()).padStart(2,"0")}${String(d.getUTCHours()).padStart(2,"0")}${String(d.getUTCMinutes()).padStart(2,"0")}${String(d.getUTCSeconds()).padStart(2,"0")}`);
}

const rawName = process.argv.slice(2).join(" ").trim();
if (!rawName) die('Missing name. Example: npm run sb:migration "add_something"');
const name = slugify(rawName);
if (!name) die("Name became empty after slugify.");
if (!fs.existsSync(MIGRATIONS_DIR)) die(`Missing folder: ${MIGRATIONS_DIR}`);

const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith(".sql"));
const timestamps = files.map(parseTs).filter(x => typeof x === "number");
const maxTs = timestamps.length ? Math.max(...timestamps) : 0;
const nextTs = maxTs > 0 ? maxTs + 1 : utcNowTs14();
const filename = `${pad14(nextTs)}_${name}.sql`;
const fullPath = path.join(MIGRATIONS_DIR, filename);
if (fs.existsSync(fullPath)) die(`File already exists: ${filename}`);

fs.writeFileSync(fullPath, `-- Migration: ${name}\n-- Created: ${new Date().toISOString()}\n\nbegin;\n\n-- Write SQL here\n\ncommit;\n`, "utf8");
console.log(`✅ Created: supabase/migrations/${filename}`);