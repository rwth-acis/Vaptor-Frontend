var map;
//var marker;

function initialize() {
    
    var myLatLng = new google.maps.LatLng( 0,0 ),
        myOptions = {
            zoom: 4,
            center: myLatLng,
			disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            },
        map = new google.maps.Map( document.getElementById( 'map-canvas' ), myOptions ),
        marker = new google.maps.Marker( {position: myLatLng, map: map} );
    
    marker.setMap( map );
    //moveMarker( map, marker );
    
}

function moveMarker( map, marker) {
    
    //delayed so you can see it move
    setTimeout( function(){ 
    
        marker.setPosition( new google.maps.LatLng( 0, 0 ) );
        map.panTo( new google.maps.LatLng( 0, 0 ) );
        
    }, 1500 );

};

google.maps.event.addDomListener(window, "load", initialize);

