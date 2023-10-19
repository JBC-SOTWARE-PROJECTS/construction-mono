import { Calendar, Col, Row, Select } from "antd";
import React from "react";

function CustomCalender({ handleSelectDate, selectedDates }: any) {
  return (
    <div>
      {" "}
      <Calendar
        className="custom_calender"
        fullscreen={false}
        onSelect={handleSelectDate}
        dateFullCellRender={(date) => {
          const style = selectedDates?.includes(date.startOf("day").format())
            ? { backgroundColor: "#47bb66 ", color: "white" }
            : {};
          return (
            <div className="custom_calendar_cell" style={style}>
              {date.get("date")}
            </div>
          );
        }}
        headerRender={({ value, type, onChange, onTypeChange }: any) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          let current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current = current.month(i);
            months.push(localeData.monthsShort(current));
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className="month-item">
                {months[i]}
              </Select.Option>
            );
          }

          const year = value.year();
          const month = value.month();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>
            );
          }
          return (
            <div style={{ padding: 8 }}>
              <Row gutter={8}>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    className="my-year-select"
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                  >
                    {options}
                  </Select>
                </Col>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    value={month}
                    onChange={(newMonth) => {
                      const now = value.clone().month(newMonth);
                      onChange(now);
                    }}
                  >
                    {monthOptions}
                  </Select>
                </Col>
              </Row>
            </div>
          );
        }}
      />
    </div>
  );
}

export default CustomCalender;
