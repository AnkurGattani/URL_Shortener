const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
}

export { cookieOptions };