import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Fungsi helper untuk memastikan tabel products selalu ada
async function ensureTableExists() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET: Ambil data
export async function GET() {
  try {
    await ensureTableExists();
    const [rows]: any = await db.query(
      'SELECT id, name AS nama, description AS deskripsi, price AS harga, created_at FROM products ORDER BY id DESC'
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('ERROR GET:', error);
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 });
  }
}

// POST: Simpan data
export async function POST(request: Request) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { nama, deskripsi, harga } = body;

    const [result]: any = await db.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [nama, deskripsi || '', Number(harga)]
    );

    return NextResponse.json({ message: 'Berhasil disimpan', result }, { status: 201 });
  } catch (error) {
    console.error('ERROR POST:', error);
    return NextResponse.json({ message: 'Gagal menyimpan ke database' }, { status: 500 });
  }
}