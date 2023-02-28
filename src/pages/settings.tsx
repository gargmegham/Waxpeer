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
  Select,
  Col,
  Row,
  Switch,
} from "antd";
import React from "react";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { availableSources } from "../constants";

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
            <Col span={4}>
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
            <Col span={4}>Price Empire API limit</Col>
            <Col span={4}>
              <Form.Item
                name="priceEmpireRateLimit"
                rules={[{ required: true, message: "Required field!" }]}
              >
                <InputNumber
                  disabled={!editMode}
                  defaultValue={settings.PriceEmpireRateLimit}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={8}>
              <Form.Item
                label="Source"
                name="source"
                rules={[
                  {
                    required: true,
                    message: "Please select a source",
                  },
                ]}
              >
                <Select
                  defaultValue={settings.source}
                  style={{ width: 230 }}
                  options={availableSources.map((source: string) => ({
                    label: source,
                    value: source,
                  }))}
                >
                  Source
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={8}>
              <Form.Item
                label="Undercut Price"
                name="undercutPrice"
                rules={[
                  {
                    required: true,
                    message: "Please input undercut price!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={settings.undercutPrice}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Undercut Percentage"
                name="undercutPercentage"
                rules={[
                  {
                    required: true,
                    message: "Please input undercut percentage!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={settings.undercutPercentage}
                  formatter={(value) => `${value}%`}
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Undercut By"
                name="undercutByPriceOrPercentage"
                rules={[
                  {
                    required: true,
                    message: "Please select undercut by price or percentage!",
                  },
                ]}
              >
                <Select
                  options={[
                    {
                      label: "Price",
                      value: "price",
                    },
                    {
                      label: "Percentage",
                      value: "percentage",
                    },
                  ]}
                  defaultValue={settings.undercutByPriceOrPercentage}
                  style={{ width: 120 }}
                >
                  Undercut By
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={8}>
              <Form.Item
                label="Price Range Min"
                name="priceRangeMin"
                rules={[
                  {
                    required: true,
                    message: "Please input price range min!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={settings.priceRangeMin}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Price Range Max"
                name="priceRangeMax"
                rules={[
                  {
                    required: true,
                    message: "Please input price range max!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={settings.priceRangeMax}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Price Range Min Percentage"
                name="priceRangePercentage"
                rules={[
                  {
                    required: true,
                    message: "Please input price range percentage!",
                  },
                ]}
              >
                <InputNumber
                  defaultValue={settings.priceRangePercentage}
                  formatter={(value) => `${value}%`}
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={16}>
              <Form.Item
                label="When No One To Undercut List Using"
                name="whenNoOneToUndercutListUsing"
                rules={[
                  {
                    required: true,
                    message:
                      "Please select when no one to undercut list using!",
                  },
                ]}
              >
                <Switch
                  defaultChecked={
                    settings.whenNoOneToUndercutListUsing === "max"
                  }
                  unCheckedChildren="Percentage"
                  checkedChildren="Max"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row>
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
          </Row> */}
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
  });
  return {
    props: {
      settings,
    },
  };
};

export default Settings;
