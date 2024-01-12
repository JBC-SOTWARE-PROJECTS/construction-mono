import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Input,
  InputNumber,
  message,
  Divider,
  Modal,
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { col4, col18 } from "../../../shared/constant";
import FilterSelect from "../../../util/customForms/filterSelect";
import numeral from "numeral";

const { Search } = Input;
const { confirm } = Modal;

//graphQL Queries
const GET_RECORDS = gql`
  query (
    $filter: String
    $office: UUID
    $groupId: UUID
    $category: [UUID]
    $brand: String
    $page: Int
    $size: Int
  ) {
    list: inventoryListPageableByDep(
      filter: $filter
      office: $office
      group: $groupId
      category: $category
      brand: $brand
      page: $page
      size: $size
    ) {
      content {
        id
        sku
        descLong
        item {
          id
          descLong
          item_category {
            id
            categoryDescription
          }
        }
        unitCost: lastUnitCost
        actualCost
        markup
        sellingPrice
        outputTax
      }
      size
      totalElements
      number
    }
    offices: activeOffices {
      value: id
      label: officeDescription
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID) {
    upsert: applyDefaultsPrice(office: $id) {
      id
    }
  }
`;

const UPSERT_PRICES = gql`
  mutation ($el: String, $value: BigDecimal, $id: UUID) {
    upsert: updatePrices(el: $el, value: $value, id: $id) {
      id
    }
  }
`;

const MarkupContent = ({ account }) => {
  const [office, setOffice] = useState(account?.office?.id);
  const [editable, setEditable] = useState({});
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 20,
  });
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      office: office,
      groupId: null,
      brand: null,
      category: [],
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "network-only",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Markup Successfully Setup");
          refetch();
        }
      },
    }
  );

  const [upsertPrice, { loading: upsertPriceLoading }] = useMutation(
    UPSERT_PRICES,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Item Price Updated");
          refetch();
        }
      },
    }
  );

  const onDefault = () => {
    confirm({
      title: `Are you sure you want to Setup Markup Defaults?`,
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        upsertRecord({
          variables: {
            id: office,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onChangeArray = (element, record, newValue) => {
    upsertPrice({
      variables: {
        el: element,
        value: parseFloat(newValue),
        id: record?.id,
      },
    });
  };

  const colInput = (record, el) => {
    return (
      <InputNumber
        defaultValue={record[el]}
        size="small"
        autoFocus
        onBlur={(e) => {
          let newValue = e?.target?.value;
          onChangeArray(el, record, newValue);
          setEditable({ ...editable, [record.id + el]: false });
        }}
        style={{ width: 150 }}
      />
    );
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
    },
    {
      title: "Category",
      dataIndex: "categoryDescription",
      key: "categoryDescription",
      render: (text, record) => (
        <span key={text}>
          {record?.item?.item_category?.categoryDescription}
        </span>
      ),
    },
    {
      title: "Last Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
      align: "right",
      render: (unitCost) => <span>{numeral(unitCost).format("0,0.00")}</span>,
    },
    {
      title: <ColTitlePopUp descripton="Actual Unit Cost" editable={true} />,
      dataIndex: "actualCost",
      key: "actualCost",
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (_.indexOf(account?.user?.access, "price_control") > -1) {
              setEditable({ ...editable, [e.id + "actualCost"]: true });
            } else {
              message.error("Permission Denied. Please contact administrator");
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "actualCost"] ? (
          colInput(record, "actualCost")
        ) : (
          <span key={text}>{numeral(record.actualCost).format("0,0.00")}</span>
        );
      },
    },
    {
      title: "Markup (%)",
      dataIndex: "markup",
      key: "markup",
      align: "right",
      render: (markup) => <span>{numeral(markup).format("0,0.00") + "%"}</span>,
    },
    {
      title: (
        <ColTitlePopUp descripton="Selling Price (w/ VAT)" editable={true} />
      ),
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (_.indexOf(account?.user?.access, "price_control") > -1) {
              setEditable({ ...editable, [e.id + "sellingPrice"]: true });
            } else {
              message.error("Permission Denied. Please contact administrator");
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id + "sellingPrice"] ? (
          colInput(record, "sellingPrice")
        ) : (
          <span key={text}>
            {numeral(record.sellingPrice).format("0,0.00")}
          </span>
        );
      },
    },
    // {
    //   title: "Government Price",
    //   dataIndex: "govPrice",
    //   key: "govPrice",
    //   align: "right",
    //   render: (govPrice) => <span>{numeral(govPrice).format("0,0.00")}</span>,
    // },
  ];

  return (
    <Card
      title="Price and Markup Control"
      size="small"
      extra={
        <span>
          <Button
            size="small"
            type="primary"
            icon={<CheckCircleOutlined />}
            className="margin-0"
            onClick={onDefault}
            loading={upsertLoading}
            disabled={_.indexOf(account?.user?.access, "price_control") <= -1}
          >
            Apply Default Markup
          </Button>
        </span>
      }
    >
      <Row>
        <Col {...col18}>
          <Search
            placeholder="Search Items"
            onSearch={(e) => setState({ ...state, filter: e })}
            enterButton
          />
        </Col>
        <Col {...col4}>
          <FilterSelect
            allowClear
            defaultValue={account?.office?.id}
            loading={loading}
            field="office"
            placeholder="Filter By Office"
            onChange={(e) => {
              setOffice(e);
            }}
            list={_.get(data, "offices")}
          />
        </Col>
        <Col span={24}>
          <Divider />
          <Table
            loading={loading || upsertPriceLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "list.content", [])}
            rowKey={(record) => record.id}
            size="small"
            pagination={{
              pageSize: _.get(data, "list.size", 0),
              total: _.get(data, "list.totalElements", 0),
              defaultCurrent: _.get(data, "list.number", 0) + 1,
              onChange: (page) => {
                setState({ ...state, page: page - 1 });
              },
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default MarkupContent;
