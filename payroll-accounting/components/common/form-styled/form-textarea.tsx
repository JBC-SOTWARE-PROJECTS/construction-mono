import { FormItemProps, Input } from 'antd'
import { TextAreaProps } from 'antd/es/input'
import { forwardRef } from 'react'
import { FormItemStyled } from '.'

interface ExtendedTextAreaProps extends FormItemProps {
  propstextarea?: TextAreaProps
  bold?: boolean
}

const { TextArea } = Input

const FormStyledTextArea = ({ ...props }: ExtendedTextAreaProps, ref: any) => {
  const { propstextarea } = props
  return (
    <FormItemStyled
      style={{ marginBottom: '6px' }}
      {...props}
      $bold={props?.bold}
    >
      <TextArea
        autoSize={{ minRows: 3, maxRows: 6 }}
        {...propstextarea}
        ref={ref}
      />
    </FormItemStyled>
  )
}

export default forwardRef(FormStyledTextArea)
