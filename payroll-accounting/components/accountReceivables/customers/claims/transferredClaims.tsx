import { FormInput, FormSelect } from "@/components/common";
import { GuarantorBillingItemSearchFilter } from "@/constant/accountReceivables";
import { FIND_ALL_CREDIT_NOTE_ITEMS_BY_RECIPIENT_CUSTOMER } from "@/graphql/accountReceivables/creditNote";
import { ADD_INVOICE_CLAIMS_ITEMS } from "@/graphql/accountReceivables/invoices";
import { BillingItem } from "@/graphql/gql/graphql";
import {
  CaretDownOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, Pagination, Space, Table, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import numeral from "numeral";
import React from "react";

interface ExtendedBillingItem extends BillingItem {
  amount: number;
}

interface GuarantorClaimsParams {
  filter: string;
  filterType: string;
  billingItemType: string[];
  patientId?: string;
  customerId: string;
  admissionDate?: any[];
  dischargedDate?: any[];
  billingId?: string;
  page: number;
  size: number;
}

const TransferredClaims = (props: {
  invoiceId: string;
  customerId: string;
  invoiceReturn: { id: string };
  setInvoiceReturn: any;
}) => {
  const { message } = App.useApp();
  const { customerId, invoiceReturn, setInvoiceReturn } = props;

  const [form] = Form.useForm();

  const { loading, data, refetch, fetchMore } = useQuery(
    FIND_ALL_CREDIT_NOTE_ITEMS_BY_RECIPIENT_CUSTOMER,
    {
      variables: {
        search: "",
        arCustomerId: customerId,
        itemType: ["TRANSFER-FINANCIAL-ASSISTANCE", "TRANSFER-ERRONEOUS"],
        page: 0,
        size: 10,
      },
    }
  );
  const { dataSource, totalElements, number } = data?.creditNoteItems || {
    dataSource: [],
    totalPages: 0,
    number: 0,
  };

  const [onInsertClaims, { loading: loadingInsert }] = useMutation(
    ADD_INVOICE_CLAIMS_ITEMS,
    {
      onCompleted: ({ addInvoiceClaimsItem }) => {
        const {
          response,
          message: messageText,
          success,
        } = addInvoiceClaimsItem;
        if (!success) message.error(messageText);

        if (!invoiceReturn?.id && success)
          setInvoiceReturn({
            id: response?.arInvoice?.id,
          });

        refetch();
      },
    }
  );

  const onHandleAddItem = (billingItemId: string) => {
    onInsertClaims({
      variables: {
        billingItemId,
        customerId,
        invoiceId: invoiceReturn?.id,
      },
    });
  };

  const columns: ColumnsType<ExtendedBillingItem> = [
    {
      title: "Record No",
      dataIndex: "recordNo",
      width: 40,
      align: "center",
      fixed: "left",
    },
    {
      title: "Patient",
      dataIndex: "itemName",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "totalAmountDue",
      align: "right",
      fixed: "right",
      width: 100,
      render: (text) => numeral(text).format("0,0.00"),
    },
    {
      title: " ",
      dataIndex: "id",
      align: "center",
      fixed: "right",
      width: 40,
      render: (text) => (
        <Button
          type="link"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={(e) => onHandleAddItem(text)}
        />
      ),
    },
  ];

  const handleLoadMore = (page: number) => {
    fetchMore({
      variables: { page: page - 1 }, // Calculate the new offset
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;

        return {
          billingItem: {
            ...prevResult.billingItem,
            ...fetchMoreResult.billingItem,
          },
        };
      },
    });
  };

  const onHandleSearchInput = () => {
    const { search } = form.getFieldsValue();
    refetch({
      search,
    });
  };

  const selectAfter = (
    <FormSelect
      name={"filterType"}
      style={{ width: 200, marginBottom: 0 }}
      propsselect={{
        options: GuarantorBillingItemSearchFilter,
        size: "large",
        suffixIcon: <CaretDownOutlined />,
      }}
    />
  );

  return (
    <ProCard split={"horizontal"}>
      <ProCard
        extra={
          <Space>
            <Form
              form={form}
              layout="vertical"
              name="transferFilterForm"
              initialValues={{ filterType: "FOLIO_NO" }}>
              <FormInput
                name="filter"
                propsinput={{
                  addonAfter: selectAfter,
                  defaultValue: "",
                  prefix: <SearchOutlined />,
                  size: "large",
                  allowClear: true,
                  onPressEnter: () => onHandleSearchInput(),
                }}
              />
            </Form>
          </Space>
        }>
        <Table
          rowKey="id"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          size="small"
          scroll={{ x: 1500 }}
          pagination={false}
          footer={() => (
            <Pagination
              pageSize={10}
              responsive={true}
              showSizeChanger={false}
              current={number + 1}
              total={totalElements}
              onChange={(page) => handleLoadMore(page)}
            />
          )}
        />
      </ProCard>
    </ProCard>
  );
};

export default TransferredClaims;
