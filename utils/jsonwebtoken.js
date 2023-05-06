import jwt from 'jsonwebtoken';


const generateToken = (id)=> {
    return jwt.sign({id}, proceess.env.JWT_SECRET,{
        expiresIn: '10d'
    });
}

export default generateToken;