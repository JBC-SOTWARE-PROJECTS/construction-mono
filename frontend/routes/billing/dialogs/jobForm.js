import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  Divider,
  Table,
  InputNumber,
  message,
  Tag,
  Typography,
} from "antd";
import { DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import CModal from "../../../app/components/common/CModal";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { dialogHook } from "../../../util/customhooks";
import { gql } from "apollo-boost";
import { col2 } from "../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";
import update from "immutability-helper";
import AddItemsJobForm from "./addItemsJobForm";
import AddServiceJobForm from "./addServiceJobForm";

const GET_RECORDS = gql`
  query ($id: UUID) {
    customer: customerAll {
      value: id
      label: fullName
      type: customerType
    }
    items: jobItemByParent(id: $id) {
      id
      type
      descriptions
      item {
        id
        descLong
      }
      qty
      cost
      subTotal
      outputTax
      billed
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($items: [Map_String_ObjectScalar], $id: UUID) {
    upsert: upsertJobItemsByParent(items: $items, id: $id) {
      id
    }
  }
`;

const DELETE_RECORD = gql`
  mutation ($id: UUID) {
    removeJobItem(id: $id) {
      id
    }
  }
`;
const { Text } = Typography;

const JobOrderForm = ({ visible, hide, ...props }) => {
  const [editable, setEditable] = useState({});
  const [items, setItems] = useState([]);

  const { loading, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.id,
    },
    onCompleted: (result) => {
      if (!_.isEmpty(result.items)) {
        setItems(result.items);
      }
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        console.log("upsert", data);
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Job Order Information Updated");
          }
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data)) {
          message.success("Removed successfully");
          refetch({
            id: props?.id,
          });
        }
      },
    }
  );

  const [modal, showModal] = dialogHook(AddItemsJobForm, (result) => {
    // item form
    if (!_.isEmpty(result)) {
      // validate here
      if (_.isEmpty(items)) {
        setItems(result);
      } else {
        //append
        setItems([...items, ...result]);
      }
    }
  });

  const [modalService, showModalService] = dialogHook(
    AddServiceJobForm,
    (result) => {
      // item form
      if (!_.isEmpty(result)) {
        // validate here
        if (_.isEmpty(items)) {
          setItems(result);
        } else {
          //append
          setItems([...items, ...result]);
        }
      }
    }
  );

  //======================= =================== =================================================//

  const onSubmit = () => {
    upsertRecord({
      variables: {
        items: items,
        id: props?.id,
      },
    });
  };

  const onChangeArray = (element, record, newValue) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    if (element === "qty") {
      let data = update(payload, {
        [index]: {
          [element]: {
            $set: newValue || 0,
          },
          subTotal: {
            $set: newValue * record.cost,
          },
        },
      });
      setItems(data);
    } else {
      if (Number(newValue) <= 0) {
        message.error("Invalid Cost. Cost must not be less than zero or zero");
      } else {
        let data = update(payload, {
          [index]: {
            [element]: {
              $set: newValue || 0,
            },
            subTotal: {
              $set: record.qty * newValue,
            },
          },
        });
        setItems(data);
      }
    }
  };

  const _delete = (record) => {
    let payload = _.clone(items);
    if (record.isNew) {
      //delete in array
      _.remove(payload, function (n) {
        return n.id === record.id;
      });
      setItems(payload);
      message.success("Item removed");
    } else {
      //delete in database
      removeRecord({
        variables: {
          id: record.id,
        },
      });
    }
  };

  const selectItems = () => {
    if (props?.id) {
      if (props?.customer?.customerType === 2) {
        showModal({ show: true, myProps: { isGovernment: true, list: items } });
      } else {
        showModal({
          show: true,
          myProps: { isGovernment: false, list: items },
        });
      }
    }
    //
  };

  const selectService = () => {
    if (props?.id) {
      showModalService({
        show: true,
        myProps: {},
      });
    }
    //
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "descriptions",
      key: "descriptions",
      width: 700,
      render: (text) => (
        <span>
          {_.truncate(text, {
            length: 254,
            separator: "...",
          })}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record) => {
        let color = record.type === "ITEM" ? "blue" : "green";
        return (
          <Tag key={text} color={color}>
            {record.type}
          </Tag>
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Qty" editable={true} />,
      dataIndex: "qty",
      key: "qty",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.billed || props?.completed) {
              message.error(
                "This Job Order is already billed/completed. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "qty"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "qty"] ? (
          <InputNumber
            defaultValue={record.qty}
            autoFocus
            onBlur={(e) => {
              let newValue = e?.target?.value;
              onChangeArray("qty", record, newValue);
              setEditable({ ...editable, [record.id + "qty"]: false });
            }}
            style={{ width: 150 }}
          />
        ) : (
          <span>{numeral(record.qty).format("0,0")}</span>
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Cost" editable={true} />,
      dataIndex: "cost",
      key: "cost",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.billed || props?.completed) {
              message.error(
                "This Job Order is already billed/completed. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "cost"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "cost"] ? (
          <InputNumber
            defaultValue={record.cost}
            autoFocus
            onBlur={(e) => {
              let newValue = e?.target?.value;
              onChangeArray("cost", record, newValue);
              setEditable({ ...editable, [record.id + "cost"]: false });
            }}
            style={{ width: 150 }}
          />
        ) : (
          <span>{numeral(record.cost).format("0,0.00")}</span>
        );
      },
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (text, record) => (
        <span>{numeral(record.subTotal).format("0,0.00")}</span>
      ),
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          type="danger"
          size="small"
          onClick={() => {
            _delete(record);
          }}
          disabled={props?.billed || props?.completed}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  return (
    <CModal
      allowFullScreen={true}
      title={"Job Order Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="jobForm"
          key="submit"
          onClick={onSubmit}
          type="primary"
          loading={upsertLoading}
          disabled={props.billed}
        >
          Submit
        </Button>,
      ]}
    >
      <Row>
        <Col {...col2}>
          <div className="w-full">
            <ul className="w-full list-none">
              <li className="w-full flex">
                <div className="font-bold w-35">Customer :</div>
                <div>{props?.customer?.fullName}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Customer Address :</div>
                <div>{props?.customer?.address}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Job Number :</div>
                <div>{props?.jobNo}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Date of Transaction :</div>
                <div>{moment(props?.dateTrans).format("MMMM DD, YYYY")}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Due Date :</div>
                <div>{moment(props?.deadline).format("MMMM DD, YYYY")}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Job Description:</div>
                <div>{props?.description}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Assign Office :</div>
                <div>{props?.office?.officeDescription}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Repair Type :</div>
                <div>{props?.repair?.description}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Issurance :</div>
                <div>{props?.insurance?.description}</div>
              </li>
            </ul>
          </div>
        </Col>
        <Col {...col2}>
          <div className="w-full">
            <ul className="w-full list-none">
              <li className="w-full flex">
                <div className="font-bold w-35">Plate Number :</div>
                <div>{props?.plateNo}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Engine Number :</div>
                <div>{props?.engineNo}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Chassis Number:</div>
                <div>{props?.chassisNo}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Body Color :</div>
                <div>{props?.bodyColor}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Year Model :</div>
                <div>{props?.yearModel}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Series Number :</div>
                <div>{props?.series}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Make (Brand) :</div>
                <div>{props?.make}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Remarks/Notes :</div>
                <div>{props?.remarks}</div>
              </li>
              <li className="w-full flex">
                <div className="font-bold w-35">Total Cost :</div>
                <Text type="success">
                  {numeral(_.sumBy(items, "subTotal")).format("0,0.00")}
                </Text>
              </li>
            </ul>
          </div>
        </Col>
        <Col span={24}>
          <Divider>Transaction Details</Divider>
          <div className="float-right">
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              size="small"
              onClick={selectItems}
              disabled={props?.billed || props?.completed}
            >
              Add Items/Parts
            </Button>
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              size="small"
              onClick={selectService}
              disabled={props?.billed || props?.completed}
            >
              Add Service
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <Table
            loading={loading || removeLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={items}
            rowKey={(record) => record.id}
            size="small"
            pagination={{
              pageSize: 5,
            }}
          />
        </Col>
      </Row>
      {modal}
      {modalService}
    </CModal>
  );
};

export default JobOrderForm;
