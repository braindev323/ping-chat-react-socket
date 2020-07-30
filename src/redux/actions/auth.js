/* @flow */

import {
  AUTH_LOGIN,
  AUTH_SET_USER_DATA,
  AUTH_SET_USER_SETTING,
  AUTH_SET_BLOCKED_USERS,
  AUTH_BLOCK_USER,
  AUTH_UNBLOCK_USER,
  AUTH_SET_MUTED_USERS,
  AUTH_UPDATE_TOKEN,
  AUTH_EXPIRED,
  AUTH_LOGOUT,
  AUTH_TOGGLE_MODAL,
  AUTH_MODAL_TYPE,
} from '../type';

export const authLogin = (loginData: any) => {
  return {
    type: AUTH_LOGIN,
    data: { loginData }
  }
}

export const setUserData = (userData: any) => {
  return {
    type: AUTH_SET_USER_DATA,
    data: { userData }
  }
}

export const setUserSetting = (userSetting: any) => {
  return {
    type: AUTH_SET_USER_SETTING,
    data: { userSetting }
  }
}

export const setBlockedUsers = (blockedUsers: any) => {
  return {
    type: AUTH_SET_BLOCKED_USERS,
    data: { blockedUsers }
  }
}

export const blockUser = (user: any) => {
  return {
    type: AUTH_BLOCK_USER,
    data: { user }
  }
}

export const unblockUser = (user: any) => {
  return {
    type: AUTH_UNBLOCK_USER,
    data: { user }
  }
}

export const setMutedUsers = (mutedUsers: any) => {
  return {
    type: AUTH_SET_MUTED_USERS,
    data: { mutedUsers }
  }
}

export const authUpdateToken = (tokenData: any) => {
  return {
    type: AUTH_UPDATE_TOKEN,
    data: tokenData
  }
}

export const authTokenExpired = () => {
  return {
    type: AUTH_EXPIRED,
    data: { }
  }
}

export const authLogout = () => {
  return {
    type: AUTH_LOGOUT,
    data: { }
  }
}

export const toggleAuthModal = (isOpen: boolean, type: number = 0) => {
  return {
    type: AUTH_TOGGLE_MODAL,
    data: { isOpen, type }
  }
}

export const changeAuthModalType = (type: number) => {
  return {
    type: AUTH_MODAL_TYPE,
    data: { type }
  }
}