import React from "react";
import { Tooltip } from "antd";
import { QuestionCircleFilled, EditFilled } from "@ant-design/icons";

interface IProps {
  descripton: string;
  popup?: string;
  editable?: boolean;
}

export default function ColTitlePopUp({ descripton, popup, editable }: IProps) {
  return (
    <span>
      {descripton}
      {popup && (
        <Tooltip title={popup} color="green" key={"popover"}>
          &nbsp;
          <QuestionCircleFilled style={{ color: "#fff" }} />
        </Tooltip>
      )}
      {editable && (
        <Tooltip
          title={"Editable (double click to edit)"}
          color="blue"
          key={"popoverEditable"}>
          &nbsp;
          <EditFilled style={{ color: "#fff" }} />
        </Tooltip>
      )}
    </span>
  );
}
