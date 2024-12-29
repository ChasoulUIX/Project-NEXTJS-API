import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Get all point rates
export async function GET() {
  try {
    const [pointRates]: any = await pool.query(
      'SELECT id_point_rate, point_rate, rate FROM point_rate'
    );

    return NextResponse.json({
      message: 'Berhasil mengambil data point rate',
      pointRates
    });

  } catch (error) {
    console.error('Get point rates error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST - Create new point rate
export async function POST(req: Request) {
  try {
    const { point_rate, rate } = await req.json();

    if (!point_rate || !rate) {
      return NextResponse.json(
        { message: 'Point rate dan rate harus diisi' },
        { status: 400 }
      );
    }

    const [result]: any = await pool.query(
      'INSERT INTO point_rate (point_rate, rate) VALUES (?, ?)',
      [point_rate, rate]
    );

    return NextResponse.json({
      message: 'Berhasil menambah point rate baru',
      id_point_rate: result.insertId,
      point_rate,
      rate
    });

  } catch (error) {
    console.error('Create point rate error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT - Update point rate
export async function PUT(req: Request) {
  try {
    const { id_point_rate, point_rate, rate } = await req.json();

    if (!id_point_rate || !point_rate || !rate) {
      return NextResponse.json(
        { message: 'ID, point rate, dan rate harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE point_rate SET 
        point_rate = ?,
        rate = ?
      WHERE id_point_rate = ?`,
      [point_rate, rate, id_point_rate]
    );

    return NextResponse.json({
      message: 'Berhasil mengupdate point rate'
    });

  } catch (error) {
    console.error('Update point rate error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete point rate
export async function DELETE(req: Request) {
  try {
    const { id_point_rate } = await req.json();

    if (!id_point_rate) {
      return NextResponse.json(
        { message: 'ID point rate harus diisi' },
        { status: 400 }
      );
    }

    await pool.query(
      'DELETE FROM point_rate WHERE id_point_rate = ?',
      [id_point_rate]
    );

    return NextResponse.json({
      message: 'Berhasil menghapus point rate'
    });

  } catch (error) {
    console.error('Delete point rate error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
