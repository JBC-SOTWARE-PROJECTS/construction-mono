import Decimal from "decimal.js"

export function bankersRounding(value: number) {
  // Create a Decimal instance from the input value
  const decimalValue = new Decimal(value)

  // Round to two decimal places
  const roundedValue = decimalValue.toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN)

  // Return the rounded value
  return roundedValue.toNumber()
}
