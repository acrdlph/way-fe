import React from 'react';
import fetch from 'isomorphic-fetch';
import Infobox from '../components/infobox';
import { getAuthHeaders } from './headers';
import { trackEvent, events } from './google-analytics';

const locationInput = 'signup-location-input';
let circle = false;
let autocompleteApi = false;
let thePlace = {};

function setPlace(placeId, lng, lat) {
  thePlace = {
    airport: placeId,
    geolocation: {
      longitude: lng,
      latitude: lat,
    },
  };
  return thePlace;
}

export function geocodeLocation(geolocation) {
  return new Promise((resolve, reject) => {
    const request = {
      location: geolocation,
      radius: '500',
      // type: ['point_of_interest', 'airport', 'hospital', '']
    };
    const service = new google.maps.places.PlacesService(document.getElementById(locationInput));
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (results[0]) {
          resolve(results[0]);
        } else {
          reject();
        }
      } else {
        reject(status);
      }
    });
  });
}

export function getGeolocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {});
  });
}

async function save(body, thePlace) {
  const endpoint = 'api/users';
  const res = await fetch(endpoint, {
    method: 'post',
    body,
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });
  const resJson = await res.json();
  // this.setState({
  //   airport: resJson.location
  // });
  sessionStorage.setItem('userId', resJson.id);
  sessionStorage.setItem('token', resJson.token);
  return resJson;
}

export async function update(body, accUserId) {
  const userId = sessionStorage.getItem('userId');
  const endpoint = `api/users/${accUserId}` || `${userId}?waiting_started=true`;
  const headers = getAuthHeaders();
  headers.append('content-type', 'application/json');
  const res = await fetch(endpoint, {
    method: 'put',
    body,
    headers,
  });
  const resJson = await res.json();
  return resJson;
}

export function setLocationInputValue(value) {
  // this primitive trick helps to avoid problems with react and google maps
  // getting in the way of eachother
  document.getElementById(locationInput).value = value;
}

export async function buildLocation(showSearchBox) {
  const challengeLocation = sessionStorage.getItem('challengeLocation');
  if (challengeLocation) {
    try {
      thePlace = setPlace(challengeLocation, 0, 0);
      setLocationInputValue(challengeLocation);
    } catch (error) {
      showSearchBox();
    }
  } else if (navigator.geolocation) {
    try {
      const location = await getGeolocation();
      const geolocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      circle = new google.maps.Circle({
        center: geolocation,
        radius: location.coords.accuracy,
      });
      if (autocompleteApi) {
        autocompleteApi.setBounds(circle.getBounds());
      }
      console.log('ego re vlaka', geolocation);
      const res = await geocodeLocation(geolocation);
      thePlace = setPlace(res.place_id, geolocation.lng, geolocation.lat);
      setLocationInputValue(res.name);
    } catch (error) {
      console.log(error);
      showSearchBox();
    }
  }
  return thePlace;
}

export function changeGeolocation() {
  const place = autocompleteApi.getPlace();
  thePlace = setPlace(place.place_id, place.geometry.location.lng(), place.geometry.location.lat());
  trackEvent(events.USER_SELECTED_LOCATION, { label: place.place_id });
  return thePlace;
}

function initAutoComplete() {
  autocompleteApi = new google.maps.places.Autocomplete(document.getElementById(locationInput));
  autocompleteApi.addListener('place_changed', changeGeolocation);
}

function clearLocation() {
  setLocationInputValue('');
  if (autocompleteApi && circle) {
    autocompleteApi.setBounds(circle.getBounds());
  }
}

export async function saveAndContinue(
  showLocationRequired,
  showSearchBox,
  history,
  toggleDiv,
  calledFrom,
) {
  thePlace = await buildLocation(showSearchBox);
  if (!thePlace.airport) {
    showLocationRequired();
    return;
  }
  const body = JSON.stringify({
    location: thePlace.airport,
    geolocation: thePlace.geolocation,
    address: window.web3 ? window.web3.eth.accounts[0] : null,
  });
  let json = {};
  const accUserId = sessionStorage.getItem('userId');
  if (accUserId) {
    toggleDiv();
    if (calledFrom === 'login') {
      json = await update(body, accUserId);
    } else {
      json = await save(body, thePlace);
    }
  }
  const locationId = json.location.toLowerCase();
  sessionStorage.setItem('locationId', locationId);
  history.push(`/waitlist/${locationId}`);
}

export function renderLocationInput(isSearchBoxVisible, showLocationRequiredHint) {
  return (
    <div style={{ paddingBottom: '15px', display: isSearchBoxVisible ? 'block' : 'none' }}>
      <Infobox
        visible={showLocationRequiredHint}
        text="Please enter your location to join the list - we are starting in Berlin."
      />
      <input
        onFocus={clearLocation}
        className="signup-location-input-style"
        id={locationInput}
        type="text"
        placeholder="Enter location"
      />
      {initAutoComplete()}
    </div>
  );
}
