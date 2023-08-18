import { Result, Button } from "antd";
import { useRouter } from "next/router";

export default function Custom403() {
  const router = useRouter();
  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => router.back()}>
            Back to Previous Page
          </Button>
        }
      />
    </div>
  );
}
