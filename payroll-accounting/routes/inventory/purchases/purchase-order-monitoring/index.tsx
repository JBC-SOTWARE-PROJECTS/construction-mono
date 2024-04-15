import React, { useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Input, Row, Col, Form } from "antd";
import _ from "lodash";
import FormSelect from "@/components/common/formSelect/formSelect";
import { responsiveColumn2 } from "@/utility/constant";
import { FormDebounceSelect } from "@/components/common";
import { OptionsValue } from "@/utility/interfaces";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import POMonitoringTable from "@/components/inventory/purchases/purchase-order-monitoring/monitoringTable";
import { GET_RECORDS_PO_MONITORING } from "@/graphql/inventory/purchases-queries";
import { useQuery } from "@apollo/client";
import { PurchaseOrderItemsMonitoring, Query } from "@/graphql/gql/graphql";
import { usePurcaseOrderList } from "@/hooks/inventory";
import POMonitoringModal from "@/components/inventory/purchases/purchase-order-monitoring/poMonitoringModal";
import { useDialog } from "@/hooks";

const { Search } = Input;

export default function PurchaseOrderMonitoringComponent() {
  const [supplier, setSupplier] = useState<OptionsValue>();
  const [poId, setPoId] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });
  // =============== modal ================
  const modal = useDialog(POMonitoringModal);
  // ================ queries ===================
  const poList = usePurcaseOrderList();
  const { data, loading } = useQuery<Query>(GET_RECORDS_PO_MONITORING, {
    variables: {
      filter: state.filter,
      poId: poId,
      supplier: supplier?.value,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onViewModal = (record?: PurchaseOrderItemsMonitoring) => {
    modal({ record: record }, () => {});
  };

  return (
    <PageContainer
      title="Purchase Order Delivery Monitoring"
      content="Monitor Purchase Orders Delivery">
      <div className="w-full mb-5">
        <Form layout="vertical" className="filter-form">
          <Row gutter={[16, 0]}>
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
            <Col {...responsiveColumn2}>
              <FormSelect
                label="Filter By Purchase Order Number"
                propsselect={{
                  showSearch: true,
                  value: poId,
                  options: poList,
                  allowClear: true,
                  placeholder: "Filter By Purchase Order Number",
                  onChange: (newValue) => {
                    setPoId(newValue);
                  },
                }}
              />
            </Col>
            <Col {...responsiveColumn2}>
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
      <div className="w-full">
        <POMonitoringTable
          dataSource={
            data?.poItemMonitoringPage
              ?.content as PurchaseOrderItemsMonitoring[]
          }
          loading={loading}
          totalElements={data?.poItemMonitoringPage?.totalElements as number}
          handleOpen={(e) => onViewModal(e)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </div>
    </PageContainer>
  );
}
