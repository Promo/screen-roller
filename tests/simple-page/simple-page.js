QUnit.test('[simple-page]: base methods', function(assert){
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { 'simple-page': true } }).roller;
    var module = roller.modules[ 'simple-page' ];

    assert.ok(module, 'expect module to be');
    assert.ok(module.destruct, 'expect module.destruct to be');
    assert.ok(module.disable, 'expect module.disable to be');
    assert.ok(module.enable, 'expect module.enable to be');
    assert.ok(module.onWatching, 'expect module.onWatching to be');
    assert.ok(module.offWatching, 'expect module.offWatching to be');
    assert.equal(module.type, 'content', 'expect module.type to be equal animation');
});

QUnit.test('[simple-page]: sync', function(assert){
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { 'simple-page': { minWidth: 10000 } } }).roller;
    var module = roller.modules[ 'simple-page' ];
    var done = assert.async();
    setTimeout(function(){

        assert.equal(module.enabled, true, 'expect module.enabled to be');
        module.destruct();

        assert.notOk(roller.modules[ 'simple-page' ], 'expect roller.modules[simple-page] to not be after destruct');
        done();
    }, 100);
});

QUnit.test('[simple-page]: async', function(assert){
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { 'simple-page': { minWidth: 10000 } } }).roller;
    var $wrap = roller.$wrap;
    var done = assert.async();

    assert.equal(roller.currentScreen, 0, 'expect currentScreen to be equal 0');
    assert.equal($wrap. scrollTop(), 0, 'expect scrollTop to be equal 0');

    setTimeout(function(){
        roller.moveTo(2);
        assert.equal($wrap. scrollTop(), 1000, 'expect scrollTop to be equal 1000');

        $wrap.scrollTop(1700);
        setTimeout(function(){
            assert.equal(roller.currentScreen, 3, 'expect currentScreen to be equal 3');

            roller.moveTo(0);
            assert.equal($wrap. scrollTop(), 0, 'expect scrollTop to be equal 0');

            done();
        }, 100);
    }, 100);
});