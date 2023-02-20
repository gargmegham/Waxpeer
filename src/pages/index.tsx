import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import styles from "@/styles/Blog.module.css";

const Blog: React.FC = (props) => {
  return (
    <Layout>
      <div>
        <h1>My Blog</h1>
        <main></main>
      </div>
    </Layout>
  );
};

export default Blog;
