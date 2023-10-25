import CustomCalender from "@/components/common/CustomCalender";
import {
  EmployeeLeave,
  EmployeeLeaveDto,
  LeaveStatus,
  LeaveType,
} from "@/graphql/gql/graphql";
import useUpsertEmployeeLeave from "@/hooks/employee-leave/useUpsertEmployeeLeave";
import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  Select,
  Spin,
  message,
} from "antd";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface IParams {
  record?: EmployeeLeave | EmployeeLeaveDto;
  refetch: () => void;
}

function UpsertEmployeeLeaveModal({ record, refetch }: IParams) {
  const [open, setOpen] = useState(false);
  const reasonRef = useRef<any>(null);
  const [type, setType] = useState<any>("VACATION");
  const [withPay, setWithPay] = useState<boolean>(false);
  const router = useRouter();
  const [upsert, loadingUpsert] = useUpsertEmployeeLeave(() => {
    refetch();
    setOpen(false);
  });

  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleSelectDate = (e: dayjs.Dayjs, selectInfo: SelectInfo) => {
    if (selectInfo.source === "date") {
      const date = dayjs(e).startOf("day").format();
      if (!selectedDates?.includes(date)) {
        setSelectedDates([...selectedDates, date]);
      } else {
        setSelectedDates(selectedDates.filter((item) => item !== date));
      }
    }
  };

  const onSubmit = (status: LeaveStatus) => {
    if (selectedDates?.length <= 0) {
      message.error("Please select leave dates.");
      return;
    }

    const reason = (document?.getElementById("reasonInput") as HTMLInputElement)
      ?.value;
    upsert({
      id: record?.id,
      employeeId: router?.query?.id as string,
      fields: {
        status,
        reason,
        withPay,
        type: type as LeaveType,
      },
      dates: selectedDates,
    });
  };

  useEffect(() => {
    setType(record?.type || LeaveType.Vacation);
    setWithPay((record?.withPay as boolean) || false);
    const dates = record?.dates?.map((item) => {
      return dayjs(item?.startDatetime).startOf("day").format();
    }) as string[];
    setSelectedDates(dates?.length > 0 ? dates : []);
  }, [record, open]);
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        icon={
          !record ? (
            <PlusOutlined />
          ) : record?.status === LeaveStatus.Draft ? (
            <EditOutlined />
          ) : (
            <EyeOutlined />
          )
        }
        type="primary"
        ghost
      >
        {!record && "Add Leave Request"}
      </Button>
      <Spin spinning={loadingUpsert}>
        <Modal
          open={open}
          title="Leave Request"
          onCancel={() => {
            setOpen(false);
            setSelectedDates([]);
            setType(null);
            setWithPay(false);
          }}
          footer={
            (record?.status === LeaveStatus.Draft || !record) && (
              <>
                <Button
                  onClick={() => onSubmit(LeaveStatus.Draft)}
                  type="primary"
                  ghost
                  icon={<SaveOutlined />}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => onSubmit(LeaveStatus.Finalized)}
                  type="primary"
                  icon={<CheckCircleOutlined />}
                >
                  Finalize
                </Button>
              </>
            )
          }
        >
          <label style={{ marginRight: 10 }}>Reason for Leave: </label>
          <Input
            ref={reasonRef}
            id="reasonInput"
            defaultValue={record?.reason as string}
            readOnly={record?.status === LeaveStatus.Finalized}
          />
          <label style={{ marginRight: 10 }}>Leave Type: </label>
          <Select
            style={{ width: "100%" }}
            options={Object.values(LeaveType).map((item) => ({
              value: item,
              label: item.replace("_", " "),
            }))}
            defaultValue={record?.type || "VACATION"}
            onChange={(e) => setType(e)}
            disabled={record?.status === LeaveStatus.Finalized}
          />
          <br />
          <br />
          <label style={{ marginRight: 10 }}>With Pay: </label>
          <Checkbox
            ref={reasonRef}
            id="reasonInput"
            onChange={(e) => {
              debugger;
              setWithPay(e.target.checked);
            }}
            defaultChecked={record?.withPay as boolean}
            disabled={record?.status === LeaveStatus.Finalized}
          />
          <Divider />
          Select Dates:
          <CustomCalender
            readOnly={record?.status === LeaveStatus.Finalized}
            selectedDates={selectedDates}
            handleSelectDate={handleSelectDate}
          />
        </Modal>
      </Spin>
    </div>
  );
}

export default UpsertEmployeeLeaveModal;
