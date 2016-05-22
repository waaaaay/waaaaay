var GenerateScript = GenerateScript || {};

var destination = "";
var DEFAULT_LAT = 35.68184;
var DEFAULT_LNG = 139.767008;
var lat = DEFAULT_LAT;
var lng = DEFAULT_LNG;
var icon = "navi1";
var NAVI1_SIZE = "width=82 height=20";
var NAVI2_SIZE = "width=36 height=60";
var size = NAVI1_SIZE;

(function(GenerateScript) {
  var G = GenerateScript;

  G.map = {
    map: undefined,
    init: function() {
      this.initMap();
    },
    initMap: function(){
      var self = this;
      var mapOptions = {
        center            : new google.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        zoom              : 15,
        mapTypeId         : google.maps.MapTypeId.ROADMAP,
        mapTypeControl    : false,
        streetViewControl : false,
        zoomControl       : true,
        zoomControlOptions: {
          position : google.maps.ControlPosition.LEFT_CENTER,
          style    : google.maps.ZoomControlStyle.LARGE
        }
      };
      var map = new google.maps.Map($('#map-canvas')[0], mapOptions);
      this.map = map;

      google.maps.event.addListener(map, "drag", function() {
        lat = map.getCenter().lat();
        lng = map.getCenter().lng();
        self.updateScript();
      });

      $('input[name="icon"]:radio').change( function() {
        icon = $(this).val();
        if (icon === "navi1") {
          size = NAVI1_SIZE;
        } else {
          size = NAVI2_SIZE;
        }
        self.updateScript();
      });
      $('#location-input').on('keyup', function(event){
        $('#destination').val($('#location-input').val().replace(' ', '').replace('　', ''));
        if (self.isEnterKey(event)) self.getGeocoder();
      });
      $('#location-search').on('click', function(){
        $('#destination').val($('#location-input').val().replace(' ', '').replace('　', ''));
        self.getGeocoder();
      });
      $('#destination').on('keyup', function(event){
        self.updateScript();
      });
      $('#url').on('keyup', function(event){
        self.updateScript();
      });
      self.updateScript();
    },

    getGeocoder: function(){
      console.log('get geocoder');
      var service = new google.maps.places.PlacesService(this.map),
          address = $('#location-input').val().replace(' ', '+').replace('　', '+'),
          self = this;
      service.textSearch({
        location: new google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng()),
        radius: '50000',
        query: address
      }, function(results, status){
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var loc = results[0].geometry.location
          self.updateMapLocation(loc);
          lat = loc.lat(); lng = loc.lng();
          self.updateScript();
        } else {
          alert('位置情報の取得に失敗しました');
        }
      });
    },

    updateMapLocation: function(latlng) {
      this.map.setZoom(17);
      this.map.setCenter(latlng);
    },

    updateScript: function() {
      destination = $('#destination').val();
      url         = $('#url').val();
//      $('#script').val('<a href="http://navi.waaaaay.com/search?lat=' + lat + '&lng=' + lng + '&destination=' + destination + '"><img src="http://waaaaay.com/images/' + icon + '.png" width=82 height=20></a>');
      $('#script').val('<a href="http://navi.waaaaay.com/search?lat=' + lat + '&lng=' + lng + '&destination=' + destination + '&url=' + url + '"><img src="http://waaaaay.com/images/' + icon + '.png" ' + size + '></a>');
      if (destination) {
        $('#share').val('「' + destination + '」へナビ開始！ http://navi.waaaaay.com/search?lat=' + lat + '&lng=' + lng + '&destination=' + encodeURIComponent(destination) + '&url=' + url);
      } else {
        $('#share').val('距離と方向だけのナビ開始！ http://navi.waaaaay.com/search?lat=' + lat + '&lng=' + lng + '&url=' + url);
      }
    },

    isEnterKey: function(keyEvent) {
      return ((keyEvent && keyEvent.which === 13) || (keyEvent && keyEvent.keyCode == 13));
    },
  };

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      this.updateMapLocation(results[0].geometry.location);
    }
  }


})(GenerateScript);

$(function() {
  if (!window.console) {
    window.console = {
      log: function(msg) {} // IEで止まるの防止
    };
  }

  GenerateScript.map.init();
});

