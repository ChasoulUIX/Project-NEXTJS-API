import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, nohp} = await req.json();
    console.log('Received registration request:', { name, nohp });

    // Validasi input
    if (!name || !nohp) {
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
      'SELECT * FROM management WHERE name = ?',
      [name]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'name sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(nohp, 10);

    // Set default values
    const gender = 'L';
    const date_birth = new Date();
    const email = 'email@gmail.com';
    const id_departement = 1;
    const status = 1;

    // Simpan user baru dengan default values
    const [result]: any = await pool.query(
      'INSERT INTO management (name, nohp, gender, date_birth, email, id_departement, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, nohp, gender, date_birth, email, id_departement, status]
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