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
} from "antd";
import { DeleteFilled, BarcodeOutlined } from "@ant-design/icons";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import FilterSelect from "../../../../util/customForms/filterSelect";
import CModal from "../../../../app/components/common/CModal";
import ColTitlePopUp from "../../../../app/components/common/ColTitlePopUp";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { dialogHook } from "../../../../util/customhooks";
import { gql } from "apollo-boost";
import {
  col4,
  createObj,
  typeLabel,
  poType,
  col2,
  col3,
  PR_PO_TYPE,
} from "../../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";
import update from "immutability-helper";
import InventoryBySupplierModal from "../../Inventorydialogs/supplierInventory";

const GET_RECORDS = gql`
  query ($id: UUID) {
    pt: paymentTermActive {
      value: id
      label: paymentDesc
    }
    supplier: supplierActive {
      value: id
      label: supplierFullname
    }
    prItems: prItemNoPo {
      value: prNo
      label: prNo
      remarks
    }
    items: poItemByParent(id: $id) {
      id
      item {
        id
        descLong
        item_conversion
      }
      unitMeasurement
      quantity
      unitCost
      prNos
      type
      type_text
    }
    projectList: projectLists {
      value: id
      label: description
    }
    assetList: findAllAssets {
      value: id
      label: description
    }
  }
`;

const GET_PR_ITEMS = gql`
  query ($prNos: [String], $status: Boolean, $id: UUID) {
    prItems: getPrItemInPO(prNos: $prNos, status: $status, id: $id) {
      id
      item {
        id
        descLong
        item_conversion
      }
      purchaseRequest {
        id
        prNo
      }
      unitMeasurement
      requestedQty
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation (
    $id: UUID
    $items: [Map_String_ObjectScalar]
    $forRemove: [Map_String_ObjectScalar]
    $fields: Map_String_ObjectScalar
  ) {
    upsert: upsertPO(
      id: $id
      items: $items
      forRemove: $forRemove
      fields: $fields
    ) {
      id
    }
  }
`;

const DELETE_RECORD = gql`
  mutation ($id: UUID) {
    removePoItem(id: $id) {
      id
    }
  }
`;

