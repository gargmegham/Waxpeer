import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import {
  Card,
  Input,
  Button,
  message,
  InputNumber,
  Form,
  Col,
  Row,
  Switch,
  Space,
} from "antd";
import React from "react";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const Settings: React.FC<any> = ({ settings }) => {
  const [editMode, setEditMode] = React.useState<boolean>(false);

  const saveSettings = async (values: any) => {
    setEditMode(false);
    await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ values }),
    });
    message.success("Settings updated!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

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
              <Button
                style={{ marginRight: "16px" }}
                onClick={() => {
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
            )}
          </>
        }
      >
        <Form
          title="Update Settings"
          layout="vertical"
          key={`${editMode}-settings`}
          initialValues={settings}
          disabled={!editMode}
          onFinish={saveSettings}
        >
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Waxpeer API Key</Col>
            <Col span={12}>
              <Form.Item
                name="waxpeerApiKey"
                rules={[{ required: true, message: "Required field!" }]}
              >
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
              <Form.Item
                name="priceEmpireApiKey"
                rules={[{ required: true, message: "Required field!" }]}
              >
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
              <Form.Item name="paused" valuePropName="paused">
                <Switch
                  defaultChecked={settings.paused}
                  disabled={!editMode}
                  checkedChildren={"Paused"}
                  unCheckedChildren={"Running"}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>WaxPeer API limit</Col>
            <Col span={8}>
              <Form.Item
                name="waxpeerRateLimit"
                rules={[{ required: true, message: "Required field!" }]}
              >
                <InputNumber
                  disabled={!editMode}
                  defaultValue={settings.waxpeerRateLimit}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Price Empire API limit</Col>
            <Col span={8}>
              <Form.Item
                name="PriceEmpireRateLimit"
                rules={[{ required: true, message: "Required field!" }]}
              >
                <InputNumber
                  disabled={!editMode}
                  defaultValue={settings.PriceEmpireRateLimit}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.List name="sights">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="Price"
                        name={[field.name, "price"]}
                        rules={[{ required: true, message: "Missing price" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Price"
                        name={[field.name, "price"]}
                        rules={[{ required: true, message: "Missing price" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Price"
                        name={[field.name, "price"]}
                        rules={[{ required: true, message: "Missing price" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Price"
                        name={[field.name, "price"]}
                        rules={[{ required: true, message: "Missing price" }]}
                      >
                        <Input />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Row>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add sights
                      </Button>
                    </Form.Item>
                  </Row>
                </>
              )}
            </Form.List>
          </Row>
          {editMode ? (
            <Row>
              <Col span={4}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          ) : null}
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
    include: {
      priceRange: true,
    },
  });
  console.log(settings);
  return {
    props: {
      settings,
    },
  };
};

export default Settings;
