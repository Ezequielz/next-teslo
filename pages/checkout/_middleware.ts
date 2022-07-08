import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { jwt } from '../../utils';
import { jwtVerify } from 'jose';




export async function middleware( req: NextRequest ) {

    const { token = '' } = req.cookies;


    try {
        // await jwt.isValid(token);
        await jwtVerify(token, new TextEncoder().encode( process.env.JWT_SECRET_SEED ));
        return NextResponse.next();

    } catch (error) {

        const requestedPage = req.page.name
        return NextResponse.redirect(new URL( `/auth/login?p=${ requestedPage }`, req.url ));
    }


}