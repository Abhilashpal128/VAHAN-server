const express = require("express");
const bcrypt=require('bcryptjs')
require("./Connection");
const user = require("./Schema");
const cookies = require('cookie-parser');
const app = express();
app.use(cookies());

const PORT = process.env.PORT;

app.use(express.json());



app.post("/register", async (req, resp) => {
  const { fname, lname, contact, email, password, cpassword } = req.body;
  if (!fname || !lname || !contact || !email || !password || !cpassword) {
    resp.send("please enter all detail" );
  } else {
    if (password === cpassword) {
      const userExist = await user.findOne({ email: email });
      if (!userExist) {
        console.log(fname, email, contact, password);
        let data = new user(req.body);

        let token = await data.generateAuthToken();
        console.log(token);

        

        let result = await data.save();
        console.log(result);
        resp.status(201).json("data Saved successfully");
      } else {
        resp.send("user Alredy exists");
      }
    } else {
      resp.send( "Passwords are not matching" );
    }
  }
});


app.post('/login', async (req,resp)=>{
    const {email,password}=req.body;
     if(!email || !password){
        resp.status(422).json({ error: "please enter all detail" });
     }
     else{
        const userExist=await user.findOne({email:email});
        if(userExist){
            const isMatched= await bcrypt.compare(password,userExist.password)

            let token = await userExist.generateAuthToken();
              console.log(token);

              resp.cookie("jwtoken",token,{
                httpOnly:true
              })

            if(isMatched){
                resp.status(201).json("login successfully")
            }
            else{
                resp.send("invalid credentials");
            }
        }
        else{
            resp.send("invalid credentials")
        }
     }
})

// app.post('/forgetpass', async (req,resp)=>{
//   const {email,contact,rpsaaword}=req.body;
//   if(!email|| !contact){
//       resp.status(422).json({error:"ploease entr all detail"})
//   }
//   else{
//     const userExist=await user.findOne({email:email});
//     if(userExist){
//         if(contact===userExist.contact){
//           let data= await user.updateOne({email:email},{$set:{password:rpsaaword}});
//           await data.save();
//         }
//         else{
//           resp.status(422).json({error:"contact no is wrong"})
//         }
//     }
//     else{
//       resp.status(422).json({error:"user Not exists"})
//     }
//   }
  
// })

app.get('/about',(req,resp)=>{
     resp.send(req.rootUser);
})


app.listen(PORT, (req, resp) => {
  console.log(`server is running on ${PORT}`);
  
}),
  (err) => {
    console.log(err);
  };
