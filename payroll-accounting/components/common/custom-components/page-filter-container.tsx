import { ReactNode } from 'react'
import styled from 'styled-components'

interface PageFilterContainerI {
  leftSpace?: ReactNode
  rightSpace?: ReactNode
}

export default function PageFilterContainer(props: PageFilterContainerI) {
  return (
    <FilterBox className='filter-box'>
      <div className='box'>{props?.leftSpace}</div>
      <div className='box'>{props?.rightSpace}</div>
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
