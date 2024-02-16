import FormInput from "@/components/common/formInput/formInput";
import { IPMState } from "@/components/inventory/assets/dialogs/vehicleUsageAttachment";
import DOImageViewer from "@/components/thirdParty/doImageViewer";
import { EmployeeDocs } from "@/graphql/gql/graphql";
import useGetEmployeeDocs from "@/hooks/employee-documents/useGetEmployeeDocs";
import { requiredField } from "@/utility/helper";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row } from "antd";
import React, { useState } from "react";
const { Meta } = Card;

type Props = {
  employeeId?: string;
};

const initialState: IPMState = {
  filter: "",
  page: 0,
  size: 10,
};

export default function EmployeeDocList(props: Props) {
  const { employeeId } = props;
  const [toUpdate, setToUpdate] = useState<string | null>(null);
  const [statePage, setState] = useState(initialState);
  const index = 1;

  const [employeeDocs, loadingEmpDocs, refetch] = useGetEmployeeDocs({
    variables: {
      ...statePage,
      employee: employeeId,
    },
    fetchPolicy: "network-only",
  });


  const saveUpdate = () => {
    const hello = "hek";
  };
  return (
    <div style={{ paddingTop: "25px" }}>
      <Row gutter={16}>
        {employeeDocs &&
          employeeDocs?.content.map((r: EmployeeDocs) => (
            <Col className="gutter-row" span={6} key={index}>
              <Card
                hoverable
                style={{ marginBottom: 20 }}
                cover={
                  <>
                    <DOImageViewer
                      key={index}
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
                      toUpdate ? setToUpdate(null) : setToUpdate("r.id");
                    }}
                  />,
                ]}
              >
                {toUpdate && toUpdate == "r.id" ? (
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
                        defaultValue: "",
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
