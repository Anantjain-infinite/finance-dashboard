function buildPath(data, width, height, padding = 4) {
  if (!data || data.length < 2) return ''
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const stepX = (width - padding * 2) / (data.length - 1)

  const points = data.map((v, i) => {
    const x = padding + i * stepX
    const y = padding + (1 - (v - min) / range) * (height - padding * 2)
    return [x, y]
  })

  const d = points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x} ${y}`
      const [px, py] = points[i - 1]
      const cpx = (px + x) / 2
      return `C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`
    })
    .join(' ')

  // Area path (close to bottom)
  const area = `${d} L ${points[points.length - 1][0]} ${height} L ${padding} ${height} Z`

  return { line: d, area }
}

export default function MiniSparkline({ data = [], color = '#3b82f6', height = 40, width = 80 }) {
  const paths = buildPath(data, width, height)
  if (!paths) return null

  const id = `spark-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 7)}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={paths.area} fill={`url(#${id})`} />
      <path
        d={paths.line}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
