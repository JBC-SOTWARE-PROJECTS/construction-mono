import React, { useContext, useState } from "react";
import {
  Col,
  Row,
  Typography,
  Modal,
  message,
  Dropdown,
  Menu,
  Button,
  Divider,
  Table,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import {
  REST_DAY_SCHEDULE_COLOR,
  REST_DAY_SCHEDULE_LABEL,
  REST_DAY_SCHEDULE_TITLE,
} from "@/utility/constant";
import { AccountContext } from "@/components/accessControl/AccountContext";
import useHasPermission from "@/hooks/useHasPermission";

const DELETE_DEPT_SCHED = gql`
  mutation ($id: UUID) {
    data: deleteDepartmentSchedule(id: $id) {
      success
      message
    }
  }
`;

const CLEAR_DEPT_SCHED = gql`
  mutation ($id: UUID) {
    data: clearSchedule(id: $id) {
      success
      message
    }
  }
`;

const DepartmentSchedule = ({ department = {}, ...props }) => {
  const accountContext = useContext(AccountContext);
  const [formModal, setFormModal] = useState(false);
  const [copyModal, setCopyModal] = useState(false);
  const [value, setValue] = useState({});
  const isAllowed = useHasPermission([
    "manage_dept_sched_config",
    "copy_dept_sched_config",
    "clear_department_schedule_config",
  ]);
  const allowedManageDeptSchedule = useHasPermission([
    "manage_dept_sched_config",
  ]);
  const allowedCopyDeptSched = useHasPermission(["copy_dept_sched_config"]);
  const allowedClearDeptSched = useHasPermission([
    "clear_department_schedule_config",
  ]);




 
  let columns = [
    {
      title: () => <Typography.Text strong>Title</Typography.Text>,
      dataIndex: "title",
    },
    {
      title: () => <Typography.Text strong>Label</Typography.Text>,
      dataIndex: "label",
    },
    {
      title: () => <Typography.Text strong>Time Start</Typography.Text>,
      dataIndex: "dateTimeStartRaw",
      // render: (value) =>
      //   value ? <MomentFormatter value={value} format={"hh:mm A"} /> : "N/A",
    },
    {
      title: () => <Typography.Text strong>Time End</Typography.Text>,
      dataIndex: "dateTimeEndRaw",
      // render: (value) =>
      //   value ? <MomentFormatter value={value} format={"hh:mm A"} /> : "N/A",
    },
    {
      title: () => <Typography.Text strong>Meal Break Start</Typography.Text>,
      dataIndex: "mealBreakStart",
      // render: (value) =>
      //   value ? <MomentFormatter value={value} format={"hh:mm A"} /> : "N/A",
    },
    {
      title: () => <Typography.Text strong>Meal Break End</Typography.Text>,
      dataIndex: "mealBreakEnd",
      // render: (value) =>
      //   value ? <MomentFormatter value={value} format={"hh:mm A"} /> : "N/A",
    },
    {
      title: () => <Typography.Text strong>Color</Typography.Text>,
      dataIndex: "color",
      render: (value) =>
        value ? (
          <span
            style={{
              width: 25,
              height: 25,
              backgroundColor: value,
              display: "inline-block",
              borderRadius: 25,
            }}
          />
        ) : (
          "N/A"
        ),
    },
  ];


  }

  const dept = department;
  let schedules = dept?.schedules || [];
  schedules = [
    {
      title: REST_DAY_SCHEDULE_TITLE,
      label: REST_DAY_SCHEDULE_LABEL,
      color: REST_DAY_SCHEDULE_COLOR,
    },
    ...schedules,
  ];

  return (
    <span key={dept?.id}>
      <Divider>{dept?.departmentName}</Divider>
      <Table
        bordered
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "3px 0",
            }}
          >
            <Typography.Text strong style={{ fontSize: "16px" }}>
              Department Schedule
            </Typography.Text>
            <div style={{ padding: "0 20px" }}>
              {isAllowed && [
                <Dropdown
                  key="options"
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      {allowedManageDeptSchedule && (
                        <Menu.Item
                          onClick={() =>
                            handleFormModal({ department: dept?.id }, false)
                          }
                        >
                          Create Schedule
                        </Menu.Item>
                      )}
                      {allowedCopyDeptSched && (
                        <Menu.Item onClick={() => handleCopyModal(false)}>
                          Copy Schedule
                        </Menu.Item>
                      )}
                      {allowedClearDeptSched && (
                        <Menu.Item
                          danger
                          onClick={handleClearDepartmentSchedule}
                        >
                          Clear Schedule
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                  placement="bottomRight"
                >
                  <Button shape="circle" icon={<MoreOutlined />} />
                </Dropdown>,
              ]}
            </div>
          </div>
        )}
        size={"small"}
        columns={columns}
        dataSource={schedules || []}
        pagination={false}
        rowKey={(row) => row.id}
      />

    </span>
  );
};

// export default DepartmentSchedule;
export default React.memo(DepartmentSchedule, (prevProps, props) => {
  let department = JSON.stringify(props?.department);
  let prevDepartment = JSON.stringify(prevProps?.department);

  return department === prevDepartment;
});
