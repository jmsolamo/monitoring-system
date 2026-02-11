import React, { useState } from 'react';

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: fullName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
          role: role
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Registration successful!');
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 1 number', met: /\d/.test(password) },
    { label: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
  ];

  const strength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Register</h2>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative z-0">
            <i className='bx bx-user absolute left-0 top-3 text-gray-300'></i>
            <input
              type="text"
              id="fullname"
              value={fullName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setFullName(value);
                }
              }}
              className="block py-2.5 px-8 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder="Full Name" 
              required
            />
          </div>
          <div className="relative z-0">
            <i className='bx bx-user absolute left-0 top-3 text-gray-300'></i>
            <input
              type="text"
              id="lastname"
              value={lastName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setLastName(value);
                }
              }}
              className="block py-2.5 px-8 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder="Last Name" 
              required
            />
          </div>
        </div>
        <div className="relative z-0">
          <i className='bx bx-user-circle absolute left-0 top-3 text-gray-300'></i>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block py-2.5 px-8 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder="Username" 
            required
          />
        </div>
        <div className="relative z-0">
          <i className='bx bx-envelope absolute left-0 top-3 text-gray-300'></i>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block py-2.5 px-8 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder="Email" 
            required
          />
          {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
            <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
          )}
        </div>
        <div className="relative z-0">
          <i className='bx bx-user-check absolute left-0 top-3 text-gray-300'></i>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block py-2.5 px-8 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            required
          >
            <option value="" disabled className="bg-gray-800">Select Role</option>
            <option value="1" className="bg-gray-800">Role 1</option>
            <option value="2" className="bg-gray-800">Role 2</option>
            <option value="3" className="bg-gray-800">Role 3</option>
          </select>
        </div>
        <div className="relative z-0">
          <i className='bx bx-lock-alt absolute left-0 top-3 text-gray-300'></i>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block py-2.5 px-8 pr-10 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder="Password"
            required
          />
          <i 
            className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} absolute right-0 top-3 text-gray-300 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
          {password && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength ? strengthColors[strength - 1] : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-300">Must contain:</p>
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <i className={`bx ${req.met ? 'bx-check text-green-500' : 'bx-x text-red-500'}`}></i>
                  <span className={req.met ? 'text-green-500' : 'text-gray-400'}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative z-0">
          <i className='bx bx-lock-alt absolute left-0 top-3 text-gray-300'></i>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block py-2.5 px-8 pr-10 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder="Confirm Password"
            required
          />
          <i 
            className={`bx ${showConfirmPassword ? 'bx-show' : 'bx-hide'} absolute right-0 top-3 text-gray-300 cursor-pointer`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          ></i>
        </div>

        <button
          type="submit"
          className="group w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 mt-6"
        >
          Sign Up
          <span className="ml-2">→</span>
        </button>

      </form>
       <p className="text-center text-xs text-gray-400">
        Already have an account? <a href="/" className="font-semibold text-blue-400 hover:text-blue-300 transition">Sign In</a>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="relative w-screen h-screen bg-gray-900">
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <RegisterForm />
      </div>
    </main>
  );
}
