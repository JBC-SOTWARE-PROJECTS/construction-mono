import { Assets, Employee, VehicleUsageMonitoring } from "@/graphql/gql/graphql";
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { requiredField } from "@/utility/helper";
import {  FormInput, FormSelect } from "@/components/common";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import {  UPSERT_VEHICLE_USAGE_RECORD } from "@/graphql/assets/queries";
import { useMutation, useQuery } from "@apollo/client";
import _, { set } from "lodash";
import FormDateTimePicker from "@/components/common/formDateTimePicker/formDateTimePicker";
import { GET_ACTIVE_PROJECTS } from "@/components/payroll/configurations/UpsertScheduleType";
import { useRouter } from "next/router";
import useGetAssetById from "@/hooks/asset/useGetAssetById";
import moment from "moment";
import dayjs from "dayjs";
import EmployeeDrawer from "@/components/payroll/EmployeeDrawer";
import useGetEmployeesBasic from "@/hooks/employee/useGetEmployeesBasic";
import { ColumnsType } from "antd/es/table";
import { DataType } from "@/components/accountReceivables/invoice/form/types";
import { FAEditableContext } from "@/components/accounting/fixed-asset/dialogs/create-multi-fixed-asset/table";
type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined> 

interface EditableRowProps {
  index: number
}

interface IProps {
  hide: (hideProps: any) => void;
  record?: VehicleUsageMonitoring | null | undefined;
  projectOpts: any
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      {/* <FAEditableContext.Provider value={form}> */}
        <tr {...props} />
      {/* </FAEditableContext.Provider> */}
    </Form>
  )
}
const defRec = {
  usagePurpose :null,
  route: null,
  startDatetime : null,
  endDatetime: null,
  startOdometerReading: null,
  endOdometerReading: null,
  startFuelReading: null,
  endFuelReading: null,
  projectId: null
}

export default function UpsertVehicleUsageModal(props: IProps) {
  const { hide, record, projectOpts } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [initRecord, setinitRecord] = useState<VehicleUsageMonitoring | null>(null);
  const [selectedEmps, setSelectedEmps] = useState<Employee[]>([]);
  const router = useRouter();
  moment.locale('en')
  
  useEffect(() => {
    
    if(record){
      var initRec : any = record;
     
      initRec.startDatetime = dayjs(initRec.startDatetime ?? new Date()) ;
      initRec.endDatetime = dayjs(initRec.endDatetime ?? new Date());
      initRec.projectId = record?.project? record?.project?.id : null;

      setinitRecord(initRec);
    }else{
      setinitRecord(defRec);
    }
  }, [record])
  
  const [asset, loadingAsset] = useGetAssetById(router?.query?.id);
  const assetType = asset as Assets
  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_VEHICLE_USAGE_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  const {
    loading: loadingProjects,
    error,
    data: projects,
  } = useQuery(GET_ACTIVE_PROJECTS);

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
    };
    payload.item = assetType?.item?.id;
    payload.asset = assetType?.id;
    payload.project = values?.projectId;

      showPasswordConfirmation(() => {
        upsert({
          variables: {
            fields: payload,
            id: record?.id,
          },
        });
      });
    
  };

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const [employeeList, loading, setFilters] = useGetEmployeesBasic();

  // const columns: ColumnsType<Employee> = 
  // [
    
  //   {
  //     title: "Name",
  //     dataIndex: "fullName",
  //     key: "fullName",
  //     editable: true
  //   }]
 
  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = 
    [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
    editable: true
  }]


  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
      //  handleSave,
      }),
    }
  })

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Vehicle Usage`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "800px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertVehicleUsage"
            loading={upsertLoading}
            icon={<SaveOutlined />}
          >
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }
    >
      <>
      {
        initRecord && 
        <Form
        name="upsertVehicleUsage"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...initRecord,
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <FormInput
              name="usagePurpose"
              label="Usage Purpose"
              rules={requiredField}
              propsinput={{
                placeholder: "Type purpose here",
              }}
            />
          </Col>

          <Col span={12}>
            <FormInput
              name="route"
              rules={requiredField}
              label="Route"
              propsinput={{
                placeholder: "Type route here",
              }}
            />
          </Col>
          <Col span={12}>
          <FormDateTimePicker
                  name="startDatetime"
                  rules={requiredField}
                  label="Start Datetime"
                  propstimepicker={{
                    placeholder: "Select start date time",
                    showTime: { format: "h:mm:ss A" },
                    format: "MMMM D, YYYY, h:mm:ss A"
                  }}
                  
                />
          </Col>
          <Col span={12}>
          <FormDateTimePicker
                 name="endDatetime"
                 rules={requiredField}
                 label="End Datetime"
                 propstimepicker={{
                    placeholder: "Select end date time",
                    showTime: { format: "h:mm:ss A" },
                    format: "MMMM D, YYYY, h:mm:ss A",
                  }}
                />
          </Col>
          <Col span={12}>
            <FormInput
              name="startOdometerReading"
              rules={requiredField}
              label="Start Odometer Reading"
              propsinput={{
                placeholder: "",
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="endOdometerReading"
              rules={requiredField}
              label="End Odometer Reading"
              propsinput={{
                placeholder: "",
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="startFuelReading"
              rules={requiredField}
              label="Start Fuel Reading (Liters)"
              propsinput={{
                placeholder: "",
                type: "number"
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="endFuelReading"
              rules={requiredField}
              label="End Fuel Reading (Liters)"
              propsinput={{
                placeholder: "",
                type: "number"
              }}
            />
          </Col>
          <Col span={24}>
              <FormSelect
                name="projectId"
                label="Project"
                propsselect={{
                  options: projectOpts,
                  allowClear: true,
                  placeholder: "Select Project",
                }}
              />
            </Col>
       
        </Row>

        <EmployeeDrawer
        selectedEmployees={employeeList}
        loading={false}
        usage="MULTI"
        onSelect={(selected : Employee[])=>{
         
          const elementExists =_.filter(selectedEmps, emp => emp.id == selected[0].id);
        
          if(elementExists.length == 0){
            setSelectedEmps(_.concat(selectedEmps, selected))
          }
        
        }}
        >
          <>Select Employee</>
        </EmployeeDrawer>


        <Table
          rowKey="id"
          size="small"
          columns={columns  as ColumnTypes}
          dataSource={selectedEmps}
          pagination={false}
          rowClassName={() => 'editable-row'}
        />
      </Form>
      }
      </>
     
    </Modal>
  );
}
