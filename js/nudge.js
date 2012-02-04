"use strict";

/*
 *  Nudge
 *  Copyright (C) 2012 Skiggle Pty Ltd
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
 *  
 */

// JavaScript functions for the Nudge toolbar

// Global variables
var _target = null;


// jQuery ready
$(document).ready(function() {
	
	// Add Bootstrap
	var bootstrap = '<link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"/>';
	$('head').append(bootstrap);
	
	// Add topbar
	var topbar = '\
		<div class="topbar">\
			<div class="fill">\
				<div class="container">\
					<a class="brand" href="#">Nudge</a>\
					<ul class="nav">\
						<li class="active"><a href="#">Position</a></li>\
						<li><a href="#">Margin</a></li>\
						<li><a href="#">Padding</a></li>\
					</ul>\
				</div>\
			</div>\
		</div>\
	';
	$('body').append(topbar);
	
	// Add selection box
	var box = '\
		<div class="nudge-box" style="\
			position: absolute;\
			border: 1px solid blue;\
			background-color: #8bb6dd;\
			opacity: 0.5;\
			z-index: 1000;\
		"></div>\
	';
	$('body').append(box);
	
	// Attach click handler
	var elements = 'h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, cite, code, del, dfn, em, img, q, s, samp, small, strike, strong, sub, sup, tt, var, dd, dl, dt, li, ol, ul, fieldset, form, label, legend, button, table, caption, tbody, tfoot, thead, tr, th, td, div, footer, input';
	$(elements).mousedown(onClick);
	
	// Attach keypress handler
	$('body').keydown(onKeyDown);
});

function onClick(event) {
	
	// Get jQuery object for the highlight box
	var box = $(".nudge-box");
	
	// Warn and skip if item does not have an element id
	if (event.target.id === "") {
		
		// Hide the hightlight box
		box.hide();
		return;
	}
	
	// Remember target
	_target = event.target
	
	// Get jQuery object for target
	var object = $("#" + _target.id);
	
	// Show the highlight box
	box.offset(object.position());
	box.width(object.innerWidth());
	box.height(object.innerHeight());
	
	box.show();
	
	// Prevent default action
	event.preventDefault();
}

function onKeyDown(event) {
	
	// Skip if target is null
	if (_target === null) {
		return;
	}
	
	// Get jQuery object for target
	var object = $("#" + _target.id);
	
	// Adjust action for different modifiers
	var sizeModifier = (event.altKey || event.metaKey);
	var speedModifier = event.shiftKey;
	
	// Respond to arrow keys and modifiers
	switch (event.keyCode) {
		
		// Left key
		case 37:
			object.css((sizeModifier ? "width" : "left"), "-=" + (speedModifier ? 10 : 1));
			break;
			
		// Up key
		case 38:
			object.css((sizeModifier ? "height" : "top"), "-=" + (speedModifier ? 10 : 1));
			break;
			
		// Right key
		case 39:
			object.css((sizeModifier ? "width" : "left"), "+=" + (speedModifier ? 10 : 1));
			break;
			
		// Down key
		case 40:
			object.css((sizeModifier ? "height" : "top"), "+=" + (speedModifier ? 10 : 1));
			break;
		
		default:
			return;
	}
	
	// Reposition the hightlight box
	var box = $(".nudge-box");
	
	box.offset(object.position());
	box.width(object.innerWidth());
	box.height(object.innerHeight());
}
