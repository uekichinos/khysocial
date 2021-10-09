(function ($) {
  $.fn.tussocial = function (options) {
    var settings = $.extend(
      {
        fontsize: 14,
        boxwidth: 200,
        debug: false,
        imgthumb: "left",
      },
      options
    );
    return this.each(function () {
      window.thisForm = this;
      window.fontsize = settings.fontsize;
      window.boxwidth = settings.boxwidth;
      window.debug = settings.debug;
      window.imgthumb = settings.imgthumb;

      var postsArray = [];
      var count = 0;

      if (settings.social.twitter != "" && typeof settings.social.twitter !== "undefined") {

        if (window.debug === true) console.log("[twitter] on");

        var twitter_set = settings.social.twitter;
        var twlimit = twitter_set.limit;
        var twquery = twitter_set.query;

        if (typeof twlimit === "undefined" || twlimit == "" || twlimit == 0) twlimit = 5;

        if (twquery == "") {
          if (window.debug === true) console.log("[twitter] query empty");
          return false;
        } 
        else {
          var querytype;
          var querystr = twquery;

          if (querystr.indexOf("@") != -1) {
            querytype = "handler";
            querystr = querystr.replace(/@/g, "");
          } 
          else querytype = "hashtag";

          $.ajax({
            method: "POST",
            url: "plugin/tw/index.php",
            dataType: "json",
            async: false,
            data: {
              limit: twlimit,
              qtype: querytype,
              qstr: querystr,
            },
            success: function (msg) {
              if (querytype == "hashtag") msg[0] = msg.statuses;

              $.each(msg, function (key, data) {
                if (querytype == "hashtag" && key != "statuses") return;

                $.each(data, function (key2, data2) {
                  var tw_text, tw_source, tw_created, tw_handler;
                  if (querytype == "hashtag" && typeof key2 !== "number") return;

                  $.each(data2, function (index, value) {
                    if (settings.debug == true) console.log("[twitter] " + count + ") " + index + " : " + value);
                    if (index == "text") tw_text = $.fn.convertLink(value);
                    else if (index == "source") tw_source = value;
                    else if (index == "created_at") tw_created = value;
                    if (index == "user") {
                      $.each(value, function (index_user, value_user) {
                        if (settings.debug == true) console.log("- " + index_user + " : " + value_user);
                        if (index_user == "screen_name") tw_handler = value_user;
                        if (index_user == "profile_image_url" && value_user != "") tw_text = "<img src='" + value_user + "' align='" + window.imgthumb + "'> " + tw_text;
                      });
                    }
                  });

                  var timestamp = Date.parse(tw_created) / 1000;
                  var timesince = $.fn.timesince(tw_created);
                  postsArray[count] = {
                    text: tw_text,
                    handler: tw_handler,
                    timesince: timesince,
                    timestamp: timestamp,
                    social: "tw",
                  };

                  count++;
                });
              });
            },
          });
        }
      }

      // if (settings.social.facebook != "" && typeof settings.social.facebook !== "undefined") {
      //   if (window.debug === true) console.log("[facebook] on");

      //   var facebook_set = settings.social.facebook;
      //   var appid = facebook_set.appid;
      //   var appsecret = facebook_set.appsecret;
      //   var limit = facebook_set.limit;
      //   var query = facebook_set.query;

      //   if (typeof limit === "undefined" || limit == "" || limit == 0) limit = 5;

      //   if (typeof appid === "undefined") {
      //     if (window.debug === true) console.log("[facebook] missing app id");
      //     return false;
      //   } 
      //   else if (appid == "") {
      //     if (window.debug === true) console.log("[facebook] app id empty");
      //     return false;
      //   } 
      //   else if (typeof appsecret === "undefined") {
      //     if (window.debug === true) console.log("[facebook] missing app secret");
      //     return false;
      //   } 
      //   else if (appsecret == "") {
      //     if (window.debug === true) console.log("[facebook] app secret empty");
      //     return false;
      //   } 
      //   else if (typeof query === "undefined") {
      //     if (window.debug === true) console.log("[facebook] missing query");
      //     return false;
      //   } 
      //   else if (query == "") {
      //     if (window.debug === true) console.log("[facebook] query empty");
      //     return false;
      //   } 
      //   else {
      //     $.ajax({
      //       method: "POST",
      //       url: "plugin/fb/index.php",
      //       dataType: "json",
      //       async: false,
      //       data: {
      //         appid: appid,
      //         appsecret: appsecret,
      //         limit: limit,
      //         query: query,
      //       },
      //       success: function (msg) {

      //         $.each(msg, function (key, data) {
      //           var fb_text, fb_created, fb_handler;

      //           $.each(data, function (index, value) {
      //             if (settings.debug == true) console.log("[facebook] " + count + ") " + index + " : " + value);
      //             if (index == "message") fb_text = $.fn.convertLink(value);
      //             else if (index == "created_time") fb_created = value;
      //             else if (index == "handler") fb_handler = value;
      //             else if (index == "picture") fb_text = "<img src='" + value + "' align='" + window.imgthumb + "'>" + fb_text;
      //           });

      //           var timestamp = Date.parse(fb_created) / 1000;
      //           var timesince = $.fn.timesince(fb_created);
      //           postsArray[count] = {
      //             text: fb_text,
      //             handler: fb_handler,
      //             timesince: timesince,
      //             timestamp: timestamp,
      //             social: "fb",
      //           };
      //           count++;
      //         });
      //       },
      //     });
      //   }
      // }

      postsArray.sortOn("timestamp");
      $.fn.printout(postsArray);
    });
  };

  $.fn.convertLink = function (value) {
    var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/gi;
    return value.replace(regex, "<a href='$1' target='_blank'>$1</a>");
  };

  $.fn.printout = function (data) {
    $.each(data, function (index, value) {
      var social_link;
      if (value["social"] == "tw") social_link = "<a href='http://www.twitter.com/" + value["handler"] + "' target='_blank'>@" + value["handler"] + "</a>";
      // else if (value["social"] == "fb") social_link = "<a href='http://www.facebook.com/" + value["handler"] + "' target='_blank'>" + value["handler"] + "</a>";

      $(thisForm).append(
        "<div id='tussocial-container' style='width:" + boxwidth + ";'><div id='tussocial-text' style='font-size:" + fontsize + "px;'>" + value["text"] + "</div><div id='tussocial-created'>" + social_link + " " + value["timesince"] + "<img src='img/" + value["social"] + "_logo.png' width='15'></div></div>"
      );
    });
  };

  $.fn.timesince = function (date_str) {
    if (!date_str) return;

    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/, "");
    date_str = date_str.replace(/-/, "/").replace(/-/, "/");
    date_str = date_str.replace(/T/, " ").replace(/Z/, " UTC");
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2");

    var parsed_date = new Date(date_str);
    var relative_to = arguments.length > 1 ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    delta = delta < 2 ? 2 : delta;
    var r = "";

    if (delta < 60) r = delta + " seconds ago";
    else if (delta < 120) r = "a minute ago";
    else if (delta < 45 * 60) r = parseInt(delta / 60, 10).toString() + " minutes ago";
    else if (delta < 2 * 60 * 60) r = "an hour ago";
    else if (delta < 24 * 60 * 60) r = "" + parseInt(delta / 3600, 10).toString() + " hours ago";
    else if (delta < 48 * 60 * 60) r = "a day ago";
    else r = parseInt(delta / 86400, 10).toString() + " days ago";

    return "posted " + r;
  };

  Array.prototype.sortOn = function (key) {
    this.sort(function (a, b) {
      if (a[key] > b[key]) return -1;
      else if (a[key] < b[key]) return 1;
      return 0;
    });
  };
})(jQuery);
