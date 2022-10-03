export function getDaysUntilShutdown() {
  const shutdownDate = new Date('11/30/2022')
  const diffTime = Number(shutdownDate) - Number(new Date(Date.now()))
  if (diffTime < 0) {
    return 0
  }
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
