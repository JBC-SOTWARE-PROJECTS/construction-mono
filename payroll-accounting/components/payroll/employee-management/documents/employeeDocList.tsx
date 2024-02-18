import FormInput from "@/components/common/formInput/formInput";
import { IPMState } from "@/components/inventory/assets/dialogs/vehicleUsageAttachment";
import DOImageViewer from "@/components/thirdParty/doImageViewer";
import { UPSERT_EMPLOYEE_DOCS } from "@/graphql/employee/queries";
import { EmployeeDocs } from "@/graphql/gql/graphql";
import useGetEmployeeDocs from "@/hooks/employee-documents/useGetEmployeeDocs";
import { requiredField } from "@/utility/helper";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Card, Col, Form, Row } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
const { Meta } = Card;

type Props = {
  employeeId?: string;
  employeeDocs?: EmployeeDocs[];
};

export default function EmployeeDocList(props: Props) {
  const { employeeId, employeeDocs } = props;
  const [toUpdate, setToUpdate] = useState<string | null>(null);
  const [allDocs, setAllDocs] = useState<EmployeeDocs[]>([]);


  useEffect(() => {
    if (employeeDocs) {
      setAllDocs([...employeeDocs]);
    }
  }, [employeeDocs]);

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_EMPLOYEE_DOCS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          // hide(data);
          setToUpdate(null);
          const newDocs = _.map(employeeDocs, (e: EmployeeDocs) => {
            return {
              ...e,
              description: data?.id == e.id ? data?.description : e.description,
            };
          });

          setAllDocs(newDocs);
        }
      },
    }
  );

  const saveUpdate = ({ description }: EmployeeDocs) => {
    upsert({
      variables: {
        fields: {
          description: description,
        },
        id: toUpdate,
        employee: employeeId,
      },
    });
  };

  return (
    <div style={{ paddingTop: "25px" }}>
      <Row gutter={16}>
        {allDocs.map((r: EmployeeDocs, index) => (
          <Col className="gutter-row" span={6} key={index}>
            <Card
              hoverable
              style={{ marginBottom: 20 }}
              cover={
                <>
                  <DOImageViewer
                    filename={r.file ?? ""}
                    folder="EMPLOYEE_DOCUMENTS"
                    width={"100%"}
                    height={250}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </>
              }
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    toUpdate ? setToUpdate(null) : setToUpdate(r.id);
                  }}
                />,
              ]}
            >
              {toUpdate && toUpdate == r.id ? (
                <Form
                  name="updateAtt"
                  layout="vertical"
                  onFinish={saveUpdate}
                  onFinishFailed={() => {}}
                  onValuesChange={() => {}}
                >
                  <FormInput
                    name="description"
                    label="Description"
                    rules={requiredField}
                    propsinput={{
                      placeholder: "Type purpose here",
                      defaultValue: r.description ?? "",
                    }}
                  />
                  <Button
                    type="primary"
                    size="small"
                    htmlType="submit"
                    form="updateAtt"
                    // loading={upsertLoading}
                    icon={<SaveOutlined />}
                  >
                    Save
                  </Button>
                </Form>
              ) : (
                <Meta title={""} description={r.description} />
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
