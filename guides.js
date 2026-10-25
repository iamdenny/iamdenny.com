import { createGoogleAnalytics } from './analytics.js';
import { initializeAnalyticsConsent } from './analytics-consent.js';
import { calculateStudyPlan } from './guide-calculations.js';

initializeAnalyticsConsent(window, document, createGoogleAnalytics());

const studyForm = document.querySelector('#study-calculator');
const studyResult = document.querySelector('#study-result');
if (studyForm && studyResult) {
  const formatter = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1 });
  studyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const read = (name) => studyForm.elements.namedItem(name).valueAsNumber;
    const result = calculateStudyPlan({
      minutes: read('minutes'), speed: read('speed'), days: read('days'),
      dailyMinutes: read('dailyMinutes'), reviewPercent: read('reviewPercent')
    });
    if (!result) {
      studyResult.textContent = '각 입력값의 허용 범위를 확인해 주세요.';
      return;
    }
    const format = (value) => formatter.format(value);
    const balance = Math.abs(result.balanceMinutes) < 0.000001
      ? '사용 가능한 시간과 필요한 시간이 같습니다.'
      : result.balanceMinutes < 0
        ? `${format(-result.balanceMinutes)}분이 부족합니다.`
        : `${format(result.balanceMinutes)}분의 여유가 있습니다.`;
    studyResult.textContent = `순수 시청 ${format(result.viewingMinutes)}분, 복습 포함 필요 ${format(result.requiredMinutes)}분입니다. 사용 가능 시간은 ${format(result.capacityMinutes)}분으로 ${balance} 하루 평균 ${format(result.dailyTargetMinutes)}분이 필요합니다.`;
  });
  studyForm.hidden = false;
}

const participants = document.querySelector('#participants');
const knockoutMatches = document.querySelector('#knockout-matches');
const leagueMatches = document.querySelector('#league-matches');
const matchHelp = document.querySelector('#match-help');

if (participants && knockoutMatches && leagueMatches && matchHelp) {
  const updateMatchCounts = () => {
    const count = participants.valueAsNumber;
    if (!Number.isInteger(count) || count < 2 || count > 256) {
      knockoutMatches.textContent = '—';
      leagueMatches.textContent = '—';
      matchHelp.textContent = '참가자 수를 2명에서 256명 사이의 정수로 입력해 주세요.';
      return;
    }

    const knockout = count - 1;
    const league = count * (count - 1) / 2;
    knockoutMatches.textContent = String(knockout);
    leagueMatches.textContent = String(league);
    const difference = league - knockout;
    matchHelp.textContent = `${count}명은 토너먼트 ${knockout}경기, 풀리그 ${league}경기입니다. 풀리그는 ${difference}경기 더 필요합니다. 실제 진행 시간은 경기 길이와 사용 가능한 코트 수에 따라 달라집니다.`;
  };

  participants.addEventListener('input', updateMatchCounts);
  participants.addEventListener('change', updateMatchCounts);
}
