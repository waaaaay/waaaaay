var DEFAULT_LAT = 35.68184;
var DEFAULT_LNG = 139.767008;
var mapLocation;
var address;
var map;
var stations = [];
var dragedMapAfterSearching = false;

$(function() {
  if (!window.console) {
    window.console = {
      log: function(msg) {} // IEで止まるの防止
    };
  }
  initMap();
});

function initMap() {
  mapLocation = new google.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);
  var mapOptions = {
    center            : mapLocation,
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
  map = new google.maps.Map($('#map-canvas')[0], mapOptions);

  google.maps.event.addListener(map, "dragend", function() {
    mapLocation = map.getCenter();
    dragedMapAfterSearching = true;
  });

  $('#location-input').on('keyup', function(event){
    if (isEnterKey(event)) textSearch();
  });
  $('#location-search').on('click', function(){
    dragedMapAfterSearching = false;
    textSearch();
  });
  $('#submit').on('click', function(){
    if(dragedMapAfterSearching || address == undefined) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'latLng': mapLocation}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            address = results[0].formatted_address;
            address = address.replace('日本, ', '');
            nearbySearch();
          }
        } else {
          alert('位置情報の取得に失敗しました');
        }
      });
    } else {
      nearbySearch();
    }
  });
}

function textSearch() {
  console.log('text search');
  address = $('#location-input').val().replace(' ', '+').replace('　', '+');

  var textService = new google.maps.places.PlacesService(map);
  var textRequest = {
    location: new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()),
    radius: '50000',
    query: address
  };
  textService.textSearch(textRequest, textCallback);
}

function nearbySearch() {
  console.log('nearby search');
    var nearbyService = new google.maps.places.PlacesService(map);
    var nearbyRequest = {
      location: mapLocation,
      radius: '1000',
      types: ['train_station', 'subway_station'],
      language: 'ja',
      rankby: 'distance',
    };
    nearbyService.nearbySearch(nearbyRequest, nearbyCallback);
}

function stationsToString() {
  if (stations.length == 0) return "";
  result = "";
  stations.forEach(function(station){
    result += station.name + " 約" + station.time + '分 (' + Math.ceil(station.distance / 10)*10 +'m)\n'
  });
  return result;
}

function isEnterKey(keyEvent) {
  return ((keyEvent && keyEvent.which === 13) || (keyEvent && keyEvent.keyCode == 13));
}

function textCallback(results, status) {
  if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
    updateMapLocation(results[0].geometry.location);
  } else {
    alert('位置情報の取得に失敗しました');
  }
}

function updateMapLocation(loc) {
  map.setZoom(17);
  map.setCenter(loc);
  mapLocation = loc
}

function nearbyCallback(results, status){
  if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
    places = [];
    stations = [];
    results.forEach(function(result){
      var loc = result.geometry.location;
      var distance = google.maps.geometry.spherical.computeDistanceBetween(mapLocation, loc);
      if (distance < 1500) { // 遠いものは省く
        var time = Math.round(distance / 60);
        places.push({name: result.name, distance:distance, time: time});
      }
    });

    // 昇順ソート
    places.sort(function(a, b) {
      return (a.distance < b.distance) ? -1 : 1;
    });
    for(var i = 0; i < places.length && i < 5; i++) {
      stations.push(places[i]);
    }
    updateScript();
  } else {
//    alert('位置情報の取得に失敗しました');
  }
}

function updateScript() {
  var wayUrl = 'http://navi.waaaaay.com/search?lat=' + mapLocation.lat() + '&lng=' + mapLocation.lng();
  var gmapUrl = 'https://www.google.co.jp/maps/search/' + encodeURIComponent(address) + '/@' + mapLocation.lat() + ',' + mapLocation.lng() + 'z';

  $('#share').val(
      '住所：' + address + '\n\n' +
      '最寄り駅：\n' +
      stationsToString() + '\n' +
      '距離と方向だけのナビ：\n' +
      wayUrl + '&destination=' + encodeURIComponent(address) + '\n\n' +
      'Google Maps：\n' +
      gmapUrl
      );
  $('#html').val('htmlいれる/iframeでも');
  $('#qrcode').empty().qrcode(wayUrl);

  /*
  // 短縮
  gapi.client.setApiKey('AIzaSyCF7RrCyxSB5KZ1Q7eeBHq7yBTPioYnfCU');
  gapi.client.load("urlshortener", "v1", function(){
    var request = gapi.client.urlshortener.url.insert({
      resource: {'longUrl': gmapUrl}
    });
    request.execute(function(response){
      if ('id' in response) {
        gmapUrl = response.id;
        $('#share').val(
          '住所：' + address + '\n\n' +
          '最寄り駅：\n' +
          stationsToString() + '\n' +
          '距離と方向だけのナビ：\n' +
          wayUrl + '\n\n' +
          'Google Maps：\n' +
          gmapUrl
          );
      }
    });
  });
  */
}

