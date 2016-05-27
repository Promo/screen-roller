QUnit.test('[touch]: base methods', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { touch: true} }).roller;
    var module = roller.modules.touch;

    assert.ok(module, 'expect module to be');
    assert.ok(module.destruct, 'expect module.destruct to be');
    assert.ok(module.disable, 'expect module.disable to be');
    assert.ok(module.enable, 'expect module.enable to be');
    assert.equal(module.type, 'control', 'expect module.type to be equal control');
});

QUnit.test('[touch]: sync', function(assert){
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { touch: true} }).roller;
    var module = roller.modules.touch;

    assert.equal(module.enabled, true, 'expect module.enabled to be true');
    assert.equal(roller.currentScreen, 0, 'expect currentScreen to be 0');

    var _trigger = function(event, pageY) {
        var e = $.Event(event);
        e.originalEvent = {
            pageY: pageY
        };
        $roller.trigger(e);
    };

    /* prev from first */
    _trigger('mousedown', 1);
    _trigger('mousemove', 2);
    _trigger('mouseup', 3);

    assert.equal(roller.currentScreen, 0, 'expect currentScreen to be 0');

    /* next from first */
    _trigger('mousedown', -1);
    _trigger('mousemove', -2);
    _trigger('mouseup', -3);

    assert.equal(roller.currentScreen, 1, 'expect currentScreen to be 1');

    /* prev from second */
    _trigger('mousedown', 1);
    _trigger('mousemove', 2);
    _trigger('mouseup', 3);

    assert.equal(roller.currentScreen, 0, 'expect currentScreen to be 0');

    module.destruct();

    /* after destruct */
    _trigger('mousedown', -1);
    _trigger('mousemove', -2);
    _trigger('mouseup', -3);

    assert.equal(roller.currentScreen, 0, 'expect currentScreen to be 0');
});

