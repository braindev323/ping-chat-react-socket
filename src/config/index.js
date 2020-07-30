/* @flow */


export default {
  server_root_url: process.env.REACT_APP_SERVER_ROOT_URL || '',
  key_token: process.env.REACT_APP_KEY_TOKEN || 'auth_token',
  google_api_key: process.env.REACT_APP_GOOGLE_API_KEY || '',
}