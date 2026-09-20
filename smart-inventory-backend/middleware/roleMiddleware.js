const requireRole = (...allowedRoles) =>{
    return (req , res , next) =>{
           if(!req.user || !req.user.role) 
           {
            return res.status(401).json({
                success : false ,
                message: "Unauthorized: No user information found",
            })
           }

            if(!allowedRoles.includes(req.user.role)){
                  return res.status(403).json({
                      success : false ,
                      message: `
                        Forbidden Requires one of the following roles : 
                        ${allowedRoles.json(", ")}
                      `
                  });
            }

           next();
    }
} ;

module.exports = {
     requireRole
}