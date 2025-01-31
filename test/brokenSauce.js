const { Builder, By, Key, until, Actions } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const utils = require('./utils');

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;

describe('Broken Sauce', function () {
    this.timeout(120000); // Increase timeout to 2 minutes

    it('should navigate to Sauce Labs homepage and click Documentation', async function () {
        let driver;
        try {
            driver = await new Builder()
                .withCapabilities(utils.brokenCapabilities)
                .usingServer(ONDEMAND_URL)
                .build();

            await driver.sleep(2000);
            console.log("Navigating to Google...");
            await driver.get("https://www.google.com");
            await driver.sleep(2000);

            console.log("Handling GDPR modal...");
            try {
                let gdprAcceptButton = await driver.findElement(By.xpath("//div[text()='I agree']"));
                await gdprAcceptButton.click();
            } catch (error) {
                console.log("GDPR modal not found, proceeding without handling it.");
            }

            await driver.sleep(2000);
            console.log("Entering search term...");
            let searchBox = await driver.findElement(By.name("q"));
            await searchBox.sendKeys("Sauce Labs", Key.RETURN);
            await driver.sleep(2000);

            console.log("Waiting for search results...");
            let sauceLabsLink = await driver.wait(
                until.elementLocated(By.css('a[href="https://saucelabs.com/"]')),
                10000
            );
            await sauceLabsLink.click();

            console.log("Waiting for Sauce Labs homepage to load...");
            await driver.wait(until.titleContains("Sauce Labs"), 10000);

            // Debugging: Take a screenshot of the homepage
            await driver.takeScreenshot().then((image) => {
                require('fs').writeFileSync('screenshot_homepage.png', image, 'base64');
            });
            // Step 0: Handle the cookie consent dialog (if it appears)
            console.log("Checking for cookie consent banner...");
            try {
                let cookieConsentButton = await driver.wait(
                    until.elementLocated(By.id("onetrust-close-btn-container")),
                    10000
                );
                console.log("Cookie consent banner found, closing it...");
                await cookieConsentButton.click();
                await driver.sleep(1000); // wait for the dialog to close
            } catch (error) {
                console.log("Cookie consent banner not found or already closed.");
            }
            // Step 1: Locate the "Developers" dropdown trigger
            console.log("Waiting for Developers dropdown trigger to be present...");
            let developersTrigger = await driver.wait(
                until.elementLocated(By.xpath("//span[contains(text(), 'Developers')]")),
                10000
            );

            // Step 2: Hover over the "Developers" dropdown trigger to expand it
            console.log("Hovering over Developers dropdown trigger...");
            let actions = driver.actions({ bridge: true });
            await actions.move({ origin: developersTrigger }).perform();

            // Debugging: Take a screenshot after hovering
            await driver.takeScreenshot().then((image) => {
                require('fs').writeFileSync('screenshot_after_hover.png', image, 'base64');
            });

            // Step 3: Wait for the dropdown content to be visible
            console.log("Waiting for dropdown content to be visible...");
            await driver.sleep(3000); // Increase delay to ensure dropdown is fully expanded

            // Step 4: Locate and click the "Documentation" link using a more robust XPath
            console.log("Waiting for Documentation link to be visible...");
            let documentationLink = await driver.wait(
                until.elementLocated(By.xpath("//a[normalize-space(text())='Documentation']")),
                20000 // Increased timeout to 20 seconds
            );

            // Debugging: Log the location of the Documentation link
            let documentationLinkLocation = await documentationLink.getRect();
            console.log("Documentation link location:", documentationLinkLocation);

            console.log("Clicking Documentation link...");
            await documentationLink.click();

            // Step 5: Wait for Documentation page to load and verify the title
            console.log("Waiting for Documentation page to load...");
            await driver.wait(until.titleContains("Documentation"), 15000); // Increased wait time for the Documentation page
            console.log("Documentation page loaded successfully!");

        } catch (err) {
            console.error("Test failed:", err);

            // Debugging: Save the page source for further analysis
            let pageSource = await driver.getPageSource();
            fs.writeFileSync('page_source.html', pageSource);
            console.log("Page source saved to page_source.html");

            throw err;
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    });
});
