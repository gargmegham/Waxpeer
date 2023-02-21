import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import { Card, Input, Button, InputNumber, Form, Col, Row, Switch } from "antd";
import React from "react";
import EditOutlined from "@ant-design/icons/EditOutlined";

const Settings: React.FC<any> = ({ settings }) => {
  const [editMode, setEditMode] = React.useState<boolean>(false);

  return (
    <Layout>
      <Card
        title="Settings"
        extra={
          <>
            {!editMode ? (
              <Button
                style={{ marginRight: "6px" }}
                danger
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <EditOutlined />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  style={{ marginRight: "16px" }}
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Save
                </Button>
              </>
            )}
          </>
        }
      >
        <Form
          title="Update Settings"
          layout="vertical"
          key={`${editMode}-settings`}
        >
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Waxpeer API Key</Col>
            <Col span={12}>
              <Form.Item name="waxpeerApiKey">
                <Input
                  disabled={!editMode}
                  defaultValue={settings.waxpeerApiKey}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Priceempire API Key</Col>
            <Col span={12}>
              <Form.Item name="priceEmpireApiKey">
                <Input
                  disabled={!editMode}
                  defaultValue={settings.priceEmpireApiKey}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Status</Col>
            <Col span={8}>
              <Form.Item name="paused">
                <Switch
                  defaultChecked={!settings.paused}
                  disabled={!editMode}
                  checkedChildren={"Running"}
                  unCheckedChildren={"Paused"}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Bot Frequency In Minutes</Col>
            <Col span={8}>
              <Form.Item name="botInterval">
                <InputNumber
                  disabled={!editMode}
                  defaultValue={settings.botInterval}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
