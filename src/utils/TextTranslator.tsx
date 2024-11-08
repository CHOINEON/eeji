export type PeriodType = 'yearly' | 'monthly' | 'daily' | 'weekly'

export function translatePeriodToKorean(period: PeriodType): string {
  const periodMap: Record<PeriodType, string> = {
    yearly: '년',
    monthly: '개월',
    weekly: '주',
    daily: '일',
  }

  return periodMap[period] || ''
}
