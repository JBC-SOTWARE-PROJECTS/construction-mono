import React, { useState } from "react";
import { useModal } from "react-modal-hook";

interface OwnProps {
  onCloseCallback?: Function;
}

const UseDialog = (Component: React.FC<any>) => {
  const [myProps, setMyProps] = useState<OwnProps>({});

  const [show, hide] = useModal(() => {
    return (
      <Component
        hide={(args: any) => {
          hide();
          if (myProps.onCloseCallback) myProps.onCloseCallback(args);
        }}
        {...myProps}
      />
    );
  }, [myProps]);

  return (props: any, onCloseCallback: Function) => {
    let tProps = props || {};
    if (onCloseCallback) tProps.onCloseCallback = onCloseCallback;

    setMyProps(tProps);

    show();
  };
};

export default UseDialog;
