import styled from '@emotion/styled'
import React from 'react'

const Dimmer = ({ onClick }: any) => {
  return <Dimmed onClick={onClick}></Dimmed>
}

export default Dimmer

const Dimmed = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 40%;
  background-color: rgb(38, 38, 38);
  z-index: 100;
`
