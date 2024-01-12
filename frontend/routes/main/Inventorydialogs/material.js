import React, { useState, useContext } from "react";
import { Col, Row, Button, Table, Input } from "antd";
import { AccountContext } from "../../../app/components/accessControl/AccountContext";
import CModal from "../../../app/components/common/CModal";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import numeral from "numeral";
import { createMPObj } from "../../../shared/constant";
import DescLong from "../../../app/components/common/DescLong";

const { Search } = Input;

const GET_RECORDS = gql`
  query ($filter: String, $office: UUID, $page: Int, $size: Int) {
    output: inventoryOutputPageable(
      filter: $filter
      office: $office
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
          unit_of_usage {
            id
            unitDescription
          }
          production
          isMedicine
          vatable
          fixAsset
          consignment
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
    source: inventorySourcePageable(
      filter: $filter
      office: $office
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
          unit_of_usage {
            id
            unitDescription
          }
          production
          isMedicine
          vatable
          fixAsset
          consignment
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

const MaterialItems = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 7,
  });
  const [selected, setSelected] = useState([]);

  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      office: account?.office?.id,
      page: state.page,
      size: state.size,
    },
  });

  //======================= =================== =================================================//

  const onSubmit = (e) => {
    let forSubmit = [];
    if (!_.isEmpty(e)) {
      e.map((record) => {
        let obj = createMPObj(
          record,
          props?.type,
          props?.type === "output" ? record?.unitCost : record?.wcost
        );
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
      render: (text, record) => (
        <DescLong descripton={text} record={record.item} />
      ),
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
            dataSource={
              props?.type === "source"
                ? _.get(data, "source.content")
                : _.get(data, "output.content")
            }
            rowKey={(record) => record.id}
            rowSelection={{
              ...rowSelection,
            }}
            size="small"
            pagination={{
              pageSize:
                props?.type === "source"
                  ? _.get(data, "source.size", 0)
                  : _.get(data, "output.size", 0),
              total:
                props?.type === "source"
                  ? _.get(data, "source.totalElements", 0)
                  : _.get(data, "output.totalElements", 0),
              defaultCurrent:
                props?.type === "source"
                  ? _.get(data, "source.number", 0) + 1
                  : _.get(data, "output.number", 0) + 1,
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

export default MaterialItems;
