// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details with the detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Router for server error messages
router.get("/error", invController.buildError);



// Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement))

// Route to build add classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));

// Process the new classification data
router.post("/addClassification", utilities.handleErrors(invController.registerClassification));

// Route to build add vehicle view
router.get("/addVehicle", utilities.handleErrors(invController.buildAddVehicle))

// Process the new vehicle data
router.post("/addVehicle", utilities.handleErrors(invController.registerVehicle))


module.exports = router;