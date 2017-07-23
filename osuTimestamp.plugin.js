//META{"name":"osuTimestamp"}*//

var osuTimestamp = function () {};

osuTimestamp.prototype.start = function () {
	this.convert();

	BdApi.injectCSS("ots-style", `

		.osuTimestamp, .osuTimestamp:link, .osuTimestamp:visited, .osuTimestamp:hover, .osuTimestamp:active {
			display: inline-block;
			border: 1px solid #000;
			border-radius: 3px;
			text-decoration: none !important;
			padding: 1px 3px 1px 3px;
		}

		.theme-dark .osuTimestamp {
			border-color: #464653;
			background-color: #191934;
			/*background-color: #22222a;*/
			color: hsla(0,0%,100%,.7) !important;
		}

		.theme-dark .osuTimestamp:hover {
			background-color: #0c0c0e;
			color: #b3b7e6
		}

		.theme-light .osuTimestamp {
			border-color: #91c2ff;
			background-color: #ddecff;
			color: #737f8d !important;
		}

		.theme-light .osuTimestamp:hover {
			background-color: #fff;
			color: #3843a6;
		}

	`);
};

osuTimestamp.prototype.load = function () {
	this.convert();
};

osuTimestamp.prototype.unload = function () {}
;

osuTimestamp.prototype.stop = function () {

};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

osuTimestamp.prototype.convert = function() {

	setTimeout(function() {
		$(".message .markup").each(function() {
			var message = $(this);
			if (message.find("a.osuTimestamp").length > 0) {
				return;
			}
				
			var contents = message.html();
			var regex = /(\d\d:){2,}\d{3,}( \(\d(,\d)*\))* -/g;

			var match;
			var newContents = contents;
			while ((match = regex.exec(contents)) != null) {
				var url = "osu://edit/" + match[0].slice(0,-1);
				var link = '<a class="osuTimestamp" href="' + url + '">' + match[0].slice(0,-2) + '</a>' + " -";

				if (occurrences(contents, match[0],false) > 1) {
					var tmp = match[0].replace('(', '\\(');
					tmp = tmp.replace(')', '\\)');
					newContents = newContents.replaceAll(tmp, link);
				}
				else {
					newContents = newContents.replace(match[0], link);
				}
				//var r = new RegExp(match[0], "g");
				//newContents = newContents.replace(r, link);
				//newContents = newContents.replaceAll(match[0], link);
				
			}

			message.html(newContents);

		});
	}, 250 );

}

//

osuTimestamp.prototype.onMessage = function () {
    this.convert();
};

osuTimestamp.prototype.onSwitch = function () {
    this.convert();
};

var count = 0;

osuTimestamp.prototype.observer = function (e) {
    
	//console.log(e);

    if (e.target.className == "comment" || 
    	e.target.tagName == "TITLE" ||
    	(e.target.className == "messages scroller" && e.nextSibling == null && !e.previousSibling.classList.contains("has-divider"))) {
    	this.convert();	
    } 

};

osuTimestamp.prototype.getSettingsPanel = function () {
    return "";
};

osuTimestamp.prototype.getName = function () {
    return "osu!timestamp";
};

osuTimestamp.prototype.getDescription = function () {
    return "- Converts editor timestamps into links<br>\
    - ctrl + click the links to open them in the editor<br>\
    - you can change the CSS with the class .osuTimestamp<br>\
    - currently in beta, please report any bugs you find<br>\
    ";
};

osuTimestamp.prototype.getVersion = function () {
    return "0.1.0";
};

osuTimestamp.prototype.getAuthor = function () {
    return "yaspo";
};