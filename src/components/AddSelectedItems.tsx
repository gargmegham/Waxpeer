import React from "react";
import {
  Table,
  InputNumber,
  Switch,
  Card,
  Button,
  Spin,
  Select,
  message,
} from "antd";
import { Item } from "../types";
import { AddSelectedItemsProps, SelectedItem } from "../types";

const AddSelectedItems: React.FC<AddSelectedItemsProps> = ({
  setShowSelectedItems,
  selectedItems,
}) => {
  const [items, setItems] = React.useState<Array<SelectedItem>>(
    selectedItems.map((item: Item) => {
      return {
        ...item,
        source: "buff163",
        prices: {
          buff163: {
            sourcePrice: 0,
          },
        },
        sourcePrice: 0,
        lastUpdated: new Date(),
        undercutPrice: 0.1,
        undercutPercentage: 1,
        undercutByPriceOrPercentage: "price",
        priceRangeMin: 0,
        priceRangeMax: 0,
        priceRangePercentage: 110,
        whenNoOneToUndercutListUsing: "max",
      };
    })
  );
  const [fetching, setFetching] = React.useState<boolean>(true);

  const submit = async () => {
    await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ items }),
    });
    setShowSelectedItems(false);
  };

  const actions = (
    <>
      <Button style={{ marginRight: "10px" }} type="primary" onClick={submit}>
        Submit
      </Button>
      <Button
        type="primary"
        danger
        onClick={() => {
          setShowSelectedItems(false);
        }}
      >
        Cancel
      </Button>
    </>
  );

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
          body: JSON.stringify({ selectedItems }),
        });
        data = await res.json();
        setFetching(false);
        if (data.status === false) {
          // if error
          message.error(data.message);
          setShowSelectedItems(false);
        }
        setItems(
          // if success
          (value) =>
            value.map((item: SelectedItem) => {
              return {
                ...item,
                sourcePrice: data.items[item.name].item.prices[item.source]
                  .sourcePrice
                  ? data.items[item.name].item.prices[item.source].sourcePrice /
                    100
                  : 0,
                prices: data.items[item.name].item.prices,
              };
            }) as Array<SelectedItem>
        );
      };
      fetchSourcePrices();
    } catch (e) {
      console.log("error", e);
    }
  }, []);

  return fetching ? (
    <Spin size="large" />
  ) : (
    <Card title="Add New Items To Bot" extra={actions}>
      <Table
        pagination={{
          pageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ["50", "100"],
        }}
        scroll={{ x: 1400 }}
        dataSource={items}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            fixed: "left",
          },
          {
            title: "Source",
            fixed: "left",
            dataIndex: "source",
            render: (source: string, record: SelectedItem, index: number) => {
              return (
                // options will be the keys of the prices object where sourcePrice is not null
                <Select
                  defaultValue={source}
                  style={{ width: 230 }}
                  options={Object.keys(record.prices)
                    .filter((key) => record.prices[key].sourcePrice !== null)
                    .map((key) => {
                      return {
                        value: key,
                        label: `${`$ ${
                          record.prices[key].sourcePrice / 100
                        }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${key})`,
                      };
                    })}
                  onChange={(e) => {
                    setItems(
                      items.map((item: SelectedItem, i: number) => {
                        if (i === index) {
                          return {
                            ...item,
                            source: e,
                            sourcePrice: record.prices[e].sourcePrice / 100,
                          };
                        }
                        return item;
                      })
                    );
                  }}
                >
                  Source
                </Select>
              );
            },
            width: 260,
          },
          {
            title: "Undercut Price",
            dataIndex: "undercutPrice",
            width: 120,
            render: (undercutPrice: number, record: SelectedItem) => {
              return (
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={undercutPrice}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  onChange={(e) => {
                    record.undercutPrice = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "Undercut Percentage",
            dataIndex: "undercutPercentage",
            width: 120,
            render: (undercutPercentage: number, record: SelectedItem) => {
              return (
                <InputNumber
                  min={0}
                  max={100}
                  size="large"
                  defaultValue={undercutPercentage}
                  formatter={(value) => `${value}%`}
                  // @ts-ignore
                  parser={(value) => value!.replace("%", "")}
                  onChange={(e) => {
                    record.undercutPercentage = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "Undercut By",
            dataIndex: "undercutByPriceOrPercentage",
            width: 130,
            render: (
              undercutByPriceOrPercentage: string,
              record: SelectedItem
            ) => {
              return (
                <Switch
                  defaultChecked={undercutByPriceOrPercentage === "price"}
                  onChange={(checked) => {
                    record.undercutByPriceOrPercentage = checked
                      ? "price"
                      : "percentage";
                  }}
                  unCheckedChildren="Percentage"
                  checkedChildren="Price"
                />
              );
            },
          },
          {
            title: "Range Min",
            dataIndex: "priceRangeMin",
            width: 130,
            render: (priceRangeMin: number, record: SelectedItem) => {
              return (
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={priceRangeMin}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  onChange={(e) => {
                    record.priceRangeMin = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "Range Max",
            width: 130,
            dataIndex: "priceRangeMax",
            render: (priceRangeMax: number, record: SelectedItem) => {
              return (
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={priceRangeMax}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  // @ts-ignore
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  onChange={(e) => {
                    record.priceRangeMax = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "Price Percentage",
            width: 130,
            dataIndex: "priceRangePercentage",
            render: (priceRangePercentage: number, record: SelectedItem) => {
              return (
                <InputNumber
                  defaultValue={priceRangePercentage}
                  formatter={(value) => `${value}%`}
                  // @ts-ignore
                  parser={(value) => value!.replace("%", "")}
                  onChange={(e) => {
                    record.priceRangePercentage = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "List Using (When No One To Undercut)",
            dataIndex: "whenNoOneToUndercutListUsing",
            width: 180,
            render: (
              whenNoOneToUndercutListUsing: string,
              record: SelectedItem
            ) => {
              return (
                <Switch
                  defaultChecked={whenNoOneToUndercutListUsing === "max"}
                  onChange={(checked) => {
                    record.whenNoOneToUndercutListUsing = checked
                      ? "max"
                      : "percentage";
                  }}
                  unCheckedChildren="Price Percentage"
                  checkedChildren="Range Max"
                />
              );
            },
          },
        ]}
      />
    </Card>
  );
};

export default AddSelectedItems;
