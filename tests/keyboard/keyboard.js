QUnit.test('[keyboard]: base methods', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { keyboard: { next: [ 83 ], prev: [ 87 ] } }}).roller;
    var module = roller.modules.keyboard;

    assert.ok(module, 'expect module to be');
    assert.ok(module.destruct, 'expect module.destruct to be');
    assert.ok(module.disable, 'expect module.disable to be');
    assert.ok(module.enable, 'expect module.enable to be');
    assert.equal(module.type, 'control', 'expect module.type to be equal control');
});

QUnit.test('[keyboard]:', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { keyboard: { next: [ 83 ], prev: [ 87 ] } }}).roller;
    var module = roller.modules.keyboard;

    var keyDownTrigger = function(key) {
        var e = $.Event('keydown');
        e.keyCode = key;
        $(window).trigger(e);
    };

    assert.equal(module.enabled, true, 'expect module.enabled to be');
    assert.equal(roller.currentScreen, 0, 'expect currentScreen to be 0');

    keyDownTrigger(87);
    assert.equal(roller.currentScreen, 0, 'expect roller.currentScreen to be 0');

    keyDownTrigger(83);
    assert.equal(roller.currentScreen, 1, 'expect roller.currentScreen to be 1');

    module.disable();
    keyDownTrigger(83);
    assert.equal(roller.currentScreen, 1, 'expect roller.currentScreen to be 1');

    module.enable();
    keyDownTrigger(35);
    assert.equal(roller.currentScreen, 5, 'expect roller.currentScreen to be 5');

    module.destruct();

    assert.notOk(roller.modules.keyboard, 'expect roller.modules.keyboard to not be after destruct');

    keyDownTrigger(35);
    assert.equal(roller.currentScreen, 5, 'expect roller.currentScreen to be 5');
});