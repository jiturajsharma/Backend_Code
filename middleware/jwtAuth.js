const JWT = require('jsonwebtoken');
const jwtAuth = (req, res, next)=>{
    const token = (req.cookies && req.cookies.token) || null;
    if(!token){
        return res.status(400).json({
            success: false,
            Message: 'Not Authorized'
        })
    }
    try{
        const payload = JWT.verify(token, process.env.SECRET);
        req.user ={id: payload.id, email: playload.email}
        next();
    }catch(e){
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
    
}
module.exports = jwtAuth;