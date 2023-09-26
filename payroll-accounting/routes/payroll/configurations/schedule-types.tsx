import CustomButton from "@/components/common/CustomButton";
import UpsertScheduleType from "@/components/payroll/configurations/UpsertScheduleType";
import { Schedule } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import useGetScheduleTypes from "@/hooks/configurations/useGetScheduleTypes";
import { IPageProps } from "@/utility/interfaces";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Head from "next/head";

interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

export default function ScheduleTypeSetup({ account }: IPageProps) {
  const showDialog = useDialog(UpsertScheduleType);
  const [schedules, loading, refetch] = useGetScheduleTypes();
  const columns: ColumnsType<Schedule> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Start Date",
      dataIndex: "dateTimeStartRaw",
      key: "dateTimeStartRaw",
      render: (value) => {
        return dayjs(value).format("h:mm a");
      },
    },
    {
      title: "End Date",
      dataIndex: "dateTimeEndRaw",
      key: "dateTimeEndRaw",
      render: (value) => {
        return dayjs(value).format("h:mm a");
      },
    },
    {
      title: "Meal Break Start",
      dataIndex: "mealBreakStart",
      key: "mealBreakStart",
      render: (value) => {
        return dayjs(value).format("h:mm a");
      },
    },
    {
      title: "Meal Break End",
      dataIndex: "mealBreakEnd",
      key: "mealBreakEnd",
      render: (value) => {
        return dayjs(value).format("h:mm a");
      },
    },
    {
      title: "Project",
      dataIndex: ["project", "description"],
      key: "project",
    },
    {
      title: "#",
      key: "action",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <Space size={"small"}>
          <CustomButton
            key={text}
            type="primary"
            size="small"
            onClick={() => showDialog({ record }, closeCallBack)}
            icon={<EditOutlined />}
            allowedPermissions={["add_edit_schedule_type"]}
          />
          <CustomButton
            key={text}
            type="default"
            danger
            size="small"
            onClick={() => showDialog({ record }, closeCallBack)}
            icon={<DeleteOutlined />}
            allowedPermissions={["delete_schedule_type"]}
          />
        </Space>
      ),
    },
  ];

  const closeCallBack = () => {
    refetch();
  };

  return (
    <PageContainer title="Configurations">
      <ProCard
        title="Work Schedule Setup"
        headStyle={{
          flexWrap: "wrap",
        }}
        extra={
          <ProFormGroup>
            <CustomButton
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                showDialog({}, closeCallBack);
              }}
              allowedPermissions={["add_edit_schedule_type"]}
            >
              Create New
            </CustomButton>
          </ProFormGroup>
        }
      >
        <Head>
          <title>Work Schedule Setup</title>
        </Head>

        <Table columns={columns} dataSource={schedules} />
      </ProCard>
    </PageContainer>
  );
}
