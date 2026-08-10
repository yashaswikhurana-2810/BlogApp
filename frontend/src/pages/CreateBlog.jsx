import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createBlog, getCategories, createCategory } from '../api/blogApi';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch {
        toast.error('Could not load categories.');
      } finally {
        setCatLoading(false);
      }
    };
    fetchCats();
  }, []);

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
      await createBlog({
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || null,
        categoryId: data.categoryId,
      });
      toast.success('Blog created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data || 'Failed to create blog.';
      toast.error(typeof msg === 'string' ? msg : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="blog-form-page">
          <div className="blog-form-header">
            <button
              id="create-back-btn"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(-1)}
              style={{ marginBottom: '1.5rem' }}
            >
              ← Back
            </button>
            <h1 className="blog-form-title">Write a New Post</h1>
            <p className="blog-form-subtitle">
              Share your thoughts, ideas, and stories with the world.
            </p>
          </div>

          <div className="blog-form-card">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Title */}
              <div className="form-group">
                <label htmlFor="create-title" className="form-label">Post Title *</label>
                <input
                  id="create-title"
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
                <label htmlFor="create-category" className="form-label">Category *</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <select
                      id="create-category"
                      className={`form-control ${errors.categoryId ? 'error' : ''}`}
                      disabled={catLoading}
                      {...register('categoryId', { required: 'Please select a category' })}
                    >
                      <option value="">
                        {catLoading ? 'Loading categories...' : '— Select a category —'}
                      </option>
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
                    id="create-new-cat-toggle"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowNewCat((v) => !v)}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  >
                    + New
                  </button>
                </div>

                {/* New Category inline */}
                {showNewCat && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <input
                      id="new-category-name"
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
                      id="add-category-btn"
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
                <label htmlFor="create-imageUrl" className="form-label">Cover Image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  id="create-imageUrl"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  {...register('imageUrl')}
                />
              </div>

              {/* Content */}
              <div className="form-group">
                <label htmlFor="create-content" className="form-label">Content *</label>
                <textarea
                  id="create-content"
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

              <div className="blog-form-actions">
                <button
                  type="button"
                  id="create-cancel-btn"
                  className="btn btn-ghost"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="create-submit-btn"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner spinner-sm" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Post →'
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
