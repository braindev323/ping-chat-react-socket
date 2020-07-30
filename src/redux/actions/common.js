/* @flow */

import {
  COMMON_SET_CATEGORY,
  COMMON_SET_COUNTRY,
  COMMON_SET_LANGUAGE,
} from '../type';

export const setCategories = (categories: Array<any>) => {
  return {
    type: COMMON_SET_CATEGORY,
    data: { categories }
  }
}

export const setCountries = (countries: Array<any>) => {
  return {
    type: COMMON_SET_COUNTRY,
    data: { countries }
  }
}

export const setLanguages = (languages: Array<any>) => {
  return {
    type: COMMON_SET_LANGUAGE,
    data: { languages }
  }
}