(function($){
    var Menu = {
        init: function(options) {
            var module  = this,
                roller  = module.roller,
                options = module.options = roller.options.modules.menu;

            roller.onWatcherMenu  = module.onWatcherMenu.bind(module);
            roller.offWatcherMenu = module.offWatcherMenu.bind(module);


            options.basis = options.basis || {};

            options.classMenu = options.classMenu || 'screen-roller-menu';
            options.classItemMenu = options.classItemMenu || 'screen-roller-item-menu';
            options.classCurrentItem = options.classCurrentItem || 'current';
            options.tagMenu = options.tagMenu || 'ul';
            options.tagItemMenu = options.tagItemMenu || 'li';
            options.positionMenu = options.positionMenu || 'after';


            //module.basis            = options.basis || {};
            //module.classMenu        = options.classMenu     || 'screen-roller-menu';
            //module.classItemMenu    = options.classItemMenu || 'screen-roller-item-menu';
            //module.classCurrentItem = options.classCurrentItem || 'current';

            //module.tagMenu       = options.tagMenu     || 'ul';
            //module.tagItemMenu   = options.tagItemMenu || 'li';

            //module.positionMenu  = options.position || 'after';

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
                classItems = '.' + module.options.classItemMenu;

            module.wrapperMenu.on('click.screenroller', classItems, function() {
                var index = $(this).index();

                if(index !== roller.currentScreen) {
                    roller.moveTo(index);
                }
            });

            el.on('before-change-slide', function(e, data) {
                module.setCurrentItem(data.index);
            });
        },

        offWatcherMenu: function() {
            var module = this,
                el = module.el;

            module.wrapperMenu.off('click.screenroller');

            el.off('before-change-slide');
        },

        setCurrentItem: function(index) {
            var module = this,
                items = module.itemsMenu,
                classCurrent = module.options.classCurrentItem;

            items.removeClass(classCurrent);
            items.eq(index).addClass(classCurrent);
        },

        addToPage: function() {
            var module   = this,
                position = module.options.positionMenu,
                menu     = module.menu,
                el       = module.el;

            if(module.options.basis.jquery) {
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

            if(module.options.basis.jquery) {
                return;
            }

            return module.wrapperMenu.append(module.itemsMenu);
        },

        defineWrapperMenu: function() {
            var module = this,
                tagMenu = module.options.tagMenu,
                wrapper;

            if(module.options.basis.jquery) {
                return module.options.basis.parent();
            }

            wrapper = module.createElement(tagMenu, true);
            wrapper.addClass(module.options.classMenu);

            return wrapper
        },

        defineItemsMenu: function() {
            var module = this,
                roller = module.roller,
                basis = module.options.basis,
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
                tagItem = module.options.tagItemMenu,
                items;

            items = $($.map(basis, function(index) {
                var item = module.createElement(tagItem);

                filled ? item.innerHTML = index : '';

                return item;
            }));

            items.addClass(module.options.classItemMenu);

            return items;
        },
        
        createElement: function(tag, jquery) {
            return jquery ? $(document.createElement(tag)) : document.createElement(tag);
        }
    };

    var module = 'screenroller-menu';

    $.fn[module] = function(options) {
        this.roller[module] = $.extend({ el: this, roller: this.roller }, Object.create(Menu));
        this.roller[module].init(options);

        return this;
    };
}(jQuery));