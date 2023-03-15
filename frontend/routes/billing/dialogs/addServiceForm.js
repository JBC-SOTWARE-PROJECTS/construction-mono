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
  Tag,
} from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormBtnSubmit from "../../../util/customForms/formBtnSubmit";
import CModal from "../../../app/components/common/CModal";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2, col3 } from "../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";

const GET_RECORDS = gql`
  query ($filter: String, $office: UUID, $page: Int, $size: Int) {
    list: servicePageByOffice(
      filter: $filter
      office: $office
      page: $page
      size: $size
    ) {
      content {
        id
        code
        description
        type
        cost
        govCost
      }
      size
      totalElements
      number
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($items: [Map_String_ObjectScalar], $billing: UUID, $type: String) {
    upsert: addNewService(items: $items, billing: $billing, type: $type) {
      id
    }
  }
`;

const { Search } = Input;
const AddServiceForm = ({ visible, hide, ...props }) => {
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
      office: account?.office?.id,
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
          hide("Services added to bill");
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
    setFieldsValue({ ["code"]: null });
    setFieldsValue({ ["qty"]: 0 });
    setFieldsValue({ ["price"]: 0 });
    setFieldsValue({ ["subtotal"]: 0 });
  };

  const onSelectItem = (data) => {
    const { setFieldsValue } = form;
    let price = props.isGovernment
      ? _.round(data?.govCost, 2)
      : _.round(data?.cost, 2);
    let x = {
      id: data?.id,
      service: data?.id,
      description: data.description,
      qty: 1,
      amount: price,
      subTotal: price,
      wcost: data?.wcost,
    };
    setFieldsValue({ ["description"]: data?.description });
    setFieldsValue({ ["code"]: data?.code });
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
      title: "Service Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Service Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = type === "SINGLE" ? "green" : "blue";
        return (
          <span>
            <Tag color={color} key={color}>
              {type}
            </Tag>
          </span>
        );
      },
    },
    {
      title: "Price",
      key: "price",
      align: "right",
      render: (desc, rec) => (
        <span key={desc}>
          {props.isGovernment
            ? numeral(rec.govCost).format("0,0.00")
            : numeral(rec.cost).format("0,0.00")}
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
      title={"Add Services"}
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
                    description={"Service Code"}
                    name="code"
                    placeholder="Service Code"
                    disabled
                  />
                </Col>
                <Col {...col2}>
                  <FormInput
                    description={"Description"}
                    name="description"
                    placeholder="Description"
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

export default AddServiceForm;
