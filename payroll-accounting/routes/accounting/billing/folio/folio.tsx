import React, { useMemo, useState } from "react";
import { Input, Card, Button, Descriptions, Tag, Space } from "antd";
import { Billing, Query } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { GET_BILLING_INFO_BY_ID } from "@/graphql/billing/queries";
import type { DescriptionsProps } from "antd";
import {
  IssuesCloseOutlined,
  LockOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface Iprops {
  id?: string;
}

export default function BillingFolioComponent(props: Iprops) {
  const { id } = props;
  const [active, setActive] = useState(true);
  const [billingInfo, setBillingInfo] = useState<Billing>({});

  const { loading, refetch } = useQuery<Query>(GET_BILLING_INFO_BY_ID, {
    //fetchPolicy: "cache-and-network",
    variables: {
      id: id,
    },
    onCompleted: (data) => {
      let result = data?.billingById as Billing;
      console.log("result", result);
      if (result?.id) {
        setBillingInfo(result);
      }
    },
  });

  console.log("billingInfo", billingInfo);

  const borderedItems: DescriptionsProps["items"] = useMemo(() => {
    let status = { color: "red", text: "INACTIVE" };
    if (billingInfo?.status) {
      status = { color: "green", text: "ACTIVE" };
    }
    let locked = { color: "green", text: "OPEN" };
    if (billingInfo?.locked) {
      locked = { color: "red", text: "LOCKED" };
    }
    return [
      {
        key: "dateTrans",
        label: "Transaction Date",
        children: dayjs(billingInfo.dateTrans).format("MM/DD/YYYY HH:mm:ss A"),
      },
      {
        key: "billNo",
        label: "Billing Folio Number",
        children: billingInfo?.billNo,
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
        children: billingInfo.lockedBy ?? "--",
      },
      {
        key: "6",
        label: "Actions",
        children: (
          <Space>
            <Button type="primary" icon={<LockOutlined />} size="small">
              Locked Billing
            </Button>
            <Button
              type="primary"
              danger
              icon={<IssuesCloseOutlined />}
              size="small"
            >Close Folio Biling</Button>
          </Space>
        ),
      },
      {
        key: "7",
        label: "Project Information",
        span: 3,
        children: (
          <>
            Data disk type: MongoDB
            <br />
            Database version: 3.4
            <br />
            Package: dds.mongo.mid
            <br />
            Storage space: 10 GB
            <br />
            Replication factor: 3
            <br />
            Region: East China 1
            <br />
          </>
        ),
      },
      {
        key: "7",
        label: "Customer Information",
        span: 3,
        children: (
          <>
            Data disk type: MongoDB
            <br />
            Database version: 3.4
            <br />
            Package: dds.mongo.mid
            <br />
            Storage space: 10 GB
            <br />
            Replication factor: 3
            <br />
            Region: East China 1
            <br />
          </>
        ),
      },
    ];
  }, [billingInfo]);

  const onRefetchBillingInfo = () => {
    refetch({ id: id });
  };

  return (
    <Card
      title="Billing Folio Details"
      size="small"
      extra={
        <>
          <Button size="small" type="primary" icon={<PrinterOutlined />}>
            Print Billing Statement
          </Button>
        </>
      }>
      <Descriptions
        bordered
        size="small"
        // extra={<Button type="primary">Edit</Button>}
        items={borderedItems}
      />
    </Card>
  );
}
