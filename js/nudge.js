"use strict";

/*!
 *  Nudge
 *  Copyright (C) 2012 Skiggle Pty Ltd
 *
 *  Designed by Chris Nolet (@chrisnolet)
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


// JavaScript functions for the Nudge toolbar

// Global variables
var _target = null;
var _mode = "position";


// jQuery ready
$(document).ready(function() {
	
	// Add Bootstrap
	//var bootstrap = '<link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"/>';
	//var bootstrap = '<link rel="stylesheet" href="https://raw.github.com/chrisnolet/Nudge/master/css/bootstrap.css"/>';
	
	var bootstrap = '<link rel="stylesheet" href="https://skiggle.com.au/files/bootstrap.css"/>';
	$("head").append(bootstrap);
	
	// Add topbar
	var topbar = '\
		<div class="topbar">\
			<div class="fill">\
				<div class="container">\
					<div class="brand" style="cursor: default;">Nudge</div>\
					<ul class="nav">\
						<li id="nudge-position" class="active"><a id="nudge-position-link" href="#">Position</a></li>\
						<li id="nudge-margin"><a id="nudge-margin-link" href="#">Margin</a></li>\
						<li id="nudge-padding"><a id="nudge-padding-link" href="#">Padding</a></li>\
					</ul>\
					<ul class="nav secondary-nav">\
						<li class="dropdown"><a href="#" id="nudge-position-style" class="dropdown-toggle">Position: Static</a>\
							<ul class="dropdown-menu">\
								<li><a id="nudge-static-link" href="#">Static</a></li>\
								<li><a id="nudge-relative-link" href="#">Relative</a></li>\
								<li><a id="nudge-absolute-link" href="#">Absolute</a></li>\
								<li><a id="nudge-fixed-link" href="#">Fixed</a></li>\
								<li></li>\
								<li><a id="nudge-inherit-link" href="#">Inherit</a></li>\
							</ul>\
						</li>\
					</ul>\
				</div>\
			</div>\
		</div>\
	';
	// $("body").append(topbar).dropdown(); // Topbar is no longer in use
	
	// Add selection box
	var box = '\
		<div class="nudge-box" style="\
			position: absolute;\
			margin: 0;\
			padding: 0;\
			border: 1px solid #00f;\
			background-color: #8bb6dd;\
			opacity: 0.5;\
			z-index: 10000;\
			display: none;\
		">\
			<p style="\
				position: absolute;\
				margin: 0;\
				padding: 0;\
				left: 4px;\
				top: 4px;\
				font: 15px \'Helvetica Neue\', Helvetica, Arial, sans-serif;\
				color: #005;\
			"></p>\
		</div>\
	';
	$("body").append(box);
	
	// Add output box
	var output = '\
		<div id="nudge-output" style="\
			position: fixed;\
			margin: 0;\
			padding: 8px;\
			top: -1px;\
			right: -1px;\
			border: 1px solid #f00;\
			background-color: #ddb68b;\
			opacity: 0.5;\
			z-index: 100000;\
			display: none;\
		">\
			<p id="nudge-output-paragraph" style="\
				margin: 0;\
				padding: 0;\
				font: 13px Monaco, \'Lucida Console\', \'Courier New\', monospace, sans-serif;\
				color: #500;\
			"></p><br/>\
			<a id="nudge-select-all" href="#" style="\
				margin: 0;\
				padding: 0;\
				font: 13px Monaco, \'Lucida Console\', \'Courier New\', monospace, sans-serif;\
				color: #500;\
			">Select All</a>\
		</div>\
	';
	$('body').append(output);
	
	// Toolbar actions
	$("#nudge-position").click(function(e) {
		e.preventDefault();
		setMode("position");
	});
	$("#nudge-margin").click(function(e) {
		e.preventDefault();
		setMode("margin");
	});
	$("#nudge-padding").click(function(e) {
		e.preventDefault();
		setMode("padding");
	});
	$("#nudge-static").click(function(e) {
		e.preventDefault();
		mode(1);
	});
	$("#nudge-relative").click(function(e) {
		e.preventDefault();
		mode(1);
	});
	$("#nudge-absolute").click(function(e) {
		e.preventDefault();
		mode(1);
	});
	$("#nudge-fixed").click(function(e) {
		e.preventDefault();
		mode(1);
	});
	$("#nudge-inherit").click(function(e) {
		e.preventDefault();
		mode(1);
	});
	
	// 'Select All' action
	$("#nudge-select-all").click(function(e) {
		e.preventDefault();
		selectText("nudge-output-paragraph");
	});
	
	// Attach click handler
	var elements = 'h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, cite, code, del, dfn, em, img, q, s, samp, small, strike, strong, sub, sup, tt, var, dd, dl, dt, li, ol, ul, fieldset, form, label, legend, button, table, caption, tbody, tfoot, thead, tr, th, td, div, footer, input';
	$(elements).mousedown(onClick);
	
	// Attach keypress handler
	$("body").keydown(onKeyDown);
});

// Save mode selection
function setMode(mode) {
	
	// Deselect the previous mode
	$("#nudge-" + _mode).removeClass("active");
	
	// Remember the mode
	_mode = mode;
	
	// Hightlight the selected mode
	$("#nudge-" + _mode).addClass("active");
}

// Element clicked
function onClick(event) {
	
	// Skip and do nothing if element id begins with 'nudge-'
	if (event.target.id.lastIndexOf('nudge-', 0) === 0) {
		return;
	}
	
	// Prevent default click action
	event.preventDefault();
	
	// Skip repeated events
	if (event.target === _target) {
		return;
	}
	
	// Warn and skip if item does not have an element id
	if (event.target.id === "") {
		
		// Reset the target
		_target = null;
		
		// Hide the highlight box
		$(".nudge-box").hide();
		$("#nudge-output").hide();
		
		return;
	}
	
	// Remember target
	_target = event.target
	
	// Get jQuery object for target
	var object = $("#" + _target.id);
	
	// Show the highlight box
	moveHightlightBox(object).show();
	$("#nudge-output").show();
}

function moveHightlightBox(object) {
	
	// Get actual element width and height
	var width = cssWidth(object);
	var height = cssHeight(object);
	
	// Get jQuery object for the highlight box
	var box = $(".nudge-box");
	
	box.css(object.offset());
	box.width(object.innerWidth());
	box.height(object.innerHeight());
	
	// Set the label text
	//$(".nudge-box > p").html("<b>#" + _target.id + "</b> (" + object.innerWidth() + ", " + object.innerHeight() + ")");
	
	// Set the output text
	$("#nudge-output > p").html("" // "<b>#" + _target.id + "</b> {<br/>"
		// + "&nbsp;&nbsp;&nbsp; margin-left: " + object.css("margin-left") + ";<br/>"
		// + "&nbsp;&nbsp;&nbsp; margin-top: " + object.css("margin-top") + ";<br/>"
		// + "&nbsp;&nbsp;&nbsp; padding-left: " + object.css("padding-left") + ";<br/>"
		// + "&nbsp;&nbsp;&nbsp; padding-top: " + object.css("padding-top") + ";<br/>"
		+ "left: " + object.css("left") + ";<br/>"
		+ "top: " + object.css("top") + ";<br/>"
		+ "width: " + width + "px;<br/>"
		+ "height: " + height + "px;<br/>"
		+ "}<br/><br/>"
	);
	
	// Return the jQuery object for chaining
	return box;
}

function cssWidth(object) {
	
	// See if the object resizes with a 'fudge' factor
	var start = object.width();
	object.css("width", "+=0");
	var fudge = object.width() - start;
	
	// Restore the object to its original size
	object.css("width", "-=" + (2 * fudge));
	
	// Return the width or the inner width accordingly
	if (fudge === 0) {
		return object.width();
	} else {
		return object.innerWidth();
	}
}

function cssHeight(object) {
	
	// See if the object resizes with a 'fudge' factor
	var start = object.height();
	object.css("height", "+=0");
	var fudge = object.height() - start;
	
	// Restore the object to its original size
	object.css("height", "-=" + (2 * fudge));
	
	// Return the width or the inner width accordingly
	if (fudge === 0) {
		return object.height();
	} else {
		return object.innerHeight();
	}
}

// Key pressed
function onKeyDown(event) {
	
	// Skip if target is null
	if (_target === null) {
		return;
	}
	
	// Adjust action for different modifiers
	var sizeModifier = (event.altKey || event.ctrlKey || event.metaKey);
	var speedModifier = event.shiftKey;
	
	// Choose attribute names based on the current mode
	var xAttribute;
	var yAttribute;
	
	switch (_mode) {
		case "position":
			xAttribute = "left";
			yAttribute = "top";
			break;
			
		case "margin":
			xAttribute = "margin-left";
			yAttribute = "margin-top";
			break;
			
		case "padding":
			xAttribute = "padding-left";
			yAttribute = "padding-top";
			break;
	}
	
	// Get jQuery object for target
	var object = $("#" + _target.id);
	
	// Respond to arrow keys and modifiers
	switch (event.keyCode) {
		
		// Left key
		case 37:
		case 83:
			object.css((sizeModifier ? "width" : xAttribute), "-=" + (speedModifier ? 10 : 1));
			break;
			
		// Up key
		case 38:
		case 69:
			object.css((sizeModifier ? "height" : yAttribute), "-=" + (speedModifier ? 10 : 1));
			break;
			
		// Right key
		case 39:
		case 70:
			object.css((sizeModifier ? "width" : xAttribute), "+=" + (speedModifier ? 10 : 1));
			break;
			
		// Down key
		case 40:
		case 68:
			object.css((sizeModifier ? "height" : yAttribute), "+=" + (speedModifier ? 10 : 1));
			break;
		
		// Resize-left key
		case 74:
			object.css("width", cssWidth(object) - (speedModifier ? 10 : 1));
			break;
			
		// Resize-up key
		case 73:
			object.css("height", cssHeight(object) - (speedModifier ? 10 : 1));
			break;
			
		// Resize-right key
		case 76:
			object.css("width", cssWidth(object) + (speedModifier ? 10 : 1));
			break;
			
		// Resize-down key
		case 75:
			object.css("height", cssHeight(object) + (speedModifier ? 10 : 1));
			break;
		
		default:
			return;
	}
	
	// Reposition the highlight box
	moveHightlightBox(object);
}

// Select text
function selectText(id) {
	
	// Note: Borrowed from 'http://stackoverflow.com/questions/985272'
	
	// Get the text element from the element id
	var text = document.getElementById(id);
	
	// Select the text element
	if (document.body.createTextRange) {
		
		// Microsoft IE
		var range = document.body.createTextRange();
		range.moveToElementText(text);
		range.select();
		
	} else if (window.getSelection) {
		
		//  Safari, Chrome, Firefox and Opera
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}


/* ============================================================
 * bootstrap-dropdown.js v1.4.0
 * http://twitter.github.com/bootstrap/javascript.html#dropdown
 * ============================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function( $ ){

  "use strict"

  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function ( selector ) {
    return this.each(function () {
      $(this).delegate(selector || d, 'click', function (e) {
        var li = $(this).parent('li')
          , isActive = li.hasClass('open')

        clearMenus()
        !isActive && li.toggleClass('open')
        return false
      })
    })
  }

  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  var d = 'a.menu, .dropdown-toggle'

  function clearMenus() {
    $(d).parent('li').removeClass('open')
  }

  $(function () {
    $('html').bind("click", clearMenus)
    $('body').dropdown( '[data-dropdown] a.menu, [data-dropdown] .dropdown-toggle' )
  })

}( window.jQuery || window.ender );
