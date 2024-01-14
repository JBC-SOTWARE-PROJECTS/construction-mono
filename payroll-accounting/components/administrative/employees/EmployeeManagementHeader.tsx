import EmployeeFilter from "@/components/common/EmployeeFilter";
import EmployeeDrawer from "@/components/payroll/EmployeeDrawer";
import { Employee } from "@/graphql/gql/graphql";
import useGetEmployeesBasic from "@/hooks/employee/useGetEmployeesBasic";
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-components";
import { Breadcrumb, Dropdown } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
interface IParams {
  title?: string;
  children?: any;
}

function EmployeeManagementHeader({ title, children }: IParams) {
  const router = useRouter();

  const basePathName = "/payroll/employees/[id]";
  const basePath = `/payroll/employees/${router?.query?.id}`;
  const [employeeList, loading, setFilters] = useGetEmployeesBasic();
  const pathname = router.pathname;

  const menus = [
    {
      key: `${basePath}/attendance`,
      title: "Attendance",
      path: `${basePath}/attendance`,
      disabled: pathname === `${basePathName}/attendance`,
    },
    {
      key: `${basePath}/loans`,
      title: "Loans",
      path: `${basePath}/loans`,
      disabled: pathname === `${basePathName}/loans`,
    },
    {
      key: `${basePath}/leave`,
      title: "Leave",
      path: `${basePath}/leave`,
      disabled: pathname === `${basePathName}/leave`,
    },
    {
      key: `${basePath}/allowance`,
      title: "Allowance",
      path: `${basePath}/allowance`,
      disabled: pathname === `${basePathName}/allowance`,
    },
  ];

  const routes = [
    {
      path: basePath,
      breadcrumbName: "Employee Management",
    },
    {
      path: "module",
      breadcrumbName: title,
      items: menus?.map(({ title: key, path, disabled }) => ({
        key,
        label: (
          <Link href={path} passHref legacyBehavior>
            <a>{key}</a>
          </Link>
        ),
        disabled,
      })),
    },
  ];
  return (
    <PageHeader
      title={
        basePathName === pathname ? (
          title
        ) : (
          <Breadcrumb
            itemRender={(route: any, params: any, routes: any, paths: any) => {
              const { items, breadcrumbName } = route;
              return route.path === "module" ? (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <span style={{ cursor: "pointer" }}>
                    {breadcrumbName}
                    <span style={{ marginLeft: 5 }}>
                      <DownOutlined />
                    </span>
                  </span>
                </Dropdown>
              ) : (
                <Link href={`/${paths.join("/")}`} passHref legacyBehavior>
                  <a>{route.breadcrumbName}</a>
                </Link>
              );
            }}
            items={routes}
          />
        )
      }
      extra={
        <>
          <EmployeeDrawer
            selectedEmployees={employeeList as Employee[]}
            loading={false}
            usage="EMPLOYEE_SWITCHING"
            icon={<SwapOutlined />}
            onSelect={(employee) => {
              console.log(
                router.push({
                  pathname: router?.pathname,
                  query: { id: employee?.id },
                })
              );
            }}
            selectedRowKeys={[router?.query?.id] as string[]}
            setFilters={setFilters}
          >
            Switch Employee
          </EmployeeDrawer>
        </>
      }
    >
      {children}
    </PageHeader>
  );
}

export default EmployeeManagementHeader;
