import { gql, useMutation } from "@apollo/client";
import { Maybe } from "graphql/jsutils/Maybe";

const RECALCULATE_PAYROLL_EMPLOYEE = gql`
  mutation ($module: PayrollModule, $id: UUID) {
    data: recalculatePayrollModuleEmployee(module: $module, id: $id) {
      message
      success
      response
    }
  }
`;

/**
 * This hook is used to recalculate payroll module employee
 *  and just decides which module you want to update.
 * @param {PayrollModule} module - the module of the employee you want to update. please use the PayrollModule in the constants.js
 * @param {function} callback - the function to implement after completing mutation.
 * @param {function} onErrorCallback - the function to implement if error occurs in the mutation.
 *
 * sample usage -
 * const [recalculatePayrollEmployee, { loading }] = useRecalculatePayrollModuleEmployee(PayrollModule.OTHER_DEDUCTION,upsertCallback, onErrorCallback);
 * recalculatePayrollEmployee(id);
 */

const useRecalculatePayrollModuleEmployee = (
  module: string,
  callback: (param: any) => void,
  onErrorCallback: (param?: any) => void
) => {
  // other deduction id will be automatically taken from the page.
  const [recalculatePayrollModuleMutation, { loading }] = useMutation(
    RECALCULATE_PAYROLL_EMPLOYEE,
    {
      onCompleted: (result: any) => {
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
   * This is the upsert method used to recalculate the payroll employee based on the payroll module passed.
   * @param {uuid} id UUID or ID of the module employee that we want to recalculate.
   */
  const upsertMethod = (id: Maybe<string> | undefined) => {
    recalculatePayrollModuleMutation({
      variables: {
        id,
        module,
      },
    });
  };

  const returnValue: [(id: Maybe<string> | undefined) => void, boolean] = [
    upsertMethod,
    loading,
  ];

  return returnValue;
};

export default useRecalculatePayrollModuleEmployee;
