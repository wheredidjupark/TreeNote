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
        // let $note = $("<div contenteditable></div>").addClass("note");
        let $children = $("<div></div>").addClass("children");
        let $bullet = $("<span>&#x02126;</span>").addClass("bullet");

        $node.append($value);
        // $node.append($note);
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

        //implemented as a safeguard in the case the app doesn't contain any content.
        let appContent = $("#app").text();
        if (appContent.length === 0) {
            $("#app").append(createNode());
        }
    };

    let keydownEvents = function() {
        $("#app").on("keydown", ".value", function(e) {

            console.log("You pressed the key with the following keycode", e.keyCode);
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

            console.log("node's adjacentUp value: ", $(findOneUp()).children(".value").text());
            console.log("node's value: ", $(this).text());
            console.log("node's adjacentDown value: ", $(findOneDown()).children(".value").text());


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
                moveOneDown();
            }

            //UPARROW: Focus on the previous node
            if (e.keyCode === KEY_UPARROW) {
                e.preventDefault();
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

                let $prevNode = $thisNode.prev();
                let $prevNodeChildren = $thisNode.prev().children(".children");

                $prevNodeChildren.append($thisNode);

                if ($prevNodeChildren.hasClass("hidden")) {
                    $prevNodeChildren.toggleClass("hidden", false);
                    $prevNode.children(".bullet").toggleClass("bullet-clicked", false);
                }
                // $prevNodeChildren.children(".node").children(".value").focus();
                $(this).focus();
            }

            //REVERSE TAB: Move the child node outside of its parent node(i.e. next)
            //http://stackoverflow.com/questions/10655202/detect-multiple-keys-on-single-keypress-event-on-jquery 

            if (e.keyCode === KEY_TAB && e.shiftKey) {
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
                let $this = $(this);
                if (!timeoutId) {
                    timeoutId = setTimeout(function() {
                        console.log("hovering");
                        $thisNode.addClass("highlighted");
                        let $menubar = $("<div></div>").addClass("ctrlBar");
                        let $list = $("<ul></ul>");

                        let controls = [{
                            "Complete Task": "completeTask"
                        }, {
                            "Uncomplete Task": "uncompleteTask"
                        }, {
                            "Add Note": "addNote"
                        }, {
                            "Delete Note": "deleteNote"
                        }, {
                            "Delete": "deleteNode"
                        }];

                        for (var i = 0; i < controls.length; i++) {
                            var obj = controls[i];
                            for (var key in obj) {
                                let $item = $("<li>" + key + "</li>").addClass(obj[key]);
                                $list.append($item);
                            }
                        }

                        $menubar.append($list);
                        $thisNode.append($menubar);
                    }, 200);
                }
            });

            $("#app").on("mouseleave", ".bullet", function() {
                let $thisNode = $(this).closest(".node");

                if (timeoutId) {
                    console.log("leaving");
                    $thisNode.removeClass("highlighted");
                    clearTimeout(timeoutId);
                    timeoutId = false;
                }
            });

            $("#app").on("mouseleave", ".ctrlBar", function() {
                let $thisNode = $(this).closest(".node");
                $thisNode.children(".ctrlBar").remove();

                if (timeoutId) {
                    console.log("leaving");
                    $thisNode.removeClass("highlighted");
                    clearTimeout(timeoutId);
                    timeoutId = false;
                }
            });
        };

        hoverBullet();
    };

    let clickEvents = function() {

        var expand = function(context) {
            console.log("click");
            let $thisNode = $(context).closest(".node");
            let $thisNodeChildren = $thisNode.children(".children");

            if ($thisNodeChildren.children(".node").length > 0) {
                $thisNodeChildren.toggleClass("hidden");
                $(context).toggleClass("bullet-clicked");
            }
            saveData();
        };

        let clickBullet = function() {
            $("#app").on("click", ".bullet", function() {
                expand(this);
            });
        };

        let clickCtrlBar = function() {
            //complete task toggles
            $("#app").on("click", ".completeTask", function() {
                console.log("clicked completeTask!");
                let $thisNode = $(this).closest(".node");
                $thisNode.addClass("completed"); //indicate complete tag on node
                // $(this).before($("<li>Undo Complete</li>").addClass("uncompleteTask"))
                // $(this).remove();
                saveData();
            });

            $("#app").on("click", ".addNote", function() {
                console.log("clicked addNote!");
            });

            $("#app").on("click", ".deleteNode", function() {
                let $thisNode = $(this).closest(".node");
                $thisNode.remove();
                saveData();
            });

            $("#app").on("click", ".uncompleteTask", function() {
                let $thisNode = $(this).closest(".node");
                $thisNode.removeClass("completed");
                // $(this).before($("<li>Complete Task</li>").addClass("completeTask"));
                // $(this).remove();
                saveData();
            });
        };
        clickBullet();
        clickCtrlBar();
    };

    initialize();
    keydownEvents();
    hoverEvents();
    clickEvents();



});
