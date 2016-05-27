QUnit.test('[hash]: base methods', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ speed: 0, modules: { hash: true, 'menu': { items: $('.menu li')} } }).roller;
    var module = roller.modules.hash;

    assert.ok(module, 'expect module to be');
    assert.ok(module.destruct, 'expect module.destruct to be');
    assert.ok(module.disable, 'expect module.disable to be');
    assert.ok(module.enable, 'expect module.enable to be');
    assert.equal(module.type, 'navigation', 'expect module.type to be equal navigation');
});

QUnit.test('[hash]: ', function(assert){
    var _getHash = function() {
        return window.location.hash.replace('#', '');
    };

    var _setHash = function(hash) {
        window.location.hash = hash;
    };

    _setHash('');

    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ speed: 0, modules: { hash: true, 'menu': { items: $('.menu li')} } }).roller;
    var module = roller.modules.hash;
    var done = assert.async();

    assert.equal(module.enabled, true, 'expect module.enabled to be');
    assert.equal(_getHash(), 'first', 'expect hash to be first');

    _setHash('second');
    setTimeout(function(){
        assert.equal(roller.currentScreen, 1, 'expect roller.currentScreen to 1');
        _setHash('third');

        setTimeout(function(){
            assert.equal(roller.currentScreen, 2, 'expect roller.currentScreen to 2');
            module.disable();
            _setHash('fourth');

            setTimeout(function(){
                assert.equal(roller.currentScreen, 2, 'expect roller.currentScreen to 3');
                module.enable();
                _setHash('first');

                setTimeout(function(){
                    assert.equal(roller.currentScreen, 0, 'expect roller.currentScreen to 0');
                    _setHash('');
                    setTimeout(function(){
                        done();
                    }, 10);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
});