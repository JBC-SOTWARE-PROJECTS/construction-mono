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
  Alert,
  Checkbox,
  DatePicker,
  Skeleton,
  Modal,
} from "antd";
import {
  DeleteFilled,
  BarcodeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import FormCheckbox from "../../../../util/customForms/formCheckbox";
import CModal from "../../../../app/components/common/CModal";
import ColTitlePopUp from "../../../../app/components/common/ColTitlePopUp";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { dialogHook } from "../../../../util/customhooks";
import { gql } from "apollo-boost";
import {
  PR_PO_TYPE,
  col2,
  col4,
  col8,
  createObjRecPo,
  decimal,
} from "../../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";
import update from "immutability-helper";
import InventoryBySupplierModal from "../../Inventorydialogs/supplierInventory";

const { confirm } = Modal;
const GET_RECORDS = gql`
  query ($id: UUID) {
    offices: activeOffices {
      value: id
      label: officeDescription
    }
    pt: paymentTermActive {
      value: id
      label: paymentDesc
    }
    supplier: supplierActive {
      value: id
      label: supplierFullname
    }
    poList: poNotYetCompleted {
      value: id
      label: poNumber
    }
    trans: transTypeByTag(tag: "RECEIVING") {
      value: id
      label: description
    }
    items: recItemByParent(id: $id) {
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
      refPoItem {
        id
        purchaseOrder {
          id
          poNumber
        }
        qtyInSmall
        deliveredQty
        deliveryBalance
        unitCost
      }
      receiveQty
      receiveUnitCost
      discountRate
      receiveDiscountCost
      isFg
      isDiscount
      isPartial
      isCompleted
      isTax
      expirationDate
      totalAmount
      inputTax
      netAmount
      isPosted
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
  query ($id: UUID) {
    poItems: poItemNotReceiveMonitoring(id: $id) {
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
      purchaseOrder {
        id
        poNumber
      }
      unitMeasurement
      quantity
      unitCost
      qtyInSmall
      deliveredQty
      deliveryBalance
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation (
    $id: UUID
    $items: [Map_String_ObjectScalar]
    $fields: Map_String_ObjectScalar
  ) {
    upsert: upsertRec(id: $id, items: $items, fields: $fields) {
      id
    }
  }
`;

const DELETE_RECORD = gql`
  mutation ($id: UUID) {
    removeRecItem(id: $id) {
      id
    }
  }
`;

export const OVERRIDEITEMS = gql`
  mutation (
    $id: UUID
    $po: UUID
    $toDelete: [Map_String_ObjectScalar]
    $toInsert: [Map_String_ObjectScalar]
    $amount: Map_String_ObjectScalar
  ) {
    overrideRecItems(
      id: $id
      po: $po
      toDelete: $toDelete
      toInsert: $toInsert
      amount: $amount
    ) {
      id
    }
  }
`;

const DRForm = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);

  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [category, setCategory] = useState(props.category ?? "");
  const [editable, setEditable] = useState({});
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState({
    amount: props?.amount,
    vatInclusive: props?.id ? props?.vatInclusive : true,
    vatRate: props?.id ? props?.vatRate : 12,
    inputTax: props?.inputTax,
    netAmount: props?.netAmount,
    fixDiscount: props?.fixDiscount,
    grossAmount: props?.grossAmount,
    totalDiscount: props?.totalDiscount,
    netDiscount: props?.netDiscount,
  });
  const [form] = Form.useForm();

  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.id,
    },
    fetchPolicy: "network-only",
  });

  const { loading: loadingPoItems, fetchMore: fetchPoItems } = useQuery(
    GET_PR_ITEMS,
    {
      variables: {
        id: null,
      },
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Delivery Receiving Information Updated");
          } else {
            hide("Delivery Receiving Information Added");
          }
        }
      },
    }
  );

  const [override, { loading: overrideLoading }] = useMutation(OVERRIDEITEMS, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.overrideRecItems;
      if (!_.isEmpty(result)) {
        message.success("Delivery Receiving Information Updated");
      }
    },
  });

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

  const [modal, showModal] = dialogHook(
    InventoryBySupplierModal,
    async (result) => {
      // item form
      if (!_.isEmpty(result)) {
        // validate here
        if (_.isEmpty(items)) {
          setItems(result);
          await recalCulateForexLocal(result, {});
        } else {
          //append
          setItems([...items, ...result]);
          await recalCulateForexLocal([...items, ...result], {});
        }
      }
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.purchaseOrder = { id: data.purchaseOrder };
    payload.paymentTerms = { id: data.paymentTerms };
    payload.supplier = { id: data.supplier };
    payload.receivedOffice = { id: data.receivedOffice };
    payload.project = null;
    payload.assets = null;
    if (data?.category === "PROJECTS") {
      payload.project = { id: data?.project };
    } else if (data?.category === "SPARE_PARTS") {
      payload.assets = { id: data?.assets };
    }
    if (_.isEmpty(props?.id)) {
      payload.userId = account?.id;
      payload.userFullname = account?.fullName;
    }
    //amounts
    payload.grossAmount = amount.grossAmount;
    payload.totalDiscount = amount.totalDiscount;
    payload.netDiscount = amount.netDiscount;
    payload.amount = amount.amount;
    payload.inputTax = amount.inputTax;
    payload.netAmount = amount.netAmount;
    payload.vatRate = amount.vatRate;
    payload.vatInclusive = amount.vatInclusive;

    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
        items: items,
      },
    });
  };

  const recItems = () => {
    const { getFieldValue } = form;
    let supplier = getFieldValue("supplier");
    if (supplier) {
      //show items with supplier
      showModal({
        show: true,
        myProps: { items: items, type: "REC", supplier: supplier },
      });
    } else {
      //show all items that is belong to this office
      message.info("Please select supplier");
    }
  };

  //calculations
  const vatConfigCalculation = async (vatInc, vat) => {
    console.log("get value", vatInc);
    console.log("get vat", vat);
    let inputTax = 0;
    let net_amount = 0;
    let vatRate = vat / 100;
    let calculatedTax = [];
    //check first if items are not empty
    if (!_.isEmpty(items)) {
      //if true recalculate Tax
      _.forEach(items, function (obj, key) {
        if (vatInc) {
          inputTax =
            ((obj.totalAmount - obj.receiveDiscountCost) / (vatRate + 1)) *
            vatRate;
          net_amount = obj.isTax
            ? obj.totalAmount - inputTax - obj.receiveDiscountCost
            : obj.totalAmount - obj.receiveDiscountCost;
        } else {
          inputTax = (obj.totalAmount - obj.receiveDiscountCost) * vatRate;
          net_amount = obj.isTax
            ? obj.totalAmount + inputTax - obj.receiveDiscountCost
            : obj.totalAmount - obj.receiveDiscountCost;
        }
        let data = update(items, {
          [key]: {
            netAmount: {
              $set: decimal(net_amount),
            },
            inputTax: {
              $set: decimal(obj.isTax ? inputTax : 0.0),
            },
          },
        });
        calculatedTax.push(data[key]);
      });
      setItems(calculatedTax);
      await recalCulateForexLocal(calculatedTax, {});
    }
  };

  const changeVatConfig = async (el, value) => {
    const { getFieldValue, setFieldsValue } = form;
    let vatRate = getFieldValue("vatRate");
    if (el === "vatInclusive") {
      await vatConfigCalculation(value, parseInt(vatRate));
      // setAmount({ ...amount, vatInclusive: value });
    } else {
      await vatConfigCalculation(getFieldValue("vatInclusive"), value);
      // setAmount({ ...amount, vatRate: value });
    }
    setFieldsValue({ [el]: value });
  };

  const setTotalSumarry = async (cost, inputTax, netAmount, discount, obj) => {
    const { getFieldValue, setFieldsValue } = form;
    let gross = decimal(_.sum(cost));
    let disc = decimal(_.sum(discount));
    let tax = decimal(_.sum(inputTax));
    let net = decimal(_.sum(netAmount));
    let inc = getFieldValue("vatInclusive");
    let vat = getFieldValue("vatRate");

    setAmount({
      ...amount,
      grossAmount: gross,
      totalDiscount: disc,
      netDiscount: gross - disc,
      inputTax: tax,
      netAmount: net,
      amount: inc ? gross - disc : net,
      vatRate: vat,
      vatInclusive: inc,
    });

    setFieldsValue({ ["grossAmount"]: numeral(gross).format("0,0.00") });
    setFieldsValue({ ["totalDiscount"]: numeral(disc).format("0,0.00") });
    setFieldsValue({ ["netDiscount"]: numeral(gross - disc).format("0,0.00") });
    setFieldsValue({ ["inputTax"]: numeral(tax).format("0,0.00") });
    setFieldsValue({ ["netAmount"]: numeral(net).format("0,0.00") });
    setFieldsValue({
      ["amount"]: numeral(inc ? gross - disc : net).format("0,0.00"),
    });

    if (!_.isEmpty(obj)) {
      confirm({
        title: `Do you want override purchase order ?`,
        icon: <ExclamationCircleOutlined />,
        content: "Please click ok to proceed.",
        onOk() {
          override({
            variables: {
              id: props?.id,
              po: obj.po,
              toDelete: obj.tobedeleted,
              toInsert: obj.payload,
              amount: {
                grossAmount: gross,
                totalDiscount: disc,
                netDiscount: gross - disc,
                inputTax: tax,
                netAmount: net,
                amount: inc ? gross - disc : net,
              },
            },
          });
        },
        onCancel() {
          hide();
        },
      });

      console.log("to be removed => ", obj);
    }
  };

  const recalCulateForexLocal = async (listItems, override) => {
    let cost = [];
    let inputTax = [];
    let netAmount = [];
    let discount = [];
    if (!_.isEmpty(listItems)) {
      _.forEach(listItems, function (e) {
        cost.push(e.totalAmount);
        inputTax.push(e.inputTax);
        netAmount.push(e.netAmount);
        discount.push(e.receiveDiscountCost);
      });
    }
    await setTotalSumarry(cost, inputTax, netAmount, discount, override);
  };

  //element, record, newValue
  const onChangeArray = async (el, obj, value) => {
    let payload = _.clone(items);
    let key = _.findIndex(payload, ["id", obj.id]);
    let data = [];
    let vatRate = amount.vatRate / 100;
    if (el === "receiveQty") {
      let totalAmount = value * obj.receiveUnitCost;
      let discount = totalAmount * (obj.discountRate / 100);
      let net_amount = totalAmount;
      let tax = 0;
      if (amount.vatInclusive) {
        tax = ((totalAmount - discount) / (vatRate + 1)) * vatRate;
        net_amount = totalAmount - (obj.isTax ? tax : 0) - discount;
      } else {
        tax = (totalAmount - discount) * vatRate;
        net_amount = totalAmount + (obj.isTax ? tax : 0) - discount;
      }
      if (obj.refPoItem) {
        data = update(items, {
          [key]: {
            [el]: {
              $set: value,
            },
            totalAmount: {
              $set: decimal(totalAmount),
            },
            receiveDiscountCost: {
              $set: decimal(discount),
            },
            inputTax: {
              $set: decimal(obj.isTax ? tax : 0),
            },
            netAmount: {
              $set: decimal(net_amount),
            },
            isCompleted: {
              $set: !_.isEmpty(obj.refPoItem)
                ? value >= obj.refPoItem?.deliveryBalance
                  ? true
                  : false
                : true,
            },
            isPartial: {
              $set: !_.isEmpty(obj.refPoItem)
                ? value < obj.refPoItem?.deliveryBalance
                  ? true
                  : false
                : false,
            },
          },
        });
      } else {
        data = update(items, {
          [key]: {
            [el]: {
              $set: value,
            },
            totalAmount: {
              $set: decimal(totalAmount),
            },
            inputTax: {
              $set: decimal(obj.isTax ? tax : 0),
            },
            netAmount: {
              $set: decimal(net_amount),
            },
            receiveDiscountCost: {
              $set: decimal(discount),
            },
          },
        });
      }
    } else if (el === "receiveUnitCost") {
      let totalAmount = value * obj.receiveQty;
      let discount = totalAmount * (obj.discountRate / 100);
      let net_amount = totalAmount;
      let tax = 0;
      if (amount.vatInclusive) {
        tax = ((totalAmount - discount) / (vatRate + 1)) * vatRate;
        net_amount = totalAmount - (obj.isTax ? tax : 0) - discount;
      } else {
        tax = (totalAmount - discount) * vatRate;
        net_amount = totalAmount + (obj.isTax ? tax : 0) - discount;
      }
      data = update(items, {
        [key]: {
          [el]: {
            $set: decimal(value),
          },
          totalAmount: {
            $set: decimal(totalAmount),
          },
          inputTax: {
            $set: decimal(obj.isTax ? tax : 0),
          },
          netAmount: {
            $set: decimal(net_amount),
          },
          receiveDiscountCost: {
            $set: decimal(discount),
          },
        },
      });
    } else if (el === "discountRate") {
      let discount = obj.totalAmount * (value / 100);
      let netAmount = 0;
      let inputTax = amount.vatInclusive
        ? ((obj.totalAmount - discount) / (vatRate + 1)) * vatRate
        : (obj.totalAmount - discount) * vatRate;
      if (obj.isTax) {
        //netAmount = record.totalAmount + inputTax - record.receiveDiscountCost;
        if (amount.vatInclusive) {
          netAmount = obj.totalAmount - inputTax - discount;
        } else {
          netAmount = obj.totalAmount + inputTax - discount;
        }
      } else {
        netAmount = obj.totalAmount - discount;
      }
      data = update(items, {
        [key]: {
          [el]: {
            $set: decimal(value),
          },
          receiveDiscountCost: {
            $set: decimal(discount),
          },
          netAmount: {
            $set: decimal(netAmount),
          },
          inputTax: {
            $set: decimal(obj.isTax ? inputTax : 0),
          },
          isDiscount: {
            $set: value > 0 ? true : false,
          },
        },
      });
    } else if (el === "receiveDiscountCost") {
      let discount = value ? parseFloat(value) : 0;
      const lprice = obj.totalAmount;
      const sprice = obj.totalAmount - discount;
      let discountRate = ((lprice - sprice) / lprice) * 100;
      let netAmount = 0;
      let inputTax = amount.vatInclusive
        ? ((obj.totalAmount - discount) / (vatRate + 1)) * vatRate
        : (obj.totalAmount - discount) * vatRate;
      if (obj.isTax) {
        //netAmount = record.totalAmount + inputTax - record.receiveDiscountCost;
        if (amount.vatInclusive) {
          netAmount = obj.totalAmount - inputTax - discount;
        } else {
          netAmount = obj.totalAmount + inputTax - discount;
        }
      } else {
        netAmount = obj.totalAmount - discount;
      }
      data = update(items, {
        [key]: {
          receiveDiscountCost: {
            $set: decimal(discount),
          },
          discountRate: {
            $set: decimal(discountRate),
          },
          netAmount: {
            $set: decimal(netAmount),
          },
          inputTax: {
            $set: decimal(obj.isTax ? inputTax : 0),
          },
          isDiscount: {
            $set: discount > 0 ? true : false,
          },
        },
      });
    } else if (el === "expirationDate") {
      data = update(items, {
        [key]: {
          [el]: {
            $set: value,
          },
        },
      });
    } else if (el === "isTax") {
      let inputTax = amount.vatInclusive
        ? ((obj.totalAmount - obj.receiveDiscountCost) / (vatRate + 1)) *
          vatRate
        : (obj.totalAmount - obj.receiveDiscountCost) * vatRate;
      let netAmount = 0;
      if (value) {
        //netAmount = record.totalAmount + inputTax - record.receiveDiscountCost;
        if (amount.vatInclusive) {
          netAmount = obj.totalAmount - inputTax - obj.receiveDiscountCost;
        } else {
          netAmount = obj.totalAmount + inputTax - obj.receiveDiscountCost;
        }
      } else {
        netAmount = obj.totalAmount - obj.receiveDiscountCost;
      }

      data = update(items, {
        [key]: {
          inputTax: {
            $set: decimal(value ? inputTax : 0.0),
          },
          netAmount: {
            $set: decimal(netAmount),
          },
          [el]: {
            $set: value,
          },
        },
      });
    } else if (el === "isPartial") {
      data = update(items, {
        [key]: {
          [el]: {
            $set: value,
          },
          isCompleted: {
            $set: !value,
          },
        },
      });
    } else if (el === "isCompleted") {
      data = update(items, {
        [key]: {
          [el]: {
            $set: value,
          },
          isPartial: {
            $set: !value,
          },
        },
      });
    } else {
      data = update(items, {
        [key]: {
          [el]: {
            $set: value,
          },
        },
      });
    }
    await setItems(data);
    await recalCulateForexLocal(data, {});
  };

  const _delete = (record) => {
    let payload = _.clone(items);
    if (record.isNew) {
      //delete in array
      _.remove(payload, function (n) {
        return n.id === record.id;
      });
      setItems(payload);
      recalCulateForexLocal(payload, {});
      message.success("Item removed");
    } else {
      //delete in database
      removeRecord({
        variables: {
          id: record.id,
        },
      });
      _.remove(payload, function (n) {
        return n.id === record.id;
      });
      setItems(payload);
      recalCulateForexLocal(payload, {});
    }
  };

  const colInput = (record, el) => {
    return (
      <InputNumber
        defaultValue={record[el]}
        autoFocus
        onBlur={(e) => {
          let newValue = parseFloat(e?.target?.value);
          if (el === "receiveQty") {
            newValue = parseInt(e?.target?.value);
          }
          onChangeArray(el, record, newValue);
          setEditable({ ...editable, [record.id + el]: false });
        }}
        style={{ width: 150 }}
      />
    );
  };

  const colInputDate = (record, el) => {
    let date = record[el] ? record[el] : new Date();
    return (
      <DatePicker
        defaultValue={moment(date)}
        className="gx-w-100"
        autoFocus
        placeholder={"Expiration"}
        onBlur={(e) => {
          let newValue = e?.target?.value ? moment(e?.target?.value) : null;
          onChangeArray(el, record, newValue);
          setEditable({ ...editable, [record.id + el]: false });
        }}
      />
    );
  };

  const columns = [
    {
      title: "Item Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      width: 300,
      fixed: "left",
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
      dataIndex: "receiveQty",
      key: "receiveQty",
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isPosted || props?.isVoid) {
              message.error(
                "This Delivery Receiving is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "receiveQty"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "receiveQty"] ? (
          colInput(record, "receiveQty")
        ) : (
          <span key={text}>{numeral(record.receiveQty).format("0,0")}</span>
        );
      },
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Unit Cost (UoU)"
          popup="Unit of Usage"
          editable={true}
        />
      ),
      dataIndex: "receiveUnitCost",
      key: "receiveUnitCost",
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isPosted || props?.isVoid) {
              message.error(
                "This Delivery Receiving is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "receiveUnitCost"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "receiveUnitCost"] ? (
          colInput(record, "receiveUnitCost")
        ) : (
          <span key={text}>
            {numeral(record.receiveUnitCost).format("0,0.00")}
          </span>
        );
      },
    },
    {
      title: "Gross Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (text, record) => (
        <span key={text}>{numeral(record.totalAmount).format("0,0.00")}</span>
      ),
    },
    {
      title: <ColTitlePopUp descripton="Discount Rate" editable={true} />,
      dataIndex: "discountRate",
      key: "discountRate",
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isPosted || props?.isVoid) {
              message.error(
                "This Delivery Receiving is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "discountRate"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "discountRate"] ? (
          colInput(record, "discountRate")
        ) : (
          <span key={text}>
            {numeral(record?.discountRate).format("0,0.00")}
          </span>
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Discount Cost" editable={true} />,
      dataIndex: "receiveDiscountCost",
      key: "receiveDiscountCost",
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isPosted || props?.isVoid) {
              message.error(
                "This Delivery Receiving is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({
                ...editable,
                [e.id + "receiveDiscountCost"]: true,
              });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "receiveDiscountCost"] ? (
          colInput(record, "receiveDiscountCost")
        ) : (
          <span key={text}>
            {numeral(record?.receiveDiscountCost).format("0,0.00")}
          </span>
        );
      },
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      render: (text, record) => (
        <span key={text}>{numeral(record?.netAmount).format("0,0.00")}</span>
      ),
    },
    {
      title: <ColTitlePopUp descripton="Expiration Date" editable={true} />,
      dataIndex: "expirationDate",
      key: "expirationDate",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (props?.isPosted || props?.isVoid) {
              message.error(
                "This Delivery Receiving is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "expirationDate"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "expirationDate"] ? (
          colInputDate(record, "expirationDate")
        ) : (
          <span key={text}>
            {record?.expirationDate
              ? moment(record.expirationDate).format("YYYY-MM-DD")
              : "N/A"}
          </span>
        );
      },
    },
    {
      title: "Input Tax",
      dataIndex: "inputTax",
      key: "inputTax",
      align: "right",
      render: (text, record) => (
        <span key={text}>{numeral(record?.inputTax).format("0,0.00")}</span>
      ),
    },
    {
      title: <ColTitlePopUp descripton="Tax" editable={true} />,
      dataIndex: "isTax",
      key: "isTax",
      render: (text, record) => {
        return (
          <Checkbox
            key="isTax"
            checked={record?.isTax}
            onChange={(e) => onChangeArray("isTax", record, e?.target?.checked)}
            disabled={props?.isPosted || props?.isVoid}
          />
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Free Goods" editable={true} />,
      dataIndex: "isFg",
      key: "isFg",
      render: (text, record) => {
        return (
          <Checkbox
            key="isFg"
            checked={record?.isFg}
            onChange={(e) => onChangeArray("isFg", record, e?.target?.checked)}
            disabled={props?.isPosted || props?.isVoid}
          />
        );
      },
    },
    {
      title: "Discounted",
      dataIndex: "isDiscount",
      key: "isDiscount",
      render: (text, record) => {
        return (
          <Checkbox key="isDiscount" checked={record?.isDiscount} disabled />
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Partial" editable={true} />,
      dataIndex: "isPartial",
      key: "isPartial",
      render: (text, record) => {
        return (
          <Checkbox
            key="isPartial"
            checked={record?.isPartial}
            onChange={(e) =>
              onChangeArray("isPartial", record, e?.target?.checked)
            }
            disabled={props?.isPosted || props?.isVoid}
          />
        );
      },
    },
    {
      title: <ColTitlePopUp descripton="Completed" editable={true} />,
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (text, record) => {
        return (
          <Checkbox
            key="isCompleted"
            checked={record?.isCompleted}
            onChange={(e) =>
              onChangeArray("isCompleted", record, e?.target?.checked)
            }
            disabled={props?.isPosted || props?.isVoid}
          />
        );
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 50,
      render: (text, record) => (
        <Button
          type="danger"
          size="small"
          onClick={() => {
            _delete(record);
          }}
          disabled={props?.isPosted || props?.isVoid}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  const renderExpandableRow = (record) => {
    let list = [];
    if (!_.isEmpty(record?.refPoItem)) {
      list = [record?.refPoItem];
    }
    return (
      <Table
        rowKey={(row) => row.id + `${record?.item?.id}`}
        className="gx-table-responsive"
        locale={{
          emptyText: "No PO Selected on this item.",
        }}
        style={{ borderRadius: 0 }}
        size={"small"}
        pagination={false}
        dataSource={list}
        columns={[
          {
            title: "PO #",
            dataIndex: "purchaseOrder.poNumber",
            render: (text, record) => (
              <span key={text}>{record?.purchaseOrder?.poNumber}</span>
            ),
          },

          {
            title: "PO Qty (UoU)",
            key: "qtyInSmall",
            dataIndex: "qtyInSmall",
            render: (qtyInSmall) => (
              <span>{numeral(qtyInSmall).format("0,0")}</span>
            ),
          },
          {
            title: "PO Unit Cost (UoU)",
            key: "unitCost",
            dataIndex: "unitCost",
            render: (unitCost) => (
              <span>{numeral(unitCost).format("0,0.00")}</span>
            ),
          },
          {
            title: "Delivered (UoU)",
            key: "deliveredQty",
            dataIndex: "deliveredQty",
            render: (deliveredQty) => (
              <span>{numeral(deliveredQty).format("0,0")}</span>
            ),
          },
          {
            title: "Balance (UoU)",
            key: "deliveryBalance",
            dataIndex: "deliveryBalance",
            render: (deliveryBalance) => (
              <span>{numeral(deliveryBalance).format("0,0")}</span>
            ),
          },
        ]}
      />
    );
  };

  const selectedPOItem = async (e, tobedeleted) => {
    await fetchPoItems({
      variables: {
        id: e,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        // console.log("fetchMoreResult => ", fetchMoreResult)
        let list = fetchMoreResult?.poItems;
        let payload = [];
        let input_tax = 0;
        if (!_.isEmpty(list)) {
          (list || []).map((e) => {
            //start calculation
            let unitCost = decimal(e?.unitCost / e?.item?.item_conversion);
            let totalAmount = e?.deliveryBalance * unitCost;
            let net_amount = totalAmount;
            if (amount.vatInclusive) {
              input_tax = e?.item?.vatable
                ? (totalAmount / (amount.vatRate / 100 + 1)) *
                  (amount.vatRate / 100)
                : 0;
              net_amount = totalAmount - input_tax;
            } else {
              input_tax = e.item.vatable
                ? totalAmount * (amount.vatRate / 100)
                : 0;
              net_amount = totalAmount + input_tax;
            }
            //end calculation
            let obj = createObjRecPo(e, "REC-PO");
            obj.totalAmount = decimal(totalAmount);
            obj.inputTax = decimal(input_tax);
            obj.netAmount = decimal(net_amount);
            payload.push(obj);
          });
        } else {
          payload = [];
        }
        console.log("payload => ", payload);
        setItems(payload);
        if (_.isEmpty(tobedeleted)) {
          recalCulateForexLocal(payload, {});
        } else {
          recalCulateForexLocal(payload, {
            po: e,
            tobedeleted: tobedeleted,
            payload: payload,
          });
        }
      },
    });
  };

  //triggers
  useMemo(() => {
    //use memo to avoid memory leaks
    if (props?.id) {
      setItems(_.get(data, "items", []));
      // setPOItems(_.get(dataPrItems, "prItems", []));
    }
  }, [data]);

  return (
    <CModal
      allowFullScreen={true}
      title={"Delivery Receiving Information"}
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
          disabled={_.isEmpty(items) || props?.isPosted || props?.isVoid}
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
            name="poForm"
            id="poForm"
            error={formError}
            onFinish={onSubmit}
            className="form-card"
          >
            <Row>
              <Col span={24}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <label className="srr-label">
                    SRR Number:{" "}
                    <span>{props?.id ? props?.rrNo : "Auto Generated"}</span>
                  </label>
                  <br />
                  <label className="srr-label-recby">
                    Received By:{" "}
                    <span>
                      {props?.id ? props?.userFullname : account?.fullName}
                    </span>
                  </label>
                  <Alert
                    message="Purchase Order No must appear on all related correspondence, shipping papers and invoices."
                    type="info"
                    showIcon
                  />
                </Form.Item>
              </Col>
              <Col {...col4}>
                <FormInput
                  description={"Delivery Date"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={moment(props?.receiveDate)}
                  name="receiveDate"
                  type="datepicker"
                  placeholder="Delivery Date"
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              <Col {...col4}>
                <FormSelect
                  loading={loading}
                  description={"Select PO # :"}
                  initialValue={props?.purchaseOrder?.id}
                  name="purchaseOrder"
                  field="purchaseOrder"
                  placeholder="Select PO #"
                  list={_.get(data, "poList")}
                  onChange={(e) => {
                    if (props?.id) {
                      selectedPOItem(e, items);
                    } else {
                      selectedPOItem(e);
                    }
                  }}
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              <Col {...col4}>
                <FormInput
                  description={"Reference SI/DR Date"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={moment(props?.receivedRefDate)}
                  name="receivedRefDate"
                  type="datepicker"
                  placeholder="Reference SI/DR Date"
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              <Col {...col4}>
                <FormInput
                  description={"Reference SI/DR Number"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="receivedRefNo"
                  initialValue={props?.receivedRefNo}
                  disabled={props?.isPosted || props?.isVoid}
                  placeholder="Reference SI/DR Number"
                />
              </Col>
              <Col {...col4}>
                <FormSelect
                  loading={loading}
                  description={"Supplier"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={props?.supplier?.id}
                  name="supplier"
                  field="supplier"
                  placeholder="Supplier"
                  list={_.get(data, "supplier")}
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              {/*  */}
              <Col {...col4}>
                <FormSelect
                  loading={loading}
                  description={"Receiving Office"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={props?.receivedOffice?.id}
                  name="receivedOffice"
                  field="receivedOffice"
                  placeholder="Receiving Office"
                  list={_.get(data, "offices")}
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              <Col {...col4}>
                <FormSelect
                  loading={loading}
                  description={"Terms of Payment"}
                  initialValue={props?.paymentTerms?.id}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="paymentTerms"
                  field="paymentTerms"
                  placeholder="Terms of Payment"
                  list={_.get(data, "pt")}
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              <Col {...col4}>
                <FormSelect
                  loading={loading}
                  description={"Received Type as"}
                  initialValue={props?.account}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  name="account"
                  field="account"
                  placeholder="Received Type as"
                  list={_.get(data, "trans")}
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              <Col {...col2}>
                <FormSelect
                  loading={loading}
                  description={"Receiving Category"}
                  rules={[
                    { required: true, message: "This Field is required" },
                  ]}
                  initialValue={props?.category}
                  name="category"
                  field="category"
                  placeholder="Select Receiving Category"
                  onChange={(e) => {
                    setCategory(e);
                  }}
                  list={PR_PO_TYPE}
                  disabled={props?.isPosted || props?.isVoid}
                />
              </Col>
              <Col {...col2}>
                {category === "PROJECTS" && (
                  <FormSelect
                    loading={loading}
                    description={"Project"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={props?.project?.id}
                    name="project"
                    field="project"
                    placeholder="Select Project"
                    list={_.get(data, "projectList", [])}
                    disabled={props?.isPosted || props?.isVoid}
                  />
                )}
                {category === "SPARE_PARTS" && (
                  <FormSelect
                    loading={loading}
                    description={"Equipments (Assets)"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={props?.assets?.id}
                    name="assets"
                    field="assets"
                    placeholder="Select Equipments (Assets)"
                    list={_.get(data, "assetList", [])}
                    disabled={props?.isPosted || props?.isVoid}
                  />
                )}
              </Col>
              <Col span={24}>
                <FormInput
                  description={"Remarks/Notes"}
                  name="receivedRemarks"
                  initialValue={props?.receivedRemarks}
                  disabled={props?.isPosted || props?.isVoid}
                  placeholder="Remarks/Notes"
                />
              </Col>
              {/*  */}
              <Col {...col8}>
                <FormInput
                  description={"Gross Amount"}
                  name="grossAmount"
                  initialValue={numeral(amount.grossAmount).format("0,0.00")}
                  placeholder="Gross Amount"
                  disabled
                />
              </Col>
              <Col {...col8}>
                <FormInput
                  description={"Total Discount"}
                  name="totalDiscount"
                  initialValue={numeral(amount.totalDiscount).format("0,0.00")}
                  placeholder="Total Discount"
                  disabled
                />
              </Col>
              <Col {...col8}>
                <FormInput
                  description={"Net of Discount"}
                  name="netDiscount"
                  initialValue={numeral(amount.netDiscount).format("0,0.00")}
                  placeholder="Net of Discount"
                  disabled
                />
              </Col>
              <Col {...col8}>
                <FormInput
                  description={"VAT Rate"}
                  name="vatRate"
                  type="number"
                  initialValue={amount.vatRate}
                  onChange={(e) => {
                    changeVatConfig("vatRate", parseInt(e));
                  }}
                  disabled={props?.isPosted || props?.isVoid}
                  placeholder="VAT Rate"
                />
              </Col>
              <Col {...col8}>
                <FormCheckbox
                  description={"Vat Inclusive ?"}
                  name="vatInclusive"
                  valuePropName="checked"
                  horizontal={true}
                  onChange={(e) =>
                    changeVatConfig("vatInclusive", e?.target?.checked)
                  }
                  initialValue={amount.vatInclusive}
                  disabled={props?.isPosted || props?.isVoid}
                  field="Vat Inclusive"
                />
              </Col>
              <Col {...col8}>
                <FormInput
                  description={"Input Tax"}
                  name="inputTax"
                  initialValue={numeral(amount.inputTax).format("0,0.00")}
                  placeholder="Input Tax"
                  disabled
                />
              </Col>
              <Col {...col8}>
                <FormInput
                  description={"Net of Vat"}
                  name="netAmount"
                  initialValue={numeral(amount.netAmount).format("0,0.00")}
                  placeholder="Net of Vat"
                  disabled
                />
              </Col>
              <Col {...col8}>
                <FormInput
                  description={"Total Amount"}
                  name="amount"
                  initialValue={numeral(amount.amount).format("0,0.00")}
                  placeholder="Total Amount"
                  disabled
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
                  onClick={recItems}
                  disabled={props?.isPosted || props?.isVoid}
                >
                  Receive Items
                </Button>
              </div>
            </Col>
            <Col span={24}>
              <Table
                loading={
                  loading || removeLoading || loadingPoItems || overrideLoading
                }
                scroll={{ x: 3000 }}
                columns={columns}
                dataSource={items}
                rowKey={(record) => record.id}
                expandedRowRender={(record) => renderExpandableRow(record)}
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

export default DRForm;
