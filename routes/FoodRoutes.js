// Create User Routes
import express from "express";
import {searchFoodByName, addFood, updateFood, deleteFood,getAllFood,getFoodForCharitableOrganization, getFoodBySharedBy, getFoodByType } from "../controllers/FoodController.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

// PUBLIC ROUTES
// @desc    Add a new food
// @route   POST /api/food/add
// @access  Public

router.route("/add").post(addFood);



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




// @desc    delete food
// @route   DELETE http://localhost:8000/api/food/delete/:id
// @access  Public

router.route("/delete/:_id").delete(deleteFood);

// @desc    Getfoodbytype
// @route   GET /api/food/getfoodbytype
// @access  Public

router.route("/getfoodbytype/:is_free").get(getFoodByType);

router.route("/getall").get(getAllFood);

//@desc  Getfoodforcharitableorganization
// @route   GET /api/food/getfoodforcharitableorganization
// @access  Public
router.route("/getfoodforcharitableorganization/:food_quantity/:is_free").get(getFoodForCharitableOrganization);

// @desc    Search food by name
// @route   GET /api/food/search/:food_name
// @access  Public

router.route("/search/:food_name").get(searchFoodByName);

export default router;