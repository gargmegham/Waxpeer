import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import styles from "@/components/Layout.module.css";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const router = useRouter();

  // onmount check if token is present
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // check if jwt web token is expired
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      router.push("/login");
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
