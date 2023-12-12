import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query ($id: UUID) {
    itemCategoryActive(id: $id) {
      value: id
      label: categoryDescription
    }
  }
`;

interface IProps {
  groupId: string | null;
}

export function UseItemCategory({ groupId }: IProps) {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      id: groupId,
    },
  });
  const options = data?.itemCategoryActive as OptionsValue[];
  return options;
}
