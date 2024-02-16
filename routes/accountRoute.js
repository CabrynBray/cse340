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


  // routes to edit and change account info
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.accountUpdateView))
router.post("/update",  regValidate.updateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccountSuccess))
router.post("/change", regValidate.updatePasswordRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updatePassword))

// route to log out
router.get("/logout",  utilities.checkLogin, utilities.handleErrors(accountController.logout))

// routes to update and delete the review info
router.get("/update-review/:review_id", utilities.checkLogin, utilities.handleErrors(accountController.updateReview));
router.post("/update-review/:review_id", utilities.checkLogin, utilities.handleErrors(accountController.processUpdateReview));
router.get("/delete-review/:review_id", utilities.checkLogin, utilities.handleErrors(accountController.deleteReview));
router.post("/delete-review/:review_id", utilities.checkLogin, utilities.handleErrors(accountController.processDeleteReview));


module.exports = router;