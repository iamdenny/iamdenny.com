import { createGoogleAnalytics } from './analytics.js';
import { initializeAnalyticsConsent } from './analytics-consent.js';

initializeAnalyticsConsent(window, document, createGoogleAnalytics());

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
