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

export const verifyToken = (token)=> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("this is decoded",decoded)
    return decoded;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}

