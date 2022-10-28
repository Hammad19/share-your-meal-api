// Create User Routes
import express from "express";
import { addFood, updateFood, deleteFood,getAllFood,getFoodForCharitableOrganization } from "../controllers/FoodController.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

// PUBLIC ROUTES
// @desc    Add a new food
// @route   POST /api/food/add
// @access  Public

router.route("/add").post(addFood);

// @desc    Delete a food
// @route   DELETE /api/food/delete
// @access  Public

router.route("/delete").post(deleteFood);

// @desc    Update a food
// @route   PUT /api/food/update
// @access  Public

router.route("/update").post(updateFood);

//@desc    Get all food
// @route   GET /api/food/get
// @access  Public

router.route("/getall").get(getAllFood);

//@desc  Getfoodforcharitableorganization
// @route   GET /api/food/getfoodforcharitableorganization
// @access  Public
router.route("/getfoodforcharitableorganization").get(getFoodForCharitableOrganization);

export default router;