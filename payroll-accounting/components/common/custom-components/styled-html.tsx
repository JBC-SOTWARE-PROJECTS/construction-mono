import styled from 'styled-components'

export const Header = styled.a<{ $bold?: string; $color?: string }>`
  font-weight: ${(props) => props.$bold || 'normal'};
  color: ${(props) => props.$color || '#484848'};
`
