import React, { useState } from "react";
export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsAuth(true);
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Login thất bại");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi mạng hoặc server");
    }
  };

  return (
    <div
  className="login-box"
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 400,
  }}
>
      <div className="login-logo">
        <a href="/"><b>Admin</b>LTE</a>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
          <p className="login-box-msg">Sign in to start your session</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="input-group-text"><span className="bi bi-envelope"></span></div>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="input-group-text"><span className="bi bi-lock-fill"></span></div>
            </div>
            <div className="row">
              <div className="col-8">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                  <label className="form-check-label" htmlFor="flexCheckDefault"> Remember Me </label>
                </div>
              </div>
              <div className="col-4">
                <button type="submit" className="btn btn-primary w-100">Sign In</button>
              </div>
            </div>
          </form>
          {message && <p style={{ marginTop: 15 }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
