import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form, Segmented } from "antd";
import { useLocalStorage } from "@/utility/helper";
import FormDateRange from "@/components/common/formDateRange/filterDateRange";
import dayjs, { Dayjs } from "dayjs";
import FormDebounceSelect from "@/components/common/formDebounceSelect/formDebounceSelect";
import { OptionsValue } from "@/utility/interfaces";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import FormSwitch from "@/components/common/formSwitch/formSwitch";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import WTXListTable from "@/components/accounting/payables/wtx/listTable";
import WTXConsolidatedTable from "@/components/accounting/payables/wtx/consolidatedTable";
import { SegmentedValue } from "antd/es/segmented";
import { Wtx2307 } from "@/graphql/gql/graphql";

const { Search } = Input;
const dateFormat = "YYYY-MM-DD";

export default function WTXComponent() {
  // ============= state =====================
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useLocalStorage("wtxTabs", "list");
  const [filter, setFiler] = useState("");
  const [supplier, setSupplier] = useState<OptionsValue>();
  const [selected, setSelected] = useState<Wtx2307[]>([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState<React.Key[]>([]);
  const [status, setStatus] = useState({
    disabled: false,
    value: false,
  });
  const [filterDates, setFilterDates] = useState({
    start: dayjs(dayjs().startOf("month"), dateFormat),
    end: dayjs(dayjs().endOf("month"), dateFormat),
  });
  //============== functions =======================
  const cleared = () => {
    setSelected([]);
    setSelectedRowkeys([]);
    setPage(0);
  };

  const onRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates) {
      setFilterDates((prev) => ({
        ...prev,
        start: dayjs(dates[0], dateFormat),
        end: dayjs(dates[1], dateFormat),
      }));
      cleared();
    }
  };

  const onSetActiveTab = (e: SegmentedValue) => {
    if (e === "consolidated") {
      setStatus((prev) => ({ ...prev, value: false, disabled: true }));
    } else {
      setStatus((prev) => ({ ...prev, value: false, disabled: false }));
    }
    cleared();
    setActiveTab(e);
  };

  return (
    <PageContainer content="Withholding Tax Deductions">
      <ProCard
        title="2037 File (WTX)"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => {
                cleared();
                setFiler(e);
              }}
              className="select-header"
            />
            <Segmented
              value={activeTab}
              onChange={(e) => onSetActiveTab(e)}
              options={[
                {
                  label: "2307 List",
                  value: "list",
                  icon: <BarsOutlined />,
                },
                {
                  label: "Consolidated 2307",
                  value: "consolidated",
                  icon: <AppstoreOutlined />,
                },
              ]}
            />
          </ProFormGroup>
        }>
        <div className={`w-full ${activeTab === "list" ? "mb-2-5" : "mb-5"}`}>
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <FormDateRange
                  label="Filter Date From"
                  showpresstslist={true}
                  propsrangepicker={{
                    defaultValue: [filterDates.start, filterDates.end],
                    format: dateFormat,
                    onChange: onRangeChange,
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormDebounceSelect
                  label="Filter Supplier"
                  propsselect={{
                    allowClear: true,
                    value: supplier,
                    placeholder: "Select Supplier",
                    fetchOptions: GET_SUPPLIER_OPTIONS,
                    onChange: (newValue) => {
                      cleared();
                      setSupplier(newValue as OptionsValue);
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSwitch
                  label="Show Consolidated"
                  switchprops={{
                    checkedChildren: "Yes",
                    unCheckedChildren: "No",
                    onChange: (e) => {
                      setPage(0);
                      setStatus((prev) => ({ ...prev, value: e }));
                    },
                    checked: status.value,
                    disabled: status.disabled,
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        {activeTab === "list" ? (
          <WTXListTable
            filter={filter}
            supplier={supplier}
            filterDates={filterDates}
            status={status.value}
            page={page}
            setPage={setPage}
            selectedRowkeys={selectedRowkeys}
            setSelectedRowkeys={setSelectedRowkeys}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <WTXConsolidatedTable
            filter={filter}
            supplier={supplier}
            filterDates={filterDates}
            page={page}
            setPage={setPage}
          />
        )}
      </ProCard>
    </PageContainer>
  );
}
