import React, { useState, useContext } from "react";
import { AccountContext } from "../../../app/components/accessControl/AccountContext";
import {
  Col,
  Row,
  Button,
  Table,
  Input,
  Form,
  message,
  Alert,
  Card,
} from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormBtnSubmit from "../../../util/customForms/formBtnSubmit";
import CModal from "../../../app/components/common/CModal";
import ColTitlePopUp from "../../../app/components/common/ColTitlePopUp";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2, col3 } from "../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";

const GET_RECORDS = gql`
  query (
    $filter: String
    $groupId: UUID
    $category: [UUID]
    $page: Int
    $size: Int
  ) {
    list: inventoryListPageable(
      filter: $filter
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
        brand
        onHand
        outputTax
        govOutputTax
        sellingPrice
        govPrice
        wcost: last_wcost
      }
      size
      totalElements
      number
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation (
    $items: [Map_String_ObjectScalar]
    $billing: UUID
    $type: String
    $office: UUID
  ) {
    upsert: addItems(
      items: $items
      billing: $billing
      type: $type
      office: $office
    ) {
      id
    }
  }
`;

const { Search } = Input;
const AddItemForm = ({ visible, hide, ...props }) => {
  const account = useContext(AccountContext);
  const [formError, setFormError] = useState({});
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 3,
  });
  const [form] = Form.useForm();
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      filter: state.filter,
      groupId: null,
      category: [],
      page: state.page,
      size: state.size,
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          hide("Items added to bill");
        }
      },
    }
  );
  //======================= =================== =================================================//

  const pushToBill = () => {
    upsertRecord({
      variables: {
        items: items,
        billing: props?.id,
        type: props?.transType,
        office: account?.office?.id,
      },
    });
  };

  const onSubmit = () => {
    const { setFieldsValue } = form;

    let payload = _.clone(items);
    if (!_.isEmpty(selected)) {
      payload.push(selected);
    } else {
      message.error("Nothing to Add");
    }

    setItems(payload);
    setSelected({});
    setFieldsValue({ ["description"]: null });
    setFieldsValue({ ["brand"]: null });
    setFieldsValue({ ["qty"]: 0 });
    setFieldsValue({ ["price"]: 0 });
    setFieldsValue({ ["subtotal"]: 0 });
  };

  const onSelectItem = (data) => {
    const { setFieldsValue } = form;
    let price = props.isGovernment
      ? _.round(data?.govPrice, 2)
      : _.round(data?.sellingPrice, 2);

    let tax = props.isGovernment
      ? _.round(data?.govOutputTax, 2)
      : _.round(data?.outputTax, 2);

    let x = {
      id: data.id,
      item: {
        id: data.item?.id,
        sku: data.item?.sku,
        descLong: data?.descLong,
        brand: data?.brand,
      },
      description: data.item?.descLong,
      qty: 1,
      amount: price,
      subTotal: price,
      outputTax: tax,
      wcost: data?.wcost,
    };
    setFieldsValue({ ["description"]: data?.descLong });
    setFieldsValue({ ["brand"]: data?.brand });
    setFieldsValue({ ["qty"]: 1 });
    setFieldsValue({ ["price"]: price });
    setFieldsValue({ ["subtotal"]: price });

    setSelected(x);
  };

  const onChangeQty = (value) => {
    const { setFieldsValue, getFieldValue } = form;
    let sub = getFieldValue("price");
    setSelected({ ...selected, qty: value, subTotal: value * sub });
    setFieldsValue({ ["subtotal"]: value * sub });
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
    },
    {
      title: <ColTitlePopUp descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "item",
      key: "item",
      render: (text, record) => (
        <span key={text}>{record?.item?.unit_of_usage?.unitDescription}</span>
      ),
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
    {
      title: "Price",
      key: "price",
      align: "right",
      render: (desc, rec) => (
        <span key={desc}>
          {props.isGovernment
            ? numeral(rec.govPrice).format("0,0.00")
            : numeral(rec.sellingPrice).format("0,0.00")}
        </span>
      ),
    },
    {
      title: "#",
      key: "action",
      align: "right",
      render: (desc, rec) => (
        <Button type="danger" size="small" onClick={() => onSelectItem(rec)}>
          Select
        </Button>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Price",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span>{numeral(amount).format("0,0.00")}</span>,
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (subTotal) => <span>{numeral(subTotal).format("0,0.00")}</span>,
    },
  ];

  return (
    <CModal
      allowFullScreen={true}
      title={"Add Items/Parts Inventory"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={upsertLoading}
          disabled={_.isEmpty(items)}
          onClick={pushToBill}
        >
          Push To Bill
        </Button>,
      ]}
    >
      <Row>
        <Col span={24}>
          {props.isGovernment && (
            <Alert
              message="Customer is Government Entity/Agency (All Prices are updated)"
              type="warning"
              showIcon
            />
          )}
          <Search
            placeholder="Search Items"
            onSearch={(e) => setState({ ...state, filter: e, page: 0 })}
            enterButton
          />
          <Table
            loading={loading}
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
        <Col {...col2}>
          <MyForm
            form={form}
            name="selectedForm"
            id="selectedForm"
            error={formError}
            onFinish={onSubmit}
            className="form-card"
          >
            <Card>
              <Row>
                <Col {...col2}>
                  <FormInput
                    description={"Description"}
                    name="description"
                    placeholder="Description"
                    disabled
                  />
                </Col>
                <Col {...col2}>
                  <FormInput
                    description={"Brand"}
                    name="brand"
                    placeholder="Brand"
                    disabled
                  />
                </Col>
                <Col {...col3}>
                  <FormInput
                    description={"Quantity"}
                    name="qty"
                    type="number"
                    formatter={(value) =>
                      value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={(e) => {
                      onChangeQty(e);
                    }}
                    disabled={_.isEmpty(selected)}
                    placeholder="Quantity"
                  />
                </Col>
                <Col {...col3}>
                  <FormInput
                    description={"Price"}
                    name="price"
                    formatter={(value) =>
                      value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    placeholder="Price"
                    disabled
                  />
                </Col>
                <Col {...col3}>
                  <FormInput
                    description={"Sub Total"}
                    name="subtotal"
                    formatter={(value) =>
                      value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    placeholder="Sub Total"
                    disabled
                  />
                </Col>
                <Col span={24}>
                  <FormBtnSubmit
                    type="primary"
                    block
                    id="app.form.addtoCache"
                  />
                </Col>
              </Row>
            </Card>
          </MyForm>
        </Col>
        <Col {...col2}>
          <Table
            columns={columns2}
            size="small"
            dataSource={items}
            pagination={false}
            rowKey={(row) => row.id}
          />
        </Col>
      </Row>
    </CModal>
  );
};

export default AddItemForm;
