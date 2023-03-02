import React from "react";
import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import { Table, Spin, Card, Button, Input } from "antd";
import prisma from "../lib/prisma";
import { message } from "antd";
import { Item, Inventory, ActiveItem, MyInventoryProps } from "../types";

const MyInventory: React.FC<MyInventoryProps> = ({ activeItems }) => {
  const [selectedItems, setSelectedItems] = React.useState<Array<Item>>([]);
  const [search, setSearch] = React.useState<string>("");
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
      data.items = data.items
        .map((item: Item) => {
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
        })
        .filter((item: Item) => item.active === "Inactive");
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

  const addItems = async (addAll: boolean) => {
    const items: Array<Item> = addAll ? inventory.items : selectedItems;
    await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ items }),
    });
    message.success("Items added successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return loading ? (
    <Layout>
      <Spin size="large" />
    </Layout>
  ) : (
    <Layout>
      <Card
        title="My Inventory"
        extra={
          <>
            <Button
              type="primary"
              disabled={selectedItems.length !== 0}
              style={{ marginRight: "10px" }}
              onClick={() => {
                addItems(true);
              }}
            >
              Add All
            </Button>
            <Button
              type="primary"
              disabled={selectedItems.length === 0}
              onClick={() => {
                addItems(false);
              }}
            >
              Add Selected
            </Button>
          </>
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
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
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
          ]}
        />
      </Card>
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
