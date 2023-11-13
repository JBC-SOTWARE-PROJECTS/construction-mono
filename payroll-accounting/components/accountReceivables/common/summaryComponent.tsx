import { ReactNode } from 'react'

interface SummaryI {
  label: string | ReactNode
  value: number | string | ReactNode
  style?: any
}

export const SubSummary = (props: SummaryI) => {
  const { label, value, style } = props
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '10px',
        ...style,
      }}
    >
      <div
        style={{
          padding: '0px 10px 0px 10px',
          textAlign: 'right',
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: '0px 10px 0px 10px',
          textAlign: 'right',
        }}
      >
        {value}
      </div>
    </div>
  )
}

export const TotalSummary = (props: SummaryI) => {
  const { label, value, style } = props

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '10px',
        borderTop: '1px solid black',
        borderBottom: '4px double black',
        fontSize: '24px',
        fontWeight: 'bold',
        ...style,
      }}
    >
      <div
        style={{
          padding: '5px',
          textAlign: 'right',
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: '5px',
          textAlign: 'right',
        }}
      >
        {value}
      </div>
    </div>
  )
}
