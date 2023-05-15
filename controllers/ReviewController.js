import Review from "../models/Reviews.js";
import User from "../models/Users.js";

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private

export const createReview = async (req, res) => {
  const { review, rating, user_email, ratedBy_email, order, food } = req.body;

  //get user id and rated by id
  const user = await User.findOne({ email: user_email });
  const ratedBy = await User.findOne({ email: ratedBy_email });

  //check with id if same user has reveiwed same food

  const checkReview = await Review.findOne({
    user: user,
    ratedBy: ratedBy,
    food: food,
  });

  if (checkReview) {
    res.status(400).json({
      message: "You have already reviewed this food",
      success: false,
    });

    return;
  }

  try {
    //create review
    const newReview = await Review.create({
      review,
      rating,
      user: user._id,
      user_email,
      ratedBy: ratedBy._id,
      ratedBy_email,
      food,
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

export const getReviewsByUser = async (req, res) => {
  const user_email = req.params.user;
  console.log(user_email);

  //get user id
  const user = await User.findOne({ email: user_email });

  try {
    const reviews = await Review.find({ user: user });
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

export const getReviewsByRatedBy = async (req, res) => {
  const ratedBy_email = req.params.ratedBy;
  console.log(ratedBy_email);

  //get user id
  const ratedBy = await User.findOne({ email: ratedBy_email });

  try {
    const reviews = await Review.find({ ratedBy: ratedBy });
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

//get reviews of ordered food
export const getReviewsByFood = async (req, res) => {
  const food_id = req.params.food;
  console.log(food_id);

  try {
    const reviews = await Review.find({ food: food_id });
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
