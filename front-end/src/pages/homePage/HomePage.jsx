import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/hero-image.png';
import book1 from '../../assets/book1.png';
import book2 from '../../assets/book2.png';
import book3 from '../../assets/book3.png';
import book from '../../assets/book-wbg.png';
import './homePage.scss';

const HomePage = () => {
  // Animation variants for Framer Motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="home-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroImage} alt="Bookshelf" className="hero-image" />
        <motion.div className="hero-content" variants={fadeInUp}>
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">
            Explore a world of stories, knowledge, and inspiration.
          </p>
          <a href='/books' className="hero-button">Get Started</a>
        </motion.div>
      </section>


      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2 className="section-title">About Us</h2>
          <p className="about-text">
            We are passionate about connecting readers with their next great read. Our curated
            collection of books spans genres, authors, and cultures to bring you the best stories.
          </p>
          <img src={book} alt="About Section Book" className="about-gif" />
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books">
        <h2 className="section-title">Featured Books</h2>
        <div className="book-grid">
          {[
            { id: 1, image: book1, title: 'The Great Novel', author: 'Jane Doe' },
            { id: 2, image: book2, title: 'Mystery of the Night', author: 'John Smith' },
            { id: 3, image: book3, title: 'Journey to the Stars', author: 'Alice Johnson' },
          ].map((book) => (
            <motion.div key={book.id} className="book-card" variants={fadeInUp}>
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      <section className="testimonials-section">
        <h2 className="section-title">What Readers Say</h2>
        <div className="testimonials-grid">
          {[
            {
              id: 1,
              quote: 'This platform helped me discover books I never knew I would love!',
              author: 'Sarah T.',
            },
            {
              id: 2,
              quote: 'A must-visit for every book lover. Highly recommended!',
              author: 'John D.',
            },
            {
              id: 3,
              quote: 'The best place to find your next favorite book.',
              author: 'Emily R.',
            },
          ].map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <p className="testimonial-author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;