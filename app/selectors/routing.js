'use strict'

export function getRoute (routing) {
  if (routing && routing.locationBeforeTransitions) {
    return routing.locationBeforeTransitions.pathname
  }
  return false
}
