import { post } from "@/utility/graphql-client";
import { useRouter } from "next/router";

const useLogout = () => {
  const router = useRouter();
  const logOut = () => {
    post("/api/logout")
      .then((response) => {
        console.log(response);
        router.push("/login");
      })
      .catch((error) => {})
      .finally(() => {
        console.log("logout successfull");
      });
  };

  return logOut;
};

export default useLogout;
