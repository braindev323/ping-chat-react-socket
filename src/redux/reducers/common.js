/* @flow */

import {
  COMMON_SET_CATEGORY,
  COMMON_SET_COUNTRY,
  COMMON_SET_LANGUAGE,
} from '../type';


const INITIAL = {
  categories: [],
  countries: [],
  languages: [],
}

export default (state: any = INITIAL, action: any) => {
  switch (action.type) {
    case COMMON_SET_CATEGORY: {
      const { categories } = action.data;

      return { ...state, categories };
    }

    case COMMON_SET_COUNTRY: {
      const { countries } = action.data;

      return { ...state, countries };
    }

    case COMMON_SET_LANGUAGE: {
      const { languages } = action.data;

      return { ...state, languages };
    }

    default:
      return state;
  }
}