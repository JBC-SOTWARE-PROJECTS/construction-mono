import { gql } from "@apollo/client";

//========================= RELEASING OF CHECKS ============================
export const GET_RELEASING_CHECKS = gql`
  query (
    $filter: String
    $bank: UUID
    $supplier: UUID
    $start: String
    $end: String
    $page: Int!
    $size: Int!
  ) {
    releaseChecksFilter(
      filter: $filter
      bank: $bank
      supplier: $supplier
      start: $start
      end: $end
      page: $page
      size: $size
    ) {
      content {
        id
        releaseDate
        check {
          id
          checkNo
          checkDate
          amount
        }
        disbursement {
          disNo
          disDate
          payeeName
        }
        bank {
          id
          bankname
        }
        isPosted
        release_by
      }
      totalElements
      size
      number
    }
  }
`;

export const GET_RECORDS_CHECKS_FILTER = gql`
  query (
    $filter: String
    $bank: UUID
    $start: String
    $end: String
    $page: Int
    $size: Int
  ) {
    checksFilter(
      filter: $filter
      bank: $bank
      start: $start
      end: $end
      page: $page
      size: $size
    ) {
      content {
        id
        disbursement {
          id
          disNo
          payeeName
          disDate
        }
        bank {
          id
          bankname
        }
        checkDate
        checkNo
        amount
      }
      totalElements
      size
      number
    }
  }
`;

export const UPSERT_RELEASE_CHECKS = gql`
  mutation ($fields: [Map_String_ObjectScalar], $date: Instant, $id: UUID) {
    upsertReleaseCheck(fields: $fields, date: $date, id: $id) {
      id
    }
  }
`;
