import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. Update Produk (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, deskripsi, harga } = body; // Sesuaikan dengan nama variabel di frontend

    await db.query(
      'UPDATE products SET nama = ?, deskripsi = ?, harga = ? WHERE id = ?',
      [nama, deskripsi || '', Number(harga), id]
    );

    return NextResponse.json({ message: 'Produk berhasil diperbarui!' });
  } catch (error: any) {
    console.error('ERROR PUT:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Hapus Produk (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Produk berhasil dihapus!' });
  } catch (error: any) {
    console.error('ERROR DELETE:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}