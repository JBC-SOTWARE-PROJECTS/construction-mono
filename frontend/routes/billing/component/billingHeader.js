import React from "react";
import { Button, Descriptions, Typography } from "antd";
import {
  PrinterOutlined,
  LockOutlined,
  UnlockOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getUrlPrefix } from "../../../shared/global";
import moment from "moment";
import numeral from "numeral";

const { Text } = Typography;

const BillingHeader = ({
  record,
  onLocked,
  loading,
  loadingClose,
  onClose,
}) => {
  return (
    <>
      <Descriptions
        title="View Billing Account"
        bordered
        column={{ xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }}
        extra={
          <>
            <Button
              icon={<PrinterOutlined />}
              type="primary"
              onClick={() =>
                window.open(
                  `${getUrlPrefix()}/reports/billing/print/billingdetails/${
                    record?.id
                  }`
                )
              }
            >
              Print Billing Statement
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              type="danger"
              disabled={!record?.status}
              loading={loadingClose}
              onClick={() => onClose("close")}
            >
              Close Billing
            </Button>
            <Button
              icon={record?.locked ? <UnlockOutlined /> : <LockOutlined />}
              type="danger"
              disabled={!record?.status}
              loading={loading}
              onClick={() => onLocked(record?.locked ? "UNLOCKED" : "LOCKED")}
            >
              {record?.locked ? "Unlocked Billing" : "Lock Billing"}
            </Button>
            {record?.locked && <Text type="danger">{record?.lockedBy}</Text>}
          </>
        }
      >
        <Descriptions.Item label="Billing No">
          {record?.billNo}
        </Descriptions.Item>
        <Descriptions.Item label="Project No">
          {record?.project?.projectCode}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction Date"  span={2}>
          {moment(record?.dateTrans).format("MM/DD/YYYY h:mm:ss A")}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Repair Type">
          {record?.job?.repair?.description}
        </Descriptions.Item> */}
        {/*  */}
        <Descriptions.Item label="Customer Information" span={4}>
          <span style={{ paddingRight: 60 }}>Customer Name</span>{" "}
          <span>: {record?.customer?.fullName}</span>
          <br />
          <span style={{ paddingRight: 67 }}>Customer Type</span>{" "}
          <span>: {record?.customer?.customerType}</span>
          <br />
          <span style={{ paddingRight: 111 }}>Address</span>{" "}
          <span>: {record?.customer?.address}</span>
          <br />
          <span style={{ paddingRight: 59 }}>Contact Number</span>{" "}
          <span>: {record?.customer?.telNo}</span>
          <br />
          <span style={{ paddingRight: 73 }}>Email Address</span>{" "}
          <span>: {record?.customer?.emailAdd}</span>
          <br />
        </Descriptions.Item>
        {/*  */}
        <Descriptions.Item label="Totals">
          <Text strong>{numeral(record?.totals).format("0,0.00")}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Deductions">
          <Text strong type="danger">
            {numeral(record?.deductions).format("0,0.00")}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Payments">
          <Text strong>{numeral(record?.payments).format("0,0.00")}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Current Balance">
          <Text type="warning" strong>
            {numeral(record?.balance).format("0,0.00")}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default BillingHeader;
