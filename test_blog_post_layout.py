from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000/blog/")
    page.wait_for_timeout(1000)

    # Take screenshot of the blog list layout
    page.screenshot(path="/home/jules/verification/screenshots/handsome_list.png")
    page.wait_for_timeout(1000)

    # Click on the first blog post
    page.get_by_role("link", name="Second Blog Post").first.click()
    page.wait_for_timeout(1000)

    # Take screenshot of the blog detail layout
    page.screenshot(path="/home/jules/verification/screenshots/handsome_detail.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
