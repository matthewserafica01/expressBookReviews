const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { isValid, users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.session.authorization && req.session.authorization.accessToken;

    if (!token) {
        return res.status(403).json({message: "User not logged in"});
    }

    jwt.verify(token, "access", (err, user) => {
        if (err) return res.status(403).json({message: "Invalid token"});

        req.user = user;
        next();
    });
});

app.post("/register", (req, res) => {
    const {username, password} = req.body;

    if (!isValid(username)) {
        return res.status(400).json({message: "Invalid username"});
    }

    const userExists = users.some((u) => u.username === username);

    if (userExists) {
        return res.status(400).json({message: "User already exists"});
    }

    users.push({username, password});
    res.status(201).json({message: "User registered successfully"});
})
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
