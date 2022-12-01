// Create User Routes
import express from "express";
import { addPet, getAllPets, getPetById, updatePet, deletePet, getPetBySharedBy } from "../controllers/PetController.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

// PUBLIC ROUTES
// @desc    Add a new food
// @route   POST /api/food/add
// @access  Public

router.route("/add").post(addPet);



// @desc    Update a food
// @route   PUT /api/food/update
// @access  Public

router.route("/update").post(updatePet);

//@desc    Get all food
// @route   GET /api/food/get
// @access  Public

//@dec getfoodbysharedby
// @route   GET /api/food/getfoodbysharedby
// @access  Public

router.route("/getfoodbysharedby/:food_shared_by").get(getPetBySharedBy);


// @desc    delete food
// @route   DELETE http://localhost:8000/api/food/delete/:id
// @access  Public

router.route("/delete/:_id").delete(deletePet);

// // @desc    Getfoodbytype
// // @route   GET /api/food/getfoodbytype
// // @access  Public

// router.route("/getfoodbytype/:is_free").get(get);

router.route("/getall").get(getAllPets);

//@desc  Getfoodforcharitableorganization
// @route   GET /api/food/getfoodforcharitableorganization
// @access  Public
// router.route("/getfoodforcharitableorganization/:food_quantity/:is_free").get(getFoodForCharitableOrganization);

export default router;