<template>
  <div>
    <div id="container" style="width:100%;height:450px;"></div>
  </div>
</template>

<script>
import { GMap, TMap } from './index';

export default {
  props: {
    lat: {
      type: Number,
      default: 28.6139
    },
    lon: {
      type: Number,
      default: 77.2090
    },
    mapKey: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: '新德里'
    },
    mapType: {
      type: String,
      default: 'google' // 默认使用 Google Maps
    }
  },
  data() {
    return {
      geocoder: null,
      map: null,
      marker: null,
      google: null
    };
  },
  watch: {
    address(newAddress) {
      // 当地址变化时触发搜索
      this.searchKeyword(newAddress);
    }
  },
  created() {
    this.initMap();
  },
  methods: {
    async initMap() {
      try {

        if (this.mapType === 'google') {
          // 加载 Google Maps
          const google = await GMap(this.mapKey);
          this.google = google;
          this.initializeGoogleMap(google);
        } else {
          // 加载腾讯地图
          const qq = await TMap(this.mapKey);
          this.initializeTMap(qq);
        }
      } catch (error) {
        console.error('地图加载失败:', error);
      }
    },

    initializeGoogleMap(google) {
      const center = new google.maps.LatLng(this.lat, this.lon);
      this.map = new google.maps.Map(document.getElementById('container'), {
        center,
        zoom: 15
      });

      this.geocoder = new google.maps.Geocoder();

      // 设置初始位置标记
      this.setMarker(google, center);
    },

    initializeTMap(qq) {
      const center = new qq.maps.LatLng(this.lat, this.lon);
      this.map = new qq.maps.Map(document.getElementById('container'), {
        center,
        zoom: 15
      });

      this.geocoder = new qq.maps.Geocoder({
        complete: (result) => {
          this.updateMapLocation(result.detail.location);
        }
      });

      // 获取初始地址
      this.geocoder.getAddress(center);

      // 点击地图时更新位置
      qq.maps.event.addListener(this.map, 'click', (event) => {
        const newLocation = event.latLng;
        this.geocoder.getAddress(new qq.maps.LatLng(newLocation.getLat(), newLocation.getLng()));
      });
    },

    setMarker(google, location) {
      if (this.marker) {
        this.marker.setMap(null);
      }
      this.marker = new google.maps.Marker({
        map: this.map,
        position: location,
        title: this.$t('当前地点')
      });
    },

    searchKeyword(address = this.address) {
      if (!address) return;

      if (this.mapType === 'google') {
        this.searchGoogle(address);
      } else {
        this.searchTMap(address);
      }
    },

    searchGoogle(address) {
      const that = this;
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          this.map.setCenter(location);
          this.setMarker(that.google, location);
          this.$emit('getCoordinates', {
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error('Geocode failed:', status);
        }
      });
    },

    searchTMap(address) {
      this.geocoder.getLocation(address, (result) => {
        if (result && result.detail) {
          this.updateMapLocation(result.detail.location);
        } else {
          console.error('腾讯地图地址解析失败');
        }
      });
    },

    updateMapLocation(location) {
      this.map.setCenter(location);
      if (this.marker) {
        this.marker.setMap(null);
      }
      this.marker = new qq.maps.Marker({
        map: this.map,
        position: location
      });

      this.$emit('getCoordinates', {
        lat: location.lat,
        lng: location.lng
      });
    }
  }
};
</script>

<style scoped>
</style>
