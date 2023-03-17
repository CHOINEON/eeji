// reducer function
const reducer = (state: any, action: any) => {
  // console.log('Line Chart Reducer');
  console.log(action.data)
  // console.log(action);
  switch (action.type) {
    // case 'ENABLE_TITLE':
    //   return {
    //     ...state,
    //     ENABLE_TITLE: !state.ENABLE_TITLE,
    //   };
    // case 'ENABLE_TITLE_INPUT':
    //   return {
    //     ...state,
    //     ENABLE_TITLE_INPUT: !state.ENABLE_TITLE_INPUT,
    //   };
    case 'ENABLE_ARROW':
      return {
        ...state,
        ENABLE_ARROW: !state.ENABLE_ARROW,
      }
    case 'ENABLE_ARROW_TEXT':
      return {
        ...state,
        ENABLE_ARROW_TEXT: !state.ENABLE_ARROW_TEXT,
      }
    case 'ENABLE_MARKER':
      return {
        ...state,
        ENABLE_MARKER: !state.ENABLE_MARKER,
      }
    case 'ENABLE_MARKER_LABEL':
      return {
        ...state,
        ENABLE_MARKER_LABEL: !state.ENABLE_MARKER_LABEL,
      }
    case 'ENABLE_GRIDX':
      return {
        ...state,
        ENABLE_GRIDX: !state.ENABLE_GRIDX,
      }
    case 'ENABLE_GRIDY':
      return {
        ...state,
        ENABLE_GRIDY: !state.ENABLE_GRIDY,
      }
    case 'ENABLE_LEGEND':
      return {
        ...state,
        ENABLE_LEGEND: !state.ENABLE_LEGEND,
      }
    case 'ENABLE_AXIS_TOP_SWITCH':
      return {
        ...state,
        ENABLE_AXIS_TOP_SWITCH: !state.ENABLE_AXIS_TOP_SWITCH,
      }
    case 'ENABLE_AXIS_RIGHT_SWITCH':
      return {
        ...state,
        ENABLE_AXIS_RIGHT_SWITCH: !state.ENABLE_AXIS_RIGHT_SWITCH,
      }
    case 'ENABLE_AXIS_BOTTOM_SWITCH':
      return {
        ...state,
        ENABLE_AXIS_BOTTOM_SWITCH: !state.ENABLE_AXIS_BOTTOM_SWITCH,
      }
    case 'ENABLE_AXIS_LEFT_SWITCH':
      return {
        ...state,
        ENABLE_AXIS_LEFT_SWITCH: !state.ENABLE_AXIS_LEFT_SWITCH,
      }
    case 'NAVIGATION_COLLAPSED':
      return {
        ...state,
        NAVIGATION_COLLAPSED: !state.NAVIGATION_COLLAPSED,
      }
    // case 'DISPLAY_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_COLOR_PICKER: !state.DISPLAY_COLOR_PICKER,
    //   }
    // case 'DISPLAY_MARKER_COLOR_PICEKR':
    //   return {
    //     ...state,
    //     DISPLAY_MARKER_COLOR_PICEKR: !state.DISPLAY_MARKER_COLOR_PICEKR,
    //   }
    // case 'DISPLAY_PAPER_BG_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_PAPER_BG_COLOR_PICKER: !state.DISPLAY_PAPER_BG_COLOR_PICKER,
    //   }
    // case 'DISPLAY_PLOT_BG_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_PLOT_BG_COLOR_PICKER: !state.DISPLAY_PLOT_BG_COLOR_PICKER,
    //   }
    // case 'DISPLAY_FONT_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_FONT_COLOR_PICKER: !state.DISPLAY_FONT_COLOR_PICKER,
    //   }
    case 'SHOW_DRAWER':
      return {
        ...state,
        SHOW_DRAWER: !state.SHOW_DRAWER,
      }
    case 'ENABLE_AXIS_TOP':
      return {
        ...state,
        ENABLE_AXIS_TOP: !state.ENABLE_AXIS_TOP,
      }
    case 'ENABLE_AXIS_RIGHT':
      return {
        ...state,
        ENABLE_AXIS_RIGHT: !state.ENABLE_AXIS_RIGHT,
      }
    case 'ENABLE_AXIS_BOTTOM':
      return {
        ...state,
        ENABLE_AXIS_BOTTOM: !state.ENABLE_AXIS_BOTTOM,
      }
    case 'ENABLE_AXIS_LEFT':
      return {
        ...state,
        ENABLE_AXIS_LEFT: !state.ENABLE_AXIS_LEFT,
      }
    case 'CHART_TYPE':
      return {
        ...state,
        CHART_TYPE: action.data,
      }
    case 'TITLE':
      return {
        ...state,
        TITLE: action.data,
      }
    case 'WIDTH':
      return {
        ...state,
        WIDTH: action.data,
      }
    case 'HEIGHT':
      return {
        ...state,
        HEIGHT: action.data,
      }
    case 'FONT_SIZE':
      return {
        ...state,
        FONT_SIZE: action.data,
      }
    case 'FONT_FAMILY':
      return {
        ...state,
        FONT_FAMILY: action.data,
      }
    case 'FONT_COLOR':
      return {
        ...state,
        FONT_COLOR: action.data,
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
    case 'MARGIN_BOTTOM':
      return {
        ...state,
        MARGIN_BOTTOM: action.data,
      }
    case 'MARGIN_LEFT':
      return {
        ...state,
        MARGIN_LEFT: action.data,
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
    case 'LINE_MODE':
      return {
        ...state,
        LINE_MODE: action.data,
      }
    case 'LINE_SHAPE':
      return {
        ...state,
        LINE_SHAPE: action.data,
      }
    case 'LINE_DASH':
      return {
        ...state,
        LINE_DASH: action.data,
      }
    case 'LINE_WIDTH':
      return {
        ...state,
        LINE_WIDTH: action.data,
      }
    // case 'MARKER_SIZE':
    //   return {
    //     ...state,
    //     MARKER_SIZE: action.data,
    //   }
    // case 'MARKER_COLOR':
    //   return {
    //     ...state,
    //     MARKER_COLOR: action.data,
    //   }
    // case 'MARKER_COLOR_PICKER':
    //   return {
    //     ...state,
    //     MARKER_COLOR_PICKER: action.data,
    //   }
    // case 'MAKRER_BORDER_WIDTH':
    //   return {
    //     ...state,
    //     MAKRER_BORDER_WIDTH: action.data,
    //   }
    // case 'MARKER_BORDER_COLOR_TEXT':
    //   return {
    //     ...state,
    //     MARKER_BORDER_COLOR_TEXT: action.data,
    //   }
    // case 'MARKER_BORDER_COLOR_PICKER':
    //   return {
    //     ...state,
    //     MARKER_BORDER_COLOR_PICKER: action.data,
    //   }
    // case 'DISPLAY_MARKER_BORDER_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_MARKER_BORDER_COLOR_PICKER: !state.DISPLAY_MARKER_BORDER_COLOR_PICKER,
    //   }
    case 'ENABLE_SELECT_MARKER_LABEL_POSITION':
      return {
        ...state,
        ENABLE_SELECT_MARKER_LABEL_POSITION: !state.ENABLE_SELECT_MARKER_LABEL_POSITION,
      }
    case 'MARKER_LABEL_POSITION':
      return {
        ...state,
        MARKER_LABEL_POSITION: action.data,
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
    case 'COLOR_PICKER':
      return {
        ...state,
        COLOR_PICKER: action.data,
      }
    case 'COLOR_TEXT':
      return {
        ...state,
        COLOR_TEXT: action.data,
      }
    case 'PAPER_BG_COLOR_PICKER':
      return {
        ...state,
        PAPER_BG_COLOR_PICKER: action.data,
      }
    case 'PAPER_BG_COLOR_TEXT':
      return {
        ...state,
        PAPER_BG_COLOR_TEXT: action.data,
      }
    case 'PLOT_BG_COLOR_PICKER':
      return {
        ...state,
        PLOT_BG_COLOR_PICKER: action.data,
      }
    case 'PLOT_BG_COLOR_TEXT':
      return {
        ...state,
        PLOT_BG_COLOR_TEXT: action.data,
      }
    case 'FONT_COLOR_PICKER':
      return {
        ...state,
        FONT_COLOR_PICKER: action.data,
      }
    case 'FONT_COLOR_TEXT':
      return {
        ...state,
        FONT_COLOR_TEXT: action.data,
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
