import React, { useState } from "react";
import { Col, Row, Button, Table, Input } from "antd";
import CModal from "../../../app/components/common/CModal";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import numeral from "numeral";
import { createObj } from "../../../shared/constant";

const { Search } = Input;

const GET_RECORDS = gql`
  query (
    $filter: String
    $office: UUID
    $groupId: UUID
    $category: [UUID]
    $page: Int
    $size: Int
  ) {
    list: inventoryListPageableByDep(
      filter: $filter
      office: $office
      group: $groupId
      category: $category
      page: $page
      size: $size
    ) {
      content {
        id
        sku
        item {
          id
          descLong
          item_conversion
          vatable
          unit_of_usage {
            id
            unitDescription
          }
        }
        descLong
        unitMeasurement
        brand
        onHand
        wcost: last_wcost
        unitCost: lastUnitCost
      }
      size
      totalElements
      number
    }
  }
`;

const InventoryByOfficeIdModal = ({ visible, hide, ...props }) => {
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 7,
  });
  const [selected, setSelected] = useState([]);

  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      office: props?.officeId,
      groupId: null,
      category: [],
      page: state.page,
      size: state.size,
    },
  });

  //======================= =================== =================================================//

  const onSubmit = (e) => {
    let forSubmit = [];
    if (!_.isEmpty(e)) {
      e.map((record) => {
        let obj = createObj(record, props?.type);
        forSubmit.push(obj);
      });
      if (forSubmit) {
        hide(forSubmit);
      }
    }
  };

  const forChecking = (id) => {
    let payload = _.clone(props?.items);
    let index = _.findIndex(payload, ["item.id", id]);
    if (index < 0) {
      return false;
    } else {
      return true;
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelected(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: forChecking(record?.item?.id),
      // Column configuration not to be checked
      name: record.descLong,
    }),
  };

  const columns = [
    {
      title: "SKU/Barcode",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Unit of Measurement (UoP/UoU)"
          popup="Unit of Purchase/Unit of Usage"
        />
      ),
      dataIndex: "unitMeasurement",
      key: "unitMeasurement",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: (
        <ColTitlePopUp descripton="On Hand Qty (UoU)" popup="Unit of Usage" />
      ),
      dataIndex: "onHand",
      key: "onHand",
      align: "right",
      render: (onHand) => <span>{numeral(onHand).format("0,0")}</span>,
    },
  ];

  return (
    <CModal
      width={"70%"}
      title={"Inventory List"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button key="submit" type="primary" onClick={() => onSubmit(selected)}>
          Submit
        </Button>,
      ]}
    >
      <Row>
        <Col span={24}>
          <Search
            placeholder="Search Items"
            onSearch={(e) => setState({ ...state, filter: e, page: 0 })}
            enterButton
          />
        </Col>
        <Col span={24}>
          <Table
            loading={loading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={_.get(data, "list.content", [])}
            rowKey={(record) => record.id}
            rowSelection={{
              ...rowSelection,
            }}
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
    </CModal>
  );
};

export default InventoryByOfficeIdModal;