import React from 'react'

export function Toaster({ richColors, position }: { richColors?: boolean, position?: string }){
  return <div aria-hidden className={`toaster-root ${position ?? ''}`}>{richColors ? null : null}</div>
}

export default Toaster
