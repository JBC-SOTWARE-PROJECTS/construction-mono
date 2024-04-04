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
import UpsertIssuanceFormModal from "@/components/inventory/issuance/dialogs/upserIssuanceFormModal";
import { FormSelect } from "@/components/common";
import { useOffices } from "@/hooks/payables";
import { ISSUANCE_CATEGORY } from "@/utility/constant";
import { GET_ISSUANCE_RECORDS } from "@/graphql/inventory/issuance-queries";
import IssuanceTable from "@/components/inventory/issuance/issuanceTable";
import PostIssuanceExpenseModal from "@/components/inventory/post-dialogs/postIssuanceExpense";

const { Search } = Input;

interface IProps {
  type: string;
  issueType: string;
}

export default function IssuanceComponent({ type, issueType }: IProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [asset, setAsset] = useState<string | null>(null);
  const [office, setOffice] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });
  // ====================== modals ==================================
  const modal = useDialog(UpsertIssuanceFormModal);
  const postInventory = useDialog(PostIssuanceExpenseModal);
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
    modal(
      { record: record, issueCategory: category, issueType: issueType },
      (msg: string) => {
        if (msg) {
          message.success(msg);
          refetch();
        }
      }
    );
  };

  const onPostOrVoidView = (
    record: StockIssue,
    status: boolean,
    viewOnly: boolean
  ) => {
    let title = "Item Issuance Post to Inventory";
    let showJournal = false;
    if (record.issueType === "EXPENSE") {
      title = "Item Expense Journal Entry Details";
      showJournal = true;
    }
    postInventory(
      {
        record: record,
        status: status,
        viewOnly: viewOnly,
        title: title,
        showJournal: showJournal,
      },
      (result: string) => {
        if (result) {
          message.success(result);
          refetch();
        }
      }
    );
  };

  const handleUpdateStatus = (record: StockIssue, status: boolean) => {
    let errMsg = "Item Issuance";
    if (record.issueType === "EXPENSE") {
      errMsg = "Item Expense";
    }
    if (status) {
      //if clicked approved
      if (record?.isPosted) {
        message.error(`${errMsg} is already posted`);
      } else {
        onPostOrVoidView(record, status, false);
      }
    } else {
      //void
      if (!record?.isPosted) {
        if (record.isCancel) {
          message.error(`${errMsg} is already voided`);
        } else {
          message.error(`${errMsg} is not yet posted`);
        }
      } else {
        onPostOrVoidView(record, status, false);
      }
    }
  };
  const title = useMemo(() => {
    let title = "All Item Issuances";
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
      default:
        title = "All Item Issuances";
        if (issueType === "EXPENSE") {
          title = "All Item Expense";
          setCategory(null);
        }
        break;
    }
    return title;
  }, [type, issueType]);

  const parentTitle = useMemo(() => {
    if (issueType === "EXPENSE") {
      return "Expenses";
    } else {
      return "Issuances";
    }
  }, [issueType]);

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
      title={`Item ${parentTitle}`}
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
