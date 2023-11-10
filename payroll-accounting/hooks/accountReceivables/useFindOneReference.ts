import {
  FIND_ONE_OPTION_COMPANY,
  FIND_ONE_OPTION_PATIENT,
  FIND_ONE_OPTION_SUPPLIER,
  FIND_ONE_OPTION_EMPLOYEE,
} from '@/graphql/accountReceivables/customers'
import { Query } from '@/graphql/gql/graphql'
import { useLazyQuery } from '@apollo/client'

export default function UseFindOneReference(props?: {
  onCompleted: (returned: any) => void
}): any {
  const { onCompleted } = props || { onCompleted: () => {} }

  const [onFindOneCompany, { loading: companyLoading, data: companyData }] =
    useLazyQuery<Query>(FIND_ONE_OPTION_COMPANY, {
      onCompleted: ({ companyAccountById }) => {
        if (companyAccountById) onCompleted(companyAccountById)
      },
    })

  const [onFindOnePatient, { loading: patientLoading, data: patientData }] =
    useLazyQuery<Query>(FIND_ONE_OPTION_PATIENT, {
      onCompleted: ({ patient }) => {
        if (patient) onCompleted(patient)
      },
    })

  const [onFindOneSupp, { loading: supplierLoading, data: supplierData }] =
    useLazyQuery<Query>(FIND_ONE_OPTION_SUPPLIER, {
      onCompleted: ({ supplierById }) => {
        if (supplierById) onCompleted(supplierById)
      },
    })

  const [onFindOneEmployee, { loading: employeeLoading, data: employeeData }] =
    useLazyQuery<Query>(FIND_ONE_OPTION_EMPLOYEE, {
      onCompleted: ({ employee }) => {
        if (employee) onCompleted(employee)
      },
    })

  const onFind = ({ id, type }: { id?: string; type?: string }) => {
    switch (type) {
      case 'HMO':
        onFindOneCompany({
          variables: {
            id,
          },
        })
        break
      case 'CORPORATE':
        onFindOneCompany({
          variables: {
            id,
          },
        })
        break
      case 'PERSONAL':
        onFindOneSupp({
          variables: {
            id,
          },
        })
        break
      case 'PROMISSORY_NOTE':
        onFindOneCompany({
          variables: {
            id,
          },
        })
        break
      case 'PATIENT':
        onFindOnePatient({
          variables: {
            id,
          },
        })
        break
      case 'EMPLOYEE':
        onFindOneEmployee({
          variables: {
            id,
          },
        })
        break
      default:
        break
    }
  }

  return [
    onFind,
    {
      loading:
        companyLoading || supplierLoading || patientLoading || employeeLoading,
      data: {
        ...companyData?.companyAccountById,
        ...supplierData?.supplierById,
        ...patientData?.patient,
        ...employeeData?.employee,
      },
    },
  ]
}
