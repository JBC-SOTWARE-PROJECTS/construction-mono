import React, { useContext, useState } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Input, Row, Col, Form, App } from "antd";
import { useQuery } from "@apollo/client";
import { BeginningBalanceDto, Query } from "@/graphql/gql/graphql";
import { GET_BEGINNING_BY_LOCATION } from "@/graphql/inventory/inventory-queries";
import _ from "lodash";
import { FormSelect } from "@/components/common";
import {
  useItemBrands,
  useItemCategory,
  useItemGroups,
} from "@/hooks/inventory";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { useDialog } from "@/hooks";
import QuantityAdjustmentModal from "../../../components/inventory/adjustments/quantityAdjustmentModal";
import { useOffices } from "@/hooks/payables";
import BeginningBalanceTable from "@/components/inventory/beginning-balance/beginningBalanceTable";

const { Search } = Input;

export default function BeginningBalancesContent() {
  const { message } = App.useApp();
  const modal = useDialog(QuantityAdjustmentModal);
  const account = useContext(AccountContext);
  const [category, setCategory] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [officeId, setOfficeId] = useState<string | null>(
    account?.office?.id ?? null
  );
  const [state, setState] = useState({
    filter: "",
    brand: null,
    status: true,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const groups = useItemGroups();
  const categories = useItemCategory({ groupId: groupId });
  const brands = useItemBrands();
  const offices = useOffices();
  const { data, loading, refetch } = useQuery<Query>(
    GET_BEGINNING_BY_LOCATION,
    {
      variables: {
        filter: state.filter,
        office: officeId,
        groupId: groupId,
        category: category,
        brand: state.brand ?? "",
        page: state.page,
        size: state.size,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onShowModalTransaction = (record?: BeginningBalanceDto) => {
    modal({ record: record, office: officeId }, (result: any) => {
      if (result) {
        message.success(result);
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Setup Item Beginning Balances"
      content="Inventory Head Start: Easy Beginning Balance Configuration.">
      <ProCard
        title="Inventory"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        size="small">
        <Row gutter={[0, 8]}>
          <Col span={24}></Col>
          <Col span={24}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
          </Col>
          <Col span={24}>
            <div className="w-full mb-5">
              <Form layout="vertical" className="filter-form">
                <Row gutter={[8, 0]}>
                  <Col xs={24} sm={12} md={6}>
                    <FormSelect
                      label="Filter Location"
                      propsselect={{
                        showSearch: true,
                        value: officeId,
                        options: offices,
                        allowClear: true,
                        placeholder: "Select Location",
                        onChange: (newValue) => {
                          setOfficeId(newValue ?? null);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <FormSelect
                      label="Filter Item Group"
                      propsselect={{
                        showSearch: true,
                        value: groupId,
                        options: groups,
                        allowClear: true,
                        placeholder: "Select Item Group",
                        onChange: (newValue) => {
                          setGroupId(newValue);
                          setCategory([]);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <FormSelect
                      label="Filter Item Category"
                      propsselect={{
                        showSearch: true,
                        mode: "multiple",
                        value: category,
                        options: categories,
                        allowClear: true,
                        placeholder: "Select Item Category",
                        onChange: (newValue) => {
                          setCategory(newValue);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <FormSelect
                      label="Filter Item Brand"
                      propsselect={{
                        showSearch: true,
                        value: state.brand,
                        options: brands,
                        allowClear: true,
                        placeholder: "Select Item Brand",
                        onChange: (newValue) => {
                          setState((prev) => ({ ...prev, brand: newValue }));
                        },
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
          <Col span={24}>
            <BeginningBalanceTable
              dataSource={
                data?.beginningBalancePage?.content as BeginningBalanceDto[]
              }
              loading={loading}
              totalElements={
                data?.beginningBalancePage?.totalElements as number
              }
              handleOpen={(e) => onShowModalTransaction(e)}
              changePage={(e: number) =>
                setState((prev) => ({ ...prev, page: e }))
              }
            />
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}
