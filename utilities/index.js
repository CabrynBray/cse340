const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
* Build the inventory view HTML
 **************************************** */
Util.buildDetailGrid = async function(data){
  let grid
  if(data.length > 0) {
    grid = '<div id="detail-grid">'
    data.forEach(vehicle => {
    //   grid += "<h1>" + vehicle.inv_model + "</h1>"
      grid += "<img src=" + vehicle.inv_image + " alt=\"Image of " + vehicle.inv_make + " " + vehicle.inv_model + " on CSE Motors\" />"
      grid += "<table>"
      grid += "<tr>"
      grid += "<td>Color:</td>"
      grid += "<td>" + vehicle.inv_color + "</td>"
      grid += "</tr>"
      grid += "<tr>"
      grid += "<td>Mileage:</td>"
      grid += "<td>" + new Intl.NumberFormat("en-US").format(vehicle.inv_miles) + "</td>"
      grid += "</tr>"
      grid += "<tr>"
      grid += "<td>Description:</td>"
      grid += "<td>" + vehicle.inv_description + "</td>"
      grid += "</tr>"
      grid += "<tr>"
      grid += "<td>Price:</td>"
      grid += "<td>$" + new Intl.NumberFormat("en-US").format(vehicle.inv_price) + "</td>"
      grid += "</tr>"
      grid += "</table>"
    })
    grid += "</div>"
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* **************************************
* Build a dynamic drop-down select list
* ************************************ */
Util.selectList = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<label class="lbl-properties">Classification: '
  list += '<select class="lbl-properties" id="classification_id" name="classification_id" required>'
  list += '<option value="">Choose a classification</option>'
  data.rows.forEach((row) => {
      list += '<option value="' + row.classification_id
      list += '">' + row.classification_name + '</option>'
  })
  list += '</select>'
  list += '</label>'
  return list
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
* Middleware to check employee or admin for management view/process access
**************************************** */
Util.checkManagment = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type == "Employee" || req.locals.accountData.account_type == "Admin")) {
    next ()
  } else {
    if (!res.locals.loggedin) {
      req.flash('notice', `Please log in.`)
      return res.redirect("/account/login")
    } else {       
      return res.redirect('/')
    }
  }
}

Util.checkManagmentLogin = (isLoggedIn, accountType) => {
  let managementGrid
  
  if (isLoggedIn && (accountType === "Admin" || accountType === "Employee")) {
    managementGrid = '<h2> Inventory Management </h2>'
    managementGrid += '<a id="inv-management-button" href="../../inv/" title="Inventory Management View "><h3>Manage Inventory</h3></a>'
  }else{
    managementGrid = ''
  }
  return managementGrid
}

 
 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}


/* ****************************************
 *  build the account view to include the reviews
 * ************************************ */
Util.buildAccountReviewsGrid = async function(data) {
  let grid = ""
  if (data.length > 0 ) {
    for (const review of data) {
      const accountData = await accountModel.getAccountById(review.account_id);
      const screen_name = accountData.account_firstname + " " + accountData.account_lastname;

      grid += "<table>";
      grid += "<tr>";
      grid += "<td>" + screen_name + ":</td>";
      grid += "</tr>";
      grid += "<tr>";
      grid += "<td>" + review.review_text + "</td>";
      grid += "</tr>";
      grid += "<tr>";
      grid += "<td>" + review.review_date + "</td>";
      grid += "</tr>";
      grid += "<tr>";
      grid += "<td><a href=\"/account/update-review/" + review.review_id + "\">Update Review</a> <a href=\"/account/delete-review/" + review.review_id + "\">Delete Review</a></td>";
      grid += "</tr>";
      grid += "</table>";
    }
    grid += " "
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* ****************************************
 *  build the view to include the reviews to the inv details view
 * ************************************ */
Util.invReviewsGrid = async function(data){
  let grid = ""
  if (data.length > 0) {
    for (const review of data) {
      const accountData = await accountModel.getAccountById(review.account_id);
      const screen_name = accountData.account_firstname + " " + accountData.account_lastname;
      
      grid += "<table>";
      grid += "<tr>";
      grid += "<td>" + screen_name + ":</td>";
      grid += "</tr>";
      grid += "<tr>";
      grid += "<td>" + review.review_text + "</td>";
      grid += "</tr>";
      grid += "<tr>";
      grid += "<td>" + review.review_date + "</td>";
      grid += "</tr>";
      grid += "</table>";
    }
    grid += "</section>"
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

module.exports = Util