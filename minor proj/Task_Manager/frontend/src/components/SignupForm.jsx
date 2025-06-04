import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import Input from './utils/Input';
import Loader from './utils/Loader';

const SignupForm = () => {

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("signup", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = { url: "/auth/signup", method: "post", data: formData };
    fetchData(config).then(() => {
      navigate("/login");
    });

  }

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <form className='m-auto my-16 max-w-[500px] p-8 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 border border-blue-300 shadow-lg rounded-lg font-sans'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-6 text-2xl font-heading text-blue-900'>Welcome user, please signup here</h2>
            <div className="mb-6">
              <label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-pink-600 font-medium">User Name</label>
              <Input type="text" name="name" id="name" value={formData.name} placeholder="Enter your Username" onChange={handleChange} />
              {fieldError("name")}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-pink-600 font-medium">Email</label>
              <Input type="text" name="email" id="email" value={formData.email} placeholder="youremail@gmail.com" onChange={handleChange} />
              {fieldError("email")}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-pink-600 font-medium">Password</label>
              <Input type="password" name="password" id="password" value={formData.password} placeholder="Your password." onChange={handleChange} />
              {fieldError("password")}
            </div>

            <button className='bg-green-600 text-white px-6 py-3 font-medium rounded-md hover:bg-green-700 shadow-md transition duration-300 w-full' onClick={handleSubmit}>Submit</button>

            <div className='pt-6 text-center'>
              <Link to="/login" className='text-blue-800 hover:text-blue-900 transition'>Already have an account? Login here</Link>
            </div>
          </>
        )}

      </form>
    </>
  )
}

export default SignupForm
