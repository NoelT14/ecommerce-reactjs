type Variant = 'green' | 'red' | 'yellow' | 'gray' | 'blue' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

const STYLES: Record<Variant, string> = {
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  gray:   'bg-gray-100 text-gray-600',
  blue:   'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
}

export default function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[variant]} ${className}`}>
      {children}
    </span>
  )
}

/** Maps a product stockStatus string to the Badge variant */
export function stockBadge(status: string): { label: string; variant: Variant } {
  switch (status) {
    case 'in_stock':   return { label: 'In stock',    variant: 'green' }
    case 'low_stock':  return { label: 'Low stock',   variant: 'yellow' }
    case 'backorder':  return { label: 'Backorder',   variant: 'blue' }
    case 'out_of_stock': return { label: 'Out of stock', variant: 'red' }
    default:           return { label: status,        variant: 'gray' }
  }
}
