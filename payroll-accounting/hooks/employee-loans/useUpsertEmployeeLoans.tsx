import { EmployeeLoan, EmployeeLoanCategory } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
interface variables {
  id: string;
  employeeId: string;
  category: EmployeeLoanCategory;
  amount: number;
  description: string;
}

const MUTATION = gql`
  mutation (
    $id: UUID
    $employeeId: UUID
    $category: EmployeeLoanCategory
    $amount: BigDecimal
    $description: String
  ) {
    data: upsertEmployeeLoan(
      id: $id
      employeeId: $employeeId
      category: $category
      amount: $amount
      description: $description
    ) {
      response {
        id
      }
    }
  }
`;

function useUpsertEmployeeLoans(callback?: (any: EmployeeLoan) => void) {
  const [mutation, { loading }] = useMutation(MUTATION, {
    onCompleted: (data) => {
      if (callback) {
        callback(data?.data);
      }
    },
    onError: () => {},
  });

  const mutationFunc = (variables: variables) => {
    mutation({ variables: variables });
  };

  const returnValue: [(variables: variables) => void, boolean] = [
    mutationFunc,
    loading,
  ];
  return returnValue;
}

export default useUpsertEmployeeLoans;
