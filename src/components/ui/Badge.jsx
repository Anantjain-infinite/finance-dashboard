import { cn } from '../../utils/cn'

export default function Badge({ children, className, dot, style }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        className
      )}
      style={style}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dot }}
        />
      )}
      {children}
    </span>
  )
}
