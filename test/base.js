//require('should');

var webdriver = require('browserstack-webdriver');

test = require('browserstack-webdriver/testing');

test.describe('Basic tests', function() {
    var driver, server;

    test.before(function() {
        var capabilities = {
            'browserName' : 'firefox',
            'browserstack.user' : 'antongrischenko1',
            'browserstack.key' : '3coTyyD6KwNzVKzjEYas',
            'browserstack.debug' : true,
            'resolution' : '1024x768'
        };

        driver = new webdriver.Builder().
            usingServer('http://hub.browserstack.com/wd/hub').
            withCapabilities(capabilities).
            build();

        driver.get('http://promo.github.io/screen-roller/');
    });

    test.it('One scrollTop change', function() {
        driver.manage().window().maximize();
        driver.wait(function(){
            driver.executeScript('$(window).scrollTop(600)');

            return driver.wait(function(){
                return function(){
                    driver.executeScript('$(window).scrollTop(2100)');
                    return driver.wait(function(){
                        return driver.executeScript('return roller.currentScreen')
                            .then(function(currentScreen){
                                return currentScreen == 2;
                            });
                    }, 1000);
                };
            }, 1000);
        }, 1000);
    });

    test.after(function() { driver.quit(); });
});