import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
const IGNORE = gql`
  mutation ($id: UUID) {
    data: ignoreAttendance(id: $id) {
      success
      message
    }
  }
`;

const useIgnoreAttendance = (callBack?: () => void) => {
  const [upsert, { loading }] = useMutation(IGNORE, {
    onCompleted: (value: any) => {
      const data = value?.data || {};
      if (data?.success) {
        message.success(data?.message || "Success!");

        if (callBack) callBack();
      } else {
        message.error(data?.message || "Failed!");
      }
    },
  });

  const ignoreAttendance = (id?: string) => {
    upsert({
      variables: {
        id: id,
      },
    });
  };
  const returnValue: [(id?: string) => void, boolean] = [
    ignoreAttendance,
    loading,
  ];

  return returnValue;
};

export default useIgnoreAttendance;
