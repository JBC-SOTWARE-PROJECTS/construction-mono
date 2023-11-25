import { gql } from '@apollo/client'

export const FIND_ALL_CUSTOMERS = gql`
  query ($search: String, $page: Int, $size: Int, $type: [String]) {
    findAllCustomers(search: $search, page: $page, size: $size, type: $type) {
      content {
        id
        accountNo
        customerName
        address
        customerType
        otherDetails {
          color
        }
        discountAndPenalties {
          salesAccountCode
        }
      }
      totalElements
      number
      totalPages
    }
  }
`

export const FIND_ALL_DEPARTMENTS = gql`
  query ($filter: String, $page: Int, $pageSize: Int) {
    departments: departmentPage(
      filter: $filter
      page: $page
      pageSize: $pageSize
    ) {
      content {
        id
        departmentCode
        departmentName
      }
      number
      totalPages
    }
  }
`

export const REFERENCE_OPTION = gql`
  query ($search: String, $type: String) {
    options: findAllCustomerReference(search: $search, type: $type) {
      value
      label
    }
  }
`

export const CUSTOMER_BALANCE = gql`
  query ($customerId: UUID) {
    customerBalance: customerRemainingBalance(customerId: $customerId) {
      remainingBalanceSum
    }
  }
`

export const CREATE_CUSTOMER = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    create: createARCustomer(id: $id, fields: $fields) {
      response {
        id
      }
      success
      message
    }
  }
`

export const FIND_ONE_CUSTOMER = gql`
  query ($id: UUID) {
    customer: findOneCustomer(id: $id) {
      id
      accountNo
      customerName
      address
      customerType
      otherDetails {
        color
      }
    }
  }
`

export const FIND_ONE_CUSTOMER_CONTACTS = gql`
  query ($id: UUID) {
    customer: findOneCustomer(id: $id) {
      id
      contactPerson
      contactNo
      contactEmail
      address
    }
  }
`

export const FIND_ONE_CUSTOMER_SETTINGS = gql`
  query ($id: UUID) {
    customer: findOneCustomer(id: $id) {
      id
      otherDetails {
        contacts {
          street
          barangay
          city
          province
          country
          zipcode
          phoneNo
          email
          type
        }
        billingContact {
          street
          barangay
          city
          province
          country
          zipcode
          type
        }
        color
      }
      discountAndPenalties {
        salesAccountCode
        creditLimit
        creditPeriod
        blockOnCreditLimit
        autoDiscountInPayment
        paymentDiscounts {
          rate
          maximumDays
        }
        overduePenalties {
          rate
          maximumDays
        }
      }
    }
  }
`

export const FIND_ONE_OPTION_COMPANY = gql`
  query ($id: UUID) {
    companyAccountById(id: $id) {
      id
      label: companyname
    }
  }
`

export const FIND_ONE_OPTION_SUPPLIER = gql`
  query ($id: UUID) {
    supplierById(id: $id) {
      id
      label: supplierFullname
    }
  }
`
export const FIND_ONE_OPTION_PATIENT = gql`
  query ($id: UUID) {
    patient(id: $id) {
      id
      label: fullName
    }
  }
`

export const FIND_ONE_OPTION_EMPLOYEE = gql`
  query ($id: UUID) {
    employee(id: $id) {
      id
      label: fullName
    }
  }
`
