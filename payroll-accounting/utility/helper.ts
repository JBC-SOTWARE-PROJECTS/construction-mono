import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";
import { useState } from "react";
import { ToWords } from "to-words";
import { currency } from "./constant";

export const useLocalStorage = (key: string, initialValue: any) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const requiredField = [
  {
    required: true,
    message: "This field is required!",
  },
];

export const NumberFormater = (value: any) => {
  return numeral(value).format("0,0.00"); // 10,000.00
};

export const DateFormatter = (value: string) => {
  return dayjs(value).format("YYYY-MM-DD");
};

export const DateFormatterWithTime = (value: string) => {
  return dayjs(value).format("YYYY-MM-DD hh:mm:ss A");
};

export const NumberInString = (amount: number) => {
  const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Peso",
        plural: "Pesos",
        symbol: currency,
        fractionalUnit: {
          name: "Cent",
          plural: "Cents",
          symbol: "",
        },
      },
    },
  });
  return toWords.convert(amount, { currency: true });
};

export const dateToString = (date: Dayjs) => {
  const instantFormat = "YYYY-MM-DDTHH:mm:sss";
  const startOfDay = dayjs(date).startOf("day");
  return `${startOfDay.format(instantFormat)}Z`;
};

export const dateEndToString = (date: Dayjs) => {
  const instantFormat = "YYYY-MM-DDTHH:mm:sss";
  const startOfDay = dayjs(date).endOf("day");
  return `${startOfDay.format(instantFormat)}Z`;
};

export function transformDate(currentDate: dayjs.Dayjs, referenceDate: string) {
  const hour = dayjs(referenceDate).get("h");
  const minute = dayjs(referenceDate).get("m");
  const transformedDate = currentDate.set("hour", hour).set("minute", minute);
  return transformedDate;
}
