import React from 'react'

export const DialogContext = React.createContext<{open:boolean, onOpenChange?: (v:boolean)=>void}>({ open:false })

export function Dialog({ children, open, onOpenChange, ...rest }: any){
  return (
    <div {...rest}>
      {children}
    </div>
  )
}

export const DialogTrigger = ({ children, asChild }: any) => children
export const DialogContent = ({ children, className = '', ...rest }: any) => <div className={className} {...rest}>{children}</div>
export const DialogHeader = ({ children }: any) => <div className="pb-2">{children}</div>
export const DialogTitle = ({ children }: any) => <h3 className="text-lg font-semibold">{children}</h3>

export default Dialog
