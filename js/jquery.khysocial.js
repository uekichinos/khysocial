(function($) {
    $.fn.khysocial = function(options) {
        var settings = $.extend({
        	fontsize : 14,
            debug : false
        }, options);
		return this.each( function() {
			window.thisForm = this;
			window.fontsize = settings.fontsize;
			if(settings.social.twitter != "" && typeof settings.social.twitter !== 'undefined') {
				if(settings.debug == true) console.log("twitter on");
				var twitter_set = settings.social.twitter;
				var twlimit = twitter_set.limit;
				var twkey = twitter_set.key;
				var twsecret = twitter_set.secretkey;
				var twtoken = twitter_set.token;
				var twsecrettoken = twitter_set.secrettoken;
				var twquery = twitter_set.query;
				if(typeof twlimit === 'undefined' || twlimit == "" || twlimit == 0) {
					twlimit = 5;
				}
				if(typeof twkey === 'undefined') {
					if(settings.debug == true) console.log("missing twitter key");
					return false;
				}
				else if(twkey == "") {
					if(settings.debug == true) console.log("twitter key empty");
					return false;
				}
				else if(typeof twsecret === 'undefined') {
					if(settings.debug == true) console.log("missing twitter secret key");
					return false;
				}
				else if(twsecret == "") {
					if(settings.debug == true) console.log("twitter secret key empty");
					return false;
				}
				else if(typeof twtoken === 'undefined') {
					if(settings.debug == true) console.log("missing twitter token");
					return false;
				}
				else if(twtoken == "") {
					if(settings.debug == true) console.log("twitter token empty");
					return false;
				}
				else if(typeof twsecrettoken === 'undefined') {
					if(settings.debug == true) console.log("missing twitter secret token");
					return false;
				}
				else if(twsecrettoken == "") {
					if(settings.debug == true) console.log("twitter secret token empty");
					return false;
				}
				else if(twquery == "") {
					if(settings.debug == true) console.log("twitter query empty");
					return false;
				}
				else {
					var querytype;
					var querystr = twquery;
					if (querystr.indexOf("@") != -1) {
						querytype = "handler";
						querystr = querystr.replace(/@/g, "");
					}
					else {
						querytype = "hashtag";
					}
					$.ajax({
						method: "POST",
						url: 'plugin/tw/index.php',
						dataType: 'json',
						async: false,
						data: {key:twkey, secretkey:twsecret, token:twtoken, secrettoken:twsecrettoken, limit:twlimit, qtype:querytype, qstr:querystr},
						success: function(msg) {
							var tweetArray = [];
							if(querytype == "hashtag") {
								var count = 0;
								$.each(msg.statuses, function(key, data) {
									var tw_text, tw_source, tw_created, tw_handler;
									$.each(data, function(index, value) {
										if(settings.debug == true) console.log("["+count+"] "+index+" : "+value);
										if(index == "text") {
									        tw_text = $.fn.convertLink(value);
										}
										else if(index == "source") tw_source = value;
										else if(index == "created_at") tw_created = value;
										if(index == "user") {
											$.each(value, function(index_user, value_user) {
												if(settings.debug == true) console.log("- "+index_user+" : "+value_user);
												if(index_user == "screen_name") tw_handler = value_user;
												if(index_user == "profile_image_url" && value_user != "") tw_text = "<img src='"+value_user+"' align='left'> "+tw_text;
											});
										}
									});
									var timesince = $.fn.timesince(tw_created);
									tweetArray[count] = {tw_text:tw_text, tw_handler:tw_handler, timesince:timesince};
									count++
								});
							}
							else if(querytype == "handler") {
								var count = 0;
								$.each(msg, function(key, data) {
									$.each(data, function(key2, data2) {
										var tw_text, tw_source, tw_created, tw_handler;
										$.each(data2, function(index, value) {
											if(settings.debug == true) console.log("["+count+"] "+index+" : "+value);
											if(index == "text") {
										        tw_text = $.fn.convertLink(value);
											}
											else if(index == "source") tw_source = value;
											else if(index == "created_at") tw_created = value;
											if(index == "user") {
												$.each(value, function(index_user, value_user) {
													if(settings.debug == true) console.log("- "+index_user+" : "+value_user);
													if(index_user == "screen_name") tw_handler = value_user;
													if(index_user == "profile_image_url" && value_user != "") tw_text = "<img src='"+value_user+"' align='left'> "+tw_text;
												});
											}
										});
										var timestamp = Date.parse(tw_created)/1000;
										var timesince = $.fn.timesince(tw_created);
										tweetArray[count] = {text:tw_text, handler:tw_handler, timesince:timesince, timestamp:timestamp};
										count++;
									});
								});
							}
							tweetArray.sortOn("timestamp");
							$.fn.printout(tweetArray, "tw");
						}
					});
				}
			}
		});
    }

	$.fn.convertLink = function(value) {
	    var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig
	    return value.replace(regex, "<a href='$1' target='_blank'>$1</a>");
	}

	$.fn.printout = function(data, type) {
		$.each(data, function(index, value) {
			var social_link;
			if(type == "tw") {
				social_link = "<a href='http://www.twitter.com/"+value['handler']+"' target='_blank'>@"+value['handler']+"</a>";
			}
			$(thisForm).append("<div id='khysocial-container'><div id='khysocial-text' style='font-size:"+fontsize+"px'>"+value['text']+"</div><div id='khysocial-created'>"+social_link+" "+value['timesince']+"<img src='img/"+type+"_logo.png' width='15'></div></div>");
		});
	}

	$.fn.timesince = function(date_str) {
	    if (!date_str) { return; }
	    date_str = $.trim(date_str);
	    date_str = date_str.replace(/\.\d\d\d+/,"");
	    date_str = date_str.replace(/-/,"/").replace(/-/,"/");
	    date_str = date_str.replace(/T/," ").replace(/Z/," UTC");
	    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2");
	    var parsed_date = new Date(date_str);
	    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
	    delta = (delta < 2) ? 2 : delta;
	    var r = '';
	    if (delta < 60) {
	    	r = delta + ' seconds ago';
	    } 
	    else if(delta < 120) {
	    	r = 'a minute ago';
	    } 
	    else if(delta < (45*60)) {
	    	r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
	    } 
	    else if(delta < (2*60*60)) {
    		r = 'an hour ago';
	    } 
	    else if(delta < (24*60*60)) {
	    	r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
	    } 
	    else if(delta < (48*60*60)) {
	    	r = 'a day ago';
	    } 
	    else {
	    	r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
	    }
	    return 'posted ' + r;
	}

	Array.prototype.sortOn = function(key) {
	    this.sort(function(a, b) {
	        if(a[key] > b[key]) {
	            return -1;
	        }
	        else if(a[key] < b[key]) {
	            return 1;
	        }
	        return 0;
	    });
	}
}(jQuery));