import AccessControl from "@/components/accessControl/AccessControl";
import ProjectHeader from "@/components/inventory/project-details/common/projectHeader";
import NewWorkAccomplishment from "@/components/inventory/project-details/dialogs/upsert-work-accomplishments";
import WorkAccomplishmentsCollapse from "@/components/inventory/project-details/work-accomplishment/work-accomplishment-collapse";
import { useDialog } from "@/hooks";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { gql, useQuery } from "@apollo/client";
import { Button, Col, Form, Input, Row } from "antd";
import { useRouter } from "next/router";
import { Divider, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import VehicleUsageProjectExpense from "./assets/vehicle-usage-expense";

const PROJECT_WORK_ACCOMPLISH = gql`
  query ($id: UUID) {
    workAccomplish: getProjectWorkAccomplishPageByProject(id: $id) {
      id
      periodStart
      periodEnd
      status
    }
  }
`;

export default function OperationExpenses() {
  const { query } = useRouter();

  const dialogCreate = useDialog(NewWorkAccomplishment);

  const { data, loading, refetch } = useQuery(PROJECT_WORK_ACCOMPLISH, {
    variables: {
      id: query?.id,
    },
  });

  const onUpsertRecord = () => {
    dialogCreate({ projectId: query?.id }, () => refetch());
  };

  const onHandleEdit = (id: string) => {
    dialogCreate({ projectId: query?.id, id }, () => refetch());
  };

  const onSearchRecord = (text: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Vehicle Usage Expense",
      children: <VehicleUsageProjectExpense/>,
    }
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <PageContainer
      pageHeaderRender={(e) => <ProjectHeader id={query?.id as string} />}>
      <ProCard
        title="Operation Expense"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        size="small"
        >
        {/* <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Input.Search
                  size="middle"
                  placeholder="Search here.."
                  onSearch={(e) => onSearchRecord(e)}
                  className="w-full"
                />
              </Col>
            </Row>
          </Form>
        </div> */}
        {/* <WorkAccomplishmentsCollapse
          {...{ data, loading, onHandleEdit, refetch }}
        /> */}
           <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </ProCard>
    </PageContainer>
  );
}
