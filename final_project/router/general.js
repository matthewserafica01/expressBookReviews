const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
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
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = JSON.stringify(books, null, 2);
  return res.status(200).send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const bookDetails = JSON.stringify(books[isbn], null, 2);
    return res.status(200).send(bookDetails);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
        matchingBooks.push({isbn, ...books[isbn]});
    }
  }

  if (matchingBooks.length > 0) {
    const response = JSON.stringify(matchingBooks, null, 2);
    return res.status(200).send(response);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
        matchingBooks.push({isbn, ...books[isbn]});
    }
   }

   if (matchingBooks.length > 0) {
    const response = JSON.stringify(matchingBooks, null, 2);
    return res.status(200).send(response);
   } else {
    return res.status(404).json({message: "No books found by this title"});
   }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    const reviews = JSON.stringify(books[isbn].reviews, null, 2);
    return res.status(200).send(reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
