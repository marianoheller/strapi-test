/*
 *
 * HomePage reducer
 *
 */

import { fromJS, List, Map } from "immutable";

import {
  GET_DATA_SUCCESS,
  SET_LOADING,
  UNSET_LOADING,
  DROP_SUCCESS
} from "./constants";

const initialState = fromJS({
  pizzasLoading: false,
  pizzas: List([])
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case DROP_SUCCESS:
      return state.update("pizzasFiles", list =>
        List(action.newPizzas).concat(list)
      );
    case GET_DATA_SUCCESS:
      return state.update("pizzas", () => List(action.data));
    case SET_LOADING:
      return state.update("uploadFilesLoading", () => true);
    case UNSET_LOADING:
      return state.update("uploadFilesLoading", () => false);
    default:
      return state;
  }
}

export default homePageReducer;
