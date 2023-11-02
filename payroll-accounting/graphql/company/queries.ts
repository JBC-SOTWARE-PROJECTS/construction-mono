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

export const GET_EVENTS = gql`
  {
    events: getCalendarEvents {
      id
      name
      startDate
      endDate
      holidayType
      fixed
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertEventCalendar(id: $id, fields: $fields) {
      payload {
        id
        startDate
        name
        endDate
        fixed
        holidayType
      }
      message
      success
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation ($id: UUID) {
    data: deleteEventCalendar(id: $id) {
      message
      success
    }
  }
`;

export const UPSERT_ALLOWANCE_TYPE = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertAllowanceType(id: $id, fields: $fields) {
      payload {
        id
      }
      message
      success
    }
  }
`;

export const FETCH_ALLOWANCE_PAGEABLE = gql`
  query ($filter: String, $page: Int, $pageSize: Int) {
    data: fetchAllowancePageable(
      filter: $filter
      page: $page
      pageSize: $pageSize
    ) {
      content {
        id
        name
        allowanceType
        amount
      }
      totalElements
      totalPages
      number
    }
  }
`;

export const DELETE_ALLOWANCE = gql`
  mutation ($id: UUID) {
    data: deleteAllowance(id: $id) {
      message
      success
    }
  }
`;

export const UPSERT_ALLOWANCE_PACKAGE = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertAllAllowancePackage(id: $id, fields: $fields) {
      payload {
        id
      }
      message
      success
    }
  }
`;

export const FETCH_ALLOWANCE_PACKAGE_PAGEABLE = gql`
  query ($filter: String, $page: Int, $pageSize: Int) {
    data: fetchAllowancePackagePageable(
      filter: $filter
      page: $page
      pageSize: $pageSize
    ) {
      content {
        id
        name
        status
      }
      totalElements
      totalPages
      number
    }
  }
`;

export const DELETE_ALLOWANCE_PACKAGE = gql`
  mutation ($id: UUID) {
    data: deleteAllowancePackage(id: $id) {
      message
      success
    }
  }
`;

export const GET_ALL_ALLOWANCE = gql`
  query {
    data: fetchAllAllowance {
      id
      name
      allowanceType
      amount
    }
  }
`;

export const GET_ALL_ALLOWANCE_PACKAGE = gql`
  query {
    data: fetchAllAllowancePackage {
      id
      name
    }
  }
`;

export const UPSERT_ALLOWANCE_ITEM = gql`
  mutation (
    $allowancePackage: UUID
    $allowanceList: [AllowanceInput]
    $toDelete: [UUID]
  ) {
    data: upsertAllAllowanceItem(
      allowancePackage: $allowancePackage
      allowanceList: $allowanceList
      toDelete: $toDelete
    ) {
      payload
      message
      success
    }
  }
`;

export const FETCH_ALLOWANCE_ITEM = gql`
  query ($filter: String, $page: Int, $pageSize: Int, $allowancePackage: UUID) {
    data: fetchAllowanceItemByPackagePageable(
      filter: $filter
      page: $page
      pageSize: $pageSize
      allowancePackage: $allowancePackage
    ) {
      content {
        id
        name
        allowanceType
        amount
        allowance {
          id
        }
        allowancePackage {
          id
        }
      }
      totalElements
      totalPages
      number
    }
  }
`;

export const UPSERT_ALLOWANCE_PACKAGE_ITEM = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertAllowanceItem(id: $id, fields: $fields) {
      payload {
        id
      }
      message
      success
    }
  }
`;
