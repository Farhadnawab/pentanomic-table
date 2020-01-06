(function($){

    var isMouseDown = false,
    isHighlighted;
    $("#pentanomic-table")
    .on("mousedown touchstart", function (e) {
        /*isMouseDown = true;
        $(e.target).toggleClass("highlighted")
        isHighlighted = $(e.target).hasClass("highlighted");*/

        var touch = undefined;
        if(e.originalEvent.touches)
            touch = e.originalEvent.touches[0]
        var pos_x = e.pageX || touch.pageX;
        var pos_y = e.pageY || touch.pageY;

        
        
        $(".ghost-select").addClass("ghost-active");
        $(".ghost-select").css({
            'left': pos_x,
            'top': pos_y
        });

        initialW = pos_x;
        initialH = pos_y;

        $(document).bind("mousemove touchmove", openSelector);
        $(document).bind("mouseup touchend touchcancel", selectElements);
        
        return false; // prevent text selection
    })
    /*.on("mouseover touchmove", function (e) {
        
        if(isMouseDown && (e.type == "touchmove")){
            var target = document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
            $(target).toggleClass("highlighted", isHighlighted);
        }else if(isMouseDown){
            $(this).toggleClass("highlighted", isHighlighted);
        }
    })*/
    .bind("selectstart", function () {
        return false;
    });



    $("#clear-all").click(function(){
        $(".big-ghost").remove();
    });


    function selectElements(e) {
        /*if(isMouseDown && (e.type == "touchmove")){
            var target = document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
            $(target).toggleClass("highlighted", isHighlighted);
        }else if(isMouseDown){
            $(this).toggleClass("highlighted", isHighlighted);
        }

        isMouseDown = false;*/
        
        $(document).unbind("mousemove touchmove", openSelector);
        $(document).unbind("mouseup touchend touchcancel", selectElements);
        var maxX = 0;
        var minX = 5000;
        var maxY = 0;
        var minY = 5000;
        var totalElements = 0;
        var elementArr = new Array();
        $("#pentanomic-table th,#pentanomic-table td").each(function () {
            var aElem = $(".ghost-select");
            var bElem = $(this);
            var result = doObjectsCollide(aElem, bElem);
    
            //console.log(result);
            if (result == true) {
                
                var aElemPos = bElem.offset();
                var bElemPos = bElem.offset();
                var aW = bElem.outerWidth();
                var aH = bElem.outerHeight();
                var bW = bElem.outerWidth();
                var bH = bElem.outerHeight();

                var coords = checkMaxMinPos(aElemPos, bElemPos, aW, aH, bW, bH, maxX, minX, maxY, minY);
                maxX = coords.maxX;
                minX = coords.minX;
                maxY = coords.maxY;
                minY = coords.minY;
                var parent = bElem.parent();

                //console.log(aElem, bElem,maxX, minX, maxY,minY);
                if (bElem.css("left") === "auto" && bElem.css("top") === "auto") {
                    
                    bElem.css({
                        'left': parent.css('left'),
                        'top': parent.css('top')
                    });
                }
                $("body").append("<div id='big-ghost' class='big-ghost' x='" + Number(minX - 20) + "' y='" + Number(minY - 10) + "'></div>");

                $("#big-ghost").css({
                    'width': maxX + 20 - minX,
                    'height': maxY + 10 - minY,
                    'top': minY - 5,
                    'left': minX - 10
                });

                //bElem.addClass("highlighted");
            }
        });

        
        $(".ghost-select").removeClass("ghost-active");
        $(".ghost-select").width(0).height(0);
    
        ////////////////////////////////////////////////
    
    }
    
    function openSelector(e) {
        
        var touch = undefined;
        if(e.originalEvent.touches)
            touch = e.originalEvent.touches[0]
        var pos_x = e.pageX || touch.pageX;
        var pos_y = e.pageY || touch.pageY;
        
        var w = Math.abs(initialW - pos_x);
        var h = Math.abs(initialH - pos_y);
        
        $(".ghost-select").css({
            'width': w,
            'height': h
        });
        if (pos_x <= initialW && pos_y >= initialH) {
            $(".ghost-select").css({
                'left': pos_x
            });
        } else if (pos_y <= initialH && pos_x >= initialW) {
            $(".ghost-select").css({
                'top': pos_y
            });
        } else if (pos_y < initialH && pos_x < initialW) {
            $(".ghost-select").css({
                'left': pos_x,
                "top": pos_y
            });
        }
    }

    function doObjectsCollide(a, b) { // a and b are your objects
        
        var aTop = a.offset().top;
        var aLeft = a.offset().left;
        var bTop = b.offset().top;
        var bLeft = b.offset().left;

        return !(
            ((aTop + a.outerHeight()) < (bTop)) ||
            (aTop > (bTop + b.outerHeight())) ||
            ((aLeft + a.outerWidth()) < bLeft) ||
            (aLeft > (bLeft + b.outerWidth()))
        );
    }  

    function checkMaxMinPos(a, b, aW, aH, bW, bH, maxX, minX, maxY, minY) {
        'use strict';
    
        if (a.left < b.left) {
            if (a.left < minX) {
                minX = a.left;
            }
        } else {
            if (b.left < minX) {
                minX = b.left;
            }
        }
    
        if (a.left + aW > b.left + bW) {
            if (a.left > maxX) {
                maxX = a.left + aW;
            }
        } else {
            if (b.left + bW > maxX) {
                maxX = b.left + bW;
            }
        }
        ////////////////////////////////
        if (a.top < b.top) {
            if (a.top < minY) {
                minY = a.top;
            }
        } else {
            if (b.top < minY) {
                minY = b.top;
            }
        }
    
        if (a.top + aH > b.top + bH) {
            if (a.top > maxY) {
                maxY = a.top + aH;
            }
        } else {
            if (b.top + bH > maxY) {
                maxY = b.top + bH;
            }
        }
    
        return {
            'maxX': maxX,
            'minX': minX,
            'maxY': maxY,
            'minY': minY
        };
    }
    

}(jQuery));

