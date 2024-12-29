import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Ambil data dari tabel aspect
    const [aspects]: any = await pool.query(
      'SELECT id_aspect, name_aspect FROM aspect'
    );

    return NextResponse.json({
      message: 'Berhasil mengambil data aspect',
      aspects
    });

  } catch (error) {
    console.error('Get aspects error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name_aspect } = await req.json();

    // Validasi input
    if (!name_aspect) {
      return NextResponse.json(
        { message: 'Nama aspect harus diisi' },
        { status: 400 }
      );
    }

    // Insert data aspect baru
    const [result]: any = await pool.query(
      'INSERT INTO aspect (name_aspect) VALUES (?)',
      [name_aspect]
    );

    return NextResponse.json({
      message: 'Berhasil menambah aspect baru',
      id_aspect: result.insertId,
      name_aspect
    });

  } catch (error) {
    console.error('Create aspect error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id_aspect, name_aspect } = await req.json();

    // Validasi input
    if (!id_aspect || !name_aspect) {
      return NextResponse.json(
        { message: 'ID dan nama aspect harus diisi' },
        { status: 400 }
      );
    }

    // Update data aspect
    const [result]: any = await pool.query(
      'UPDATE aspect SET name_aspect = ? WHERE id_aspect = ?',
      [name_aspect, id_aspect]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Aspect tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Berhasil mengupdate aspect',
      id_aspect,
      name_aspect
    });

  } catch (error) {
    console.error('Update aspect error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id_aspect = searchParams.get('id_aspect');

    if (!id_aspect) {
      return NextResponse.json(
        { message: 'ID aspect harus diisi' },
        { status: 400 }
      );
    }

    // Delete data aspect
    const [result]: any = await pool.query(
      'DELETE FROM aspect WHERE id_aspect = ?',
      [id_aspect]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Aspect tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Berhasil menghapus aspect',
      id_aspect
    });

  } catch (error) {
    console.error('Delete aspect error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
