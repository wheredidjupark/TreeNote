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
        let $bullet = $("<span>O</span>").addClass("bullet");

        $node.append($value);
        $node.append($children);
        $node.prepend($bullet);

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

    let keydownEvents = function() {
        $("#app").on("keydown", ".value", function(e) {

            console.log("You pressed the key with the following keycode",e.keyCode);
            let textVal = $(this).text();
            let htmlVal = $(this).html();
            let $thisNode = $(this).closest(".node");

            //finds the nearest previous sibling node or closest parent node
            let findOneUp = function() {
                let $adjacent = $thisNode.prev();

                //if thisNode does not have an older sibling, return the current node's parent
                if ($adjacent.length === 0) {
                    //closest 

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



                        while ($(adjacent).children(".children").children(".node").length > 0) {
                            length = $(adjacent).children(".children").children(".node").length;
                            adjacent = $(adjacent).children(".children").children(".node")[length - 1];
                        }

                        return adjacent;
                    }
                }
            };

            // console.log("node's adjacentUp value: ", $(findOneUp()).children(".value").text());
            // console.log("node's value: ", $(this).text());
            // console.log("node's adjacentDown value: ",$(findOneUp()).children(".value").text());



            let findOneDown = function() {
                let $adjacent = $thisNode.find(".node");
                //console.log($adjacent);
                if ($adjacent.length !== 0) {
                    //if children exist
                    // console.log("child");
                    return $adjacent[0];
                } else {
                    //if child doesn't exist, look into its sibling.
                    let $sibling = $thisNode.next();
                    if ($sibling.length > 0) {
                        //if sibling exists, return the sibling.
                        // console.log("sibling");
                        return $sibling;
                    } else {
                        //if the sibling does not exist, then move to its parent's sibling
                        // console.log("parent's sibling");
                        let $parent = $thisNode.parent().closest(".node");
                        let $parentSibling = $parent.next();
                        while ($parentSibling.length === 0) {
                            //if sibling doesn't exist
                            if ($parent.length === 0) {
                                return $thisNode;
                            }
                            $parent = $parent.parent().closest(".node");
                            $parentSibling = $parent.next();
                        }
                        return $parentSibling;
                    }
                }

                //if there is no sibling, move to thisNode's sibling and 
            };



            let moveOneUp = function() {
                let $oneup = $(findOneUp());
                $oneup.children(".value").focus();
            };

            let moveOneDown = function() {
                $(findOneDown()).children(".value").focus();
            };

            //ENTER: Create a new sibling node. Focus on the newly created sibling node.
            if (e.keyCode === KEY_ENTER) {
                e.preventDefault();
                $thisNode.after(createNode());
                $thisNode.next().children(".value").focus();
            }

            //DOWNARROW: focus on the next node
            if (e.keyCode === KEY_DOWNARROW) {
                e.preventDefault();
                // $thisNode.next().children(".value").focus();
                moveOneDown();
            }

            //UPARROW: Focus on the previous node
            if (e.keyCode === KEY_UPARROW) {
                e.preventDefault();
                // $(findOneUp()).children(".value").focus();
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
                    moveOneDown();
                    // let $nextNodeValue = $thisNode.next().children(".value");
                    // $nextNodeValue.focus();
                }
            }

            //DELETE: Remove the node. Focus on the previous node.
            if (e.keyCode === KEY_DELETE) {

                if (htmlVal.toString().length === 0) {
                    e.preventDefault();

                    if ($("#app").children().length > 1 || $thisNode.parent().closest(".node").length > 0) {
                        moveOneUp();
                        //http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
                        $thisNode.remove();
                        //if the current node is not empty & the previous node is empty + caret at the beginning, delete the previous node.
                    }

                }

            }

            //TAB: Move the node inside of its previous sibling node. Label the moved node as a child node.
            if (e.keyCode === KEY_TAB && !e.shiftKey) {
                e.preventDefault();
                let $prevNodeChildren = $thisNode.prev().children(".children");
                $prevNodeChildren.append($thisNode);
                $prevNodeChildren.children(".node").children(".value").focus();
            }

            //REVERSE TAB: Move the child node outside of its parent node(i.e. next)
            //http://stackoverflow.com/questions/10655202/detect-multiple-keys-on-single-keypress-event-on-jquery 

            if(e.keyCode === KEY_TAB && e.shiftKey){
            	e.preventDefault();
            	let $parentNode = $thisNode.parent().closest(".node");
            	$parentNode.after($thisNode);
            	$(this).focus();

            }
            //ENTER + Nothing in the node: Same functionality as REVERSE TAB (see above)
            // if (e.keyCode === KEY_ENTER && htmlVal.toString().length === 0) {}

            saveData();
        });
    };

    let hoverEvents = function() {


        let hoverBullet = function() {
            let timeoutId = false;

            $("#app").on("mouseenter", ".bullet", function() {
                let $thisNode = $(this).closest(".node");

                if (!timeoutId) {
                    timeoutId = setTimeout(function() {
                        console.log("hovering");
                        // let $menubar = $("<div>Menu</div>").addClass("menubar");
                        // $thisNode.prepend($menubar);

                    }, 500);
                }
            });

            $("#app").on("mouseleave", ".bullet", function() {
                let $thisNode = $(this).closest(".node");

                if (timeoutId) {
                    console.log("leaving");
                    clearTimeout(timeoutId);
                    timeoutId = false;
                    // $thisNode.children(".menubar").remove();
                }
            });
        };

        hoverBullet();
    };

    let clickEvents = function(){
    	let clickBullet = function(){
    		$("#app").on("click", ".bullet", function(){
    			console.log("click");
    			let $thisNode = $(this).closest(".node");
    			let $thisNodeChildren = $thisNode.children(".children");
    			$thisNodeChildren.toggleClass("hidden");
    			$(this).toggleClass("bullet-clicked");
    		});
    	};
    	clickBullet();
    };



    initialize();
    keydownEvents();
    hoverEvents();
    clickEvents();



});
