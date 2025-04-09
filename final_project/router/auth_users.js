const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return username && typeof username === "string";
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and Password are required"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid Credentials"});
  }

  let accessToken = jwt.sign({username}, "access", {expiresIn: "1h"});
  req.session.authorization = { accessToken};

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body;
  const username = req.user.username;

  if (books[isbn]) {
    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added", reviews: books[isbn].reviews});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (books[isbn]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review deleted successfully"})
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
