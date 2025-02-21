// controllers/bookController.js
const User = require('../models/userModel');
const Book = require('../models/bookModel');

const addFavorite = async (req, res) => {
  const { userId, book } = req.body;

  try {
    let existingBook = await Book.findOne({ googleId: book.googleId });
    if (!existingBook) {
      existingBook = new Book(book);
      await existingBook.save();
    }

    const user = await User.findById(userId);
    console.log(user)
    if (!user.favorites.includes(existingBook._id)) {
      user.favorites.push(existingBook._id);
      await user.save();
    }

    res.status(200).json({ message: 'Book added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding favorite book', error: err });
  }
};

const removeFavorite = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter((book) => book.toString() !== bookId);
    await user.save();

    res.status(200).json({ message: 'Book removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite book', error: err });
  }
};

const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorite books', error: err });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
