import React from "react";
import { Input, Row, Col, Form, Button } from "antd";
import { ItemSubAccount } from "@/graphql/gql/graphql";
import ItemSubAccountTable from "@/components/inventory/masterfile/other-configurations/itemSubAccountTable";
import { responsiveColumn18, responsiveColumn4 } from "@/utility/constant";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Search } = Input;

interface IProps {
  loading: boolean;
  data: ItemSubAccount[];
  onFilter: (e?: string) => void;
  onUpsertRecord: (e?: ItemSubAccount) => void;
}

export default function ItemSubAccountTabComponent({
  loading,
  data,
  onFilter,
  onUpsertRecord,
}: IProps) {
  return (
    <div className="w-full">
      <Form layout="vertical" className="filter-form">
        <Row gutter={[16, 16]}>
          <Col {...responsiveColumn18}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => onFilter(e)}
              className="w-full"
            />
          </Col>
          <Col {...responsiveColumn4}>
            <Button
              block
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}>
              Create New
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="w-full mt-5">
        <ItemSubAccountTable
          dataSource={data as ItemSubAccount[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </div>
    </div>
  );
}
