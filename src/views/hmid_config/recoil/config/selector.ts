/**
 * 2023-05-17 박윤희
 * recoil selector
 **/

import {
  BarChartDataOptionState,
  BarChartLayoutOptionState,
  GridDataObjState,
  PieChartDataOptionState,
  PieChartLayoutOptionState,
  DataTableColumnsState,
  TagListArrState,
  TagListByTagDataState,
  AlertMessageState,
  ShowLoadingState,
  SelectTagInfoState,
  WidgetInformationState,
  DataTableRowState,
  ShowWidgetModalState,
  ShowGridModalState,
  ShowConnectionDataState,
  OpenSaveLayoutModalState,
  SaveLayoutInformationState,
  ShowDeleteGridModalState,
} from './atoms'

import { selector } from 'recoil'

export const BarChartLayoutOptionSelector = selector({
  key: 'BarChartLayoutOptionSelector',
  get: ({ get }) => get(BarChartLayoutOptionState),
  set: ({ set }, newValue) => set(BarChartLayoutOptionState, newValue),
})

export const BarChartDataOptionSelector = selector({
  key: 'BarChartDataOptionSelector',
  get: ({ get }) => get(BarChartDataOptionState),
  set: ({ set }, newValue) => set(BarChartDataOptionState, newValue),
})

export const PieChartLayoutOptionSelector = selector({
  key: 'PieChartLayoutOptionSelector',
  get: ({ get }) => get(PieChartLayoutOptionState),
  set: ({ set }, newValue) => set(PieChartLayoutOptionState, newValue),
})

export const PieChartDataOptionSelector = selector({
  key: 'PieChartDataOptionSelector',
  get: ({ get }) => get(PieChartDataOptionState),
  set: ({ set }, newValue) => set(PieChartDataOptionState, newValue),
})

export const DataTableColumnsSelector = selector({
  key: 'DataTableColumnsSelector',
  get: ({ get }) => get(DataTableColumnsState),
  set: ({ set }, newValue) => set(DataTableColumnsState, newValue),
})

export const DataTableRowSelector = selector({
  key: 'DataTableRowSelector',
  get: ({ get }) => get(DataTableRowState),
  set: ({ set }, newValue) => set(DataTableRowState, newValue),
})

export const TagListByTagDataSelector = selector({
  key: 'TagListByTagDataSelector',
  get: ({ get }) => get(TagListByTagDataState),
  set: ({ set }, newValue) => set(TagListByTagDataState, newValue),
})

export const TagListArrSelector = selector({
  key: 'TagListArrSelector',
  get: ({ get }) => get(TagListArrState),
  set: ({ set }, newValue) => set(TagListArrState, newValue),
})

export const GridDataObjSelector = selector({
  key: 'GridDataObjSelector',
  get: ({ get }) => {
    const gridObj = get(GridDataObjState)
    return gridObj
  },
  set: ({ set, get }, newValue = []) => {
    console.log('[ GridDataObj Selector ] >> ')
    console.log(newValue)
    const obj = get(GridDataObjState)
    console.log(obj)

    const test: any = newValue
    console.log(test)
    // set(GridDataObjState, test)
  },
})

export const AlertMessageSelector = selector({
  key: 'AlertMessageSelector',
  get: ({ get }) => get(AlertMessageState),
  set: ({ set }, newValue) => set(AlertMessageState, newValue),
})

export const ShowConnectionDataSelector = selector({
  key: 'ConnectionDataSelector',
  get: ({ get }) => get(ShowConnectionDataState),
  set: ({ set }, newValue) => set(ShowConnectionDataState, newValue),
})

export const ShowWidgetModalSelector = selector({
  key: 'ShowWidgetModalSelector',
  get: ({ get }) => get(ShowWidgetModalState),
  set: ({ set }, newValue) => set(ShowWidgetModalState, newValue),
})

export const SelectTagInfoSelector = selector({
  key: 'SelectTagInfoSelector',
  get: ({ get }) => get(SelectTagInfoState),
  set: ({ set }, newValue) => set(SelectTagInfoState, newValue),
})

export const ShowGridModalSelector = selector({
  key: 'ShowGridModalSelector',
  get: ({ get }) => get(ShowGridModalState),
  set: ({ set }, newValue) => set(ShowGridModalState, newValue),
})

export const ShowDeleteGridModalSelector = selector({
  key: 'ShowDeleteGridModalSelector',
  get: ({ get }) => get(ShowDeleteGridModalState),
  set: ({ set }, newValue) => set(ShowDeleteGridModalState, newValue),
})

export const ShowSaveGridModalSelector = selector({
  key: 'ShowSaveGridModalSelector',
  get: ({ get }) => get(OpenSaveLayoutModalState),
  set: ({ set }, newValue) => set(OpenSaveLayoutModalState, newValue),
})

export const SaveLayoutInformationSelector = selector({
  key: 'SaveLayoutInformationSelector',
  get: ({ get }) => get(SaveLayoutInformationState),
  set: ({ set }, newValue) => set(SaveLayoutInformationState, newValue),
})

export const ShowLoadingSelector = selector({
  key: 'ShowLoadingSelector',
  get: ({ get }) => get(ShowLoadingState),
  set: ({ set }, newValue) => set(ShowLoadingState, newValue),
})

export const WidgetInformationSelector = selector({
  key: 'WidgetInformationSelector',
  get: ({ get }) => get(WidgetInformationState),
  set: ({ set }, newValue) => set(WidgetInformationState, newValue),
})
