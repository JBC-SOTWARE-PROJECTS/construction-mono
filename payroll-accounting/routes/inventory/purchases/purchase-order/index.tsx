import React, { useMemo, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, Row, Col, Form, App } from "antd";
import {
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { PurchaseOrder, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_RECORDS_PURCHASE_ORDER,
  UPSERT_RECORD_PO_STATUS,
} from "@/graphql/inventory/purchases-queries";
import UpsertPOFormModal from "@/components/inventory/purchases/purchase-order/dialogs/upserPOFormModal";
import PurchaseOrderTable from "@/components/inventory/purchases/purchase-order/purchaseOrderTable";
import { FormDebounceSelect, FormSelect } from "@/components/common";
import { useOffices, useProjects } from "@/hooks/payables";
import { PURCHASE_CATEGORY } from "@/utility/constant";
import { OptionsValue } from "@/utility/interfaces";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { useAssets } from "@/hooks/inventory";
import _ from "lodash";

const { Search } = Input;

export default function PurchaseOrderComponent({ type }: { type: string }) {
  const { modal: parentModal, message } = App.useApp();
  const modal = useDialog(UpsertPOFormModal);
  const { confirm } = parentModal;
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
  // ====================== queries =====================================
  const offices = useOffices();
  const projects = useProjects({ office: null });
  const assets = useAssets();

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_PURCHASE_ORDER,
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

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PO_STATUS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.updatePOStatus?.id)) {
          message.success("Purchase Order Information Updated");
          refetch();
        }
      },
    }
  );

  const onUpsertRecord = (record?: PurchaseOrder) => {
    modal({ record: record, poCategory: category }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const handleUpdateStatus = (record: PurchaseOrder, status: boolean) => {
    if (status) {
      //if clicked approved
      if (record?.isApprove) {
        message.error("Purchase Request is already approved");
      } else {
        _approve(record?.id, status, "approve");
      }
    } else {
      //void
      if (!record?.isApprove) {
        if (record.isVoided) {
          message.error("Purchase Request is already voided");
        } else {
          message.error("Purchase Request is not yet approved");
        }
      } else {
        _approve(record?.id, status, "void");
      }
    }
  };

  const _approve = (id: string, status: boolean, message: string) => {
    confirm({
      title: `Do you want ${message} this Purchase Order?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        upsertRecord({
          variables: {
            status: status,
            id: id,
          },
        });
      },
    });
  };

  const title = useMemo(() => {
    let title = "All Purchase Order";
    switch (type) {
      case "projects":
        title = "Projects Purchase Order";
        setCategory("PROJECTS");
        break;
      case "spare-parts":
        title = "Spare Parts Purchase Order";
        setCategory("SPARE_PARTS");
        break;
      case "personal":
        title = "Personal Purchase Order";
        setCategory("PERSONAL");
        break;
      case "fixed-assets":
        title = "Fixed Assets Purchase Order";
        setCategory("FIXED_ASSET");
        break;
      case "consignment":
        title = "Consignment Purchase Order";
        setCategory("CONSIGNMENT");
        break;
      default:
        title = "All Purchase Order";
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
      title="Purchase Order"
      content="From Request to Receipt: Enhancing Inventory Control with Purchase Requests and Orders.">
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
                        label="Filter Purchase Order Category"
                        propsselect={{
                          showSearch: true,
                          value: category,
                          options: PURCHASE_CATEGORY,
                          allowClear: true,
                          placeholder: "Select Purchase Order Category",
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
                          options: projects,
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
                          options: assets,
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
        <PurchaseOrderTable
          dataSource={data?.poByFiltersPageNoDate?.content as PurchaseOrder[]}
          loading={loading || upsertLoading}
          totalElements={data?.poByFiltersPageNoDate?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleUpdateStatus={(record, e) => handleUpdateStatus(record, e)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
