import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces"
import {
  PaymentType,
  Payor,
} from "@/components/accounting/cashier/payments/data-types/types"
import EditTerminalSelectedItem from "@/components/accounting/cashier/payments/dialog/edit-teminal-added-item"
import { Billing, PaymentItem } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import { useLazySearchPaymentItem } from "@/hooks/cashier/use-payment-item"
import useDebounce from "@/hooks/common/use-debounce"
import {
  CloseCircleFilled,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { gql, useLazyQuery } from "@apollo/client"
import { Button, Space, Typography } from "antd"
import Image from "next/image"
import numeral from "numeral"
import { Dispatch, useEffect, useRef, useState } from "react"
import styled from "styled-components"

const PAYMENT_TRANSACTION_TYPE = gql`
  query ($filter: String, $pageSize: Int, $pageNo: Int) {
    paymentTransactionTypePage: listPageablePaymentTransactionTypes(
      filter: $filter
      pageSize: $pageSize
      pageNo: $pageNo
    ) {
      content {
        id
        itemName: typeName
        description
      }
      totalElements
      totalPages
      size
      number
    }
  }
`

interface PaymentItemsProps {
  items?: PaymentItem[]
  dispatch: Dispatch<TerminalWindowsAction>
}

export const PaymentItems = (props: PaymentItemsProps) => {
  const editAmount = useDialog(EditTerminalSelectedItem)

  const onEdit = (record: PaymentItem) => {
    editAmount({ record }, (returned: PaymentItem) => {
      console.log(returned, "returned")
      if (returned) {
        const newItems = [...(props?.items ?? [])]
        const index = newItems.findIndex((item) => item.id == record.id)
        newItems[index] = returned
        props.dispatch({
          type: "set-payment-items",
          payload: [...newItems],
        })
      }
    })
  }

  const onDelete = (id: number) => {
    const newItems = [...(props?.items ?? [])]
    const index = newItems.findIndex((_, index) => index == id)
    newItems.splice(index, 1)
    props.dispatch({
      type: "set-payment-items",
      payload: newItems,
    })
  }

  return (
    <SelectedItemList>
      <ul>
        {(props?.items ?? []).map((item, index) => (
          <SelectedItem key={index}>
            <ItemDetails onClick={() => onEdit(item)}>
              <h3>{item?.itemName ?? ""}</h3>
              <Desc>
                <Typography.Text ellipsis>
                  {item?.description ?? ""}
                </Typography.Text>
              </Desc>
              <Desc>
                {item?.qty ?? 0} PCS @
                {numeral(item?.price ?? 0).format("0,0.00")}
              </Desc>
            </ItemDetails>
            <ItemAmount onClick={() => onEdit(item)}>
              <p>{numeral(item?.amount ?? 0).format("0,0.00")}</p>
              <Desc>VAT: {numeral(item?.vat ?? 0).format("0,0.00")}</Desc>
            </ItemAmount>
            <Action>
              <Button
                icon={<CloseCircleFilled style={{ fontSize: "18px" }} />}
                size="small"
                type="link"
                style={{ color: "#9F9F9E" }}
                onClick={() => onDelete(index)}
              />
            </Action>
          </SelectedItem>
        ))}
      </ul>
    </SelectedItemList>
  )
}

const SelectedItemList = styled.div`
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 20px;

  ul {
    list-style: none;
    padding: 0;
  }

  h2 {
    margin-top: 0;
  }
`

const SelectedItem = styled.li`
  background: #115e5924;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  padding: 10px;
  margin-bottom: 10px; /* Add margin between items */
  border-radius: 6px; /* Add border radius to each item */
  :hover {
    cursor: pointer;
  }
`

const ItemDetails = styled.div`
  flex: 7;
  overflow-x: hidden;
`

const ItemAmount = styled.div`
  flex: 3;
  text-align: right;
`

const Action = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-left: 5px;
`

type PaymentItemsEmptyContentProps = {
  onAddItems: (paymentType: PaymentType) => void
  paymentType: PaymentType
  billing?: Billing | null
}

export default function PaymentItemsEmptyContent(
  props: PaymentItemsEmptyContentProps
) {
  console.log(props?.billing?.locked, "props?.billing?.locked")
  return (
    <ImageContainer>
      <ImageWrapper>
        <CenteredImage>
          <Space direction="vertical" align="center">
            <Image
              alt="cart"
              src="/images/cashier/empty-cart.svg"
              width={250}
              height={250}
            />
            <Button
              size="large"
              icon={<PlusCircleOutlined />}
              onClick={() => props.onAddItems(props.paymentType)}
              disabled={!props?.billing?.locked}
            >
              <Typography.Text strong>Select Items (F3)</Typography.Text>
            </Button>
          </Space>
        </CenteredImage>
      </ImageWrapper>
    </ImageContainer>
  )
}

const ImageContainer = styled.div`
  display: flex; /* Use flexbox */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 50vh; /* Stretch height to viewport height */
`

const ImageWrapper = styled.div`
  max-width: 100%; /* Ensure image doesn't exceed container width */
  max-height: 100%;
`

const CenteredImage = styled.div`
 display: block;
  max-width: 100%; /* Ensure image doesn't exceed container width */
  max-height: 100%; /* Ensure image doesn't exceed container height */
  margin: auto; /
`

const Desc = styled.div`
  color: #78716c;
`

interface PaymentItemSearchInputProps {
  id: string
  paymentType: PaymentType
  dispatch: Dispatch<TerminalWindowsAction>
}

export function PaymentItemSearchInput(props: PaymentItemSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchItems, setSearchItems] = useState<PaymentItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const [onSearch, { loading, data }] = useLazySearchPaymentItem({
    onComplete: (data: any) => {
      setSearchItems(data)
    },
  })

  // const [onSearch, { loading }] = useLazyQuery(PAYMENT_TRANSACTION_TYPE, {
  //   onCompleted: (data) => {
  //     const content: PaymentItem[] =
  //       data?.paymentTransactionTypePage?.content ?? []
  //     setSearchItems(content)
  //   },
  // })

  useEffect(() => {
    if (searchItems.length > 0) {
      const handleKeyDown = (event: KeyboardEvent) => {
        console.log(event, "event")
        if (event.key === "ArrowDown") {
          setSelectedIndex((prevIndex) => (prevIndex + 1) % searchItems.length)
        } else if (event.key === "ArrowUp") {
          setSelectedIndex(
            (prevIndex) =>
              (prevIndex - 1 + searchItems.length) % searchItems.length
          )
        } else if (event.key === "Enter" && selectedIndex !== -1) {
          const selected = searchItems[selectedIndex]
          setSearchTerm("")
          setSelectedIndex(-1)
          setSearchItems([])
          if (inputRef?.current) inputRef.current.blur()
          onAddItems(selected)
        }
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, searchItems])

  const handleResultClick = (record: PaymentItem) => {
    onAddItems(record)
    setSearchTerm("")
    setSelectedIndex(-1)
    setSearchItems([])
    inputRef.current?.blur()
  }

  const debouncedSearch = useDebounce((filter: string) => {
    // Your fetch or action here using term
    const variables = {
      id: "",
      filter,
      page: 0,
      size: 5,
      paymentType: props.paymentType,
    }

    onSearch({
      variables,
    })
  }, 300)

  const handleInputChange = (filter: string) => {
    setSearchTerm(filter)
    // refetch({ filter: event.target.value, page: 0, size: 500 })
  }

  const onAddItems = (record: PaymentItem) => {
    let newRecord: PaymentItem | null = null
    if (record)
      newRecord = {
        ...record,
        qty: 1,
        price: record?.price ?? 0.0,
        amount: record?.amount ?? 0.0,
      }
    if (newRecord)
      props.dispatch({ type: "add-payment-items", payload: newRecord })
  }

  return (
    <SearchContainer>
      <SearchInputContainer>
        <SearchInput
          type="text"
          placeholder="Search item..."
          value={searchTerm}
          onChange={(e) => {
            handleInputChange(e.target.value)
            debouncedSearch(e.target.value)
          }}
          // onBlur={() => setSearchItems([])}
        />
        <SearchIconContainer>
          <SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />
        </SearchIconContainer>
      </SearchInputContainer>
      {searchItems.length > 0 && searchTerm != "" && !loading && (
        <DropdownContent>
          {(searchItems ?? []).map((result, index) => (
            <ResultItem
              key={index}
              className={`${index === selectedIndex ? "selected" : ""}`}
              onClick={() => handleResultClick(result)}
            >
              <ItemDetails>
                <h3>{result.itemName}</h3>
                <Desc>
                  <Typography.Text ellipsis>
                    {result.description}
                  </Typography.Text>
                </Desc>
              </ItemDetails>
            </ResultItem>
          ))}
        </DropdownContent>
      )}
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
  width: 100%;
  padding: 10px;
  position: relative;
  display: inline-block;
`

const SearchIconContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
`

const SearchInput = styled.input`
  width: 100%; /* Subtract padding */
  padding: 10px;
  box-sizing: border-box; /* Ensure padding is included in width */
  border-radius: 8px;
  background: #f6f6f6;
  border: none;
  height: 38px;
  font-size: 17px;

  :focus-visible {
    border-color: #115e59 !important;
  }
`

const DropdownContent = styled.div`
  display: block;
  position: absolute;
  background-color: #f9f9f9;
  width: calc(100% - 16px); /* Subtract border width */
  z-index: 1;
  border: none;
  margin-top: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .selected {
    background: #115e59 !important;
    color: #ffff !important;
  }

  :hover {
    background-color: #115e59;
    color: #ffff;
  }
`

const ResultItem = styled.div`
  padding: 10px;
  cursor: pointer;
  background-color: #ffff;
  border-bottom: 1px solid #115e592b;
`
