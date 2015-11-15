$(document).ready(function() {
    var KEY_ENTER = 13;
    var KEY_DELETE = 46;
    var KEY_TAB;
    var KEY_REVERSETAB;

    var saveData = function() {
        var data = $("#app").html();
        window.localStorage.setItem('appData', data);
    };

    var getData = function() {
        return window.localStorage.getItem('appData');
    };

    //the application initializes with a single node requiring an input.
    if (getData()) {
        $("#app").html("");
        $("#app").append(getData());
    }

    $("#app").on("keypress", ".form", function(e) {
        //when enter-key is pressed, it will create a node.

        var text = $(this).children("input").val();

        //list of if statements into condensed?
        if (e.keyCode === KEY_ENTER) {
            while (text.length <= 0) {
                text = prompt("insert text");
            }

            e.preventDefault();
            $node = $("<div></div>").addClass("node").css({
                "margin": "0 0 0 50px"
            });
            var $text = $("<span>" + text + "</span>").addClass("text");
            $node.prepend($text);

            //jQuery references $(), so you have to create another one...
            var $childForm = $("<form><input type='text'></form>").addClass("form");
            var $button = $("<span>*</span>").addClass("button").css({
                "background-color": "orange"
            });
            $node.prepend($button);
            $node.append($childForm);

            $(this).before($node);

            $(this).remove();
        }

        saveData();
    });

    $("#app").on("click", ".button", function(e) {
        var $form = $("<form><input  type='text'></form>").addClass("form");
        var $node = $(this).closest(".node");
        $node.after($form);

        saveData();
    });


    //when text of the node is clicked,
    $("#app").on("click", ".text", function(e) {
        var $form = $("<form><input type='text'></form>").addClass("modifier");
        $form.children("input").val($(this).text());
        $(this).before($form);
        $(this).remove();

        saveData();

    });

    $("#app").on("keypress", ".modifier", function(e) {

        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            var text = $(this).children("input").val();
            $text = $("<span>" + text + "</span>").addClass("text");
            $(this).siblings(".button").after($text);
            $(this).remove();
        }
        saveData();
    });

    var timeoutId;
    $(".button").hover(function() {
        if (!timeoutId) {
            var $this = $(this);
            timeoutId = setTimeout(function() {
                console.log("hovering");

                //turn the background grey
                $this.closest(".node").css("background-color", "grey");
            }, 500);

        }

    }, function() {

        if (timeoutId) {
            console.log("leaving");
            clearTimeout(timeoutId);
            timeoutId = false;
            //turn the background white
            $(this).closest(".node").css("background-color", "white");
        }

    });

});
