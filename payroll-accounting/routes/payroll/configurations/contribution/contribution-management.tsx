import React from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import SSSContribution from "./sss-contribution";
import HDMFContribution from "./hdmf-contribution";
import PhicContribution from "./phic-contribution";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `SSS`,
    children: <SSSContribution />,
  },
  {
    key: "2",
    label: `HDMF`,
    children: <HDMFContribution />,
  },
  {
    key: "3",
    label: `PHIC`,
    children: <PhicContribution />,
  },
];

const handleChange = (key: string) => {};

function ContributionManagement() {
  return (
    <PageContainer title="Contribution Management">
      <div>
        <Tabs
          type="card"
          defaultActiveKey="1"
          items={items}
          onChange={handleChange}
        />
      </div>
    </PageContainer>
  );
}

export default ContributionManagement;
