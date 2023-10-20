const jwt=require('jsonwebtoken');
const user=require('../Schema');
const cookieParser=require('cookie-parser');


const auth= async (req,resp,next)=>{
    try {
        const token=req.cookies.jwtoken;
       if(token===undefined){
         throw new console.error("errror");
       }
       else{
        const verifyToken=  jwt.verify(token,process.env.SECRET_KEY);
        rootUser= await user.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!rootUser){throw new error("user Not found");}

        req.rootUser=rootUser
        next();
       }
       
    } catch (error) {
        console.log(error);
    }
}

module.exports=auth;