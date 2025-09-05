import { Account, Profile, Session, DefaultSession, DefaultUser, AuthOptions, SessionStrategy } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDB from '../../../../utils/dbConnect';
import UserModel from '../../../../models/UserModel';

async function verifyCaptcha(token: string) {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    return await res.json();
}

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
                captcha: { label: 'Captcha', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password || !credentials?.captcha) {
                    throw new Error(
                        JSON.stringify({
                            field: !credentials.identifier ? 'email' : !credentials.password ? 'password' : 'captcha',
                            message: 'Please fill all fields',
                        })
                    );
                }

                const captchaRes = await verifyCaptcha(credentials.captcha);
                console.log('md-captchaRes: ', captchaRes);
                if (!captchaRes.success || captchaRes.score < 0.5) {
                    throw new Error(
                        JSON.stringify({
                            field: 'captcha',
                            message: 'Captcha verification failed',
                        })
                    );
                }

                await connectToDB();

                const userDoc = await UserModel.findOne({ email: credentials.identifier });
                if (!userDoc) {
                    throw new Error(
                        JSON.stringify({
                            field: 'email',
                            message: 'This account is not registered',
                        })
                    );
                }

                const user = userDoc.toObject();

                if (!user.isVerified) {
                    throw new Error(
                        JSON.stringify({
                            field: null,
                            message: 'Please verify your email',
                            email: user.email,
                            phone: user.phone,
                        })
                    );
                }

                const passwordMatches = await bcrypt.compare(credentials.password, user.password);
                if (!passwordMatches) {
                    throw new Error(
                        JSON.stringify({
                            field: ['email', 'password'],
                            message: 'Invalid credentials',
                        })
                    );
                }

                const incompleteFields = ['school', 'city', 'country', 'grade'].filter((field) => !user[field]);
                if (incompleteFields.length > 0) {
                    throw new Error(
                        JSON.stringify({
                            field: null,
                            message: 'Please Complete Your Profile To Log In.',
                            email: user.email,
                            phone: user.phone,
                        })
                    );
                }

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
        async signIn({ account }: { account: Account | null; profile?: Profile }) {
            if (account?.provider === 'credentials') return true;
            return false;
        },
        async jwt({ token, user }: { token: JWT; user?: any }) {
            if (user) token._id = user._id?.toString();
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            await connectToDB();
            if (token) {
                const sessionUser = await UserModel.findById(token._id).lean();
                if (sessionUser) {
                    (session.user as Session['user'])._id = sessionUser._id.toString();
                    session.user.email = sessionUser.email;
                    session.user.image = sessionUser.avatar;
                }
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt' as SessionStrategy,
    },
};
