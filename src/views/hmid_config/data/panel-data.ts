/**
 * Datasource
 * 2023-07-04 박윤희
 * Interval, WS 대시보드 화면 구현을 위한
 * panelData를 따로 구현함.
 */
export const panelData: any = [
  //0
  {
    panel1: { sizeX: 5, sizeY: 2, row: 0, col: 0, widget: 'Line1', id: '0_body' },
    panel2: { sizeX: 3, sizeY: 2, row: 0, col: 8, widget: 'Table', id: '1_body' },
    panel3: { sizeX: 5, sizeY: 2, row: 2, col: 0, widget: 'Line2', id: '2_body' },
    panel4: { sizeX: 3, sizeY: 2, row: 2, col: 8, widget: 'Line3', id: '3_body' },
  },
  //1
  {
    panel1: { sizeX: 3, sizeY: 2, row: 2, col: 0, widget: 'Bar', id: '0_body' },
    panel2: { sizeX: 2, sizeY: 2, row: 2, col: 3, widget: 'Pie', id: '1_body' },
    panel3: { sizeX: 3, sizeY: 2, row: 2, col: 8, widget: 'Line', id: '2_body' },
    panel4: { sizeX: 3, sizeY: 2, row: 2, col: 0, widget: 'Table', id: '3_body' },
    panel5: { sizeX: 5, sizeY: 2, row: 2, col: 8, widget: 'TimeSeries', id: '4_body' },
    panel6: { sizeX: 8, sizeY: 3, row: 4, col: 0, widget: 'Table', id: '5_body' },
  },
]

export default panelData
