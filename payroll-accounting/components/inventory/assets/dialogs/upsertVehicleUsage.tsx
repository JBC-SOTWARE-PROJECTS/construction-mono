import {
  Assets,
  Employee,
  RentalRates,
  VehicleUsageEmployee,
  VehicleUsageMonitoring,
} from "@/graphql/gql/graphql";
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { CloudDownloadOutlined, SaveOutlined } from "@ant-design/icons";
import { requiredField } from "@/utility/helper";
import { FormInput, FormSelect } from "@/components/common";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import {
  UPSERT_USAGE_EMPLOYEE_ITEM,
  UPSERT_VEHICLE_USAGE_RECORD,
} from "@/graphql/assets/queries";
import { useMutation } from "@apollo/client";
import _, { set } from "lodash";
import FormDateTimePicker from "@/components/common/formDateTimePicker/formDateTimePicker";
import { useRouter } from "next/router";
import useGetAssetById from "@/hooks/asset/useGetAssetById";
import moment from "moment";
import dayjs from "dayjs";
import EmployeeDrawer from "@/components/payroll/EmployeeDrawer";
import useGetEmployeesBasic from "@/hooks/employee/useGetEmployeesBasic";
import VehicleUsageEmployeeTable from "../masterfile/vehicleUsageEmployee";
import useGetVehicleUsageEmployee from "@/hooks/asset/useGetVehicleUsageEmployee";
import { IPMState } from "./vehicleUsageAttachment";
import useGetRentalRateByAsset from "@/hooks/asset/useGetRentalRateByAsset";
import { currencyDisplay } from "@/shared/settings";
import FormTextArea from "@/components/common/formTextArea/formTextArea";
import AccessControl from "@/components/accessControl/AccessControl";
import { getUrlPrefix } from "@/utility/graphql-client";
import useGetVehicleUsageLatest from "@/hooks/asset/useGetVehicleUsageLatest";


interface IProps {
  hide: (hideProps: any) => void;
  record?: VehicleUsageMonitoring | null | undefined;
  latestUsage?: VehicleUsageMonitoring | null;
  projectOpts: any;
  viewModeSet : boolean
}

const defRec = {
  usagePurpose: null,
  route: null,
  startDatetime: null,
  endDatetime: null,
  startOdometerReading: null,
  endOdometerReading: null,
  startFuelReading: null,
  endFuelReading: null,
  projectId: null,
  rentalBasisId: null,
};

const initialState: IPMState = {
  filter: "",
  page: 0,
  size: 10,
};

