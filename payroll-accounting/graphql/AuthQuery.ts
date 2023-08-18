import { gql } from "@apollo/client";

export const GET_ACCOUNT = gql`
  {
    account {
      id
      fullName
      initialName
      gender
      user {
        access
        roles
        password
        login
        activated
      }
      position {
        id
        description
      }
      office {
        id
        officeDescription
      }
    }
  }
`;
