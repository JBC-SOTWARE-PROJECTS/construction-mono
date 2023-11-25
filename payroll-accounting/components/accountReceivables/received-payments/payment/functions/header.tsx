import { DispatchI } from '../types'

interface onSelectCustomerI {
  customerId: string
  dispatch: DispatchI
}
export const onSelectCustomer = (params: onSelectCustomerI) => {
  params.dispatch({ type: 'set-customerId', payload: params.customerId })
}
