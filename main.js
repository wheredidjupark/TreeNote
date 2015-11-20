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
        let $note = $("<div contenteditable></div>").addClass("note").addClass("hidden");
        let $children = $("<div></div>").addClass("children");
        let $bullet = $("<span>&#x02126;</span>").addClass("bullet");

        $node.append($value);
        $node.append($note);
        $node.append($children);
        $node.prepend($bullet);

        return $node.clone();
    };


    let removeNode = function(context) {
        let $node = $(context).closest(".node");
        if ($("#app").children().length > 1 || $node.parent().closest(".node").length > 0) {
            $node.remove();
        }
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

        let keydownValue = function() {

            $("#app").on("keydown", ".value", function(e) {

                console.log("You pressed the key with the following keycode", e.keyCode);
                let textVal = $(this).text();
                let htmlVal = $(this).html();
                let $node = $(this).closest(".node");

                //finds the nearest previous sibling node or closest parent node
                let findOneUp = function() {
                    let $adjacent = $node.prev();

                    //if thisNode does not have an older sibling, return the current node's parent
                    if ($adjacent.length === 0) {
                        //closest 

                        return $node.parent().closest(".node");
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
                    let $childrenNodes = $node.find(".node");

                    if ($childrenNodes.length !== 0) {
                        //if children exist
                        return $childrenNodes[0];
                    } else {
                        //if child doesn't exist, look into its sibling.
                        let $nextNode = $node.next();
                        if ($nextNode.length > 0) {
                            // return nextNode, node's sibling.
                            return $nextNode;
                        } else {
                            //if the sibling does not exist, then move to its parent's sibling
                            // console.log("parent's sibling");
                            let $parent = $node.parent().closest(".node");
                            let $parentSibling = $parent.next();
                            while ($parentSibling.length === 0) {
                                //if sibling doesn't exist
                                if ($parent.length === 0) {
                                    return $node;
                                }
                                $parent = $parent.parent().closest(".node");
                                $parentSibling = $parent.next();
                            }
                            return $parentSibling;
                        }
                    }

                    //if there is no sibling, move to thisNode's sibling and 
                };

                // console.log("node's adjacentUp value: ", $(findOneUp()).children(".value").text());
                // console.log("node's value: ", $(this).text());
                // console.log("node's adjacentDown value: ", $(findOneDown()).children(".value").text());


                let moveOneUp = function() {
                    let $upNode = $(findOneUp());
                    $upNode.children(".value").focus();
                    return $upNode;
                };

                let moveOneDown = function() {
                    let $downNode = $(findOneDown());
                    $downNode.children(".value").focus();
                    return $downNode;
                };

                //ENTER: Create a new sibling node. Focus on the newly created sibling node.
                if (e.keyCode === KEY_ENTER) {
                    e.preventDefault();
                    $node.after(createNode());
                    moveOneDown(); // $node.next().children(".value").focus();
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
                        let $upNode = moveOneUp();

                        if ($upNode.length !== 0) {
                            if ($upNode.children(".value").html().toString().length === 0) {
                                $upNode.children(".value").focus();
                            } else {
                                $upNode.children(".value").caret(-1);
                            }

                        }
                    }
                }

                //RIGHT ARROW + caret at end: move to the next node.
                if (e.keyCode === KEY_RIGHTARROW) {

                    let length = $(this).text().length;
                    if ($(this).caret() === length) {
                        e.preventDefault();
                        moveOneDown();
                    }
                }

                //DELETE: Remove the node. Focus on the previous node.
                if (e.keyCode === KEY_DELETE) {

                    if (htmlVal.toString().length === 0) {
                        e.preventDefault();

                        if ($("#app").children().length > 1 || $node.parent().closest(".node").length > 0) {
                            moveOneUp();
                            //http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
                            $node.remove();
                            //if the current node is not empty & the previous node is empty + caret at the beginning, delete the previous node.
                        }

                    }

                }

                //TAB: Move the node inside of its previous sibling node. Label the moved node as a child node.
                if (e.keyCode === KEY_TAB && !e.shiftKey) {
                    e.preventDefault();

                    let $prevNode = $node.prev();
                    let $prevNodeChildren = $node.prev().children(".children");

                    $prevNodeChildren.append($node);

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
                    let $parentNode = $node.parent().closest(".node");
                    $parentNode.after($node);
                    $(this).focus();

                }
                //ENTER + Nothing in the node: Same functionality as REVERSE TAB (see above)
                // if (e.keyCode === KEY_ENTER && htmlVal.toString().length === 0) {}

                saveData();
            });
        };

        let keydownNote = function() {
            $("#app").on("keydown", ".note", function(e) {
                let html = $(this).html();
                let $node = $(this).closest(".node");

                if (e.keyCode === KEY_DELETE) {

                    if (html.toString().length === 0) {
                        e.preventDefault();
                        $(this).toggleClass("hidden", true);
                        $node.children(".value").focus();
                    }
                }
            });
        };

        keydownValue();
        keydownNote();
    };

    let hoverEvents = function() {


        let hoverBullet = function() {
            let timeoutId = false;

            $("#app").on("mouseenter", ".bullet", function() {
                let $node = $(this).closest(".node");

                if (!timeoutId) {
                    timeoutId = setTimeout(function() {

                        $node.addClass("highlighted");
                        let $menubar = $("<div></div>").addClass("ctrlBar");
                        let $list = $("<ul></ul>");

                        let controls = [{
                            "Complete": "completeTask"
                        }, {
                            "Undo Complete": "incompleteTask"
                        }, {
                            "Add Note": "addNote"
                        }, {
                            "Delete Note": "deleteNote"
                        }, {
                            "Delete": "deleteNode"
                        }];

                        for (let i = 0; i < controls.length; i++) {
                            let obj = controls[i];
                            for (let key in obj) {
                                let $item = $("<li>" + key + "</li>").addClass(obj[key]);
                                $list.append($item);
                            }
                        }

                        $menubar.append($list);
                        $node.append($menubar);
                    }, 200);
                }
            });

            $("#app").on("mouseleave", ".bullet", function() {
                let $node = $(this).closest(".node");

                if (timeoutId) {
                    $node.removeClass("highlighted");
                    clearTimeout(timeoutId);
                    timeoutId = false;
                }

                saveData();
            });

            $("#app").on("mouseleave", ".ctrlBar", function() {
                let $node = $(this).closest(".node");
                $node.children(".ctrlBar").remove();
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = false;
                }
                saveData();
            });
        };

        hoverBullet();
    };

    let clickEvents = function() {

        let expand = function(context) {

            let $node = $(context).closest(".node");
            let $nodeChildren = $node.children(".children");

            if ($nodeChildren.children(".node").length > 0) {
                $nodeChildren.toggleClass("hidden");
                $(context).toggleClass("bullet-clicked");
            }
        };

        //expands the node to reveal its children nodes
        let clickBullet = function() {
            $("#app").on("click", ".bullet", function() {
                expand(this);
                saveData();
            });
        };

        //completes the given task
        let clickCtrlBar = function() {
            //complete task toggles
            $("#app").on("click", ".completeTask", function() {

                let $node = $(this).closest(".node");
                $node.toggleClass("completed", true); //indicate complete tag on node

                saveData();
            });


            $("#app").on("click", ".incompleteTask", function() {
                let $node = $(this).closest(".node");
                $node.toggleClass("completed", false);

                saveData();
            });

            $("#app").on("click", ".addNote", function() {

                let $note = $(this).closest(".node").children(".note");
                $note.toggleClass("hidden", false);
                $note.focus();

            });

            $("#app").on("click", ".deleteNote", function() {
                let $node = $(this).closest(".node");
                let $note = $(this).closest(".node").children(".note");
                $note.text("").toggleClass("hidden", true);
                $node.children(".value").focus();
            });

            $("#app").on("click", ".deleteNode", function() {
                removeNode(this);
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
