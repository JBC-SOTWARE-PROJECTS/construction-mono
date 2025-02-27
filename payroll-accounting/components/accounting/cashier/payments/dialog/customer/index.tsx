import { FormSelect } from "@/components/common"
import { useSearchPaymentPayor } from "@/hooks/cashier/use-payment-payor"
import { Col, Form, Modal, Row, Space } from "antd"
import { useState } from "react"
import { PaymentType, PayorType, RegistryType } from "../../data-types/types"
import { SearchPayorInput } from "./utils"
import useDebounce from "@/hooks/common/use-debounce"
import { PayorOptionsPerType, RegistryTypeOption } from "@/constant/cashier"
import PageFilterContainer from "@/components/common/custom-components/page-filter-container"

interface ModalProps {
  hide: () => void
  paymentType: PaymentType
  defaultPayorType: PayorType
}
export default function SearchPayorMC(props: ModalProps) {
  const [form] = Form.useForm()
  const [payorType, setPayorType] = useState<PayorType>(
    props.defaultPayorType ??
      (PayorOptionsPerType[props.paymentType][0].value as PayorType)
  )

  const { data, loading, refetch } = useSearchPaymentPayor({
    variables: {
      filter: "",
      payorType: (payorType ? payorType.toUpperCase() : "FOLIO") as PayorType,
      paymentType: props.paymentType,
    },
  })

  const onChangePayorType = (e: PayorType) => {
    setPayorType(e)
  }

  const debouncedSearch = useDebounce((filter: string) => {
    // Your fetch or action here using term
    refetch({
      variables: {
        filter,
        payorType,
        paymentType: props.paymentType,
      },
    })
  }, 300)

  return (
    <Modal title="" open onCancel={props.hide} footer={null} width={800}>
      <Form
        form={form}
        initialValues={{
          payorType:
            props.defaultPayorType ??
            PayorOptionsPerType[props.paymentType][0] ??
            "",
          registryType: "ALL",
        }}
      >
        <PageFilterContainer
          leftSpace={
            <Space>
              <FormSelect
                name="payorType"
                label="Customer Type"
                style={{ fontWeight: "bolder", marginBottom: 0 }}
                propsselect={{
                  options: PayorOptionsPerType[props.paymentType],
                  style: { width: 200 },
                  onChange: onChangePayorType,
                }}
              />
            </Space>
          }
        />
        <Row>
          <Col flex="100%">
            <SearchPayorInput
              {...{
                loading,
                searchItems: data?.content ?? [],
                handleInputChange: debouncedSearch,
                hide: props.hide,
                payorType,
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
