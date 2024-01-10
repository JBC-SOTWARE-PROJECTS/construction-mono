import { Form, DatePicker, FormItemProps } from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'
import type { DatePickerProps } from 'antd'
import { FormItemStyled } from '.'

interface ExtendedDatePickerProps extends FormItemProps {
  propsdatepicker?: DatePickerProps
  bold?: boolean
}

const FormStyledDatePicker = (
  { propsdatepicker, ...props }: ExtendedDatePickerProps,
  ref: any
) => {
  return (
    <FormItemStyled
      {...props}
      style={{ marginBottom: '6px' }}
      $bold={props?.bold}
    >
      <DatePicker {...propsdatepicker} ref={ref} className='w-full' />
    </FormItemStyled>
  )
}

export default forwardRef(FormStyledDatePicker)
