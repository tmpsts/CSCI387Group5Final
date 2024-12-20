import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Tailwind edited by: Mitchell
const Login = ({ setUser, DatabaseURL }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      fetch(`${DatabaseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log("Login successful:", data);
            console.log("Logged In: ", data.user);
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/landing");
          } else {
            console.error("Login error:", data.error);
          }
        })
        .catch((error) => console.error("Login error:", error));
    } else {
      // Registration request
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }
      fetch(`${DatabaseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log("Registration successful:", data);
            setIsLogin(true);
          } else {
            console.error("Registration error:", data.error);
          }
        })
        .catch((error) => console.error("Registration error:", error));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-between">
      <div className="w-1/4 h-screen flex bg-[#404040]">
        <div className="mx-10 flex flex-col">
          <p className="text-3xl text-white mt-10">CSCI 387 Group 5&apos;s</p>
          <p className="text-4xl text-white font-bold mt-3">
            Modern Marketplace
          </p>
          <p className="text-4xl text-white font-semibold mt-20">Created By:</p>
          <p className="text-3xl text-white mt-3">Matthew Denton</p>
          <p className="text-3xl text-white mt-3">Ethan Lindsay</p>
          <p className="text-3xl text-white mt-3">Mitchell Davis</p>
          <p className="text-3xl text-white mt-3">Tu Nguyen</p>
        </div>
      </div>
      <div className="w-3/4 h-screen flex flex-col justify-center items-center space-y-8 bg-[#303030]">
        <div className="max-w-md w-[28rem]">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              {isLogin ? "Login to your account" : "Create a new account"}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 rounded-md shadow-sm">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="relative block w-full px-3 py-2 rounded-md border placeholder-slate-300 text-gray-900 dark:text-white focus:outline-none dark:bg-[#202020] dark:border-[#151515] focus:ring-[#151515] focus:border-[#151515] focus:z-10 sm:text-sm"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 rounded-md border border-gray-300 bg-slate-50 placeholder-slate-300 text-gray-900 dark:text-white focus:outline-none dark:bg-[#202020] dark:border-[#151515] focus:ring-[#151515] focus:border-[#151515] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 rounded-md  border border-gray-300 placeholder-slate-300 text-gray-900 dark:text-white focus:outline-none dark:bg-[#202020] dark:border-[#151515] focus:ring-[#151515] focus:border-[#151515] focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="relative block w-full px-3 py-2 rounded-md  border border-gray-300 placeholder-slate-300 text-gray-900 dark:text-white focus:outline-none dark:bg-[#202020] dark:border-[#151515] focus:ring-[#151515] focus:border-[#151515] focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="w-full flex justify-center items-center">
              <button
                type="submit"
                className="w-full py-1.5 px-4 group relative flex justify-center rounded-md border border-transparent text-lg font-bold text-white dark:bg-[#454545] dark:hover:bg-[#353535] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            <button
              onClick={toggleAuthMode}
              className="font-medium text-white hover:text-[#dddddd]"
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
