import mongoose from "mongoose";

// User Schema Definition
const PetSchema = new mongoose.Schema({

    // Food Name
    pet_name: {
        type: String,
        required: true,
        trim: true,
    },

    // Food Description
    pet_description: {
        type: String,
        required: true,
        trim: true,
    },

    // Food Price

    pet_price: {
        type: Number,
        required: true,
        trim: true,
    },

    // Food Image
    pet_image: {
        type: String,
        required: true,
        trim: true,
    },

    // Food Category
    pet_category: {
        type: String,
        required: true,
        trim: true,
    },

    // Food quantity
    pet_quantity: {
        type: Number,
        required: true,
        trim: true,
    },

    // food shared by
    pet_shared_by: {
        type: String,
        required: true,
        trim: true,
    },


    // // is free
    // is_free: {
    //     type: Boolean,
    //     required: true,
    //     trim: true,
    // },
    //is active
    is_active: {
        type: Boolean,
        required: false,
        trim: true,
        default: true,
    },
    // is available
    is_deleted: {
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


const Pet = mongoose.model("pet", PetSchema);

export default Pet;