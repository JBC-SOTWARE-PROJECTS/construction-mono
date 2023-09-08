import React, { useMemo } from "react";
import { IssuesCloseOutlined, LockOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Statistic,
  Tag,
} from "antd";
import { Billing } from "@/graphql/gql/graphql";
import type { DescriptionsProps } from "antd";
import { col4, currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";

interface Iprops {
  record?: Billing;
}

const formatter = (value: number, color?: string) => (
  <p className={color}>
    {currency + " "}
    {NumberFormater(value)}
  </p>
);

export default function BillingHeader(props: Iprops) {
  const { record } = props;

  const borderedItems: DescriptionsProps["items"] = useMemo(() => {
    let status = { color: "red", text: "INACTIVE" };
    if (record?.status) {
      status = { color: "green", text: "ACTIVE" };
    }
    let locked = { color: "green", text: "OPEN" };
    if (record?.locked) {
      locked = { color: "red", text: "LOCKED" };
    }
    return [
      {
        key: "dateTrans",
        label: "Transaction Date",
        children: dayjs(record?.dateTrans).format("MM/DD/YYYY HH:mm:ss A"),
      },
      {
        key: "billNo",
        label: "Billing Folio Number",
        children: record?.billNo,
      },
      {
        key: "status",
        label: "Billing Status",
        children: <Tag color={status.color}>{status.text}</Tag>,
      },
      {
        key: "locked",
        label: "Locked Status",
        children: <Tag color={locked.color}>{locked.text}</Tag>,
      },
      {
        key: "lockedBy",
        label: "Locked By",
        children: record?.lockedBy ?? "--",
      },
      {
        key: "6",
        label: "Actions",
        children: (
          <Space>
            <Button type="dashed" icon={<LockOutlined />} size="small" danger>
              Locked Billing
            </Button>
            <Button
              type="primary"
              danger
              icon={<IssuesCloseOutlined />}
              size="small">
              Close Biling Folio
            </Button>
          </Space>
        ),
      },
      {
        key: "7",
        label: "Project Information",
        span: 3,
        children: (
          <div className="w-full">
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Project #</p>
              </div>
              <div className="billing-info-value">
                {record?.project?.projectCode}
              </div>
            </div>
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Project Description</p>
              </div>
              <div className="billing-info-value">
                {record?.project?.description}
              </div>
            </div>
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Project Address</p>
              </div>
              <div className="billing-info-value">
                {record?.project?.location?.fullAddress}
              </div>
            </div>
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Project Status</p>
              </div>
              <div className="billing-info-value">
                <Tag color="green">{record?.project?.status}</Tag>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "7",
        label: "Customer Information",
        span: 3,
        children: (
          <div className="w-full">
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Customer Name</p>
              </div>
              <div className="billing-info-value">
                {record?.customer?.fullName}
              </div>
            </div>
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Customer Type</p>
              </div>
              <div className="billing-info-value">
                {record?.customer?.customerType}
              </div>
            </div>
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Address</p>
              </div>
              <div className="billing-info-value">
                {record?.customer?.address ?? "--"}
              </div>
            </div>
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Contact Number</p>
              </div>
              <div className="billing-info-value">
                {record?.customer?.contactPersonNum ?? "--"}
              </div>
            </div>
            <div className="w-full flex-div">
              <div className="billing-info-width">
                <p>Email Address</p>
              </div>
              <div className="billing-info-value">
                {record?.customer?.emailAdd ?? "--"}
              </div>
            </div>
          </div>
        ),
      },
    ];
  }, [record]);

  return (
    <div className="w-full">
      <Descriptions bordered size="small" items={borderedItems} />
      <Card style={{ marginTop: 5 }} size="small">
        <Row>
          <Col {...col4}>
            <Statistic
              title="Total Amount"
              value={Number(record?.totals)}
              formatter={(e) => {
                let value = Number(e);
                return formatter(value, "currency-green");
              }}
            />
          </Col>
          <Col {...col4}>
            <Statistic
              title="Total Deductions"
              value={Number(record?.deductions)}
              formatter={(e) => {
                let value = Number(e);
                return formatter(value, "currency-red");
              }}
            />
          </Col>
          <Col {...col4}>
            <Statistic
              title="Total Payments"
              value={Number(record?.payments)}
              formatter={(e) => {
                let value = Number(e);
                return formatter(value, "currency-orange");
              }}
            />
          </Col>
          <Col {...col4}>
            <Statistic
              title="Current Balance"
              value={Number(record?.balance)}
              formatter={(e) => {
                let value = Number(e);
                return formatter(value, "currency-red");
              }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
