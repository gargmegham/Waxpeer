import React from "react";
import Layout from "@/components/Layout";
import { GetServerSideProps } from "next";
import {
  Table,
  Spin,
  Select,
  InputNumber,
  Form,
  Card,
  Button,
  Modal,
  Input,
} from "antd";
import prisma from "@/lib/prisma";
import { message } from "antd";
import { Item, Inventory, ActiveItem, MyInventoryProps } from "@/types";

const MyInventory: React.FC<MyInventoryProps> = ({ activeItems, settings }) => {
  const [selectedItems, setSelectedItems] = React.useState<Array<Item>>([]);
  const [search, setSearch] = React.useState<string>("");
  const [listingModal, setListingModal] = React.useState(false);
  const [listing, setListing] = React.useState<boolean>(false);

  React.useState<boolean>(false);
  const [inventory, setInventory] = React.useState<Inventory>({
    count: 0,
    items: [],
    success: false,
  });
  const [loading, setLoading] = React.useState<boolean>(true);

  const saveListingSettings = async (values: any) => {
    try {
      setListing(true);
      setListingModal(false);
      await fetch("/api/listing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ values, items: inventory.items }),
      });
      message.success("Listings added!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setListing(false);
    }
  };

  React.useEffect(() => {
    fetch(`/api/activatebot`);
  }, []);

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
              type="default"
              style={{ marginRight: "10px" }}
              loading={listing}
              disabled={listing}
              onClick={() => setListingModal(true)}
            >
              List from range
            </Button>
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
            },
            {
              title: "Name",
              dataIndex: "name",
              defaultSortOrder: "descend",
            },
            {
              title: "Type",
              dataIndex: "type",
              defaultSortOrder: "descend",
            },
          ]}
        />
      </Card>
      {listingModal ? (
        <Modal
          open={listingModal}
          title="List From Range"
          onCancel={() => setListingModal(false)}
          footer={null}
        >
          <Form
            style={{
              padding: "10px",
            }}
            name="listing-settings"
            layout="vertical"
            onFinish={saveListingSettings}
            initialValues={settings}
          >
            <Form.Item
              label="List Items From"
              name="listItemFrom"
              rules={[
                {
                  required: true,
                  message: "Please select a value!",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="List Items To"
              name="listItemTo"
              rules={[
                {
                  required: true,
                  message: "Please select a value!",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="List Using"
              name="listUsing"
              rules={[
                {
                  required: true,
                  message: "Please select a value!",
                },
              ]}
            >
              <Select>
                <Select.Option value="price-range">Price Range</Select.Option>
                <Select.Option value="list-percentage">
                  List Percentage
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Listing Percentage" name="listingPercentage">
              <InputNumber min={100} />
            </Form.Item>
            <Form.Item
              label="How Many Items To List At A Time"
              name="noOfItemsRoListAtATime"
              rules={[
                {
                  required: true,
                  message: "Please select a value!",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              List
            </Button>
          </Form>
        </Modal>
      ) : null}
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
  const settings = await prisma.settings.findUnique({
    where: {
      id: 1,
    },
  });
  return {
    props: { activeItems, settings },
  };
};

export default MyInventory;
