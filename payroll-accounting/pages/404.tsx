import { Result, Button } from "antd";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => router.back()}>
            Back to Previous Page
          </Button>
        }
      />
    </div>
  );
}
