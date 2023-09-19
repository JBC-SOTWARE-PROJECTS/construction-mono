import { PayrollEmployeeStatus } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";

const UPDATE_PAYROLL_EMPLOYEE_STATUS = gql`
  mutation ($id: UUID, $status: PayrollEmployeeStatus, $module: PayrollModule) {
    data: updatePayrollModuleEmployeeStatus(
      id: $id
      status: $status
      module: $module
    ) {
      message
      success
      response
    }
  }
`;

/**
 * This hook is used to update payroll module employee status and just decides which module you want to update.
 * @param {PayrollModule} module - the module of the employee you want to update. please use the PayrollModule in the constants.js
 * @param {function} callback - the function to implement after completing mutation.
 * @param {function} onErrorCallback - the function to implement if error occurs in the mutation.
 *
 * sample usage -
 * const [updateOtherDeductionEmployeeStatus, { loading }] = useUpdatePayrollModuleEmployeeStatus(PayrollModule.OTHER_DEDUCTION,upsertCallback, onErrorCallback);
 * updateOtherDeductionEmployeeStatus(id, PayrollEmployeeStatus.DRAFT);
 */
const useUpdatePayrollModuleEmployeeStatus = (
  module: PayrollEmployeeStatus,
  callback: (any: any) => void,
  onErrorCallback: () => void
) => {
  // other deduction id will be automatically taken from the page.
  const [otherDeductionMutation, otherDeductionReturnObject] = useMutation(
    UPDATE_PAYROLL_EMPLOYEE_STATUS,
    {
      onCompleted: (result) => {
        if (callback) callback(result);
      },
      onError: () => {
        if (onErrorCallback) onErrorCallback();
      },
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
    }
  );

  /**
   * This is the upsert method used to update the payroll employee status.
   * @param {uuid} id UUID or ID of the module employee that we want to update
   * @param {PayrollEmployeeStatus} status status of the employee that we want to set, please use the constant in constant.js
   */
  const upsertMethod = (id: string, status: any) => {
    otherDeductionMutation({
      variables: {
        id,
        status,
        module,
      },
    });
  };

  const returnValue: [(id: string, status: any) => void, any] = [
    upsertMethod,
    otherDeductionReturnObject,
  ];
  return returnValue;
};

export default useUpdatePayrollModuleEmployeeStatus;
