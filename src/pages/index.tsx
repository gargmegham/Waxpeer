import React, { useState } from "react";
import Router from "next/router";
import { Spin } from "antd";
import styles from "@/styles/Login.module.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = { username, password };
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      await fetch(`/api/activatebot`);
      if (data.error) {
        alert(data.error);
        return;
      }
      localStorage.setItem("token", data.token);
      setLoading(false);
      await Router.push("/listings");
    } catch (error) {
      console.error(error);
      setLoading(false);
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
        {loading ? (
          <Spin />
        ) : (
          <input
            className={styles.cta}
            disabled={!username || !password}
            type="submit"
            value="Login"
          />
        )}
      </form>
    </div>
  );
};

export default Login;
