const express = require("express");
const bcrypt = require("bcryptjs");
require("./Connection");
const cors = require("cors");
const user = require("./Schema");
const cookies = require("cookie-parser");
const auth = require("./middleware/auth");
const app = express();
app.use(cookies());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.post("/register", async (req, resp) => {
  const { fname, lname, contact, email, password, cpassword } = req.body;
  if (!fname || !lname || !contact || !email || !password || !cpassword) {
    resp.send("please enter all detail");
  } else {
    if (password === cpassword) {
      const userExist = await user.findOne({ email: email });
      if (!userExist) {
        console.log(fname, email, contact, password);
        const data = new user(req.body);

        // let token = await data.generateAuthToken();
        // console.log(token);

        let result = await data.save();
        console.log(result);
        resp.status(201).json("data Saved successfully");
      } else {
        resp.send("user Alredy exists");
      }
    } else {
      resp.send("Passwords are not matching");
    }
  }
});

app.post("/login", async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp.json({ status: 404, message: "Please enter all Detail" });
    }
    const userExist = await user.findOne({ email: email });
    if (userExist) {
      const isMatched = await bcrypt.compare(password, userExist.password);

      if (isMatched) {
        const token = await userExist.generateAuthToken();
        // let token = await userExist.tokens[0].token;
        console.log(token);

        resp.cookie("jwtoken", token, {
          httpOnly: true,
        });
        const result = { token, userExist };
        return resp.status(200).json({ status: 200, result });
      } else {
        return resp.status(422).json({ status: 422, result: "Invalid" });
      }
    } else {
      return resp.json({ status: 422, result: "not found" });
    }
  } catch (error) {
    return resp.json({ status: 422, result: error });
  }
});

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

// app.get("/about", (req, resp) => {
//   resp.send(req.rootUser);
// });
app.get("/validateUser", auth, async (req, resp) => {
  try {
    const validateUser = await user.findOne({ _id: req.user_id });
    resp.status(200).json({ success: true, message: "Authenticated" });
  } catch (error) {
    resp.status(404).json({ success: false, message: error });
  }
});

app.listen(PORT, (req, resp) => {
  console.log(`server is running on ${PORT}`);
}),
  (err) => {
    console.log(err);
  };
