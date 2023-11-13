import moment from 'moment'
import {
  CREATE_CREDIT_NOTE,
  FIND_ALL_CREDIT_NOTE,
  FIND_ALL_CREDIT_NOTE_ITEMS,
  FIND_ONE_CREDIT_NOTE,
  GENERATE_CREDIT_NOTE_TAX,
  GENERATE_CREDIT_NOTE_VAT,
  REMOVE_CREDIT_NOTE_ITEM,
} from '@/graphql/accountReceivables/creditNote'
import { useQuery, useMutation } from '@apollo/client'

export function useFindCreditNote(props: any) {
  const { customerId, page, size, search } = props || {
    customerId: null,
    page: 0,
    size: 10,
    search: '',
  }

  return useQuery(FIND_ALL_CREDIT_NOTE, {
    variables: {
      customerId,
      search,
      page,
      size,
    },
  })
}

export function useFindOneCreditNote(
  id = null,
  props = { onCompleted: () => {} }
) {
  const { onCompleted } = props
  return useQuery(FIND_ONE_CREDIT_NOTE, {
    variables: {
      id,
    },
    onCompleted,
  })
}

export function useFindCreditNoteItems({
  id = null,
  page = 0,
  size = 10,
  search = '',
}) {
  return useQuery(FIND_ALL_CREDIT_NOTE_ITEMS, {
    variables: {
      id,
      search,
      page,
      size,
    },
  })
}

//  USE MUTATION INVOICE
// export function useMutationCreditNote({
//   id = null,
//   getValues = () => {},
//   onCompleted = (props: any) => {},
// }) {
//   const [onSubmitPostCN, mutationData] = useMutation(CREATE_CREDIT_NOTE, {
//     onCompleted: ({ creditNote }: any) => {
//       onCompleted({ ...creditNote })
//     },
//   })

//   const onPostCreditNote = (value, arCustomer = null) => {
//     const { creditNoteDate, reference, notes } = getValues() || {
//       reference: '',
//       notes: '',
//     }

//     const fields = {
//       reference,
//       notes,
//       status: value,
//     }

//     if (creditNoteDate)
//       fields.creditNoteDate = moment(creditNoteDate)
//         .utc()
//         .startOf('day')
//         .format('YYYY-MM-DD')
//     if (arCustomer) fields.arCustomer = arCustomer

//     onSubmitPostCN({
//       variables: {
//         id,
//         fields,
//       },
//     })
//   }
//   return [onPostCreditNote, mutationData]
// }

// //  USE MUTATION INVOICE
// export function useMutationRemoveCreditNoteItem({ onCompleted = () => {} }) {
//   const [onRemove, mutationData] = useMutation(REMOVE_CREDIT_NOTE_ITEM, {
//     onCompleted: ({ creditNoteItem }) => {
//       onCompleted({ ...creditNoteItem })
//     },
//   })

//   function onRemoveItem(id) {
//     onRemove({
//       variables: {
//         id,
//       },
//     })
//   }

//   return [onRemoveItem, mutationData]
// }

// // USE GENERATE CWT
// export function useMutationGenerateCreditNoteTax(props) {
//   const { onCompleted } = props || { onCompleted: () => {} }
//   const [onGenerateTax, mutationData] = useMutation(GENERATE_CREDIT_NOTE_TAX, {
//     onCompleted: ({ creditNoteTax }) => {
//       onCompleted(creditNoteTax)
//     },
//   })

//   const onSelectTax = (id, value, isApply) => {
//     onGenerateTax({
//       variables: {
//         creditNoteId: id,
//         taxType: value,
//         isApply,
//       },
//     })
//   }

//   return [onSelectTax, mutationData]
// }

// export function useMutationGenerateCreditNoteVat({ onCompleted = () => {} }) {
//   const [onGenerateVat, mutationData] = useMutation(GENERATE_CREDIT_NOTE_VAT, {
//     onCompleted: ({ creditNoteVat }) => {
//       onCompleted(creditNoteVat)
//     },
//   })

//   const onSelectVat = (id, value) => {
//     onGenerateVat({
//       variables: {
//         creditNoteId: id,
//         isVatable: value,
//       },
//     })
//   }

//   return [onSelectVat, mutationData]
// }
