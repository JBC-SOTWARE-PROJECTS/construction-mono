import React, { useState } from "react";
import {
  Table,
  Col,
  Row,
  Tag,
  Input,
  message,
  Button,
  Typography,
  Modal,
} from "antd";
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import moment from "moment";
import numeral from "numeral";
import { colSearch, colButton } from "../../../shared/constant";
import AddServiceMiscForm from "../dialogs/addServiceMiscForm";
import { dialogHook } from "../../../util/customhooks";
import AddItemForm from "../dialogs/addItemForm";
import AddDiscounts from "../dialogs/addDiscounts";
import AddServiceBillingForm from "../dialogs/addServiceBillingForm";

const { Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const QUERY = gql`
  query ($filter: String, $id: UUID, $type: [String]) {
    items: billingItemByParentType(filter: $filter, id: $id, type: $type) {
      id
      transDate
      recordNo
      description
      qty
      debit
      credit
      subTotal
      itemType
      transType
      orNum
      lastModifiedBy
      status
    }
  }
`;

const CANCEL = gql`
  mutation ($id: UUID, $office: UUID) {
    upsert: cancelItem(id: $id, office: $office) {
      id
    }
  }
`;

const TableItems = ({
  id,
  type,
  officeId,
  reload,
  transType,
  locked,
  status,
  isGovernment,
}) => {
  const [filter, setFilter] = useState("");

  const { loading, data, refetch } = useQuery(QUERY, {
    variables: {
      filter: filter,
      id: id,
      type: type,
    },
    fetchPolicy: "network-only",
  });

  const [cancelRecord, { loading: cancelLoading }] = useMutation(CANCEL, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (!_.isEmpty(data?.upsert?.id)) {
        message.success("Cancelled Successfully");
        refetch();
        reload();
      }
    },
  });

  const [miscModal, showMiscModal] = dialogHook(
    AddServiceMiscForm,
    (result) => {
      if (result) {
        message.success(result);
        refetch();
        reload();
      }
    }
  );

  const [serviceModal, showServiceModal] = dialogHook(
    AddServiceBillingForm,
    (result) => {
      if (result) {
        message.success(result);
        refetch();
        reload();
      }
    }
  );

  const [modal, showModal] = dialogHook(AddItemForm, (result) => {
    if (result) {
      message.success(result);
      refetch();
      reload();
    }
  });

  const [modalDiscount, showDiscountModal] = dialogHook(
    AddDiscounts,
    (result) => {
      if (result) {
        message.success(result);
        refetch();
        reload();
      }
    }
  );

  //=========================================

  const onCancel = (record) => {
    confirm({
      title: `Do you want ${message} this Record?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        cancelRecord({
          variables: {
            id: record?.id,
            office: officeId,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Date/Time",
      dataIndex: "transDate",
      key: "transDate",
      render: (transDate, record) => (
        <Text type={!record.status && "danger"} delete={!record.status}>
          {moment(transDate).format("MM/DD/YYYY h:mm:ss A")}
        </Text>
      ),
    },
    {
      title: "Record No",
      dataIndex: "recordNo",
      key: "recordNo",
      render: (recordNo, record) => (
        <Text type={!record.status && "danger"} delete={!record.status}>
          {recordNo}
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 550,
      render: (description, record) => (
        <Text type={!record.status && "danger"} delete={!record.status}>
          {_.truncate(description, {
            length: 254,
            separator: "...",
          })}
        </Text>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
      render: (qty, record) => (
        <Text type={!record.status && "danger"} delete={!record.status}>
          {qty}
        </Text>
      ),
    },
    {
      title: "Price",
      dataIndex: "debit",
      key: "debit",
      render: (price, record) => {
        let cost = price;
        if (record.itemType == "DEDUCTIONS" || record.itemType == "PAYMENTS") {
          cost = record.subTotal;
        }
        return (
          <Text type={!record.status && "danger"} delete={!record.status}>
            {numeral(cost).format("0,0.00")}
          </Text>
        );
      },
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (subTotal, record) => (
        <Text type={!record.status && "danger"} delete={!record.status}>
          {numeral(subTotal).format("0,0.00")}
        </Text>
      ),
    },
    {
      title: "Tags",
      key: "tag",
      width: "120px",
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
          // <span key={2}>&nbsp;</span>,
          <br key={2} />,
          <Tag key={3} color="orange">
            {record.lastModifiedBy}
          </Tag>,
        ];
        return tag;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "100px",
      render: (txt, record) => {
        let x = null;
        let dis = false;
        if (type.includes("DEDUCTIONS")) {
          dis = !record.status || !status;
        } else {
          dis = !record.status || locked || !status;
        }
        if (!type.includes("PAYMENTS")) {
          x = (
            <Button
              key={txt}
              size="small"
              type="danger"
              onClick={() => onCancel(record)}
              disabled={dis}
            >
              Cancel
            </Button>
          );
        }
        return x;
      },
    },
  ];

  return (
    <div style={{ paddingRight: 10, paddingLeft: 10 }}>
      <Row>
        {type[0] !== "PAYMENTS" ? (
          <Col {...colSearch}>
            <Search
              placeholder="Search"
              onSearch={(e) => setFilter(e)}
              enterButton
            />
          </Col>
        ) : (
          <Col span={24}>
            <Search
              placeholder="Search"
              onSearch={(e) => setFilter(e)}
              enterButton
            />
          </Col>
        )}
        <Col {...colButton}>
          {type[0] === "ITEM" && (
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              block
              disabled={locked || !status}
              onClick={() =>
                showModal({
                  show: true,
                  myProps: {
                    type: "ITEM",
                    transType: transType,
                    id: id,
                    isGovernment: isGovernment,
                  },
                })
              }
            >
              Add Item
            </Button>
          )}
          {type[0] === "SERVICE" && (
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              block
              disabled={locked || !status}
              onClick={() =>
                showServiceModal({
                  show: true,
                  myProps: {
                    type: "SERVICE",
                    transType: transType,
                    id: id,
                    isGovernment: isGovernment,
                  },
                })
              }
            >
              Add Service
            </Button>
          )}
          {type[0] === "MISC" && (
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              block
              disabled={locked || !status}
              onClick={() =>
                showMiscModal({
                  show: true,
                  myProps: { type: "MISC", transType: transType, id: id },
                })
              }
            >
              Add Misc. Service
            </Button>
          )}
          {type[0] === "DEDUCTIONS" && (
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              block
              disabled={!locked || !status}
              onClick={() =>
                showDiscountModal({
                  show: true,
                  myProps: { type: "DEDUCTIONS", transType: transType, id: id },
                })
              }
            >
              Add Deductions
            </Button>
          )}
        </Col>
        <Col span={24}>
          <Table
            loading={loading || cancelLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "items")}
            rowKey={(record) => record.id}
            size="small"
          />
        </Col>
      </Row>
      {modal}
      {serviceModal}
      {miscModal}
      {modalDiscount}
    </div>
  );
};

export default TableItems;
