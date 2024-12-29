import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Get all schedules
export async function GET() {
  try {
    const [schedules]: any = await pool.query(
      'SELECT * FROM schedule'
    );

    return NextResponse.json({
      message: 'Berhasil mengambil data schedule',
      schedules
    });

  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST - Create new schedule
export async function POST(req: Request) {
  try {
    const { name_schedule, date_schedule, status_schedule } = await req.json();

    // Validate input
    if (!name_schedule || !date_schedule || status_schedule === undefined) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Insert new schedule
    const [result]: any = await pool.query(
      'INSERT INTO schedule (name_schedule, date_schedule, status_schedule) VALUES (?, ?, ?)',
      [name_schedule, date_schedule, status_schedule]
    );

    return NextResponse.json({
      message: 'Berhasil menambah schedule baru',
      id_schedule: result.insertId,
      name_schedule,
      date_schedule,
      status_schedule
    });

  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT - Update schedule
export async function PUT(req: Request) {
  try {
    const { id_schedule, name_schedule, date_schedule, status_schedule } = await req.json();

    // Validate input
    if (!id_schedule || !name_schedule || !date_schedule || status_schedule === undefined) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE schedule SET 
        name_schedule = ?,
        date_schedule = ?,
        status_schedule = ?
      WHERE id_schedule = ?`,
      [name_schedule, date_schedule, status_schedule, id_schedule]
    );

    return NextResponse.json({
      message: 'Berhasil mengupdate schedule'
    });

  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete schedule
export async function DELETE(req: Request) {
  try {
    const { id_schedule } = await req.json();

    if (!id_schedule) {
      return NextResponse.json(
        { message: 'ID schedule harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM schedule WHERE id_schedule = ?',
      [id_schedule]
    );

    return NextResponse.json({
      message: 'Berhasil menghapus schedule'
    });

  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
