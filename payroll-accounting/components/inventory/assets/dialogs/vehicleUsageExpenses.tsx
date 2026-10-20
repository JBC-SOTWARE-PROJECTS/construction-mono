import { FormDebounceSelect, FormInput, FormInputNumber, FormSelect } from "@/components/common";
import {
  GET_VEHICLE_USAGE_EXPENSES,
  VEHICLE_USAGE_EXPENSE_ITEM_OPTIONS,
} from "@/graphql/assets/queries";
import { requiredField } from "@/utility/helper";
import { useQuery } from "@apollo/client";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Form, FormInstance, Row, Spin } from "antd";
import React, { useEffect } from "react";

interface VehicleUsageExpenseItem {
  id: string;
  descLong: string;
}

interface VehicleUsageExpense {
  id: string;
  expenseType: "ITEM" | "SERVICE" | "CUSTOM";
  particulars: string;
  quantity?: number | null;
  amount: number;
  item?: VehicleUsageExpenseItem | null;
}

interface VehicleUsageExpensesProps {
  form: FormInstance;
  usageID?: string | null;
  viewMode: boolean;
  onDelete: (id: string) => void;
}

const expenseTypeOptions = [
  { value: "ITEM", label: "Item" },
  { value: "SERVICE", label: "Service" },
  { value: "CUSTOM", label: "Custom" },
];

export default function VehicleUsageExpenses({
  form,
  usageID,
  viewMode,
  onDelete,
}: VehicleUsageExpensesProps) {
  const { data, loading } = useQuery(GET_VEHICLE_USAGE_EXPENSES, {
    variables: { usageID },
    skip: !usageID,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!usageID) {
      form.setFieldValue("expenses", []);
      return;
    }

    if (data?.vehicleUsageExpenses) {
      form.setFieldValue(
        "expenses",
        data.vehicleUsageExpenses.map((expense: VehicleUsageExpense) => ({
          id: expense.id,
          expenseType: expense.expenseType,
          particulars: expense.particulars,
          quantity: expense.quantity,
          amount: expense.amount,
          item: expense.item
            ? { value: expense.item.id, label: expense.item.descLong }
            : null,
        }))
      );
    }
  }, [data, form, usageID]);

  if (loading) {
    return <Spin />;
  }

  return (
    <Form.List name="expenses">
      {(fields, { add, remove }) => (
        <>
          {fields.length === 0 && viewMode ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No expenses" />
          ) : null}

          {fields.map(({ key, name, ...restField }, index) => (
            <Row key={key} gutter={[8, 0]} align="middle">
              <Form.Item {...restField} name={[name, "id"]} hidden>
                <input />
              </Form.Item>

              <Col xs={24} md={5}>
                <FormSelect
                  {...restField}
                  name={[name, "expenseType"]}
                  label={index === 0 ? "Type" : undefined}
                  rules={requiredField}
                  propsselect={{
                    options: expenseTypeOptions,
                    placeholder: "Select type",
                    onChange: () => {
                      form.setFieldValue(["expenses", name, "item"], null);
                      form.setFieldValue(["expenses", name, "particulars"], null);
                    },
                  }}
                />
              </Col>

              <Col xs={24} md={9}>
                <Form.Item
                  noStyle
                  shouldUpdate={(previous, current) =>
                    previous.expenses?.[name]?.expenseType !==
                    current.expenses?.[name]?.expenseType
                  }
                >
                  {() =>
                    form.getFieldValue(["expenses", name, "expenseType"]) === "ITEM" ? (
                      <FormDebounceSelect
                        {...restField}
                        name={[name, "item"]}
                        label={index === 0 ? "Particulars" : undefined}
                        rules={requiredField}
                        propsselect={{
                          fetchOptions: VEHICLE_USAGE_EXPENSE_ITEM_OPTIONS,
                          allowClear: true,
                          placeholder: "Select inventory item",
                        }}
                      />
                    ) : (
                      <FormInput
                        {...restField}
                        name={[name, "particulars"]}
                        label={index === 0 ? "Particulars" : undefined}
                        rules={requiredField}
                        propsinput={{ placeholder: "Enter particulars" }}
                      />
                    )
                  }
                </Form.Item>
              </Col>

              <Col xs={12} md={4}>
                <FormInputNumber
                  {...restField}
                  name={[name, "quantity"]}
                  label={index === 0 ? "Quantity" : undefined}
                  propsinputnumber={{ min: 0, placeholder: "Optional" }}
                />
              </Col>

              <Col xs={12} md={4}>
                <FormInputNumber
                  {...restField}
                  name={[name, "amount"]}
                  label={index === 0 ? "Amount" : undefined}
                  rules={requiredField}
                  propsinputnumber={{ min: 0, precision: 2, placeholder: "0.00" }}
                />
              </Col>

              {!viewMode ? (
                <Col xs={24} md={2}>
                  <Button
                    danger
                    type="text"
                    aria-label={`Remove expense ${index + 1}`}
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const expenseId = form.getFieldValue(["expenses", name, "id"]);
                      if (expenseId) onDelete(expenseId);
                      remove(name);
                    }}
                  />
                </Col>
              ) : null}
            </Row>
          ))}

          {!viewMode ? (
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() => add({ expenseType: "ITEM" })}
            >
              Add Expense
            </Button>
          ) : null}
        </>
      )}
    </Form.List>
  );
}
