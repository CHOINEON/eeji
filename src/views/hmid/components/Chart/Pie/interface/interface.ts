export interface PieChartProps {
  ChartLayout: (LayoutProps: any) => void
  ChartData: (DataProps: any) => void
  setShowDrawer: (ShowDrawer: boolean) => void
  ChartType: string
  ShowPieDrawer: boolean
}
