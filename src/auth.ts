import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "./models/user.model";
import connectDb from "./lib/db";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "jason@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "********",
        },
      },
      async authorize(credentials, request) {
        if (!credentials) {
          throw Error("missing credentails");
        }
        console.log(process.env.AUTH_GOOGLE_ID);
        console.log(process.env.AUTH_GOOGLE_SECRET);
        console.log(process.env.AUTH_SECRET);
        const email = credentials.email;
        const password = credentials.password as string;
        await connectDb();
        const user = await User.findOne({ email });
        if (!user) {
          throw Error("User does not exits");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw Error("incorrect Password");
        }
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        await connectDb();
        let dbuser = await User.findOne({ email: user.email });
        if (!dbuser) {
          dbuser = await User.create({
            name: user.name,
            email: user.email,
          });
        }
        user.id = dbuser._id;
        user.role = dbuser.role;
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        ((session.user.name = token.name),
          (session.user.id = token.id as string),
          (session.user.email = token.email as string),
          (session.user.role = token.role as string));
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});
