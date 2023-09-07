/* eslint-disable prettier/prettier */
/* route 에러 TEST 파일
20230817 최혜진 */
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import styled from '@emotion/styled'
import '../hmid_config/style/style.css'
import 'ag-grid-community/styles/ag-grid.css'
import '../hmid/components/Modal/style/style.css'

import { panelData } from '../hmid_config/data/panel-data'
import * as d3 from 'd3'

import WidgetModal from '../hmid/components/Modal/WidgetModal'
import SaveConfirmModal from '../hmid/components/Modal/SaveConfirm'
import LayoutModal from '../hmid/components/Modal/LayoutListModal'
import DataConnection from '../hmid/components/Modal/DataConnection'
import { Alert } from '../hmid/components/Modal/Alert'

import * as ReactIcon from 'react-icons/md'
import * as Chakra from '@chakra-ui/react'
import * as ej2 from '@syncfusion/ej2-react-layouts'

import { useRecoilState, RecoilRoot } from 'recoil'
import * as RecoilAtoms from '../hmid_config/recoil/config/atoms'
import { NowDate } from '../hmid_config/recoil/base/atoms'
import D3LineChartInterval from '../hmid_config/grid/drawD3ChartIntervalTestDw'
import D3LineChartIntervalBT from '../hmid_config/grid/drawD3ChartIntervalTestDwBT'
import D3LineChart from '../hmid_config/grid/TestComponent/drawD3Chart'
import IntervalTestBiance from '../hmid_config/grid/drawD3ChartIntervalTestBiance'
import IntervalTestBianceTrade from 'views/hmid_config/grid/drawD3ChartIntervalTestBianceTrade'
import DrawD3FCChart from 'views/hmid_config/grid/TestComponent/drawD3FCChartKline'
import AdvancedChart from '../AnomalyDetection/sample_d3_chart'
import Plot from 'react-plotly.js'

const BoxTitle = styled.div`
  position: absolute;
  left: 1vw;
  top: 1vw;
  font-size: 0.8vw;
  font-weight: bold;
`
const CurrentText = styled.div`
  float: right;
  font-size: 1vw;
  font-weight: 500;
  padding-right: 1vw;
`
const CurrentIcon = styled.div`
  float: right;
  font-size: 1.3vw;
  font-weight: 500;
  color: rgb(67, 56, 247);
`

const Test = () => {

  return (
   <Chakra.Box style={{ position: 'relative', zIndex: 1000, height: '1vw' }}>
    <AdvancedChart/>
   </Chakra.Box>
  )
}
export default Test
