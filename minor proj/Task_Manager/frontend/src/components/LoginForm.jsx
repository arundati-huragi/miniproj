import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import validateManyFields from '../validations';
import Input from './utils/Input';
import { useDispatch, useSelector } from "react-redux";
import { postLoginData } from '../redux/actions/authActions';
import Loader from './utils/Loader';
import { useEffect } from 'react';

const LoginForm = ({ redirectUrl }) => {

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();


  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [authState, redirectUrl, isLoggedIn, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("login", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  }

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
<form className='m-auto my-16 max-w-[500px] bg-gradient-to-r from-teal-200 via-teal-300 to-teal-400 p-8 border border-transparent shadow-2xl rounded-lg font-sans text-black'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-6 text-2xl font-heading'>Welcome user, please login here</h2>
            <div className="mb-6">
              <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-pink-300 font-medium">Email</label>
              <Input type="text" name="email" id="email" value={formData.email} placeholder="youremail@.com" onChange={handleChange} />
              {fieldError("email")}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-pink-300 font-medium">Password</label>
              <Input type="password" name="password" id="password" value={formData.password} placeholder="Your password.." onChange={handleChange} />
              {fieldError("password")}
            </div>

<button className='bg-blue-600 text-white px-6 py-3 font-medium rounded-md hover:bg-blue-700 shadow-lg transition duration-300 w-full' onClick={handleSubmit}>Submit</button>

            <div className='pt-6 text-center'>
<Link to="/signup" className='text-blue-600 hover:text-blue-800 transition'>Don't have an account? Signup here</Link>
            </div>
          </>
        )}
      </form>
    </>
  )
}

export default LoginForm
