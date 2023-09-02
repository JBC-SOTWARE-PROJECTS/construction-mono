import { IPageProps } from "@/utility/interfaces";
import { UploadOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Button, Table, Upload } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import { useState } from "react";

interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

export default function UploadBiometricData({ account }: IPageProps) {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const text = await readFileContents(file);
        const parsedData = parseDatToJson(text);
        setJsonData(parsedData);
      } catch (error) {
        console.error("Error reading or parsing file:", error);
      }
    }
  };

  const readFileContents = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) =>
        resolve(event.target.result);
      reader.onerror = (event) => reject(event.target.error);
      reader.readAsText(file);
    });
  };

  const parseDatToJson = (datText: string) => {
    const lines = datText.split("\n");

    const jsonData = [];

    for (let i = 0; i < lines.length; i++) {
      const values = lines[i].split("\t");

      const entry = {};
      for (let j = 0; j < values.length; j++) {
        const cleanedValue = values[j].trim().replace(/\r/g, "");

        // Format the date and time string if it's in the 2nd column (index 1)
        if (j === 1) {
          entry[j + 1] = dayjs(cleanedValue).format("YYYY-MM-DD hh:mm:ss a");
        } else {
          entry[j + 1] = cleanedValue;
        }
      }

      jsonData.push(entry);
    }

    setJsonData(jsonData);
    return jsonData;
    // Implement your parsing logic here
    // This could be similar to the previous example
    // where you split lines and parse fields accordingly
    // Return the parsed JSON data
  };

  const columns = [
    {
      title: "Employee No",
      dataIndex: "1",
      key: "1",
    },
    {
      title: "Time",
      dataIndex: "2",
      key: "2",
    },
    ,
    {
      title: "Unkown Column 1",
      dataIndex: "3",
      key: "3",
    },
    {
      title: "Unkown Column 2",
      dataIndex: "4",
      key: "4",
    },
    {
      title: "Unkown Column 3",
      dataIndex: "5",
      key: "5",
    },
    {
      title: "Unkown Column 4",
      dataIndex: "6",
      key: "6",
    },
  ];
  return (
    <PageContainer title="Upload Biometric Data">
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        extra={<></>}
      >
        <Head>
          <title>Upload Biometric Data</title>
        </Head>

        <input
          style={{
            border: "none",
            outline: "none",
            flex: "1",
            padding: "6px 12px",
          }}
          type="file"
          accept=".dat"
          onChange={handleFileUpload}
        ></input>

        <br />

        <Table dataSource={jsonData} columns={columns} />
      </ProCard>
    </PageContainer>
  );
}
