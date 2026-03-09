import { test, expect } from '@playwright/test';

test.describe('핵심 플로우 6개 시나리오 테스트', () => {

  /** localStorage에 사용자 데이터를 세팅한 뒤 페이지를 로드하는 헬퍼 */
  const setupUserAndGoto = async (page, overrides = {}) => {
    const user = overrides.user ?? '테스터';
    const profile = overrides.profile ?? { name: user, objective: '테스트', examDate: '2026-10-10' };
    const extras = overrides.extras ?? {};

    await page.addInitScript(({ user, profile, extras }) => {
      window.localStorage.clear();
      window.localStorage.setItem('parkgolf_current_user', user);
      window.localStorage.setItem(`parkgolf_${user}_profile`, JSON.stringify(profile));
      for (const [k, v] of Object.entries(extras)) {
        window.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      }
    }, { user, profile, extras });

    await page.goto('/');
  };

  /** 웰컴 모달("💪 학습 시작")이 뜨면 닫아주는 헬퍼 */
  const dismissWelcomeModal = async (page) => {
    const welcomeBtn = page.locator('button', { hasText: '학습 시작' });
    try {
      await welcomeBtn.waitFor({ state: 'visible', timeout: 3000 });
      await welcomeBtn.click();
      // 모달이 닫힐 때까지 대기
      await welcomeBtn.waitFor({ state: 'hidden', timeout: 2000 });
    } catch {
      // 모달이 없으면 무시
    }
  };

  test('초기 접속 시 프로필 설정 모달이 노출되어야 한다', async ({ page }) => {
    // 새 사용자: localStorage 비운 상태로 시작
    await page.addInitScript(() => { window.localStorage.clear(); });
    await page.goto('/');

    // 프로필 설정 모달의 제목 확인
    const profileHeading = page.locator('h2', { hasText: /프로필|환영/i }).first();
    await expect(profileHeading).toBeVisible();

    // 이름 입력 후 저장
    await page.fill('input[type="text"]:not([readonly])', '테스터');
    const submitBtn = page.locator('button', { hasText: /시작하기|저장/i }).first();
    await submitBtn.click();

    // 메인 화면 제목이 보이면 성공
    await expect(page.locator('h1', { hasText: /파크골프 마스터/i })).toBeVisible();
  });

  test('프로필 설정 후 메인 학습 화면이 렌더링되어야 한다', async ({ page }) => {
    await setupUserAndGoto(page);
    await dismissWelcomeModal(page);

    // 메인 제목
    await expect(page.locator('h1', { hasText: /파크골프/i })).toBeVisible();
    // 플래시카드 Q1 표시
    await expect(page.locator('text=터치하여 정답')).toBeVisible();
    // 카운터 1/354
    await expect(page.locator('text=/\\/354/')).toBeVisible();
  });

  test('플래시카드와 학습 컨트롤이 정상 렌더링되어야 한다', async ({ page }) => {
    await setupUserAndGoto(page);
    await dismissWelcomeModal(page);

    // 카운터 확인
    await expect(page.locator('text=/\\/354/')).toBeVisible();
    // 랜덤 버튼 확인
    await expect(page.getByRole('button', { name: '랜덤' })).toBeVisible();
    // 카드 터치 → 정답 보기
    await page.locator('text=터치하여 정답').click();
    // 자기평가 버튼 노출
    await expect(page.getByRole('button', { name: '알았어요' })).toBeVisible();
    await expect(page.getByRole('button', { name: '몰랐어요' })).toBeVisible();
  });

  test('카테고리 선택 시 필터링된 학습 뷰가 렌더링되어야 한다', async ({ page }) => {
    await setupUserAndGoto(page);
    await dismissWelcomeModal(page);

    // 카테고리 모달 열기
    await page.getByRole('button', { name: '카테고리 선택' }).click();
    await expect(page.locator('h2', { hasText: '학습 카테고리' })).toBeVisible();

    // '경기 규칙' 카테고리 선택
    await page.getByRole('button', { name: /경기 규칙/ }).click();

    // 필터링 후 카운터가 129개로 변경
    await expect(page.locator('text=/\\/129/')).toBeVisible();
    // 플래시카드가 여전히 표시
    await expect(page.locator('text=터치하여 정답')).toBeVisible();
  });

  test('즐겨찾기 토글이 정상 동작해야 한다', async ({ page }) => {
    await setupUserAndGoto(page, {
      extras: { 'parkgolf_테스터_favorites': [] }
    });
    await dismissWelcomeModal(page);

    // 플래시카드의 즐겨찾기(별) 버튼 클릭
    const starBtn = page.locator('main button').first();
    await starBtn.click();

    // 즐겨찾기가 localStorage에 저장되었는지 확인
    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('parkgolf_테스터_favorites') || '[]')
    );
    expect(favorites.length).toBe(1);

    // 다시 클릭 → 즐겨찾기 해제
    await starBtn.click();
    const favoritesAfter = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('parkgolf_테스터_favorites') || '[]')
    );
    expect(favoritesAfter.length).toBe(0);
  });

  test('학습 통계 모달에서 진행률과 사용자 정보가 표시되어야 한다', async ({ page }) => {
    await setupUserAndGoto(page, {
      profile: { name: '테스터', objective: '합격 목표', examDate: '2026-10-10' }
    });
    await dismissWelcomeModal(page);

    // 학습 통계 모달 열기
    await page.getByRole('button', { name: '학습 통계' }).click();
    await expect(page.locator('h2', { hasText: '학습 통계' })).toBeVisible();

    // 사용자 이름과 목표 표시 확인
    await expect(page.locator('text=테스터님의 학습 현황')).toBeVisible();
    await expect(page.locator('text=합격 목표')).toBeVisible();

    // 전체 진행률 섹션 확인
    await expect(page.locator('h3', { hasText: '전체 진행률' })).toBeVisible();
    // 카테고리별 진행률 확인
    await expect(page.locator('h3', { hasText: '카테고리별 진행률' })).toBeVisible();
  });
});
