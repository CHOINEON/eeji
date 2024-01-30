import styled from '@emotion/styled'
import React from 'react'

const HistorySidebar = () => {
  return <SidebarContainer>HistorySidebar</SidebarContainer>
}

export default HistorySidebar

const SidebarContainer = styled.div`
  position: absolute;
  z-index: 99999;
  width: 20vw;
  height: 98vh;
  border: 1px solid red;
  background-color: grey;
  background: linear gradient(to left, #4338f7, #000000);
`
