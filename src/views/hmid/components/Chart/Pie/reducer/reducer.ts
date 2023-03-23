// reducer function
const reducer = (state: any, action: any) => {
  console.log(state)
  switch (action.type) {
    case 'ENABLE_LEGEND':
      return {
        ...state,
        ENABLE_LEGEND: !state.ENABLE_LEGEND,
      }
    case 'SHOW_DRAWER':
      return {
        ...state,
        SHOW_DRAWER: !state.SHOW_DRAWER,
      }
    case 'NAVIGATION_COLLAPSED':
      return {
        ...state,
        NAVIGATION_COLLAPSED: !state.NAVIGATION_COLLAPSED,
      }
    case 'ENABLE_MARKER_LABEL':
      return {
        ...state,
        ENABLE_MARKER_LABEL: !state.ENABLE_MARKER_LABEL,
      }
    case 'ENABLE_TEXT_POSITION':
      return {
        ...state,
        ENABLE_TEXT_POSITION: !state.ENABLE_TEXT_POSITION,
      }
    case 'DISPLAY_PAPER_BG_COLOR_PICKER':
      return {
        ...state,
        DISPLAY_PAPER_BG_COLOR_PICKER: !state.DISPLAY_PAPER_BG_COLOR_PICKER,
      }
    case 'DISPLAY_PLOT_BG_COLOR_PICKER':
      return {
        ...state,
        DISPLAY_PLOT_BG_COLOR_PICKER: !state.DISPLAY_PLOT_BG_COLOR_PICKER,
      }
    case 'TITLE':
      return {
        ...state,
        TITLE: action.data,
      }
    case 'HOLE':
      return {
        ...state,
        HOLE: action.data,
      }
    case 'PAPER_BG_COLOR_TEXT':
      return {
        ...state,
        PAPER_BG_COLOR_TEXT: action.data,
      }
    case 'PLOT_BG_COLOR_TEXT':
      return {
        ...state,
        PLOT_BG_COLOR_TEXT: action.data,
      }
    case 'GRID_ROWS':
      return {
        ...state,
        GRID_ROWS: action.data,
      }
    case 'GRID_COLUMNS':
      return {
        ...state,
        GRID_COLUMNS: action.data,
      }
    case 'TRANSLATE_X':
      return {
        ...state,
        TRANSLATE_X: action.data,
      }
    case 'TRANSLATE_Y':
      return {
        ...state,
        TRANSLATE_Y: action.data,
      }
    case 'LEGEND_TRACEORDER':
      return {
        ...state,
        LEGEND_TRACEORDER: action.data,
      }
    case 'LEGEND_ORIENTATION':
      return {
        ...state,
        LEGEND_ORIENTATION: action.data,
      }
    case 'MARGIN_TOP':
      return {
        ...state,
        MARGIN_TOP: action.data,
      }
    case 'MARGIN_RIGHT':
      return {
        ...state,
        MARGIN_RIGHT: action.data,
      }
    case 'MARGIN_LEFT':
      return {
        ...state,
        MARGIN_LEFT: action.data,
      }
    case 'MARGIN_BOTTOM':
      return {
        ...state,
        MARGIN_BOTTOM: action.data,
      }
    case 'TEXT_POSITION':
      return {
        ...state,
        TEXT_POSITION: action.data,
      }
    case 'AXIS_X_TITLE':
      return {
        ...state,
        AXIS_X_TITLE: action.data,
      }
    case 'AXIS_Y_TITLE':
      return {
        ...state,
        AXIS_Y_TITLE: action.data,
      }
    default:
      return state
  }
}

export default reducer
