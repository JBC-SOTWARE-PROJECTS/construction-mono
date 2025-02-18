import { CSSProperties, ReactNode } from "react"
import styled from "styled-components"

interface CustomModalFooterI {
  leftSpace?: ReactNode
  rightSpace?: ReactNode
  style: CSSProperties
}

export default function CustomModalFooter({
  leftSpace,
  rightSpace,
  ...props
}: CustomModalFooterI) {
  return (
    <FilterBox className="filter-box" {...props}>
      <div className="box">{leftSpace ?? null}</div>
      <div className="box">{rightSpace ?? null}</div>
    </FilterBox>
  )
}

const FilterBox = styled.div`
  display: flex;
  align-items: flex-end !important;
  .box:first-child {
    margin-right: auto;
    align-item: end;
  }
`
