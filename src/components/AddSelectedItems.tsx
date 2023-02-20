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
  undercutByPriceOrPercentage: string;
  priceRangeMin: number;
  priceRangeMax: number;
  priceRangePercentage: number;
  whenNoOneToUndercutListUsing: string;
};

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: SelectedItem;
};

const AddSelectedItems: React.FC<Props> = ({ setShowModal, selectedItem }) => {
  const [sourcePrices, setSourcePrices] = React.useState<any>({});
  const [fetching, setFetching] = React.useState<boolean>(true);

  React.useEffect(() => {
    try {
      const fetchSourcePrices = async () => {
        var myHeaders = new Headers();
        const hashed_name = encodeURIComponent(selectedItem.name);
        const sourceString = sources.map((source) => source.value).join(",");
        myHeaders.append("accept", "application/json");
        const apiKey = "ab661d74-39c2-4d6b-9529-33c571a9ee45";
        const res = await fetch(
          `https://pricempire.com/api/v2/getItemByName/${hashed_name}?api_key=${apiKey}&currency=USD&source=${sourceString}`,
          {
            method: "GET",
            headers: myHeaders,
          }
        );
        const data = await res.json();
        setFetching(false);
        if (data.status === false) message.error(data.message);
        else {
          setSourcePrices(data.item.prices);
          selectedItem.sourcePrice =
            data.item.prices[selectedItem.source].sourcePrice;
        }
      };
      fetchSourcePrices();
    } catch (e) {
      console.log(e);
    }
  });

  return fetching ? (
    <Spin size="large" />
  ) : (
    <Card
      title="Add New Items To Bot"
      extra={
        <>
          <Button
            style={{ marginRight: "10px" }}
            type="primary"
            onClick={async () => {
              await fetch("/api/item", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ selectedItem }),
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
        pagination={{
          pageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ["50", "100"],
        }}
        scroll={{ x: 2200 }}
        dataSource={[selectedItem]}
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
                    record.source = value;
                    record.sourcePrice = sourcePrices[value].sourcePrice || 0;
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
            title: "Undercut By Price Or Percentage",
            dataIndex: "undercutByPriceOrPercentage",
            render: (
              undercutByPriceOrPercentage: number,
              record: SelectedItem
            ) => {
              return (
                <Switch
                  defaultChecked={undercutByPriceOrPercentage === "percentage"}
                  onChange={(checked) => {
                    record.undercutByPriceOrPercentage = !checked
                      ? "price"
                      : "percentage";
                  }}
                  checkedChildren="Percentage"
                  unCheckedChildren="Price"
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
            title: "Price Range Percentage",
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
                  unCheckedChildren="Percentage"
                  checkedChildren="Max"
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
