import { gql, useMutation, useQuery } from "@apollo/client";
import { InputNumber, message } from "antd";
import { useState } from "react";

const inputStyle = { margin: 0, padding: 0, width: "100%" };

const useManageTableMatrix = ({ upsertGQL, queryGQL, initialValues }: any) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [editableRow, setEditableRow] = useState<any | [] | {}>(initialValues);

  const UPSERT_CONTRIBUTION = gql`
    ${upsertGQL}
  `;

  const GET_CONTRIBUTIONS = gql`
    ${queryGQL}
  `;

  const {
    data,
    loading: loadingQuery,
    refetch,
  } = useQuery(GET_CONTRIBUTIONS, {
    onCompleted: (res: any) => {
      if (res.list) {
        setDataSource([...res.list]);
      }
    },
  });

  const [upsert, { loading: loadingUpsert }] = useMutation(
    UPSERT_CONTRIBUTION,
    {
      onCompleted: (data: any) => {
        message[data?.result?.success ? "success" : "error"](
          data.result?.message
        );
        if (data?.result?.success) {
          setIsEditing(false);
          setEditableRow(initialValues);
          refetch();
        }
      },
      onError: () => {
        message.error("Something went wrong. Please try again later.");
      },
    }
  );

  const handleClickAdd = (type: string) => {
    setIsEditing(true);
    const row = {
      isEditable: true,
      ...(type ? { type } : {}),
    };
    // setEditableRow(row);
    setDataSource([row, ...dataSource]);
  };

  const handleEdit = (record: any) => {
    setIsEditing(true);
    setDataSource(
      dataSource.map((item: any) =>
        item.id === record.id ? { ...item, isEditable: true } : item
      )
    );
    setEditableRow({ ...record });
  };

  const handleSave = () => {
    if (editableRow.minAmount > editableRow.maxAmount) {
      message.error(
        "The minumum amount can't be greater than the maximum amount."
      );
      return;
    }

    if (editableRow.minAmount === 0 && editableRow.maxAmount === 0) {
      message.error(
        "The minumum amount and max amount can't both be zero (0)."
      );
      return;
    }

    upsert({
      variables: {
        fields: editableRow,
        id: editableRow?.id || null,
      },
    });
  };

  const handleCancelEdit = () => {
    setEditableRow(initialValues);
    setIsEditing(false);
    if (editableRow?.id) {
      setDataSource([...data.list]);
    } else {
      setDataSource(dataSource.filter((item: any) => !item.isEditable));
    }
  };

  const handleChangeInput = (value: any, property: any) => {
    setEditableRow({ ...editableRow, [property]: value });
  };

  const renderInput = (property: any, suffix: string) => {
    return (
      <InputNumber
        min={0}
        // useNative
        size="small"
        style={{ ...inputStyle }}
        value={editableRow[property]}
        onChange={(value: any) => {
          handleChangeInput(value, property);
        }}
        suffix={suffix}
      ></InputNumber>
    );
  };

  return [
    dataSource,
    loadingQuery || loadingUpsert,
    {
      isEditing,
      editableRow,
      handleClickAdd,
      handleEdit,
      handleSave,
      handleCancelEdit,
      renderInput,
    },
  ];
};

export default useManageTableMatrix;
