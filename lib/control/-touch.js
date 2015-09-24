//for touch devices

//        var startPositionY,
//                currentPositionY,
//                direction,
//                transitionDuration,
//                action = {
//                    shiftDown: {
//                        directionDown: function(){
//                            roller.currentScreen !== 0 ? roller.moveTo('up') : roller.moveTo(roller.currentScreen);
//                        },
//                        directionUp:   function(){
//                            roller.moveTo(roller.currentScreen);
//                        }
//                    },
//                    shiftUp: {
//                        directionDown: function(){
//                            roller.moveTo(roller.currentScreen);
//                        },
//                        directionUp:   function(){
//                            roller.currentScreen !== roller.countScreens - 1 ? roller.moveTo('down') : roller.moveTo(roller.currentScreen);
//                        }
//                    }
//                };
//
//        var mc = new Hammer.Manager(roller.get(0));
//
//        mc.add(new Hammer.Pan());
//
//        mc.on("panstart", function(e) {
//            currentPositionY = roller.getOffset()[1];
//            startPositionY = e.center.y;
//            $('.roller').css('transitionDuration', '0s');
//        });
//
//        mc.on("panup", function(e) {
//            var newOffset;
//            if(currentPositionY) {
//                (roller.currentScreen === roller.countScreens - 1) ?
//                        newOffset = ((~~e.center.y - ~~startPositionY) / 4 ) + ~~currentPositionY :
//                        newOffset =   ~~e.center.y - ~~startPositionY + ~~currentPositionY;
//
//                roller.updatePosition(newOffset);
//                direction = 'up';
//            }
//        });
//
//        mc.on("pandown", function(e) {
//            var newOffset;
//            if(currentPositionY) {
//                (roller.currentScreen === 0) ?
//                        newOffset = ((~~e.center.y - ~~startPositionY) / 4 ) + ~~currentPositionY :
//                        newOffset =   ~~e.center.y - ~~startPositionY + ~~currentPositionY;
//
//                roller.updatePosition(newOffset);
//                direction = 'down';
//            }
//        });
//
//        mc.on("panend", function(e) {
//            var shiftValue = (~~e.center.y > ~~startPositionY) ? 'shiftDown' : 'shiftUp';
//            var directionValue = (direction === 'down') ? 'directionDown' : 'directionUp';
//
//            action[shiftValue][directionValue]();
//            currentPositionY = null;
//        });