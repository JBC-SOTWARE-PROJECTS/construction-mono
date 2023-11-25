import { gql } from '@apollo/client'

export const SUBMIT_PAYMENT = gql`
  mutation (
    $customerId: UUID
    $tendered: [Map_String_ObjectScalar]
    $shiftId: UUID
    $orNumber: BigDecimal
    $transactionType: String
    $paymentMethod: String
    $transactions: [Map_String_ObjectScalar]
  ) {
    addReceivablePayment(
      customerId: $customerId
      tendered: $tendered
      shiftId: $shiftId
      orNumber: $orNumber
      transactionType: $transactionType
      paymentMethod: $paymentMethod
      transactions: $transactions
    ) {
      response {
        id
      }
      success
      message
    }
  }
`
