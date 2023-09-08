import React, { useState } from "react";
import {
  BarcodeOutlined,
  PayCircleOutlined,
  PercentageOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Card, Col, Input, Row, Segmented, Table, Tag, Typography } from "antd";
import { Billing, BillingItem } from "@/graphql/gql/graphql";
import { ColumnsType } from "antd/es/table";
import { DateFormatterWithTime, NumberFormater } from "@/utility/helper";
import dayjs from "dayjs";
import { currency } from "@/utility/constant";

interface Iprops {
  record?: Billing;
  billingId?: string;
}

const { Search } = Input;
const { Text } = Typography;

export default function BillingTables(props: Iprops) {
  const { record, billingId } = props;
  const [activeTab, setActiveTab] = useState<string | number>("items");
  //========================= columnns ==================================
  const columns: ColumnsType<BillingItem> = [
    {
      title: "Date/Time",
      dataIndex: "transDate",
      key: "transDate",
      width: 200,
      render: (transDate, record) => {
        if (!record.status) {
          return <span>{DateFormatterWithTime(transDate)}</span>;
        } else {
          return (
            <Text type="danger" delete={!record.status}>
              {DateFormatterWithTime(transDate)}
            </Text>
          );
        }
      },
    },
    {
      title: "Record No",
      dataIndex: "recordNo",
      key: "recordNo",
      width: 120,
      render: (recordNo, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {recordNo}
            </Text>
          );
        } else {
          return <span>{recordNo}</span>;
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {description}
            </Text>
          );
        } else {
          return <span>{description}</span>;
        }
      },
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
      width: 100,
      render: (qty, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {qty}
            </Text>
          );
        } else {
          return <span>{qty}</span>;
        }
      },
    },
    {
      title: "Price",
      dataIndex: "debit",
      key: "debit",
      width: 130,
      align: "right",
      fixed: "right",
      render: (price, record) => {
        let cost = price;
        if (record.itemType == "DEDUCTIONS" || record.itemType == "PAYMENTS") {
          cost = record.subTotal;
        }
        if (!record.status) {
          return (
            <Text type={"danger"} delete={!record.status}>
              {currency + " "}
              {NumberFormater(cost)}
            </Text>
          );
        } else {
          return (
            <span>
              {currency + " "}
              {NumberFormater(cost)}
            </span>
          );
        }
      },
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      width: 130,
      align: "right",
      fixed: "right",
      render: (subTotal, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {subTotal}
            </Text>
          );
        } else {
          return <span>{subTotal}</span>;
        }
      },
    },
    {
      title: "Tags",
      dataIndex: "tag",
      key: "tag",
      align: "center",
      fixed: "right",
      width: 130,
      render: (txt, record) => {
        let object = { color: "red", text: "Cancelled" };
        let tag = null;
        if (record.status) {
          object = { color: "green", text: "Active" };
        }
        tag = [
          <Tag key={1} color={object.color} style={{ marginBottom: 5 }}>
            {object.text}
          </Tag>,
          <br key={2} />,
          <Tag key={3} color="orange">
            {record.lastModifiedBy}
          </Tag>,
        ];
        return tag;
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
    },
  ];

  return (
    <div className="w-full">
      <Card size="small">
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Segmented
              block
              size="large"
              value={activeTab}
              onChange={setActiveTab}
              options={[
                {
                  value: "items",
                  label: "Inventory Items",
                  icon: <BarcodeOutlined />,
                },
                {
                  value: "services",
                  label: "Services",
                  icon: <TagsOutlined />,
                },
                {
                  label: "Deduction/Discount",
                  value: "discounts",
                  icon: <PercentageOutlined />,
                },
                {
                  label: "Payment History",
                  value: "payments",
                  icon: <PayCircleOutlined />,
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <Search placeholder="Search here ..." />
          </Col>
          <Col span={24}>
            <Table size="small" columns={columns} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
