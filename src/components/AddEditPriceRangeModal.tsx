import React from "react";
import {
  InputNumber,
  Switch,
  Button,
  Row,
  message,
  Col,
  Modal,
  Form,
  Card,
} from "antd";
import { PriceRange } from "@/types";

const AddEditPriceRangeModal: React.FC<any> = ({
  setShowModal,
  showModal,
  action,
  setPriceRangeToEdit,
  priceRange,
}) => {
  const [inputs, setInputs] = React.useState<PriceRange>(
    priceRange ? priceRange : {}
  );

  const submit = async () => {
    if (priceRange && priceRange.id) {
      await fetch("/api/pricerange", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ values: inputs, id: priceRange.id }),
      });
      message.success("Price range edited successfully!");
    } else {
      await fetch("/api/pricerange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ values: inputs }),
      });
      message.success("Price range added successfully!");
    }
    setShowModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
          type="primary"
          danger
          onClick={() => {
            setPriceRangeToEdit(null);
            setShowModal(false);
          }}
        >
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={submit}>
          Save
        </Button>,
      ]}
    >
      {
        <Card title={action === "add" ? "Add Price Range" : "Edit Price Range"}>
          <Form layout="vertical">
            <Row gutter={[32, 32]}>
              <Col span={8}>
                <Form.Item
                  label="From"
                  name="sourcePriceMin"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    defaultValue={inputs.sourcePriceMin || 0}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        sourcePriceMin: Number(e),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="To"
                  name="sourcePriceMax"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    defaultValue={inputs.sourcePriceMax || 0}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        sourcePriceMax: Number(e),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Price Range Min"
                  name="priceRangeMin"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    defaultValue={inputs.priceRangeMin || 0}
                    formatter={(value) => `${value}%`}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        priceRangeMin: Number(e),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[32, 32]}>
              <Col span={8}>
                <Form.Item
                  label="Price Range Max"
                  name="priceRangeMax"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    defaultValue={inputs.priceRangeMax || 0}
                    formatter={(value) => `${value}%`}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        priceRangeMax: Number(e),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Price Range Percentage"
                  name="priceRangePercentage"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    defaultValue={inputs.priceRangePercentage || 0}
                    formatter={(value) => `${value}%`}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        priceRangePercentage: Number(e),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="When No One To Undercut"
                  name="whenNoOneToUndercutListUsing"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <Switch
                    defaultChecked={
                      inputs.whenNoOneToUndercutListUsing === "max"
                        ? true
                        : false
                    }
                    unCheckedChildren="Percentage"
                    checkedChildren="Max"
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        whenNoOneToUndercutListUsing: e ? "max" : "percentage",
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[32, 32]}>
              <Col span={8}>
                <Form.Item
                  label="Undercut By Percentage Above"
                  name="priceRangeUndercutPercentageThreshold"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    defaultValue={
                      inputs.priceRangeUndercutPercentageThreshold || 0
                    }
                    formatter={(value) => `${value}%`}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        priceRangeUndercutPercentageThreshold: Number(e),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      }
    </Modal>
  );
};

export default AddEditPriceRangeModal;
