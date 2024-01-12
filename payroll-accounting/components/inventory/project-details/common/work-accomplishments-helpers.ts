import { ProjectWorkAccomplishItems } from '@/graphql/gql/graphql'
import Decimal from 'decimal.js'

export const calculateBalance = (row: ProjectWorkAccomplishItems) => {
  const prev = new Decimal(row?.qty ?? 0).minus(new Decimal(row?.prevQty ?? 0))

  const balance = prev.minus(row?.thisPeriodQty ?? 0).toString()

  row.balanceQty = parseInt(balance)
  return row
}

export const calculatePercentage = (row: ProjectWorkAccomplishItems) => {
  const totalAmount = new Decimal(row?.qty ?? 0).times(
    new Decimal(row?.cost ?? 0)
  )

  const prevPlusThisPeriod = new Decimal(row?.prevAmount).plus(
    new Decimal(row?.thisPeriodAmount ?? 0)
  )
  const amountDividedByTotalAmount = prevPlusThisPeriod.dividedBy(totalAmount)

  const percentage = amountDividedByTotalAmount
    .times(new Decimal(row.relativeWeight ?? 0))
    .toString()

  row.percentage = parseFloat(percentage)
  return row
}

export const calculateAmountAccomplish = (row: ProjectWorkAccomplishItems) => {
  const cost = new Decimal(row?.cost ?? 0)

  const prev = cost.times(new Decimal(row.prevQty ?? 0)).toString()
  const thisPeriod = cost.times(new Decimal(row.thisPeriodQty ?? 0)).toString()
  const toDate = cost.times(new Decimal(row.toDateQty ?? 0)).toString()
  const balance = cost.times(new Decimal(row.balanceQty ?? 0)).toString()

  row.prevAmount = parseFloat(prev)
  row.thisPeriodAmount = parseFloat(thisPeriod)
  row.toDateAmount = parseFloat(toDate)
  row.balanceAmount = parseFloat(balance)
  return row
}
