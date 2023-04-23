const reducer = (state: any, action: any) => {
  // console.log('action.type:', action.type)
  switch (action.type) {
    case 'ACTIVATE_TAB':
      return {
        ...state,
        ACTIVE_TAB: action.activeTab,
      }
    case 'REFRESH':
      return {
        ...state,
        ACTIVE_TAB: true,
      }

    default:
      return state
  }
}

export default reducer
