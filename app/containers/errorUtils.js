
import React from 'react'

import PopupBox from '../components/PopupBox'

export function getPopupError (error) {
  const code = error && error.code
  if (!code) {
    return null
  }

  let errorMessage
  switch (code) {
    case 400:
      errorMessage = error.error.message
      break
    case 401:
      errorMessage = 'Invalid email or password'
      break
    default:
      errorMessage = 'Internal server error'
  }
  return (
    <PopupBox>{errorMessage}</PopupBox>
  )
}
