import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, getCategories } from '../api/blogApi';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes] = await Promise.all([getAllBlogs()]);
        setBlogs(blogsRes.data);

        // Categories need auth — only fetch if logged in
        if (token) {
          const catRes = await getCategories();
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.content.toLowerCase().includes(search.toLowerCase()) ||
        b.authorName?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !selectedCategory || b.categoryName === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [blogs, search, selectedCategory]);

  const uniqueCategories = useMemo(() => {
    const names = blogs.map((b) => b.categoryName).filter(Boolean);
    return [...new Set(names)];
  }, [blogs]);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fadeInUp">
            <div className="hero-badge">✦ The Modern Blogging Platform</div>
            <h1 className="hero-title">
              Ideas Worth <br />
              <span className="gradient-text">Reading & Sharing</span>
            </h1>
            <p className="hero-subtitle">
              Discover insightful stories, tutorials, and ideas from brilliant
              minds around the world.
            </p>
            <div className="hero-actions">
              {!token ? (
                <>
                  <Link to="/register" className="btn btn-primary" id="hero-get-started-btn">
                    Start Writing ✦
                  </Link>
                  <Link to="#blogs" className="btn btn-ghost" id="hero-explore-btn">
                    Explore Blogs
                  </Link>
                </>
              ) : (
                <Link to="/blog/create" className="btn btn-primary" id="hero-create-btn">
                  Write a New Post ✦
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container stats-inner">
          <div className="stat-item">
            <div className="stat-value">{blogs.length}+</div>
            <div className="stat-label">Blog Posts</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{uniqueCategories.length}+</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">∞</div>
            <div className="stat-label">Ideas</div>
          </div>
        </div>
      </div>

      {/* Blog Listing */}
      <section className="blogs-section" id="blogs">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Posts</h2>
            {token && (
              <Link to="/blog/create" className="btn btn-primary btn-sm" id="header-create-btn">
                + New Post
              </Link>
            )}
          </div>

          {/* Search */}
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                id="blog-search-input"
                type="text"
                className="form-control"
                placeholder="Search blogs, authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category Chips */}
          {uniqueCategories.length > 0 && (
            <div className="category-filters">
              <button
                id="filter-all"
                className={`category-chip ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All
              </button>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat}`}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Blogs */}
          {loading ? (
            <LoadingSpinner message="Fetching latest posts..." />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3 className="empty-state-title">No blogs found</h3>
              <p className="empty-state-message">
                {search || selectedCategory
                  ? 'Try adjusting your search or filter.'
                  : 'Be the first to write something amazing!'}
              </p>
              {token && (
                <Link to="/blog/create" className="btn btn-primary" id="empty-create-btn">
                  Write the First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="blog-grid">
              {filtered.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
