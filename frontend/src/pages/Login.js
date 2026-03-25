import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // backend returns plain text ("Login successful")
      const data = await response.text();

      if (response.ok) {
        alert("Login successful ✅");
        console.log(data);
      } else {
        alert("Server error ❌ " + data);
      }

    } catch (error) {
      console.error(error);
      alert("Backend not reachable ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={handleLogin} style={{ marginLeft: "10px" }}>
        Login
      </button>
    </div>
  );
}

export default Login;