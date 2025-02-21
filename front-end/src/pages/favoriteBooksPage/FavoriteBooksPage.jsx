import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './favoriteBooksPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode'
import { showToast } from '../../redux/slices/toastifySlice';

const FavoriteBooksPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('title');
  const [recommendation, setRecommendation] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Load favorites
  useEffect(() => {
    if (!token) return; // Ensure token exists

    const decoded = jwtDecode(token); // Decode token
    const userId = decoded?.id || decoded?.userId || decoded?.sub; // Adjust based on token structure

    if (!userId) {
      console.error("User ID not found in token");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/books/favorites/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorites(response.data);

      } catch (error) {
        console.error("Error fetching book favorites:", error);
      }
    };

    fetchFavorites();
  }, [token]);

  const removeFavorite = async (bookId) => {
    const decoded = jwtDecode(token); // Decode token
    const userId = decoded?.id || decoded?.userId || decoded?.sub;
  
    try {
      const response = await axios.delete(
        'http://localhost:5000/api/books/remove-favorite',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId, bookId },
        }
      );

      dispatch(showToast({ message: 'Book removed from favorites!', type: 'success' }));
  
      setFavorites((prevFavorites) =>
        prevFavorites.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      console.error("Error removing book from favorites:", error);
      dispatch(showToast({ message: 'Error removing book from favorites!', type: 'error' }));
    }
  };
  

  // Filter favorites by category
  const filteredFavorites = favorites.filter((book) => {
    if (filter === 'all') return true;
    return book.volumeInfo.categories?.includes(filter);
  });

  // Sort favorites
  const sortedFavorites = filteredFavorites.sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sort === 'author') {
      return a.authors?.[0].localeCompare(b.authors?.[0]);
    }
    return 0;
  });

  // Handle AI recommendation request
  const handleRecommendationRequest = async () => {
    try {
      const prompt = selectedBook
        ? `Recommend a book similar to ${selectedBook.volumeInfo.title}`
        : userQuery;
      const response = await axios.post(
        'https://api.deepseek.com/v1/recommendations', // Replace with DeepSeek API endpoint
        { prompt },
        { headers: { Authorization: `Bearer YOUR_DEEPSEEK_API_KEY` } } // Replace with your API key
      );
      setRecommendation(response.data.recommendation);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      setRecommendation('Failed to fetch recommendation. Please try again.');
    }
  };

  return (
    <div className="favorites-page">
      <h1 className="page-title">My Favorites</h1>

      {/* Filters and Sort */}
      <div className="filters">
        <div className="filter-dropdown">
          <label htmlFor="filter">Filter by Category</label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="Biography">Biography</option>
          </select>
        </div>

        <div className="sort-dropdown">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="favorites-grid">
        {sortedFavorites?.length > 0 && (
          sortedFavorites.map((book) => (
            <div key={book._id} className="book-card">
              <img
                src={book.thumbnail || "https://via.placeholder.com/150"}
                alt={book.title}
                className="book-image"
              />
              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.authors?.join(", ") || "Unknown"}</p>
                <p className="book-category">{book.categories?.join(", ") || "Uncategorized"}</p>
              </div>
              <div className="book-actions">
                <button onClick={() => removeFavorite(book._id)}>
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default FavoriteBooksPage;