import React, { useState, useContext } from "react";
import {
  BarcodeOutlined,
  PayCircleOutlined,
  PercentageOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Segmented,
  Table,
  Tag,
  Typography,
} from "antd";
import { Billing, BillingItem, Mutation, Query } from "@/graphql/gql/graphql";
import { ColumnsType } from "antd/es/table";
import { DateFormatterWithTime, NumberFormater } from "@/utility/helper";
import { currency } from "@/utility/constant";
import { useMutation, useQuery } from "@apollo/client";
import {
  CANCEL_BILLING_ITEM,
  GET_BILLING_ITEMS,
} from "@/graphql/billing/queries";
import _ from "lodash";
import { useConfirm } from "@/hooks";
import { AccountContext } from "@/components/accessControl/AccountContext";

interface Iprops {
  record?: Billing;
  billingId?: string;
  onRefetchBillingInfo: () => void;
}

const { Search } = Input;
const { Text } = Typography;

export default function BillingTables(props: Iprops) {
  const { record, billingId, onRefetchBillingInfo } = props;
  const account = useContext(AccountContext);
  const [activeTab, setActiveTab] = useState<string | number>("ITEM");
  const [items, setItems] = useState<BillingItem[]>([]);
  const [filter, setFilter] = useState("");
  // ========================= Queries ===================================
  const { loading, refetch } = useQuery<Query>(GET_BILLING_ITEMS, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: filter,
      id: billingId,
      type: [activeTab],
    },
    onCompleted: (data) => {
      let result = data?.billingItemByParentType as BillingItem[];
      setItems(result);
    },
  });

  const [cancelBilling] = useMutation<Mutation>(CANCEL_BILLING_ITEM, {
    ignoreResults: false,
  });
  // ======================== functions =================================
  const onCancelled = (e?: BillingItem) => {
    let loading = false;
    useConfirm({
      title: "Are you sure you want to cancel this billing item?",
      subTitle: "Click Yes if you want to proceed",
      loading: loading,
      onCallBack: async () => {
        try {
          return await new Promise((resolve, reject) => {
            cancelBilling({
              variables: {
                id: e?.id ?? null,
                office: account?.office?.id ?? null,
              },
              onCompleted: (data_1) => {
                let result = data_1?.cancelItem as BillingItem;
                if (result?.id) {
                  refetch();
                  onRefetchBillingInfo();
                  resolve();
                } else {
                  reject();
                }
              },
            });
          });
        } catch {
          return console.log("Oops errors!");
        }
      },
    });
  };
  //========================= columnns ==================================
  const columns: ColumnsType<BillingItem> = [
    {
      title: "Date/Time",
      dataIndex: "transDate",
      key: "transDate",
      width: 200,
      render: (transDate, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {DateFormatterWithTime(transDate)}
            </Text>
          );
        } else {
          return <span>{DateFormatterWithTime(transDate)}</span>;
        }
      },
    },
    {
      title: "Record No",
      dataIndex: "recordNo",
      key: "recordNo",
      width: 120,
      render: (recordNo, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {recordNo}
            </Text>
          );
        } else {
          return <span>{recordNo}</span>;
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description, record) => {
        let desc = _.toUpper(description);
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {desc}
            </Text>
          );
        } else {
          return <span>{desc}</span>;
        }
      },
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
      width: 100,
      render: (qty, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {qty}
            </Text>
          );
        } else {
          return <span>{qty}</span>;
        }
      },
    },
    {
      title: "Price",
      dataIndex: "debit",
      key: "debit",
      width: 130,
      align: "right",
      fixed: "right",
      render: (price, record) => {
        let cost = price;
        if (record.itemType == "DEDUCTIONS" || record.itemType == "PAYMENTS") {
          cost = record.subTotal;
        }
        if (!record.status) {
          return (
            <Text type={"danger"} delete={!record.status}>
              {currency + " "}
              {NumberFormater(cost)}
            </Text>
          );
        } else {
          return (
            <span>
              {currency + " "}
              {NumberFormater(cost)}
            </span>
          );
        }
      },
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      width: 130,
      align: "right",
      fixed: "right",
      render: (subTotal, record) => {
        if (!record.status) {
          return (
            <Text type="danger" delete={!record.status}>
              {currency + " "}
              {NumberFormater(subTotal)}
            </Text>
          );
        } else {
          return (
            <span>
              {currency + " "}
              {NumberFormater(subTotal)}
            </span>
          );
        }
      },
    },
    {
      title: "Tags",
      dataIndex: "tag",
      key: "tag",
      align: "center",
      fixed: "right",
      width: 130,
      render: (txt, record) => {
        let object = { color: "red", text: "Cancelled" };
        let tag = null;
        if (record.status) {
          object = { color: "green", text: "Active" };
        }
        tag = [
          <Tag key={1} color={object.color} style={{ marginBottom: 5 }}>
            {object.text}
          </Tag>,
          <br key={2} />,
          <Tag key={3} color="orange">
            {record.lastModifiedBy}
          </Tag>,
        ];
        return tag;
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        if (record.status) {
          return (
            <Button
              type="dashed"
              size="small"
              danger
              onClick={() => onCancelled(record)}>
              Cancel
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div className="w-full">
      <Card size="small">
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Segmented
              block
              size="large"
              value={activeTab}
              onChange={setActiveTab}
              options={[
                {
                  value: "ITEM",
                  label: "Inventory Items",
                  icon: <BarcodeOutlined />,
                },
                {
                  value: "SERVICE",
                  label: "Services",
                  icon: <TagsOutlined />,
                },
                {
                  label: "Deduction/Discount",
                  value: "DEDUCTIONS",
                  icon: <PercentageOutlined />,
                },
                {
                  label: "Payment History",
                  value: "PAYMENTS",
                  icon: <PayCircleOutlined />,
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <Search placeholder="Search here ..." onSearch={setFilter} />
          </Col>
          <Col span={24}>
            <Table
              size="small"
              columns={columns}
              loading={loading}
              dataSource={items}
              pagination={{
                showSizeChanger: false,
                pageSize: 5,
              }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
