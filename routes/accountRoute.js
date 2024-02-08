// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')



// Route to build the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))


// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))


// Route to regester the account
router.post(
    "/registration",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login", 
    regValidate.loginRules(), 
    regValidate.checkLoginData, 
    utilities.handleErrors(accountController.accountLogin)
  )


module.exports = router;