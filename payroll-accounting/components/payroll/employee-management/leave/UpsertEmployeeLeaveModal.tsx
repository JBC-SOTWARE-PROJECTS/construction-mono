import CustomCalender from "@/components/common/CustomCalender";
import { LeaveStatus, LeaveType } from "@/graphql/gql/graphql";
import useUpsertEmployeeLeave from "@/hooks/employee-leave/useUpsertEmployeeLeave";
import { CheckCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Input, Modal, Select } from "antd";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

function UpsertEmployeeLeaveModal() {
  const [open, setOpen] = useState(false);
  const reasonRef = useRef<any>(null);
  const [type, setType] = useState<any>("VACATION");
  const [withPay, setWithPay] = useState<boolean>(false);
  const router = useRouter();
  const [upsert, loadingUpsert] = useUpsertEmployeeLeave(() => {});

  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleSelectDate = (e: dayjs.Dayjs, selectInfo: SelectInfo) => {
    if (selectInfo.source === "date") {
      const date = dayjs(e).startOf("day").format();
      if (!selectedDates.includes(date)) {
        setSelectedDates([...selectedDates, date]);
      } else {
        setSelectedDates(selectedDates.filter((item) => item !== date));
      }
    }
  };

  const onSubmit = (status: LeaveStatus) => {
    const reason = (document?.getElementById("reasonInput") as HTMLInputElement)
      ?.value;
    upsert({
      // id: null as any,
      id: "3ab54398-4cc8-4e3e-99d9-b8ae1b2b2c9d",
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
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Leave Request</Button>
      <Modal
        open={open}
        title="Leave Request"
        onCancel={() => setOpen(false)}
        footer={
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
        }
      >
        <label style={{ marginRight: 10 }}>Reason for Leave: </label>
        <Input ref={reasonRef} id="reasonInput" />
        <label style={{ marginRight: 10 }}>Leave Type: </label>
        <Select
          style={{ width: "100%" }}
          options={Object.values(LeaveType).map((item) => ({
            value: item,
            label: item.replace("_", " "),
          }))}
          defaultValue={"VACATION"}
          onChange={(e) => setType(e)}
        />
        <br />
        <br />
        <label style={{ marginRight: 10 }}>With Pay: </label>
        <Checkbox
          ref={reasonRef}
          id="reasonInput"
          onChange={(e) => setWithPay(e.target.value)}
        />
        <Divider />
        Select Dates:
        <CustomCalender
          selectedDates={selectedDates}
          handleSelectDate={handleSelectDate}
        />
      </Modal>
    </div>
  );
}

export default UpsertEmployeeLeaveModal;