const POForm = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);

  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [editable, setEditable] = useState({});
  const [items, setItems] = useState([]);
  const [prNo, setPrNo] = useState(props?.prNos ? props.prNos.split(",") : []);
  const [prItems, setPrItems] = useState([]);
  const [forRemove, setForRemove] = useState([]);
  const [category, setCategory] = useState(props.category ?? "");
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.id,
    },
    fetchPolicy: "network-only",
  });

  const {
    loading: loadingPrItems,
    data: dataPrItems,
    fetchMore: fetchPrItems,
  } = useQuery(GET_PR_ITEMS, {
    variables: {
      prNos: prNo,
      status: props?.isApprove || false,
      id: props?.id,
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Purchase Order Information Updated");
          } else {
            hide("Purchase Order Information Added");
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

  const [modal, showModal] = dialogHook(InventoryBySupplierModal, (result) => {
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
    payload.supplier = { id: data?.supplier };
    payload.paymentTerms = { id: data?.paymentTerms };
    payload.prNos = _.toString(data?.prNos);
    payload.noPr = _.isEmpty(data?.prNos);
    payload.project = null;
    payload.assets = null;
    if (data?.category === "PROJECTS") {
      payload.project = { id: data?.project };
    } else if (data?.category === "SPARE_PARTS") {
      payload.assets = { id: data?.assets };
    }
    if (_.isEmpty(props?.id)) {
      payload.office = account?.office;
      payload.userId = account?.id;
      payload.preparedBy = account?.fullName;
    }
    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
        items: items,
        forRemove: forRemove,
      },
    });
  };

  const orderItems = () => {
    const { getFieldValue } = form;
    let supplier = getFieldValue("supplier");
    if (supplier) {
      //show items with supplier
      showModal({
        show: true,
        myProps: { items: items, type: "PO", supplier: supplier },
      });
    } else {
      //show all items that is belong to this office
      message.info("Please select supplier");
    }
  };

  const onChangeArray = (element, record, newValue, def) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        [element]: {
          $set: newValue || def,
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
    if (el === "type") {
      return (
        <FilterSelect
          allowClear
          defaultValue={record?.type}
          field="type"
          autoFocus
          placeholder="Select type"
          onChange={(e) => {
            onChangeArray(el, record, e, "none");
          }}
          onBlur={() => {
            setEditable({ ...editable, [record.id + el]: false });
          }}
          list={poType}
        />
      );
    } else {
      return (
        <InputNumber
          defaultValue={record[el]}
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

  const colInputDeals = (record, el) => {
    if (record.type === "discountRate" || record.type === "discountAmount") {
      return (
        <InputNumber
          defaultValue={record[el]}
          autoFocus
          onBlur={(e) => {
            let newValue = e?.target?.value;
            onChangeArray(el, record, newValue, "");
            setEditable({ ...editable, [record.id + el]: false });
          }}
          style={{ width: 150 }}
        />
      );
    } else {
      return (
        <Input
          defaultValue={record[el]}
          // size="small"
          autoFocus
          onBlur={(e) => {
            let newValue = e?.target?.value;
            onChangeArray(el, record, newValue, null);
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
      title: <ColTitlePopUp descripton="Type" editable={true} />,
      dataIndex: "type",
      key: "type",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isApprove || props?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "type"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "type"] ? (
          colInput(record, "type")
        ) : (
          <span key={text}>{typeLabel(record?.type) || "N/A"}</span>
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Disc./Deals" editable={true} />,
      dataIndex: "type_text",
      key: "type_text",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isApprove || props?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "type_text"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "type_text"] ? (
          colInputDeals(record, "type_text")
        ) : (
          <span key={text}>{record.type_text}</span>
        );
      },
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Qty (UoP)"
          popup="Unit of Purchase"
          editable={true}
        />
      ),
      dataIndex: "quantity",
      key: "quantity",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isApprove || props?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              console.log("double click");
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
        <ColTitlePopUp
          descripton="Unit Cost (UoP)"
          popup="Unit of Purchase"
          editable={true}
        />
      ),
      dataIndex: "unitCost",
      key: "unitCost",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isApprove || props?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "unitCost"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "unitCost"] ? (
          colInput(record, "unitCost")
        ) : (
          <span key={text}>{numeral(record.unitCost).format("0,0.00")}</span>
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
          disabled={props?.isApprove || props?.isVoided}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  const renderExpandableRow = (record) => {
    let list = [];
    if (prItems) {
      list = prItems.filter((itm) => record.item.id === itm.item.id);
    }
    return (
      <Table
        rowKey={(row) => row.id}
        className="gx-table-responsive"
        locale={{
          emptyText: "No PR Selected on this item.",
        }}
        style={{ borderRadius: 0 }}
        size={"small"}
        pagination={false}
        dataSource={list}
        columns={[
          {
            title: "PR#",
            dataIndex: "purchaseRequest.prNo",
            render: (text, record) => (
              <span key={text}>{record?.purchaseRequest?.prNo}</span>
            ),
          },
          {
            title: "Description",
            dataIndex: "item.descLong",
            render: (text, record) => (
              <span key={text}>{record?.item?.descLong}</span>
            ),
          },
          {
            title: "Unit of Measurement",
            key: "unitMeasurement",
            dataIndex: "unitMeasurement",
          },
          {
            title: "Requested Quantity (UoP)",
            key: "requestedQty",
            dataIndex: "requestedQty",
            render: (text, record) => {
              return (
                <span key={text}>
                  {numeral(record.requestedQty).format("0,0")}
                </span>
              );
            },
          },
        ]}
      />
    );
  };

  //item manage
  const mapObject = (list) => {
    let payload = props?.id ? _.clone(items) : [];
    if (!_.isEmpty(list)) {
      (list || []).map((value) => {
        let index = _.findIndex(payload, (x) => x.item.id === value.item.id);
        if (index < 0) {
          let obj = createObj(value, "PO");
          obj.prNos = prNo.toString();
          obj.noPr = false;
          payload.push(obj);
        } else {
          payload[index]["quantity"] = _.sumBy(list, function (obj) {
            if (value.item.id === obj.item.id) {
              return obj.requestedQty;
            }
          });
          payload[index]["prNos"] = prNo.toString();
        }
      });
      let itemIds = _.map(list, "item.id");
      if (props?.id) {
        //removes items to database
        let tobeRemove = _.filter(payload, function (o) {
          //remove item where not included in PR items
          return !_.includes(itemIds, o.item.id) && !_.isEmpty(o.prNos);
        });
        if (!_.isEmpty(tobeRemove)) {
          //remove query if naay sulod
          setForRemove([...forRemove, ...tobeRemove]);
        }
      }
      payload = _.filter(payload, function (o) {
        //remove item where not included in PR items
        return _.includes(itemIds, o.item.id);
      });
    } else {
      payload = [];
    }
    return payload;
  };

  const selectedPrItem = async (selected) => {
    await fetchPrItems({
      variables: {
        prNos: selected,
        id: props?.id,
        status: props?.isApprove || false,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        console.log("fetchMoreResult => ", fetchMoreResult);
        let list = fetchMoreResult?.prItems;
        let result = mapObject(list);
        setItems(result);
        setPrItems(list);
      },
    });
  };

  //triggers
  useMemo(() => {
    //use memo to avoid memory leaks
    if (props?.id) {
      setItems(_.get(data, "items", []));
      setPrItems(_.get(dataPrItems, "prItems", []));
    }
  }, [data, dataPrItems]);

  return (
    <CModal
      allowFullScreen={true}
      title={"Purchase Order Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="poForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
          disabled={_.isEmpty(items) || props?.isApprove || props?.isVoided}
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        form={form}
        name="poForm"
        id="poForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col4}>
            <FormInput
              description={"Purchase Order #"}
              name="poNumber"
              initialValue={props?.poNumber}
              placeholder="Auto Generated"
              disabled
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Purchase Order Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.preparedDate)}
              name="preparedDate"
              type="datepicker"
              placeholder="Purchase Order Date"
              disabled={props?.isApprove || props?.isVoided}
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"ETA Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.etaDate)}
              name="etaDate"
              type="datepicker"
              placeholder="ETA Date"
              disabled={props?.isApprove || props?.isVoided}
            />
          </Col>
          <Col {...col4}>
            <FormSelect
              loading={loading}
              description={"Supplier"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.supplier?.id}
              name="supplier"
              field="supplier"
              placeholder="Supplier"
              list={_.get(data, "supplier")}
              disabled={props?.isApprove || props?.isVoided}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"Terms of Payment"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.paymentTerms?.id}
              name="paymentTerms"
              field="paymentTerms"
              placeholder="Terms of Payment"
              list={_.get(data, "pt")}
              disabled={props?.isApprove || props?.isVoided}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"PR Number(s)"}
              initialValue={prNo}
              name="prNos"
              field="prNos"
              mode="multiple"
              placeholder="PR Number(s)"
              onChange={(e) => {
                if (!_.isEmpty(e)) {
                  let notes = "";
                  e.forEach((value) => {
                    const prs = _.get(data, "prItems", []);
                    const pr = _.find(prs, { value: value });
                    notes = notes + " " + pr?.remarks;
                  });
                  if (notes) {
                    setFieldValue("remarks", notes);
                  }
                } else {
                  setFieldValue("remarks", null);
                }
                setPrNo(e);
                selectedPrItem(e);
              }}
              list={_.get(data, "prItems")}
              disabled={props?.isApprove || props?.isVoided || props?.noPr}
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Prepared By"}
              name="preparedBy"
              initialValue={props?.id ? props?.preparedBy : account?.fullName}
              placeholder="Prepared By"
              disabled
            />
          </Col>

          <Col {...col2}>
            <FormSelect
              loading={loading}
              description={"Purchase Category"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.category}
              name="category"
              field="category"
              placeholder="Select Purchase Category"
              onChange={(e) => {
                setCategory(e);
              }}
              list={PR_PO_TYPE}
              disabled={props?.isApprove || props?.isVoided}
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
                disabled={props?.isApprove || props?.isVoided}
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
                disabled={props?.isApprove || props?.isVoided}
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
              onClick={orderItems}
              disabled={props?.isApprove || props?.isVoided || !_.isEmpty(prNo)}
            >
              Order Items
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <Table
            loading={loading || removeLoading || loadingPrItems}
            className="gx-table-responsive"
            columns={columns}
            dataSource={items}
            rowKey={(record) => record.id}
            expandedRowRender={(record) => renderExpandableRow(record)}
            size="small"
            pagination={{
              pageSize: 5,
            }}
          />
        </Col>
      </Row>
      {modal}
    </CModal>
  );
};

export default POForm;
