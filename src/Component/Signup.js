import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/users/signup', formData);
      navigate('/login'); 
    } catch (error) {
      console.error('Error signing up user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-black">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-gray-400 text-center" style={{ fontFamily: 'Poppins' }}>
          Join Us
        </h2>
        <h1 className="text-3xl font-extrabold text-white text-center mt-5" style={{ fontFamily: 'Poppins' }}>
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="mt-10 tripform">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:bg-gray-600 ${errors.username && 'border-red-500'}`} 
                placeholder="Username" 
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:bg-gray-600 ${errors.email && 'border-red-500'}`} 
                placeholder="Email Address" 
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:bg-gray-600 ${errors.password && 'border-red-500'}`} 
                placeholder="Password" 
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:bg-gray-600 ${errors.confirmPassword && 'border-red-500'}`} 
                placeholder="Confirm Password" 
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="flex w-full mt-6">
            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 focus:outline-none transition duration-300 ease-in-out flex items-center justify-center"
            >
              {loading ? (
                <span>Signing Up...</span>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400" style={{ fontFamily: 'Poppins' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-green-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
