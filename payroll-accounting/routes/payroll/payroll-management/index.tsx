import CustomButton from "@/components/common/CustomButton";
import TablePaginated from "@/components/common/TablePaginated";
import { Payroll } from "@/graphql/gql/graphql";
import useGetPayrollPagable from "@/hooks/payroll/useGetPayrollPagable";
import { payrollStatusColorGenerator } from "@/utility/constant-formatters";
import { IPageProps, IPaginationFilters } from "@/utility/interfaces";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { DatePicker, Input, Space, Tag, Tooltip } from "antd";

import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
const { Search } = Input;

interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

const initialState: IPaginationFilters = {
  filter: "",
  page: 0,
  size: 10,
};

export default function PayrollPage({ account }: IPageProps) {
  const [dates, setDates] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [pageFilters, setPageFilters] =
    useState<IPaginationFilters>(initialState);

  const [data, loading, refetch] = useGetPayrollPagable(pageFilters);

  const columns: ColumnsType<Payroll> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date Range",
      dataIndex: "dateRange",
      key: "dateRange",
      render: (text, record) => {
        {
          return (
            <div>
              {dayjs(record.dateStart).format(" MMMM D, YYYY")} -
              {dayjs(record.dateEnd).format(" MMMM D, YYYY")}
            </div>
          );
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={payrollStatusColorGenerator(text)}>{text}</Tag>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => {
        return <div>{dayjs(text).format("MMMM Do YYYY, h:mm a")}</div>;
      },
    },

    {
      title: "Actions",
      dataIndex: "id",
      key: "actions",
      render: (text, record) => {
        var link;
        record.status === "DRAFT"
          ? (link = `/payroll/payroll-management/${record.id}/edit`)
          : (link = `/payroll/payroll-management/${record.id}`);
        return (
          <Space size={"small"}>
            <Tooltip>
              <CustomButton
                href={link}
                shape="circle"
                // ghost
                icon={<EyeOutlined />}
                type="primary"
                allowedPermissions={["view_payroll"]}
              />
            </Tooltip>

            {record.status === "DRAFT" && (
              <CustomButton
                shape="circle"
                danger
                // ghost
                icon={<DeleteOutlined />}
                type="primary"
                // onClick={(e) => {
                //   showModal(record.id);
                // }}
                allowedPermissions={["delete_payroll"]}
              />
            )}
          </Space>
        );
      },
    },
  ];

  const handleDateChange = (dates: any) => {
    try {
      setDates([dayjs(dates[0]).startOf("day"), dayjs(dates[1]).endOf("day")]);
    } catch {
      setDates([dayjs().startOf("month"), dayjs().endOf("month")]);
    }
  };

  return (
    <PageContainer>
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        title={"Payroll Management"}
        extra={
          <ProFormGroup>
            <DatePicker.RangePicker
              onChange={(dates: any) => {
                handleDateChange(dates);
              }}
            />
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) =>
                setPageFilters((prev: any) => ({ ...prev, filter: e }))
              }
              allowClear
              className="select-header"
            />

            <CustomButton
              href={"/payroll/payroll-management/create"}
              icon={<PlusOutlined />}
              type="primary"
              allowedPermissions={["create_new_payroll"]}
            >
              New Payroll
            </CustomButton>
          </ProFormGroup>
        }
      >
        <TablePaginated
          total={1}
          pageSize={1}
          current={1}
          columns={columns}
          dataSource={data}
        />
      </ProCard>
    </PageContainer>
  );
}
