import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ReportGeneratorLayout = asyncComponent(
  () =>
    import(
      '@/routes/accounting/reports/financial-reports/report-generator/layout'
    )
)

const ReportGeneratorLayoutPage = (props: any) => {
  return <ReportGeneratorLayout />
}

export default ReportGeneratorLayoutPage
