import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./../../../utils/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { getSession } from "next-auth/react";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password, editName } = credentials;
        await dbConnect();
        const user = await User.findOne({ email });

        if (editName) {
          const { editName } = req.body;
          const session = await getSession({ req });
          if (!session.user) throw new Error("signIn required");
          return {
            _id: user._id,
            name: editName,
            email: user.email,
            image: "f",
            isAdmin: user.isAdmin,
          };
        }

        if (user && bcrypt.compareSync(password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: "f",
            isAdmin: user.isAdmin,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      //create User Token (id,isAdmin) form DB
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      //save user (id,isAdmin) token to session cookie
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
});
