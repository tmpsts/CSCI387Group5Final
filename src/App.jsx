import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Nav from "./Components/Nav";
import Transactions from "./Components/Transactions";
import Favorites from "./Components/Favorites";
import Settings from "./Components/Settings";
import Listing from "./Components/Listing";
import ViewProfile from "./Components/ViewProfile";
import AdminPanel from "./Components/AdminPanel";
import config from "./config";

const DatabaseURL = config.DatabaseURL;

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Retrieved user from localStorage:", parsedUser);
        setUser(parsedUser);
        const currentPath = window.location.pathname;
        const basePath = "/~group5-f24/testwebsite/dist/";
        if (
          currentPath === basePath ||
          currentPath === `${basePath}index.html`
        ) {
          window.location.href = "/~group5-f24/testwebsite/dist/landing";
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
    setLoading(false);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`overflow-hidden ${darkMode ? "w-full light" : "w-full dark"}`}
    >
      <BrowserRouter basename="/~group5-f24/testwebsite/dist">
        <Routes>
          <Route
            exact
            path="/*"
            element={<Login setUser={setUser} DatabaseURL={DatabaseURL} />}
          />
          <Route
            exact
            path="/landing"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <Landing user={user} DatabaseURL={DatabaseURL} />
              </div>
            }
          />
          <Route
            exact
            path="/listing/:ListingID"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <Listing user={user} DatabaseURL={DatabaseURL} />
              </div>
            }
          />
          <Route
            exact
            path="/profile"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <Profile
                  user={user}
                  updateUser={updateUser}
                  DatabaseURL={DatabaseURL}
                />
              </div>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <ViewProfile
                  user={user}
                  updateUser={updateUser}
                  DatabaseURL={DatabaseURL}
                />
              </div>
            }
          />
          <Route
            exact
            path="/transactions/"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <Transactions
                  user={user}
                  updateUser={updateUser}
                  DatabaseURL={DatabaseURL}
                />
              </div>
            }
          />
          <Route
            exact
            path="/transactions/:transactionId"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <Transactions
                  user={user}
                  updateUser={updateUser}
                  DatabaseURL={DatabaseURL}
                />
              </div>
            }
          />
          <Route
            exact
            path="/favorites"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <Favorites
                  user={user}
                  updateUser={updateUser}
                  DatabaseURL={DatabaseURL}
                />
              </div>
            }
          />
          <Route
            exact
            path="/admin"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <AdminPanel
                  user={user}
                  updateUser={updateUser}
                  DatabaseURL={DatabaseURL}
                />
              </div>
            }
          />
          <Route
            exact
            path="/settings"
            element={
              <div className="flex">
                <Nav
                  user={user}
                  tD={toggleDarkMode}
                  hL={handleLogout}
                  DatabaseURL={DatabaseURL}
                />
                <Settings
                  user={user}
                  updateUser={updateUser}
                  DatabaseURL={DatabaseURL}
                />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
