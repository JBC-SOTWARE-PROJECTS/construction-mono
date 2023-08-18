import { Result, Button } from "antd";
import { useRouter } from "next/router";

export default function Custom500() {
  const router = useRouter();
  return (
    <div>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, the server is wrong."
        extra={
          <Button type="primary" onClick={() => router.back()}>
            Back to Previous Page
          </Button>
        }
      />
    </div>
  );
}
