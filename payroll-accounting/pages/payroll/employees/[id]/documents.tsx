import React, { useState } from "react";
import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import { useGetEmployeeById } from "@/hooks/employee";
import { useRouter } from "next/router";
import { Divider, message } from "antd";
import { Button } from "antd/lib";
import { PlusCircleOutlined } from "@ant-design/icons";
import UseDialog from "@/hooks/useDialog";
import UpsertEmployeeDocsModal from "@/components/payroll/employee-management/documents/upsertEmployeeDocs";
import EmployeeDocList from "@/components/payroll/employee-management/documents/employeeDocList";
import useGetEmployeeDocs from "@/hooks/employee-documents/useGetEmployeeDocs";
import { IPMState } from "@/components/inventory/assets/dialogs/vehicleUsageAttachment";

type Props = {};

const initialState: IPMState = {
  filter: "",
  page: 0,
  size: 50,
};


function documents({}: Props) {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);
  const [statePage, setState] = useState(initialState);
  const modal = UseDialog(UpsertEmployeeDocsModal);


  const [data, loadingEmpDocs, refetch] = useGetEmployeeDocs({
    variables: {
      ...statePage,
      employee: router?.query?.id
    },
    fetchPolicy: "cache-and-network",
  });
console.log("employeeDocs", data)

  const onUpsertRecord = (record?: any) => {
    modal({ record: record , refetch: refetch}, (result: any) => {
      console.log("hello", result)
      refetch({
        ...statePage,
        employee: router?.query?.id
      });
      if(result){
          message.success("Item successfully added");
     }
  
    });
  };

 
  return (
    <>
      <EmployeeManagementHeader title="Documents">
        <EmployeeDetails
          fullName={employee?.fullName}
          position={employee?.position?.description}
        />
      </EmployeeManagementHeader>

      <Divider />
      <Button
        type="primary"
        onClick={()=>{onUpsertRecord(employee)}}
        icon={<PlusCircleOutlined />}
      >
        Create New
      </Button>

     <EmployeeDocList employeeDocs={data?.content} employeeId={employee?.id}/>
    </>
  );
}

export default documents;
