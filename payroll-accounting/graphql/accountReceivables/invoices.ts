import { gql } from '@apollo/client'

export const FIND_ONE_INVOICE = gql`
  query ($id: UUID) {
    findOne: findOneInvoice(id: $id) {
      id
      invoiceNo
      invoiceDate
      dueDate
      billingAddress
      arCustomer {
        id
        customerName
        customerType
        otherDetails {
          billingContact {
            street
            barangay
            city
            province
            country
            zipcode
            type
          }
        }
      }
      invoiceType
      vatAmount
      cwtAmount
      isCWT
      cwtRate
      isVatable
      discountAmount
      totalAmountDue
      reference
      notes
      status
      ledgerId
      netTotalAmount
    }
  }
`

export const FIND_ONE_INVOICE_ITEM = gql`
  query ($id: UUID) {
    invoiceItem: findOneInvoiceItems(id: $id) {
      id
      recordNo
      invoiceNo
      arInvoice {
        id
      }
      arCustomer {
        id
        customerName
      }
      itemName
      description
      itemType
      unitPrice
      quantity
      discountAmount
      cwtAmount
      isCWT
      isVatable
      vatAmount
      totalAmountDue
      status
      reference_transfer_id
    }
  }
`

export const FIND_ALL_INVOICE = gql`
  query (
    $search: String
    $page: Int
    $size: Int
    $customerId: UUID
    $status: String
  ) {
    invoices: findAllInvoice(
      search: $search
      page: $page
      size: $size
      customerId: $customerId
      status: $status
    ) {
      content {
        id
        invoiceNo
        invoiceDate
        dueDate
        invoiceType
        arCustomer {
          id
          customerName
          customerType
        }
        cwtAmount
        isCWT
        isVatable
        discountAmount
        totalAmountDue
        reference
        notes
        status
        netTotalAmount
      }
      totalElements
      number
      totalPages
    }
  }
`

export const INVOICE_PAGE = gql`
  query (
    $search: String
    $page: Int
    $size: Int
    $customerId: UUID
    $status: String
  ) {
    invoices: findAllInvoice(
      search: $search
      page: $page
      size: $size
      customerId: $customerId
      status: $status
    ) {
      content {
        id
        invoiceNo
        invoiceDate
        dueDate
        invoiceType
        arCustomer {
          id
          customerName
        }
        totalAmountDue
        status
        netTotalAmount
      }
      totalElements
      number
      totalPages
    }
  }
`

export const PATIENTS = gql`
  query ($filter: String) {
    patients: filterPatientsPageable(filter: $filter, page: 0, pageSize: 50) {
      content {
        value: id
        label: fullName
      }
      number
      totalPages
    }
  }
`

export const FOLIO = gql`
  query ($patientId: UUID) {
    folio: billingByPatient(patientId: $patientId) {
      value: id
      label: billingNo
    }
  }
`

export const CLAIMS_ITEMS = gql`
  query (
    $filter: String
    $filterType: String
    $companyId: UUID
    $startDate: String
    $endDate: String
    $page: Int
    $size: Int
  ) {
    getArAccountsItems(
      filter: $filter
      filterType: $filterType
      companyId: $companyId
      startDate: $startDate
      endDate: $endDate
      page: $page
      size: $size
    ) {
      content {
        id
        recordNo
        approvalCode
        transactionDate
        billingNo
        caseNo
        patient
        description
        amount
      }
      page
    }
  }
`
export const CLAIMS_TOTAL = gql`
  query (
    $filter: String
    $filterType: String
    $companyId: UUID
    $startDate: String
    $endDate: String
    $page: Int
  ) {
    getArAccountsItemsTotal(
      filter: $filter
      filterType: $filterType
      companyId: $companyId
      startDate: $startDate
      endDate: $endDate
      page: $page
    ) {
      number
      totalElements
    }
  }
`

export const DEDUCTION_CLAIMS_ITEMS = gql`
  query (
    $companyId: String
    $billingItemType: [String]
    $registryType: String
    $filter: String
    $filterType: String
    $dateType: String
    $filterDate: String
    $page: Int
    $size: Int
  ) {
    billingItem: billingItemsClaims(
      companyId: $companyId
      billingItemType: $billingItemType
      filter: $filter
      filterType: $filterType
      dateType: $dateType
      filterDate: $filterDate
      registryType: $registryType
      page: $page
      size: $size
    ) {
      dataSource: content {
        id
        recordNo
        description
        amount: credit
        itemType
        status
        approvalCode
        transactionDate
        billing {
          id
          billingNo
          patient {
            id
            patientNo
            fullName
            address
          }
          patientCase {
            id
            caseNo
            admissionDatetime
            dischargedDatetime
            registryType
          }
        }
      }
      totalPages
      number
    }
  }
`

export const FIND_ALL_INVOICE_ITEMS_BY_CUSTOMER = gql`
  query (
    $search: String
    $customerId: UUID
    $invoiceId: UUID
    $page: Int
    $size: Int
    $status: String
  ) {
    invoiceItems: findInvoiceItemsByCustomer(
      search: $search
      customerId: $customerId
      invoiceId: $invoiceId
      page: $page
      size: $size
      status: $status
    ) {
      dataSource: content {
        id
        recordNo
        invoiceNo
        arInvoice {
          id
          invoiceNo
          dueDate
        }
        arCustomer {
          id
          customerName
        }
        itemName
        description
        itemType
        unitPrice
        quantity
        discountAmount
        cwtAmount
        isCWT
        totalAmountDue
        netTotalAmount
        status
        reference_transfer_id
      }
      number
      totalPages
      totalElements
    }
  }
`

