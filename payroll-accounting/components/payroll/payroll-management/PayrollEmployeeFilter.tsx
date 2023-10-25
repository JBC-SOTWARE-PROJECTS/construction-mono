import FormSearch from "@/components/common/formSearch";
import FormSelect from "@/components/common/formSelect/formSelect";
import { PayrollEmployeeStatus } from "@/graphql/gql/graphql";
import { Col, Row } from "antd";
import { capitalize } from "lodash";
import PayrollEmployeeStatusTag, {
  payrollEmployeeStatusColorGenerator,
} from "./PayrollEmployeeStatusTag";

export const employeeStatusOptions = () => {
  let arr = Object.keys(PayrollEmployeeStatus)?.map((key: any) => {
    const index: keyof typeof PayrollEmployeeStatus = key;
    return {
      value: PayrollEmployeeStatus[index],
      label: capitalize(PayrollEmployeeStatus[index]),
    };
  });

  return arr;
};

export const PayrollEmployeeFilter = ({ onQueryChange }: any) => {
  const tagRenderStatus = ({ label, value, closable, onClose }: any): any => {
    const onPreventMouseDown = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <PayrollEmployeeStatusTag
        color={payrollEmployeeStatusColorGenerator(value)}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
        status={value}
      />
    );
  };
  return (
    <Row gutter={[12, 12]}>
      <Col md={8}></Col>
      <Col md={8}>
        <FormSearch
          label="Search Employee"
          style={{ width: "100%" }}
          propssearch={{
            placeholder: "Search Employees",
            onSearch: (value) => {
              onQueryChange("filter", value);
            },
            allowClear: true,
          }}
        />
      </Col>

      <Col md={8}>
        <FormSelect
          label="Status"
          name="status"
          propsselect={{
            showArrow: true,
            placeholder: "Select Status",
            allowClear: true,
            showSearch: true,
            maxTagCount: "responsive",
            mode: "multiple",
            onChange: (value) => onQueryChange("status", value),
            options: employeeStatusOptions(),
            tagRender: tagRenderStatus,
          }}
        />
      </Col>
    </Row>
  );
};
