import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
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

export default function BlogCard({ blog, showActions = false, onEdit, onDelete }) {
  return (
    <article className="glass-card blog-card">
      {/* Image */}
      {blog.imageUrl ? (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="blog-card-image"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="blog-card-image-placeholder">
          <span style={{ position: 'relative', zIndex: 1 }}>✦</span>
        </div>
      )}

      {/* Body */}
      <div className="blog-card-body">
        {/* Meta */}
        <div className="blog-card-meta">
          {blog.categoryName && (
            <span className="badge badge-accent">{blog.categoryName}</span>
          )}
          {blog.isPublished === false && (
            <span className="badge badge-muted">Draft</span>
          )}
          {blog.isPublished === true && showActions && (
            <span className="badge badge-success">Published</span>
          )}
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.id}`} style={{ display: 'block' }}>
          <h2 className="blog-card-title">{blog.title}</h2>
        </Link>

        {/* Excerpt */}
        <p className="blog-card-excerpt">{blog.content}</p>

        {/* Footer */}
        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-avatar" aria-hidden="true">
              {getInitials(blog.authorName)}
            </div>
            <span>{blog.authorName}</span>
          </div>
          <time className="blog-card-date" dateTime={blog.createdAt}>
            {formatDate(blog.createdAt)}
          </time>
        </div>
      </div>

      {/* Dashboard Actions */}
      {showActions && (
        <div className="blog-card-actions">
          <button
            id={`edit-blog-${blog.id}`}
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit(blog)}
            style={{ flex: 1 }}
          >
            ✏️ Edit
          </button>
          <button
            id={`delete-blog-${blog.id}`}
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(blog)}
            style={{ flex: 1 }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </article>
  );
}
