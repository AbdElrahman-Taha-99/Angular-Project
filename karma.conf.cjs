module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    client: {
      jasmine: {},
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    // ✅ Coverage reports
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },        // for browsing reports
        { type: 'lcov' },        // for SonarQube / coverage tools
        { type: 'text-summary' } // quick summary in console
      ]
    },

    // ✅ JUnit test results
    junitReporter: {
      outputDir: 'reports/unit',      // results will be saved here
      outputFile: 'test-results.xml', // single file
      useBrowserName: false           // don’t append browser name
    },

    // ✅ Reporters to use
    reporters: ['progress', 'kjhtml', 'junit', 'coverage'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,

    // ✅ Headless Chrome for CI
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },

    // ✅ Run once and exit (good for Jenkins/CI)
    singleRun: true,
    restartOnFileChange: false
  });
};
