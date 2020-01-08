import { Map } from "immutable";
import { get, isObject } from "lodash";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { request } from "strapi-helper-plugin";

import pluginId from "../../pluginId";

import {
  uploadSuccess,
  getDataSuccess,
  getData,
  setLoading,
  unsetLoading
} from "./actions";
import { GET_DATA, ON_DROP } from "./constants";

function* dataGet() {
  try {
    const data = yield all([
      call(request, "/importer/pizza", { method: "GET" }),
      call(request, "/importer/pizza/count", { method: "GET" })
    ]);
    const entries = data[0].length === 0 ? [] : data[0].map(obj => Map(obj));
    yield put(getDataSuccess(entries, data[1].count));
  } catch (err) {
    strapi.notification.error("notification.error");
  }
}

function* upload(action) {
  try {
    yield put(setLoading());
    const headers = {};
    const response = yield call(
      request,
      "/importer/pizza",
      { method: "POST", headers, body: action.formData },
      false,
      false
    );
    const pizzas = response.map(piza => Map(piza));

    yield put(uploadSuccess(pizzas));
    yield put(getData());

    strapi.notification.success({
      id: "importer.notification.uploadFile.success"
    });
  } catch (error) {
    let message = get(error, [
      "response",
      "payload",
      "message",
      "0",
      "messages",
      "0"
    ]);
    if (isObject(message))
      message = { ...message, id: `${pluginId}.${message.id}` };

    strapi.notification.error(message || "notification.error");
  } finally {
    yield put(unsetLoading());
  }
}

export function* defaultSaga() {
  yield fork(takeLatest, ON_DROP, upload);
  yield fork(takeLatest, GET_DATA, dataGet);
}

export default defaultSaga;
