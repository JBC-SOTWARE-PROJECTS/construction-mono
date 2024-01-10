import { ProjectCostRevisions } from "@/graphql/gql/graphql";

export interface ExtendedProjectCostRevisions extends ProjectCostRevisions {
  description: string;
}
