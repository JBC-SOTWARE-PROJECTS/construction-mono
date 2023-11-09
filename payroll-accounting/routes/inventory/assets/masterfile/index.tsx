import React from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Select, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Search } = Input;
type Props = {};

export default function AssetsComponent({}: Props) {

  let title = "All Assets";
  return (
    <PageContainer
      title="Asset Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile."
    >
      <ProCard
        title={`${title} List`}
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Search
              size="middle"
              placeholder="Search here.."
            //  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
            //  onClick={() => onUpsertRecord()}
            >
              Create New
            </Button>
          </ProFormGroup>
        }
      ></ProCard>
    </PageContainer>
  );
}
