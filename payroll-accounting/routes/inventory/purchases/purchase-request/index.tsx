import React, { useMemo, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { PurchaseRequest, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_PURCHASE_REQUEST } from "@/graphql/inventory/purchases-queries";
import UpsertItemModal from "@/components/inventory/masterfile/items/dialogs/upsertItem";
import PurchaseRequestTable from "@/components/inventory/purchases/purchase-request/purchaseRequestTable";
import { FormSelect } from "@/components/common";
import UpsertAssignItemLocationModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertAssignItem";
import UpsertAssignSupplierItemModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertSupplierItem";
import { useOffices, useProjects } from "@/hooks/payables";
import { PR_STATUS, PURCHASE_CATEGORY } from "@/utility/constant";

const { Search } = Input;

export default function PurchaseRequestComponent({ type }: { type: string }) {
  const modal = useDialog(UpsertItemModal);
  const assignItemModal = useDialog(UpsertAssignItemLocationModal);
  const assignSupplierItemModal = useDialog(UpsertAssignSupplierItemModal);
  const [category, setCategory] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [asset, setAsset] = useState<string | null>(null);
  const [office, setOffice] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    status: null,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const offices = useOffices();
  const projects = useProjects({ office: null });
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_PURCHASE_REQUEST,
    {
      variables: {
        filter: state.filter,
        office: office,
        category: category,
        status: state.status,
        project: project,
        asset: asset,
        page: state.page,
        size: state.size,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: PurchaseRequest) => {
    modal({ record: record }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const handleUpdateStatus = (record: PurchaseRequest, status: boolean) => {
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
    let title = "All Purchase Request";
    switch (type) {
      case "projects":
        title = "Projects Purchase Request";
        setCategory("PROJECTS");
        break;
      case "spare-parts":
        title = "Spare Parts Purchase Request";
        setCategory("SPARE_PARTS");
        break;
      case "personal":
        title = "Personal Purchase Request";
        setCategory("PERSONAL");
        break;
      case "fixed-assets":
        title = "Fixed Assets Purchase Request";
        setCategory("FIXED_ASSET");
        break;
      case "consignment":
        title = "Consignment Purchase Request";
        setCategory("CONSIGNMENT");
        break;
      default:
        title = "All Purchase Request";
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
      title="Purchase Request"
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
                        label="Filter Purchase Request Category"
                        propsselect={{
                          showSearch: true,
                          value: category,
                          options: PURCHASE_CATEGORY,
                          allowClear: true,
                          placeholder: "Select Purchase Request Category",
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
                    <FormSelect
                      label="Filter Purchase Request Status"
                      propsselect={{
                        showSearch: true,
                        value: state.status,
                        options: PR_STATUS,
                        allowClear: true,
                        placeholder: "Select Purchase Request Status",
                        onChange: (newValue) => {
                          setState((prev) => ({ ...prev, status: newValue }));
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
                    <FormSelect
                      label="Filter Purchase Request Status"
                      propsselect={{
                        showSearch: true,
                        value: state.status,
                        options: PR_STATUS,
                        allowClear: true,
                        placeholder: "Select Purchase Request Status",
                        onChange: (newValue) => {
                          setState((prev) => ({ ...prev, status: newValue }));
                        },
                      }}
                    />
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </div>
        <PurchaseRequestTable
          dataSource={data?.prByFiltersPageNoDate?.content as PurchaseRequest[]}
          loading={loading}
          totalElements={data?.prByFiltersPageNoDate?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleUpdateStatus={(record, e) => handleUpdateStatus(record, e)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
