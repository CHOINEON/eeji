export interface PieChartProps {
  PieChartLayout: (LayoutProps: any) => void
  PieChartData: (DataProps: any) => void
  setShowDrawer: (ShowDrawer: boolean) => void
  ChartType: string
  ShowPieDrawer: boolean
  DataType: (type: string) => void
}
