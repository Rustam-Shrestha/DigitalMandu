// const webtoken = require("jsonwebtoken");

// // as i have single fucntion in a file i dont need to export the path to this file will do the work just fine
// const isUserAuthenticated = (req,res,next) => { 
//     //retrive token from the header named my user_auth_token or give it any name like auth only
//     const userToken = req.headers.user_auth_token;
//     // if we didnt find the token order user to send token
//     if(!userToken){
//         return res.status(401).json({message: "Please provide a valid token"})
//     }
//     webtoken.verify(userToken,process.env.SECRET_KEY,(err,success)=>{
    //         if(err){
        //             return res.status(401).json({message: "Invalid token"})
        //         }else{
            //             // if token is valid then we can use the user id to check if user is authenticated or
            //             // we can use the user id to get the user details from the database
//             res.status(200).json({message:"right token"})
//             // next();
//         }
//     })
// }
// module.exports=isUserAuthenticated;



const webtoken = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
// Promisify the verify function
const verifyToken = promisify(webtoken.verify);

const isUserAuthenticated = async (req, res, next) => {
        // Retrieve token from the header named user_auth_token
        const userToken = req.headers.user_auth_token;
        
        // if we didnt find the token order user to send token
        if(!userToken){
            return res.status(401).json({message: "Please provide a valid token"})
        }
        try {
            
            // using promise method for decodingthe jwt token
            const decodedToken = await promisify(webtoken.verify)(userToken,process.env.SECRET_KEY)
            //if the decodedTOken cannot be decoded then report user not to do that 
            if(!decodedToken){
                return res.status(401).json({message: "Invalid token"})
            }
            // check if the token decoded the id matches with _id in mongodb and it has the role:admin otherwidse revoke
            //because the decodedToken has id as its object for id and mongodb has stored it default as _id
            const authorizedUser = await User.findOne({ _id: decodedToken.id})
            if(!authorizedUser){
                return res.status(401).json({message: "You are not authorized to access this route"})
            }
            // we assume that this is authorized tuser just because its id is availabe in our db next 
            // verification of the user being admin or not will be handled with another middleware 
            req.user = authorizedUser;
            next();
        } catch (error) {
            // report the error
            console.error(error);
        }

    
};

module.exports = isUserAuthenticated;
