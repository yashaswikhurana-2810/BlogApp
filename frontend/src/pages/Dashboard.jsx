import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyBlogs, deleteBlog } from '../api/blogApi';
import BlogCard from '../components/BlogCard';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Uses GET /api/blogposts/my — returns only the current user's posts
      const res = await getMyBlogs();
      setBlogs(res.data);
    } catch (err) {
      toast.error('Failed to load your blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog) => {
    navigate(`/blog/edit/${blog.id}`);
  };

  const handleDeleteClick = (blog) => {
    setDeleteTarget(blog);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget.id);
      toast.success('Blog deleted successfully.');
      // Remove from local state without re-fetching
      setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      const msg = err.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Failed to delete blog.');
    } finally {
      setDeleting(false);
    }
  };

  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const draftCount = blogs.filter((b) => !b.isPublished).length;

  return (
    <main className="page-wrapper">
      {/* Header */}
      <section className="dashboard-header">
        <div className="container">
          <div className="dashboard-title">My Dashboard</div>
          <p className="dashboard-subtitle">
            Manage your blog posts, drafts, and published articles.
          </p>
        </div>
      </section>

      <div className="dashboard-content">
        <div className="container">
          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-card-icon">📝</div>
              <div className="stat-card-value">{blogs.length}</div>
              <div className="stat-card-label">Total Posts</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">🌐</div>
              <div className="stat-card-value">{publishedCount}</div>
              <div className="stat-card-label">Published</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">📋</div>
              <div className="stat-card-value">{draftCount}</div>
              <div className="stat-card-label">Drafts</div>
            </div>
          </div>

          {/* Section header */}
          <div className="section-header">
            <h2 className="section-title">Your Posts</h2>
            <Link to="/blog/create" className="btn btn-primary btn-sm" id="dashboard-create-btn">
              + New Post
            </Link>
          </div>

          {/* Blog list */}
          {loading ? (
            <LoadingSpinner message="Loading your blogs..." />
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✍️</div>
              <h3 className="empty-state-title">No posts yet</h3>
              <p className="empty-state-message">
                Start your writing journey by creating your first blog post.
              </p>
              <Link to="/blog/create" className="btn btn-primary" id="dashboard-first-post-btn">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  showActions
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteTarget(null)}
        isLoading={deleting}
      />
    </main>
  );
}
