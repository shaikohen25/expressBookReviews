const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    })
    .then((bookList) => {
        res.send(JSON.stringify(bookList, null, 4)); // Send book list as formatted JSON
    })
    .catch((error) => {
        res.status(500).json({ message: "Error fetching books", error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = books[isbn]; // Find the book by ISBN
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    })
    .then((bookDetails) => {
        res.send(JSON.stringify(bookDetails, null, 4)); // Send book details as formatted JSON
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(book => book.author === author);
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("No books found by that author");
        }
    })
    .then((booksByAuthor) => {
        res.send(JSON.stringify(booksByAuthor, null, 4));
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        const bookByTitle = Object.values(books).find(book => book.title === title);
        if (bookByTitle) {
            resolve(bookByTitle);
        } else {
            reject("No book found with that title");
        }
    })
    .then((bookByTitle) => {
        res.send(JSON.stringify(bookByTitle, null, 4));
    })
    .catch((error) => {
        res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const reviews = books[isbn]?.reviews; // Access the reviews of the book with the given ISBN
  
    if (reviews) {
      res.send(JSON.stringify(reviews, null, 4)); // Send reviews as formatted JSON
    } else {
      res.status(404).json({ message: "No reviews found for this book" });
    }
  });

module.exports.general = public_users;
