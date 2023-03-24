export interface BarChartProps {
  ChartLayout: (LayoutProps: any) => void
  ChartData: (DataProps: any) => void
  setShowDrawer: (ShowDrawer: boolean) => void
  ChartType: string
  ShowBarDrawer: boolean
}
