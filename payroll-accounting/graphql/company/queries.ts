import { gql } from "@apollo/client";

export const GET_COMPANY_RECORDS = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    companyPage(filter: $filter, size: $size, page: $page) {
      content {
        id
        companyCode
        companyName
        vatRate
        markup
        govMarkup
        isActive
        hideInSelection
      }
      totalElements
      number
      size
    }
  }
`;

export const UPSER_COMPANY_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertCompany(id: $id, fields: $fields) {
      id
    }
  }
`;

export const CHANGE_COMPANY = gql`
  mutation ($id: UUID, $company: UUID) {
    changeCompany(id: $id, company: $company) {
      id
    }
  }
`;

export const GET_SALARY_RATE_MULTIPLIER = gql`
  query {
    salarRateMultiplier: getSalaryRateMultiplier {
      id
      regular
      restday
      specialHoliday
      specialHolidayAndRestDay
      regularHoliday
      regularHolidayAndRestDay
      doubleHoliday
      doubleHolidayAndRestDay
      regularOvertime
      restdayOvertime
      specialHolidayOvertime
      specialHolidayAndRestDayOvertime
      regularHolidayOvertime
      regularHolidayAndRestDayOvertime
      doubleHolidayOvertime
      doubleHolidayAndRestDayOvertime
      nightDifferential
    }
  }
`;

export const SAVE_SALARY_RATE_MULTIPLIER = gql`
  mutation ($fields: Map_String_ObjectScalar) {
    data: updateSalaryRateMultiplier(fields: $fields) {
      payload {
        id
        regular
        restday
        specialHoliday
        specialHolidayAndRestDay
        regularHoliday
        regularHolidayAndRestDay
        doubleHoliday
        doubleHolidayAndRestDay
        regularOvertime
        restdayOvertime
        specialHolidayOvertime
        specialHolidayAndRestDayOvertime
        regularHolidayOvertime
        regularHolidayAndRestDayOvertime
        doubleHolidayOvertime
        doubleHolidayAndRestDayOvertime
        nightDifferential
      }
      success
      message
    }
  }
`;

export const UPSERT_SSS_CONTRIBUTION = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    result: upsertSSSContribution(id: $id, fields: $fields) {
      payload {
        id
        eeContribution
        erContribution
      }
      message
      success
    }
  }
`;

export const GET_SSS_CONTRIBUTIONS = gql`
  query {
    list: getSSSContributions {
      id
      minAmount
      maxAmount
      monthlySalaryCredit
      erContribution
      eeContribution
      er_ec_Contribution
      wispErContribution
      wispEeContribution
      lastModifiedBy
      lastModifiedDate
    }
  }
`;

export const UPSERT_HDMF_CONTRIBUTION = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    result: upsertHDMFContribution(id: $id, fields: $fields) {
      payload {
        id
        minAmount
      }
      message
      success
    }
  }
`;

export const GET_HDMF_CONTRIBUTIONS = gql`
  query {
    list: getHDMFContributions {
      id
      minAmount
      maxAmount
      eeRate
      erRate
    }
  }
`;

export const UPSERT_PHIC_CONTRIBUTION = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    result: upsertPHICContribution(id: $id, fields: $fields) {
      payload {
        id
      }
      message
      success
    }
  }
`;

export const GET_PHIC_CONTRIBUTIONS = gql`
  query {
    list: getPHICContributions {
      id
      minAmount
      maxAmount
      premiumRate
      eeRate
      erRate
    }
  }
`;
