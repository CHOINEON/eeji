// reducer function
const reducer = (state: any, action: any) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log(action)
  console.log(state)
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  switch (action.type) {
    case 'COMPANY_ID':
      return {
        ...state,
        COMPANY_ID: action.data,
      }
    case 'LAYOUT_NAME':
      return {
        ...state,
        LAYOUT_NAME: action.data,
      }
    case 'LAYOUT_ID':
      return {
        ...state,
        LAYOUT_ID: action.data,
      }
    case 'ELEMENT':
      return {
        ...state,
        ELEMENT: action.data,
      }
    case 'GRID_ID':
      return {
        ...state,
        GRID_ID: action.data,
      }
    case 'DATA':
      return {
        ...state,
        BOX_ID: action.data,
      }

    default:
      return state
  }
}

export default reducer
