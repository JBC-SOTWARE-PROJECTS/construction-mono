import React, { useState } from "react";
import FullScreenModal from "../common/fullScreenModal/fullScreenModal";
import {
  CarryOutOutlined,
  CheckCircleTwoTone,
  CheckOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Input,
  Divider,
  Table,
  App,
  Spin,
} from "antd";
import { ACCOUNT_TYPES, responsiveColumn2 } from "@/utility/constant";
import { FormSelect } from "../common";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@apollo/client";
import { ChartOfAccountGenerate } from "@/graphql/gql/graphql";
import { GET_COA_GEN_RECORDS } from "@/graphql/coa/queries";
import _ from "lodash";
import numeral from "numeral";
import { Table as VirtualTable, Column, AutoSizer } from "react-virtualized";

interface IProps {
  hide: (hideProps: any) => void;
  type?: string;
  defaultSelected?: any[];
  singleSelect?: boolean;
}

const { Search } = Input;

export default function ChartOfAccountsComponentSelector(props: IProps) {
  const { message } = App.useApp();
  const { hide, singleSelect, defaultSelected } = props;
  const [state, setState] = useState({
    filter: "",
    accountType: null,
  });
  let _selectedCoa: any = {};
  if (defaultSelected) {
    defaultSelected.forEach((item) => {
      _selectedCoa[item.code] = item;
    });
  }
  const [selectedCoa, setSelectedCoa] = useState<any>(_selectedCoa);
  //=============================queries===============================================
  const { loading, data } = useQuery(GET_COA_GEN_RECORDS, {
    fetchPolicy: "cache-and-network",
    variables: {
      accountType: null,
      motherAccountCode: null,
      accountName: state.filter,
      subaccountType: null,
      department: null,
      accountCategory: state.accountType,
      excludeMotherAccount: true,
    },
    onError: (error) => {
      if (error) {
        message.error(
          "Something went wrong. Cannot generate Chart of Accounts"
        );
      }
    },
  });
  //=============================functions =============================================
  const onProces = () => {
    let selected = [];
    for (let prop in selectedCoa) {
      selected.push({ ...selectedCoa[prop] });
    }
    if (selected.length === 0) {
      message.warning("No Selected Account");
      return;
    }
    hide(selected);
  };

  //==================== Selected Accounts Column =======================================
  const columns: ColumnsType<ChartOfAccountGenerate> = [
    {
      title: "Account Code",
      dataIndex: "code",
      key: "code",
      width: "50%",
    },
    {
      title: "Description",
      dataIndex: "accountName",
      key: "accountName",
      width: "50%",
    },
  ];

  const rowGetter = ({ index }: { index: number }) => {
    return _.get(data, "coaList", [])[index];
  };

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<FileDoneOutlined />}
      title="Chart of Accounts Selector"
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={onProces}
            icon={<CarryOutOutlined />}>
            Process Selected Accounts
          </Button>
        </Space>
      }>
      <Form layout="vertical">
        <Row gutter={[8, 8]}>
          <Col {...responsiveColumn2}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormSelect
              name="accountType"
              propsselect={{
                showSearch: true,
                options: ACCOUNT_TYPES,
                allowClear: true,
                placeholder: "Filter Account Type",
                onChange: (e) => {
                  setState((prev) => ({ ...prev, accountType: e }));
                },
              }}
            />
          </Col>
        </Row>
        <Divider plain>Chart of Accounts</Divider>
        <Row>
          <Col span={24}>
            <Spin spinning={loading}>
              <div style={{ height: 300, width: "100%" }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <VirtualTable
                      ref="Table"
                      width={width}
                      height={height}
                      headerHeight={20}
                      rowHeight={20}
                      rowStyle={({ index }) => {
                        if (index >= 0) {
                          let src = data?.coaList || [];
                          let rowData = src[index];
                          if (rowData && selectedCoa[rowData.code])
                            return {
                              cursor: "pointer",
                              backgroundColor: "beige",
                              borderBottom: "1px solid #e0e0e0",
                            };
                        }
                        return {
                          cursor: "pointer",
                          borderBottom: "1px solid #e0e0e0",
                        };
                      }}
                      rowGetter={rowGetter}
                      rowCount={_.get(data, "coaList", []).length}
                      onRowClick={(props) => {
                        const { rowData } = props;
                        if (singleSelect) {
                          setSelectedCoa({
                            [rowData.code]: rowData,
                          });
                        } else {
                          if (selectedCoa[rowData.code]) {
                            delete selectedCoa[rowData.code];
                            setSelectedCoa({
                              ...selectedCoa,
                            });
                          } else {
                            setSelectedCoa({
                              ...selectedCoa,
                              [rowData.code]: rowData,
                            });
                          }
                        }
                      }}>
                      <Column
                        dataKey="#"
                        headerRenderer={() => {
                          return <div>#</div>;
                        }}
                        width={50}
                        cellRenderer={(props) => {
                          const { rowData } = props;
                          return selectedCoa[rowData.code] ? (
                            <CheckCircleTwoTone />
                          ) : (
                            <></>
                          );
                        }}
                      />
                      <Column
                        dataKey="no"
                        headerRenderer={() => {
                          return <div>No.</div>;
                        }}
                        width={50}
                        cellRenderer={(props) => {
                          const { rowIndex } = props;
                          return rowIndex + 1;
                        }}
                      />
                      <Column
                        dataKey="code"
                        headerRenderer={() => {
                          return <div>Code</div>;
                        }}
                        width={200}
                        cellRenderer={(props) => {
                          const { dataKey, rowData } = props;
                          return rowData[dataKey];
                        }}
                      />
                      <Column
                        dataKey="accountType"
                        headerRenderer={() => {
                          return <div>Account Type</div>;
                        }}
                        width={200}
                        cellRenderer={(props) => {
                          const { dataKey, rowData } = props;
                          return rowData[dataKey];
                        }}
                      />
                      <Column
                        dataKey="accountName"
                        headerRenderer={() => {
                          return <div>Description</div>;
                        }}
                        width={400}
                        flexGrow={1}
                        cellRenderer={(props) => {
                          const { dataKey, rowData } = props;
                          return rowData[dataKey];
                        }}
                      />
                    </VirtualTable>
                  )}
                </AutoSizer>
              </div>
            </Spin>
          </Col>
        </Row>
        <Divider plain>Selected Accounts</Divider>
        <Row>
          <Col span={24}>
            <Table
              rowKey="code"
              size="small"
              columns={columns}
              dataSource={
                Object.values(selectedCoa) as ChartOfAccountGenerate[]
              }
              pagination={{
                pageSize: 4,
                showSizeChanger: false,
              }}
            />
          </Col>
        </Row>
      </Form>
    </FullScreenModal>
  );
}
