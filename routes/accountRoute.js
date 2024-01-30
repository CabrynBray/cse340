// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

// Route to regester the account
router.post('/registration', utilities.handleErrors(accountController.registerAccount))

module.exports = router;