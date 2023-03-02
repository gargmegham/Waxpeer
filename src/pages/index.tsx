import React, { useState } from "react";
import Router from "next/router";
import styles from "@/styles/Login.module.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { username, password };
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      await fetch(`/api/activatebot`);

      localStorage.setItem("token", data.token);
      await Router.push("/listings");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={submitData}>
        <h1>Admin Login</h1>
        <input
          className={styles.input}
          autoFocus
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          type="text"
          value={username}
        />
        <input
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          value={password}
        />
        <input
          className={styles.cta}
          disabled={!username || !password}
          type="submit"
          value="Login"
        />
      </form>
    </div>
  );
};

export default Login;
