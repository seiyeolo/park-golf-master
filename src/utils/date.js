/**
 * D-day 계산 함수 (YYYY-MM-DD를 로컬 타임존으로 파싱)
 */
export const calculateDday = (examDate) => {
  if (!examDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = examDate.split('-').map(Number);
  const exam = new Date(year, month - 1, day);
  const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  return diff;
};
