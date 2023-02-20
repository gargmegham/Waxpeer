import React from "react";
import { Table, InputNumber, Switch, Card, Button, Select } from "antd";
import { sources } from "../constants";

type SelectedItem = {
  item_id: number;
  icon_url: string;
  name: string;
  type: string;
  active: string;
  steam_price: object;
  source: string;
  sourcePrice: number;
  lastUpdated: Date;
  undercutPrice: number;
  undercutPercentage: number;
  currentPrice: number;
  undercutByPriceOrPercentage: number;
  priceRangeMin: number;
  priceRangeMax: number;
  priceRangePercentage: number;
  whenNoOneToUndercutListUsing: string;
};

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: Array<SelectedItem>;
};

const AddSelectedItems: React.FC<Props> = ({ setShowModal, selectedItems }) => {
  return (
    <Card
      title="Add New Items To Bot"
      extra={
        <>
          <Button
            style={{ marginRight: "10px" }}
            type="primary"
            onClick={async () => {
              const itemIds = selectedItems.map((item: any) => item.item_id);
              await fetch("/api/active-items", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemIds }),
              });
              setShowModal(false);
            }}
          >
            Submit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </Button>
        </>
      }
    >
      <Table
        scroll={{ x: 2200 }}
        dataSource={selectedItems}
        columns={[
          {
            title: "Item",
            dataIndex: "item_id",
            key: "item_id",
            fixed: "left",
          },
          {
            title: "Name",
            dataIndex: "name",
            fixed: "left",
          },
          {
            title: "Source",
            dataIndex: "source",
            render: (source: string, record: SelectedItem, index: number) => {
              return (
                <Select
                  defaultValue={source}
                  style={{ width: 120 }}
                  onChange={(value) => {
                    console.log(value);
                  }}
                  options={sources}
                >
                  Source
                </Select>
              );
            },
          },
          {
            title: "Source Price",
            dataIndex: "sourcePrice",
            render: (sourcePrice: number) => {
              return <span>{sourcePrice || "-"}</span>;
            },
          },
          {
            title: "Undercut Price",
            dataIndex: "undercutPrice",
            render: (undercutPrice: number, record: SelectedItem) => {
              return (
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={undercutPrice}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
            render: (undercutPercentage: number, record: SelectedItem) => {
              return (
                <InputNumber
                  min={0}
                  max={100}
                  size="large"
                  defaultValue={undercutPercentage}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value!.replace("%", "")}
                  onChange={(e) => {
                    record.undercutPercentage = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "Undercut By Price Or Percentage",
            dataIndex: "undercutByPriceOrPercentage",
            render: (
              undercutByPriceOrPercentage: number,
              record: SelectedItem
            ) => {
              return (
                <Switch
                  defaultChecked={undercutByPriceOrPercentage === 1}
                  onChange={(checked) => {
                    record.undercutByPriceOrPercentage = checked ? 1 : 0;
                  }}
                  checkedChildren="Price"
                  unCheckedChildren="Percentage"
                />
              );
            },
          },
          {
            title: "Price Range Min",
            dataIndex: "priceRangeMin",
            render: (priceRangeMin: number, record: SelectedItem) => {
              return (
                <InputNumber
                  min={0}
                  size="large"
                  defaultValue={priceRangeMin}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  onChange={(e) => {
                    record.priceRangeMin = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "Price Range Max",
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
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  onChange={(e) => {
                    record.priceRangeMax = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "Price Range Percentage",
            dataIndex: "priceRangePercentage",
            render: (priceRangePercentage: number, record: SelectedItem) => {
              return (
                <InputNumber
                  defaultValue={priceRangePercentage}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value!.replace("%", "")}
                  onChange={(e) => {
                    record.priceRangePercentage = Number(e);
                  }}
                />
              );
            },
          },
          {
            title: "When No One To Undercut List Using",
            dataIndex: "whenNoOneToUndercutListUsing",
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
                  checkedChildren="Max"
                  unCheckedChildren="Percentage"
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
