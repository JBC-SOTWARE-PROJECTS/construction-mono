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
} from "antd";
import { DeleteFilled, BarcodeOutlined } from "@ant-design/icons";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import ColTitlePopUp from "../../../../app/components/common/ColTitlePopUp";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { dialogHook } from "../../../../util/customhooks";
import { gql } from "apollo-boost";
import {
  col2,
  col3,
  col4,
  PR_PO_TYPE,
  PR_TYPE,
} from "../../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";
import update from "immutability-helper";
import InventoryByOfficeModal from "../../Inventorydialogs/inventory";
import InventoryBySupplierModal from "../../Inventorydialogs/supplierInventory";

const GET_RECORDS = gql`
  query ($id: UUID) {
    offices: activeOffices {
      value: id
      label: officeDescription
    }
    supplier: supplierActive {
      value: id
      label: supplierFullname
    }
    items: prItemByParent(id: $id) {
      id
      item {
        id
        descLong
      }
      unitMeasurement
      requestedQty
      onHandQty
      remarks
    }
    projectList {
      value: id
      label: description
    }
    assetList: findAllAssets {
      value: id
      label: description
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation (
    $id: UUID
    $items: [Map_String_ObjectScalar]
    $fields: Map_String_ObjectScalar
  ) {
    upsert: upsertPR(id: $id, items: $items, fields: $fields) {
      id
    }
  }
`;

const DELETE_RECORD = gql`
  mutation ($id: UUID) {
    removePrItem(id: $id) {
      id
    }
  }
`;

const PRForm = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [editable, setEditable] = useState({});
  const [items, setItems] = useState([]);
  const [form] = Form.useForm();
  const [category, setCategory] = useState(props.category ?? "");

  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.id,
    },
    fetchPolicy: "network-only",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Purchase Request Information Updated");
          } else {
            hide("Purchase Request Information Added");
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

  const [modalSuplier, showSupplierModal] = dialogHook(
    InventoryBySupplierModal,
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

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.requestedOffice = { id: data?.requestedOffice };
    payload.supplier = { id: data?.supplier };
    payload.project = null;
    payload.assets = null;
    if (data?.category === "PROJECTS") {
      payload.project = { id: data?.project };
    } else if (data?.category === "SPARE_PARTS") {
      payload.assets = { id: data?.assets };
    }
    if (_.isEmpty(props?.id)) {
      payload.requestingOffice = account?.office;
      payload.userId = account?.id;
      payload.userFullname = account?.fullName;
    }
    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
        items: items,
      },
    });
  };

  const requestItems = () => {
    const { getFieldValue } = form;
    let supplier = getFieldValue("supplier");
    if (supplier) {
      //show items with supplier
      showSupplierModal({
        show: true,
        myProps: { items: items, type: "PR", supplier: supplier },
      });
    } else {
      //show all items that is belong to this office
      showModal({ show: true, myProps: { items: items, type: "PR" } });
    }
  };

  const onChangeArray = (element, record, newValue) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        [element]: {
          $set: newValue || 0,
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

  const columns = [
    {
      title: "Item Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      render: (text, record) => <span>{record.item?.descLong}</span>,
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Unit of Measurement (UoP/UoU)"
          popup="Unit of Purchase/Unit of Usage"
        />
      ),
      dataIndex: "unitMeasurement",
      key: "unitMeasurement",
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Qty (UoP)"
          popup="Unit of Purchase"
          editable={true}
        />
      ),
      dataIndex: "requestedQty",
      key: "requestedQty",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isApprove) {
              message.error(
                "This Purchase Request is already approved. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id] ? (
          <InputNumber
            defaultValue={record.requestedQty}
            autoFocus
            onBlur={(e) => {
              let newValue = e?.target?.value;
              onChangeArray("requestedQty", record, newValue);
              setEditable({ ...editable, [record.id]: false });
            }}
            style={{ width: 150 }}
          />
        ) : (
          <span>{numeral(record.requestedQty).format("0,0")}</span>
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
          disabled={props?.isApprove}
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
      title={"Purchase Request Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="prForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
          disabled={_.isEmpty(items) || props?.isApprove}
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        form={form}
        name="prForm"
        id="prForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col3}>
            <FormInput
              description={"Purchase Request #"}
              name="prNo"
              initialValue={props?.prNo}
              placeholder="Auto Generated"
              disabled
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Date Needed"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.prDateNeeded)}
              name="prDateNeeded"
              type="datepicker"
              placeholder="Date Needed"
              disabled={props?.isApprove}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"Supplier"}
              initialValue={props?.supplier?.id}
              name="supplier"
              field="supplier"
              placeholder="Supplier"
              list={_.get(data, "supplier")}
              disabled={props?.isApprove}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"Request To"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.requestedOffice?.id}
              name="requestedOffice"
              field="requestedOffice"
              placeholder="Request To"
              list={_.get(data, "offices")}
              disabled={props?.isApprove}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              description={"Urgency"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.prType}
              name="prType"
              field="prType"
              placeholder="Urgency"
              list={PR_TYPE}
              disabled={props?.isApprove}
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Requested By"}
              name="userFullname"
              initialValue={props?.id ? props?.userFullname : account?.fullName}
              placeholder="Requested By"
              disabled
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              loading={loading}
              description={"Request Category"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.category}
              name="category"
              field="category"
              placeholder="Select Request Category"
              onChange={(e) => {
                setCategory(e);
              }}
              list={PR_PO_TYPE}
              disabled={props?.isApprove}
            />
          </Col>
          <Col {...col2}>
            {category === "PROJECTS" && (
              <FormSelect
                loading={loading}
                description={"Project"}
                rules={[{ required: true, message: "This Field is required" }]}
                initialValue={props?.project?.id}
                name="project"
                field="project"
                placeholder="Select Project"
                list={_.get(data, "projectList", [])}
                disabled={props?.isApprove}
              />
            )}
            {category === "SPARE_PARTS" && (
              <FormSelect
                loading={loading}
                description={"Equipments (Assets)"}
                rules={[{ required: true, message: "This Field is required" }]}
                initialValue={props?.assets?.id}
                name="assets"
                field="assets"
                placeholder="Select Equipments (Assets)"
                list={_.get(data, "assetList", [])}
                disabled={props?.isApprove}
              />
            )}
          </Col>

          <Col span={24}>
            <FormInput
              description={"Remarks/Notes"}
              initialValue={props?.remarks}
              name="remarks"
              type="textarea"
              placeholder="Remarks/Notes"
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
              onClick={requestItems}
              disabled={props?.isApprove}
            >
              Request Items
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
      {modalSuplier}
    </CModal>
  );
};

export default PRForm;
