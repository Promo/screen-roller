QUnit.test('[menu]: base methods', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ speed: 0, modules: { 'menu': { items: $('.menu li')} } }).roller;
    var module = roller.modules.menu;

    assert.ok(module, 'expect module to be');
    assert.ok(module.destruct, 'expect module.destruct to be');
    assert.ok(module.disable, 'expect module.disable to be');
    assert.ok(module.enable, 'expect module.enable to be');
    assert.equal(module.type, 'navigation', 'expect module.type to be equal navigation');
});

QUnit.test('[menu]: ', function(assert){
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ speed: 0, modules: { 'menu': { items: $('.menu li')} } }).roller;
    var module = roller.modules.menu;
    var $items = module.$items;

    assert.equal(module.enabled, true, 'expect module.enabled to be');

    $items.eq(3).trigger('click');
    assert.equal(roller.currentScreen, 3, 'expect roller.currentScreen to not be 3');

    $items.eq(5).trigger('click');
    assert.equal(roller.currentScreen, 5, 'expect roller.currentScreen to not be 5');

    module.disable();

    $items.eq(3).trigger('click');
    assert.equal(roller.currentScreen, 5, 'expect roller.currentScreen to not be 5');

    module.enable();
    $items.eq(2).trigger('click');
    assert.equal(roller.currentScreen, 2, 'expect roller.currentScreen to not be 2');

    module.destruct();

    assert.notOk(roller.modules.menu, 'expect roller.modules.menu to not be after destruct');
});