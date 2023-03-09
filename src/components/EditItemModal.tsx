import React from "react";
import {
  InputNumber,
  Switch,
  Button,
  Spin,
  Row,
  message,
  Col,
  Select,
  Modal,
  Form,
  Card,
} from "antd";
import { SelectedItem, EditItemModalProps } from "@/types";

const EditItemModal: React.FC<EditItemModalProps> = ({
  setShowModal,
  showModal,
  selectedItem,
}) => {
  const [inputs, setInputs] = React.useState<SelectedItem>(selectedItem);
  const [editing, setEditing] = React.useState<boolean>(false);

  const submit = async () => {
    try {
      setEditing(true);
      await fetch("/api/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ inputs }),
      });
      message.success("Item edited successfully!");
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setEditing(false);
    }
  };

  return (
    <Modal
      width={900}
      open={showModal}
      closeIcon={<></>}
      onCancel={() => {
        setShowModal(false);
      }}
      footer={[
        <Button
          key="cancel"
          disabled={editing}
          loading={editing}
          type="primary"
          danger
          onClick={() => {
            setShowModal(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          disabled={editing}
          loading={editing}
          key="submit"
          type="primary"
          onClick={submit}
        >
          Submit
        </Button>,
      ]}
    >
      <Card title={inputs.name}>
        <Form layout="vertical">
          <Row gutter={[32, 32]}>
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
                  defaultValue={inputs.undercutPrice}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  onChange={(e) => {
                    inputs.undercutPrice = Number(e);
                  }}
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
                  defaultValue={inputs.undercutPercentage}
                  formatter={(value) => `${value}%`}
                  onChange={(e) => {
                    inputs.undercutPercentage = Number(e);
                  }}
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
                  defaultValue={inputs.undercutByPriceOrPercentage}
                  onChange={(e) => {
                    inputs.undercutByPriceOrPercentage = e;
                  }}
                  style={{ width: 120 }}
                >
                  Undercut By
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[32, 32]}>
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
                  defaultValue={inputs.priceRangeMin}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  onChange={(e) => {
                    inputs.priceRangeMin = Number(e);
                  }}
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
                  defaultValue={inputs.priceRangeMax}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  onChange={(e) => {
                    inputs.priceRangeMax = Number(e);
                  }}
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
                  defaultValue={inputs.priceRangePercentage}
                  formatter={(value) => `${value}%`}
                  onChange={(e) => {
                    inputs.priceRangePercentage = Number(e);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[32, 32]}>
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
                  defaultChecked={inputs.whenNoOneToUndercutListUsing === "max"}
                  onChange={(checked) => {
                    inputs.whenNoOneToUndercutListUsing = checked
                      ? "max"
                      : "percentage";
                  }}
                  unCheckedChildren="Percentage"
                  checkedChildren="Max"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default EditItemModal;
