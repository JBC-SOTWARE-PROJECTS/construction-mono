import React from "react";
import SideBar from "@/components/common/sideBar/sideBar";
import { payrollConfigurations } from "@/utility/sidebar-routes";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  message,
  Row,
  Spin,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { PlusCircleOutlined } from "@ant-design/icons";
import { requiredField } from "@/utility/helper";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import { ScheduledWorkFields } from "@/utility/constant";
import {
  GET_SALARY_RATE_MULTIPLIER,
  SAVE_SALARY_RATE_MULTIPLIER,
} from "@/graphql/company/queries";
import _ from "lodash";

function SalaryRateConfig() {
  const [form] = Form.useForm();
  const { data, loading } = useQuery(GET_SALARY_RATE_MULTIPLIER, {
    onCompleted: (result) => {
      let { salarRateMultiplier } = result || {};
      form.setFieldsValue(salarRateMultiplier);
    },
  });

  const [saveSalaryRate, { loading: salaryRateLoading }] = useMutation(
    SAVE_SALARY_RATE_MULTIPLIER,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? "Salary Rate Successfully Updated");
        } else message.error(data?.message ?? "Failed to update Salary Rate");
      },
    }
  );

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
      id: data?.salarRateMultiplier?.id,
    };
    saveSalaryRate({
      variables: {
        fields: payload,
      },
    });
  };

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  return (
    <SideBar menuItems={payrollConfigurations}>
      <>
        <PageContainer title="Salary Rate Configuration">
          <ProCard
            headStyle={{
              flexWrap: "wrap",
            }}
            bordered
            headerBordered
            extra={
              <ProFormGroup>
                <Button
                  htmlType="submit"
                  form="upsertForm"
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  loading={salaryRateLoading}
                >
                  Saved Changes
                </Button>
              </ProFormGroup>
            }
          >
            <Form
              form={form}
              name="upsertForm"
              layout="vertical"
              onFinish={onSubmit}
              onFinishFailed={onFinishFailed}
            >
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Spin spinning={loading}>
                    <Card>
                      <Typography.Title level={5}>
                        Scheduled Work Multiplier
                      </Typography.Title>
                      <Divider />
                      <Row gutter={[10, 12]}>
                        {ScheduledWorkFields.map(({ title, name }) => {
                          return (
                            <>
                              <Col
                                span={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                }}
                              >
                                <Typography.Text style={{ fontSize: 16 }}>
                                  <strong>{title} :</strong>
                                </Typography.Text>
                              </Col>
                              <Col
                                span={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                }}
                              >
                                {/* TODO: make the custom input required */}
                                <FormInputNumber
                                  name={name}
                                  rules={requiredField}
                                  propsinputnumber={{
                                    placeholder: title,
                                  }}
                                />
                              </Col>
                            </>
                          );
                        })}
                      </Row>
                    </Card>
                  </Spin>
                </Col>
                <Col span={12}>
                  <Spin spinning={loading}>
                    <Card>
                      <Typography.Title level={5}>
                        Overtime Work Multiplier
                      </Typography.Title>
                      <Divider />
                      <Row gutter={[10, 12]}>
                        {ScheduledWorkFields.map(({ title, name }) => {
                          return (
                            <>
                              <Col
                                span={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                }}
                              >
                                <Typography.Text style={{ fontSize: 16 }}>
                                  <strong>{title} :</strong>
                                </Typography.Text>
                              </Col>
                              <Col
                                span={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                }}
                              >
                                <FormInputNumber
                                  name={name + "Overtime"}
                                  rules={requiredField}
                                  propsinputnumber={{
                                    placeholder: title,
                                  }}
                                />
                              </Col>
                            </>
                          );
                        })}
                      </Row>
                    </Card>
                  </Spin>
                </Col>
              </Row>
            </Form>
          </ProCard>
        </PageContainer>
      </>
    </SideBar>
  );
}

export default SalaryRateConfig;
