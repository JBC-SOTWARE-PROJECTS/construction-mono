package com.backend.gbp.utils

import org.springframework.stereotype.Component

@Component
class BillingUtils {

    static BigDecimal bankersRounding(BigDecimal number) {
        // Round the number using bankers' rounding
        BigDecimal integerPart = new BigDecimal(Math.floor(number));
        BigDecimal decimalPart = new BigDecimal(number - integerPart);

        // If the decimal part has more than two decimal places, apply bankers' rounding to it
        if (Math.abs(decimalPart * 100) > 2) {
            decimalPart = Math.round(decimalPart * 100) / 100.0;

            // Check if the decimal part needs to be rounded up or down based on bankers' rounding
            if ((BigDecimal) Math.abs(decimalPart - Math.floor(decimalPart)) == 0.5) {
                // If the decimal part is exactly halfway between two integers, use bankers' rounding
                if ((BigDecimal) Math.floor(decimalPart) % 2 == 0) {
                    // If the integer part of the decimal part is even, round down
                    decimalPart = Math.floor(decimalPart);
                } else {
                    // If the integer part of the decimal part is odd, round up
                    decimalPart = Math.ceil(decimalPart);
                }
            }
        }

        // Combine the integer and decimal parts and return the result
        String string = integerPart.toString()
        String string2 = decimalPart.toString()
        BigDecimal result = new BigDecimal(string) + new BigDecimal(string2);
        return result
    }
}
