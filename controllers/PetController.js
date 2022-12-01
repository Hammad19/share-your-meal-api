// Create User Controller
import Pet from "../models/Pet.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc    Add a new food
// @route   POST http://localhost:8000/api/pet/add
// @access  Public
export const addPet = async (req, res) => 
{
    const {pet_name, pet_description, pet_price, pet_image, pet_category,pet_quantity,pet_shared_by, is_free} = req.body;
    try 
    {
        const pet = await Pet.create({
            pet_name,
            pet_description,
            pet_price,
            pet_image,
            pet_category,
            pet_quantity,
            pet_shared_by,
            is_active: true,
            is_deleted: false,
        });
        if (pet) 
        {
            res.status(200).json({
                message: "Pet added successfully",
                success: true,
                food: {
                    id: pet._id,
                    pet_name: pet.pet_name,
                    pet_description: pet.pet_description,
                    pet_price: pet.pet_price,
                    pet_image: pet.pet_image,
                    pet_category: pet.pet_category,
                    pet_quantity: pet.pet_quantity,
                    pet_shared_by: pet.pet_shared_by,
                    is_active: pet.is_active,
                    is_available: pet.is_available,

                },
            });
        } 
        else 
        {
            res.status(400);
            throw new Error("Invalid pet data");
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
export const getAllPets = async (req, res) =>
{

    //return all pets that are not deleted and active


    try 
    {
        const pet = await Pet.find({is_deleted: false , is_active: true , is_available: true});
        if (pet) 
        {
            res.status(200).json({
                message: "All pets fetched successfully",
                success: true,
                pet: pet,
            });
        } 
        else 
        {
            res.status(400);
            throw new Error("Invalid pet data");
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
export const deletePet = async (req, res) =>
{
    //set is deleted to true where id = req.params.id


    console.log(req.params._id);
    try
    {
        const pet = await Pet.findById(req.params._id);
        if (pet)
        {
            pet.is_deleted = true;
            pet.save();
            res.status(200).json({
                message: "Pet deleted successfully",
                success: true,
                pet: pet,
            });
        }
        else
        {
            res.status(400);
            throw new Error("Invalid pet data");
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

// @desc    Update a food
// @route   PUT http://localhost:8000/api/food/update
// @access  Public
export const updatePet = async (req, res) =>
{
    const {_id , pet_name, pet_description, pet_price, pet_image, pet_category,pet_quantity,pet_shared_by} = req.body;
    try
    {
        const pet = await Pet.findById(_id);
        if (pet)
        {
            pet.pet_name = pet_name;
            pet.pet_description = pet_description;
            pet.pet_price = pet_price;
            pet.pet_image = pet_image;
            pet.pet_category = pet_category;
            pet.pet_quantity = pet_quantity;
            pet.pet_shared_by = pet_shared_by;
            pet.is_free = is_free;
            pet.is_active = true;
            pet.is_deleted = false;
            pet.save();
            res.status(200).json({
                message: "Pet updated successfully",
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

//@desc getfoodbysharedby
// @route   GET /api/food/getfoodbysharedby
// @access  Public
export const getPetBySharedBy = async (req, res) =>
{
    const {pet_shared_by} = req.params;
    try
    {
        //return all foods shared by a particular user where is_deleted = false
        const pet = await Pet.find({pet_shared_by: pet_shared_by, is_deleted: false});

        //if food is an empty array, then no food is shared by the user
        if (pet)
        {
            res.status(200).json({
                message: "Pet fetched successfully",
                success: true,
                pet: pet,
            });
        } 

        else 
        {
            res.status(400);
            throw new Error("Invalid pet data");
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




