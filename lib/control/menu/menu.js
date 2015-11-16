(function($){
    var Keyboard = {
        init: function() {
            var module  = this,
                roller  = module.roller,
                options = module.roller.options.menu;

            roller.onWatcherMenu  = module.onWatcherMenu.bind(module);
            roller.offWatcherMenu = module.offWatcherMenu.bind(module);

            module.basis            = options.basis || {};
            module.classMenu        = options.classMenu     || 'screen-roller-menu';
            module.classItemMenu    = options.classItemMenu || 'screen-roller-item-menu';
            module.classCurrentItem = options.classCurrentItem || 'current';

            module.tagMenu       = options.tagMenu     || 'ul';
            module.tagItemMenu   = options.tagItemMenu || 'li';

            module.positionMenu  = options.position || 'after';

            module.wrapperMenu = module.defineWrapperMenu();
            module.itemsMenu   = module.defineItemsMenu();
            module.menu        = module.wrapItems();

            module.addToPage();
            module.onWatcherMenu();
        },

        onWatcherMenu: function() {
            var module = this,
                roller = module.roller,
                el     = module.el,
                classItems = '.' + module.classItemMenu;

            module.wrapperMenu.on('click.screenroller', classItems, function() {
                var index = $(this).index();

                if(index !== roller.currentScreen) {
                    roller.moveTo(index);
                }
            });

            el.on('beforeMove', function(e, data) {
                module.setCurrentItem(data.index);
            });
        },

        offWatcherMenu: function() {
            var module = this,
                el = module.el;

            module.wrapperMenu.off('click.screenroller');

            el.off('beforeMove');
        },

        setCurrentItem: function(index) {
            var module = this,
                items = module.itemsMenu,
                classCurrent = module.classCurrentItem;

            items.removeClass(classCurrent);
            items.eq(index).addClass(classCurrent);
        },

        addToPage: function() {
            var module   = this,
                position = module.positionMenu,
                menu     = module.menu,
                el       = module.el;

            if(module.basis.jquery) {
                return;
            }

            switch (position) {
                case 'before':
                    el.before(menu);
                    break;
                case 'after':
                    el.after(menu);
                    break;
                case 'begin':
                    el.prepend(menu);
                    break;
                case 'end':
                    el.append(menu);
                    break;
            }
        },

        wrapItems: function() {
            var module = this;

            if(module.basis.jquery) {
                return;
            }

            return module.wrapperMenu.append(module.itemsMenu);
        },

        defineWrapperMenu: function() {
            var module = this,
                tagMenu = module.tagMenu,
                wrapper;

            if(module.basis.jquery) {
                return module.basis.parent();
            }

            wrapper = module.createElement(tagMenu, true);
            wrapper.addClass(module.classMenu);

            return wrapper
        },

        defineItemsMenu: function() {
            var module = this,
                roller = module.roller,
                basis = module.basis,
                screens = roller.screens,
                count = roller.countScreens;

            if(module.itemsMenu) {
                return module.itemsMenu;
            }

            if(basis.jquery) {
                return basis;
            }

            if($.isArray(basis)) {
                return module.createItems(basis, true);
            }

            if(typeof basis === 'string') {
                basis = $.map(screens, function(screen) {
                    return $(screen).attr(basis)
                });
                return module.createItems(basis, true);
            }

            return module.createItems(new Array(count));
        },

        createItems: function(basis, filled) {
            var module = this,
                tagItem = module.tagItemMenu,
                items;

            items = $($.map(basis, function(index) {
                var item = module.createElement(tagItem);

                filled ? item.innerHTML = index : '';

                return item;
            }));

            items.addClass(module.classItemMenu);

            return items;
        },
        
        createElement: function(tag, jquery) {
            return jquery ? $(document.createElement(tag)) : document.createElement(tag);
        }
    };

    var module = 'screenroller-menu';

    $.fn[module] = function() {
        this.roller[module] = $.extend({ el: this, roller: this.roller }, Object.create(Keyboard));
        this.roller[module].init();

        return this;
    };
}(jQuery));