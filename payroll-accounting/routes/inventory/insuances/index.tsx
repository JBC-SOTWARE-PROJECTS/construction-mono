import React, { useMemo, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Query, StockIssue } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import UpsertItemModal from "@/components/inventory/masterfile/items/dialogs/upsertItem";
import { FormSelect } from "@/components/common";
import { useOffices } from "@/hooks/payables";
import { ISSUANCE_CATEGORY } from "@/utility/constant";
import { OptionsValue } from "@/utility/interfaces";
import { GET_ISSUANCE_RECORDS } from "@/graphql/inventory/issuance-queries";
import IssuanceTable from "@/components/inventory/issuance/issuanceTable";

const { Search } = Input;

export default function IssuanceComponent({
  type,
  issueType,
}: {
  type: string;
  issueType: string;
}) {
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
  const { data, loading, refetch } = useQuery<Query>(GET_ISSUANCE_RECORDS, {
    variables: {
      filter: state.filter,
      office: office,
      category: category,
      issueType: issueType,
      project: project,
      asset: asset,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: StockIssue) => {
    modal({ record: record }, (msg: string) => {
      if (msg) {
        message.success(msg);
        refetch();
      }
    });
  };

  const handleUpdateStatus = (record: StockIssue, status: boolean) => {
    if (status) {
      //if clicked approved
      if (record?.isPosted) {
        message.error("Delivery Receiving is already posted");
      } else {
      }
    } else {
      //void
      if (!record?.isPosted) {
        message.error("Delivery Receiving is already not yet posted");
      } else {
      }
    }
  };
  const title = useMemo(() => {
    let title = "All Item Issuances";
    if (issueType === "EXPENSE") {
      title = "All Item Expense";
    }
    switch (type) {
      case "projects":
        title = "Projects Item Issuances";
        if (issueType === "EXPENSE") {
          title = "Projects Item Expense";
        }
        setCategory("PROJECTS");
        break;
      case "spare-parts":
        title = "Spare Parts Item Issuances";
        if (issueType === "EXPENSE") {
          title = "Spare Parts Item Expense";
        }
        setCategory("SPARE_PARTS");
        break;
      case "personal":
        title = "Personal Item Issuances";
        if (issueType === "EXPENSE") {
          title = "Personal Item Expense";
        }
        setCategory("PERSONAL");
        break;
    }
    return title;
  }, [type, issueType]);

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
      title="Item Issuances"
      content="Efficient Inventory Utilization: Mastering Item Issuances and Expense Tracking.">
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
                    {type === "all" && (
                      <FormSelect
                        label="Filter Issuance Category"
                        propsselect={{
                          showSearch: true,
                          value: category,
                          options: ISSUANCE_CATEGORY,
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
                </>
              ) : (
                <>
                  <Col span={24}>
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
                </>
              )}
            </Row>
          </Form>
        </div>
        <IssuanceTable
          dataSource={data?.stiByFiltersNewPage?.content as StockIssue[]}
          loading={loading}
          totalElements={data?.stiByFiltersNewPage?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleUpdateStatus={(record, e) => handleUpdateStatus(record, e)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
