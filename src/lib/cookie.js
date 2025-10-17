'use server'
import { cookies } from "next/headers";

export const setCookie = async (token) => {
    const cookieStore = cookies();
    try {
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        return;
    }
    catch (err) {
        return err;
    }
}

export const getCookie = async () => {
    const cookieStore = cookies();
    console.log(cookieStore.get('token'))
    return cookieStore.get('token');
}

export const deleteCookie = async () => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'token',
        value: '',
        path: '/',
        maxAge: 0,
    });
}