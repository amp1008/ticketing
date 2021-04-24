import jwt from 'jsonwebtoken';

function generateToken (user: any) {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY || 'asdfgh');
}

function verifyToken (token: string) {
    return jwt.verify(token, process.env.JWT_KEY || 'asdfgh');
}

export { generateToken, verifyToken };