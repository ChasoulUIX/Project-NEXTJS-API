import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    console.log('Received registration request:', { username, email });

    // Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Test koneksi database
    try {
      const [testConnection]: any = await pool.query('SELECT 1');
      console.log('Database connection successful:', testConnection);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw dbError;
    }

    // Cek apakah email sudah terdaftar
    const [existingUsers]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const [result]: any = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil',
        userId: result.insertId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 