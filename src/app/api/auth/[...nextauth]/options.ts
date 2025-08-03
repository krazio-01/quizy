import { Account, Profile, Session, User, DefaultSession, DefaultUser, AuthOptions, SessionStrategy } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDB from '../../../../utils/dbConnect';
import UserModel from '../../../../models/UserModel';

declare module 'next-auth' {
    interface Session {
        user: {
            _id: string;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        _id: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) throw new Error('Please fill all fields');

                // connect to the database
                await connectToDB();

                const userDoc = await UserModel.findOne({ email: credentials?.identifier });

                if (!userDoc) throw new Error('This account is not registered');

                const user = userDoc.toObject();

                if (!user.isVerified) throw new Error('Please verify your email');

                // Check password
                const passwordMatches = await bcrypt.compare(credentials.password, user.password);
                if (!passwordMatches) throw new Error('Invalid credentials');

                // Check if school details are missing
                const incompleteFields = ['school', 'city', 'country', 'grade'].filter((field) => !user[field]);

                if (incompleteFields.length > 0) throw new Error('Please Complete Your Profile To Log In.');

                return {
                    id: user._id.toString(),
                    _id: user._id.toString(),
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }: { account: Account | null; profile?: Profile | undefined }) {
            if (account?.provider === 'credentials') {
                return true;
            }

            return false;
        },
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) token._id = user._id?.toString();
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            await connectToDB();

            if (token) {
                const sessionUser = await UserModel.findOne({
                    email: session.user.email,
                });
                if (sessionUser) (session.user as Session['user'])._id = sessionUser._id.toString();
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt' as SessionStrategy,
    },
};
