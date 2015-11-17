$(document).ready(function() {

    'use strict';

    let KEY_ENTER = 13;
    let KEY_DELETE = 8;
    let KEY_TAB = 9;
    let KEY_SHIFT = 16;

    let KEY_LEFTARROW = 37;
    let KEY_UPARROW = 38;
    let KEY_RIGHTARROW = 39;
    let KEY_DOWNARROW = 40;

    let createNode = function() {

        let $node = $("<div></div>").addClass("node");
        let $value = $("<div  contenteditable></div>").addClass("value");
        let $children = $("<div></div>").addClass("children");
        let $point = $("<span>O</span>").addClass("point");

        $node.append($value);
        $node.append($children);
        $node.prepend($point);

        let $copy = $node.clone();
        return $copy;
    };

    let saveData = function() {
        let data = $("#app").html();
        window.localStorage.setItem('appData', data);
    };

    let getData = function() {
        return window.localStorage.getItem('appData');
    };

    let initialize = function() {
        if (getData()) {
            $("#app").html("");
            $("#app").append(getData());
        } else {
            $("#app").append(createNode());
        }


        //if there is no content in the app, create a node.
        //Done as a safeguard.
        let appContent = $("#app").text();
        if (appContent.length === 0) {
            $("#app").append(createNode());
        }
    };



    initialize();



    $("#app").on("keydown", ".value", function(e) {

        // console.log("You pressed the key with the following keycode",e.keyCode);
        let textVal = $(this).text();
        let htmlVal = $(this).html();
        let $thisNode = $(this).closest(".node");

        //finds the nearest previous sibling node or closest parent node
        let findAdjUpNode = function() {
            let $adjacent = $thisNode.prev();

            //if thisNode does not have an older sibling, return the current node's parent
            if ($adjacent.length === 0) {
                //closest 
                console.log("parent");
                return $thisNode.parent().closest(".node");
            } else {
                //has an older sibling

                if ($adjacent.children(".children").children(".node").length === 0) {
                    //the older sibling has no children.
                    return $adjacent;
                } else {
                    //the older sibling has children.
                    let length = $adjacent.children(".children").children(".node").length;
                    let adjacent = $adjacent.children(".children").children(".node")[length - 1];
                    console.log(length);
                    console.log(adjacent);

                    while ($(adjacent).children(".children").children(".node").length > 0) {
                        length = $(adjacent).children(".children").children(".node").length;
                        adjacent = $(adjacent).children(".children").children(".node")[length - 1];
                    }
                    console.log(adjacent);

                    return adjacent;
                }
            }
        };

        console.log("node's adjacentUp value: ", $(findAdjUpNode()).children(".value").text());
        console.log("node's value: ", $(this).text());
        // console.log("node's adjacentDown value: ",$(findAdjUpNode()).children(".value").text());



        let findAdjDownNode = function() {
            let $nearest = $thisNode.next();
            //if there is no sibling, move to thisNode's sibling and 
        };

        let moveOneUp = function() {
            $(findAdjUpNode()).children(".value").focus();
        };

        //ENTER: Create a new sibling node. Focus on the newly created sibling node.
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            $thisNode.before(createNode());
            moveOneUp();
        }

        //DOWNARROW: focus on the next node
        if (e.keyCode === KEY_DOWNARROW) {
            e.preventDefault();
            $thisNode.next().children(".value").focus();
        }

        //UPARROW: Focus on the previous node
        if (e.keyCode === KEY_UPARROW) {
            e.preventDefault();
            // $(findAdjUpNode()).children(".value").focus();
            moveOneUp();
        }

        //LEFT ARROW + caret at beginning: move to the previous node
        if (e.keyCode === KEY_LEFTARROW) {
            if ($(this).caret() === 0) {
                e.preventDefault();
                moveOneUp();
            }
        }

        //RIGHT ARROW + caret at end: move to the next node.
        if (e.keyCode === KEY_RIGHTARROW) {

            let length = $(this).text().length;
            if ($(this).caret() === length) {
                e.preventDefault();
                let $nextNodeValue = $thisNode.next().children(".value");
                $nextNodeValue.focus();
            }
        }

        //DELETE: Remove the node. Focus on the previous node.
        if (e.keyCode === KEY_DELETE) {

            if (htmlVal.toString().length === 0) {
                e.preventDefault();

                if ($("#app").children().length > 1 || $thisNode.parents().length > 0) {
                    moveOneUp();
                    //http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
                    $thisNode.remove();
                    //if the current node is not empty & the previous node is empty + caret at the beginning, delete the previous node.
                }

            }

        }

        //TAB: Move the node inside of its previous sibling node. Label the moved node as a child node.
        if (e.keyCode === KEY_TAB) {
            e.preventDefault();
            let $prevNodeChildren = $thisNode.prev().children(".children");
            $prevNodeChildren.append($thisNode);
            $prevNodeChildren.children(".node").children(".value").focus();

        }

        //REVERSE TAB: Move the child node outside of its parent node(i.e. next)
        //http://stackoverflow.com/questions/10655202/detect-multiple-keys-on-single-keypress-event-on-jquery 

        //ENTER + Nothing in the node: Same functionality as REVERSE TAB (see above)
        if (e.keyCode === KEY_ENTER && htmlVal.toString().length === 0) {

        }

        saveData();


    });

    // //when text of the node is clicked,
    // $("#app").on("click", ".text", function(e) {
    //     let $form = $("<form><input type='text'></form>").addClass("modifier");
    //     $form.children("input").val($(this).text());
    //     $(this).before($form);
    //     $(this).remove();

    //     saveData();

    // });


    let hoverButton = function() {
        // let timeoutId;
        // $(".button").hover(function() {
        //     if (!timeoutId) {
        //         let $this = $(this);
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

    };


});
