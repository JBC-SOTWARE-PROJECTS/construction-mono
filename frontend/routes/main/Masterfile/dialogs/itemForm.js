import React, { useState } from "react";
import { Col, Row, Button, Divider, Form, Skeleton, message } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import FormCheckbox from "../../../../util/customForms/formCheckbox";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col4, col3 } from "../../../../shared/constant";
import _ from "lodash";

const GET_RECORDS = gql`
  {
    uop: uopList {
      value: id
      label: unitDescription
    }
    uou: uouList {
      value: id
      label: unitDescription
    }
    gen: genericActive {
      value: id
      label: genericDescription
    }
    brands: getBrands {
      value: brand
    }
  }
`;

const GET_GROUP_CAT = gql`
  query ($groupId: UUID) {
    groups: itemGroupActive {
      value: id
      label: itemDescription
    }
    categories: itemCategoryActive(id: $groupId) {
      value: id
      label: categoryDescription
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertItem(id: $id, fields: $fields) {
      payload
      success
      message
    }
  }
`;

const ItemForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [groupId, setGroupId] = useState(props?.item_group?.id || null);

  const { loading, data } = useQuery(GET_RECORDS);

  const { loading: loadingGrCat, data: grCatData } = useQuery(GET_GROUP_CAT, {
    variables: {
      groupId: groupId,
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsert?.success) {
          if (props?.id) {
            hide("item Information Updated");
          } else {
            hide("item Information Added");
          }
        } else {
          setFormError({
            errorTitle: "Form Validation Errors",
            errorMsg: data?.upsert?.message,
          });
          message.error(data?.upsert?.message);
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.descLong = _.trim(data?.descLong);
    payload.active = data.active || false;
    payload.brand = data.brand || "";
    payload.isMedicine = data.isMedicine || false;
    payload.vatable = data.vatable || false;
    payload.discountable = data.discountable || false;
    payload.production = data.production || false;
    payload.consignment = data.consignment || false;
    payload.item_group = { id: data.item_group };
    payload.item_category = { id: data.item_category };
    payload.unit_of_purchase = { id: data.unit_of_purchase };
    payload.unit_of_usage = { id: data.unit_of_usage };
    payload.item_generics = { id: data.item_generics };

    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    });
  };

  return (
    <CModal
      width={"65%"}
      title={"Item Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="itemForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        name="itemForm"
        id="itemForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        {loading ? (
          <Skeleton active />
        ) : (
          <Row>
            <Col {...col4}>
              <FormInput
                description={"SKU/Barcode"}
                rules={[{ required: true, message: "This Field is required" }]}
                name="sku"
                initialValue={props?.sku}
                placeholder="SKU/Barcode"
              />
            </Col>
            <Col {...col4}>
              <FormInput
                description={"Stock Code"}
                name="itemCode"
                rules={[{ required: true, message: "This Field is required" }]}
                initialValue={props?.itemCode}
                placeholder="Stock Code"
              />
            </Col>
            <Col {...col4}>
              <FormSelect
                description={"Item Group"}
                loading={loadingGrCat}
                initialValue={props?.item_group?.id}
                name="item_group"
                field="item_group"
                placeholder="Item Group"
                rules={[{ required: true, message: "This Field is required" }]}
                onChange={(e) => {
                  setGroupId(e);
                }}
                list={_.get(grCatData, "groups")}
              />
            </Col>
            <Col {...col4}>
              <FormSelect
                description={"Item Category"}
                loading={loadingGrCat}
                initialValue={props?.item_category?.id}
                rules={[{ required: true, message: "This Field is required" }]}
                name="item_category"
                field="item_category"
                placeholder="Item Category"
                list={_.get(grCatData, "categories")}
              />
            </Col>
            {/*  */}
            <Col span={24}>
              <FormInput
                description={"Item Description"}
                name="descLong"
                rules={[{ required: true, message: "This Field is required" }]}
                initialValue={props?.descLong}
                placeholder="Item Description"
              />
            </Col>
            {/*  */}
            <Col {...col3}>
              <FormInput
                description={"Item Brand"}
                name="brand"
                type="autocomplete"
                options={_.get(data, "brands")}
                initialValue={props?.brand}
                placeholder="Item Brand"
              />
            </Col>
            <Col {...col3}>
              <FormSelect
                description={"Unit of Purchase"}
                rules={[{ required: true, message: "This Field is required" }]}
                loading={loading}
                initialValue={props?.unit_of_purchase?.id}
                name="unit_of_purchase"
                field="unit_of_purchase"
                placeholder="Unit of Purchase"
                list={_.get(data, "uop")}
              />
            </Col>
            <Col {...col3}>
              <FormSelect
                description={"Unit of Usage"}
                rules={[{ required: true, message: "This Field is required" }]}
                loading={loading}
                initialValue={props?.unit_of_usage?.id}
                name="unit_of_usage"
                field="unit_of_usage"
                placeholder="Unit of Usage"
                list={_.get(data, "uou")}
              />
            </Col>
            {/*  */}
            <Col span={24}>
              <FormSelect
                description={"Generic Name"}
                initialValue={props?.item_generics?.id}
                rules={[{ required: true, message: "This Field is required" }]}
                name="item_generics"
                field="item_generics"
                placeholder="Generic Name"
                list={_.get(data, "gen")}
              />
            </Col>
            {/*  */}
            <Col {...col3}>
              <FormInput
                description={"Conversion"}
                rules={[{ required: true, message: "This Field is required" }]}
                name="item_conversion"
                type="number"
                initialValue={props?.item_conversion}
                placeholder="Conversion"
              />
            </Col>
            <Col {...col3}>
              <FormInput
                description={"Maximum Inventory"}
                name="item_maximum"
                type="number"
                initialValue={props?.item_maximum}
                placeholder="Maximum Inventory"
              />
            </Col>
            <Col {...col3}>
              <FormInput
                description={"Demand Qty/Month"}
                name="item_demand_qty"
                type="number"
                initialValue={props?.item_demand_qty}
                placeholder="Demand Qty/Month"
              />
            </Col>
            {/*  */}
            <Col span={24}>
              <Divider>Other Configuration</Divider>
            </Col>
            <Col {...col4}>
              <FormCheckbox
                description={"is Active ?"}
                name="active"
                valuePropName="checked"
                initialValue={props?.active}
                field="active"
              />
            </Col>
            {/* <Col {...col4}>
              <FormCheckbox
                description={"is Medicine ?"}
                name="isMedicine"
                valuePropName="checked"
                initialValue={props?.isMedicine}
                field="isMedicine"
              />
            </Col> */}
            <Col {...col4}>
              <FormCheckbox
                description={"is Vatable ?"}
                name="vatable"
                valuePropName="checked"
                initialValue={props?.vatable}
                field="vatable"
              />
            </Col>
            <Col {...col4}>
              <FormCheckbox
                description={"is Discountable ?"}
                name="discountable"
                valuePropName="checked"
                initialValue={props?.discountable}
                field="discountable"
              />
            </Col>
            <Col {...col4}>
              <FormCheckbox
                description={"for Production ?"}
                name="production"
                valuePropName="checked"
                initialValue={props?.production}
                field="production"
              />
            </Col>
            <Col {...col4}>
              <FormCheckbox
                description={"is Consignment ?"}
                name="consignment"
                valuePropName="checked"
                initialValue={props?.consignment}
                field="consignment"
              />
            </Col>
          </Row>
        )}
      </MyForm>
    </CModal>
  );
};

export default ItemForm;
