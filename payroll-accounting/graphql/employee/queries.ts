import { gql } from "@apollo/client";

export const UPSERT_EMPLOYEE_DOCS = gql`
  mutation ($id: UUID, $employee: UUID, $fields: Map_String_ObjectScalar) {
    upsertEmpDocs(id: $id, employee:$employee fields: $fields) {
        id
        file
        description
        employee{
          id
        }
    }
  }
`;
