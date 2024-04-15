import React, { useState } from "react";
import { SendOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Space,
  Input,
  Table,
  Modal,
  Typography,
  Pagination,
} from "antd";
import _ from "lodash";
import { Inventory, Query, Item } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { ColumnsType } from "antd/es/table";
import ColumnTitle from "../common/columnTitle/columnTitle";
import { GET_RECORDS_ITEMS_INVENTORY } from "@/graphql/inventory/global-queries";
import DescLong from "./desclong";
import styled from "styled-components";
import {
  formatObjInventoryPurchaseRequest,
  formatObjInventoryStockIssuance,
} from "@/utility/inventory-helper";
import { NumberFormaterDynamic } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  itemIds: React.Key[];
  formModule: string;
}

const { Search } = Input;

export default function InventoryItemSelector(props: IProps) {
  const { hide, itemIds, formModule } = props;
  const [selectedItems, setSelectedItems] = useState<Inventory[]>([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState<React.Key[]>([]);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 8,
  });
  // ======================= queries ===========================
  const { data, loading } = useQuery<Query>(GET_RECORDS_ITEMS_INVENTORY, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: state.filter,
      groupId: null,
      category: [],
      page: state.page,
      size: state.size,
    },
  });

  const rowSelection = {
    onSelect: (record: Inventory, selected: boolean) => {
      let payloadSelected = _.clone(selectedItems);
      if (selected) {
        // =============== set ======================
        payloadSelected.push(record);
        let mapKeys: React.Key[] = _.map(payloadSelected, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(payloadSelected);
      } else {
        // ================ remove ===============================
        let filtered = _.filter(payloadSelected, function (o) {
          return o.id !== record.id;
        });
        let mapKeys: React.Key[] = _.map(filtered, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(filtered);
      }
    },
    onSelectAll: (
      selected: boolean,
      ____: Inventory[],
      changeRows: Inventory[]
    ) => {
      let payloadSelected = _.clone(selectedItems);
      if (selected) {
        // =============== set ======================
        let updatedPayloaod = _.concat(payloadSelected, changeRows);
        let mapKeys: React.Key[] = _.map(updatedPayloaod, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(updatedPayloaod);
      } else {
        // ================ remove ===============================
        let filtered = _.filter(payloadSelected, function (o) {
          let findObj = _.find(changeRows, { id: o.id });
          return _.isEmpty(findObj);
        });
        let mapKeys: React.Key[] = _.map(filtered, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(filtered);
      }
    },
    getCheckboxProps: (record: Inventory) => ({
      disabled: itemIds.includes(record.item?.id),
    }),
  };

  const onSubmitSelectedItems = () => {
    if (!_.isEmpty(selectedItems)) {
      if (formModule === "PR") {
        let result = formatObjInventoryPurchaseRequest(selectedItems);
        if (!_.isEmpty(result)) {
          hide(result);
        }
      } else if (formModule === "STI") {
        let result = formatObjInventoryStockIssuance(selectedItems);
        if (!_.isEmpty(result)) {
          hide(result);
        }
      }
    }
  };

  const columns: ColumnsType<Inventory> = [
    {
      title: "SKU/Barcode",
      dataIndex: "sku",
      key: "sku",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (text, record) => (
        <DescLong descripton={text} record={record.item as Item} />
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit (UoP/UoU)"
          popup="Unit of Purchase/Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "unitMeasurement",
      key: "unitMeasurement",
      width: 150,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      align: "center",
      width: 180,
    },
    {
      title: (
        <ColumnTitle
          descripton="On Hand (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "onHand",
      key: "onHand",
      align: "right",
      render: (onHand) => <span>{NumberFormaterDynamic(onHand)}</span>,
      width: 140,
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ShoppingCartOutlined /> Inventory Item List
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1600px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            loading={false}
            onClick={onSubmitSelectedItems}
            disabled={_.isEmpty(selectedItems)}
            icon={<SendOutlined />}>
            Submit Selected Items
          </Button>
        </Space>
      }>
      <CustomCSS>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) =>
                setState((prev) => ({ ...prev, filter: e, page: 0 }))
              }
              className="w-full"
            />
          </Col>

          <Col span={24}>
            <Table
              rowSelection={{
                selectedRowKeys: selectedRowkeys,
                ...rowSelection,
              }}
              rowKey="id"
              size="small"
              loading={loading}
              columns={columns}
              dataSource={data?.inventoryListPageable?.content as Inventory[]}
              pagination={false}
              scroll={{ x: 1000 }}
              footer={() => (
                <Pagination
                  showSizeChanger={false}
                  current={state.page + 1}
                  pageSize={state.size}
                  responsive={true}
                  total={data?.inventoryListPageable?.totalElements as number}
                  onChange={(e) => {
                    setState((prev) => ({ ...prev, page: e - 1 }));
                  }}
                />
              )}
            />
          </Col>
        </Row>
      </CustomCSS>
    </Modal>
  );
}

const CustomCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: #399b53 !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }
`;
