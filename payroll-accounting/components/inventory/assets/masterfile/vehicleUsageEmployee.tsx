import React, { useContext, useEffect, useRef, useState } from "react";
// import type { GetRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from "antd";
import type { FormInstance } from "antd/es/form";
import type { InputRef } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { Employee, VehicleUsageEmployee } from "@/graphql/gql/graphql";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormDateTimePicker from "@/components/common/formDateTimePicker/formDateTimePicker";
import dayjs from "dayjs";


// type InputRef = GetRef<typeof Input>;
// type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

export const VUDesignationList = ["DRIVER", "CHECKER", "ASSISTANT"];

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof VehicleUsageEmployee;
  record: VehicleUsageEmployee;
  handleSave: (record: VehicleUsageEmployee) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    dayjs.locale('en');
    setEditing(!editing);
   

    if(dataIndex == "timeRenderedEnd" || dataIndex == "timeRenderedStart"){

      form.setFieldsValue({ [dataIndex]: dayjs(record[dataIndex])});
    }else{
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
   // form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      var values = await form.validateFields();
     
      var objName = Object.keys(values)[0];
      if(objName == "timeRenderedEnd" || objName == "timeRenderedStart"){

        values = {
          [objName] : dayjs(values[objName]).format("MMMM D, YYYY, h:mm:ss A").toString()
        }
      }
      

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  var designationOpts = VUDesignationList.map((item: string) => {
    return {
      value: item,
      label: item,
    };
  });

  let childNode = children;

  if (editable) {
   

    if (editing) {
      switch (dataIndex) {
        case "designation":
          childNode = (
            
              <FormSelect
                ref={inputRef}
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                  {
                    required: true,
                    message: `${title} is required.`,
                  },
                ]}
                propsselect={{
                  options: designationOpts,
                  allowClear: true,
                  placeholder: "Select day",
                  onBlur: save,
                  onChange: save
                }}
               
                 
              />
          
          );
          break;
        case "timeRenderedStart":
        case "timeRenderedEnd":
          childNode = (
           
              <FormDateTimePicker
                name={dataIndex}
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: `${title} is required.`,
                    
                  },
                ]}
                propstimepicker={{
                  showTime: { format: "h:mm:ss A" },
                  format: "MMMM D, YYYY, h:mm:ss A",
                  onBlur: save
                }}
                ref={inputRef}
                
              />
            
          );
          break;
        default:
          childNode = (
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex}
              rules={[
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ]}
            >
              <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
          );
          break;
      }
    } else {
      childNode = (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}
        >
          {children }
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  fullName: string;
  designation: string | null;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
type Iprops = {
  selectedEmps: VehicleUsageEmployee[];
  handleSelected: (record : VehicleUsageEmployee[])=>void;
  handleDeleted: (deleted : string)=>void
};

const VehicleUsageEmployeeTable = ({ selectedEmps, handleSelected, handleDeleted }: Iprops) => {
  const [dataSource, setDataSource] =
    useState<VehicleUsageEmployee[]>(selectedEmps);

  useEffect(() => {
    handleSet(selectedEmps);
  }, [selectedEmps]);



  const [count, setCount] = useState(2);

  const handleDelete = (employee: string, id: string) => {
    const newData = dataSource.filter((item) => item.employee?.id !== employee);
    if(id){
      handleDeleted(id)
    }
    
    handleSet(newData);
  };

  const handleSet = (employees: VehicleUsageEmployee[]) => {
    
    setDataSource(employees);
    handleSelected(employees);
  };


  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Name",
      dataIndex: "fullName",
      width: "20%",

      render: (_, record: VehicleUsageEmployee) => (
        <span>{record.employee?.fullName}</span>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      editable: true,
      width: "15%",
    },
    {
      title: "Time Rendered Start",
      dataIndex: "timeRenderedStart",
      editable: true,
      width: "20%",
    },
    {
      title: "Time Rendered End",
      dataIndex: "timeRenderedEnd",
      editable: true,
      width: "20%",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      editable: true,
      width: "15%",
    },
    {
      title: "Action",
      dataIndex: "operation",
      width: "10%",
      render: (_, record: VehicleUsageEmployee) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record?.employee?.id, record?.id)}
          >
            <DeleteFilled color="red-6" />
          </Popconfirm>
        ) : null,
    },
  ];

  //   const handleAdd = () => {
  //     const newData: DataType = {
  //       key: count,
  //       name: `Edward King ${count}`,
  //       age: '32',
  //       address: `London, Park Lane no. ${count}`,
  //     };
  //     setDataSource([...dataSource, newData]);
  //     setCount(count + 1);
  //   };

  const handleSave = (row: VehicleUsageEmployee) => {
    const newData = [...dataSource];
    const index = newData.findIndex(
      (item: VehicleUsageEmployee) => row.employee?.id === item.employee?.id
    );
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    handleSet(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button> */}
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default VehicleUsageEmployeeTable;
