const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

let userSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.generateAuthToken=async function(){
    try {
        let token= await jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }
};


userSchema.pre('save',async function(next){
    if(this.isModified('password')){
     this.password = await bcrypt.hash(this.password,12);
     this.cpassword = await bcrypt.hash(this.cpassword,12)
    }
    next();
})


const monmodel=mongoose.model("users",userSchema);

module.exports= monmodel;