export default function UpsertVehicleUsageModal(props: IProps) {
  const { hide, record, projectOpts, viewModeSet, latestUsage } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [initRecord, setinitRecord] = useState<VehicleUsageMonitoring | null>(
    null
  );
  const [selectedEmps, setSelectedEmps] = useState<VehicleUsageEmployee[]>([]);
  const [deletedEmps, setDeletedEmps] = useState<string[]>([]);
  const [statePage, setState] = useState(initialState);
  const [viewMode, setViewMode] = useState(viewModeSet ?? true);
  const [csvLoading, setCsvLoading] = useState(false);
  const [calculatedRental, setCalculatedRental] = useState(0);
  const [form] = Form.useForm();
  const router = useRouter();

  moment.locale("en");

  const [asset, loadingAsset] = useGetAssetById(router?.query?.id);
  const assetType = asset as Assets;
  const [employeeList, loading, setFilters] = useGetEmployeesBasic();
  
  
  const [dataEmployee, loadingEMPS, refetch] = useGetVehicleUsageEmployee({
    variables: {
      ...statePage,
      usageID: record?.id,
    },
    fetchPolicy: "network-only",
  });


  const [dataRentalRates, loadingRentalRate, refetchRentalRates] =
    useGetRentalRateByAsset({
      variables: {
        filter: "",
        page: 0,
        size: 10,
        id: record?.asset?.id,
      },
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    if (record) {
      var initRec: any = record;

      initRec.startDatetime = dayjs(initRec.startDatetime ?? new Date());
      initRec.endDatetime = dayjs(initRec.endDatetime ?? new Date());
      initRec.projectId = record?.project ? record?.project?.id : null;
      initRec.rentalBasisId = record?.rentalBasis
        ? record?.rentalBasis?.id
        : null;

      setinitRecord(initRec);
      setCalculatedRental(
        (initRec?.rentalRate ?? 0) * (initRec?.rentUnitMeasureQuantity ?? 0)
      );
    } else {

      var initRec: any = {...defRec, startOdometerReading: latestUsage?.endOdometerReading};
      
      setinitRecord(initRec);
    }
  }, [record ]);

  useEffect(() => {
    if (dataEmployee) {
      var empContent = dataEmployee?.content;

      empContent = empContent.map((record: VehicleUsageEmployee) => ({
        ...record,
        timeRenderedEnd: dayjs(record.timeRenderedEnd).format(
          "MMMM D, YYYY, h:mm:ss A"
        ),
        timeRenderedStart: dayjs(record.timeRenderedStart).format(
          "MMMM D, YYYY, h:mm:ss A"
        ),
      }));
      setSelectedEmps(empContent);
    }
  }, [dataEmployee]);

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

  const [upsertUsageEmployee, { loading: upsertUEmpLoading }] = useMutation(
    UPSERT_USAGE_EMPLOYEE_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          console.log("respData", data);
        }
      },
    }
  );

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
    };
    payload.item = assetType?.item?.id;
    payload.asset = assetType?.id;
    payload.project = values?.projectId;
    (payload.rentalBasis = values?.rentalBasisId),
      (payload.calculatedRentalFee =
        (values?.rentUnitMeasureQuantity ?? 0) * (values?.rentalRate ?? 0));

    var usageEmps = selectedEmps.map((record: VehicleUsageEmployee) => {
      var newProp = {
        ...record,
        ...{
          employee: record.employee?.id,
          asset: record.asset?.id,
          item: record.item?.id,
          vehicleUsage: record?.id,
          laborCost: parseInt(record?.laborCost),
          timeRenderedEnd: dayjs(record.timeRenderedEnd).millisecond(0),
          timeRenderedStart: dayjs(record.timeRenderedStart).millisecond(0),
        },
      };

      delete newProp["__typename"];

      return newProp;
    });

    showPasswordConfirmation(() => {
      upsertUsageEmployee({
        variables: {
          employeeList: usageEmps,
          usageID: record?.id,
          toDelete: deletedEmps,
        },
      });

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

  const handleSelected = (record: VehicleUsageEmployee[]) => {
    setSelectedEmps(record);
  };

  const handleDeleted = (record: string) => {
    var allDeleted = deletedEmps;
    allDeleted.push(record);
    setDeletedEmps(allDeleted);
  };

  const handleRentRateChange = () => {
    const fieldsValue = form.getFieldsValue();
    setCalculatedRental(
      (fieldsValue?.rentUnitMeasureQuantity ?? 0) *
        (fieldsValue?.rentalRate ?? 0)
    );
  };

  const handleRentalBasisChange = () => {
    const fieldsValue = form.getFieldsValue();
    const rentBasis: RentalRates[] = dataRentalRates?.content.filter(
      (record: RentalRates) => record?.id == fieldsValue?.rentalBasisId
    );

    form.setFieldsValue({
      rentalRate: rentBasis[0]?.amount,
    });

    setCalculatedRental(
      (fieldsValue?.rentUnitMeasureQuantity ?? 0) * rentBasis[0]?.amount
    );
  };

  var rentUnitOpts = dataRentalRates?.content.map((item: RentalRates) => {
    return {
      value: item?.id,
      label: `${currencyDisplay} ${parseFloat(item.amount).toFixed(2)} per ${item.rentType == "DESCRIPTION" ? item.description : (`${
        item.measurement ?? 0
      } ${item.unit ?? ""}`)}
       `,
    };
  });

  const onHandleDownloadCSV = () => {
    let apiURL =
      `/reports/inventory/print/trip_ticket/${record?.id}`

      // let apiURL =
      // '/general-ledger-reports/summary?' +
      // 'startDate=' +
      // startDate +
      // '&endDate=' +
      // endDate

    window.open(getUrlPrefix() + apiURL, '_blank')
  }

console.log("initRecord", initRecord)
  return (
    <Modal
      title={
        <>
          <Typography.Title level={4}>
            <Space align="center">{`
            ${viewMode ? "" : `${record?.id ? "Edit" : "Add"} `}
            Vehicle Usage`}</Space>
          </Typography.Title>
          {
            record &&
            <Button size="small" type="primary" icon={<CloudDownloadOutlined />} className="margin-0"
                    onClick={onHandleDownloadCSV}
                    loading={csvLoading}
                >
                    Download Trip Ticket
                </Button>
          }
          
        </>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1300px" }}
      onCancel={() => hide(false)}
      footer={
        viewMode == false ? (
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
        ) : (
          <></>
        )
      }
    >
      <>
        {initRecord &&  (
          <Form
            form={form}
            name="upsertVehicleUsage"
            layout="vertical"
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            initialValues={{
              ...initRecord,
            }}
            disabled={viewMode ? true : false}
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
                    format: "MMMM D, YYYY, h:mm:ss A",
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
              <Col span={6}>
                <FormInput
                  name="startOdometerReading"
                  rules={requiredField}
                  label="Start Odometer Reading"
                  propsinput={{
                    placeholder: "",
                  }}
                />
              </Col>
              <Col span={6}>
                <FormInput
                  name="endOdometerReading"
                  rules={requiredField}
                  label="End Odometer Reading"
                  propsinput={{
                    placeholder: "",
                  }}
                />
              </Col>
              <Col span={6}>
                <FormInput
                  name="startFuelReading"
                  rules={requiredField}
                  label="Start Fuel Reading (Liters)"
                  propsinput={{
                    placeholder: "",
                    type: "number",
                  }}
                />
              </Col>
              <Col span={6}>
                <FormInput
                  name="endFuelReading"
                  rules={requiredField}
                  label="End Fuel Reading (Liters)"
                  propsinput={{
                    placeholder: "",
                    type: "number",
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
              <Col span={24}>
                <FormTextArea
                  label="Remarks/Other Details"
                  name="remarks"
                  propstextarea={{
                    allowClear: true,
                    placeholder:
                      "You can place other details like load measurement (cubic meter per batch) or other important details about the trip.",
                    rows: 2,
                  }}
                />
              </Col>
            </Row>

            {record ? (
              <>
                <AccessControl
                  allowedPermissions={["manage_employee_on_vehicle_usage"]}
                >
                  <Divider orientation="left">EMPLOYEE INVOLVEMENT</Divider>
                  {viewMode == false ? (
                    <>
                      <EmployeeDrawer
                        selectedEmployees={employeeList}
                        loading={false}
                        usage="MULTI"
                        onSelect={(selected: Employee[]) => {
                          const elementExists = _.filter(
                            selectedEmps,
                            (emp) => emp.employee?.id == selected[0].id
                          );

                          if (elementExists.length == 0) {
                            dayjs.locale("en");
                            var recEmp: VehicleUsageEmployee[] = selected.map(
                              (rec: Employee) => ({
                                employee: rec,
                                company: initRecord.company,
                                item: initRecord.item,
                                asset: initRecord.asset,
                                vehicleUsage: initRecord.id,
                                designation: "DRIVER",
                                timeRenderedEnd: dayjs(new Date()).format(
                                  "MMMM D, YYYY, h:mm:ss A"
                                ),
                                timeRenderedStart: dayjs(new Date()).format(
                                  "MMMM D, YYYY, h:mm:ss A"
                                ),
                                remarks: "N/A",
                                laborCost: 0
                              })
                            );

                            setSelectedEmps(_.concat(selectedEmps, recEmp));
                          }
                        }}
                      >
                        <>Select Employee</>
                      </EmployeeDrawer>
                    </>
                  ) : (
                    <></>
                  )}

                  <VehicleUsageEmployeeTable
                    viewMode={viewMode}
                    selectedEmps={selectedEmps}
                    handleSelected={handleSelected}
                    handleDeleted={handleDeleted}
                  />
                </AccessControl>

                <AccessControl
                  allowedPermissions={["manage_employee_on_vehicle_usage"]}
                >
                  <Divider orientation="left">RENT DETAILS</Divider>
                  <Row gutter={[8, 0]}>
                    <Col span={12}>
                      <FormSelect
                        name="rentalBasisId"
                        label="Rental Basis"
                        propsselect={{
                          options: rentUnitOpts,
                          allowClear: true,
                          placeholder: "Select rental basis",
                          onChange: handleRentalBasisChange,
                        }}
                      />
                    </Col>
                    <Col span={3}>
                      <FormInput
                        name="rentUnitMeasureQuantity"
                        label="Quantity"
                        propsinput={{
                          defaultValue: 0,
                          type: "number",
                          placeholder: "",
                          onChange: handleRentRateChange,
                        }}
                      />
                    </Col>
                    <Col span={3}>
                      <FormInput
                        name="rentalRate"
                        label="Rental Rate"
                        propsinput={{
                          defaultValue: 0,
                          type: "number",
                          placeholder: "",
                          onChange: handleRentRateChange,
                        }}
                      />
                    </Col>
                    <Col span={4}>
                      <FormInput
                        name="calculatedRentalFee"
                        label="Calculated Rental Fee"
                        propsinput={{
                          disabled: true,
                          type: "number",
                          placeholder: calculatedRental.toString(),
                        }}
                      />
                    </Col>
                  </Row>
                </AccessControl>
              </>
            ) : (
              <></>
            )}
          </Form>
        )}
      </>
    </Modal>
  );
}
