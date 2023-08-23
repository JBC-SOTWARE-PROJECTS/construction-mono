import React, { useState, useEffect } from "react";
import {
  AutoComplete,
  Button,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import Head from "next/head";
import ScheduleTypeSetup from "./ScheduleTypes";
import { PageHeader, ProCard, ProFormGroup } from "@ant-design/pro-components";
import { gql, useQuery } from "@apollo/client";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import UpsertScheduleType from "./UpsertScheduleType";
import { Schedule } from "@/graphql/gql/graphql";
import { ColumnsType } from "antd/es/table";

const ScheduleTypesPage = () => {
  const [filter, setFilter] = useState(null);
  const showDialog = useDialog(UpsertScheduleType);
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
      dataIndex: "dateTimeStart",
      key: "dateTimeStart",
    },
    {
      title: "Start Date",
      dataIndex: "dateTimeStartRaw",
      key: "dateTimeStartRaw",
    },
    {
      title: "End Date",
      dataIndex: "dateTimeEnd",
      key: "dateTimeEnd",
    },
    {
      title: "End Date",
      dataIndex: "dateTimeEndRaw",
      key: "dateTimeEndRaw",
    },
    {
      title: "Meal Break Start",
      dataIndex: "mealBreakStart",
      key: "mealBreakStart",
    },
    {
      title: "Meal Break End",
      dataIndex: "mealBreakEnd",
      key: "mealBreakEnd",
    },
  ];

  return (
    <>
      <ProCard
        title="Work Schedule Setup"
        headStyle={{
          flexWrap: "wrap",
        }}
        extra={
          <ProFormGroup>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                showDialog({}, (result: any) => {});
              }}
            >
              Create New
            </Button>
          </ProFormGroup>
        }
      >
        <Head>
          <title>Work Schedule Setup</title>
        </Head>

        <Table columns={columns} />
      </ProCard>
    </>
  );
};

export default ScheduleTypesPage;
