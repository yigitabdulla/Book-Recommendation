import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './booksPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode'
import { showToast } from '../../redux/slices/toastifySlice';

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_API_KEY;
    const MAX_RESULTS = 20;

    const { token } = useSelector((state) => state.auth);

    const dispatch = useDispatch();


    const addToFavorites = async (book) => {

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
    
            await axios.post(
                'http://localhost:5000/api/books/add-favorite', 
                {
                    userId: userId,
                    book: {
                        googleId: book.id,
                        title: book.volumeInfo.title,
                        authors: book.volumeInfo.authors,
                        categories: book.volumeInfo.categories,
                        description: book.volumeInfo.description,
                        thumbnail: book.volumeInfo.imageLinks.thumbnail,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            dispatch(showToast({ message: 'Book added to the favorites!', type: 'success' }));
        } catch (err) {
            console.error('Error adding book to favorites:', err);
            dispatch(showToast({ message: 'Failed to add book to favorites!', type: 'error' }));
        }
    };
    


    const fetchBooks = async (query, page = 0) => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=${MAX_RESULTS}&startIndex=${page * MAX_RESULTS}`
            );

            const newBooks = response.data.items || [];
            setTotalItems(response.data.totalItems || 0);

            if (page === 0) {
                setBooks(newBooks);
            } else {
                setBooks((prevBooks) => [...prevBooks, ...newBooks]);
            }

            const allCategories = newBooks.flatMap((book) => book.volumeInfo.categories || []);
            setCategories((prev) => [...new Set([...prev, ...allCategories])]);
        } catch (error) {
            console.error('Error fetching books:', error);
            dispatch(showToast({ message: 'Error during fetching books!', type: 'error' }));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(0); // Reset to first page
        fetchBooks(searchQuery, 0);
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Filter books based on category
    const filteredBooks = books.filter((book) => {
        if (filter === 'all') return true;
        return book.volumeInfo.categories?.includes(filter);
    });


    // Load more books
    const loadMoreBooks = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchBooks(searchQuery, nextPage);
    };

    useEffect(() => {
        fetchBooks('cartoon'); // Default search
    }, []);



    return (
        <div className="books-page">
            <h1 className="page-title">Explore Books</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Filter Dropdown */}
            <div className="filter-dropdown">
                <label htmlFor="filter">Filter by Category</label>
                <select id="filter" value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Books Grid */}
            <div className="books-grid">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="book-card">
                        <img
                            src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
                            alt={book.volumeInfo.title}
                            className="book-image"
                        />
                        <div className="book-details">
                            <h3 className="book-title">{book.volumeInfo.title}</h3>
                            <p className="book-author">by {book.volumeInfo.authors?.join(', ')}</p>
                            <p className="book-category">{book.volumeInfo.categories?.join(', ') || 'Unknown'}</p>
                        </div>
                        <div className="book-actions">
                            <button onClick={() => addToFavorites(book)}>
                                <span>♡ Add to Favorites</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {books.length < totalItems && (
                <div className="load-more">
                    <button onClick={loadMoreBooks} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BooksPage;
