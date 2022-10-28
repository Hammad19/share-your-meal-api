import mongoose from "mongoose";

// User Schema Definition
const FoodSchema = new mongoose.Schema({

    // Food Name
    food_name: {
        type: String,
        required: true,
        trim: true,
    },

    // Food Description
    food_description: {
        type: String,
        required: true,
        trim: true,
    },

    // Food Price

    food_price: {
        type: Number,
        required: true,
        trim: true,
    },

    // Food Image
    food_image: {
        type: String,
        required: true,
        trim: true,
    },

    // Food Category
    food_category: {
        type: String,
        required: true,
        trim: true,
    },

    // Food quantity
    food_quantity: {
        type: Number,
        required: true,
        trim: true,
    },

    // food shared by
    food_shared_by: {
        type: String,
        required: true,
        trim: true,
    },


    // is free
    is_free: {
        type: Boolean,
        required: true,
        trim: true,
    },
    //is active
    is_active: {
        type: Boolean,
        required: false,
        trim: true,
        default: true,
    },


    // is available
    is_available: {
        type: Boolean,
        required: false,
        trim: true,
        default: true,
        
    },

    // Food Created Date
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
    

// define food model


const Food = mongoose.model("food", FoodSchema);

export default Food;