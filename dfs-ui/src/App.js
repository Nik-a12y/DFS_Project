// import FileManager from "./FileManager";

// function App() {
//   return <FileManager />;
// }

// export default App;



import { useState } from "react";
import FileManager from "./FileManager";
import "./App.css";

const API = "http://localhost:8080/auth";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/${page === "register" ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            page === "register"
              ? form
              : { email: form.email, password: form.password }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (page === "register") {
        setMessage("Registration successful! Please log in.");
        setForm({ name: "", email: form.email, password: "" });
        setPage("login");
      } else {
        setUser(data);
        setPage("dashboard");
        setMessage("");
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (page === "dashboard" && user) {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">☁️ CloudVault</div>
          <div className="user-info">
            <span>{user.name}</span>
            <button
              className="logout-btn"
              onClick={() => {
                setUser(null);
                setPage("login");
                setForm({ name: "", email: "", password: "" });
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard">
          <section className="welcome-card">
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h1>Welcome, {user.name}! 👋</h1>
            <p>Your Distributed File Storage System</p>
            <div className="profile-details">
              <span>✉️ {user.email}</span>
              <span>👤 {user.role}</span>
            </div>
          </section>

          <FileManager />
        </main>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="decoration-content">
          <div className="cloud-icon">☁</div>
          <h1>Your files.<br />Your space.</h1>
          <p>
            Store, access and manage your files with a distributed storage
            system.
          </p>
          <div className="feature-item">✓ Reliable file storage</div>
          <div className="feature-item">✓ Easy file access</div>
          <div className="feature-item">✓ Personal workspace</div>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="mobile-brand">☁️ CloudVault</div>

          <div className="auth-icon">🔐</div>

          <p className="eyebrow">
            {page === "register" ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
          </p>

          <h2>
            {page === "register" ? "Create account" : "Sign in"}
          </h2>

          <p className="auth-subtitle">
            {page === "register"
              ? "Join us and manage your files in one place."
              : "Enter your details to access your workspace."}
          </p>

          {message && (
            <div className="message-box" role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {page === "register" && (
              <div className="form-group">
                <label>Full name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : page === "register"
                ? "Create account →"
                : "Sign in →"}
            </button>
          </form>

          <div className="switch-page">
            {page === "register"
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setPage(page === "register" ? "login" : "register");
                setMessage("");
              }}
            >
              {page === "register" ? "Sign in" : "Create account"}
            </button>
          </div>

          <p className="security-note">
            🔒 Your password is securely hashed by the backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;