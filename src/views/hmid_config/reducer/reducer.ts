// reducer function
const reducer = (state: any, action: any) => {
  // console.log(action.data)
  console.log(state.GRID_ID)
  switch (action.type) {
    case 'COMPANY_ID':
      return {
        ...state,
        COMPANY_ID: action.data,
      }
    case 'LAYOUT_ID':
      return {
        ...state,
        LAYOUT_ID: action.data,
      }
    case 'LAYOUT_NAME':
      return {
        ...state,
        LAYOUT_NAME: action.data,
      }
    case 'GRID_ID':
      return {
        ...state,
        GRID_ID: action.data,
      }
    case 'GRID_DATA':
      return {
        ...state,
        GRID_DATA: action.data,
      }
    default:
      return state
  }
}

export default reducer
