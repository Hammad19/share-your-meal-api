// Create User Routes
import express from "express";
import { addFood, updateFood, deleteFood,getAllFood,getFoodForCharitableOrganization, getFoodBySharedBy } from "../controllers/FoodController.js";
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

//@dec getfoodbysharedby
// @route   GET /api/food/getfoodbysharedby
// @access  Public

router.route("/getfoodbysharedby/:food_shared_by").get(getFoodBySharedBy);



router.route("/getall").get(getAllFood);

//@desc  Getfoodforcharitableorganization
// @route   GET /api/food/getfoodforcharitableorganization
// @access  Public
router.route("/getfoodforcharitableorganization/:food_quantity/:is_free").get(getFoodForCharitableOrganization);

export default router;