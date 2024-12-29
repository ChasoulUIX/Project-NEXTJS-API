import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Fetch all assessments
export async function GET() {
  try {
    const [assessments]: any = await pool.query(
      `SELECT id_assessment, year_academic, year_assessment, reg_id_student, 
      id_aspect_sub, id_coach, point, ket, date_assessment 
      FROM assessment`
    );

    return NextResponse.json({
      message: 'Berhasil mengambil data assessment',
      assessments
    });

  } catch (error) {
    console.error('Get assessments error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST - Create new assessment
export async function POST(req: Request) {
  try {
    const { 
      year_academic,
      year_assessment,
      reg_id_student,
      id_aspect_sub,
      id_coach,
      point,
      ket,
      date_assessment
    } = await req.json();

    // Validate required fields
    if (!year_academic || !year_assessment || !reg_id_student || 
        !id_aspect_sub || !id_coach || !point || !ket || !date_assessment) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Insert new assessment
    const [result]: any = await pool.query(
      `INSERT INTO assessment (
        year_academic, year_assessment, reg_id_student,
        id_aspect_sub, id_coach, point, ket, date_assessment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [year_academic, year_assessment, reg_id_student, 
       id_aspect_sub, id_coach, point, ket, date_assessment]
    );

    return NextResponse.json({
      message: 'Berhasil menambah assessment baru',
      id_assessment: result.insertId
    });

  } catch (error) {
    console.error('Create assessment error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT - Update assessment
export async function PUT(req: Request) {
  try {
    const {
      id_assessment,
      year_academic,
      year_assessment, 
      reg_id_student,
      id_aspect_sub,
      id_coach,
      point,
      ket,
      date_assessment
    } = await req.json();

    // Validate required fields
    if (!id_assessment || !year_academic || !year_assessment || !reg_id_student ||
        !id_aspect_sub || !id_coach || !point || !ket || !date_assessment) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Update assessment
    await pool.query(
      `UPDATE assessment SET
        year_academic = ?,
        year_assessment = ?,
        reg_id_student = ?,
        id_aspect_sub = ?,
        id_coach = ?,
        point = ?,
        ket = ?,
        date_assessment = ?
      WHERE id_assessment = ?`,
      [year_academic, year_assessment, reg_id_student,
       id_aspect_sub, id_coach, point, ket, date_assessment,
       id_assessment]
    );

    return NextResponse.json({
      message: 'Berhasil mengupdate assessment'
    });

  } catch (error) {
    console.error('Update assessment error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete assessment
export async function DELETE(req: Request) {
  try {
    const { id_assessment } = await req.json();

    if (!id_assessment) {
      return NextResponse.json(
        { message: 'ID assessment harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM assessment WHERE id_assessment = ?',
      [id_assessment]
    );

    return NextResponse.json({
      message: 'Berhasil menghapus assessment'
    });

  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
