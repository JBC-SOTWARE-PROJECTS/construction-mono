import { gql } from '@apollo/client'

export const FIND_ONE_CREDIT_NOTE = gql`
  query ($id: UUID) {
    creditNote: findOneCreditNote(id: $id) {
      id
      billingAddress
      arCustomer {
        id
        customerName
        customerType
      }
      invoiceType
      creditNoteType
      creditNoteNo
      creditNoteDate
      discountAmount
      totalAmountDue
      cwtAmount
      cwtRate
      isCWT
      vatAmount
      isVatable
      reference
      notes
      status
    }
  }
`
export const FIND_ALL_CREDIT_NOTE = gql`
  query (
    $customerId: UUID
    $search: String
    $status: String
    $page: Int
    $size: Int
  ) {
    findAllCreditNote(
      customerId: $customerId
      search: $search
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        arCustomer {
          id
          customerName
          customerType
        }
        creditNoteNo
        creditNoteDate
        discountAmount
        totalAmountDue
        cwtAmount
        isCWT
        reference
        notes
        status
      }
      number
      totalPages
    }
  }
`

export const CHECK_EXISTING_CREDIT_NOTE = gql`
  mutation ($invoiceId: UUID) {
    creditNote: checkExistingCreditNoteForInvoice(invoiceId: $invoiceId) {
      response {
        id
        creditNoteNo
        arInvoice {
          id
          invoiceNo
        }
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

export const UPSERT_CREDIT_NOTE_ITEMS = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertCreditNoteItem(id: $id, fields: $fields) {
      success
      response {
        id
      }
      message
    }
  }
`

export const FIND_ALL_CREDIT_NOTE_ITEMS_BY_CNID = gql`
  query ($id: UUID) {
    creditNoteItems: findCreditNoteItemsByCNId(id: $id) {
      id
      recordNo
      itemType
      itemName
      description
      unitPrice
      quantity
      discountPercentage
      discountAmount
      totalAmountDue
      cwtAmount
      vatAmount
      reference
      accountCode {
        label
        value
      }
      invoiceParticulars {
        itemName
        description
        salePrice
      }
      arInvoiceItem {
        id
      }
      recipientCustomer {
        id
        customerName
        customerType
      }
    }
  }
`

export const FIND_ALL_CREDIT_NOTE_ITEMS = gql`
  query ($id: UUID, $search: String, $page: Int, $size: Int) {
    creditNoteItems: findCreditNoteItems(
      id: $id
      search: $search
      page: $page
      size: $size
    ) {
      dataSource: content {
        id
        recordNo
        itemType
        itemName
        description
        unitPrice
        quantity
        discountPercentage
        discountAmount
        totalAmountDue
        cwtAmount
        vatAmount
        reference
        discountDepartment {
          id
          departmentName
        }
        recipientCustomer {
          id
          customerName
          customerType
        }
      }
      totalPages
      number
    }
  }
`

export const FIND_POSTED_CN_PER_INVOICE = gql`
  query ($invoiceId: UUID) {
    creditNotes: findPostedCNPerInvoice(invoiceId: $invoiceId) {
      id
      creditNoteDate
      discountAmount
      totalAmountDue
      cwtAmount
      isCWT
    }
  }
`

export const FIND_ALL_CREDIT_NOTE_ITEMS_UUID = gql`
  query ($id: UUID) {
    creditNoteItemsUUID: findAllInvoiceItemUUIDById(id: $id)
  }
`

export const FIND_ALL_CREDIT_NOTE_ITEMS_BY_RECIPIENT_CUSTOMER = gql`
  query (
    $arCustomerId: UUID
    $search: String
    $page: Int
    $size: Int
    $itemType: [String]
  ) {
    creditNoteItems: findCreditNoteItemsByCustomer(
      arCustomerId: $arCustomerId
      search: $search
      page: $page
      size: $size
      itemType: $itemType
    ) {
      dataSource: content {
        id
        creditNoteNo
        recordNo
        arCustomer {
          id
          customerName
        }
        itemName
        patient_name
        description
        itemType
        totalAmountDue
      }
      totalPages
      number
      totalElements
    }
  }
`

export const CREATE_CREDIT_NOTE = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    creditNote: createCreditNote(id: $id, fields: $fields) {
      success
      message
      response {
        id
      }
    }
  }
`

export const ADD_CREDIT_NOTE_ITEMS = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    creditNote: addCreditNoteClaimsItem(id: $id, fields: $fields) {
      response {
        id
        invoiceParticulars {
          itemName
          description
          salePrice
        }
      }
      success
      message
    }
  }
`

export const CREDIT_NOTE_POSTING = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    arCreditNotePosting(id: $id, fields: $fields) {
      response {
        id
      }
      success
      message
    }
  }
`

export const REMOVE_CREDIT_NOTE_ITEM = gql`
  mutation ($id: UUID) {
    creditNoteItem: removeCreditNoteItem(id: $id) {
      response {
        id
      }
      success
      message
    }
  }
`

export const GENERATE_CREDIT_NOTE_TAX = gql`
  mutation (
    $creditNoteId: UUID
    $rate: BigDecimal
    $taxType: String
    $isApply: Boolean
  ) {
    creditNoteTax: generateCreditNoteTax(
      creditNoteId: $creditNoteId
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

export const GENERATE_CREDIT_NOTE_VAT = gql`
  mutation ($creditNoteId: UUID, $vatValue: BigDecimal, $isVatable: Boolean) {
    creditNoteVat: generateCreditNoteVat(
      creditNoteId: $creditNoteId
      vatValue: $vatValue
      isVatable: $isVatable
    ) {
      response
      success
      message
    }
  }
`

export const INVOICE_PARTICULAR_OPTIONS_GQL = gql`
  query ($search: String, $page: Int, $size: Int) {
    particulars: findAllInvoiceParticulars(
      search: $search
      page: $page
      size: $size
    ) {
      content {
        value: id
        label: itemName
      }
    }
  }
`

export const ACCOUNT_OPTIONS_GQL = gql`
  query (
    $accountType: String
    $motherAccountCode: String
    $accountCategory: String
    $subaccountType: String
    $accountName: String
    $department: String
    $excludeMotherAccount: Boolean
  ) {
    coaList: getAllChartOfAccountGenerate(
      accountType: $accountType
      motherAccountCode: $motherAccountCode
      subaccountType: $subaccountType
      accountCategory: $accountCategory
      accountName: $accountName
      department: $department
      excludeMotherAccount: $excludeMotherAccount
    ) {
      value: code
      label: accountName
    }
  }
`
