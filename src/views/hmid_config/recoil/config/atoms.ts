/**
 * 2023-05-17 박윤희
 * recoil atoms state
 **/

// atoms.ts
import { atom } from 'recoil'

//state
export const BarChartLayoutOptionState = atom({
  key: 'BarLayoutOption',
  default: [],
})

export const BarChartDataOptionState = atom({
  key: 'BarDataOption',
  default: [],
})

export const PieChartLayoutOptionState = atom({
  key: 'PieLayoutOption',
  default: [],
})

export const PieChartDataOptionState = atom({
  key: 'PieDataOption',
  default: [],
})

export const TimeSeriesChartLayoutOptionState = atom({
  key: 'TimeSeriesLayoutOption',
  default: [],
})

export const TimeSeriesChartDataOptionState = atom({
  key: 'TimeSeriesDataOption',
  default: [],
})

export const DataTableRowState = atom({
  key: 'DataTableRows',
  default: [],
})

export const DataTableColumnsState = atom({
  key: 'DataTableColumns',
  default: [],
})

export const WidgetInformationState = atom({
  key: 'WidgetInfo',
  default: '',
})

export const AlertMessageState = atom({
  key: 'Message',
  default: '',
})

export const AlertModalState = atom({
  key: 'AlertModal',
  default: false,
})

export const ShowLoadingState = atom({
  key: 'LoadingShow',
  default: false,
})

export const ShowGridModalState = atom({
  key: 'GridModal',
  default: false,
})

export const ShowWidgetModalState = atom({
  key: 'WidgetModal',
  default: false,
})

export const ShowConnectionDataState = atom({
  key: 'ConnectionData',
  default: false,
})

export const ShowDeleteGridModalState = atom({
  key: 'DeleteGridModal',
  default: false,
})

export const TagListByTagDataState = atom({
  key: 'TagListByTagData',
  default: [],
})

//필요성 확인
export const TagListArrState = atom({
  key: 'TagListArr',
  default: [],
})

export const SelectTagInfoState = atom({
  key: 'SelectTagInfo',
  default: [],
})

export const OpenSaveLayoutModalState = atom({
  key: 'SaveLaytoutModal',
  default: false,
})

export const SaveLayoutInformationState = atom({
  key: 'SaveLayoutInformation',
  default: '',
})

export const GridInformationState = atom({
  key: 'gridInformation',
  default: null,
})

export const GridDataObjState = atom({
  key: 'gridDataObj',
  default: [],
})

export const BoxTargetIdState = atom({
  key: 'boxTargetId',
  default: '',
})

export const WidgetInfoState = atom({
  key: 'WidgetInfo',
  default: '',
})

export const PanelIdxState = atom({
  key: 'PanelIndex',
  default: 0,
})

export default {
  BarChartDataOptionState,
  BarChartLayoutOptionState,
  PieChartDataOptionState,
  PieChartLayoutOptionState,
  TimeSeriesChartDataOptionState,
  TimeSeriesChartLayoutOptionState,
  DataTableRowState,
  DataTableColumnsState,
  WidgetInformationState,
  AlertMessageState,
  AlertModalState,
  ShowLoadingState,
  TagListArrState,
  ShowWidgetModalState,
  ShowConnectionDataState,
  OpenSaveLayoutModalState,
  GridInformationState,
  GridDataObjState,
  BoxTargetIdState,
  WidgetInfoState,
  PanelIdxState,
  SelectTagInfoState,
  ShowGridModalState,
  ShowDeleteGridModalState,
  TagListByTagDataState,
}
