import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-resourceos-key');

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('resourceos_auth')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const verified = await jwtVerify(token, SECRET);
    const role = verified.payload.role as string;
    const pathname = request.nextUrl.pathname;

    if (isLoginPage) {
      // If already logged in, route them based on role
      if (role === 'VOLUNTEER') return NextResponse.redirect(new URL('/my-tasks', request.url));
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Role-based restrictions
    if (role === 'VOLUNTEER') {
      // Volunteers can only access their tasks and perhaps report an issue
      const allowedVolunteerRoutes = ['/my-tasks', '/report'];
      if (!allowedVolunteerRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/my-tasks', request.url));
      }
    } else if (role === 'ADMIN') {
      // Admins should not really see /my-tasks, but it's fine.
      if (pathname === '/my-tasks') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid token
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
