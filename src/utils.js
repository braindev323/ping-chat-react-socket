/* @flow */

import moment from "moment";

export function formatNumber(value: number) {
  const digit = value.toString().length;
  if (digit > 3) {
    value = Math.floor(value / Math.pow(10, digit - 3));
  }
  if (digit > 9) {
    return (value / Math.pow(10, 12 - digit)).toString() + "b";
  } else if (digit > 6) {
    return (value / Math.pow(10, 9 - digit)).toString() + "m";
  } else if (digit > 3) {
    return (value / Math.pow(10, 6 - digit)).toString() + "k";
  } else {
    return value.toString();
  }
}

export function formatDate(date: Date, format: string) {
  return moment(date).format(format);
}

export function formatTime(seconds: number) {
  function pad(string) {
    return ("0" + string).slice(-2);
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function fromNow(date: Date) {
  return moment(date).fromNow();
}

export function isURL(url: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(url);
}

export function listToComments(list: any = []) {
  var map = {},
    node,
    roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.reply_id) {
      // if you have dangling branches check that map[node.reply_id] exists
      list[map[node.reply_id]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
