import { PayrollModule } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";

const RECALCULATE_ALL_PAYROLL_EMPLOYEE = gql`
  mutation ($module: PayrollModule, $id: UUID) {
    data: recalculateAllPayrollModuleEmployee(module: $module, id: $id) {
      message
      success
      response
    }
  }
`;

/**
 * This hook is used to recalculate all employees in a payroll module.
 * @param {PayrollModule} module - the module of the employee you want to update. please use the PayrollModule in the constants.js
 * @param {function} callback - the function to implement after completing mutation.
 * @param {function} onErrorCallback - the function to implement if error occurs in the mutation.
 *
 * sample usage -
 * const [recalculateAllPayrollEmployee, { loading }] = useRecalculateAllPayrollModuleEmployee(PayrollModule.OTHER_DEDUCTION,upsertCallback, onErrorCallback);
 * recalculateAllPayrollEmployee(id);
 */
const useRecalculateAllPayrollModuleEmployee = (
  module: PayrollModule,
  callback: (any: any) => void,
  onErrorCallback: () => void
) => {
  // other deduction id will be automatically taken from the page.
  const [recalculateAllPayrollModuleMutation, { loading }] = useMutation(
    RECALCULATE_ALL_PAYROLL_EMPLOYEE,
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
   * This is the upsert method used to recalculate all the payroll employees based on the payroll module passed.
   * @param {uuid} id UUID or ID of the payroll that we want to recalculate all employees.
   */
  const upsertMethod = (id: string) => {
    recalculateAllPayrollModuleMutation({
      variables: {
        id,
        module,
      },
    });
  };

  const returnValue: [(id: string) => void, boolean] = [upsertMethod, loading];
  return returnValue;
};

export default useRecalculateAllPayrollModuleEmployee;
