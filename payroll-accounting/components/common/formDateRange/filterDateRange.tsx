import { Form, DatePicker, FormItemProps, TimeRangePickerProps } from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'

interface ExtendedDateRangeProps extends FormItemProps {
  showpresstslist?: boolean
  propsrangepicker?: RangePickerProps
}

const { RangePicker } = DatePicker

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
]

const FormDateRange = (
  { showpresstslist, propsrangepicker, ...props }: ExtendedDateRangeProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: '6px' }}>
      {showpresstslist ? (
        <RangePicker
          presets={rangePresets}
          {...propsrangepicker}
          ref={ref}
          className='w-full'
        />
      ) : (
        <RangePicker {...propsrangepicker} ref={ref} className='w-full' />
      )}
    </Form.Item>
  )
}

export default forwardRef(FormDateRange)
