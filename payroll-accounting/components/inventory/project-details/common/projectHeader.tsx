import React, { useMemo, useState } from "react";
import { Button, Card, Descriptions, Tag } from "antd";
import { Projects, Query } from "@/graphql/gql/graphql";
import type { DescriptionsProps } from "antd";
import {
  DateFormatterText,
  NumberFormater,
  useLocalStorage,
} from "@/utility/helper";
import { GET_PROJECT_BY_ID } from "@/graphql/inventory/project-queries";
import { useQuery } from "@apollo/client";
import { currency } from "@/utility/constant";
import AccessControl from "@/components/accessControl/AccessControl";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface Iprops {
  id: string;
}

export default function ProjectHeader(props: Iprops) {
  const [info, setInfo] = useState<Projects>({});
  const [hide, setHide] = useLocalStorage("project_details", true);
  const { loading } = useQuery<Query>(GET_PROJECT_BY_ID, {
    variables: {
      id: props.id,
    },
    onCompleted: (data) => {
      let result = data?.projectById as Projects;
      if (result.id) {
        setInfo(result);
      }
    },
    fetchPolicy: "cache-and-network",
  });

  const borderedItems: DescriptionsProps["items"] = useMemo(() => {
    let items = [
      {
        key: "prjectStarted",
        label: "Project Started",
        children: DateFormatterText(info.projectStarted),
      },
      {
        key: "projectCode",
        label: "Project Code Number",
        children: (
          <Tag color={info.projectColor ?? ""}>{info?.projectCode}</Tag>
        ),
      },
      {
        key: "status",
        label: "Project Status",
        children: (
          <Tag color={info.projectStatusColor ?? ""}>{info.status}</Tag>
        ),
      },
      {
        key: "cost",
        label: "Total Project Cost",
        children: (
          <AccessControl
            allowedPermissions={["show_project_cost"]}
            renderNoAccess={<Tag color="red">No Permission to View</Tag>}>
            <span className="font-bold currency-green">{`${currency} ${NumberFormater(
              info.totals
            )}`}</span>
          </AccessControl>
        ),
      },
    ];

    const customer = {
      key: "7",
      label: "Customer Information",
      span: 4,
      children: (
        <div className="w-full">
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Customer Name</p>
            </div>
            <div className="billing-info-value">
              {info.customer?.customerName}
            </div>
          </div>
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Customer Type</p>
            </div>
            <div className="billing-info-value">
              {info.customer?.customerType}
            </div>
          </div>
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Address</p>
            </div>
            <div className="billing-info-value">
              {info.customer?.address ?? "--"}
            </div>
          </div>
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Contact Number</p>
            </div>
            <div className="billing-info-value">
              {info?.customer?.contactNo ?? "--"}
            </div>
          </div>
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Email Address</p>
            </div>
            <div className="billing-info-value">
              {info?.customer?.contactEmail ?? "--"}
            </div>
          </div>
        </div>
      ),
    };

    const project = {
      key: "7",
      label: "Project Information",
      span: 4,
      children: (
        <div className="w-full">
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Project Description</p>
            </div>
            <div className="billing-info-value">{info?.description}</div>
          </div>
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Project Address</p>
            </div>
            <div className="billing-info-value">
              {info?.location?.fullAddress}
            </div>
          </div>
          <div className="w-full billing-flex-div">
            <div className="billing-info-width">
              <p>Project Estimated Date End</p>
            </div>
            <div className="billing-info-value">
              {DateFormatterText(info.projectEnded)}
            </div>
          </div>
        </div>
      ),
    };

    items.push(project);
    items.push(customer);

    return items;
  }, [info]);

  return (
    <div className="w-full project-page-header">
      <Card
        className="no-spacing-card"
        loading={loading}
        size="small"
        title="Project Information"
        extra={
          <Button
            size="small"
            type="dashed"
            icon={hide ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            onClick={() => setHide(!hide)}>
            {hide ? "Show Details" : "Hide Details"}
          </Button>
        }>
        {!hide && (
          <Descriptions
            bordered
            size="small"
            items={borderedItems}
            column={{ xs: 1, sm: 1, md: 2, lg: 4 }}
            layout="vertical"
          />
        )}
      </Card>
    </div>
  );
}
