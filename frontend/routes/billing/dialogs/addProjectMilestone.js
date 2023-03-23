import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  Divider,
  Table,
  InputNumber,
  Statistic,
  message,
} from "antd";
import { DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import CModal from "../../../app/components/common/CModal";
import _ from "lodash";
import InventoryByOfficeModal from "../../main/Inventorydialogs/inventory";
import { dialogHook } from "../../../util/customhooks";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import numeral from "numeral";
import update from "immutability-helper";

const ProjectMilestone = ({ visible, hide, parent, project, ...props }) => {
  const [items, setItems] = useState([]);
  const [editable, setEditable] = useState({});

  const onSubmit = (data) => {
    console.log("data => ", data);
  };

  const [modal, showModal] = dialogHook(InventoryByOfficeModal, (result) => {
    // item form
    if (!_.isEmpty(result)) {
      // validate here
      console.log(result);
      if (_.isEmpty(items)) {
        setItems(result);
      } else {
        //append
        setItems([...items, ...result]);
      }
    }
  });

  const onChangeArray = (element, record, newValue) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        [element]: {
          $set: newValue || 0,
        },
        subTotal: {
          $set: newValue * record.cost,
        },
      },
    });
    setItems(data);
  };

  const _delete = (record) => {
    let payload = _.clone(items);
    //delete in array
    _.remove(payload, function (n) {
      return n.id === record.id;
    });
    setItems(payload);
    message.success("Item removed");
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      width: 700,
      render: (text, record) => (
        <span key={text}>{record?.item?.descLong}</span>
      ),
    },
    {
      title: <ColTitlePopUp descripton="Qty (Unit)" editable={true} />,
      dataIndex: "qty",
      key: "qty",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            setEditable({ ...editable, [e.id + "qty"]: true });
          },
        };
      },
      render: (text, record) => {
        return editable[record.id + "qty"] ? (
          <InputNumber
            defaultValue={record.qty}
            autoFocus
            onBlur={(e) => {
              let newValue = e?.target?.value;
              onChangeArray("qty", record, newValue);
              setEditable({ ...editable, [record.id + "qty"]: false });
            }}
            style={{ width: 150 }}
          />
        ) : (
          <span key={text}>{`${numeral(record.qty).format("0,0")} [${
            record.uou
          }]`}</span>
        );
      },
    },
    {
      title: "Unit Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => <span>{numeral(cost).format("0,0.00")}</span>,
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (text, record) => (
        <span>{numeral(record.subTotal).format("0,0.00")}</span>
      ),
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          key={text}
          type="danger"
          size="small"
          onClick={() => {
            _delete(record);
          }}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  return (
    <CModal
      allowFullScreen={true}
      title={"Add Materials Used"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="projectForm"
          key="submit"
          onClick={onSubmit}
          type="primary"
          // loading={upsertLoading}
          disabled={props.billed}
        >
          Submit
        </Button>,
      ]}
    >
      <Row>
        <Col span={24}>
          <Divider>Item/Materials Used</Divider>
          <div className="flex-box-wrap">
            <Statistic
              title="Total Materials (Php)"
              valueStyle={{ color: "#cf1322" }}
              value={_.sumBy(items, "subTotal", 0)}
              precision={2}
            />
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              size="small"
              onClick={() => {
                showModal({ show: true, myProps: { type: "PROJECT" } });
              }}
              // disabled={props?.billed || props?.completed}
            >
              Add Materials/Item
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <Table
            // loading={loading || removeLoading}
            className="gx-table-responsive"
            columns={columns}
            dataSource={items}
            rowKey={(record) => record.id}
            size="small"
            pagination={{
              pageSize: 10,
            }}
          />
        </Col>
      </Row>
      {modal}
    </CModal>
  );
};

export default ProjectMilestone;
