import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Get all departments
export async function GET() {
  try {
    const [departments]: any = await pool.query(
      'SELECT id_departement, name_departement, status FROM departement'
    );

    return NextResponse.json({
      message: 'Berhasil mengambil data departement',
      departments
    });

  } catch (error) {
    console.error('Get departments error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST - Create new department
export async function POST(req: Request) {
  try {
    const { name_departement, status } = await req.json();

    // Validate input
    if (!name_departement || status === undefined) {
      return NextResponse.json(
        { message: 'Nama departement dan status harus diisi' },
        { status: 400 }
      );
    }

    // Insert new department
    const [result]: any = await pool.query(
      'INSERT INTO departement (name_departement, status) VALUES (?, ?)',
      [name_departement, status]
    );

    return NextResponse.json({
      message: 'Berhasil menambah departement baru',
      id_departement: result.insertId,
      name_departement,
      status
    });

  } catch (error) {
    console.error('Create department error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT - Update department
export async function PUT(req: Request) {
  try {
    const { id_departement, name_departement, status } = await req.json();

    // Validate input
    if (!id_departement || !name_departement || status === undefined) {
      return NextResponse.json(
        { message: 'ID, nama departement dan status harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE departement SET 
        name_departement = ?,
        status = ?
      WHERE id_departement = ?`,
      [name_departement, status, id_departement]
    );

    return NextResponse.json({
      message: 'Berhasil mengupdate departement'
    });

  } catch (error) {
    console.error('Update department error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete department
export async function DELETE(req: Request) {
  try {
    const { id_departement } = await req.json();

    if (!id_departement) {
      return NextResponse.json(
        { message: 'ID departement harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM departement WHERE id_departement = ?',
      [id_departement]
    );

    return NextResponse.json({
      message: 'Berhasil menghapus departement'
    });

  } catch (error) {
    console.error('Delete department error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
