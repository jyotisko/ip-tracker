const searchBtn = document.querySelector('.search-btn');
const resultContainer = document.querySelector('.results__container');
const ip = document.querySelector('.ip-result');
const place = document.querySelector('.location-result');
const timezone = document.querySelector('.timezone-result');
const isp = document.querySelector('.isp-result');

class App {
  #zoomLevel = 9;
  #map;

  constructor() {
    this._getUserLocation();
    this.#map = '';

    searchBtn.addEventListener('click', this._getIP.bind(this))
  }

  _getUserLocation() {
    navigator.geolocation.getCurrentPosition(this._setUserCoordsAndLoadMap.bind(this), function () {
      alert('Unable to fetch your location :(');
    })
  }

  _setUserCoordsAndLoadMap(position) {
    const coords = [position.coords.latitude, position.coords.longitude];
    this._loadMap(coords)
  }

  _loadMap(coords) {
    this.#map = L.map('map', { zoomControl: false });
    this.#map.setView(coords, this.#zoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
  }

  _getIP() {
    const searchIP = document.querySelector('.input-ip').value;
    if (!searchIP) return;
    this._getResults(searchIP);
  }

  _getResults(ip) {
    const url = `https://geo.ipify.org/api/v1?apiKey=at_nxHr0KNoUrmKCGxJNBmNEvYSVQ8f9&ipAddress=${ip}`;
    fetch(url)
      .then(response => {
        if (!response.ok) return alert('Please enter a valid ipv4 or ipv6 address');
        return response.json();
      })
      .then(data => {
        const info = {
          isp: data.isp,
          ip: data.ip,
          city: data.location.city,
          country: data.location.country,
          postalCode: data.location.postalCode,
          timezone: data.location.timezone,
        }
        this._setData(info);
        const coords = [data.location.lat, data.location.lng];
        const myIcon = L.icon({
          iconUrl: './images/icon-location.svg',
          iconSize: [40, 60],
        });
        L.marker(coords, { icon: myIcon }).addTo(this.#map);
        this.#map.setView(coords, this.#zoomLevel);
      })
  }

  _setData(data) {
    ip.textContent = data.ip;
    place.textContent = `${data.city}, ${data.country} ${data.postalCode}`;
    timezone.textContent = data.timezone;
    isp.textContent = data.isp;
    resultContainer.style.display = 'grid';
  }
}

const app = new App();
