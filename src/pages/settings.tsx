import prisma from "@/lib/prisma";
import Layout from "@/components/Layout";
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
  Table,
} from "antd";
import React from "react";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { availableSources } from "@/constants";
import AddEditPriceRangeModal from "@/components/AddEditPriceRangeModal";

const Settings: React.FC<any> = ({ settings }) => {
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [priceRanges, setPriceRanges] = React.useState<any>(
    settings.priceRange
  );
  const [showAddEditPriceRangeModal, setShowAddEditPriceRangeModal] =
    React.useState<boolean>(false);
  const [priceRangeToEdit, setPriceRangeToEdit] = React.useState<any>(null);

  const saveSettings = async (values: any) => {
    values.undercutByPriceOrPercentage = values.undercutByPriceOrPercentage
      ? "price"
      : "percentage";
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

  const deleteRange = async (id: number) => {
    await fetch("/api/pricerange", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id }),
    });
    message.success("Price range deleted!");
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
                  setPriceRanges(settings.priceRange);
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
            <Col span={6}>
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
            <Col span={6}>
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
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
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
                  formatter={(value) => `${value}%`}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Undercut By" name="undercutByPriceOrPercentage">
                <Switch
                  defaultChecked={
                    settings.undercutByPriceOrPercentage === "price"
                  }
                  unCheckedChildren="Percentage"
                  checkedChildren="Price"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Waxpeer API Key</Col>
            <Col span={12}>
              <Form.Item
                name="waxpeerApiKey"
                rules={[{ required: true, message: "Required field!" }]}
              >
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Priceempire API Key</Col>
            <Col span={12}>
              <Form.Item name="priceEmpireApiKey">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Status</Col>
            <Col span={4}>
              <Form.Item name="paused" valuePropName="checked">
                <Switch
                  defaultChecked={settings.paused}
                  unCheckedChildren="Running"
                  checkedChildren="Paused"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "20px", fontSize: "26px" }}>
            <Col span={4}>Float Update Frequency (In Minutes)</Col>
            <Col span={4}>
              <Form.Item name="floatBotFrequency">
                <InputNumber disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={4}>WaxPeer API Frequency (In Minute)</Col>
            <Col span={4}>
              <Form.Item name="waxpeerRateLimit">
                <InputNumber disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={4}>PriceEmpire API Frequency (In Minutes)</Col>
            <Col span={4}>
              <Form.Item name="priceEmpireRateLimit">
                <InputNumber disabled={!editMode} />
              </Form.Item>
            </Col>
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
      <Card
        style={{ marginTop: "20px" }}
        title="Price Ranges"
        extra={
          <Button
            style={{ marginLeft: "16px", marginTop: "14px" }}
            type="primary"
            onClick={() => {
              setPriceRangeToEdit(null);
              setShowAddEditPriceRangeModal(true);
            }}
          >
            + Add
          </Button>
        }
      >
        <Table
          dataSource={priceRanges.map((priceRange: any, index: number) => {
            return {
              ...priceRange,
              key: index,
            };
          })}
          columns={[
            {
              title: "From",
              dataIndex: "sourcePriceMin",
              render: (text: any, record: any) => (
                <InputNumber
                  min={0}
                  size="large"
                  disabled={true}
                  defaultValue={record.sourcePriceMin}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              ),
            },
            {
              title: "To",
              dataIndex: "sourcePriceMax",
              render: (text: any, record: any) => (
                <InputNumber
                  min={0}
                  disabled={true}
                  size="large"
                  defaultValue={record.sourcePriceMax}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              ),
            },
            {
              title: "Price Range Min",
              dataIndex: "priceRangeMin",
              render: (text: any, record: any) => (
                <InputNumber
                  min={0}
                  size="large"
                  disabled={true}
                  defaultValue={record.priceRangeMin}
                  formatter={(value) => `${value}%`}
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              ),
            },
            {
              title: "Price Range Max",
              dataIndex: "priceRangeMax",
              render: (text: any, record: any) => (
                <InputNumber
                  min={0}
                  disabled={true}
                  size="large"
                  defaultValue={record.priceRangeMax}
                  formatter={(value) => `${value}%`}
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              ),
            },
            {
              title: "Price Range Max Percentage",
              dataIndex: "priceRangePercentage",
              render: (text: any, record: any) => (
                <InputNumber
                  min={0}
                  disabled={true}
                  size="large"
                  defaultValue={record.priceRangePercentage}
                  formatter={(value) => `${value}%`}
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              ),
            },
            {
              title: "When No One To Undercut",
              dataIndex: "whenNoOneToUndercutListUsing",
              render: (text: any, record: any) => (
                <Switch
                  defaultChecked={
                    record.whenNoOneToUndercutListUsing === "max" ? true : false
                  }
                  unCheckedChildren="Percentage"
                  disabled={true}
                  checkedChildren="Max"
                />
              ),
            },
            {
              title: "Delete",
              dataIndex: "delete",
              render: (text: any, record: any, index: number) => (
                <>
                  <Button
                    style={{ marginRight: "16px" }}
                    type="primary"
                    onClick={() => {
                      setPriceRangeToEdit(record);
                      setShowAddEditPriceRangeModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      deleteRange(record.id);
                    }}
                  >
                    Delete
                  </Button>
                </>
              ),
            },
          ]}
        />
      </Card>
      {showAddEditPriceRangeModal ? (
        <AddEditPriceRangeModal
          showModal={showAddEditPriceRangeModal}
          setPriceRangeToEdit={setPriceRangeToEdit}
          setShowModal={setShowAddEditPriceRangeModal}
          priceRange={priceRangeToEdit}
          action={priceRangeToEdit ? "edit" : "add"}
        />
      ) : null}
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
  return {
    props: {
      settings,
    },
  };
};

export default Settings;
