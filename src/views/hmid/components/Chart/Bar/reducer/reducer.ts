// reducer function
const reducer = (state: any, action: any) => {
  console.log(state)
  switch (action.type) {
    case 'ENABLE_LEGEND':
      return {
        ...state,
        ENABLE_LEGEND: !state.ENABLE_LEGEND,
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
    case 'ENABLE_AXIS_LEFT':
      return {
        ...state,
        ENABLE_AXIS_LEFT: !state.ENABLE_AXIS_LEFT,
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
    // case 'NAVIGATION_COLLAPSED':
    //   return {
    //     ...state,
    //     NAVIGATION_COLLAPSED: !state.NAVIGATION_COLLAPSED,
    //   }
    case 'SHOW_DRAWER':
      return {
        ...state,
        SHOW_DRAWER: !state.SHOW_DRAWER,
      }
    // case 'ENABLE_MARKER_LABEL':
    //   return {
    //     ...state,
    //     ENABLE_MARKER_LABEL: !state.ENABLE_MARKER_LABEL,
    //   }
    case 'ENABLE_TEXT_POSITION':
      return {
        ...state,
        ENABLE_TEXT_POSITION: !state.ENABLE_TEXT_POSITION,
      }
    // case 'DISPLAY_PLOT_BG_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_PLOT_BG_COLOR_PICKER: !state.DISPLAY_PLOT_BG_COLOR_PICKER,
    //   }
    // case 'DISPLAY_PAPER_BG_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_PAPER_BG_COLOR_PICKER: !state.DISPLAY_PAPER_BG_COLOR_PICKER,
    //   }
    // case 'DISPLAY_MARKER_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_MARKER_COLOR_PICKER: !state.DISPLAY_MARKER_COLOR_PICKER,
    //   }
    // case 'DISPLAY_MARKER_BORDER_COLOR_PICKER':
    //   return {
    //     ...state,
    //     DISPLAY_MARKER_BORDER_COLOR_PICKER: !state.DISPLAY_MARKER_BORDER_COLOR_PICKER,
    //   }
    case 'BAR_MODE':
      return {
        ...state,
        BAR_MODE: action.data,
      }
    case 'TITLE':
      return {
        ...state,
        TITLE: action.data,
      }
    // case 'WIDTH':
    //   return {
    //     ...state,
    //     WIDTH: action.data,
    //   }
    // case 'HEIGHT':
    //   return {
    //     ...state,
    //     HEIGHT: action.data,
    //   }
    // case 'FONT_SIZE':
    //   return {
    //     ...state,
    //     FONT_SIZE: action.data,
    //   }
    // case 'FONT_FAMILY':
    //   return {
    //     ...state,
    //     FONT_FAMILY: action.data,
    //   }
    // case 'FONT_COLOR':
    //   return {
    //     ...state,
    //     FONT_COLOR: action.data,
    //   }
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
    case 'BAR_GAP':
      return {
        ...state,
        BAR_GAP: action.data,
      }
    case 'BAR_GROUP_GAP':
      return {
        ...state,
        BAR_GROUP_GAP: action.data,
      }
    // case 'MARKER_COLOR':
    //   return {
    //     ...state,
    //     MARKER_COLOR: action.data,
    //   }
    // case 'MARKER_OPACITY':
    //   return {
    //     ...state,
    //     MARKER_OPACITY: action.data,
    //   }
    // case 'MARKER_LINE_COLOR':
    //   return {
    //     ...state,
    //     MARKER_LINE_COLOR: action.data,
    //   }
    // case 'MARKER_BORDER_WIDTH':
    //   return {
    //     ...state,
    //     MARKER_BORDER_WIDTH: action.data,
    //   }
    case 'TEXT_POSITION':
      return {
        ...state,
        TEXT_POSITION: action.data,
      }
    // case 'PAPER_BG_COLOR_TEXT':
    //   return {
    //     ...state,
    //     PAPER_BG_COLOR_TEXT: action.data,
    //   }
    // case 'PLOT_BG_COLOR_TEXT':
    //   return {
    //     ...state,
    //     PLOT_BG_COLOR_TEXT: action.data,
    //   }
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
    // case 'MARKER_BORDER_COLOR_TEXT':
    //   return {
    //     ...state,
    //     MARKER_BORDER_COLOR_TEXT: action.data,
    //   }

    default:
      return state
  }
}

export default reducer
