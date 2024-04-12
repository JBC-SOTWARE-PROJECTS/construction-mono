import React, { useContext, useMemo, useState } from "react";
import {
  PoChildrenDto,
  PurchaseOrderItems,
  PurchaseOrderItemsMonitoring,
  ReceivingReport,
} from "@/graphql/gql/graphql";
import {
  DeleteFilled,
  SaveOutlined,
  ScanOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  InputNumber,
  Row,
  Table,
  Tabs,
  Tag,
  message,
} from "antd";
import _ from "lodash";
import {
  decimalRound2,
  decimalRound4,
  NumberFormater,
  NumberFormaterDynamic,
  parserInputNumber,
  requiredField,
  shapeOptionValue,
} from "@/utility/helper";
import {
  FormSelect,
  FullScreenModal,
  FormDatePicker,
  FormDebounceSelect,
  FormTextArea,
  FormInput,
  FormInputNumber,
  FormCheckBox,
} from "@/components/common";
import {
  PURCHASE_CATEGORY,
  responsiveColumn4,
  responsiveColumn2,
} from "@/utility/constant";
import {
  useAssets,
  useInventoryAttachments,
  usePONotYetCompleted,
  useTransactionTypes,
} from "@/hooks/inventory";
import dayjs, { Dayjs } from "dayjs";
import Alert from "antd/es/alert/Alert";
import styled from "styled-components";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { useOffices, usePaymentTerms, useProjects } from "@/hooks/payables";
import type { UploadProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { Query } from "../../../../../graphql/gql/graphql";
import { IFormReceivingReport } from "@/interface/inventory/inventory-form";
import { useDialog } from "@/hooks";
import SupplierItemSelector from "@/components/inventory/supplierItemSelector";
import {
  formatPurchaseOrderReceiving,
  StockReceivingReportExtended,
} from "@/utility/inventory-helper";
import update from "immutability-helper";
import DocumentUpload from "@/components/common/document-upload";
import { apiUrlPrefix } from "@/shared/settings";
import {
  DELETE_RECORD_REC_ITEM,
  GET_PO_ITEMS,
  GET_RECEIVING_ITEMS,
  UPSERT_RECORD_DELIVERY_RECEIVING,
} from "@/graphql/inventory/deliveries-queries";
import ReceivingItemSummary from "../commons/receivingItemSumarry";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ReceivingReport | null | undefined;
  rrCategory: string;
}

interface IAmount {
  amount: number;
  vatInclusive: boolean;
  vatRate: number;
  inputTax: number;
  netAmount: number;
  fixDiscount: number;
  grossAmount: number;
  totalDiscount: number;
  netDiscount: number;
}

