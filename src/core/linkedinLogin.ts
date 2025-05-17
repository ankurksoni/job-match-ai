import { LINKEDIN_HOME_URL } from '../constant/constants.js';
import { Page } from 'playwright';

export async function loginToLinkedIn(page: Page, username?: string, password?: string): Promise<void> {
  
    await page.goto(LINKEDIN_HOME_URL, { waitUntil: 'domcontentloaded' });
  
  if (username && password) {
    try {
      // Click 'Sign in with email' if present
      const signInWithEmailSelector = 'button[aria-label="Sign in with email"]';
      const signInWithEmailBtn = await page.$(signInWithEmailSelector);

      if (signInWithEmailBtn) {
        await signInWithEmailBtn.click();
        await page.waitForTimeout(1000);
      }

      // Click 'Sign in' link if present
      const signInLinkSelector = 'a[href*="/login"]:visible, a:has-text("Sign in")';
      const signInLink = await page.$(signInLinkSelector);
      
      if (signInLink) {
        await signInLink.click();
        await page.waitForTimeout(1000);
      }
      
      // Wait for login form
      await page.waitForSelector('input#username', { timeout: 20000 });
      
      await page.fill('input#username', username);
      
      await page.fill('input#password', password);
      
      // Untick 'Remember me' if checked
      const rememberMeCheckbox = await page.locator('#rememberMeOptIn-checkbox');
      if (await rememberMeCheckbox.count() > 0) {
        const isChecked = await rememberMeCheckbox.isChecked();
        if (isChecked) {
          try {
            await rememberMeCheckbox.click({ force: true });
            console.log("'Remember me' is now unchecked (via click). ");
          } catch (err) {
            await page.evaluate(() => {
              const cb = document.getElementById('rememberMeOptIn-checkbox') as HTMLInputElement;
              if (cb && cb.checked) cb.checked = false;
            });
            console.log("'Remember me' is now unchecked (via JS fallback). ");
          }
        } else {
          console.log("'Remember me' is already unchecked.");
        }
      }

      await page.click('button[type="submit"]');
      
      // Wait for successful login
      await page.waitForSelector('nav, .global-nav__me-photo, .jobs-search-box', { timeout: 20000 });
      console.log('LinkedIn login successful.');
    } catch (err) {
      console.error('Automated login failed:', err);
      
      await new Promise<void>(resolve => {
        process.stdin.resume();
        process.stdin.once('data', () => resolve());
      });
    }
  } else {
    console.error('Username and password are required for automated login.');
    process.exit(1);
  }
} 