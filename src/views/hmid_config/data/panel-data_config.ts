/**
 * Datasource
 * 2023-07-04 박윤희
 * HMID Configuration 대시보드 구현을 위해
 * panelData를 따로 만듦.
 */
export const panelData: any = [
  //0
  {
    panel1: { sizeX: 5, sizeY: 2, row: 0, col: 0, widget: 'Time Series', id: '0_body' },
    panel2: { sizeX: 3, sizeY: 2, row: 0, col: 8, widget: 'Table', id: '1_body' },
    panel3: { sizeX: 2, sizeY: 2, row: 2, col: 0, widget: 'Time Series', id: '2_body' },
    panel4: { sizeX: 2, sizeY: 2, row: 2, col: 2, widget: 'Time Series', id: '3_body' },
    panel5: { sizeX: 2, sizeY: 2, row: 2, col: 4, widget: 'Time Series', id: '4_body' },
    panel6: { sizeX: 2, sizeY: 2, row: 2, col: 8, widget: 'Scatter Plot', id: '5_body' },
  },
  //1
  {
    panel1: { sizeX: 4, sizeY: 2, row: 0, col: 0, widget: 'Time Series', id: '0_body' },
    panel2: { sizeX: 4, sizeY: 2, row: 0, col: 4, widget: 'Scatter Plot', id: '1_body' },
    panel3: { sizeX: 5, sizeY: 2, row: 2, col: 0, widget: 'Time Series', id: '2_body' },
    panel4: { sizeX: 3, sizeY: 2, row: 2, col: 5, widget: 'CandleStick', id: '3_body' },
  },
]

export default panelData
