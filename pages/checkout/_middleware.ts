import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'
// import { jwt } from '../../utils';




export async function middleware( req: NextRequest ) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    console.log({ session });

    //  console.log(req.nextUrl)
    const { origin } = req.nextUrl
    
    if (!session) {
      const requestedPage = req.page.name
      return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`)
    }
   

    return NextResponse.next();
    // const { token = '' } = req.cookies;


    // try {
    //     // await jwt.isValid(token);
    //     await jwtVerify(token, new TextEncoder().encode( process.env.JWT_SECRET_SEED ));
    //     return NextResponse.next();

    // } catch (error) {

    //     const requestedPage = req.page.name
    //     return NextResponse.redirect(new URL( `/auth/login?p=${ requestedPage }`, req.url ));
    // }


}