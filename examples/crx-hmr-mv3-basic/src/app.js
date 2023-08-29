import React from 'react'

export const App = () => {
  return (
    <div
    style={{
      position: "fixed",
      zIndex: 99999,
      background: "white",
      color: "black",
      left: 0,
      top: 0,
    }}
    >
      TEST {/* Modify this text to see HMR working */}
    </div>
  )
}
