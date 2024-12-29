import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Get all information
export async function GET() {
  try {
    const [information]: any = await pool.query(
      'SELECT id_information, name_info, info, date_info, status_info FROM information'
    );

    return NextResponse.json({
      message: 'Berhasil mengambil data information',
      information
    });

  } catch (error) {
    console.error('Get information error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST - Create new information
export async function POST(req: Request) {
  try {
    const { name_info, info, date_info, status_info } = await req.json();

    // Validate input
    if (!name_info || !info || !date_info || status_info === undefined) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Insert new information
    const [result]: any = await pool.query(
      'INSERT INTO information (name_info, info, date_info, status_info) VALUES (?, ?, ?, ?)',
      [name_info, info, date_info, status_info]
    );

    return NextResponse.json({
      message: 'Berhasil menambah information baru',
      id_information: result.insertId,
      name_info,
      info,
      date_info,
      status_info
    });

  } catch (error) {
    console.error('Create information error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT - Update information
export async function PUT(req: Request) {
  try {
    const { id_information, name_info, info, date_info, status_info } = await req.json();

    // Validate input
    if (!id_information || !name_info || !info || !date_info || status_info === undefined) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE information SET 
        name_info = ?,
        info = ?,
        date_info = ?,
        status_info = ?
      WHERE id_information = ?`,
      [name_info, info, date_info, status_info, id_information]
    );

    return NextResponse.json({
      message: 'Berhasil mengupdate information'
    });

  } catch (error) {
    console.error('Update information error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete information
export async function DELETE(req: Request) {
  try {
    const { id_information } = await req.json();

    if (!id_information) {
      return NextResponse.json(
        { message: 'ID information harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM information WHERE id_information = ?',
      [id_information]
    );

    return NextResponse.json({
      message: 'Berhasil menghapus information'
    });

  } catch (error) {
    console.error('Delete information error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
