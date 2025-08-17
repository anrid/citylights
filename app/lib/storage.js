'use strict'

const PREFIX = '@PlaneraStorage'
const KEY_SAVED_SETTINGS = `${PREFIX}:saved`
const KEY_IDENTITY = `${PREFIX}:identity`

if (!window.localStorage) {
  console.error('Ops, `window.localStorage` does not exist !')
}
const { localStorage } = window

function _get (key) {
  const data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(data)
  }
  return null
}

function _set (key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getIdentity () {
  return _get(KEY_IDENTITY)
}

export function setIdentity (identity) {
  return _set(KEY_IDENTITY, identity)
}

export function getSavedSettings () {
  return _get(KEY_SAVED_SETTINGS)
}

export function setSavedSettings (saved) {
  return _set(KEY_SAVED_SETTINGS, saved)
}

export function removeIdentity (key) {
  localStorage.removeItem(KEY_IDENTITY)
}
