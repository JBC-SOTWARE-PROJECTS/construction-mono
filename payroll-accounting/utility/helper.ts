import dayjs, { Dayjs } from "dayjs";
import numeral from "numeral";
import { ReactNode, useState } from "react";
import { ToWords } from "to-words";
import { currency, dateFormat } from "./constant";
import { v4 as uuidv4 } from "uuid";
import roundHalfEven from "round-half-even";
import { Disbursement } from "@/graphql/gql/graphql";
import _ from "lodash";

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
  const formattedValue = numeral(value).format("0,0.00"); // 10,000.00
  return value < 0
    ? `(${numeral(Math.abs(value)).format("0,0.00")})`
    : formattedValue;
};

export const NumberFormaterNoDecimal = (value: any) => {
  return numeral(value).format("0,0");
};

export const NumberFormaterDynamic = (value: any) => {
  let inputedValue = Number(value);
  if (inputedValue % 1 != 0) {
    return numeral(value).format("0,0.00"); // 10,000.00
  } else {
    return numeral(value).format("0,0"); // 10,000
  }
};

export const DateFormatter = (value: string) => {
  return dayjs(value).format("YYYY-MM-DD");
};

export const DateFormatterWithTime = (value: string) => {
  return dayjs(value).format("YYYY-MM-DD hh:mm:ss A");
};

export const DateFormatterText = (value: string) => {
  return dayjs(value).format("MMMM DD, YYYY");
};

export const randomId = () => {
  return uuidv4();
};

export const decimalRound2 = (amount?: number) => {
  if (amount) {
    return roundHalfEven(amount, 2);
  }
  return 0;
};

export const decimalRound4 = (amount?: number) => {
  if (amount) {
    return roundHalfEven(amount, 4);
  }
  return 0;
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
  const endOfDay = dayjs(date).endOf("day");
  return `${endOfDay.format(instantFormat)}Z`;
};

export const stringStartDate = (date: Dayjs) => {
  const startOfDay = dayjs(date).startOf("day");
  return startOfDay.format(dateFormat);
};

export const stringEndDate = (date: Dayjs) => {
  const endOfDay = dayjs(date).endOf("day");
  return endOfDay.format(dateFormat);
};

export const stringDateFull = (date: Dayjs) => {
  const endOfDay = dayjs(date).endOf("day");
  return endOfDay.format("MMMM DD, YYYY");
};

export const shapeOptionValue = (
  label?: ReactNode,
  value?: string | number
) => {
  return { label: label, value: value };
};

export function transformDate(currentDate: dayjs.Dayjs, referenceDate: string) {
  const hour = dayjs(referenceDate).get("h");
  const minute = dayjs(referenceDate).get("m");
  const transformedDate = currentDate.set("hour", hour).set("minute", minute);
  return transformedDate;
}
export function transformDateRange(
  currentDate: dayjs.Dayjs,
  refStartDate: string | undefined | null,
  refEndDate: string | undefined | null
) {
  const refStart = dayjs(refStartDate);
  const refEnd = dayjs(refEndDate);

  const hour = refStart.get("h");
  const minute = refStart.get("m");
  const start = currentDate.set("hour", hour).set("minute", minute);

  const hourEnd = refEnd.get("h");
  const minuteEnd = refEnd.get("m");
  let end = currentDate.set("hour", hourEnd).set("minute", minuteEnd);
  if (end.isBefore(start)) {
    end = end.add(1, "day");
  }

  return { start, end };
}
export function getTimeFromDate(date: dayjs.Dayjs) {
  return dayjs(date).format("hh:mm A");
}

export function getStatusColor(status: string) {
  if (status === "DRAFT") return "orange";
  else if (status === "FINALIZED") return "green";
}

export const validateDisbursement = (
  payload: Disbursement,
  balance: number,
  checks: any[],
  application: any[],
  expense: any[]
): string => {
  if (payload.paymentCategory === "PAYABLE") {
    if (_.isEmpty(checks) && _.isEmpty(application)) {
      return "Please supply check details or Accounts payable application to proceed";
    }
    if (!payload.isAdvance) {
      if (Number(balance) !== 0) {
        return "Disbursement amount and Applied amount are not equals";
      }
    }
  } else if (payload.paymentCategory === "EXPENSE") {
    if (_.isEmpty(checks) && _.isEmpty(expense)) {
      return "Please supply check details or expense transaction to proceed";
    }
    if (!payload.isAdvance) {
      if (Number(balance) !== 0) {
        return "Disbursement amount and Applied amount are not equals";
      }
    }
  }
  return "";
};

export const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export function accessControl(permissions: string[], access: string) {
  let result = _.findIndex(permissions, function (value) {
    return value == access;
  });
  if (result < 0) {
    return true;
  } else {
    return false;
  }
}

export const typeLabel = (value: string): string => {
  let result = "N/A";
  if (value == "discountRate") {
    result = "Discount rate";
  } else if (value == "discountAmount") {
    result = "Discount amount";
  } else if (value == "package") {
    result = "Package";
  }
  return result;
};

export const parserInputNumber = {
  formatter: (value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  parser: (value: any) => value!.replace(/\$\s?|(,*)/g, ""),
};

export const calculateAge = (value: string) => {
  const dob = dayjs(value);
  const today = dayjs();
  const age = today.diff(dob, "year");
  return `${age} y.o`;
};

export function getRandomBoyGirl() {
  const randomNum = Math.random();

  // Choose between "boy" and "girl" based on the random number
  return randomNum < 0.5 ? "boy" : "girl";
}

export function isSeniorCitizen(dateOfBirth: string, thresholdAge: number) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dob.getFullYear();

  // Check if the birthday has occurred this year
  const hasBirthdayPassed =
    currentDate.getMonth() > dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() &&
      currentDate.getDate() >= dob.getDate());

  // If the birthday hasn't occurred yet this year, subtract one year
  if (!hasBirthdayPassed) {
    age--;
  }

  // Check if age exceeds the threshold for senior citizenship
  return age >= thresholdAge;
}
