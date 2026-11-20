const jwt= require('jsonwebtoken')

const authMiddleware=(req,res,next)=>{
    try {
        const authorization = req.headers.authorization;
        const bearerToken =
            typeof authorization === "string" && authorization.startsWith("Bearer ")
                ? authorization.slice(7)
                : null;
        const token = req.cookies?.token || bearerToken;
        if(!token){
            return res.status(401).json({error:"Authentication required"})
       }
               const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
               if (decoded.role !== "user") {
                   return res.status(403).json({ error: "User access required" });
               }
     req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
        
    }
}
module.exports= authMiddleware