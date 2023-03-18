import React from "react";
import Link from "next/link";
import { Button } from "antd";
import { useRouter } from "next/router";
import styles from "@/components/Header.module.css";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  return (
    <nav>
      <Link href="/" legacyBehavior>
        <Button danger type="primary" onClick={() => localStorage.clear()}>
          Logout
        </Button>
      </Link>
      <div className={styles.right}>
        <Link href="/listings" legacyBehavior>
          <a className={isActive("/listings") ? styles.bold : ""}>Listings</a>
        </Link>
        <Link href="/inventory" legacyBehavior>
          <a className={isActive("/inventory") ? styles.bold : ""}>Inventory</a>
        </Link>
        <Link href="/settings" legacyBehavior>
          <a className={isActive("/settings") ? styles.bold : ""}>Settings</a>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
