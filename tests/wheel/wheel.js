QUnit.test('[wheel]: base methods', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ speed: 0, modules: { wheel: true } }).roller;
    var module = roller.modules.wheel;

    assert.ok(module, 'expect module to be');
    assert.ok(module.destruct, 'expect module.destruct to be');
    assert.ok(module.disable, 'expect module.disable to be');
    assert.ok(module.enable, 'expect module.enable to be');
    assert.equal(module.type, 'control', 'expect module.type to be equal control');
});

QUnit.test('[wheel]:', function(assert){
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ speed: 0, modules: { wheel: true } }).roller;
    var module = roller.modules.wheel;
    var done = assert.async();

    assert.equal(module.enabled, true, 'expect module.enabled to be');
    assert.equal(roller.currentScreen, 0, 'expect currentScreen to 0');

    var _triggerMouseEvent = function() {
        var event = new MouseEvent('wheel');
        event.deltaY = 1;
        roller.$wrap.get(0).dispatchEvent(event);
    };

    setTimeout(function(){
        _triggerMouseEvent();

        setTimeout(function(){
            assert.equal(roller.currentScreen, 1, 'expect roller.currentScreen to 1');

            setTimeout(function(){
                _triggerMouseEvent();
                assert.equal(roller.currentScreen, 2, 'expect roller.currentScreen to 2');

                module.disable();
                _triggerMouseEvent();
                assert.equal(roller.currentScreen, 2, 'expect roller.currentScreen to 2');

                setTimeout(function(){
                    module.enable();
                    _triggerMouseEvent();
                    assert.equal(roller.currentScreen, 3, 'expect roller.currentScreen to 3');

                    module.destruct();
                    assert.notOk(roller.modules.wheel, 'expect roller.modules.wheel to not be after destruct');

                    _triggerMouseEvent();
                    assert.equal(roller.currentScreen, 3, 'expect roller.currentScreen to 3');

                    done();
                }, 500);
            }, 500);
        }, 500);
    }, 100);
});