import React from 'react';
import { Tabs } from 'antd';
import SignatureList from './signatures';
import { useLocalStorage } from "../../../../util/customhooks";


const TabPane = Tabs.TabPane;

const SignatureContent = ({ account }) => {

    const [active, setActive] = useLocalStorage('signatureTab', 'pr');

    const callback = (e) => {
        setActive(e)
    }

    return (
        <Tabs onChange={callback} type="card" destroyInactiveTabPane={true} activeKey={active}>
            <TabPane tab="Purchase Request Signatures" key="pr">
                <SignatureList account={account} type="PR" />
            </TabPane>
            <TabPane tab="Purchase Order Signatures" key="po">
                <SignatureList account={account} type="PO" />
            </TabPane>
            <TabPane tab="Delivery Receiving Signatures" key="dr">
                <SignatureList account={account} type="DR" />
            </TabPane>
        </Tabs>
    )
};

export default SignatureContent;
