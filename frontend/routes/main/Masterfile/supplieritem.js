import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Input,
  message,
  Modal,
  InputNumber,
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  PlusCircleOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { dialogHook } from "../../../util/customhooks";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import numeral from "numeral";
import AssignItemSupplierForm from "./dialogs/assignItemSupplierForm";

const { Search } = Input;
const { confirm } = Modal;

//graphQL Queries
const GET_RECORDS = gql`
  query ($id: UUID, $filter: String) {
    sup: supById(id: $id) {
      id
      supplierCode
      supplierFullname
    }
    list: allItemBySupplier(id: $id, filter: $filter) {
      id
      itemId
      item {
        id
        unit_of_usage {
          id
          unitDescription
        }
      }
      cost
      descLong
      brand
      unitMeasurement
      genericName
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $itemId: UUID
    $supId: UUID
    $id: UUID
  ) {
    upsert: upsertSupplierItem(
      fields: $fields
      itemId: $itemId
      supId: $supId
      id: $id
    ) {
      id
    }
  }
`;

const DELETE_RECORD = gql`
  mutation ($id: UUID) {
    removeItemSupplier(id: $id) {
      id
    }
  }
`;

const SupplierItemContent = ({ account, id }) => {
  const [filter, setFilter] = useState("");
  const [editable, setEditable] = useState({});
  //query
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
      filter: filter,
    },
    fetchPolicy: "network-only",
  });

  const [modal, showModal] = dialogHook(AssignItemSupplierForm, (result) => {
    if (result) {
      message.success(result);
      refetch();
    }
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          message.success("Success");
          refetch();
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data)) {
          message.success("Item removed on this supplier");
          refetch();
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onChangeUnitCost = (record, newValue) => {
    // update
    let payload = _.clone(record);
    payload.supplier = { id: id };
    payload.item = { id: record?.itemId };
    payload.cost = newValue;
    //delete
    delete payload?.itemId;
    delete payload?.descLong;
    delete payload?.brand;
    delete payload?.unitMeasurement;
    delete payload?.genericName;

    upsertRecord({
      variables: {
        fields: payload,
        itemId: payload?.item?.id,
        supId: id,
        id: record?.id,
      },
    });
  };

  const _delete = (id) => {
    confirm({
      title: "Do you want to delete these supplier?",
      icon: <ExclamationCircleOutlined />,
      content: "Please click ok to proceed.",
      onOk() {
        removeRecord({
          variables: {
            id: id,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
    },
    {
      title: "Generic Name",
      dataIndex: "genericName",
      key: "genericName",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
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
      title: (
        <ColTitlePopUp
          descripton="Unit Cost (UoU)"
          popup="Unit of Usage"
          editable={true}
        />
      ),
      dataIndex: "cost",
      key: "cost",
      onCell: (e, colIndex) => {
        return {
          onDoubleClick: (event) => {
            setEditable({ ...editable, [e.id]: true });
          }, // double click row
        };
      },
      render: (text, record) => {
        return editable[record.id] ? (
          <InputNumber
            defaultValue={record.cost}
            autoFocus
            onBlur={(e) => {
              let newValue = e?.target?.value;
              onChangeUnitCost(record, newValue);
              setEditable({ ...editable, [record.id]: false });
            }}
            style={{ width: 150 }}
          />
        ) : (
          <span>
            {numeral(record.cost).format("0,0.00") +
              " per " +
              record?.item?.unit_of_usage?.unitDescription}
          </span>
        );
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          type="danger"
          size="small"
          onClick={() => {
            _delete(record?.id);
          }}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  return (
    <div>
      <Card
        title={`Supplier Items List of [${_.get(
          data,
          "sup.supplierCode"
        )}] ${_.get(data, "sup.supplierFullname")}`}
        size="small"
        extra={
          <Button
            size="small"
            type="primary"
            icon={<PlusCircleOutlined />}
            className="margin-0"
            onClick={() => showModal({ show: true, myProps: { id: id } })}
          >
            Assign Item
          </Button>
        }
      >
        <Row>
          <Col span={24}>
            <Search
              placeholder="Search Items"
              onSearch={(e) => setFilter(e)}
              enterButton
            />
          </Col>
          <Col span={24}>
            <Table
              loading={loading || removeLoading || upsertLoading}
              className="gx-table-responsive"
              columns={columns}
              dataSource={_.get(data, "list", [])}
              rowKey={(record) => record.id}
              size="small"
            />
          </Col>
        </Row>
      </Card>
      {modal}
    </div>
  );
};

export default SupplierItemContent;
