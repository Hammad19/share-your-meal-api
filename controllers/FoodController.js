// Create User Controller
import Food from "../models/Food.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc    Add a new food
// @route   POST http://localhost:8000/api/food/add
// @access  Public
export const addFood = async (req, res) => 
{
    const {food_name, food_description, food_price, food_image, food_category,food_quantity,food_shared_by, is_free} = req.body;
    try 
    {
        const food = await Food.create({
            food_name,
            food_description,
            food_price,
            food_image,
            food_category,
            food_quantity,
            food_shared_by,
            is_free,
            is_active: true,
            is_available: true,
        });
        if (food) 
        {
            res.status(200).json({
                message: "Food added successfully",
                success: true,
                food: {
                    id: food._id,
                    food_name: food.food_name,
                    food_description: food.food_description,
                    food_price: food.food_price,
                    food_image: food.food_image,
                    food_category: food.food_category,
                    food_quantity: food.food_quantity,
                    food_shared_by: food.food_shared_by,
                    is_free: food.is_free,
                    is_active: food.is_active,
                    is_available: food.is_available,

                },
            });
        } 
        else 
        {
            res.status(400);
            throw new Error("Invalid food data");
        }
    } 
    catch (error) 
    {
        res.status(400).json({
            message: error.message,
            success: false,
        });
    }
}

// @desc    Get all food
// @route   GET http://localhost:8080/api/food/getall
// @access  Public
export const getAllFood = async (req, res) =>
{
    try 
    {
        const food = await Food.find();
        if (food) 
        {
            res.status(200).json({
                message: "All food fetched successfully",
                success: true,
                food: food,
            });
        } 
        else 
        {
            res.status(400);
            throw new Error("Invalid food data");
        }
    } 
    catch (error) 
    {
        res.status(400).json({
            message: error.message,
            success: false,
        });
    }
}

// @desc    delete food
// @route   DELETE http://localhost:8000/api/food/delete
// @access  Public
export const deleteFood = async (req, res) =>
{
    const {food_id} = req.body;
    try 
    {
        const food = await Food.findByIdAndDelete(food_id);
        if (food) 
        {
            res.status(200).json({
                message: "Food deleted successfully",
                success: true,
                food: food,
            });
        } 
        else 
        {
            res.status(400);
            throw new Error("Invalid food data");
        }
    } 
    catch (error) 
    {
        res.status(400).json({
            message: error.message,
            success: false,
        });
    }
}

// @desc    getfoodbysharedby
// @route   GET http://localhost:8000/api/food/getfoodbysharedby
// @access  Public
export const getFoodBySharedBy = async (req, res) =>
{
    const {food_shared_by} = req.body;
    try

    {
        const food = await Food.find({food_shared_by: food_shared_by});
        if (food) 
        {
            res.status(200).json({
                message: "Food fetched successfully",
                success: true,
                food: food,
            });
        } 
        else 
        {
            res.status(400);
            throw new Error("Invalid food data");
        }
    }
    catch (error)
    {
        res.status(400).json({
            message: error.message,
            success: false,
        });
    }
}

// @desc    update food
// @route   PUT http://localhost:8000/api/food/update
// @access  Public
export const updateFood = async (req, res) =>
{
    const {food_id,food_name, food_description, food_price, food_image, food_category,food_quantity,food_shared_by, is_free} = req.body;
    try 
    {
        const food = await Food.findByIdAndUpdate(food_id,{
            food_name,
            food_description,
            food_price,
            food_image,
            food_category,
            food_quantity,
            food_shared_by,
            is_free,
            is_active: true,
            is_available: true,
        });
        if (food) 
        {
            res.status(200).json({
                message: "Food updated successfully",
                success: true,
                food: food,
            });
        } 
        else 
        {
            res.status(400);
            throw new Error("Invalid food data");
        }
    } 
    catch (error) 
    {
        res.status(400).json({
            message: error.message,
            success: false,
        });
    }
}