export const FIND_ALL_INVOICE_ITEMS = gql`
  query ($invoiceId: UUID) {
    invoiceItems: findAllInvoiceItemsByInvoice(invoiceId: $invoiceId) {
      id
      recordNo
      invoiceNo
      transactionDate
      invoiceParticulars {
        itemName
        description
        salePrice
      }
      arInvoice {
        id
      }
      arCustomer {
        id
        customerName
      }
      itemName
      description
      itemType
      unitPrice
      quantity
      discountAmount
      cwtAmount
      isCWT
      vatAmount
      totalPayments
      netTotalAmount
      totalAmountDue
      status
      reference_transfer_id
      createdDate
    }
  }
`

export const FIND_INVOICE_ITEMS_PAGE = gql`
  query ($search: String, $invoiceId: UUID, $page: Int, $size: Int) {
    invoiceItems: findInvoiceItemsByInvoice(
      search: $search
      invoiceId: $invoiceId
      page: $page
      size: $size
    ) {
      dataSource: content {
        id
        recordNo
        invoiceNo
        arInvoice {
          id
        }
        arCustomer {
          id
          customerName
        }
        itemName
        description
        itemType
        unitPrice
        quantity
        discountAmount
        cwtAmount
        isCWT
        vatAmount
        totalAmountDue
        status
        reference_transfer_id
      }
      number
      totalPages
    }
  }
`
// MUTATION -----------------------------------------

export const CREATE_INVOICE = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createInvoice(id: $id, fields: $fields) {
      success
      message
      response {
        id
        invoiceNo
        invoiceDate
        dueDate
        billingAddress
        arCustomer {
          id
          customerName
          customerType
          otherDetails {
            billingContact {
              street
              barangay
              city
              province
              country
              zipcode
              type
            }
          }
        }
        invoiceType
        vatAmount
        cwtAmount
        isCWT
        cwtRate
        isVatable
        discountAmount
        totalAmountDue
        reference
        notes
        status
        ledgerId
        netTotalAmount
      }
    }
  }
`

export const SUBMIT_INVOICE = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $entryPosting: Boolean
  ) {
    invoice: invoicePosting(
      id: $id
      fields: $fields
      entryPosting: $entryPosting
    ) {
      success
      message
      response {
        id
      }
    }
  }
`

export const CREATE_EMPTY_INVOICE = gql`
  mutation ($customerId: UUID) {
    invoice: createEmptyInvoice(customerId: $customerId) {
      response {
        id
        invoiceNo
        arCustomer {
          id
          customerName
          customerType
        }
      }
      success
      message
    }
  }
`

export const ADD_INVOICE_CLAIMS_ITEMS = gql`
  mutation ($invoiceId: UUID, $billingItemId: UUID) {
    addInvoiceClaimsItem(invoiceId: $invoiceId, billingItemId: $billingItemId) {
      success
      response {
        id
        transactionDate
        itemName
        description
        itemType
        quantity
        unitPrice
        netTotalAmount
        totalAmountDue
        vatAmount
        cwtAmount
      }
      message
    }
  }
`

export const ADD_INVOICE_TRANSFER_ITEMS = gql`
  mutation ($invoiceId: UUID, $creditNoteItemId: UUID) {
    addTransferItem(
      invoiceId: $invoiceId
      creditNoteItemId: $creditNoteItemId
    ) {
      success
      response {
        id
      }
      message
    }
  }
`

export const ADD_INVOICE_ITEMS = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    addInvoiceItem(id: $id, fields: $fields) {
      success
      response {
        id
        transactionDate
        invoiceParticulars {
          itemName
          description
          salePrice
        }
        itemName
        description
        quantity
        unitPrice
        netTotalAmount
        totalAmountDue
        vatAmount
        cwtAmount
      }
      message
    }
  }
`
export const GENERATE_INVOICE_TAX = gql`
  mutation (
    $invoiceId: UUID
    $taxType: String
    $rate: BigDecimal
    $isApply: Boolean
  ) {
    invoiceTax: generateInvoiceTax(
      invoiceId: $invoiceId
      taxType: $taxType
      rate: $rate
      isApply: $isApply
    ) {
      response
      success
      message
    }
  }
`

export const GENERATE_INVOICE_VAT = gql`
  mutation ($invoiceId: UUID, $isVatable: Boolean, $vatValue: BigDecimal) {
    invoiceVat: generateInvoiceVat(
      invoiceId: $invoiceId
      isVatable: $isVatable
      vatValue: $vatValue
    ) {
      response
      success
      message
    }
  }
`

export const REMOVE_INVOICE_ITEM = gql`
  mutation ($id: UUID) {
    invoiceItem: removeInvoiceItem(id: $id) {
      response {
        id
        transactionDate
        itemName
        description
        quantity
        unitPrice
        netTotalAmount
        totalAmountDue
        vatAmount
        cwtAmount
      }
      success
      message
    }
  }
`

export const VOID_INVOICE = gql`
  mutation ($id: UUID) {
    invoice: invoiceVoidPosting(id: $id) {
      response {
        id
      }
      success
      message
    }
  }
`

export const DOCTORS = gql`
  query GetEmployeeIsActiveAndIncludeInPayroll(
    $filter: String
    $size: Int
    $page: Int
    $department: UUID
    $option: String
  ) {
    doctors: getEmployeeIsActiveAndIncludeInPayroll(
      filter: $filter
      size: $size
      page: $page
      department: $department
      option: $option
    ) {
      content {
        fullName
        id
      }
    }
  }
`
