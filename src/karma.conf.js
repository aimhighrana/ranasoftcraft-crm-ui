// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        failSpecWithNoExpectations: true
      },
      captureConsole: true // disable console logging while ng test
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage/ngx-mdo'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 74,
        branches: 56.80,
        functions: 70,
        lines: 74.69
      }
    },
    failOnEmptyTestSuite: true,
    failOnSkippedTests: true,
    failOnFailingTestSuite: true,
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browserConsoleLogOptions: {level: config.LOG_WARN},
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};