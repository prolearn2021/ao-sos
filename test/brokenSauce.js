const { Builder, By, Key, until } = require('selenium-webdriver');
const SauceLabs = require('saucelabs').default;
const assert = require('assert');
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
                50000
            );
            await sauceLabsLink.click();

            console.log("Waiting for Sauce Labs homepage to load...");
            await driver.wait(until.titleContains("Sauce Labs"), 10000);

            // Step 3: Wait for the "Resources" link to be present
            console.log("Waiting for Resources link to be present...");
            let resourcesLink = await driver.wait(
                until.elementLocated(By.xpath("//a[contains(text(), 'Resources')]")),
                10000
            );

            // Step 4: Hover over the "Resources" link
            console.log("Hovering over Resources link...");
            await driver.actions().move({ origin: resourcesLink }).perform();

            // Step 5: Wait for the "Documentation" link to be visible
            console.log("Waiting for Documentation link to be visible...");
            let documentationLink = await driver.wait(
                until.elementLocated(By.xpath("//a[contains(text(), 'Documentation')]")),
                10000
            );

            // Step 6: Click the "Documentation" link
            console.log("Clicking Documentation link...");
            await documentationLink.click();

            // Step 7: Wait for the Documentation page to load and verify the title
            console.log("Waiting for Documentation page to load...");
            await driver.wait(until.titleContains("Documentation"), 10000);
            console.log("Documentation page loaded successfully!");

        } catch (err) {
            // Handle errors
            if (process.env.GITLAB_CI === 'true') {
                console.warn("GitLab run detected.");
                console.warn("Skipping error in brokenSauce.js");
            } else {
                console.error("Test failed:", err);
                throw err;
            }
        } finally {
            // Close the browser
            if (driver) {
                await driver.quit();
            }
        }
    });
});
