// Minutes are deliberately kept unrounded until they are displayed.
export function calculateStudyPlan({ minutes, speed, days, dailyMinutes, reviewPercent }) {
  const values = [minutes, speed, days, dailyMinutes, reviewPercent];
  if (!values.every(Number.isFinite)
    || minutes < 1 || minutes > 100000
    || speed < 0.25 || speed > 4
    || !Number.isInteger(days) || days < 1 || days > 366
    || dailyMinutes < 1 || dailyMinutes > 1440
    || reviewPercent < 0 || reviewPercent > 200) return null;

  const viewingMinutes = minutes / speed;
  const requiredMinutes = viewingMinutes * (1 + reviewPercent / 100);
  const capacityMinutes = days * dailyMinutes;
  return {
    viewingMinutes,
    requiredMinutes,
    capacityMinutes,
    dailyTargetMinutes: requiredMinutes / days,
    balanceMinutes: capacityMinutes - requiredMinutes
  };
}
