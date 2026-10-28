import { gql, useQuery } from "@apollo/client";
import {
  DollarCircleOutlined,
  RiseOutlined,
  TeamOutlined,
  ToolOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Alert, Card, Col, Row, Skeleton, Statistic, Typography } from "antd";
import { useRouter } from "next/router";

interface AssetDashboardSummary {
  totalExpenses: number | string;
  totalLaborCost: number | string;
  totalRentalFee: number | string;
  grossRentalSales: number | string;
  netSales: number | string;
}

interface AssetDashboardData {
  assetDashboardSummary?: AssetDashboardSummary | null;
}

const GET_ASSET_DASHBOARD_SUMMARY = gql`
  query AssetDashboardSummary($asset: UUID) {
    assetDashboardSummary(asset: $asset) {
      totalExpenses
      totalLaborCost
      totalRentalFee
      grossRentalSales
      netSales
    }
  }
`;

const currencyFormatter = (value?: string | number) =>
  Number(value ?? 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function AssetDashboard() {
  const router = useRouter();
  const assetId = typeof router.query.id === "string" ? router.query.id : undefined;
  const { data, loading, error } = useQuery<AssetDashboardData>(
    GET_ASSET_DASHBOARD_SUMMARY,
    {
      variables: { asset: assetId },
      skip: !assetId,
      fetchPolicy: "network-only",
    }
  );

  const summary = data?.assetDashboardSummary;
  const netSales = Number(summary?.netSales ?? 0);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load the asset dashboard"
        description="Please refresh the page or contact the administrator if the problem continues."
      />
    );
  }

  const cards = [
    {
      title: "Total Expenses",
      value: summary?.totalExpenses,
      icon: <ToolOutlined />,
      color: "#cf1322",
    },
    {
      title: "Total Labor Cost",
      value: summary?.totalLaborCost,
      icon: <TeamOutlined />,
      color: "#d46b08",
    },
    {
      title: "Total Rental Fees",
      value: summary?.totalRentalFee,
      icon: <WalletOutlined />,
      color: "#1677ff",
    },
    {
      title: "Gross Rental Sales",
      value: summary?.grossRentalSales,
      icon: <RiseOutlined />,
      color: "#389e0d",
    },
    {
      title: "Net Sales",
      value: summary?.netSales,
      icon: <DollarCircleOutlined />,
      color: netSales < 0 ? "#cf1322" : "#08979c",
    },
  ];

  return (
    <Card
      title="Financial Overview"
      extra={
        <Typography.Text type="secondary">
          All recorded vehicle usage
        </Typography.Text>
      }>
      <Row gutter={[16, 16]}>
        {cards.map((card, index) => (
          <Col key={card.title} xs={24} sm={12} xl={index < 3 ? 8 : 12}>
            <Card size="small" bordered style={{ height: "100%" }}>
              <Statistic
                title={card.title}
                value={Number(card.value ?? 0)}
                prefix={
                  <span style={{ color: card.color }}>
                    {card.icon} Php
                  </span>
                }
                formatter={(value) => currencyFormatter(value)}
                valueStyle={{ color: card.color, fontWeight: 600 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Alert
        className="mt-4"
        type={netSales < 0 ? "warning" : "info"}
        showIcon
        message="Net sales calculation"
        description={`Php ${currencyFormatter(summary?.grossRentalSales)} gross rental sales − Php ${currencyFormatter(
          summary?.totalExpenses
        )} expenses − Php ${currencyFormatter(summary?.totalLaborCost)} labor cost = Php ${currencyFormatter(
          summary?.netSales
        )}`}
      />
    </Card>
  );
}
