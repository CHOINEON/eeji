import styled, { keyframes } from 'styled-components'

export const Group = styled.g<{ top: number; right: number }>`
  transform: ${(props) => `translate(${props.right}px, ${props.top}px)`};
`

export const Dropdown = styled.select`
  font-size: 1.4rem;
  padding: 0.3rem 0.8rem;
  margin: 3rem 0 3rem 5rem;

  &:focus {
    outline: 0;
  }
`

export const ChartWrapper = styled.div`
  // overflow-x: scroll;
  width: 100%;
  height: 500px;
  display: block;
  float: left;
`

export const Chart = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin: 1rem 0;

  @media (max-width: 992px) {
    display: inline-flex;
    justify-content: initial;
  }

  svg {
    display: inline-table;
  }
`
