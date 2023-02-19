import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/components/Header.module.css";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  // onmount check if token is present
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  });

  return (
    <nav>
      <div className={styles.left}>
        <Link href="/" legacyBehavior>
          <a className={styles.bold} data-active={isActive("/")}>
            Listings
          </a>
        </Link>
        <Link href="/drafts" legacyBehavior>
          <a data-active={isActive("/drafts")}>Inventory</a>
        </Link>
      </div>
      <div className={styles.right}>
        <Link href="/settings" legacyBehavior>
          <a data-active={isActive("/settings")}>Settings</a>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
