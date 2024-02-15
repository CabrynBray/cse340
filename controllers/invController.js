const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}



/* ***************************
 *  Build inventory by vehicle info view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventory_id
  const data = await invModel.getDetailsByInventoryId(inventory_id)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const year = data[0].inv_year
  const model = data[0].inv_model
  const make = data[0].inv_make
  res.render("./inventory/inv-details", {
    title: year + " " + make + " " + model,
    nav,
    grid,
  })
}


/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classification = await utilities.selectList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classification,
  })
}



/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const addClassificationResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()
  
  if (addClassificationResult){
    req.flash(
      "notice",
      `Congratulations, you\'ve entered ${classification_name}`
    )
    res.status(201).render("inventory/management", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }else{
    req.flash("notice", "Sorry, adding classification failed.")
    res.status(501).render("inventory/addClassification",
    {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build add vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let selectList = await utilities.selectList()
  res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      selectList,
      errors: null,
  })
}


/* ****************************************
*  Process New Classification
* *************************************** */
invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const regResult = await invModel.addInventory(
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color
  )

  if (regResult) {
      req.flash(
          "notice",
          `The ${inv_make} ${inv_model} was successfully added.`
      )
      let selectList = await utilities.selectList()
      res.status(201).render("./inventory/management", {
          title: "Vehicle Management",
          selectList,
          nav,
      })
  } else {
      req.flash(
          "notice",
          "Sorry, the registration failed."
      )
      res.status(501).render("./inventory/add-inventory", {
          title: "Add Vehicle",
          nav,
      })
  }
} 


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailsByInventoryId(inv_id)
  const classificationSelect = await utilities.selectList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {

    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id

  })

}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.selectList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailsByInventoryId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
})
}

/* ***************************
 *  delete inventory data
 * ************************** */

invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `The delete was successful.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/delete/{inv_id}")
  }
}


/* ***************************
 *  Build error page
 * ************************** */
invCont.buildError = function (req, res, next) {
  throw {message:"Error"}
  }


module.exports = invCont