import React, { useState } from "react";
import Router from "next/router";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Spin } from "antd";
import styles from "@/styles/Login.module.css";

export type LoginProps = {
  signup: boolean;
};

const Login: React.FC<LoginProps> = ({ signup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = { username, password, signup };
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
      await Router.push("/listings");
    } catch (error) {
      console.error(error);
    } finally {
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
          <Spin
            style={{
              marginTop: "20px",
            }}
          />
        ) : (
          <input
            className={styles.cta}
            disabled={!username || !password}
            type="submit"
            value={signup ? "Signup" : "Login"}
          />
        )}
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const numberOfUsers: number = await prisma.user.count({
    where: { username: "admin" },
  });
  return {
    props: { signup: numberOfUsers === 0 },
  };
};

export default Login;
