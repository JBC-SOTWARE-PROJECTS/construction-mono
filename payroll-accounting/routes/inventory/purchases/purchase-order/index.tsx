import React, { useMemo, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { PurchaseOrder, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_PURCHASE_ORDER } from "@/graphql/inventory/purchases-queries";
import UpsertItemModal from "@/components/inventory/masterfile/items/dialogs/upsertItem";
import PurchaseOrderTable from "@/components/inventory/purchases/purchase-order/purchaseOrderTable";
import { FormDebounceSelect, FormSelect } from "@/components/common";
import { useOffices } from "@/hooks/payables";
import { PURCHASE_CATEGORY } from "@/utility/constant";
import { OptionsValue } from "@/utility/interfaces";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";

const { Search } = Input;

export default function PurchaseOrderComponent({ type }: { type: string }) {
  const modal = useDialog(UpsertItemModal);
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

  const onUpsertRecord = (record?: PurchaseOrder) => {
    modal({ record: record }, (msg: string) => {
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
      }
    } else {
      //void
      if (!record?.isApprove) {
        message.error("Purchase Request is already not yet approved");
      } else {
      }
    }
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
                  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
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
        <PurchaseOrderTable
          dataSource={data?.poByFiltersPageNoDate?.content as PurchaseOrder[]}
          loading={loading}
          totalElements={data?.poByFiltersPageNoDate?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleUpdateStatus={(record, e) => handleUpdateStatus(record, e)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
