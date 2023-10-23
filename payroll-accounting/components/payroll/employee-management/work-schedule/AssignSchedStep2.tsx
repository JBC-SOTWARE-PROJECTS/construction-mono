import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Calendar, Col, Row, Select, Table } from "antd";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import dayjs from "dayjs";
import { columns, transformDatesArray } from "./AssignEmployeeScheduleModal";
import CustomCalender from "@/components/common/CustomCalender";

interface IProps {
  selectedDates: string[];
  handleSelectDate: (e: dayjs.Dayjs, selectedInfo: SelectInfo) => void;
}
function AssignSchedStep2({ selectedDates, handleSelectDate }: IProps) {
  return (
    <div>
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        headerBordered
        extra={<ProFormGroup></ProFormGroup>}
      >
        <Row gutter={16}>
          <Col lg={8} md={24} sm={24} xs={24}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CustomCalender
                selectedDates={selectedDates}
                handleSelectDate={handleSelectDate}
              />
            </div>
          </Col>
          <Col lg={16} md={24} sm={24} xs={24}>
            <Table
              style={{ marginTop: 40, marginLeft: 40 }}
              size="small"
              columns={columns}
              dataSource={transformDatesArray(selectedDates)}
            />
          </Col>
        </Row>
      </ProCard>
    </div>
  );
}

export default AssignSchedStep2;
