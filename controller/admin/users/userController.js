const User = require("../../../models/userModel");

exports.getUsers = async(req,res)=>{
    try{

        const users = await User.find()
        if(users.length<1){
            res.status(404).json({
                message:"no users found",
                userData:[]
            })
        }else{
            res.status(200).json({
                message:"users found",
                userData:users
            })
        }
    }catch(e){
        res.status(400).json({
            message:"an error occured"
        })
        console.log(e)
    }
}