import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    return NextResponse.json({ 
      success: true, 
      message: 'Koneksi ke database Aiven BERHASIL!', 
      result: rows 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}