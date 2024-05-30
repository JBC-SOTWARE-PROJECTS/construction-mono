import {
  InboxOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Card, Space, Typography } from "antd"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { PayorType } from "../../data-types/types"

interface SearchPayorInputProps {
  payorType: PayorType
  searchItems: PayorDetails[]
  loading: boolean
  handleInputChange: (param: string) => void
  hide: (params: { id: string; payorType: PayorType }) => void
}

interface PayorDetails {
  id: string
  payorName: string
  description: string
}

export function SearchPayorInput({
  searchItems,
  ...props
}: SearchPayorInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

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
          setSelectedIndex(-1)
          if (inputRef?.current) inputRef.current.blur()

          props.hide({ id: selected.id, payorType: props.payorType })
        }
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, searchItems])

  useEffect(() => {
    if (inputRef?.current) inputRef.current.focus()
  }, [])

  const handleResultClick = (record: PayorDetails) => {
    props.hide({ id: record.id, payorType: props.payorType })
  }

  return (
    <SearchContainer>
      <SearchInputContainer>
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="Search customer by name..."
          onChange={(e) =>
            props.handleInputChange(inputRef?.current?.value ?? "")
          }
        />
        <SearchIconContainer>
          <SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />
        </SearchIconContainer>
      </SearchInputContainer>
      <DropdownContent>
        {searchItems.length > 0 && !props.loading ? (
          (searchItems ?? []).map((result, index) => (
            <ResultItem
              key={index}
              className={`${index === selectedIndex ? "selected" : ""}`}
              onClick={() => handleResultClick(result)}
            >
              <ItemDetails>
                <h3>{result.payorName}</h3>
                <Desc>
                  <Typography.Text ellipsis>
                    {result?.description ?? "N/A"}
                  </Typography.Text>
                </Desc>
              </ItemDetails>
            </ResultItem>
          ))
        ) : (
          <Card>
            <Space
              direction="vertical"
              align="center"
              style={{ textAlign: "center", width: "100%" }}
            >
              {props.loading ? (
                <LoadingOutlined style={{ fontSize: 60, color: "#00808059" }} />
              ) : (
                <InboxOutlined style={{ fontSize: 60, color: "#00808059" }} />
              )}
              <Typography.Text strong>
                {props.loading ? "Please wait ..." : "No data"}
              </Typography.Text>
            </Space>
          </Card>
        )}
      </DropdownContent>
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
  width: 100%;
  padding: 10px 0px 10px 0px;
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
  position: relative;
  background-color: #f9f9f9;
  width: 100%; /* Subtract border width */
  z-index: 1;
  border: none;
  margin-top: 5px;

  .selected {
    background: #115e59 !important;
    color: #ffff !important;
  }
`

const ResultItem = styled.div`
  padding: 10px;
  cursor: pointer;
  background-color: #ffff;
  border-bottom: 1px solid #115e592b;
`

const ItemDetails = styled.div`
  flex: 7;
`

const Desc = styled.div`
  color: #78716c;
`
