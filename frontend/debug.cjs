const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
        page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

        console.log("Navigating to http://localhost:8080...");
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0', timeout: 10000 });
        
        console.log("Navigation complete. Getting body HTML...");
        const html = await page.evaluate(() => document.body.innerHTML);
        console.log("HTML length:", html.length);
        if (html.length < 500) {
            console.log("HTML CONTENT:", html);
        }
        await browser.close();
        console.log("Done.");
    } catch (err) {
        console.error("SCRIPT ERROR:", err);
        process.exit(1);
    }
})();
