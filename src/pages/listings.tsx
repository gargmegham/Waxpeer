import React from "react";
import { Table, Input, Modal, message, InputNumber, Card, Button } from "antd";
import Layout from "@/components/Layout";
import prisma from "@/lib/prisma";
import EditOutlined from "@ant-design/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { GetServerSideProps } from "next";
import EditItemModal from "@/components/EditItemModal";
import { CheckCircleTwoTone, StopTwoTone } from "@ant-design/icons";

const Listings: React.FC<any> = ({ items }) => {
  const [search, setSearch] = React.useState<string>("");
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [switching, setSwitching] = React.useState<boolean>(false);
  const [editItemModalVisible, setEditItemModalVisible] =
    React.useState<boolean>(false);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] =
    React.useState<boolean>(false);
  const [deleteConfirmModalItem, setDeleteConfirmModalItem] =
    React.useState<any>(null);
  const [editItemModalItem, setEditItemModalItem] = React.useState<any>(null);

  const deleteItem = async (deleteAll = false) => {
    try {
      setDeleting(true);
      const ids = deleteAll
        ? items.map((item: any) => item.id)
        : [deleteConfirmModalItem.id];
      const itemIds = deleteAll
        ? items.map((item: any) => item.item_id)
        : [deleteConfirmModalItem.item_id];
      await fetch("/api/items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ids, deleteAll, itemIds }),
      });
      message.success(deleteAll ? "All Items deleted!" : "Item deleted!");
      setDeleteConfirmModalVisible(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setDeleting(false);
    }
  };

  const switchListMethod = async () => {
    try {
      setSwitching(true);
      await fetch("/api/pricerange", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("All switched to price range!");
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Layout>
      <Card
        title="Currently Live Bot Trades"
        extra={
          <>
            <Button
              style={{ marginRight: "10px" }}
              disabled={switching}
              loading={switching}
              onClick={() => {
                switchListMethod();
              }}
            >
              Switch All To Price Range
            </Button>
            <Button
              type="primary"
              disabled={deleting}
              loading={deleting}
              onClick={() => {
                deleteItem(true);
              }}
            >
              Delete All
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
          dataSource={items
            .filter(
              (item: any) =>
                item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
            )
            .map((item: any) => {
              return {
                ...item,
                key: item.id,
                pricePercentage:
                  item.currentPrice && item.sourcePrice
                    ? Math.floor((item.currentPrice / item.sourcePrice) * 100)
                    : 0,
              };
            })}
          scroll={{ x: 1400 }}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
              fixed: "left",
              width: 150,
            },
            {
              title: "Edit/Delete",
              fixed: "left",
              width: 100,
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
                      disabled={deleting}
                      loading={deleting}
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
              title: "Status",
              dataIndex: "botSuccess",
              fixed: "left",
              width: 150,
              render: (botSuccess: boolean, record: any) => {
                return (
                  <>
                    {botSuccess ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <StopTwoTone twoToneColor="#cc3434" />
                    )}{" "}
                    <span
                      style={{
                        color: botSuccess ? "#52c41a" : "#cc3434",
                        marginLeft: "6px",
                      }}
                    >
                      {record.message}
                    </span>
                  </>
                );
              },
            },
            {
              title: "Float",
              dataIndex: "floatCondition",
              width: 100,
              render: (floatCondition: number) => {
                return (
                  <InputNumber
                    size="large"
                    disabled={true}
                    defaultValue={floatCondition || "-"}
                  />
                );
              },
              sorter: (a: any, b: any) => a.item_id - b.item_id,
            },
            {
              title: "Source Price",
              dataIndex: "sourcePrice",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.sourcePrice - b.sourcePrice,
              render: (sourcePrice: number) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={sourcePrice || "-"}
                    formatter={(value) => `$ ${value}`}
                  />
                );
              },
              width: 100,
            },
            {
              title: "Current Price",
              dataIndex: "currentPrice",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.currentPrice - b.currentPrice,
              render: (sourcePrice: number) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={sourcePrice || "-"}
                    formatter={(value) => `$ ${value}`}
                  />
                );
              },
              width: 100,
            },
            {
              title: "Range Min",
              dataIndex: "priceRangeMin",
              width: 100,
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.priceRangeMin - b.priceRangeMin,
              render: (priceRangeMin: number, record: any) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={priceRangeMin || "-"}
                    formatter={(value) => `$ ${value}`}
                  />
                );
              },
            },
            {
              title: "Range Max",
              width: 100,
              dataIndex: "priceRangeMax",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.priceRangeMax - b.priceRangeMax,
              render: (priceRangeMax: number, record: any) => {
                return (
                  <InputNumber
                    min={0}
                    size="large"
                    disabled={true}
                    defaultValue={priceRangeMax || "-"}
                    formatter={(value) => `$ ${value}`}
                  />
                );
              },
            },
            {
              title: "Price Percentage",
              width: 100,
              dataIndex: "pricePercentage",
              sortDirections: ["descend", "ascend"],
              sorter: (a: any, b: any) => a.pricePercentage - b.pricePercentage,
              render: (pricePercentage: number, record: any) => {
                return (
                  <InputNumber
                    min={0}
                    disabled={true}
                    size="large"
                    defaultValue={pricePercentage || "-"}
                    formatter={(value) => `${value}%`}
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
          onOk={() => deleteItem()}
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
      botSuccess: true,
      floatCondition: true,
      listingPercentage: true,
      listUsing: true,
      message: true,
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
