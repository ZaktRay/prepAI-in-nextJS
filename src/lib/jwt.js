import jwt from "jsonwebtoken"

export const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    )
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        return null
    }
}

