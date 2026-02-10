import { useState } from "react";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/enertech/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: usernameOrEmail,
          password: password
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.role === '1') {
          window.location.href = '/actual-expenses';
        } else {
          alert('Login successful!');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Sign in to continue</h2>
      </div>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="relative z-0">
          <i className='bx bx-user absolute left-0 top-3 text-gray-300'></i>
          <input
            type="text"
            id="floating_email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="block py-2.5 px-8 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" " 
            required
          />
          <label
            htmlFor="floating_email"
            className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 left-8 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Username or Email
          </label>
        </div>
        <div className="relative z-0">
          <i className='bx bx-lock-alt absolute left-0 top-3 text-gray-300'></i>
          <input
            type={showPassword ? "text" : "password"}
            id="floating_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block py-2.5 px-8 pr-10 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_password"
            className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 left-8 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          <i 
            className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} absolute right-0 top-3 text-gray-300 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <button
          type="submit"
          className="group w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300"
        >
          Sign In
          <span className="ml-2">→</span>
        </button>

      </form>
       <p className="text-center text-xs text-gray-400">
        Don't have an account? <a href="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition">Sign Up</a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative w-screen h-screen bg-gray-900">
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <LoginForm />
      </div>
    </main>
  );
}
