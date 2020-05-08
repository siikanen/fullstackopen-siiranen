import React from 'react'

const Notification = ({message, style}) => {
  if ( message === null ) 
      return null
  else {
    return (
      <div className={style}>
          {message}
      </div>
    )
  }
}

export default Notification