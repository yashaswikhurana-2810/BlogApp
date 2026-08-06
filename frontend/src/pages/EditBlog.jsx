import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getBlogById, updateBlog, getCategories, createCategory } from '../api/blogApi';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          getBlogById(id),
          getCategories(),
        ]);
        const blog = blogRes.data;
        const cats = catRes.data;

        // ── Ownership check ───────────────────────────────────────
        // Compare the logged-in user's ID against the blog's author.
        // user.id is stored as a string from the login response;
        // blog.userId comes from the API as a GUID string — both
        // are lowercased GUIDs so a direct === comparison is safe.
        if (!user || user.id.toLowerCase() !== blog.userId.toLowerCase()) {
          toast.error("You don't have permission to edit this post.");
          navigate('/', { replace: true });
          return;
        }
        // ─────────────────────────────────────────────────────────

        setCategories(cats);

        // Pre-fill form
        reset({
          title: blog.title,
          content: blog.content,
          imageUrl: blog.imageUrl || '',
          categoryId: blog.categoryId || '',
          isPublished: blog.isPublished,
        });
      } catch (err) {
        toast.error('Failed to load blog for editing.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      await createCategory({ name: newCatName.trim() });
      const res = await getCategories();
      setCategories(res.data);
      toast.success(`Category "${newCatName}" created!`);
      setNewCatName('');
      setShowNewCat(false);
    } catch (err) {
      const msg = err.response?.data || 'Failed to create category.';
      toast.error(typeof msg === 'string' ? msg : 'Already exists.');
    } finally {
      setAddingCat(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateBlog(id, {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || null,
        isPublished: data.isPublished,
        categoryId: data.categoryId,
      });
      toast.success('Blog updated successfully! ✅');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data || 'Failed to update blog.';
      toast.error(typeof msg === 'string' ? msg : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <LoadingSpinner message="Loading blog..." />
        </div>
      </div>
    );
  }

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="blog-form-page">
          <div className="blog-form-header">
            <button
              id="edit-back-btn"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(-1)}
              style={{ marginBottom: '1.5rem' }}
            >
              ← Back
            </button>
            <h1 className="blog-form-title">Edit Post</h1>
            <p className="blog-form-subtitle">Update your blog post content and settings.</p>
          </div>

          <div className="blog-form-card">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Title */}
              <div className="form-group">
                <label htmlFor="edit-title" className="form-label">Post Title *</label>
                <input
                  id="edit-title"
                  type="text"
                  className={`form-control ${errors.title ? 'error' : ''}`}
                  placeholder="Write an engaging title..."
                  {...register('title', {
                    required: 'Title is required',
                    maxLength: { value: 200, message: 'Max 200 characters' },
                    minLength: { value: 5, message: 'At least 5 characters' },
                  })}
                />
                {errors.title && (
                  <span className="form-error">⚠ {errors.title.message}</span>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="edit-category" className="form-label">Category *</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <select
                      id="edit-category"
                      className={`form-control ${errors.categoryId ? 'error' : ''}`}
                      {...register('categoryId', { required: 'Please select a category' })}
                    >
                      <option value="">— Select a category —</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <span className="form-error">⚠ {errors.categoryId.message}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    id="edit-new-cat-toggle"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowNewCat((v) => !v)}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  >
                    + New
                  </button>
                </div>

                {showNewCat && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <input
                      id="edit-new-category-name"
                      type="text"
                      className="form-control"
                      placeholder="Category name..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }}}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      id="edit-add-category-btn"
                      className="btn btn-primary btn-sm"
                      onClick={handleAddCategory}
                      disabled={addingCat || !newCatName.trim()}
                      style={{ flexShrink: 0 }}
                    >
                      {addingCat ? <span className="spinner spinner-sm" /> : 'Add'}
                    </button>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label htmlFor="edit-imageUrl" className="form-label">
                  Cover Image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="edit-imageUrl"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  {...register('imageUrl')}
                />
              </div>

              {/* Content */}
              <div className="form-group">
                <label htmlFor="edit-content" className="form-label">Content *</label>
                <textarea
                  id="edit-content"
                  className={`form-control ${errors.content ? 'error' : ''}`}
                  placeholder="Write your blog post here..."
                  style={{ minHeight: '280px' }}
                  {...register('content', {
                    required: 'Content is required',
                    minLength: { value: 20, message: 'At least 20 characters' },
                  })}
                />
                {errors.content && (
                  <span className="form-error">⚠ {errors.content.message}</span>
                )}
              </div>

              {/* Published Toggle */}
              <label className="toggle-row" htmlFor="edit-isPublished">
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>Published</span>
                  <span>Toggle to make this post public</span>
                </div>
                <input
                  id="edit-isPublished"
                  type="checkbox"
                  className="toggle-input"
                  {...register('isPublished')}
                />
              </label>

              <div className="blog-form-actions">
                <button
                  type="button"
                  id="edit-cancel-btn"
                  className="btn btn-ghost"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="edit-submit-btn"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner spinner-sm" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes →'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