export default function UpsertReceivingModal(props: IProps) {
  const { hide, record, rrCategory } = props;
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  const account = useContext(AccountContext);
  const [category, setCategory] = useState(record?.category ?? rrCategory);
  const [editable, setEditable] = useState<any>({});
  const [items, setItems] = useState<StockReceivingReportExtended[]>([]);
  const [forRemove, setForRemove] = useState<StockReceivingReportExtended[]>(
    []
  );
  const [uploading, setUploading] = useState<boolean>(false);
  // =============== calc states =================================
  const [amount, setAmount] = useState<IAmount>({
    amount: record?.amount,
    vatInclusive: record?.id ? (record?.vatInclusive as boolean) : true,
    vatRate: record?.id ? record?.vatRate : 12,
    inputTax: record?.inputTax,
    netAmount: record?.netAmount,
    fixDiscount: record?.fixDiscount,
    grossAmount: record?.grossAmount,
    totalDiscount: record?.totalDiscount,
    netDiscount: record?.netDiscount,
  });
  // ====================== modals =============================
  const supplierItems = useDialog(SupplierItemSelector);
  // ===================== Queries ==============================
  const projects = useProjects({ office: null });
  const assets = useAssets();
  const paymentTerms = usePaymentTerms();
  const offices = useOffices();
  const transactionList = useTransactionTypes("RECEIVING");
  const poList = usePONotYetCompleted();

  const { attachments, loadingAttachments, fetchAttachments } =
    useInventoryAttachments(record?.id);

  const { loading, refetch } = useQuery<Query>(GET_RECEIVING_ITEMS, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data) => {
      let result = (data?.recItemByParent ??
        []) as StockReceivingReportExtended[];
      setItems(result);
    },
  });

  const [getPurchaseOrderItems, { loading: poItemsLoading }] =
    useLazyQuery<Query>(GET_PO_ITEMS);

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_DELIVERY_RECEIVING,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertRecNew?.id)) {
          if (record?.id) {
            hide("Delivery Receiving Information Updated");
          } else {
            hide("Delivery Receiving Information Added");
          }
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD_REC_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.removeRecItem?.id) {
          message.success("Item removed");
          refetch({
            id: record?.id,
          });
        }
      },
    }
  );

  //================== functions ====================
  const onOrderItems = () => {
    const { getFieldValue } = form;
    const payloadItems = _.cloneDeep(items);
    let supplier = getFieldValue("supplier");
    let propsObject = { itemIds: [], formModule: "SRR" };
    if (supplier) {
      //show items with supplier
      let extendedProps = { ...propsObject, supplier: supplier?.value };
      supplierItems(extendedProps, (result: StockReceivingReportExtended[]) => {
        if (!_.isEmpty(result)) {
          if (_.isEmpty(payloadItems)) {
            // ========== set =======================
            setItems(result);
          } else {
            // ========== concatonate ================
            setItems((prev) => [...prev, ...result]);
          }
        }
      });
    } else {
      message.warning("Please select supplier first");
    }
  };

  const _delete = (record: StockReceivingReportExtended) => {
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

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: IFormReceivingReport) => {
    let payload = {
      receiveDate: data.receiveDate,
      receivedRefDate: data.receivedRefDate,
      receivedRefNo: data.receivedRefNo,
      category: data.category,
      receivedRemarks: data.receivedRemarks,
      grossAmount: data.grossAmount,
      inputTax: data.inputTax,
      totalDiscount: data.totalDiscount,
      netAmount: data.netAmount,
      netDiscount: data.netDiscount,
      amount: data.amount,
      vatRate: data.vatRate,
      vatInclusive: data.vatInclusive,
    } as ReceivingReport;
    payload.purchaseOrder = { id: data.purchaseOrder };
    payload.paymentTerms = { id: data.paymentTerms };
    payload.supplier = { id: data.supplier?.value };
    payload.receivedOffice = { id: data.receivedOffice };
    payload.account = { id: data.account };
    payload.project = null;
    payload.assets = null;
    if (data?.category === "PROJECTS") {
      payload.project = { id: data?.project };
    } else if (data?.category === "SPARE_PARTS") {
      payload.assets = { id: data?.assets };
    }
    if (_.isEmpty(record?.id)) {
      payload.userId = account?.id;
      payload.userFullname = account?.fullName;
    }

    upsertRecord({
      variables: {
        id: record?.id,
        fields: payload,
        items: items,
        forRemove: forRemove,
      },
    });
  };

  // ===================== uploads ================
  const uploadProps: UploadProps = {
    name: "file",
    method: "POST",
    multiple: true,
    action: `${apiUrlPrefix}/attachment/inventory`,
    data: {
      id: record?.id,
    },
    accept: "image/*,application/pdf",
    onChange(info) {
      if (info.file.status === "uploading") {
        setUploading(true);
      }
      if (info.file.status === "done") {
        message.success(`Attachment uploaded successfully`);
        setUploading(false);
        fetchAttachments();
      } else if (info.file.status === "error") {
        message.error(`Attachment upload failed.`);
        setUploading(false);
        fetchAttachments();
      }
    },
    showUploadList: false,
  };
  // ================ end uploads ============================

  const getPOItems = (poId: string, forListingOnly?: boolean) => {
    getPurchaseOrderItems({
      variables: {
        id: poId,
      },
      onCompleted: (data) => {
        let obj = data?.getPurchaserOrderChildren as PoChildrenDto;
        if (obj?.parent?.id) {
          let list = obj.items as PurchaseOrderItemsMonitoring[];
          if (!forListingOnly) {
            // ==== set supplier ============
            if (obj?.parent?.supplier) {
              setFieldValue(
                "supplier",
                shapeOptionValue(
                  obj?.parent?.supplier?.supplierFullname,
                  obj?.parent?.supplier?.id
                )
              );
            } else {
              setFieldValue("supplier", null);
            }
            // ==== set category ============
            if (obj?.parent?.category) {
              setFieldValue("category", obj?.parent?.category);
              setCategory(obj?.parent?.category ?? "");
            }
            // ==== set project ============
            if (obj?.parent?.project) {
              setFieldValue("project", obj?.parent?.project?.id);
            } else {
              setFieldValue("project", null);
            }
            // ==== set assets ============
            if (obj?.parent?.assets) {
              setFieldValue("assets", obj?.parent?.assets?.id);
            } else {
              setFieldValue("assets", null);
            }
            // ====== set remarks ===========
            if (obj?.parent?.remarks) {
              setFieldValue("receivedRemarks", obj?.parent?.remarks);
            } else {
              setFieldValue("receivedRemarks", null);
            }
            // ====== set remarks ===========
            if (obj?.parent?.paymentTerms) {
              setFieldValue("paymentTerms", obj?.parent?.paymentTerms?.id);
            } else {
              setFieldValue("paymentTerms", null);
            }
            // ===== set result ==========
            let result = mapObject(list);
            setItems(result);
            //==== calculate ==============
            recalCulateForexLocal(result);
          }
        }
      },
    });
  };

  // ====================== useMemo =======================

  // =================== init ===============================
  const selectInValueInit = (id?: string, type?: string) => {
    if (_.isEmpty(id)) {
      return null;
    } else {
      if (type === "supplier") {
        if (record?.supplier?.id) {
          return shapeOptionValue(
            record?.supplier?.supplierFullname,
            record?.supplier?.id
          );
        }
        return null;
      }
    }
  };
  // =================== calculations ==========================
  const setCalculations = (
    cost: number,
    inputTax: number,
    netAmount: number,
    discount: number
  ) => {
    const { getFieldValue, setFieldsValue } = form;
    let gross = decimalRound2(cost);
    let disc = decimalRound2(discount);
    let tax = decimalRound2(inputTax);
    let net = decimalRound2(netAmount);
    let inc = getFieldValue("vatInclusive");
    let vat = getFieldValue("vatRate");

    setFieldsValue({
      grossAmount: gross,
      totalDiscount: disc,
      netDiscount: gross - disc,
      inputTax: tax,
      netAmount: net,
      amount: inc ? gross - disc : net,
    });

    setAmount((prev) => ({
      ...prev,
      grossAmount: gross,
      totalDiscount: disc,
      netDiscount: gross - disc,
      inputTax: tax,
      netAmount: net,
      amount: inc ? gross - disc : net,
      vatRate: vat,
      vatInclusive: inc,
    }));
  };

  const recalCulateForexLocal = (listItems: StockReceivingReportExtended[]) => {
    let cost = 0;
    let inputTax = 0;
    let netAmount = 0;
    let discount = 0;
    if (!_.isEmpty(listItems)) {
      _.forEach(listItems, (e) => {
        cost += Number(e.totalAmount);
        inputTax += Number(e.inputTax);
        netAmount += Number(e.netAmount);
        discount += Number(e.receiveDiscountCost);
      });
    }
    setCalculations(cost, inputTax, netAmount, discount);
  };
  // ================
  const onChangeNumbers = (
    el: string,
    obj: StockReceivingReportExtended,
    value: number
  ) => {
    let payload = _.clone(items);
    let key = _.findIndex(payload, ["id", obj.id]);
    let data = [] as StockReceivingReportExtended[];
    let vatRate = amount.vatRate / 100;
    if (el === "receiveQty") {
      let totalAmount = value * obj.receiveUnitCost;
      let discount = totalAmount * (obj.discountRate / 100);
      let net_amount = totalAmount;
      let tax = 0;
      let isCompleted = true;
      let isPartial = true;
      if (amount.vatInclusive) {
        tax = ((totalAmount - discount) / (vatRate + 1)) * vatRate;
        net_amount = totalAmount - (obj.isTax ? tax : 0) - discount;
      } else {
        tax = (totalAmount - discount) * vatRate;
        net_amount = totalAmount + (obj.isTax ? tax : 0) - discount;
      }

      if (obj.refPoItem) {
        if (value >= obj.refPoItem?.deliveryBalance) {
          isCompleted = true;
        } else {
          isCompleted = false;
        }
        if (value < obj.refPoItem?.deliveryBalance) {
          isPartial = true;
        } else {
          isPartial = false;
        }
        data = update(items, {
          [key]: {
            [el]: {
              $set: value,
            },
            totalAmount: {
              $set: decimalRound2(totalAmount),
            },
            receiveDiscountCost: {
              $set: decimalRound2(discount),
            },
            inputTax: {
              $set: decimalRound2(obj.isTax ? tax : 0),
            },
            netAmount: {
              $set: decimalRound2(net_amount),
            },
            isCompleted: {
              $set: isCompleted,
            },
            isPartial: {
              $set: isPartial,
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
              $set: decimalRound2(totalAmount),
            },
            inputTax: {
              $set: decimalRound2(obj.isTax ? tax : 0),
            },
            netAmount: {
              $set: decimalRound2(net_amount),
            },
            receiveDiscountCost: {
              $set: decimalRound2(discount),
            },
          },
        });
      }
    } else if (el === "receiveUnitCost") {
      let totalAmount = value * obj.receiveQty;
      let discount = totalAmount * (obj.discountRate / 100);
      let discountItemCost = value * (obj.discountRate / 100);
      let net_amount = totalAmount;
      let tax = 0;
      let unitCostDiscounted = value - discountItemCost;
      let unitCostVat = unitCostDiscounted;
      if (amount.vatInclusive) {
        tax = ((totalAmount - discount) / (vatRate + 1)) * vatRate;
        net_amount = totalAmount - (obj.isTax ? tax : 0) - discount;
        unitCostVat = unitCostDiscounted / (vatRate + 1);
      } else {
        tax = (totalAmount - discount) * vatRate;
        net_amount = totalAmount + (obj.isTax ? tax : 0) - discount;
        unitCostVat = unitCostDiscounted * vatRate + value;
      }
      data = update(items, {
        [key]: {
          [el]: {
            $set: decimalRound2(value),
          },
          recInventoryCost: {
            $set: decimalRound2(obj.isTax ? unitCostVat : unitCostDiscounted),
          },
          totalAmount: {
            $set: decimalRound2(totalAmount),
          },
          inputTax: {
            $set: decimalRound2(obj.isTax ? tax : 0),
          },
          netAmount: {
            $set: decimalRound2(net_amount),
          },
          receiveDiscountCost: {
            $set: decimalRound2(discount),
          },
        },
      });
    } else if (el === "discountRate") {
      let discount = obj.totalAmount * (value / 100);
      let netAmount = 0;
      let rate = value / 100;
      let discountUnitCost = 0;
      if (rate) {
        discountUnitCost = obj.receiveUnitCost * rate;
      }
      let unitCostDiscounted = obj.receiveUnitCost - discountUnitCost;
      let invCost = unitCostDiscounted;
      let inputTax = (obj.totalAmount - discount) * vatRate;
      if (amount.vatInclusive) {
        inputTax = ((obj.totalAmount - discount) / (vatRate + 1)) * vatRate;
      }

      if (obj.isTax) {
        //netAmount = record.totalAmount + inputTax - record.receiveDiscountCost;
        if (amount.vatInclusive) {
          netAmount = obj.totalAmount - inputTax - discount;
          invCost = unitCostDiscounted / (vatRate + 1);
        } else {
          netAmount = obj.totalAmount + inputTax - discount;
          invCost = unitCostDiscounted * vatRate + unitCostDiscounted;
        }
      } else {
        netAmount = obj.totalAmount - discount;
      }
      data = update(items, {
        [key]: {
          [el]: {
            $set: decimalRound2(value),
          },
          recInventoryCost: {
            $set: decimalRound2(invCost),
          },
          receiveDiscountCost: {
            $set: decimalRound2(discount),
          },
          netAmount: {
            $set: decimalRound2(netAmount),
          },
          inputTax: {
            $set: decimalRound2(obj.isTax ? inputTax : 0),
          },
          isDiscount: {
            $set: value > 0 ? true : false,
          },
        },
      });
    } else if (el === "receiveDiscountCost") {
      let discount = value ?? 0;
      const lprice = obj.totalAmount;
      const sprice = obj.totalAmount - discount;
      let discountRate = ((lprice - sprice) / lprice) * 100;
      let decimalRate = (lprice - sprice) / lprice;
      let netAmount = 0;
      let discountUnitCost = 0;
      if (decimalRate) {
        discountUnitCost = obj.receiveUnitCost * decimalRate;
      }
      let unitCostDiscounted = obj.receiveUnitCost - discountUnitCost;
      let invCost = unitCostDiscounted;
      let inputTax = (obj.totalAmount - discount) * vatRate;
      if (amount.vatInclusive) {
        inputTax = ((obj.totalAmount - discount) / (vatRate + 1)) * vatRate;
      }

      if (obj.isTax) {
        //netAmount = record.totalAmount + inputTax - record.receiveDiscountCost;
        if (amount.vatInclusive) {
          netAmount = obj.totalAmount - inputTax - discount;
          invCost = unitCostDiscounted / (vatRate + 1);
        } else {
          netAmount = obj.totalAmount + inputTax - discount;
          invCost = unitCostDiscounted * vatRate + unitCostDiscounted;
        }
      } else {
        netAmount = obj.totalAmount - discount;
      }
      data = update(items, {
        [key]: {
          receiveDiscountCost: {
            $set: decimalRound2(discount),
          },
          recInventoryCost: {
            $set: decimalRound2(invCost),
          },
          discountRate: {
            $set: decimalRound2(discountRate),
          },
          netAmount: {
            $set: decimalRound2(netAmount),
          },
          inputTax: {
            $set: decimalRound2(obj.isTax ? inputTax : 0),
          },
          isDiscount: {
            $set: discount > 0 ? true : false,
          },
        },
      });
    }
    // ========== set items ===========
    setItems(data);
    // ======= calculate ==========
    recalCulateForexLocal(data);
  };
  const onChangeDate = (
    obj: StockReceivingReportExtended,
    date: Dayjs | null
  ) => {
    let payload = _.clone(items);
    let key = _.findIndex(payload, ["id", obj.id]);
    let data = update(items, {
      [key]: {
        expirationDate: {
          $set: date,
        },
      },
    });
    setItems(data);
  };
  const onChangeBoolean = (
    el: string,
    obj: StockReceivingReportExtended,
    value: boolean
  ) => {
    let payload = _.clone(items);
    let key = _.findIndex(payload, ["id", obj.id]);
    let data = [] as StockReceivingReportExtended[];
    let vatRate = amount.vatRate / 100;

    if (el === "isTax") {
      let inputTax = 0;
      if (amount.vatInclusive) {
        let diffAmount = obj.totalAmount - obj.receiveDiscountCost;
        let sumAmount = diffAmount / (vatRate + 1);
        inputTax = sumAmount * vatRate;
      } else {
        inputTax = (obj.totalAmount - obj.receiveDiscountCost) * vatRate;
      }
      let netAmount = 0;
      let discountUnitCost = 0;
      let decimalRate = obj.discountRate / 100;
      if (decimalRate) {
        discountUnitCost = obj.receiveUnitCost * decimalRate;
      }
      let unitCostDiscounted = obj.receiveUnitCost - discountUnitCost;
      let unitCostVat = unitCostDiscounted;
      if (value) {
        //netAmount = record.totalAmount + inputTax - record.receiveDiscountCost;
        if (amount.vatInclusive) {
          netAmount = obj.totalAmount - inputTax - obj.receiveDiscountCost;
          unitCostVat = unitCostDiscounted / (vatRate + 1);
        } else {
          netAmount = obj.totalAmount + inputTax - obj.receiveDiscountCost;
          unitCostVat = unitCostDiscounted * vatRate + unitCostDiscounted;
        }
      } else {
        netAmount = obj.totalAmount - obj.receiveDiscountCost;
      }

      data = update(items, {
        [key]: {
          recInventoryCost: {
            $set: decimalRound2(value ? unitCostVat : unitCostDiscounted),
          },
          inputTax: {
            $set: decimalRound2(value ? inputTax : 0.0),
          },
          netAmount: {
            $set: decimalRound2(netAmount),
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
    //  ====== set items =====
    setItems(data);
    // ====== calculate if tax =======
    if (el === "isTax") {
      recalCulateForexLocal(data);
    }
  };

  const vatConfigCalculation = (vatInc: boolean, vat: number) => {
    let inputTax = 0;
    let net_amount = 0;
    let unitCost = 0;
    let discountCost = 0;
    let vatRate = vat / 100;
    let calculatedTax = [] as StockReceivingReportExtended[];
    //check first if items are not empty
    if (!_.isEmpty(items)) {
      //if true recalculate Tax
      _.forEach(items, function (obj, key) {
        let discountUnitCost = 0;
        let decimalRate = obj.discountRate / 100;
        if (decimalRate) {
          discountUnitCost = obj.receiveUnitCost * decimalRate;
        }
        discountCost = obj.receiveUnitCost - discountUnitCost;
        unitCost = discountCost;
        if (vatInc) {
          let diffAmount = obj.totalAmount - obj.receiveDiscountCost;
          inputTax = (diffAmount / (vatRate + 1)) * vatRate;
          net_amount = obj.totalAmount - obj.receiveDiscountCost;
          if (obj.isTax) {
            net_amount = obj.totalAmount - inputTax - obj.receiveDiscountCost;
          }
          unitCost = discountCost / (vatRate + 1);
        } else {
          inputTax = (obj.totalAmount - obj.receiveDiscountCost) * vatRate;
          net_amount = obj.totalAmount - obj.receiveDiscountCost;
          if (obj.isTax) {
            net_amount = obj.totalAmount + inputTax - obj.receiveDiscountCost;
          }
          unitCost = discountCost * vatRate + discountCost;
        }
        let data = update(items, {
          [key]: {
            netAmount: {
              $set: decimalRound2(net_amount),
            },
            inputTax: {
              $set: decimalRound2(obj.isTax ? inputTax : 0.0),
            },
            recInventoryCost: {
              $set: decimalRound2(obj.isTax ? unitCost : discountCost),
            },
          },
        });
        calculatedTax.push(data[key]);
      });
      setItems(calculatedTax);
      recalCulateForexLocal(calculatedTax);
    }
  };

  const onChangeVatRate = (value: number) => {
    const { getFieldValue } = form;
    let inc = getFieldValue("vatInclusive") as boolean;
    vatConfigCalculation(inc, value);
  };

  const onChangeVatIn = (value: boolean) => {
    const { getFieldValue } = form;
    let vatRate = Number(getFieldValue("vatRate"));
    vatConfigCalculation(value, vatRate);
  };
  //=================== end: calculations ====================

  // ==================== editable cols ======================
  const colInputNumber = (
    record: StockReceivingReportExtended,
    el: string,
    defaultValue: number
  ) => {
    return (
      <InputNumber
        defaultValue={defaultValue}
        autoFocus
        onBlur={(e) => {
          let newValue = Number(e?.target?.value ?? 0);
          onChangeNumbers(el, record, newValue);
          setEditable({ ...editable, [record.id + el]: false });
        }}
        style={{ width: 150 }}
      />
    );
  };

  const colInputDate = (record: StockReceivingReportExtended) => {
    let date = dayjs(new Date());
    if (record?.expirationDate) {
      date = dayjs(record.expirationDate);
    }
    return (
      <Form
        name="expirationForm"
        autoFocus
        initialValues={{
          expiration: date,
        }}
        onBlur={(e) => {
          let newValue = e?.target?.value ? dayjs(e?.target?.value) : null;
          onChangeDate(record, newValue);
          setEditable({ ...editable, [record.id + "expirationDate"]: false });
        }}>
        <Form.Item name="expiration" style={{ margin: 0 }}>
          <DatePicker placeholder="Expiration" autoFocus />
        </Form.Item>
      </Form>
    );
  };
  // ==================== end: editable cols ================

  // ================== disabled columns and buttons =================
  const disabledForm = useMemo(() => {
    if (record?.isPosted || record?.isVoid) {
      return true;
    }
    return false;
  }, [record]);

  // =================== columns =========================
  const columns: ColumnsType<StockReceivingReportExtended> = [
    {
      title: "Item Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      render: (text, obj) => (
        <span key={text}>
          {obj.item?.descLong}{" "}
          {obj.isNew && (
            <Tag bordered={false} color="green">
              New
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "uou",
      key: "uou",
      width: 120,
      align: "center",
      render: (txt) => {
        return <Tag>{txt}</Tag>;
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Qty (UoU)"
          popup="Unit of Usage"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "receiveQty",
      key: "receiveQty",
      align: "right",
      width: 120,
      onCell: (e) => {
        return {
          onClick: () => {
            if (disabledForm) {
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
        let defaultValue = Number(record?.receiveQty);
        return editable[record.id + "receiveQty"] ? (
          colInputNumber(record, "receiveQty", defaultValue)
        ) : (
          <span key={text}>{NumberFormaterDynamic(record.receiveQty)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit Cost (UoU)"
          popup="Unit of Usage"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "receiveUnitCost",
      key: "receiveUnitCost",
      align: "right",
      width: 160,
      onCell: (e) => {
        return {
          onClick: () => {
            if (disabledForm) {
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
        let defaultValue = Number(record.receiveUnitCost);
        return editable[record.id + "receiveUnitCost"] ? (
          colInputNumber(record, "receiveUnitCost", defaultValue)
        ) : (
          <span key={text}>{NumberFormater(record.receiveUnitCost)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Inventory Cost (UoU)"
          popup="Inventory Uni Cost (Unit of Usage)"
          popupColor="#399b53"
        />
      ),
      dataIndex: "recInventoryCost",
      key: "recInventoryCost",
      align: "right",
      width: 170,
      render: (text, record) => (
        <span key={text}>{NumberFormater(record.recInventoryCost)}</span>
      ),
    },
    {
      title: "Gross Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      width: 140,
      render: (text, record) => (
        <span key={text}>{NumberFormater(record.totalAmount)}</span>
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Discount Rate"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "discountRate",
      key: "discountRate",
      align: "right",
      width: 140,
      onCell: (e) => {
        return {
          onClick: () => {
            if (disabledForm) {
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
        let defaultValue = Number(record.discountRate);
        return editable[record.id + "discountRate"] ? (
          colInputNumber(record, "discountRate", defaultValue)
        ) : (
          <span key={text}>{NumberFormater(record?.discountRate)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Discount Cost"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "receiveDiscountCost",
      key: "receiveDiscountCost",
      align: "right",
      width: 140,
      onCell: (e) => {
        return {
          onClick: () => {
            if (disabledForm) {
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
        let defaultValue = Number(record.receiveDiscountCost);
        return editable[record.id + "receiveDiscountCost"] ? (
          colInputNumber(record, "receiveDiscountCost", defaultValue)
        ) : (
          <span key={text}>{NumberFormater(record?.receiveDiscountCost)}</span>
        );
      },
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      width: 120,
      render: (text, record) => (
        <span key={text}>{NumberFormater(record?.netAmount)}</span>
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Expiration Date"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "expirationDate",
      key: "expirationDate",
      width: 150,
      align: "center",
      onCell: (e) => {
        return {
          onClick: () => {
            if (disabledForm) {
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
          colInputDate(record)
        ) : (
          <span key={text}>
            {record?.expirationDate
              ? dayjs(record.expirationDate).format("YYYY-MM-DD")
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
      width: 120,
      render: (text, record) => (
        <span key={text}>{NumberFormater(record?.inputTax)}</span>
      ),
    },
    {
      title: (
        <ColumnTitle descripton="Tax" editable={true} popupColor="#399b53" />
      ),
      dataIndex: "isTax",
      key: "isTax",
      width: 80,
      align: "center",
      render: (value, record) => {
        return (
          <Checkbox
            key="isTax"
            checked={value ?? false}
            onChange={(e) =>
              onChangeBoolean("isTax", record, e?.target?.checked)
            }
            disabled={disabledForm}
          />
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Free Goods"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "isFg",
      key: "isFg",
      width: 120,
      align: "center",
      render: (text, record) => {
        if (!record?.refPoItem) {
          return (
            <Checkbox
              key="isFg"
              checked={text}
              onChange={(e) =>
                onChangeBoolean("isFg", record, e?.target?.checked)
              }
              disabled={disabledForm}
            />
          );
        }
        return "--";
      },
    },
    {
      title: "Discounted",
      dataIndex: "isDiscount",
      key: "isDiscount",
      width: 100,
      align: "center",
      render: (text) => {
        return (
          <Tag color={text ? "green" : "orange"} bordered={false}>
            {text ? "Yes" : "No"}
          </Tag>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Partial"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "isPartial",
      key: "isPartial",
      width: 100,
      align: "center",
      render: (text, record) => {
        return (
          <Checkbox
            key="isPartial"
            checked={text}
            onChange={(e) =>
              onChangeBoolean("isPartial", record, e?.target?.checked)
            }
            disabled={disabledForm}
          />
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Completed"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "isCompleted",
      key: "isCompleted",
      width: 120,
      align: "center",
      render: (text, record) => {
        return (
          <Checkbox
            key="isCompleted"
            checked={text}
            onChange={(e) =>
              onChangeBoolean("isCompleted", record, e?.target?.checked)
            }
            disabled={disabledForm}
          />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, obj) => (
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => {
            _delete(obj);
          }}
          disabled={disabledForm}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  // ========================== mappings =======================================
  const mapObject = (list: PurchaseOrderItemsMonitoring[]) => {
    let tobeDeleted = _.clone(items);
    let payload = [] as StockReceivingReportExtended[];
    if (!_.isEmpty(list)) {
      payload = list.map((e) => {
        //start calculation
        let input_tax = 0;
        let unitCost = decimalRound2(e?.unitCost / e?.item?.item_conversion);
        let totalAmount = e?.deliveryBalance * unitCost;
        let net_amount = totalAmount;
        let inventoryCost = unitCost;
        if (amount.vatInclusive) {
          if (e?.item?.vatable) {
            let sumAmount = totalAmount / (amount.vatRate / 100 + 1);
            input_tax = sumAmount * (amount.vatRate / 100);
          }
          net_amount = totalAmount - input_tax;
          inventoryCost = unitCost / (amount.vatRate / 100 + 1);
        } else {
          if (e?.item?.vatable) {
            input_tax = totalAmount * (amount.vatRate / 100);
          }
          net_amount = totalAmount + input_tax;
          inventoryCost = unitCost * (amount.vatRate / 100) + unitCost;
        }
        let obj = formatPurchaseOrderReceiving(e);
        obj.totalAmount = decimalRound2(totalAmount);
        obj.inputTax = decimalRound2(input_tax);
        obj.netAmount = decimalRound2(net_amount);
        obj.recInventoryCost = decimalRound2(inventoryCost);
        return obj;
      });
    }
    if (!_.isEmpty(tobeDeleted)) {
      // checks if items is already saved
      let checks = _.filter(tobeDeleted, (obj) => !obj?.isNew);
      if (!_.isEmpty(checks)) {
        setForRemove(checks);
      }
    }
    return payload;
  };
  // ================= useMemo / useEffects ========================

  const minMaxRows = useMemo(() => {
    if (
      category === "PERSONAL" ||
      category === "FIXED_ASSET" ||
      category === "CONSIGNMENT" ||
      !category
    ) {
      return 6;
    } else {
      return 4;
    }
  }, [category]);

  const renderExpandableRow = (record: StockReceivingReportExtended) => {
    let list = [] as PurchaseOrderItems[];
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
              <span>{NumberFormaterDynamic(qtyInSmall)}</span>
            ),
          },
          {
            title: "PO Unit Cost (UoU)",
            key: "unitCost",
            dataIndex: "unitCost",
            render: (unitCost) => <span>{NumberFormater(unitCost)}</span>,
          },
          {
            title: "Delivered (UoU)",
            key: "deliveredQty",
            dataIndex: "deliveredQty",
            render: (deliveredQty) => (
              <span>{NumberFormaterDynamic(deliveredQty)}</span>
            ),
          },
          {
            title: "Balance (UoU)",
            key: "deliveryBalance",
            dataIndex: "deliveryBalance",
            render: (deliveryBalance) => (
              <span>{NumberFormaterDynamic(deliveryBalance)}</span>
            ),
          },
        ]}
      />
    );
  };

  // ================= UI ========================
  return (
    <FullScreenModal
      hide={() => hide(false)}
      allowFullScreen={true}
      icon={<ScanOutlined />}
      title="Delivery Receiving Details"
      extraTitle={record?.rrNo}
      footer={
        <div className="w-full">
          <Button
            block
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={upsertLoading}
            icon={<SaveOutlined />}
            disabled={disabledForm || _.isEmpty(items) || upsertLoading}>
            {`Save ${record?.id ? "Changes" : ""} & Close`}
          </Button>
        </div>
      }>
      <CustomCSS>
        <div className="header-container">
          <Alert
            showIcon
            type="warning"
            message="Purchase Order No must appear on all related correspondence, shipping papers and invoices."
          />
        </div>
        <Form
          form={form}
          name="upsertForm"
          layout="vertical"
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          disabled={disabledForm}
          initialValues={{
            ...record,
            receiveDate: dayjs(record?.receiveDate ?? new Date()),
            receivedRefDate: dayjs(record?.receivedRefDate ?? new Date()),
            supplier: selectInValueInit(record?.id, "supplier"),
            project: record?.project?.id ?? null,
            assets: record?.assets?.id ?? null,
            category: record?.category ?? rrCategory,
            paymentTerms: record?.paymentTerms?.id ?? null,
            purchaseOrder: record?.purchaseOrder?.id ?? null,
            receivedOffice: record?.receivedOffice?.id ?? null,
            account: record?.account?.id ?? null,
            amount: record?.amount ?? 0,
            vatInclusive: record?.vatInclusive ?? true,
            vatRate: record?.vatRate ?? 12,
            inputTax: record?.inputTax ?? 0,
            netAmount: record?.netAmount ?? 0,
            fixDiscount: record?.fixDiscount ?? 0,
            grossAmount: record?.grossAmount ?? 0,
            totalDiscount: record?.totalDiscount ?? 0,
            netDiscount: record?.netDiscount ?? 0,
          }}>
          <Row gutter={[16, 0]}>
            <Col {...responsiveColumn4}>
              <FormDatePicker
                label="Delivery Date"
                name="receiveDate"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                }}
              />
              <FormDatePicker
                label="Reference SI/DR Date"
                name="receivedRefDate"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                  placeholder: "Reference SI/DR Date",
                }}
              />
              <FormInput
                name="receivedRefNo"
                label="Reference SI/DR Number"
                rules={requiredField}
                propsinput={{
                  placeholder: "Reference SI/DR Number",
                }}
              />
              <FormSelect
                name="purchaseOrder"
                label="Select PO Number"
                rules={requiredField}
                propsselect={{
                  options: poList,
                  allowClear: true,
                  showSearch: true,
                  placeholder: "Select PO Number",
                  onChange: (e) => {
                    getPOItems(e);
                  },
                }}
              />
            </Col>
            <Col {...responsiveColumn4}>
              <FormDebounceSelect
                name="supplier"
                label="Filter Supplier"
                defaultSearchLabel={record?.supplier?.supplierFullname ?? ""}
                rules={requiredField}
                propsselect={{
                  allowClear: true,
                  placeholder: "Select Supplier",
                  fetchOptions: GET_SUPPLIER_OPTIONS,
                }}
              />
              <FormSelect
                name="receivedOffice"
                label="Receiving Office"
                rules={requiredField}
                propsselect={{
                  options: offices,
                  allowClear: true,
                  placeholder: "Receiving Office",
                }}
              />
              <FormSelect
                name="paymentTerms"
                label="Terms of Payment"
                rules={requiredField}
                propsselect={{
                  options: paymentTerms,
                  allowClear: true,
                  placeholder: "Terms of Payment",
                }}
              />
              <FormSelect
                name="account"
                label="Transaction Type"
                rules={requiredField}
                propsselect={{
                  options: transactionList,
                  allowClear: true,
                  placeholder: "Transaction Type",
                }}
              />
            </Col>
            <Col {...responsiveColumn4}>
              <FormSelect
                name="category"
                label="Receiving Category"
                rules={requiredField}
                propsselect={{
                  options: PURCHASE_CATEGORY,
                  allowClear: true,
                  onChange: (e) => {
                    setCategory(e);
                  },
                  placeholder: "Receiving Category",
                }}
              />
              {category === "PROJECTS" && (
                <FormSelect
                  name="project"
                  label="Project"
                  rules={requiredField}
                  propsselect={{
                    options: projects,
                    allowClear: true,
                    placeholder: "Select Project",
                  }}
                />
              )}
              {category === "SPARE_PARTS" && (
                <FormSelect
                  name="assets"
                  label="Equipments (Assets)"
                  rules={requiredField}
                  propsselect={{
                    options: assets,
                    allowClear: true,
                    placeholder: "Select Equipments (Assets)",
                  }}
                />
              )}
              <FormTextArea
                name="receivedRemarks"
                label="Remarks/Notes"
                propstextarea={{
                  autoSize: {
                    minRows: minMaxRows,
                    maxRows: minMaxRows,
                  },
                  placeholder: "Remarks / Notes",
                }}
              />
            </Col>
            <Col {...responsiveColumn4}>
              <Row gutter={[8, 0]}>
                <Col {...responsiveColumn2}>
                  <FormInputNumber
                    name="grossAmount"
                    label="Gross Amount"
                    propsinputnumber={{
                      ...parserInputNumber,
                      readOnly: true,
                      placeholder: "Gross Amount",
                    }}
                  />
                </Col>
                <Col {...responsiveColumn2}>
                  <FormInputNumber
                    name="inputTax"
                    label="Input Tax"
                    propsinputnumber={{
                      ...parserInputNumber,
                      readOnly: true,
                      placeholder: "Input Tax",
                    }}
                  />
                </Col>
                <Col {...responsiveColumn2}>
                  <FormInputNumber
                    name="totalDiscount"
                    label="Total Discount"
                    propsinputnumber={{
                      ...parserInputNumber,
                      readOnly: true,
                      placeholder: "Total Discount",
                    }}
                  />
                </Col>
                <Col {...responsiveColumn2}>
                  <FormInputNumber
                    name="netAmount"
                    label="Net of Vat"
                    propsinputnumber={{
                      ...parserInputNumber,
                      readOnly: true,
                      placeholder: "Net of Vat",
                    }}
                  />
                </Col>
                <Col {...responsiveColumn2}>
                  <FormInputNumber
                    name="netDiscount"
                    label="Net of Discount"
                    propsinputnumber={{
                      ...parserInputNumber,
                      readOnly: true,
                      placeholder: "Net of Discount",
                    }}
                  />
                </Col>
                <Col {...responsiveColumn2}>
                  <FormInputNumber
                    name="amount"
                    label="Total Amount"
                    propsinputnumber={{
                      ...parserInputNumber,
                      readOnly: true,
                      placeholder: "Total Amount",
                    }}
                  />
                </Col>
                <Col {...responsiveColumn2}>
                  <FormInputNumber
                    name="vatRate"
                    label="VAT Rate (%)"
                    rules={requiredField}
                    propsinputnumber={{
                      max: 100,
                      placeholder: "VAT Rate (%)",
                      onChange: (e) => {
                        let value = Number(e);
                        onChangeVatRate(value);
                      },
                    }}
                  />
                </Col>
                <Col {...responsiveColumn2}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <FormCheckBox
                      name="vatInclusive"
                      valuePropName="checked"
                      checkBoxLabel="Vat Inclusive ?"
                      propscheckbox={{
                        defaultChecked: true,
                        onChange: (e) => {
                          let checked = e.target.checked;
                          onChangeVatIn(checked);
                        },
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <Divider plain>Transaction Details</Divider>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "items",
              label: "Stock Receiving Items",
              children: (
                <Card
                  bordered={false}
                  style={{ boxShadow: "none" }}
                  styles={{
                    header: { border: 0 },
                    body: { padding: 0 },
                  }}
                  title={<></>}
                  extra={
                    <Button
                      className="btn-order"
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      disabled={disabledForm}
                      onClick={onOrderItems}>
                      Received Items
                    </Button>
                  }>
                  <Table
                    rowKey="id"
                    expandable={{
                      expandedRowRender: renderExpandableRow,
                    }}
                    columns={columns}
                    dataSource={items}
                    size="small"
                    loading={loading || removeLoading || poItemsLoading}
                    scroll={{ x: 2550 }}
                    pagination={false}
                    summary={() => <ReceivingItemSummary dataSource={items} />}
                  />
                </Card>
              ),
            },
            {
              key: "uploads",
              label: "Uploaded Documents",
              children: (
                <DocumentUpload
                  allowUpload={!_.isEmpty(record?.id) && !disabledForm}
                  uploadProps={uploadProps}
                  loading={loadingAttachments}
                  uploading={uploading}
                  attachments={attachments}
                  fetchAttachments={fetchAttachments}
                />
              ),
            },
          ]}
        />
      </CustomCSS>
    </FullScreenModal>
  );
}

const CustomCSS = styled.div`
  thead > tr > td.ant-table-cell.ant-table-row-expand-icon-cell,
  th.ant-table-cell {
    background: #fff !important;
    color: #399b53 !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }

  .ant-card .ant-card-head {
    padding: 0px !important;
    min-height: 36px !important;
  }

  .ant-divider-horizontal.ant-divider-with-text {
    margin: 8px 0 !important;
  }

  .header-container {
    margin-bottom: 5px;
  }

  .pr-selector {
    width: 99% !important;
  }

  @media (max-width: 991px) {
    .ant-card-head-title {
      width: 100% !important;
    }

    .pr-selector {
      width: 100% !important;
    }

    .ant-card .ant-card-head-wrapper {
      flex-direction: column !important;
    }
  }
`;
