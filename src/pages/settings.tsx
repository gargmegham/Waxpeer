import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import { Card, Row } from "antd";
import React from "react";
/*
model Settings {
  id Int @id @default(autoincrement())
  userId Int
  waxpeerApiKey String?
  priceEmpireApiKey String?
  botInterval Int?
  paused Boolean @default(false)
} */

const Settings: React.FC<any> = ({ settings }) => {
  console.log(settings);
  return (
    <Layout>
      <Card title="Settings">
        <Row></Row>
        <Row></Row>
        <Row></Row>
      </Card>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const settings = await prisma.settings.findUnique({
    where: {
      id: 1,
    },
  });
  return {
    props: {
      settings,
    },
  };
};

export default Settings;
