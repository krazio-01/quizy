import fs from 'fs';
import { cookies } from 'next/headers';

export const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
};

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const generateMailTemplate = (file: string, replacements: Record<string, string>) => {
    let template = fs.readFileSync(file, 'utf8');
    Object.entries(replacements).forEach(([key, value]) => {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return template;
};

export const setCookie = async (
    name: string,
    value: string,
    options: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        path?: string;
        maxAge?: number;
    } = {}
) => {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
        httpOnly: options.httpOnly ?? true,
        secure: options.secure ?? process.env.NODE_ENV === 'production',
        sameSite: options.sameSite ?? 'strict',
        path: options.path ?? '/',
        maxAge: options.maxAge ?? 60 * 15, // default 15 min
    });
};

export const removeCookie = async (name: string) => {
    const cookieStore = await cookies();
    cookieStore.set(name, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0, // expires immediately
    });
};
