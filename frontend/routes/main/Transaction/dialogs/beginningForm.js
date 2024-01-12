import React, { useState, useMemo } from "react";
import {
  Col,
  Row,
  Button,
  Divider,
  Table,
  InputNumber,
  Form,
  message,
  Input,
  Skeleton,
  Dropdown,
  Menu,
  Tag,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import FormBtnSubmit from "../../../../util/customForms/formBtnSubmit";
import CModal from "../../../../app/components/common/CModal";
import ColTitlePopUp from "../../../../app/components/common/ColTitlePopUp";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col3 } from "../../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";

const GET_RECORDS = gql`
  query ($id: UUID) {
    items: beginningListByItem(item: $id) {
      id
      refNum
      dateTrans
      item {
        id
        descLong
        unit_of_usage {
          id
          unitDescription
        }
      }
      office {
        id
        officeDescription
      }
      uou
      quantity
      unitCost
      isPosted
      isCancel
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($fields: Map_String_ObjectScalar) {
    upsert: beginningBalanceInsert(fields: $fields) {
      id
    }
  }
`;

const UPSERT_QTY = gql`
  mutation ($qty: Int, $id: UUID) {
    upsert: upsertBegQty(qty: $qty, id: $id) {
      id
    }
  }
`;

const UPSERT_STATUS = gql`
  mutation ($status: Boolean, $id: UUID) {
    upsert: updateBegBalStatus(status: $status, id: $id) {
      id
    }
  }
`;

const { confirm } = Modal;

const options = ["Post", "Void"];

