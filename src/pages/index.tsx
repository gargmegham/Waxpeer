import React from "react";
import {
  Table,
  Input,
  Modal,
  message,
  InputNumber,
  Switch,
  Card,
  Button,
} from "antd";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import EditOutlined from "@ant-design/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { GetServerSideProps } from "next";
import EditItemModal from "../components/EditItemModal";

const Listings: React.FC<any> = ({ items }) => {
  const [search, setSearch] = React.useState<string>("");
  const [editItemModalVisible, setEditItemModalVisible] =
    React.useState<boolean>(false);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] =
    React.useState<boolean>(false);
  const [deleteConfirmModalItem, setDeleteConfirmModalItem] =
    React.useState<any>(null);
  const [editItemModalItem, setEditItemModalItem] = React.useState<any>(null);

  const deleteItem = async () => {
    await fetch("/api/items", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: deleteConfirmModalItem.id }),
    });
    message.success("Item deleted");
    setDeleteConfirmModalVisible(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Layout>
      <Card title="Currently Live Bot Trades">
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
          dataSource={items.filter(
            (item: any) =>
              item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          )}
          scroll={{ x: 1400 }}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
              fixed: "left",
              width: 250,
            },
            {
              title: "Edit/Delete",
              fixed: "left",
              width: 150,
              render: (val: string, record: any, index: number) => {
                return (
                  <>
                    <Button
                      style={{ marginRight: "6px" }}
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditItemModalItem(record);
                        setEditItemModalVisible(true);
                      }}
                    ></Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setDeleteConfirmModalItem(record);
                        setDeleteConfirmModalVisible(true);
                      }}
                    ></Button>
                  </>
                );
              },
            },
            {
              title: "Source",
              dataIndex: "source",
              width: 100,
            },
            {
              title: "Source Price",
              dataIndex: "sourcePrice",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.item_id - b.item_id,
              render: (sourcePrice: number) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={sourcePrice}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                );
              },
              width: 150,
            },
            {
              title: "Current Price",
              dataIndex: "currentPrice",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.item_id - b.item_id,
              render: (sourcePrice: number) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={sourcePrice}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                );
              },
              width: 150,
            },
            {
              title: "Undercut Price",
              dataIndex: "undercutPrice",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.item_id - b.item_id,
              width: 120,
              render: (undercutPrice: number) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={undercutPrice}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                );
              },
            },
            {
              title: "Undercut Percentage",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.item_id - b.item_id,
              dataIndex: "undercutPercentage",
              width: 120,
              render: (undercutPercentage: number) => {
                return (
                  <InputNumber
                    min={0}
                    max={100}
                    size="large"
                    defaultValue={undercutPercentage}
                    disabled={true}
                    formatter={(value) => `${value}%`}
                    // @ts-ignore
                    parser={(value) => value!.replace("%", "")}
                  />
                );
              },
            },
            {
              title: "Undercut By",
              dataIndex: "undercutByPriceOrPercentage",
              width: 130,
              render: (undercutByPriceOrPercentage: string, record: any) => {
                return (
                  <Switch
                    defaultChecked={undercutByPriceOrPercentage === "price"}
                    unCheckedChildren="Percentage"
                    disabled={true}
                    checkedChildren="Price"
                  />
                );
              },
              filters: [
                {
                  text: "Price",
                  value: "price",
                },
                {
                  text: "Percentage",
                  value: "percentage",
                },
              ],
              // @ts-ignore
              onFilter: (value: string, record: Item) =>
                record.undercutByPriceOrPercentage.indexOf(value) === 0,
            },
            {
              title: "Range Min",
              dataIndex: "priceRangeMin",
              width: 130,
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.item_id - b.item_id,
              render: (priceRangeMin: number, record: any) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={priceRangeMin}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                );
              },
            },
            {
              title: "Range Max",
              width: 130,
              dataIndex: "priceRangeMax",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.item_id - b.item_id,
              render: (priceRangeMax: number, record: any) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={priceRangeMax}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    // @ts-ignore
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                );
              },
            },
            {
              title: "Price Percentage",
              width: 130,
              dataIndex: "priceRangePercentage",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.item_id - b.item_id,
              render: (priceRangePercentage: number, record: any) => {
                return (
                  <InputNumber
                    disabled={true}
                    defaultValue={priceRangePercentage}
                    formatter={(value) => `${value}%`}
                    // @ts-ignore
                    parser={(value) => value!.replace("%", "")}
                  />
                );
              },
            },
            {
              title: "List Using (When No One To Undercut)",
              dataIndex: "whenNoOneToUndercutListUsing",
              filters: [
                {
                  text: "Range Max",
                  value: "max",
                },
                {
                  text: "Price Percentage",
                  value: "percentage",
                },
              ],
              // @ts-ignore
              onFilter: (value: string, record: Item) =>
                record.whenNoOneToUndercutListUsing.indexOf(value) === 0,
              width: 180,
              render: (whenNoOneToUndercutListUsing: string, record: any) => {
                return (
                  <Switch
                    defaultChecked={whenNoOneToUndercutListUsing === "max"}
                    disabled={true}
                    unCheckedChildren="Price Percentage"
                    checkedChildren="Range Max"
                  />
                );
              },
            },
          ]}
        />
      </Card>
      {editItemModalVisible ? (
        <EditItemModal
          showModal={editItemModalVisible}
          setShowModal={setEditItemModalVisible}
          selectedItem={editItemModalItem}
        />
      ) : null}
      {deleteConfirmModalVisible ? (
        <Modal
          title="Delete Item"
          okButtonProps={{
            style: {
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
            },
          }}
          okText="Delete"
          cancelText="No"
          open={deleteConfirmModalVisible}
          onOk={deleteItem}
          onCancel={() => setDeleteConfirmModalVisible(false)}
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      ) : null}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const items: Array<any> = await prisma.item.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      type: true,
      item_id: true,
      source: true,
      sourcePrice: true,
      currentPrice: true,
      lastUpdated: true,
      undercutPrice: true,
      undercutPercentage: true,
      undercutByPriceOrPercentage: true,
      priceRangeMin: true,
      priceRangeMax: true,
      priceRangePercentage: true,
      whenNoOneToUndercutListUsing: true,
    },
  });
  return {
    props: { items },
  };
};
export default Listings;
