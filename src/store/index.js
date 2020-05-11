import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  isLoading:false,
	  noRefreshOrInfinite: true,
	  showTooltips:false,
	  tipsText: null,
	  timer: null,
	  // showCardTooltips: false,
	  tooltipVal: null,
	  metro: true,
	  token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3N1ZXIiOiJBY2NvdW50cyBKV1QgSXNzdWVyIDAuMSIsInBhcnRuZXJpZCI6IjAwMDAwMiIsImFwcGlkIjoiMjAxODExMjAwMDAwMDIwMSIsInN1YiI6IjA5ZDUyMWFmLTE4ZDItNDJmMi04NWExLTdmNzQ5ZWU3NmFkMCIsImV4cCI6MTU4ODkxNjcwOX0.oukfuVIyiyi35zPt02KCscETvsOkfs7Vc2R54vNNE2g',
	  //eyJhbGciOiJIUzI1NiJ9.eyJpc3N1ZXIiOiJBY2NvdW50cyBKV1QgSXNzdWVyIDAuMSIsInBhcnRuZXJpZCI6IjAwMDAwMiIsImFwcGlkIjoiMjAxODExMjAwMDAwMDIwMSIsInN1YiI6IjA5ZDUyMWFmLTE4ZDItNDJmMi04NWExLTdmNzQ5ZWU3NmFkMCIsImV4cCI6MTU4ODkxNjcwOX0.oukfuVIyiyi35zPt02KCscETvsOkfs7Vc2R54vNNE2g
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
