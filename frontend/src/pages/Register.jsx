import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { register as registerUser } from '../api/blogApi';

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created! Please sign in. 🎉');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data || 'Registration failed.';
      toast.error(typeof msg === 'string' ? msg : 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeInUp">
        {/* Logo */}
        <div className="auth-logo">✦ BlogApp</div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of writers and readers today</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="register-name" className="form-label">Full Name</label>
            <input
              id="register-name"
              type="text"
              className={`form-control ${errors.name ? 'error' : ''}`}
              placeholder="John Doe"
              {...register('name', {
                required: 'Name is required',
                maxLength: { value: 100, message: 'Name must be under 100 characters' },
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
            {errors.name && (
              <span className="form-error">⚠ {errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="register-email" className="form-label">Email Address</label>
            <input
              id="register-email"
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                maxLength: { value: 150, message: 'Email too long' },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <span className="form-error">⚠ {errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="register-password" className="form-label">Password</label>
            <input
              id="register-password"
              type="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
            />
            {errors.password && (
              <span className="form-error">⚠ {errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="register-confirm" className="form-label">Confirm Password</label>
            <input
              id="register-confirm"
              type="password"
              className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <span className="form-error">⚠ {errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner spinner-sm" />
                Creating account...
              </>
            ) : (
              'Create Account →'
            )}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
