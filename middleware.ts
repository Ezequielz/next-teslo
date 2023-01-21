// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {


  
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    // console.log(session)
    const requestPage = req.nextUrl.pathname;

    if ( !session ){

      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.search = `p=${ requestPage }`;

      return NextResponse.redirect( url );
    }

    const validRoles = ['admin', 'super-user' , 'SEO'];


    if ( requestPage.includes('admin') && !validRoles.includes( session.user!.role ) ) {
      return new Response( JSON.stringify({ message: 'No autorizado' }),{
        status: 401,
        headers: {
          'Content-Type':'application/json'
        }
      })
    }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher:['/checkout/address', '/checkout/summary', '/admin/:path*']
}