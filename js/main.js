var global = {};

var resizeWindowFunction = function(){
  if(document.body.clientWidth > 800){
    if($('.global-nav').hasClass('nav-hide')){ // Back to the inline view
      $(".global-nav").animate({left: 0}, 0);
      $('.filter').fadeOut(0); // hide filter
      $('.global-nav').addClass('nav-hide'); // Add hide nav info
      $('body').removeClass('bodyfix'); // Enable scroll on body
    }
    $('nav').removeClass('hamburger'); // Remove condensed nav info
  }else{
    if(!$('nav').hasClass('hamburger')){ // Back to the Hamburger view
      $(".global-nav").animate({left: -400}, 0);
      $('.filter').fadeOut(0); // hide filter
      $('.global-nav').addClass('nav-hide'); // Add hide nav info
      $('body').removeClass('bodyfix'); // Enable scroll on body
      $('nav').addClass('hamburger'); // Add condensed nav info
    }
  }
}
resizeWindowFunction();

function getCookie(cname){
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while(c.charAt(0) == ' '){
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
////////////////////////////////////////////////////////////////////
///////////////////////// RELEASES REQUEST /////////////////////////
////////////////////////////////////////////////////////////////////
function getLastReleaseTag(callBack){
  var lastRelease = getCookie("lastRelease");
  if(lastRelease == ""){
    console.log("Using GitHub request to define last release tag");
    $.ajax({
      url : "https://api.github.com/repos/clementgre/PDF4Teachers/releases/latest",
      dataType : 'json',

      success : function(json, status){
        var d = new Date();
        d.setTime(d.getTime() + (10*60*1000)); // Cookie expire in 10 Minutes
        document.cookie = "lastRelease=" + json.tag_name + "; expires=" + d.toUTCString() + "; sameSite=Strict; path=/";
        callBack(json.tag_name);
      }
    }).fail(function fail(){
      callBack("");
    });
  }else{
    console.log("Using cookie to define last release tag");
    callBack(lastRelease);
  }
}
function updateReleaseLinks(lastTag){
  $('a.replace-lastrelease').each(function(index){
    var newUrl = replaceAll($(this).attr("href"), '<lastRelease>', lastTag);
    $(this).attr("href", newUrl);
  });
}

function getReleasesTags(lastReleaseTag, callBack){
  var releasesTags = getCookie("releasesTags");
  if(releasesTags != ""){
    if(releasesTags.split(",")[0] === lastReleaseTag || releasesTags.split(",")[1] === lastReleaseTag || releasesTags.split(",")[2] === lastReleaseTag){
      console.log("Using cookie to define releases tags");
      callBack(releasesTags.split(","));
      return;
    }
  }
  console.log("Using GitHub request to define releases tags");
  $.ajax({
    url : "https://api.github.com/repos/clementgre/PDF4Teachers/tags",
    dataType : 'json',

    success : function(json, status){

      var tags = [];
      for(var tag in json){ tags.push(json[tag].name); }

      var d = new Date();
      d.setTime(d.getTime() + (24*60*60*1000)); // Cookie expire in 1 Day
      document.cookie = "releasesTags=" + tags.join(",") + "; expires=" + d.toUTCString() + "; sameSite=Strict; path=/";
      callBack(tags);
    }
  }).fail(function fail(){
    callBack([]);
  });
}
async function loadDownloadPage(lastTag, toOpenTag, tags){
  for(var i = 0 ; i < tags.length ; i++){
    
    await $.ajax({
      url : "../php/releasePanel.php",
      type : "POST",
      data : "tag=" + tags[i],
      dataType : 'html',
  
      success : function(html, status){
        var tag = tags[i];
        $('main').append(html);
        $('main a.replace-lastrelease').each(function(index){
          var newUrl = replaceAll($(this).attr("href"), '<lastRelease>', tag);
          $(this).attr("href", newUrl);
        });

        $(document).on('touchstart click', '.release-' + replaceAll(tag, '.', '-') + ' i.fas', function(e){
          if($(this).hasClass('animate')) return;
          
          if($(this).hasClass('fa-chevron-down')){
            $(this).addClass('animate');

            if($('.release-' + replaceAll(tag, '.', '-') + ' .content').length){
              $('.release-' + replaceAll(tag, '.', '-') + ' .content').slideDown(function complete(){
                $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').removeClass('animate');
                $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').removeClass('fa-chevron-down');
                $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').addClass('fa-chevron-up');
              });
            }else{
              getDownloadPageContents(tag, function callBack(html){
                $('.release-' + replaceAll(tag, '.', '-')).append(html);
                $('.release-' + replaceAll(tag, '.', '-') + ' .content').fadeOut(0);
                $('.release-' + replaceAll(tag, '.', '-') + ' .content').slideDown(function complete(){
                  $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').removeClass('animate');
                  $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').removeClass('fa-chevron-down');
                  $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').addClass('fa-chevron-up');
                });
              });
            }
          }else if($(this).hasClass('fa-chevron-up')){
            $(this).addClass('animate');
            $('.release-' + replaceAll(tag, '.', '-') + ' .content').slideUp(function complete(){
              $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').removeClass('animate');
              $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').removeClass('fa-chevron-up');
              $('.release-' + replaceAll(tag, '.', '-') + ' i.fas').addClass('fa-chevron-down');
            });
          }
        });
      }
    });
  }
  console.log($('.release-' + replaceAll(toOpenTag, '.', '-')).offset().top);
  
  $('html').scrollTop($('.release-' + replaceAll(toOpenTag, '.', '-')).offset().top - 200);
  $('.release-' + replaceAll(toOpenTag, '.', '-') + ' i.fas').trigger("click");
  
}
function replaceAll(text, pattern, replacement){
  var newText = text.replace(pattern, replacement);
  if(newText !== text){
    return replaceAll(newText, pattern, replacement);
  }
  return newText;
}
function getDownloadPageContents(tag, callBack){

  $.ajax({
    url : "https://api.github.com/repos/clementgre/PDF4Teachers/releases/tags/" + tag,
    dataType : 'json',

    success : function(json, status){

      var list = false;
      var description = '';
      for(var line of json.body.split('\r\n')){
        if(line.startsWith("- ")){
          if(!list){
            list = true;
            description += "<ul>";
          }
          description += '<li>' + line.replace('- ', '') + '</li>';
        }else{
          if(list){
            list = false;
            description += "</ul>";
          }

          if(line.startsWith("##")){
            description += '<h2>' + line.replace('##', '') + '</h2>';
          }else if(line === ""){
            description += '<br/>';
          }else{
            description += '<p>' + line + '</p>';
          }
        }
      }
      if(list) description += "</ul>";

      var downloads = '<div class="downloads"><div class="title"><h2>Assets</h2><p class="date">' + json.published_at.split('T')[0].replace('-', ' ').replace('-', '/') + '</p></div><br/>';
      for(var asset of json.assets){
        downloads += '<div class="asset"><a href="' + asset.browser_download_url + '">' + asset.name + '</a><p>' + asset.download_count + ' downloads</p></div>';
      }
      downloads += '<div class="asset"><a href="https://github.com/ClementGre/PDF4Teachers/archive/' + tag + '.zip">Source code (zip)</a></div>';
      downloads += '<div class="asset"><a href="https://github.com/ClementGre/PDF4Teachers/archive/' + tag + '.tar.gz">Source code (tar.gz)</a></div>';
      downloads += '</div>';

      callBack('<div class="content">' + description + '<br/>' + downloads + '</div>');
    }
  }).fail(function fail(){
    callBack("");
  });
}
function getData(data, key){
  var value = data.split(key + "=");
  if(value.length >= 2){
    return value[1].split('&')[0];
  }
  return '';
}

var readyFunction = function(){

  var pageName = document.location.href.split('/').reverse()[1];
  var data = document.location.href.split('?').length >= 2 ? document.location.href.split('?')[1] : "";
  
////////////////////////////////////////////////////////////////////
///////////////////////// NAV //////////////////////////////////////
////////////////////////////////////////////////////////////////////

///////////////// OUVERTURE /////////////////
	$(document).on('touchstart click', '.menu-link', function(e){
    e.preventDefault();

		if($('.global-nav').hasClass('nav-hide')){
      $('nav').fadeIn(0);
      $(".global-nav").animate({left: 0}, 500);
      $('.filter').fadeIn(500); // Show filter
      $('body').addClass('bodyfix'); // Disable scroll on body
			setTimeout(function(){
				$('.global-nav').removeClass('nav-hide'); // Remove hide nav info
			}, 500);
		}

	});

///////////////// FERMETURE /////////////////
	$(document).on('touchstart click', 'div.filter', function(e){
    e.preventDefault();

		if(!$('.global-nav').hasClass('nav-hide')){
      $('.global-nav').addClass('nav-hide'); // Add hide nav info
      $(".global-nav").animate({left: -400}, 500);
      $('.filter').fadeOut(500); // Hide filter
      $('body').removeClass('bodyfix'); // Enable scroll on body
		}
	});

///////////////// REDIMENTIONEMENT /////////////////

	$(window).resize(function(){
		resizeWindowFunction();
	});

////////////////////////////////////////////////////////////////////
///////////////////////// Releases /////////////////////////////////
////////////////////////////////////////////////////////////////////


  global.lastReleaseTag = "";
  global.tags = "";

  // GET LAST RELEASE TAG
  getLastReleaseTag(function callBack(tag){
    console.log("detected last release tag = " + tag);
    global.lastReleaseTag = tag;

    // CHANGE LINKS
    updateReleaseLinks(tag);

    // DOWNLOAD PAGE
    if(pageName === "Download"){
      getReleasesTags(tag, function callBack(tags){
        global.tags = tags;
        console.log("detected releases tags = " + tags);
        loadDownloadPage(tag, (getData(data, "v") === "" ? tag : getData(data, "v")), tags);
      })
    }
  });

////////////////////////////////////////////////////////////////////
///////////////////////// Language /////////////////////////////////
////////////////////////////////////////////////////////////////////

  $(document).on("touchstart click", "a.language-link", function(e){
      e.preventDefault();
      document.cookie = "language=" + $(this).attr('href') + "; sameSite=Strict; path=/";

        $.ajax({
          url : document.location.href + "/index.php",
          type : 'POST',
          dataType : 'html',

          success : function(html, status){
            document.body.innerHTML = html;
            resizeWindowFunction();

            // CHANGE LINKS
            updateReleaseLinks(global.lastReleaseTag);

            // DOWNLOAD PAGE
            if(pageName === "Download"){
              getReleasesTags(global.lastReleaseTag, function callBack(tags){
                loadDownloadPage(global.lastReleaseTag, (getData(data, "v") === "" ? global.lastReleaseTag : getData(data, "v")), global.tags);
              })
            }

          }
        });
    });
}
$(document).ready(readyFunction);
