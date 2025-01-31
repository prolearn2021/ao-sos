const date = new Date().toISOString();

const brokenCapabilities = {
    'browserName': 'chrome', // Use 'chrome' instead of 'googlechrome'
    'platformName': 'macOS 10.15',
    'browserVersion': 'latest',
    'goog:chromeOptions': {
        args: [
            '--disable-blink-features=AutomationControlled', // Disable automation detection
            '--no-sandbox', // Disable sandbox for CI environments
            '--disable-dev-shm-usage', // Avoid /dev/shm usage in Docker
            '--disable-gpu', // Disable GPU hardware acceleration
            '--window-size=1280,960', // Set window size
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' // Set a valid user-agent
        ],
    },
    'sauce:options': {
        'name': 'Broken Google Search',
        'screenResolution': '1280x960',
        'build': process.env.GITLAB_CI ? `${process.env.CI_JOB_NAME}-${date}` : `support-tech-test-${date}`
    }
};

const workingCapabilities = {
    'browserName': 'chrome', // Use 'chrome' instead of 'googlechrome'
    'platformName': 'macOS 10.15',
    'browserVersion': 'latest',
    'goog:chromeOptions': {
        args: [
            '--disable-blink-features=AutomationControlled', // Disable automation detection
            '--no-sandbox', // Disable sandbox for CI environments
            '--disable-dev-shm-usage', // Avoid /dev/shm usage in Docker
            '--disable-gpu', // Disable GPU hardware acceleration
            '--window-size=1280,960', // Set window size
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' // Set a valid user-agent
        ],
    },
    'sauce:options': {
        'name': 'Guinea-Pig Sauce',
        'screenResolution': '1280x960',
        'build': process.env.GITLAB_CI ? `${process.env.CI_JOB_NAME}-${date}` : `support-tech-test-${date}`,
        'tags': ['sauce-test'] // Added tag for tracking
    }
};

exports.brokenCapabilities = brokenCapabilities;
exports.workingCapabilities = workingCapabilities;
