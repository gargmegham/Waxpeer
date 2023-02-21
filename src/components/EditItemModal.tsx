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
import mockedResponse from "../mockedResponse";
import { SelectedItem, EditItemModalProps } from "../types";

const EditItemModal: React.FC<EditItemModalProps> = ({
  setShowModal,
  showModal,
  selectedItem,
}) => {
  const [inputs, setInputs] = React.useState<SelectedItem>(selectedItem);
  const [fetching, setFetching] = React.useState<boolean>(true);

  const submit = async () => {};

  React.useEffect(() => {
    try {
      const fetchSourcePrices = async () => {
        let data: any;
        const res = await fetch("/api/priceempire", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ selectedItems: [selectedItem] }),
        });
        data = await res.json();
        setFetching(false);
        if (data.status === false) {
          // if error
          message.error(data.message);
          setShowModal(false);
        }
        setInputs(
          // if success
          (value: SelectedItem) => {
            return {
              ...value,
              sourcePrice: data.items[value.name].item.prices[value.source]
                .sourcePrice
                ? data.items[value.name].item.prices[value.source].sourcePrice /
                  100
                : 0,
              prices: data.items[value.name].item.prices,
            } as SelectedItem;
          }
        );
      };
      fetchSourcePrices();
    } catch (e) {
      console.log("error", e);
    }
  }, []);

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
            setShowModal(false);
          }}
        >
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={submit}>
          Submit
        </Button>,
      ]}
    >
      {fetching ? (
        <Spin />
      ) : (
        <Card title={inputs.name}>
          <Form layout="vertical">
            <Row gutter={[32, 32]}>
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
                    defaultValue={inputs.source}
                    style={{ width: 230 }}
                    options={Object.keys(inputs.prices)
                      .filter((key) => inputs.prices[key].sourcePrice !== null)
                      .map((key) => {
                        return {
                          value: key,
                          label: `${`$ ${
                            inputs.prices[key].sourcePrice / 100
                          }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${key})`,
                        };
                      })}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        source: e,
                        sourcePrice: inputs.prices[e].sourcePrice / 100,
                      });
                    }}
                  >
                    Source
                  </Select>
                </Form.Item>
              </Col>
            </Row>
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
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
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
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
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
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
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
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
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
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
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
                    defaultChecked={
                      inputs.whenNoOneToUndercutListUsing === "max"
                    }
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
      )}
    </Modal>
  );
};

export default EditItemModal;
