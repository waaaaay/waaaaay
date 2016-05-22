$(function(){
  domain ="teamhouchimin.tumblr.com";
  api_key ="6WlH7w1wEFG5BP1KyQjLaAYdTkEc04JKSJ4Hp5jDL45FOlJUll";
  $.getJSON(
    "http://api.tumblr.com/v2/blog/"+domain+"/posts?api_key="+api_key+"&limit=8&type=text&reblog_info=false&notes_info=false&jsonp=?",
    function(data){
      $("#loading").hide();
      if( data['meta']['status']!=200){
        return; // 取得失敗
      }

      $.each(data['response']['posts'],function(index){
        var newHtml = (index == 0) ? '<div class="news-new"></div>' : '';
        var formattedDate = new Date(this.date)
        var html =  '<a href="' + this.post_url + '">' +
                      newHtml +
                      '<li>' +
                      '<span>' + this.date.split(' ')[0].split('-').join('/') + '</span><br>' +
                      this.title +
                      '</li>' +
                    '</a>';
        $("#mobile-news").append($(html));
      });
    }
  );
});
