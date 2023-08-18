import { Billing } from '@/graphql/gql/graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { createContext, useMemo, useState } from 'react';

const INITIAL_VALUE = {
    billingRecord: {},
    setValue: () => { }
}

export const BillingContext = createContext<any>(INITIAL_VALUE);

export const BillingContextProvider: any = (props: any) => {
    const [billingRecord, setBillingRecord] = useState<any>();

    const bilingDetails = useMemo(
        () => ({ billingRecord, setBillingRecord }),
        [billingRecord]
    );

    // console.log("imContext", billingRecord)

    return (
        <BillingContext.Provider value={{ ...bilingDetails }}>
            {props.children}
        </BillingContext.Provider>
    );
};
