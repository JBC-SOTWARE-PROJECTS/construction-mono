package com.backend.gbp.utils

import org.springframework.stereotype.Component

@Component
class BillingUtils {

    static BigDecimal bankersRounding(BigDecimal number) {
        if (number != BigDecimal.ZERO) {
            BigDecimal scaledNumber = number.setScale(2, BigDecimal.ROUND_HALF_EVEN) // First scale to 2 decimal places using Bankers Rounding

            BigDecimal integerPart = scaledNumber.setScale(0, BigDecimal.ROUND_DOWN) // Get the integer part
            BigDecimal decimalPart = scaledNumber.subtract(integerPart) // Get the decimal part

            // If the decimal part is exactly 0.5, check the integer part for Bankers Rounding
            if (decimalPart.compareTo(new BigDecimal("0.50")) == 0) {
                if (integerPart.remainder(BigDecimal.valueOf(2)).compareTo(BigDecimal.ZERO) == 0) {
                    return integerPart.add(BigDecimal.ZERO) // Round down if integer part is even
                } else {
                    return integerPart.add(BigDecimal.ONE) // Round up if integer part is odd
                }
            }

            return scaledNumber // If not exactly 0.5, return the scaled number
        }
        return BigDecimal.ZERO
    }
}
