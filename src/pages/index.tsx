import React from "react";
import { Table, InputNumber, Switch, Card, Select } from "antd";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { GetServerSideProps } from "next";

const Listings: React.FC<any> = ({ items }) => {
  return (
    <Layout>
      <Card title="Live Trades">
        <Table
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ["50", "100"],
          }}
          dataSource={items}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
              width: 200,
              fixed: "left",
            },
            {
              title: "Source Price",
              width: 200,
              dataIndex: "sourcePrice",
            },
            {
              title: "Current Price",
              width: 200,
              dataIndex: "currentPrice",
            },
            {
              title: "Source",
              fixed: "left",
              dataIndex: "source",
              // render: (source: string, record: any, index: number) => {
              //   return (
              // options will be the keys of the prices object where sourcePrice is not null
              // <Select
              //   defaultValue={source}
              //   style={{ width: 230 }}
              //   options={Object.keys(record.prices)
              //     .filter((key) => record.prices[key].sourcePrice !== null)
              //     .map((key) => {
              //       return {
              //         value: key,
              //         label: `${`$ ${
              //           record.prices[key].sourcePrice / 100
              //         }`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${key})`,
              //       };
              //     })}
              //   disabled={true}
              // onChange={(e) => {
              //   setItems(
              //     items.map((item: any, i: number) => {
              //       if (i === index) {
              //         return {
              //           ...item,
              //           source: e,
              //           sourcePrice: record.prices[e].sourcePrice / 100,
              //         };
              //       }
              //       return item;
              //     })
              //   );
              // }}
              // >
              //   Source
              // </Select>
              //   );
              // },
              width: 260,
            },
            {
              title: "Undercut Price",
              dataIndex: "undercutPrice",
              width: 120,
              render: (undercutPrice: number, record: any) => {
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
                    // onChange={(e) => {
                    //   record.undercutPrice = Number(e);
                    // }}
                  />
                );
              },
            },
            {
              title: "Undercut Percentage",
              dataIndex: "undercutPercentage",
              width: 120,
              render: (undercutPercentage: number, record: any) => {
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
                    // onChange={(e) => {
                    //   record.undercutPercentage = Number(e);
                    // }}
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
                    // onChange={(checked) => {
                    //   record.undercutByPriceOrPercentage = checked
                    //     ? "price"
                    //     : "percentage";
                    // }}
                    unCheckedChildren="Percentage"
                    disabled={true}
                    checkedChildren="Price"
                  />
                );
              },
            },
            {
              title: "Range Min",
              dataIndex: "priceRangeMin",
              width: 130,
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
                    // onChange={(e) => {
                    //   record.priceRangeMin = Number(e);
                    // }}
                  />
                );
              },
            },
            {
              title: "Range Max",
              width: 130,
              dataIndex: "priceRangeMax",
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
                    // onChange={(e) => {
                    //   record.priceRangeMax = Number(e);
                    // }}
                  />
                );
              },
            },
            {
              title: "Price Percentage",
              width: 130,
              dataIndex: "priceRangePercentage",
              render: (priceRangePercentage: number, record: any) => {
                return (
                  <InputNumber
                    disabled={true}
                    defaultValue={priceRangePercentage}
                    formatter={(value) => `${value}%`}
                    // @ts-ignore
                    parser={(value) => value!.replace("%", "")}
                    // onChange={(e) => {
                    //   record.priceRangePercentage = Number(e);
                    // }}
                  />
                );
              },
            },
            {
              title: "List Using (When No One To Undercut)",
              dataIndex: "whenNoOneToUndercutListUsing",
              width: 180,
              render: (whenNoOneToUndercutListUsing: string, record: any) => {
                return (
                  <Switch
                    defaultChecked={whenNoOneToUndercutListUsing === "max"}
                    disabled={true}
                    // onChange={(checked) => {
                    //   record.whenNoOneToUndercutListUsing = checked
                    //     ? "max"
                    //     : "percentage";
                    // }}
                    unCheckedChildren="Price Percentage"
                    checkedChildren="Range Max"
                  />
                );
              },
            },
          ]}
        />
      </Card>
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
