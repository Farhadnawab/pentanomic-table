(function($){

    var isMouseDown = false,
    isHighlighted;
    $("#pentanomic-table")
    .on("mousedown touchstart", function (e) {
        isMouseDown = true;
        $(e.target).toggleClass("highlighted")
        isHighlighted = $(e.target).hasClass("highlighted");

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
        $("#pentanomic-table td").removeClass("highlighted");
    });


    function selectElements(e) {
        if(isMouseDown && (e.type == "touchmove")){
            var target = document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
            $(target).toggleClass("highlighted", isHighlighted);
        }else if(isMouseDown){
            $(this).toggleClass("highlighted", isHighlighted);
        }
        

        isMouseDown = false;
        
        $(document).unbind("mousemove touchmove", openSelector);
        $(document).unbind("mouseup touchend touchcancel", selectElements);

        var noResult = true;
        $("#pentanomic-table td").each(function () {
            var aElem = $(".ghost-select");
            var bElem = $(this);
            var result = doObjectsCollide(aElem, bElem);
    
            //console.log(result);
            if (result == true) {
                noResult = false;
                bElem.addClass("highlighted");
            }
        });

        //if(noResult)
            //$(e.target).toggleClass("highlighted");
        
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
        //console.log(a.offset().top,a.position().top, b.position().top, a.width(),a.height(), b.width(),b.height());
        var aTop = a.offset().top;
        var aLeft = a.offset().left;
        var bTop = b.offset().top;
        var bLeft = b.offset().left;
    
        return !(
            ((aTop + a.height()) < (bTop)) ||
            (aTop > (bTop + b.height())) ||
            ((aLeft + a.width()) < bLeft) ||
            (aLeft > (bLeft + b.width()))
        );
    }  
    

}(jQuery));

