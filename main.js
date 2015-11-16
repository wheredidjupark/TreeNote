$(document).ready(function() {
    var KEY_ENTER = 13;
    var KEY_DELETE = 8;
    var KEY_TAB = 9;
    var KEY_SHIFT = 16;

    var KEY_LEFTARROW = 37;
    var KEY_UPARROW = 38;
    var KEY_RIGHTARROW = 39;
    var KEY_DOWNARROW = 40;

    var createNode = function() {
        return $("<div contenteditable></div>").addClass("node");
    };

    var saveData = function() {
        var data = $("#app").html();
        window.localStorage.setItem('appData', data);
    };

    var getData = function() {
        return window.localStorage.getItem('appData');
    };

    var initialize = function() {
        if (getData()) {
            $("#app").html("");
            $("#app").append(getData());
        } else {
            $("#app").append(createNode());
        }
    };

    initialize();



    $("#app").on("keydown", ".node", function(e) {

        console.log(e.keyCode);
        var text = $(this).text();
        var html = $(this).html();

        //ENTER: Create a new sibling node. Focus on the newly created sibling node.
        if (e.keyCode === KEY_ENTER) {

            e.preventDefault();
            $(this).after(createNode());
            $(this).next().focus();
        }

        //DOWNARROW: Focus on the next node
        if (e.keyCode === KEY_DOWNARROW) {
            e.preventDefault();
            $(this).next().focus();
        }

        //UPARROW: Focus on the previous node
        if (e.keyCode === KEY_UPARROW) {
            e.preventDefault();
            $(this).prev().focus();
        }

        //DELETE: Remove the node. Focus on the previous node.
        if (e.keyCode === KEY_DELETE && html.toString().length === 0) {
        	e.preventDefault();
        	var content = $(this).html();
        	$(this).prev().focus(); //the focus functionality should place the text cursor at the end of its content
            $(this).remove();
        }

        //TAB: Move the node inside of its previous sibling node.
        if(e.keyCode === KEY_TAB){
        }

        saveData();


    });

    // //when text of the node is clicked,
    // $("#app").on("click", ".text", function(e) {
    //     var $form = $("<form><input type='text'></form>").addClass("modifier");
    //     $form.children("input").val($(this).text());
    //     $(this).before($form);
    //     $(this).remove();

    //     saveData();

    // });

    // var timeoutId;
    // $(".button").hover(function() {
    //     if (!timeoutId) {
    //         var $this = $(this);
    //         timeoutId = setTimeout(function() {
    //             console.log("hovering");

    //             //turn the background grey (configure in CSS)
    //             $this.closest(".node").addClass("highlight");
    //         }, 500);

    //     }

    // }, function() {

    //     if (timeoutId) {
    //         console.log("leaving");
    //         clearTimeout(timeoutId);
    //         timeoutId = false;
    //         //turn the background white (configure in CSS)
    //         $(this).closest(".node").removeClass("highlight");
    //     }

    // });

});
