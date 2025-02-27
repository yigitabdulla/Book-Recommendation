import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './favoriteBooksPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode'
import { showToast } from '../../redux/slices/toastifySlice';
import OpenAI from 'openai';

const FavoriteBooksPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('title');
  const [nameFilter, setNameFilter] = useState('');
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // Store recommendations
  const [selectedBooks, setSelectedBooks] = useState([]); // Initialize as an empty array
  const [userQuery, setUserQuery] = useState(''); // Track custom prompt
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const API_KEY = import.meta.env.VITE_OPENAI_KEY;

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: API_KEY, // Replace with your OpenAI API key
    dangerouslyAllowBrowser: true, // Allow browser usage (only for frontend testing)
  });

  const toggleBookSelection = (book) => {
    const simplifiedBook = {
      _id: book._id,
      title: book.title,
      author: book.authors?.join(", ") || "Unknown",
      category: book.categories?.join(", ") || "Uncategorized",
    };

    if (selectedBooks.some((selected) => selected._id === book._id)) {
      // If already selected, remove it
      setSelectedBooks((prevSelected) =>
        prevSelected.filter((selected) => selected._id !== book._id)
      );
    } else {
      // If not selected, add it
      setSelectedBooks((prevSelected) => [...prevSelected, simplifiedBook]);
    }
  };

  const handleRecommendationRequest = async () => {
    if (selectedBooks.length === 0 && !userQuery) {
      dispatch(showToast({ message: 'Please select books or enter a prompt!', type: 'error' }));
      return;
    }

    setIsLoading(true);
    try {
      let prompt;
      if (selectedBooks.length > 0) {
        const bookTitles = selectedBooks.map((book) => `"${book.title}" by ${book.author}`).join(', ');
        prompt = `Recommend 5 books similar to ${bookTitles}. 
          Return only a JSON array of objects with "title", "author", and "description". No extra text, no explanations.`;

      } else {
        prompt = `Recommend 5 books based on: "${userQuery}". 
          Return only a JSON array of objects with "title", "author", and "description". No extra text, no explanations.`;

      }

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4', // Use GPT-4 or GPT-3.5
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that recommends books.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract the recommendations from the API response
      const recommendationsText = completion.choices[0].message.content;
      setRecommendations(JSON.parse(recommendationsText));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      dispatch(showToast({ message: 'Failed to fetch recommendations. Please try again.', type: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };


  // Load favorites
  useEffect(() => {
    if (!token) return; // Ensure token exists

    const decoded = jwtDecode(token); // Decode token
    const userId = decoded?.id || decoded?.userId || decoded?.sub;


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

        const allCategories = response.data.flatMap((book) => book.categories || []);
        setCategories((prev) => [...new Set([...prev, ...allCategories])]);

        setFavorites(response.data);

      } catch (error) {
        console.error("Error fetching book favorites:", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/recommendations/get-recommendations/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedRecommendations(response.data);

      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchFavorites();
    fetchRecommendations()
  }, [token]);

  const removeFavorite = async (bookId) => {

    if (!token) {
      dispatch(showToast({ message: 'You must be logged in to add to favorites!', type: 'error' }));
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded?.id || decoded?.userId || decoded?.sub;

    if (!userId) {
      dispatch(showToast({ message: 'You must be logged in to add to favorites!', type: 'error' }));
      return;
    }

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
    return book.categories?.includes(filter);
  });

  const sortedFavorites = filteredFavorites
    .filter((book) => {
      if (nameFilter) {
        return book.title.toLowerCase().includes(nameFilter.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sort === 'author') {
        return a.authors?.[0].localeCompare(b.authors?.[0]);
      }
      return 0;
    });

  const addToRecommendation = async (recommendation) => {
    console.log(recommendation)

    if (!token) {
      dispatch(showToast({ message: 'You must be logged in to add to recommendation!', type: 'error' }));
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded?.id || decoded?.userId || decoded?.sub;

    if (!userId) {
      dispatch(showToast({ message: 'You must be logged in to add to recommendation!', type: 'error' }));
      return;
    }



    try {

      await axios.post(
        'http://localhost:5000/api/recommendations/add-recommendation',
        {
          userId: userId,
          recommendation: {
            title: recommendation.title,
            authors: recommendation.author,
            description: recommendation.description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      dispatch(showToast({ message: 'Recommendation saved!', type: 'success' }));
      setSavedRecommendations((prev) => [...prev, recommendation]);
    } catch (err) {
      console.error('Error saving reccomendation:', err);
      dispatch(showToast({ message: 'Failed to save recommendation!', type: 'error' }));
    }
  };

  const removeRecommendation = async (recommendationId) => {
    if (!token) {
      dispatch(showToast({ message: 'You must be logged in to add to favorites!', type: 'error' }));
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded?.id || decoded?.userId || decoded?.sub;

    if (!userId) {
      dispatch(showToast({ message: 'You must be logged in to add to favorites!', type: 'error' }));
      return;
    }

    try {
      const response = await axios.delete(
        'http://localhost:5000/api/recommendations/remove-recommendation',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId, recommendationId },
        }
      );

      dispatch(showToast({ message: 'Recommendation removed!', type: 'success' }));

      setSavedRecommendations((prevRecommendations) =>
        prevRecommendations.filter((recommendation) => recommendation._id !== recommendationId)
      );
    } catch (error) {
      console.error("Error removing recommendation:", error);
      dispatch(showToast({ message: 'Error removing recommendation!', type: 'error' }));
    }
  };

  return (
    <div className="favorites-page">

      <h1 className="page-title">Get Book Recommendations</h1>

      {/* Recommendation Section */}
      <div className="recommendation-section">
        <div className="recommendation-input">
          <input
            type="text"
            placeholder="(e.g., 'Recommend books about space')"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
          <button onClick={handleRecommendationRequest} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </div>

        {selectedBooks.length > 0 && (
          <div className='selected-books'>
            <h2>Selected Books</h2>
            <ul>
              {selectedBooks.map((selectedBook, index) => (
                <li key={index}>
                  <span>{selectedBook.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="recommendations-list">
            <h2>Recommendations</h2>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index}>
                  <p><strong>{rec.title}</strong><br />by {rec.author}</p>
                  <p>{rec.description}</p>
                  <button onClick={() => addToRecommendation(rec)}>Save Recommendation</button>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      <h1 className="page-title">My Favorites</h1>

      {/* Filters and Sort */}
      <div className="filters">
        <div className='selectable-filters'>
          <div className="filter-dropdown">
            <label htmlFor="filter">Filter by Category</label>
            <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
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

        <input placeholder='Search with a book name' type='text' onChange={(e) => setNameFilter(e.target.value)}></input>
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
                <button onClick={() => toggleBookSelection(book)}>
                  Select for Recommendations
                </button>
              </div>
            </div>
          ))
        )}
      </div>


      {recommendations && (
        <div className="saved-recommendations">
          <h1>Saved Recommendations</h1>
          <ul>
            {savedRecommendations.map((rec, index) => (
              <li key={index}>
                <p><strong>{rec.title}</strong><br />by {rec.authors}</p>
                <p>{rec.description}</p>
                <button onClick={() => removeRecommendation(rec._id)}>Remove from Recommendations</button>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default FavoriteBooksPage;