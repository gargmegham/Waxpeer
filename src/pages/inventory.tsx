import React from "react";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import { Table, Spin, Card, Button, Input } from "antd";
import prisma from "../lib/prisma";
import AddSelectedItems from "../components/AddSelectedItems";
import { message } from "antd";

type Item = {
  item_id: number;
  icon_url: string;
  name: string;
  type: string;
  active: string;
  steam_price: object;
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
  const [selectedItems, setSelectedItems] = React.useState<Array<Item>>([]);
  const [search, setSearch] = React.useState<string>("");
  const [showSelectedItems, setShowSelectedItems] =
    React.useState<boolean>(false);
  const [inventory, setInventory] = React.useState<Inventory>({
    count: 0,
    items: [],
    success: false,
  });
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/inventory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let data = await res.json();
      data.items = data.items.map((item: Item) => {
        return {
          ...item,
          key: item.item_id,
          active: activeItems.some(
            (activeItem: ActiveItem) =>
              String(activeItem.item_id) === String(item.item_id)
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
    onChange: (selectedRowKeys: any, selectedRows: Array<Item>) => {
      setSelectedItems(selectedRows);
    },
  };

  return loading ? (
    <Layout>
      <Spin size="large" />
    </Layout>
  ) : (
    <Layout>
      {!showSelectedItems ? (
        <Card
          title="My Inventory"
          extra={
            <Button
              type="primary"
              disabled={selectedItems.length === 0}
              onClick={() => {
                selectedItems.length > 10
                  ? message.error("You can only select 10 items at a time")
                  : setShowSelectedItems(true);
              }}
            >
              Confirm Selection
            </Button>
          }
        >
          <Input
            placeholder="Search by name..."
            style={{ width: "100%", marginBottom: "10px" }}
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />
          <Table
            pagination={{
              pageSize: 50,
              showSizeChanger: true,
              pageSizeOptions: ["50", "100"],
            }}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            dataSource={inventory.items.filter(
              (item: Item) =>
                item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
            )}
            columns={[
              {
                title: "Item",
                dataIndex: "item_id",
                key: "item_id",
                sortDirections: ["descend", "ascend"],
                sorter: (a: Item, b: Item) => a.item_id - b.item_id,
              },
              {
                title: "Name",
                dataIndex: "name",
                defaultSortOrder: "descend",
                sortDirections: ["descend", "ascend"],
                sorter: (a: Item, b: Item) => a.name.localeCompare(b.name),
              },
              {
                title: "Type",
                dataIndex: "type",
                defaultSortOrder: "descend",
                sortDirections: ["descend", "ascend"],
                sorter: (a: Item, b: Item) => a.type.localeCompare(b.type),
              },
              {
                title: "Active",
                dataIndex: "active",
                filters: [
                  {
                    text: "Active",
                    value: "Active",
                  },
                  {
                    text: "Inactive",
                    value: "Inactive",
                  },
                ],
                // @ts-ignore
                onFilter: (value: string, record: Item) =>
                  record.active.indexOf(value) === 0,
              },
            ]}
          />
        </Card>
      ) : (
        <AddSelectedItems
          setShowSelectedItems={setShowSelectedItems}
          selectedItems={selectedItems}
        ></AddSelectedItems>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const activeItems: Array<any> = await prisma.item.findMany({
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
export type { Item };
