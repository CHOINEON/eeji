/**
 * 2023-05-17 박윤희
 * recoil atoms state
 **/

// atoms.ts
import { atom } from 'recoil'
import { v1 } from 'uuid'

//state
export const BarChartLayoutOptionState = atom({
  key: `BarLayoutOption/${v1()}`,
  default: [],
})

export const BarChartDataOptionState = atom({
  key: `BarDataOption/${v1()}`,
  default: [],
})

export const PieChartLayoutOptionState = atom({
  key: `PieLayoutOption/${v1()}`,
  default: [],
})

export const PieChartDataOptionState = atom({
  key: `PieDataOption/${v1()}`,
  default: [],
})

export const TimeSeriesChartLayoutOptionState = atom({
  key: `TimeSeriesLayoutOption/${v1()}`,
  default: [],
})

export const TimeSeriesChartDataOptionState = atom({
  key: `TimeSeriesDataOption/${v1()}`,
  default: [],
})

export const DataTableRowState = atom({
  key: `DataTableRows/${v1()}`,
  default: [],
})

export const DataTableColumnsState = atom({
  key: `DataTableColumns/${v1()}`,
  default: [],
})

export const AlertMessageState = atom({
  key: `Message/${v1()}`,
  default: '',
})

export const AlertModalState = atom({
  key: `AlertModal/${v1()}`,
  default: false,
})

export const ShowLoadingState = atom({
  key: `LoadingShow/${v1()}`,
  default: false,
})

export const ShowGridModalState = atom({
  key: `GridModal/${v1()}`,
  default: false,
})

export const ShowWidgetModalState = atom({
  key: `WidgetModal/${v1()}`,
  default: false,
})

export const ShowConnectionDataState = atom({
  key: `ConnectionData/${v1()}`,
  default: false,
})

export const ShowDeleteGridModalState = atom({
  key: `DeleteGridModal/${v1()}`,
  default: false,
})

export const TagListByTagDataState = atom({
  key: `TagListByTagData/${v1()}`,
  default: [],
})

//필요성 확인
export const TagListArrState = atom({
  key: `TagListArr/${v1()}`,
  default: [],
})

export const SelectTagInfoState = atom({
  key: `SelectTagInfo/${v1()}`,
  default: [],
})

export const OpenSaveLayoutModalState = atom({
  key: `SaveLaytoutModal/${v1()}`,
  default: false,
})

export const SaveLayoutInformationState = atom({
  key: `SaveLayoutInformation/${v1()}`,
  default: '',
})

export const GridInformationState = atom({
  key: `gridInformation/${v1()}`,
  default: null,
})

//함수 확인
export const GridDataObjState = atom({
  key: `gridDataObj/${v1()}`,
  default: [],
})

export const BoxTargetIdState = atom({
  key: `boxTargetId/${v1()}`,
  default: '',
})

export const WidgetInfoState = atom({
  key: `WidgetInfo/${v1()}`,
  default: '',
})

export const PanelIdxState = atom({
  key: `PanelIndex/${v1()}`,
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
