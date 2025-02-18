import { PaymentType, PayorType } from "../data-types/types"

export const onHandleSelectPayor = (
  payorType: PayorType,
  paymentType: PaymentType,
  payorDialog: any,
  push: any
) => {
  payorDialog(
    {
      paymentType: paymentType,
      defaultPayorType: payorType,
    },
    (params: { id: string; payorType: PayorType }) => {
      if (params.id) {
        push(
          `/accounting/cashier/payments/${paymentType}/${params.payorType}/${params.id}`
        )
      }
    }
  )
}
