import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!process.env.CLASSROOM_PASSWORD) {
    return NextResponse.json({ error: 'CLASSROOM_PASSWORD is missing in env.' }, { status: 500 });
  }

  if (password !== process.env.CLASSROOM_PASSWORD) {
    clearAuthCookie();
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  setAuthCookie();
  return NextResponse.json({ ok: true });
}
