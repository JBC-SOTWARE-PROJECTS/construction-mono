import React from "react";
import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import { useGetEmployeeById } from "@/hooks/employee";
import { useRouter } from "next/router";
import type { TabsProps } from "antd";
import { Divider, Tabs } from "antd";
import { Button } from "antd/lib";
import { PlusCircleOutlined } from "@ant-design/icons";
import UseDialog from "@/hooks/useDialog";
import UpsertEmployeeDocsModal from "@/components/payroll/employee-management/documents/upsertEmployeeDocs";
import EmployeeDocList from "@/components/payroll/employee-management/documents/employeeDocList";

type Props = {};

function documents({}: Props) {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);
  const modal = UseDialog(UpsertEmployeeDocsModal);


  const onUpsertRecord = (record?: any) => {
    modal({ record: record }, (result: any) => {
    //   if (result) {
    //     refetch();
    //     if (record?.id) {
    //       message.success("Item successfully added");
    //     } else {
    //       message.success("Item successfully updated");
    //     }
    //   }
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

      <EmployeeDocList employeeId={employee?.id}/>
    </>
  );
}

export default documents;