const BeginningForm = ({ visible, hide, ...props }) => {
  console.log("props => ", props);
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [editable, setEditable] = useState({});
  const [items, setItems] = useState([]);
  const [form] = Form.useForm();

  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.item?.id,
    },
    fetchPolicy: "network-only",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        console.log(data?.upsert);
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Beginning Balance Added");
          refetch();
        } else {
          message.error("Cannot Setup Beginning Balance.");
        }
        form.resetFields();
      },
    }
  );

  const [upsertQty, { loading: upsertBegLoading }] = useMutation(UPSERT_QTY, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (!_.isEmpty(data?.upsert?.id)) {
        if (props?.id) {
          message.success("Beginning Balance Updated");
          refetch();
        }
      }
    },
  });

  const [postVoid, { loading: postVoidLoading }] = useMutation(UPSERT_STATUS, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (!_.isEmpty(data?.upsert?.id)) {
        if (props?.id) {
          message.success("Beginning Balance Updated");
          refetch();
        }
      }
    },
  });

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.office = props?.office;
    payload.item = props?.item;

    if (data?.unitCost <= 0) {
      message.error("Unit cost must not be less than or equal to zero");
    } else {
      upsertRecord({
        variables: {
          fields: payload,
        },
      });
    }
  };

  const _approve = (id, status, message) => {
    confirm({
      title: `Do you want ${message} this Beginning Balance?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        postVoid({
          variables: {
            status: status,
            id: id,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const disabledMenu = (option, record) => {
    let result = false;
    if (option === "Void") {
      result = !record?.isPosted;
    }
    return result;
  };

  const menus = (record) => (
    <Menu
      onClick={(e) => {
        if (e.key === "Post") {
          _approve(record?.id, true, "post");
        } else if (e.key === "Void") {
          _approve(record?.id, false, "void");
        }
      }}
    >
      {options.map((option) => (
        <Menu.Item key={option} disabled={disabledMenu(option, record)}>
          {option}
        </Menu.Item>
      ))}
    </Menu>
  );

  const onChangeArray = (element, record, newValue) => {
    upsertQty({
      variables: {
        qty: newValue,
        id: record?.id,
      },
    });
  };

  const colInput = (record, el) => {
    if (el === "remarks") {
      return (
        <Input
          defaultValue={record[el]}
          // size="small"
          autoFocus
          onBlur={(e) => {
            let newValue = e?.target?.value;
            onChangeArray(el, record, newValue, 0);
            setEditable({ ...editable, [record.id + el]: false });
          }}
          style={{ width: 150 }}
        />
      );
    } else {
      return (
        <InputNumber
          defaultValue={record[el]}
          // size="small"
          autoFocus
          onBlur={(e) => {
            let newValue = e?.target?.value;
            onChangeArray(el, record, newValue, 0);
            setEditable({ ...editable, [record.id + el]: false });
          }}
          style={{ width: 150 }}
        />
      );
    }
  };

  const columns = [
    {
      title: "Transaction Date",
      dataIndex: "dateTrans",
      key: "dateTrans",
      render: (text, record) => (
        <span key={text}>
          {moment(record?.dateTrans).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Reference #",
      dataIndex: "refNum",
      key: "refNum",
    },
    {
      title: <ColTitlePopUp descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
    },
    {
      title: "Office",
      dataIndex: "office",
      key: "office",
      render: (text, record) => (
        <span key={text}>{record.office?.officeDescription}</span>
      ),
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Qty (UoU)"
          popup="Unit of Usage"
          editable={true}
        />
      ),
      dataIndex: "quantity",
      key: "quantity",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (e?.isPosted || e?.isCancel) {
              message.error(
                "This Beginning Balance is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "quantity"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "quantity"] ? (
          colInput(record, "quantity")
        ) : (
          <span key={text}>{numeral(record.quantity).format("0,0")}</span>
        );
      },
    },
    {
      title: (
        <ColTitlePopUp descripton="Unit Cost (UoU)" popup="Unit of Usage" />
      ),
      dataIndex: "unitCost",
      key: "unitCost",
      render: (unitCost) => <span>{numeral(unitCost).format("0,0.00")}</span>,
    },
    {
      title: "Status",
      dataIndex: "isPosted",
      key: "isPosted",
      render: (status, record) => {
        let color = status === true ? "green" : "blue";
        let text = status === true ? "POSTED" : "NEW";
        if (record.isCancel) {
          color = "red";
          text = "VOIDED";
        }
        return (
          <span>
            <Tag color={color} key={color}>
              {text}
            </Tag>
          </span>
        );
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span key={text}>
          <Dropdown
            overlay={menus(record)}
            placement="bottomRight"
            trigger={["click"]}
          >
            <i className="gx-icon-btn icon icon-ellipse-v" />
          </Dropdown>
        </span>
      ),
    },
  ];

  //triggers
  useMemo(() => {
    //use memo to avoid memory leak
    if (props?.id) {
      setItems(_.get(data, "items", []));
    }
  }, [data]);

  return (
    <CModal
      allowFullScreen={true}
      title={`Setup Beginning Balance [${props?.descLong}]`}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
      ]}
    >
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <MyForm
            form={form}
            name="begForm"
            id="begForm"
            error={formError}
            onFinish={onSubmit}
            className="form-card"
          >
            <Row>
              <Col {...col3}>
                <FormInput
                  description={"Date"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={moment(props?.dateTrans)}
                  name="dateTrans"
                  type="datepicker"
                  placeholder="Date"
                />
              </Col>
              <Col {...col3}>
                <FormInput
                  description={"Quantity (+ -) (UoU)"}
                  name="quantity"
                  type="number"
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  placeholder="Quantity (+ -)"
                />
              </Col>
              <Col {...col3}>
                <FormInput
                  description={"Unit Cost (UoU)"}
                  name="unitCost"
                  type="number"
                  initialValue={0}
                  placeholder="Unit Cost (UoU)"
                />
              </Col>
              <Col span={24}>
                <FormBtnSubmit
                  type="primary"
                  block
                  loading={upsertLoading}
                  id="app.form.saveBeginning"
                />
              </Col>
            </Row>
          </MyForm>
          <Row>
            <Col span={24}>
              <Divider>Transaction Details</Divider>
            </Col>
            <Col span={24}>
              <Table
                loading={
                  loading ||
                  upsertLoading ||
                  upsertBegLoading ||
                  postVoidLoading
                }
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
        </>
      )}
    </CModal>
  );
};

export default BeginningForm;
