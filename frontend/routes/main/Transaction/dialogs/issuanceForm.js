import React, { useState, useContext, useMemo } from "react";
import { AccountContext } from "../../../../app/components/accessControl/AccountContext";
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
} from "antd";
import { DeleteFilled, BarcodeOutlined } from "@ant-design/icons";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import ColTitlePopUp from "../../../../app/components/common/ColTitlePopUp";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { dialogHook } from "../../../../util/customhooks";
import { gql } from "apollo-boost";
import { col2, col3, col4, ISSUE_TYPE } from "../../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";
import update from "immutability-helper";
import InventoryByOfficeModal from "../../Inventorydialogs/inventory";

const GET_RECORDS = gql`
  query ($id: UUID) {
    offices: activeOffices {
      value: id
      label: officeDescription
    }
    items: stiItemByParent(id: $id) {
      id
      item {
        id
        descLong
        item_conversion
        vatable
        unit_of_usage {
          id
          unitDescription
        }
      }
      uou
      issueQty
      unitCost
      isPosted
      remarks
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
    $id: UUID
  ) {
    upsert: upsertSTI(fields: $fields, items: $items, id: $id) {
      id
    }
  }
`;

const DELETE_RECORD = gql`
  mutation ($id: UUID) {
    removeStiItem(id: $id) {
      id
    }
  }
`;

const GET_CONSTANT = gql`
  query ($id: UUID) {
    projects: projectByOffice(id: $id) {
      value: id
      label: description
    }
    list: getAllEmployeesBasic {
      value: id
      label: fullName
    }
  }
`;

const IssuanceForm = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);
  const [formError, setFormError] = useState({});
  /* error = { errorTitle: "", errorMsg: ""}*/
  const [editable, setEditable] = useState({});
  const [items, setItems] = useState([]);
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [emp, setEmp] = useState([]);
  const [location, setLocation] = useState(props?.issueTo?.id || null);

  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.id,
    },
    fetchPolicy: "network-only",
  });

  const { loading: projectLoading } = useQuery(GET_CONSTANT, {
    variables: {
      id: location,
    },
    onCompleted: (data) => {
      if (!_.isEmpty(data?.projects)) {
        setProjects(data?.projects);
      } else {
        setProjects([]);
      }
      if (!_.isEmpty(data?.list)) {
        setEmp(data?.list);
      } else {
        setEmp([]);
      }
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Issuance/Expense Information Updated");
          } else {
            hide("Issuance/Expense Information Added");
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
          message.success("Item removed");
          refetch({
            id: props?.id,
          });
        }
      },
    }
  );

  const [modal, showModal] = dialogHook(InventoryByOfficeModal, (result) => {
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

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.issueTo = { id: data?.issueTo };
    payload.project = { id: data?.project };
    if (_.isEmpty(props?.id)) {
      payload.issueFrom = account?.office;
      payload.issued_by = account;
    }
    upsertRecord({
      variables: {
        fields: payload,
        items: items,
        id: props?.id,
      },
    });
  };

  const issueItems = () => {
    showModal({ show: true, myProps: { items: items, type: "STI" } });
  };

  const onChangeArray = (element, record, newValue) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        [element]: {
          $set: element === "remarks" ? newValue : newValue || 0,
        },
      },
    });
    setItems(data);
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
      title: "Item Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      render: (text, record) => <span key={text}>{record.item?.descLong}</span>,
    },
    {
      title: <ColTitlePopUp descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Qty (UoU)"
          popup="Unit of Usage"
          editable={true}
        />
      ),
      dataIndex: "issueQty",
      key: "issueQty",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isPosted || props?.isCancel) {
              message.error(
                "This Issuance/Expense is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "issueQty"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "issueQty"] ? (
          colInput(record, "issueQty")
        ) : (
          <span key={text}>{numeral(record.issueQty).format("0,0")}</span>
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Remarks/Notes" editable={true} />,
      dataIndex: "remarks",
      key: "remarks",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isPosted || props?.isCancel) {
              message.error(
                "This Issuance/Expense is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "remarks"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "remarks"] ? (
          colInput(record, "remarks")
        ) : (
          <span key={text}>{record?.remarks || "N/A"}</span>
        );
      },
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
          disabled={props?.isPosted || props?.isCancel}
          icon={<DeleteFilled />}
        />
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
      title={"Issuance/Expense Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="stiForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
          disabled={_.isEmpty(items) || props?.isPosted || props?.isCancel}
        >
          Submit
        </Button>,
      ]}
    >
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <MyForm
            form={form}
            name="stiForm"
            id="stiForm"
            error={formError}
            onFinish={onSubmit}
            className="form-card"
          >
            <Row>
              <Col {...col3}>
                <FormInput
                  description={"Transaction #"}
                  name="issueNo"
                  initialValue={props?.issueNo}
                  placeholder="Auto Generated"
                  disabled
                />
              </Col>
              <Col {...col3}>
                <FormInput
                  description={"Date"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={moment(props?.issueDate)}
                  name="issueDate"
                  type="datepicker"
                  placeholder="Date"
                  disabled={props?.isPosted || props?.isCancel}
                />
              </Col>
              <Col {...col3}>
                <FormSelect
                  description={"Type"}
                  initialValue={props?.issueType}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="issueType"
                  field="issueType"
                  placeholder="Type"
                  list={ISSUE_TYPE}
                  disabled={props?.isPosted || props?.isCancel}
                />
              </Col>
              <Col {...col3}>
                <FormSelect
                  loading={loading}
                  description={"Issue/Expense to"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={props?.issueTo?.id}
                  name="issueTo"
                  field="issueTo"
                  placeholder="Issue/Expense to"
                  onChange={(e) => {
                    setLocation(e);
                  }}
                  list={_.get(data, "offices")}
                  disabled={props?.isPosted || props?.isCancel}
                />
              </Col>
              <Col {...col3}>
                <FormSelect
                  loading={projectLoading}
                  description={"Project"}
                  initialValue={props?.project?.id}
                  name="project"
                  field="project"
                  placeholder="Project"
                  list={projects}
                  disabled={props?.isPosted || props?.isCancel}
                />
              </Col>
              <Col {...col3}>
                <FormSelect
                  loading={projectLoading}
                  description={"Received By"}
                  initialValue={props?.received_by?.id}
                  name="received_by"
                  field="received_by"
                  placeholder="Claimed By"
                  list={emp}
                  disabled={props?.isPosted || props?.isCancel}
                />
              </Col>
            </Row>
          </MyForm>
          <Row>
            <Col span={24}>
              <Divider>Transaction Details</Divider>
              <div className="float-right">
                <Button
                  icon={<BarcodeOutlined />}
                  type="primary"
                  size="small"
                  onClick={issueItems}
                  disabled={props?.isPosted || props?.isCancel}
                >
                  Issue/Expense Items
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
        </>
      )}
      {modal}
    </CModal>
  );
};

export default IssuanceForm;
