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
    {
      title: "Total Rental Fees",
      value: summary?.totalRentalFee,
      icon: <WalletOutlined />,
      color: "#3e424b",
    },
    {
      title: "Usage Expenses",
      value: summary?.totalExpenses,
      icon: <ToolOutlined />,
      color: "#3e424b",
    },
    {
      title: "Labor Cost",
      value: summary?.totalLaborCost,
      icon: <TeamOutlined />,
      color: "#3e424b",
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
          <Col key={card.title} xs={24} sm={12} xl={index < 2 ? 12 : 8}>
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

      
    </Card>
  );
}
