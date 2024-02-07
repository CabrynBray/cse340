// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

const addClassValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details with the detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Router for server error messages
router.get("/error", utilities.handleErrors(invController.buildError));



// Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement))

// Route to build add classification view
router.get("/addclassification", utilities.handleErrors(invController.buildAddClassification));

// Process the new classification data
router.post("/addclassification", utilities.handleErrors(invController.addClassification));

// Route to build add vehicle view
router.get("/addVehicle", utilities.handleErrors(invController.buildAddVehicle))

// Process the new vehicle data
router.post("/addVehicle", utilities.handleErrors(invController.addVehicle))


// Edit the Inventory Routes
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Update Inventory Information
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.post("/update/", utilities.handleErrors(invController.updateInventory))


module.exports = router;