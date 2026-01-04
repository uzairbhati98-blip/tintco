import { ReactNode } from 'react'
import Link from 'next/link'

interface CardProps {
  href?: string
  children: ReactNode
  className?: string
}

export function Card({ href, children, className = '' }: CardProps) {
  const cardClasses = `rounded-2xl overflow-hidden border card-hover ${className}`

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {children}
      </Link>
    )
  }

  return <div className={cardClasses}>{children}</div>
}