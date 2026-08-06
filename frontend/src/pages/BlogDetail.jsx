import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogById } from '../api/blogApi';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        setBlog(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Blog not found.');
        } else {
          setError('Failed to load blog.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <LoadingSpinner message="Loading blog post..." />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state" style={{ marginTop: '4rem' }}>
            <div className="empty-state-icon">😕</div>
            <h3 className="empty-state-title">{error || 'Blog not found'}</h3>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>← Back Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="blog-detail-wrapper">
          {/* Back button */}
          <button
            id="back-btn"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(-1)}
            style={{ marginBottom: '2rem' }}
          >
            ← Back
          </button>

          {/* Hero Image */}
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="blog-detail-hero-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          {/* Header */}
          <div className="blog-detail-header animate-fadeInUp">
            <div className="blog-detail-meta">
              {blog.categoryName && (
                <span className="badge badge-accent">{blog.categoryName}</span>
              )}
              {blog.isPublished ? (
                <span className="badge badge-success">Published</span>
              ) : (
                <span className="badge badge-muted">Draft</span>
              )}
              <time dateTime={blog.createdAt} style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {formatDate(blog.createdAt)}
              </time>
              {blog.updatedAt && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  · Updated {formatDate(blog.updatedAt)}
                </span>
              )}
            </div>

            <h1 className="blog-detail-title">{blog.title}</h1>

            {/* Author */}
            <div className="blog-detail-author-row">
              <div className="author-avatar-lg" aria-hidden="true">
                {getInitials(blog.authorName)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{blog.authorName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Author</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="blog-detail-content animate-fadeInUp animate-delay-1">
            {blog.content}
          </div>

          {/* Edit — only visible to the blog's author */}
          {user && user.id === blog.userId && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
              <Link
                to={`/blog/edit/${blog.id}`}
                className="btn btn-ghost"
                id="detail-edit-btn"
              >
                ✏️ Edit Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
