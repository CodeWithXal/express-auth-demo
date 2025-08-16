const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "";  // don't share this
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


//function to create arandom token
const crypto = require("crypto");

function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}



const users = [];   //array to store users


//signup function
function signup_handler(req, res){

    const username = req.body.username;
    const password = req.body.password;

    if(users.find(u => u.username === username)){
        res.json({
            message : "User already exists"
        });

        return;
    }

    users.push({
        username : username,
        password : password

    })

    console.log(users);   //logs user and password 

    res.json({
        message : "You are signed up"
    });

    

}


//signin function
function signin_handler(req, res){

    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(function(u){
        if(u.username === username && u.password === password){
            return true;
        }
        else{
            return false;
        }
    })

    if(user){
        const token = jwt.sign({
            username: username
        }, JWT_SECRET); // converts the username to jwt

        // user.token = token;   DON'T NEED TO STORE IT IN DB

        console.log(users);  //logs username and password with token

        res.json({
            token : token
        });
    }

    else{
        res.status(403).send({
            message : "Invalid Username or Password"
        })
    }

}


function my_info(req, res){
    const token = req.get("Authorization"); // sends jwt
    const decodedInformtion = jwt.verify(token, JWT_SECRET); // CONVERTS JWT TO USERNAME
    const username = decodedInformtion.username;

    
    const user = users.find(function(u){
        if(u.username === username){
            return true;

        }

    })

    if(user){
        res.json({
            username : user.username,
            password : user.password
        });
    }

    else{
        res.json({
            message : "Token invalid"
        });
    }


}


// // Serve signup page
// app.get("/signup", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "signup.html"));
// });

// // Serve signin page
// app.get("/signin", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "signin.html"));
// });

// // Serve me page
// app.get("/me", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "me.html"));
// });

// // serves auth
// app.get("/auth", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "auth.html"));
// });



app.post("/signin", signin_handler);
app.post("/signup", signup_handler);
app.get("/me", my_info);





app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
})