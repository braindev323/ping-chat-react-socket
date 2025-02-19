/* @flow */

import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './reducers';


const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['notification', 'sidebar', 'postmodal'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function initializeStore() {

  let store = createStore(persistedReducer);
  let persistor = persistStore(store);

  return { store, persistor }
}