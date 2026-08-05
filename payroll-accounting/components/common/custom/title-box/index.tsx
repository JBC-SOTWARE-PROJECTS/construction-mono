import { CSSProperties, ReactNode } from "react"
import styled from "styled-components"

interface TitleBoxI {
  title?: ReactNode
  extra?: ReactNode
  style?: CSSProperties
}

export default function TitleBox(props: TitleBoxI) {
  return (
    <TitleBoxDiv className="filter-box" style={props?.style}>
      <div className="box">{props?.title}</div>
      <div className="box">{props?.extra}</div>
    </TitleBoxDiv>
  )
}

const TitleBoxDiv = styled.div`
  display: flex;
  align-items: flex-end !important;
  .box:first-child {
    margin-right: auto;
    align-item: end;
  }
`
