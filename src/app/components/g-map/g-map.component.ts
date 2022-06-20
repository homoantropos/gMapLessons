import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';


export interface Place {
  /** Place Name */
  placeName: string;
  /** place image URL */
  placePhoto: any;
}

@Component({
  selector: 'app-g-map',
  templateUrl: './g-map.component.html',
  styleUrls: ['./g-map.component.css']
})
export class GMapComponent implements OnInit, AfterViewInit {

  place = '';
  addressForm: FormGroup;
  lat = 40.7127753;
  lng = -74.0059728;

  // @ts-ignore
  @ViewChild('map') map: ElementRef<HTMLElement>;
  // @ts-ignore
  @ViewChild('country') country: ElementRef<HTMLInputElement>;

  neighbourhoodPlaces: Array<Place> = [];

  constructor(
    private _fb: FormBuilder
  ) {
    this.addressForm = this._fb.group({
      country: [''],
      town: [''],
      street: ['']
    });
    this.neighbourhoodPlaces = new Array<Place>();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {

  }
  
  initMap(): void {
    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: 48.85357121166921, lng: 2.3477230074288866 },
        zoom: 13,
        mapTypeControl: false,
      }
    );
    const card = document.getElementById('pac-card') as HTMLElement;

    const input = document.getElementById('pac-input') as HTMLInputElement;

    const options = {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false,
      types: ['address'],
    };

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

    const autocomplete = new google.maps.places.Autocomplete(input, options);
    const serv = new google.maps.places.AutocompleteService();

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      'infowindow-content'
    ) as HTMLElement;

    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No details available for input: \'\' + place.name + ');
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent =
        place.formatted_address;
      infowindow.open(map, marker);
    });
  }

  onSubmit(): void {

  }
}
