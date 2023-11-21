import { ReactNode } from 'react'

interface CustomFieldLabelI {
  formField: () => ReactNode
  formExtra?: () => ReactNode
  style?: any
}
export default function CustomFieldLabel(props: CustomFieldLabelI) {
  const { formField: FormField, formExtra: FormExtra } = props
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...props.style,
      }}
    >
      <FormField />
      <div style={{ marginLeft: 'auto' }}>{FormExtra && <FormExtra />}</div>
    </div>
  )
}
