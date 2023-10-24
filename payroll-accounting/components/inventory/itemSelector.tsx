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
  Tag,
  Select,
} from "antd";
import _ from "lodash";
import { Item, Query } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_ITEMS } from "@/graphql/payables/petty-cash-queries";
import { ColumnsType } from "antd/es/table";
import ColumnTitle from "../common/columnTitle/columnTitle";
import { randomId, useLocalStorage } from "@/utility/helper";
import { PettyCashItemDto } from "@/interface/payables/formInterfaces";
import { useOffices } from "@/hooks/payables";
import { responsiveColumn18, responsiveColumn6 } from "@/utility/constant";

interface IProps {
  hide: (hideProps: any) => void;
  defaultSelected: Item[];
  defaultKey: React.Key[];
}

const { Search } = Input;

export default function ItemSelector(props: IProps) {
  const { hide, defaultSelected, defaultKey } = props;
  const [selectedItems, setSelectedItems] = useState<Item[]>(defaultSelected);
  const [selectedRowkeys, setSelectedRowkeys] =
    useState<React.Key[]>(defaultKey);
  const [office, setOffice] = useLocalStorage("office", {});
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });
  // ======================= queries ===========================
  const offices = useOffices();
  const { data, loading } = useQuery<Query>(GET_RECORDS_ITEMS, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: state.filter,
      page: state.page,
      size: state.size,
    },
  });

  const rowSelection = {
    onSelect: (record: Item, selected: boolean) => {
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
    onSelectAll: (selected: boolean, ____: Item[], changeRows: Item[]) => {
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
    getCheckboxProps: (record: Item) => ({
      disabled: !_.isEmpty(_.find(defaultSelected, { id: record.id })),
    }),
  };

  const onSubmitSelectedItems = () => {
    if (!_.isEmpty(selectedItems)) {
      const newSelected = _.filter(selectedItems, (e) => {
        let findObj = _.find(defaultSelected, { id: e.id });
        return _.isEmpty(findObj);
      });

      // map values
      const newItems = (newSelected || []).map((obj) => {
        return {
          id: randomId(),
          item: obj,
          department: {
            id: office?.value,
            departmentName: office?.label,
          },
          qty: 1,
          unitCost: 0,
          inventoryCost: 0,
          grossAmount: 0,
          discRate: 0,
          discAmount: 0,
          netDiscount: 0,
          expirationDate: null,
          lotNo: null,
          isVat: true,
          vatAmount: 0,
          netAmount: 0,
          isPosted: false,
          unitMeasurement: `${obj.unit_of_purchase?.unitDescription} (${obj.item_conversion} ${obj.unit_of_usage?.unitDescription})`,
          uou: `${obj.unit_of_usage?.unitDescription}`,
          descLong: `${obj.descLong}`,
          isNew: true,
        };
      }) as PettyCashItemDto[];

      // check mapped values
      if (!_.isEmpty(newItems)) {
        hide(newItems);
      }
    }
  };

  const columns: ColumnsType<Item> = [
    {
      title: "SKU/Barcode",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (text, record) => (
        <span>
          {text}&nbsp;
          {record.consignment && <Tag color="magenta">Consignment</Tag>}
          {record.fixAsset && <Tag color="geekblue">Fix Asset</Tag>}
        </span>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit of Measurement (UoP/UoU)"
          popup="Unit of Purchase/Unit of Usage"
        />
      ),
      dataIndex: "unitMeasurement",
      key: "unitMeasurement",
    },
    {
      title: "Category",
      dataIndex: "item_category.categoryDescription",
      key: "item_category.categoryDescription",
      render: (_, record) => (
        <span>{record?.item_category?.categoryDescription}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (status) => (
        <span>
          <Tag color={status === true ? "green" : "red"} key={status}>
            {status === true ? "Active" : "Inactive"}
          </Tag>
        </span>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ShoppingCartOutlined /> Item List
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
            disabled={_.isEmpty(selectedItems) || _.isEmpty(office)}
            icon={<SendOutlined />}>
            Submit Selected Items
          </Button>
        </Space>
      }>
      <Row gutter={[8, 8]}>
        <Col {...responsiveColumn18}>
          <Search
            size="middle"
            placeholder="Search here.."
            onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
            className="w-full"
          />
        </Col>
        <Col {...responsiveColumn6}>
          <Select
            showSearch
            labelInValue
            options={offices}
            placeholder="Select Office"
            value={office}
            onChange={(e) => setOffice(e)}
            filterOption={(input, option) => {
              let label: string = _.toString(option?.label ?? "");
              return label.toLowerCase().includes(input.toLowerCase());
            }}
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
            dataSource={
              _.get(data, "itemsByFilterOnly.content", []) as Item[]
            }
            pagination={false}
            footer={() => (
              <Pagination
                showSizeChanger={false}
                current={state.page + 1}
                pageSize={10}
                responsive={true}
                total={
                  _.get(
                    data,
                    "itemsByFilterOnly.totalElements",
                    0
                  ) as number
                }
                onChange={(e) => {
                  setState((prev) => ({ ...prev, page: e - 1 }));
                }}
              />
            )}
          />
        </Col>
      </Row>
    </Modal>
  );
}
