import { gql } from "@apollo/client"

export const GET_BILLING_DATA = gql`
  query ($id: UUID!) {
    billingById(billingId: $id) {
      id
      entryDateTime
      billingNo
      balance
      locked
      status
      otcname
      isCreditLimitReached
      creditLimit
      isAllowedProgressPayment
      patientCase {
        id
        caseNo
        admissionDatetime
        dischargedDatetime
        entryDateTime
        primaryDx
        accommodationType
        registryType
        secondaryDx
        room {
          bedNo
          roomNo
          roomName
        }
        locked
      }
      patient {
        id
        fullName
        dob
        age
        gender
        contactNo
      }
    }
  }
`
