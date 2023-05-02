import {
  // GET_TARGET_VARIABLE,
  // SET_TARGET_VARIABLE,
  // GET_EXPLANATORY_VARIABLE,
  // SET_EXPLANATORY_VARIABLE,
  TARGET_VARIABLE,
  EXPLANATORY_VARIABLE,
} from './actionTypes'
import initialState from './initialState'

//store 값 변경
const TagSelectReducer = (state: any = initialState, action: any) => {
  // console.log('---------------TagSelectReducer---------------:', action)

  switch (action.type) {
    case TARGET_VARIABLE:
      return {
        ...state,
        targetTag: action.payload,
      }
    case EXPLANATORY_VARIABLE:
      return {
        ...state,
        explanatoryTag: action.payload,
      }
    // case GET_TARGET_VARIABLE:
    //   return {
    //     ...state,
    //     targetTag: state.targetTag,
    //     loading: false,
    //   }
    // case SET_TARGET_VARIABLE:
    //   return {
    //     ...state,
    //     targetTag: action.payload,
    //   }
    // case GET_EXPLANATORY_VARIABLE:
    //   return {
    //     ...state,
    //     explanatoryTag: state.explanatoryTag,
    //   }
    // case SET_EXPLANATORY_VARIABLE:
    //   return {
    //     ...state,
    //     explanatoryTag: action.payload,
    //   }
    default:
      return state
  }
}

export default TagSelectReducer
