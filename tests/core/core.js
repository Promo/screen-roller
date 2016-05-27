QUnit.test('[core]: base methods', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { 'slide-animation': true } }).roller;

    assert.ok(roller.destruct, 'expect roller has roller.destruct');
    assert.ok(roller.disable, 'expect roller has roller.disable');
    assert.ok(roller.enable, 'expect roller has roller.enable');
    assert.ok(roller.moveTo, 'expect roller has roller.moveTo');
});

QUnit.test('[core]: initialization', function(assert) {

    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var $wrapBeforeInit = $roller.parent();
    var roller = $roller.screenroller({ modules: { 'slide-animation': true } }).roller;
    var $wrapAfterInit = $roller.parent();

    assert.equal(roller, depot[ testId ].$roller.roller, 'expect roller.roller to be $(".roller").data().roller');
    assert.ok(roller.nodes, 'expect roller.nodes to be');
    assert.ok(roller.$screens, 'expect roller.$screens to be');
    assert.equal(roller.nodes.$win[ 0 ], $(window)[ 0 ], 'expect roller.nodes.$win to be $(window)');
    assert.equal(roller.nodes.$doc[ 0 ], $(document)[ 0 ], 'expect roller.nodes.$doc to be $(document)');
    assert.equal(roller.nodes.$body[ 0 ], $('body')[ 0 ], 'expect roller.nodes.$body to be $(body)');
    assert.equal(roller.nodes.$htmlbody[ 0 ], $('html, body')[ 0 ], 'expect roller.nodes.$htmlbody to be $(html, body)');
    assert.equal(roller.nodes.$htmlbody[ 1 ], $('html, body')[ 1 ], 'expect roller.nodes.$htmlbody to be $(html, body)');
    assert.equal(roller.enabled, true, 'expect roller.enabled to be true');

    assert.equal(roller.$wrap[ 0 ], roller.$el.parent()[ 0 ], 'expect roller.$wrap to be wrapper');
    assert.equal(roller.$wrap[ 0 ], $wrapAfterInit[ 0 ], 'expect roller.$wrap to be $wrapAfterInit[0]');

    roller.disable();
    assert.equal(roller.enabled, false, 'expect roller.enabled to be false');

    roller.destruct();

    assert.notOk(roller.roller, 'expect roller.roller to not be after destruct');
    assert.notOk($roller.data().roller, 'expect $roller.data().roller to not be after destruct');

    assert.equal($wrapBeforeInit[ 0 ], depot[ testId ].$roller.parent()[ 0 ], 'expect $wrapBeforeInit to be $wrapAfterInit');
});