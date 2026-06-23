const MS_PER_SECOND = 1000
const MS_PER_MINUTE = MS_PER_SECOND * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24

const thresholds = [
  { unit: 'year', ms: MS_PER_DAY * 365 },
  { unit: 'month', ms: MS_PER_DAY * 30 },
  { unit: 'week', ms: MS_PER_DAY * 7 },
  { unit: 'day', ms: MS_PER_DAY },
  { unit: 'hour', ms: MS_PER_HOUR },
  { unit: 'minute', ms: MS_PER_MINUTE },
]

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()

  for (const { unit, ms } of thresholds) {
    if (Math.abs(diff) >= ms || unit === 'minute') {
      const value = Math.round(diff / ms)
      return rtf.format(-value, unit)
    }
  }

  return 'just now'
}
