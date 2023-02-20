import React from "react";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import { Table, Card, Button, Col, Row } from "antd";
import prisma from "../lib/prisma";
import AddSelectedItems from "../components/AddSelectedItems";

type Item = {
  item_id: number;
  icon_url: string;
  name: string;
  type: string;
  active: string;
  steam_price: object;
};

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

type Inventory = {
  count: number;
  success: boolean;
  items: Array<Item>;
};

type ActiveItem = {
  item_id: number;
};

type Props = {
  activeItems: Array<ActiveItem>;
};

const MyInventory: React.FC<Props> = ({ activeItems }) => {
  const [selectedItems, setSelectedItems] = React.useState<Array<SelectedItem>>(
    []
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [inventory, setInventory] = React.useState<Inventory>({
    count: 0,
    items: [],
    success: false,
  });
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const res = await fetch("/api/inventory");
      let data = await res.json();
      data.items = data.items.map((item: Item) => {
        return {
          ...item,
          key: item.item_id,
          active: activeItems.some(
            (activeItem: ActiveItem) => activeItem.item_id === item.item_id
          )
            ? "Active"
            : "Inactive",
        };
      });
      setInventory(data);
      setLoading(false);
    };
    fetchInventory();
  }, [activeItems]);

  const rowSelection = {
    getCheckboxProps: (record: Item) => ({
      disabled: record.active === "Active",
    }),
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedItems(
        selectedRows.map((item: Item) => {
          return {
            ...item,
            active: true,
            source: null,
            sourcePrice: null,
            lastUpdated: null,
            undercutPrice: null,
            undercutPercentage: 1,
            currentPrice: null,
            undercutByPriceOrPercentage: 0,
            priceRangeMin: null,
            priceRangeMax: null,
            priceRangePercentage: 110,
            whenNoOneToUndercutListUsing: "percentage",
          };
        })
      );
    },
  };

  return loading ? (
    <Layout>
      <div>Loading...</div>
    </Layout>
  ) : (
    <Layout>
      {!showModal ? (
        <Card
          title="My Inventory"
          extra={
            <Button
              type="primary"
              disabled={selectedItems.length === 0}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Confirm Selection
            </Button>
          }
        >
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            dataSource={inventory.items}
            columns={[
              {
                title: "Item",
                dataIndex: "item_id",
                key: "item_id",
              },
              {
                title: "Name",
                dataIndex: "name",
              },
              {
                title: "Type",
                dataIndex: "type",
              },
              {
                title: "Active",
                dataIndex: "active",
              },
            ]}
          />
        </Card>
      ) : (
        <AddSelectedItems
          showModal={showModal}
          setShowModal={setShowModal}
          selectedItems={selectedItems}
        ></AddSelectedItems>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const activeItems: Array<ActiveItem> = await prisma.item.findMany({
    where: { active: true },
    select: {
      item_id: true,
    },
  });
  return {
    props: { activeItems },
  };
};

export default MyInventory;
