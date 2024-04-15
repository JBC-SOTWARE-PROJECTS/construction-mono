import React from "react";
import { Tooltip } from "antd";
import { QuestionCircleFilled, EditFilled } from "@ant-design/icons";

export default function ColTitlePopUp({ descripton, popup, editable }) {
  return (
    <span>
      {descripton}
      {popup && (
        <Tooltip title={popup} color="cyan" key={"popover"}>
          &nbsp;
          <QuestionCircleFilled style={{ color: "#2db7f5" }} />
        </Tooltip>
      )}
      {editable && (
        <Tooltip
          title={"Editable (double click to edit)"}
          color="blue"
          key={"popoverEditable"}
        >
          &nbsp;
          <EditFilled style={{ color: "#108ee9" }} />
        </Tooltip>
      )}
    </span>
  );
}
