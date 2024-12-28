import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, nohp } = await req.json();

    // Validasi input
    if (!name || !nohp) {
      return NextResponse.json(
        { message: 'Name dan nohp harus diisi' },
        { status: 400 }
      );
    }

    // Cek user
    const [users]: any = await pool.query(
      'SELECT * FROM management WHERE name = ?',
      [name]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Name atau nohp salah' },
        { status: 400 }
      );
    }

    const user = users[0];

    // Verifikasi nohp
    if (user.nohp !== nohp) {
      return NextResponse.json(
        { message: 'Name atau nohp salah' },
        { status: 400 }
      );
    }

    // Buat JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        name: user.name 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        nohp: user.nohp
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Ambil semua data users
    const [users]: any = await pool.query(
      'SELECT id, name, nohp FROM management'
    );

    return NextResponse.json({
      message: 'Berhasil mengambil data users',
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 