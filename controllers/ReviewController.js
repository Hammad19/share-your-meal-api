import Review from "../models/Reviews.js";
import User from "../models/Users.js";

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private

export const createReview = async (req, res) => {
  const { review, rating, user, ratedBy, food } = req.body;

  //check if the same user has rated the same food
  const checkReview = await Review.findOne({ user: user, food: food });
  //if Review is Found throw error
  if (checkReview) {
    res.status(400);
    throw new Error("You have already rated this food");
  }

  try {
    const newReview = await Review.create({
      review,
      rating,
      user,
      food,
      ratedBy: ratedBy,
    });
    if (newReview) {
      const newUser = await User.findOneAndUpdate(
        { _id: user },
        { $push: { reviews: newReview._id } },
        { new: true }
      );
      if (newUser) {
        res.status(200).json({ newReview });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export const getReviews = async (req, res) => {
  //get  id
  const { user } = req.params;

  try {
    const reviews = await Review.find({ user: user }).populate("user");
    if (reviews) {
      res.status(200).json({ reviews });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
