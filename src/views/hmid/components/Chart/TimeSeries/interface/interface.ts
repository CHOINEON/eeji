export interface TimeSeriesProps {
  ChartLayout: (LayoutProps: any) => void
  ChartData: (DataProps: any) => void
  setShowDrawer: (ShowDrawer: boolean) => void
  ChartType: string
  ShowTimeSeriesDrawer: boolean
}
