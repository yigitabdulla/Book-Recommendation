const User = require('../models/userModel');
const Recommendation = require('../models/recommendationModel');

const addRecommendation = async (req, res) => {
  const { userId, recommendation } = req.body;
  console.log(recommendation)
  try {
    let existingRecommendation = await Recommendation.findOne({ _id: recommendation._id });
    if (!existingRecommendation) {
        existingRecommendation = new Recommendation(recommendation);
      await existingRecommendation.save();
    }

    const user = await User.findById(userId);

    if (!user.recommendations.includes(existingRecommendation._id)) {
      user.recommendations.push(existingRecommendation._id);
      await user.save();
    }

    res.status(200).json({ message: 'Book added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding favorite book', error: err });
  }
};

const removeRecommendation = async (req, res) => {
  const { userId, recommendationId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.recommendations = user.recommendations.filter((id) => id.toString() !== recommendationId);
    await user.save();
    
    await Recommendation.findByIdAndDelete(recommendationId);

    res.status(200).json({ message: 'Recommendation removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing recommendation', error: err });
  }
};


const getRecommendation = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId).populate('recommendations');
    res.status(200).json(user.recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorite books', error: err });
  }
};

module.exports = { addRecommendation, removeRecommendation, getRecommendation };