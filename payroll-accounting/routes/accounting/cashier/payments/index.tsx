import PaymentAuth from "@/context/PaymentAuth";
import { IUserEmployee } from "@/utility/interfaces";
import { Layout } from "antd";
import PaymentTerminal from "./terminal";

const TerminalWindows = (props: IUserEmployee) => {
  return (
    <PaymentAuth>
      <PaymentTerminal {...props} />
    </PaymentAuth>
  );
};

export default TerminalWindows;
