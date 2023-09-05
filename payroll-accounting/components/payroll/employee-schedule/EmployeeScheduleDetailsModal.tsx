import { PageHeader } from "@/components/common";
import { Schedule } from "@/graphql/gql/graphql";
import { IState } from "@/routes/administrative/Employees";
import { Modal, Space } from "antd";
import { useState } from "react";

interface IProps {
  hide: (hideProps: any) => void;
  refetchEmployes: () => void;
  record?: Schedule | null | undefined;
}

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

function EmployeeScheduleDetailsModal(props: IProps) {
  const { hide, refetchEmployes } = props;

  return (
    <Modal
      open
      onCancel={() => {
        hide(false);
      }}
      maskClosable={false}
      width={"60vw"}
      title={"Employee Schedule Details"}
      footer={<Space></Space>}
    ></Modal>
  );
}

export default EmployeeScheduleDetailsModal;
