import React, { useMemo, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ReceivingReport, Query, PurchaseOrder } from "@/graphql/gql/graphql";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  DRAFT_APV,
  GET_PO_RECORD_BY_PO_NO,
  GET_RECORDS_DELIVERY_RECEIVING,
  REDO_SRR_TRANSACTION,
} from "@/graphql/inventory/deliveries-queries";
import UpsertItemModal from "@/components/inventory/masterfile/items/dialogs/upsertItem";
import DeliveryReceivingTable from "@/components/inventory/deliveries/receiving/receivingTable";
import { FormDebounceSelect, FormSelect } from "@/components/common";
import { useOffices } from "@/hooks/payables";
import { PURCHASE_CATEGORY } from "@/utility/constant";
import { OptionsValue } from "@/utility/interfaces";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import UpsertReceivingModal from "@/components/inventory/deliveries/receiving/dialogs/upsertReceivingModal";
import PostReceivingReportModal from "@/components/inventory/post-dialogs/postReceivingReport";
import _ from "lodash";
import UpsertPOFormModal from "@/components/inventory/purchases/purchase-order/dialogs/upserPOFormModal";

const { Search } = Input;

export default function ReceivingComponent({ type }: { type: string }) {
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [supplier, setSupplier] = useState<OptionsValue>();
  const [category, setCategory] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [asset, setAsset] = useState<string | null>(null);
  const [office, setOffice] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });
  //  ===================== modals ===================================
  const modal = useDialog(UpsertReceivingModal);
  const poModal = useDialog(UpsertPOFormModal);
  const postInventory = useDialog(PostReceivingReportModal);
  // ====================== queries =====================================
  const offices = useOffices();
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_DELIVERY_RECEIVING,
    {
      variables: {
        filter: state.filter,
        office: office,
        category: category,
        project: project,
        asset: asset,
        supplier: supplier?.value,
        page: state.page,
        size: state.size,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const [redo, { loading: redoLoading }] = useMutation(REDO_SRR_TRANSACTION, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (!_.isEmpty(data?.redoReceiving?.id)) {
        message.success("Delivery Receiving can now be reprocessed");
        refetch();
      }
    },
  });

  const [draftAccountsPayable, { loading: draftLoading }] = useMutation(
    DRAFT_APV,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertPayablesByRec?.id)) {
          message.success(
            "Delivery Receipt drafted to Accounts Payable Voucher (APV)"
          );
          refetch();
        }
      },
    }
  );

  const onUpsertRecord = (record?: ReceivingReport) => {
    modal({ record: record, rrCategory: category }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const [getPODetails, { loading: poLoading }] = useLazyQuery<Query>(
    GET_PO_RECORD_BY_PO_NO,
    {
      onCompleted: (data) => {
        if (!_.isEmpty(data?.poByPoNo?.id)) {
          let parent = data?.poByPoNo as PurchaseOrder;
          let category = parent?.category ?? "";
          showPOModal(parent, category);
        }
      },
    }
  );

  const showPOModal = (record: PurchaseOrder, category: string) => {
    poModal({ record: record, poCategory: category }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const onPostOrVoidView = (
    record: ReceivingReport,
    status: boolean,
    viewOnly: boolean
  ) => {
    postInventory(
      { record: record, status: status, viewOnly: viewOnly },
      (result: string) => {
        if (result) {
          message.success(result);
          refetch();
        }
      }
    );
  };

  const onViewPostedAccount = (record: ReceivingReport) => {
    onPostOrVoidView(record, true, true);
  };

  const onHandleDraftAPV = (record: ReceivingReport) => {
    showPasswordConfirmation(() => {
      draftAccountsPayable({
        variables: {
          id: record.id,
        },
      });
    });
  };

  const onRedoTransaction = (record: ReceivingReport) => {
    showPasswordConfirmation(() => {
      redo({
        variables: {
          id: record.id,
        },
      });
    });
  };

  const onViewPOMoal = (poNumber: string) => {
    getPODetails({
      variables: {
        poNumber: poNumber,
      },
    });
  };

  const handleUpdateStatus = (record: ReceivingReport, status: boolean) => {
    if (status) {
      //if clicked approved
      if (record?.isPosted) {
        message.error("Delivery Receiving is already posted");
      } else {
        onPostOrVoidView(record, status, false);
      }
    } else {
      //void
      if (!record?.isPosted) {
        if (record.isVoid) {
          message.error("Delivery Receiving is already voided");
        } else {
          message.error("Delivery Receiving is not yet posted");
        }
      } else {
        onPostOrVoidView(record, status, false);
      }
    }
  };

  const title = useMemo(() => {
    let title = "All Delivery Receiving";
    switch (type) {
      case "projects":
        title = "Projects Delivery Receiving";
        setCategory("PROJECTS");
        break;
      case "spare-parts":
        title = "Spare Parts Delivery Receiving";
        setCategory("SPARE_PARTS");
        break;
      case "personal":
        title = "Personal Delivery Receiving";
        setCategory("PERSONAL");
        break;
      case "fixed-assets":
        title = "Fixed Assets Delivery Receiving";
        setCategory("FIXED_ASSET");
        break;
      case "consignment":
        title = "Consignment Delivery Receiving";
        setCategory("CONSIGNMENT");
        break;
      default:
        title = "All Delivery Receiving";
        setCategory(null);
        break;
    }
    return title;
  }, [type]);

  const typeFilters = useMemo(() => {
    let result = false;
    switch (type) {
      case "projects":
        result = true;
        break;
      case "spare-parts":
        result = true;
        break;
      case "all":
        result = true;
        break;
      default:
        result = false;
        break;
    }
    return result;
  }, [type]);

  return (
    <PageContainer
      title="Delivery Receiving"
      content="Navigating the Inventory Lifecycle: Streamlining Delivery Receiving and Returns for Maximum Efficiency.">
      <ProCard
        title={`${title} List`}
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Search
                  size="middle"
                  placeholder="Search here.."
                  onSearch={(e) =>
                    setState((prev) => ({ ...prev, filter: e, page: 0 }))
                  }
                  className="w-full"
                />
              </Col>
              {typeFilters ? (
                <>
                  <Col xs={24} md={12} lg={8}>
                    <FormSelect
                      label="Filter Office"
                      propsselect={{
                        showSearch: true,
                        value: office,
                        options: offices,
                        allowClear: true,
                        placeholder: "Select Office",
                        onChange: (newValue) => {
                          setOffice(newValue);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    {type === "all" && (
                      <FormSelect
                        label="Filter Receiving Category"
                        propsselect={{
                          showSearch: true,
                          value: category,
                          options: PURCHASE_CATEGORY,
                          allowClear: true,
                          placeholder: "Select Receiving Category",
                          onChange: (newValue) => {
                            setCategory(newValue);
                          },
                        }}
                      />
                    )}
                    {type === "projects" && (
                      <FormSelect
                        label="Filter Projects"
                        propsselect={{
                          showSearch: true,
                          value: project,
                          options: [],
                          allowClear: true,
                          placeholder: "Select Projects",
                          onChange: (newValue) => {
                            setProject(newValue);
                          },
                        }}
                      />
                    )}
                    {type === "spare-parts" && (
                      <FormSelect
                        label="Filter Asset"
                        propsselect={{
                          showSearch: true,
                          value: asset,
                          options: [],
                          allowClear: true,
                          placeholder: "Select Asset",
                          onChange: (newValue) => {
                            setAsset(newValue);
                          },
                        }}
                      />
                    )}
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <FormDebounceSelect
                      label="Filter Supplier"
                      propsselect={{
                        value: supplier,
                        allowClear: true,
                        placeholder: "Select Supplier",
                        fetchOptions: GET_SUPPLIER_OPTIONS,
                        onChange: (newValue) => {
                          setSupplier(newValue as OptionsValue);
                        },
                      }}
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={24} md={12}>
                    <FormSelect
                      label="Filter Office"
                      propsselect={{
                        showSearch: true,
                        value: office,
                        options: offices,
                        allowClear: true,
                        placeholder: "Select Office",
                        onChange: (newValue) => {
                          setOffice(newValue);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <FormDebounceSelect
                      label="Filter Supplier"
                      propsselect={{
                        value: supplier,
                        allowClear: true,
                        placeholder: "Select Supplier",
                        fetchOptions: GET_SUPPLIER_OPTIONS,
                        onChange: (newValue) => {
                          setSupplier(newValue as OptionsValue);
                        },
                      }}
                    />
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </div>
        <DeliveryReceivingTable
          dataSource={
            data?.recByFiltersPageNoDate?.content as ReceivingReport[]
          }
          loading={loading || redoLoading || draftLoading || poLoading}
          totalElements={data?.recByFiltersPageNoDate?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleUpdateStatus={(record, e) => handleUpdateStatus(record, e)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
          onViewAccount={(record) => onViewPostedAccount(record)}
          onHandleDraftAPV={(record) => onHandleDraftAPV(record)}
          onRedoTransaction={(record) => onRedoTransaction(record)}
          viewPOModal={(poNumber) => onViewPOMoal(poNumber)}
        />
      </ProCard>
    </PageContainer>
  );
}
