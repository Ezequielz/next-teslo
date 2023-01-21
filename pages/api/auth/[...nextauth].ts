import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { dbUsers } from "../../../database";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}


export default NextAuth({
  // Configure one or more authentication providers
  providers: [

    // ...add more providers here
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@gmail.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials, req) {

        console.log({credentials})

        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin'};
        
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password )

      }
    }),


    GithubProvider({
      clientId: process.env.GITHUB_ID  || '',
      clientSecret: process.env.GITHUB_SECRET  || '',
    }),

    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID || '' ,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ''
    // }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET|| ''
    })


  ],

  // Custom Pages

  pages:{
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, // 30d
    strategy: 'jwt',
    updateAge: 86400, // cada dia
  },

  // Callbacks  
  callbacks: {

    async jwt({ token, account, user }) {

      // console.log({token, account, user})
      if ( account ) {
        token.accessToken = account.access_token;

        switch ( account.type ) {

          case 'oauth':
            // crear usuario o verificar si existe en mi DB
            token.user =  await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' );
          break;

          case 'credentials':
            token.user = user
          break;
      
        }

      }

      return token;
    },

    async session({ session, token, user }) {

      // console.log({ session, token, user })
      
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;

    }
    
  }

});