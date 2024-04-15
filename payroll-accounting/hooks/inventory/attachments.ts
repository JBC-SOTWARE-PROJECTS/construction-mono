import { gql, useQuery } from "@apollo/client";
import { Attachments, Query } from "@/graphql/gql/graphql";

const GET_RECORDS = gql`
  query ($refId: UUID) {
    attachmentByRefId(refId: $refId) {
      id
      referenceId
      dateTransact
      folderName
      fileName
      mimetype
      imageUrl
    }
  }
`;

export function UseInventoryAttachments(id?: string) {
  const {
    data,
    loading: loadingAttachments,
    refetch: fetchAttachments,
  } = useQuery<Query>(GET_RECORDS, {
    variables: {
      refId: id,
    },
  });
  const attachments = data?.attachmentByRefId as Attachments[];
  return {
    attachments,
    loadingAttachments,
    fetchAttachments,
  };
}
