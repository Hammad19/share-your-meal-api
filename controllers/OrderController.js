import Food from "../models/Food.js";
import Users from "../models/Users.js";
import Order from "../models/Order.js";

// @desc    Get all ordered food by a user
// @route   GET /api/food/ordered
// @access  Public

export const getOrderedFood = async (req, res) => {
  try {
    const order = await Order.find({ ordered_by: req.params.ordered_by });
    if (order) {
      res.status(200).json({
        message: "Order found",
        success: true,
        order,
      });
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

// @desc order food
// @route   POST /api/food/order
// @access  Public

export const orderFood = async (req, res) => {
  try {
    const { order_food_id, order_quantity, ordered_by } = req.body;

    const food = await Food.findById({ _id: order_food_id });

    if (food) {
      //check if the food_shared_by is same as ordered_by
      if (food.food_shared_by == ordered_by) {
        res.status(400);
        throw new Error("You cannot order your own food");
      }

      //check quantity
      if (food.food_quantity >= order_quantity) {
        //check if food is free
        if (food.is_free) {
          //check if user has already requested for the food
          const order = await Order.findOne({
            order_food_id: order_food_id,
            ordered_by: ordered_by,
          });
          if (order) {
            res.status(400);
            throw new Error(
              "You have already requested for this food Please wait for the owner to accept your request"
            );
          } else {
            //place order by pending status
            const order = new Order({
              order_food_id,
              order_name: food.food_name,
              order_description: food.food_description,
              order_price: 0,
              order_image: food.food_image,
              order_category: food.food_category,
              order_quantity,
              order_shared_by: food.food_shared_by,
              order_location: food.food_location,
              is_free: food.is_free,
              is_active: true,
              ordered_by,
              order_status: "pending",
            });
            order.save();
            res.status(200).json({
              message: "Order Requested successfully",
              success: true,
              order,
            });
          }
        } else {
          food.food_quantity = food.food_quantity - order_quantity;
          food.save();
          //place food order by placed status
          const order = new Order({
            order_food_id,
            order_name: food.food_name,
            order_description: food.food_description,
            order_price: food.food_price * order_quantity,
            order_image: food.food_image,
            order_category: food.food_category,
            order_quantity,
            order_shared_by: food.food_shared_by,
            order_location: food.food_location,
            is_free: food.is_free,
            is_active: true,
            ordered_by,
            order_status: "placed",
          });
          order.save();
          res.status(200).json({
            message: "Order placed successfully",
            success: true,
            order,
          });
        }
      } else {
        res.status(400);
        throw new Error("Insufficient quantity");
      }
    } else {
      res.status(400);
      throw new Error("Invalid food data");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

// @desc    accept order
// @route   POST /api/food/acceptorder
// @access  Public

export const acceptOrder = async (req, res) => {
  try {
    const { order_id, order_food_id, order_quantity } = req.body;

    const order = await Order.findById({ _id: order_id });
    if (order) {
      //check if order is pending
      if (order.order_status === "pending") {
        //check if food quantity is sufficient
        const food = await Food.findById({ _id: order_food_id });
        if (food) {
          if (food.food_quantity >= order_quantity) {
            //deduct food quantity
            food.food_quantity = food.food_quantity - order_quantity;
            food.save();
            //update order status to placed
            order.order_status = "placed";
            order.save();
            res.status(200).json({
              message: "Order accepted successfully",
              success: true,
              order,
            });
          } else {
            res.status(400);
            throw new Error("Insufficient quantity");
          }
        } else {
          res.status(400);
          throw new Error("Invalid food data");
        }
      } else {
        res.status(400);
        throw new Error("Order already accepted");
      }
    } else {
      res.status(400);
      throw new Error("Invalid order data");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

// @desc    reject order
// @route   POST /api/food/rejectorder
// @access  Public

export const rejectOrder = async (req, res) => {
  try {
    const { order_id, order_food_id, order_quantity } = req.body;

    const order = await Order.findById({ _id: order_id });
    if (order) {
      //check if order is pending
      if (order.order_status === "pending") {
        //update order status to rejected
        order.order_status = "rejected";
        order.save();
        res.status(200).json({
          message: "Order rejected successfully",
          success: true,
          order,
        });
      } else {
        res.status(400);
        throw new Error("Order already accepted");
      }
    } else {
      res.status(400);
      throw new Error("Invalid order data");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

//get all pending requests by order shared by a user
export const getPendingRequests = async (req, res) => {
  try {
    const order = await Order.find({
      order_shared_by: req.params.order_shared_by,
      order_status: "pending",
    });

    if (order) {
      res.status(200).json({
        message: "Order found",
        success: true,
        order,
      });
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

//get rejected requests by order shared by a user
export const getRejectedRequests = async (req, res) => {
  try {
    const order = await Order.find({
      order_shared_by: req.params.order_shared_by,
    });
    if (order) {
      res.status(200).json({
        message: "Order found",
        success: true,
        order,
      });
    } else {
      res.status(400);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
