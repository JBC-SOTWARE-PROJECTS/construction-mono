import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, Row, Col, Form, App, Tag, Statistic } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { confirmDelete, useDialog } from "@/hooks";
import UpsertProjectCost from "@/components/inventory/projects/dialogs/upsertProjectCost";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  ProjectCost,
  ProjectCostRevisions,
  Projects,
  Query,
} from "@/graphql/gql/graphql";
import {
  DELETE_PROJECT_COST_ITEM,
  GET_PROJECT_BY_ID,
  GET_PROJECT_COST,
  GET_PROJECT_COST_REV,
} from "@/graphql/inventory/project-queries";
import BillQuantitesTable from "@/components/inventory/project-details/billQuantitiesTable";
import ProjectHeader from "@/components/inventory/project-details/common/projectHeader";
import { useRouter } from "next/router";
import _ from "lodash";
import { ExtendedProjectCostRevisions } from "@/interface/projects";
import ReviseProjectCost from "@/components/inventory/projects/dialogs/reviseProjectCost";
import AccessControl from "@/components/accessControl/AccessControl";
import Alert from "antd/es/alert/Alert";
import { NumberFormater } from "@/utility/helper";
import ProjectExpenseTable from "@/components/inventory/project-details/projectExpenseTable";
import useGetProjectExpense from "@/hooks/asset/useGetProjectExpense";
import { IUMState } from "../../assets/masterfile/upcomingMaintenanceKms";

const { Search } = Input;

export default function ProjectExpenseContent() {
  const { message } = App.useApp();
  const modal = useDialog(UpsertProjectCost);
  const reviseModal = useDialog(ReviseProjectCost);
  const router = useRouter();
  const { query } = router;

 


  const [state, setState] = useState({
    filter: "",
    revesions: {} as any,
    page: 0,
    size: 10,
    projectId: query?.id ?? null,
  });

  // const initialStateQuery: IUMState = {
  //   projectId: query?.id ?? null,
  //   filter: "",
  //   page: 0,
  //   size: 10,
  // };

  const [expenses, loadingExpenses, refetchProject] = useGetProjectExpense({
    variables: {
      ...state,
      projectId: query?.id ?? null,
    },
    fetchPolicy: "network-only",
  });


  
  // ====================== queries =====================================
  // const { data, loading, refetch } = useQuery<Query>(GET_PROJECT_COST, {
  //   variables: {
  //     filter: state.filter,
  //     id: query?.id ?? null,
  //   },
  //   fetchPolicy: "cache-and-network",
  // });

  const [getRevisions, { loading: revisionLoading }] =
    useLazyQuery<Query>(GET_PROJECT_COST_REV);

  // const [deleletRecord, { loading: upsertLoading }] = useMutation(
  //   DELETE_PROJECT_COST_ITEM,
  //   {
  //     ignoreResults: false,
  //     onCompleted: (data) => {
  //       if (data?.updateStatusCost?.id) {
  //         message.success("Bill of Quanities successfully removed");
  //         refetch();
  //       } else {
  //         message.error("Something went wrong. Please contact administrator");
  //       }
  //     },
  //     refetchQueries: [GET_PROJECT_BY_ID],
  //   }
  // );

  // const onDelete = (record: ProjectCost) => {
  //   confirmDelete("Click Yes if you want to proceed", () => {
  //     deleletRecord({
  //       variables: {
  //         id: record?.id,
  //       },
  //     });
  //   });
  // };

  // const onUpsertRecord = (record?: ProjectCost) => {
  //   if (record) {
  //     reviseModal({ record: record }, (result: any) => {
  //       if (result) {
  //         message.success(result);
  //         refetch();
  //         openRevisions(record?.id, record?.description ?? "");
  //       }
  //     });
  //   } else {
  //     modal({ record: record, projectId: query?.id ?? null }, (result: any) => {
  //       if (result) {
  //         message.success(result);
  //         refetch();
  //       }
  //     });
  //   }
  // };

  const openRevisions = (id: string, desc: string) => {
    getRevisions({
      variables: {
        id: id,
      },
      onCompleted: (data) => {
        let result = data?.pCostRevByList as ProjectCostRevisions[];
        let finalResult: ExtendedProjectCostRevisions[] = (result || []).map(
          (obj: ProjectCostRevisions) => ({ ...obj, description: desc })
        );
        if (!_.isEmpty(result)) {
          setState((prev) => ({
            ...prev,
            revesions: { ...prev.revesions, [id]: finalResult },
          }));
        }
      },
    });
  };

  return (
    <PageContainer
      className="project-details"
      pageHeaderRender={(e) => <ProjectHeader id={query?.id as string} />}>
      <ProCard
        title="Project Expenses"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        size="small"
        headerBordered
        >
        <div className="w-full mb-5">
          <Alert
            type="info"
            message="Project Expenses include accounting-posted payable amounts and petty cash vouchers assigned to the project. This is a read-only module and is updated when those transactions are posted."
          />
        </div>
        {/* <div className="w-full mb-5">
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
            </Row>
          </Form>
        </div> */}
        <div className="w-full mb-5 dev-between">
          <Statistic
            title="Total Posted Cost"
            value={Number(_.sumBy(expenses, "totalNetAmount"))}
            formatter={(e) => {
              let value = Number(e);
              return `${NumberFormater(value)}`;
            }}
          />
          {/* <Statistic
            title="Total Relative Weight (%)"
            value={Number(_.sumBy(, "relativeWeight"))}
            formatter={(e) => {
              let value = Number(e);
              return `${NumberFormater(value)}%`;
            }}
          /> */}
        </div>
        <ProjectExpenseTable
          projectId={query?.id as string}
          dataSource={expenses ?? []}
          loading={loadingExpenses }
        />
      </ProCard>
    </PageContainer>
  );
}
