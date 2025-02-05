import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {

  const token = req.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); 
  }

  return NextResponse.redirect(new URL('/view/tasks', req.url)); 
}

export const config = {
  matcher: ['/'], 
};
