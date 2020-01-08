/*
 *
 * HomePage actions
 *
 */

import {
  GET_DATA,
  GET_DATA_SUCCESS,
  DROP_SUCCESS,
  ON_DROP,
  SET_LOADING,
  UNSET_LOADING
} from "./constants";

export function uploadSuccess(newPizzas) {
  return {
    type: DROP_SUCCESS,
    newPizzas
  };
}

export function getData() {
  return {
    type: GET_DATA
  };
}

export function getDataSuccess(data, entriesNumber) {
  return {
    type: GET_DATA_SUCCESS,
    data,
    entriesNumber
  };
}

export function setLoading() {
  return {
    type: SET_LOADING
  };
}

export function unsetLoading() {
  return {
    type: UNSET_LOADING
  };
}

export function onDrop({ dataTransfer: { files } }) {
  const formData = Object.keys(files).reduce((acc, current) => {
    acc.append("files", files[current]);
    return acc;
  }, new FormData());

  return {
    type: ON_DROP,
    formData
  };
}
