import { Button, Tooltip } from "antd";
import React from "react";
import styled from "styled-components";

interface IProps {
  children: string | React.ReactNode;
  onClick: () => void;
}

export default function ButtonPosted({ children, onClick }: IProps) {
  return (
    <Tooltip title="Click to View Journal Account">
      <ButtonStyled type="link" onClick={onClick}>
        {children}
      </ButtonStyled>
    </Tooltip>
  );
}

const ButtonStyled = styled(Button)`
  height: fit-content !important;
  padding: 0 !important;
  font-size: 13px !important;
  color: #52c41a !important;
`;
