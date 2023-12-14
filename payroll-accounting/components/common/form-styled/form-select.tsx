import { Form, FormItemProps, SelectProps, Select } from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'
import { FormItemStyled } from '.'

interface ExtendedSelectProps extends FormItemProps {
  propsselect: SelectProps
  bold?: boolean
}

const FormStyledSelect = ({ ...props }: ExtendedSelectProps, ref: any) => {
  const { propsselect } = props
  return (
    <FormItemStyled
      {...props}
      style={{ marginBottom: '6px' }}
      $bold={props?.bold}
    >
      <Select
        {...propsselect}
        filterOption={(input, option) => {
          let label: string = _.toString(option?.label ?? '')
          return label.toLowerCase().includes(input.toLowerCase())
        }}
        ref={ref}
      />
    </FormItemStyled>
  )
}

export default forwardRef(FormStyledSelect)
