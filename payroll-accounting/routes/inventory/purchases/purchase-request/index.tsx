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
import { GET_ITEM_RECORDS } from "@/graphql/inventory/masterfile-queries";
import UpsertItemModal from "@/components/inventory/masterfile/items/dialogs/upsertItem";
import PurchaseRequestTable from "@/components/inventory/purchases/purchase-request/purchaseRequestTable";
import { FormSelect } from "@/components/common";
import UpsertAssignItemLocationModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertAssignItem";
import UpsertAssignSupplierItemModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertSupplierItem";
import { useOffices } from "@/hooks/payables";
import { PR_STATUS, PURCHASE_CATEGORY } from "@/utility/constant";

const { Search } = Input;

export default function PurchaseRequestComponent({ type }: { type: string }) {
  const modal = useDialog(UpsertItemModal);
  const assignItemModal = useDialog(UpsertAssignItemLocationModal);
  const assignSupplierItemModal = useDialog(UpsertAssignSupplierItemModal);
  const [category, setCategory] = useState<string | null>(null);
  const [office, setOffice] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    status: true,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const offices = useOffices();
  const { data, loading, refetch } = useQuery<Query>(GET_ITEM_RECORDS, {
    variables: {
      filter: state.filter,
      groupId: office,
      category: category,
      type: type,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: PurchaseRequest) => {
    modal({ record: record }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const onAssignRecord = (record?: PurchaseRequest) => {
    assignItemModal({ record: record });
  };

  const onAssignSupplierRecord = (record?: PurchaseRequest) => {
    assignSupplierItemModal({ record: record });
  };

  const title = useMemo(() => {
    let title = "All Purchase Request";
    switch (type) {
      case "projects":
        title = "Projects Purchase Request";
        break;
      case "spare-parts":
        title = "Spare Parts Purchase Request";
        break;
      case "personal":
        title = "Personal Purchase Request";
        break;
      case "fixed-assets":
        title = "Fixed Assets Purchase Request";
        break;
      case "consignment":
        title = "Consignment Purchase Request";
        break;
      default:
        title = "All Purchase Request";
        break;
    }
    return title;
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
                  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                  className="w-full"
                />
              </Col>
              {type === "projects" || type === "spare-parts" ? null : (
                <>
                  <Col xs={24} sm={12} md={8}>
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
                  <Col xs={24} sm={12} md={8}>
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
                  </Col>
                  <Col xs={24} sm={12} md={8}>
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
          dataSource={[]}
          loading={loading}
          totalElements={data?.itemByFiltersPage?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleAssign={(record) => onAssignRecord(record)}
          handleSupplier={(record) => onAssignSupplierRecord(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
