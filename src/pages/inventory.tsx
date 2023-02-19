import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import styles from "@/styles/Inventory.module.css";

type Props = {
  inventory: PostProps[];
};

const Inventory: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div>
        <h1>My Waxpeer Inventory</h1>
        <main>
          {props.inventory.map((post) => (
            <div key={post.id} className={styles.post}>
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const inventory = await prisma.post.findMany({
    where: { published: false },
    include: { author: true },
  });
  return {
    props: { inventory },
  };
};

export default Inventory;
