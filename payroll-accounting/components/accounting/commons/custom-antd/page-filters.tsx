import PopoverFilter from "@/components/common/page-layout/popover-filter"
import { Checkbox, Form, Space, Radio, RadioProps, CheckboxProps } from "antd"
import { FormInstance, RadioGroupProps } from "antd/lib"
import { CheckboxGroupProps } from "antd/lib/checkbox"
import { ReactNode } from "react"

interface FilterI {
  label: string
  value: string
}

interface PageFiltersI {
  type?: "RADIO" | "CHECKBOX"
  title: string
  label: string
  form: FormInstance<any>
  formItemName: string
  formFilterInitial: any
  dataSource: FilterI[]
  children?: ReactNode
  handleFilterClear: (params: any) => void
  handleFilterApply: (params: any) => void
  radioProps?: RadioGroupProps
  checkboxProps?: CheckboxGroupProps
}

export default function PageFilters(props: PageFiltersI) {
  return (
    <PopoverFilter
      onClear={props.handleFilterClear}
      onApply={() => props.handleFilterApply(props.formItemName)}
      title={props.title}
      label={props.label}
      button={props?.children}
    >
      <Form
        name={`filter-form-${props.label}`}
        layout="vertical"
        form={props.form}
        initialValues={{ ...props?.formFilterInitial }}
      >
        <Form.Item name={props?.formItemName} label={<b>{props.label}</b>}>
          {props?.type == "RADIO" ? (
            <Radio.Group {...props?.radioProps}>
              <Space direction="vertical">
                {(props?.dataSource ?? []).map((types) => (
                  <Radio key={types.value} value={types.value}>
                    {types.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          ) : (
            <Checkbox.Group {...props?.checkboxProps}>
              <Space direction="vertical">
                {(props?.dataSource ?? []).map((types) => (
                  <Checkbox key={types.value} value={types.value}>
                    {types.label}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          )}
        </Form.Item>
      </Form>
    </PopoverFilter>
  )
}
