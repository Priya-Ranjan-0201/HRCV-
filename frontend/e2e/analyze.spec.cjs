const { test, expect } = require('@playwright/test');
const path = require('path');

// ── MOCK API RESPONSE ────────────────────────────────────────────────────────
// Mirrors the AnalysisResponse schema from backend/main.py.
// Using a mock means the full E2E test is instant and NEVER depends on Render.
const MOCK_ANALYSIS_RESPONSE = {
  placement_probability: 82.5,
  placement_status: 'High Chance',
  skill_match_pct: 75.0,
  matched_skills: ['Python', 'React', 'JavaScript'],
  missing_skills: ['Docker', 'Kubernetes'],
  extracted_entities: { organizations: [], locations: [] },
  cv_text: 'Test resume content with skills in Python and React.',
  keyword_highlights: [
    { word: 'Python', type: 'matched', index: 40 },
    { word: 'React',  type: 'matched', index: 47 },
  ],
  github_analysis: [
    { issue: 'No GitHub Link Provided', severity: 'Info', detail: 'Add GitHub for enhanced analysis.' },
  ],
  market_pulse_adjustments: { boost_applied: true, trending_matched: 'Python' },
  hiring_analysis: {
    experience_category: 'Fresher (0-1 years)',
    best_fit_role: 'Software Engineer',
    best_fit_chance: 82.5,
    job_analysis: [],
  },
  experience_level: 'fresher',
  match_details: [],
};
// ─────────────────────────────────────────────────────────────────────────────

test.describe('CV Analyzer Flow', () => {

  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');
    // getByRole is strict-mode safe — matches only the <h1>
    await expect(
      page.getByRole('heading', { name: /ATS Resume Checker/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should open the wizard when "Check Your Resume" is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Check Your Resume/i }).click();
    await expect(
      page.getByRole('heading', { name: /Select Your Path/i })
    ).toBeVisible({ timeout: 8000 });
  });

  test('should show the upload form after selecting "Upload & Analyse"', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Check Your Resume/i }).click();
    await page.waitForTimeout(400);
    await page.locator('button:has-text("Upload & Analyse")').first().click();
    await expect(
      page.locator('text=Optimize Your CV')
    ).toBeVisible({ timeout: 8000 });
  });

  test('should accept a PDF file and enable the submit button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Check Your Resume/i }).click();
    await page.waitForTimeout(400);
    await page.locator('button:has-text("Upload & Analyse")').first().click();
    await page.waitForTimeout(400);

    const resumePath = path.join(__dirname, 'test-resume.pdf');
    await page.locator('input[type="file"]').nth(0).setInputFiles(resumePath);

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).not.toBeDisabled({ timeout: 5000 });
  });

  test('should complete full analysis and reach dashboard (mocked API)', async ({ page }) => {
    // ── INTERCEPT /analyze BEFORE navigating ─────────────────────────────────
    // page.route() intercepts the network call and returns a mock response
    // immediately. The test never hits the real Render backend, so it is
    // lightning-fast and works even when Render is sleeping.
    await page.route('**/analyze', async (route) => {
      // Simulate a small processing delay so the loading button state is visible
      await new Promise(resolve => setTimeout(resolve, 800));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ANALYSIS_RESPONSE),
      });
    });
    // ─────────────────────────────────────────────────────────────────────────

    await page.goto('/');
    await page.getByRole('button', { name: /Check Your Resume/i }).click();
    await page.waitForTimeout(400);
    await page.locator('button:has-text("Upload & Analyse")').first().click();
    await page.waitForTimeout(400);

    // Upload the dummy PDF
    const resumePath = path.join(__dirname, 'test-resume.pdf');
    await page.locator('input[type="file"]').nth(0).setInputFiles(resumePath);

    // Optionally fill CGPA
    const cgpaInput = page.locator('input[type="number"]');
    if (await cgpaInput.count() > 0) {
      await cgpaInput.first().fill('8.5');
    }

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // ✅ CRITICAL CHECK 1: Loading state appears — proves form was submitted
    await expect(
      page.locator('button[type="submit"]').filter({ hasText: /Grading/i })
    ).toBeVisible({ timeout: 5000 });

    // ✅ CRITICAL CHECK 2: Navigates to /dashboard within 15s (mocked = instant)
    // The Vite base path means the URL is /ML-Project-CV-Analysis/dashboard
    await expect(page).toHaveURL(/.+dashboard/, { timeout: 15000 });

    // ✅ CRITICAL CHECK 3: Dashboard content loads with the mocked analysis data
    await expect(
      page.locator('text=Placement Probability').first()
    ).toBeVisible({ timeout: 10000 });
  });

});
