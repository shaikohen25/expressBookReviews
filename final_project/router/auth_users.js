const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get the ISBN from the URL parameters
    const { review } = req.body; // Get the review text from the request body
    const username = req.session.username; // Get the username from the session
  
    if (!username) {
      return res.status(401).json({ message: "User is not logged in" });
    }
  
    if (!review || review.trim().length === 0) {
      return res.status(400).json({ message: "Review cannot be empty" });
    }
  
    // Assuming `bookReviews` is an object where keys are ISBNs and values are arrays of reviews
    // Each review has a `username` and `review` text
    const bookReviews = getBookReviews(); // This should fetch the current reviews data from the database
  
    if (!bookReviews[isbn]) {
      // If no reviews for the book yet, initialize an empty array for reviews
      bookReviews[isbn] = [];
    }
  
    // Check if the user has already posted a review for the given ISBN
    const existingReviewIndex = bookReviews[isbn].findIndex((rev) => rev.username === username);
  
    if (existingReviewIndex !== -1) {
      // If a review already exists, update it
      bookReviews[isbn][existingReviewIndex].review = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // If no review exists for this user, add a new review
      bookReviews[isbn].push({ username, review });
      return res.status(201).json({ message: "Review added successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get the ISBN from the URL parameters
    const username = req.session.username; // Get the username from the session
  
    if (!username) {
        return res.status(401).json({ message: "User is not logged in" });
    }

    // Assuming `bookReviews` is an object where keys are ISBNs and values are arrays of reviews
    // Each review has a `username` and `review` text
    const bookReviews = getBookReviews(); // This should fetch the current reviews data from the database
  
    if (!bookReviews[isbn]) {
        return res.status(404).json({ message: "No reviews found for this ISBN" });
    }

    // Filter reviews to only keep reviews that don't belong to the current user
    const filteredReviews = bookReviews[isbn].filter((rev) => rev.username !== username);
  
    if (filteredReviews.length === bookReviews[isbn].length) {
        // If the length doesn't change, it means the user hasn't posted a review for this ISBN
        return res.status(404).json({ message: "Review not found for this ISBN" });
    }

    // Update the book reviews with the filtered reviews
    bookReviews[isbn] = filteredReviews;
  
    return res.status(200).json({ message: "Review deleted successfully" });
});  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
