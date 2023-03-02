import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import styles from "@/components/Layout.module.css";

const Layout: React.FC<any> = (props) => {
  const router = useRouter();

  // onmount check if token is present
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    // check if jwt web token is expired
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }
  });

  return (
    <div>
      <Header />
      <div className={styles.layout}>{props.children}</div>
    </div>
  );
};

export default Layout;
