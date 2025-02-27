import {
  PaymentType,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types";
import {
  GET_CASHIER_EMPLOYEE,
  GET_FOLIO_BY_PROJECTS,
} from "@/graphql/cashier/queries";
import { Billing } from "@/graphql/gql/graphql";

import { client } from "@/utility/graphql-client";
import { OptionProps } from "antd/es/select";
import { DocumentNode } from "graphql";
import { useEffect, useState } from "react";

type CustomerTypes = "HMO" | "CORPORATE" | "PERSONAL" | "PROMISSORY_NOTE";

export interface PaymentPayor {
  id: string;
  name: string;
  description: string;
}
export interface QueryHooksParams<T, D> {
  variables: T;
  onComplete?: (resp?: D | null) => void;
}

interface UseSearchPayorParams {
  filter?: string;
  page?: number;
  size?: number;
  paymentType: PaymentType;
  payorType: PayorType;
  registryType?: string | null;
}

interface PayorQueryVariables {
  filter?: string;
  page?: number;
  size?: number;
  option?: string;
  department?: null;
  registryType?: string | null;
  status?: string | null;
  type?: CustomerTypes;
}

function getQueryFields(variables: UseSearchPayorParams): {
  query: DocumentNode;
  fields: PayorQueryVariables;
} {
  const { payorType, paymentType, registryType, ...otherVar } = variables;
  let query: DocumentNode | null = null;
  let fields: PayorQueryVariables = { page: 0, size: 5, ...otherVar };
  console.log(payorType, "payorType");

  const type = (payorType ?? "").toUpperCase();
  switch (type) {
    case "FOLIO":
      query = GET_FOLIO_BY_PROJECTS;
      fields.option = "";
      fields.department = null;
      break;
    default:
      query = GET_CASHIER_EMPLOYEE;
      fields.registryType = registryType ?? "ALL";
      break;
  }

  return { query, fields };
}

function getMapResult(payorType: PayorType, result: any): PaymentPayor[] {
  let mapResult: PaymentPayor[] = [];
  switch (payorType) {
    case "FOLIO":
      const folio = result as Billing[];
      folio.forEach((element) => {
        const name =
          `${element.billNo} - ${element.customer?.customerName}` as string;
        const description = element?.project?.description ?? ("" as string);
        mapResult.push({
          id: element.id,
          name,
          description,
        });
      });
      break;
    default:
      mapResult = [];
      break;
  }
  return mapResult;
}

export const useSearchPaymentPayor = ({
  variables,
}: QueryHooksParams<UseSearchPayorParams, OptionProps>) => {
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<OptionProps | null>(null);

  const fetchHooks = async (
    fetchProps?: QueryHooksParams<UseSearchPayorParams, OptionProps>
  ) => {
    try {
      const { variables: fetchVar, ...props } = { ...fetchProps };
      const { query, fields } = getQueryFields(fetchVar ?? variables);

      const { data } = await client.query({
        query,
        variables: { ...fields },
      });
      const fetchedPayorData = {
        ...data.payer,
        content: getMapResult(variables?.payorType, data.payer?.content),
      };
      setHooks(fetchedPayorData);
      if (props.onComplete) props.onComplete(fetchedPayorData);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async ({
    variables,
    ...props
  }: QueryHooksParams<UseSearchPayorParams, OptionProps>) => {
    fetchHooks({
      variables,
      ...props,
    });
  };

  useEffect(() => {
    setLoading(true);

    fetchHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables?.filter, variables?.payorType]);
  // Empty dependency array to run only once on component mount

  return { data: hooks, refetch, loading };
};
