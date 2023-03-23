export interface LineChartProps {
  ChartLayout: (LayoutProps: any) => void
  ChartData: (DataProps: any) => void
  setShowDrawer: (ShowDrawer: boolean) => void
  ChartType: string
  ShowDrawer: boolean
}
