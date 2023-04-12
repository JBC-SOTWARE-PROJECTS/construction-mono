import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  message,
  Input,
  Divider,
  Spin,
  Empty,
  Pagination,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { PlusCircleOutlined } from "@ant-design/icons";
import AssetItem from "../../app/components/projectGrid/AssetItem";
import AddAssetForm from "./dialogs/addAssets";
import { dialogHook } from "../../util/customhooks";
import _ from "lodash";
import "./index.css";



const { Search } = Input;
//graphQL Queries
const GET_RECORDS = gql`
  query ($filter: String, $status: String, $page: Int, $size: Int) {
    list: assetListPageable(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        assetCode
        description
        brand
        model
        plateNo
        image
        status
      }
      size
      totalElements
      number
    }
  }
`;

const AssetItemData = ({
  data = [],
  loading = false,
  onEdit = () => {},
  setState = () => {},
  pageSize,
  total,
  defaultCurrent,
}) => {
  if (_.isEmpty(data)) {
    return (
      <Row>
        <Col span={24}>
          <Empty />
        </Col>
      </Row>
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Row>
          {data.map((asset, index) => (
            <Col key={index} xl={8} md={12} sm={24} xs={24}>
              <AssetItem
                key={index}
                grid
                product={asset}
                onEdit={() => onEdit(asset)}
              />
            </Col>
          ))}
          <Col span={24}>
            <div className="flex-box-wrap-center">
              <Pagination
                pageSize={pageSize}
                total={total}
                defaultCurrent={defaultCurrent}
                onChange={(page) => {
                  setState({ ...state, page: page - 1 });
                }}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    );
  }
};

const Assets = ({ account }) => {
  const [state, setState] = useState({
    filter: "",
    status: null,
    page: 0,
    size: 10,
  });
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      status: state.status,
      page: state.page,
      size: state.size,
    },
  });

  const [modal, showModal] = dialogHook(AddAssetForm, (result) => {
    if (result) {
      message.success(result);
    }
    refetch();
  });

  return (
    <Card
      title="Asset List (Heavy Eqiupment)"
      size="small"
      extra={
        <span>
          <Button
            size="small"
            type="primary"
            icon={<PlusCircleOutlined />}
            className="margin-0"
            onClick={() => showModal({ show: true, myProps: null })}
          >
            Add Heavy Eqiupment
          </Button>
        </span>
      }
    >
      <Row>
        <Col span={24}>
          <Search
            placeholder="Search Heavy Eqiupment"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
          />
        </Col>
      </Row>
      <Divider />
      <AssetItemData
        data={_.get(data, "list.content", [])}
        loading={loading}
        pageSize={_.get(data, "list.size", 0)}
        total={_.get(data, "list.totalElements", 0)}
        defaultCurrent={_.get(data, "list.number", 0) + 1}
        onEdit={(props) => showModal({ show: true, myProps: props })}
        setState={setState}
      />
      {modal}
    </Card>
  );
};

export default Assets;
