import React, { useMemo, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ReturnSupplier, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_RETURNS } from "@/graphql/inventory/deliveries-queries";
import UpsertReturnFormModal from "@/components/inventory/deliveries/returns/dialogs/upsertReturnFormModal";
import ReturnSupplierTable from "@/components/inventory/deliveries/returns/returnsTable";
import { FormDebounceSelect, FormSelect } from "@/components/common";
import { useOffices } from "@/hooks/payables";
import { OptionsValue } from "@/utility/interfaces";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import PostReturnSupplierModal from "@/components/inventory/post-dialogs/postReturnSupplier";

const { Search } = Input;

export default function ReturnsComponent() {
  const modal = useDialog(UpsertReturnFormModal);
  const postInventory = useDialog(PostReturnSupplierModal);
  const [supplier, setSupplier] = useState<OptionsValue>();
  const [office, setOffice] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const offices = useOffices();
  const { data, loading, refetch } = useQuery<Query>(GET_RECORDS_RETURNS, {
    variables: {
      filter: state.filter,
      office: office,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: ReturnSupplier) => {
    modal({ record: record }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const onPostOrVoidView = (
    record: ReturnSupplier,
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

  const handleUpdateStatus = (record: ReturnSupplier, status: boolean) => {
    if (status) {
      //if clicked approved
      if (record?.isPosted) {
        message.error("Return Transaction is already posted");
      } else {
        onPostOrVoidView(record, status, false);
      }
    } else {
      //void
      if (!record?.isPosted) {
        if (record.isVoid) {
          message.error("Return Transaction is already voided");
        } else {
          message.error("Return Transaction is not yet posted");
        }
      } else {
        onPostOrVoidView(record, status, false);
      }
    }
  };

  return (
    <PageContainer
      title="Return to Supplier"
      content="Navigating the Inventory Lifecycle: Streamlining Delivery Receiving and Returns for Maximum Efficiency.">
      <ProCard
        title="All Returns"
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
            </Row>
          </Form>
        </div>
        <ReturnSupplierTable
          dataSource={data?.rtsByFiltersPage?.content as ReturnSupplier[]}
          loading={loading}
          totalElements={data?.rtsByFiltersPage?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleUpdateStatus={(record, e) => handleUpdateStatus(record, e)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
