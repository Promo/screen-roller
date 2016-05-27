function getTransform(axis) {
    var value = this.css('transform').replace(/[a-z]|\(|\)/gi, '').split(', ');

    if(!value) {
        return 0;
    }

    return axis === 'y' ? Math.round(value[ 5 ]) : Math.round(value[ 4 ]);
}

QUnit.assert.about = function(value, expected, message) {
    var actual = [ expected - 1, expected, expected + 1 ];
    var isActual = actual.indexOf(value) >= 0;

    if(isActual) {
        value = expected;
    }

    this.push(value === expected, value, expected, message);
};

QUnit.test('[slide-animation]: base methods', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { 'slide-animation': true } }).roller;
    var module = roller.modules[ 'slide-animation' ];

    assert.ok(module, 'expect module to be');
    assert.ok(module.destruct, 'expect module.destruct to be');
    assert.ok(module.disable, 'expect module.disable to be');
    assert.ok(module.enable, 'expect module.enable to be');
    assert.equal(module.type, 'animation', 'expect module.type to be equal animation');
});

QUnit.test('[slide-animation]: sync', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { 'slide-animation': true } }).roller;
    var module = roller.modules[ 'slide-animation' ];

    assert.equal(module.enabled, true, 'expect module.enabled to be');

    module.destruct();

    assert.notOk(roller.move, 'expect roller.move to not be after destruct');
    assert.notOk(roller.modules[ 'slide-animation' ], 'expect roller.modules[slide-animation] to not be after destruct');
});

QUnit.test('[slide-animation]: async', function(assert) {
    var testId = assert.test.testId;
    var $roller = depot[ testId ].$roller;
    var roller = $roller.screenroller({ modules: { 'slide-animation': true } }).roller;
    var module = roller.modules[ 'slide-animation' ];
    var winHeight = $(window).height();
    var done = assert.async();

    //проверяем прокрутку до второго слайда
    roller.moveTo('next');

    setTimeout(function() {
        assert.about(getTransform.call(roller.$el, 'y') * -1, winHeight, 'expect transform of element to be equal height of window');

        //todo возможно получится освободиться от Watching
        //отключаем прослушевание событий(проверяем offWatching)
        //module.offWatching();
        //assert.equal(module.watching, false, 'expect module.enabled to be false');

        roller.moveTo('next');

        setTimeout(function() {
            //todo возможно получится освободиться от Watching
            //assert.about((getTransform.call(roller.$el, 'y') * -1), winHeight, 'expect transform of element to be equal height of window after disable');
            //
            ////включаем прослушевание событий(проверяем onWatching)
            //module.onWatching();
            //assert.equal(module.watching, true, 'expect module.enabled to be true');

            roller.moveTo('next');

            setTimeout(function() {
                assert.about((getTransform.call(roller.$el, 'y') * -1), (winHeight * 3), 'expect transform of element to be equal height of window after enable');
                done();
                module.destruct();
            }, 100);
        }, 100);
    }, 100);
});
