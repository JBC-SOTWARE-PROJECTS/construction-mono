import { Layout, message } from "antd";
import { createContext, useContext, useEffect } from "react";
import {
  PaymentQuickOptions,
  TerminalWindowPageProps,
  TerminalWindowProps,
  TerminalWindowsFooterProps,
  TerminalWindowsHeaderProps,
  TerminalWindowsPaymentMethod,
  TerminalWindowsPayor,
} from "./data-types/interfaces";
import TerminalWindowContents from "./layout/content";
import TerminalWindowAmountTendered from "./layout/content/body/amount-tendered";
import TerminalWindowPaymentMethod from "./layout/content/body/payment-methods";
import TerminalWindowPayor from "./layout/content/body/payor";
import TerminalWindowsQuickOption from "./layout/content/quick-option";
import TerminalWindowFooter from "./layout/footer";
import TerminalWindowHeader from "./layout/header";
import {
  setHeaderProps,
  setPaymentMethodProps,
  setPayorProps,
  setQuickOptionsProps,
} from "./utils";
import PaymentAuth from "@/context/PaymentAuth";

export const TerminalWindowContext = createContext<TerminalWindowProps | null>(
  null
);

const TerminalWindow = ({ children, ...props }: TerminalWindowPageProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Layout>
      <TerminalWindowContext.Provider value={{ ...props, messageApi }}>
        {children}
        {contextHolder}
      </TerminalWindowContext.Provider>
    </Layout>
  );
};

const Header = () => {
  const context = useContext(TerminalWindowContext);

  if (context) {
    const header: TerminalWindowsHeaderProps = setHeaderProps(context);
    return <TerminalWindowHeader {...header} />;
  }
};

const Content = () => {
  return <TerminalWindowContents />;
};

const Footer = () => {
  const context = useContext(TerminalWindowContext);

  const footer: TerminalWindowsFooterProps = {
    ...context?.terminalDetails,
  };

  return <TerminalWindowFooter {...footer} />;
};

const Payor = () => {
  const context = useContext(TerminalWindowContext);

  if (context) {
    const payor: TerminalWindowsPayor = setPayorProps(context);
    return <TerminalWindowPayor {...payor} />;
  }
};

const AmountTendered = () => {
  const context = useContext(TerminalWindowContext);

  if (context)
    return (
      <TerminalWindowAmountTendered
        {...{
          form: context.form,
          amountSummary: context.amountSummary,
          totalAmountTendered: context.totalAmountTendered,
        }}
      />
    );
};

const PaymentMethod = () => {
  const context = useContext(TerminalWindowContext);

  if (context) {
    const paymentMethod: TerminalWindowsPaymentMethod =
      setPaymentMethodProps(context);
    return <TerminalWindowPaymentMethod {...paymentMethod} />;
  }
};

const QuickOptions = () => {
  const context = useContext(TerminalWindowContext);

  if (context) {
    const quickOptions: PaymentQuickOptions = setQuickOptionsProps(context);
    return <TerminalWindowsQuickOption {...quickOptions} />;
  }
};

TerminalWindow.Header = Header;
TerminalWindow.Content = Content;
TerminalWindow.Footer = Footer;

// Content Sub components
TerminalWindow.QuickOptions = QuickOptions;

// Body Sub components
TerminalWindow.Payor = Payor;
TerminalWindow.AmountTendered = AmountTendered;
TerminalWindow.PaymentMethod = PaymentMethod;

export default TerminalWindow;
