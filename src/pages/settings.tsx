import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import { Card, Row } from "antd";
import React from "react";

const Settings: React.FC<any> = ({ settings }) => {
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
  const settings: any = await prisma.settings.findMany();
  return {
    props: {
      settings,
    },
  };
};

export default Settings;
