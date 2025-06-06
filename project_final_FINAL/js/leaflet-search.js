/* 
 * Leaflet Control Search v2.7.0 - 2016-09-13 
 * 
 * Copyright 2016 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * http://labs.easyblog.it/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demo: 
 * http://labs.easyblog.it/maps/leaflet-search/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-search.git 
 * 
 */
! function(a) {
   if ("function" == typeof define && define.amd) define(["leaflet"], a);
   else if ("undefined" != typeof module) module.exports = a(require("leaflet"));
   else {
      if ("undefined" == typeof window.L) throw "Leaflet must be loaded first";
      a(window.L)
   }
}(function(a) {
   function b(a, b) {
      var c = b.split("."),
         d = c.pop(),
         e = c.length,
         f = c[0],
         g = 1;
      if (e > 0)
         for (;
            (a = a[f]) && e > g;) f = c[g++];
      return a ? a[d] : void 0
   }

   function c(a) {
      return "[object Object]" === Object.prototype.toString.call(a)
   }
   return a.Control.Search = a.Control.extend({
      includes: a.Mixin.Events,
      options: {
         url: "",
         layer: null,
         sourceData: null,
         jsonpParam: null,
         propertyLoc: "loc",
         propertyName: "title",
         formatData: null,
         filterData: null,
         moveToLocation: null,
         buildTip: null,
         container: "",
         zoom: null,
         minLength: 1,
         initial: !0,
         casesensitive: !1,
         autoType: !0,
         delayType: 400,
         tooltipLimit: -1,
         tipAutoSubmit: !0,
         firstTipSubmit: !1,
         autoResize: !0,
         collapsed: !0,
         autoCollapse: !1,
         autoCollapseTime: 1200,
         textErr: "Location not found",
         textCancel: "Cancel",
         textPlaceholder: "Search",
         position: "topleft",
         hideMarkerOnCollapse: !1,
         marker: {
            icon: !1,
            animate: !0,
            circle: {
               radius: 10,
               weight: 3,
               color: "#e03",
               stroke: !0,
               fill: !1
            }
         }
      },
      initialize: function(b) {
         a.Util.setOptions(this, b || {}), this._inputMinSize = this.options.textPlaceholder ? this.options.textPlaceholder.length : 10, this._layer = this.options.layer || new a.LayerGroup, this._filterData = this.options.filterData || this._defaultFilterData, this._formatData = this.options.formatData || this._defaultFormatData, this._moveToLocation = this.options.moveToLocation || this._defaultMoveToLocation, this._autoTypeTmp = this.options.autoType, this._countertips = 0, this._recordsCache = {}, this._curReq = null
      },
      onAdd: function(b) {
         return this._map = b, this._container = a.DomUtil.create("div", "leaflet-control-search"), this._input = this._createInput(this.options.textPlaceholder, "search-input"), this._tooltip = this._createTooltip("search-tooltip"), this._cancel = this._createCancel(this.options.textCancel, "search-cancel"), this._button = this._createButton(this.options.textPlaceholder, "search-button"), this._alert = this._createAlert("search-alert"), this.options.collapsed === !1 && this.expand(this.options.collapsed), this.options.marker && (this.options.marker instanceof a.Marker || this.options.marker instanceof a.CircleMarker ? this._markerSearch = this.options.marker : c(this.options.marker) && (this._markerSearch = new a.Control.Search.Marker([0, 0], this.options.marker)), this._markerSearch._isMarkerSearch = !0), this.setLayer(this._layer), b.on({
            resize: this._handleAutoresize
         }, this), this._container
      },
      addTo: function(b) {
         return this.options.container ? (this._container = this.onAdd(b), this._wrapper = a.DomUtil.get(this.options.container), this._wrapper.style.position = "relative", this._wrapper.appendChild(this._container)) : a.Control.prototype.addTo.call(this, b), this
      },
      onRemove: function(a) {
         this._recordsCache = {}
      },
      setLayer: function(a) {
         return this._layer = a, this._layer.addTo(this._map), this
      },
      showAlert: function(a) {
         a = a || this.options.textErr, this._alert.style.display = "block", this._alert.innerHTML = a, clearTimeout(this.timerAlert);
         var b = this;
         return this.timerAlert = setTimeout(function() {
            b.hideAlert()
         }, this.options.autoCollapseTime), this
      },
      hideAlert: function() {
         return this._alert.style.display = "none", this
      },
      cancel: function() {
         return this._input.value = "", this._handleKeypress({
            keyCode: 8
         }), this._input.size = this._inputMinSize, this._input.focus(), this._cancel.style.display = "none", this._hideTooltip(), this
      },
      expand: function(b) {
         return b = "boolean" == typeof b ? b : !0, this._input.style.display = "block", a.DomUtil.addClass(this._container, "search-exp"), b !== !1 && (this._input.focus(), this._map.on("dragstart click", this.collapse, this)), this.fire("search:expanded"), this
      },
      collapse: function() {
         return this._hideTooltip(), this.cancel(), this._alert.style.display = "none", this._input.blur(), this.options.collapsed && (this._input.style.display = "none", this._cancel.style.display = "none", a.DomUtil.removeClass(this._container, "search-exp"), this.options.hideMarkerOnCollapse && this._map.removeLayer(this._markerSearch), this._map.off("dragstart click", this.collapse, this)), this.fire("search:collapsed"), this
      },
      collapseDelayed: function() {
         if (!this.options.autoCollapse) return this;
         var a = this;
         return clearTimeout(this.timerCollapse), this.timerCollapse = setTimeout(function() {
            a.collapse()
         }, this.options.autoCollapseTime), this
      },
      collapseDelayedStop: function() {
         return clearTimeout(this.timerCollapse), this
      },
      _createAlert: function(b) {
         var c = a.DomUtil.create("div", b, this._container);
         return c.style.display = "none", a.DomEvent.on(c, "click", a.DomEvent.stop, this).on(c, "click", this.hideAlert, this), c
      },
      _createInput: function(b, c) {
         var d = a.DomUtil.create("label", c, this._container),
            e = a.DomUtil.create("input", c, this._container);
         return e.type = "text", e.size = this._inputMinSize, e.value = "", e.autocomplete = "off", e.autocorrect = "off", e.autocapitalize = "off", e.placeholder = b, e.style.display = "none", e.role = "search", e.id = e.role + e.type + e.size, d.htmlFor = e.id, d.style.display = "none", d.value = b, a.DomEvent.disableClickPropagation(e).on(e, "keydown", this._handleKeypress, this).on(e, "blur", this.collapseDelayed, this).on(e, "focus", this.collapseDelayedStop, this), e
      },
      _createCancel: function(b, c) {
         var d = a.DomUtil.create("a", c, this._container);
         return d.href = "#", d.title = b, d.style.display = "none", d.innerHTML = "<span>&otimes;</span>", a.DomEvent.on(d, "click", a.DomEvent.stop, this).on(d, "click", this.cancel, this), d
      },
      _createButton: function(b, c) {
         var d = a.DomUtil.create("a", c, this._container);
         return d.href = "#", d.title = b, a.DomEvent.on(d, "click", a.DomEvent.stop, this).on(d, "click", this._handleSubmit, this).on(d, "focus", this.collapseDelayedStop, this).on(d, "blur", this.collapseDelayed, this), d
      },
      _createTooltip: function(b) {
         var c = a.DomUtil.create("ul", b, this._container);
         c.style.display = "none";
         var d = this;
         return a.DomEvent.disableClickPropagation(c).on(c, "blur", this.collapseDelayed, this).on(c, "mousewheel", function(b) {
            d.collapseDelayedStop(), a.DomEvent.stopPropagation(b)
         }, this).on(c, "mouseover", function(a) {
            d.collapseDelayedStop()
         }, this), c
      },
      _createTip: function(b, c) {
         var d;
         if (this.options.buildTip) {
            if (d = this.options.buildTip.call(this, b, c), "string" == typeof d) {
               var e = a.DomUtil.create("div");
               e.innerHTML = d, d = e.firstChild
            }
         } else d = a.DomUtil.create("li", ""), d.innerHTML = b;
         return a.DomUtil.addClass(d, "search-tip"), d._text = b, this.options.tipAutoSubmit && a.DomEvent.disableClickPropagation(d).on(d, "click", a.DomEvent.stop, this).on(d, "click", function(a) {
            this._input.value = b, this._handleAutoresize(), this._input.focus(), this._hideTooltip(), this._handleSubmit()
         }, this), d
      },
      _getUrl: function(a) {
         return "function" == typeof this.options.url ? this.options.url(a) : this.options.url
      },
      _defaultFilterData: function(a, b) {
         var c, d, e, f = {};
         if (a = a.replace(/[.*+?^${}()|[\]\\]/g, ""), "" === a) return [];
         c = this.options.initial ? "^" : "", d = this.options.casesensitive ? void 0 : "i", e = new RegExp(c + a, d);
         for (var g in b) e.test(g) && (f[g] = b[g]);
         return f
      },
      showTooltip: function(a) {
         var b;
         this._countertips = 0, this._tooltip.innerHTML = "", this._tooltip.currentSelection = -1;
         for (var c in a) {
            if (++this._countertips == this.options.tooltipLimit) break;
            b = this._createTip(c, a[c]), this._tooltip.appendChild(b)
         }
         return this._countertips > 0 ? (this._tooltip.style.display = "block", this._autoTypeTmp && this._autoType(), this._autoTypeTmp = this.options.autoType) : this._hideTooltip(), this._tooltip.scrollTop = 0, this._countertips
      },
      _hideTooltip: function() {
         return this._tooltip.style.display = "none", this._tooltip.innerHTML = "", 0
      },
      _defaultFormatData: function(c) {
         var d, e = this.options.propertyName,
            f = this.options.propertyLoc,
            g = {};
         if (a.Util.isArray(f))
            for (d in c) g[b(c[d], e)] = a.latLng(c[d][f[0]], c[d][f[1]]);
         else
            for (d in c) g[b(c[d], e)] = a.latLng(b(c[d], f));
         return g
      },
      _recordsFromJsonp: function(b, c) {
         a.Control.Search.callJsonp = c;
         var d = a.DomUtil.create("script", "leaflet-search-jsonp", document.getElementsByTagName("body")[0]),
            e = a.Util.template(this._getUrl(b) + "&" + this.options.jsonpParam + "=L.Control.Search.callJsonp", {
               s: b
            });
         return d.type = "text/javascript", d.src = e, {
            abort: function() {
               d.parentNode.removeChild(d)
            }
         }
      },
      _recordsFromAjax: function(b, c) {
         void 0 === window.XMLHttpRequest && (window.XMLHttpRequest = function() {
            try {
               return new ActiveXObject("Microsoft.XMLHTTP.6.0")
            } catch (a) {
               try {
                  return new ActiveXObject("Microsoft.XMLHTTP.3.0")
               } catch (b) {
                  throw new Error("XMLHttpRequest is not supported")
               }
            }
         });
         var d = a.Browser.ie && !window.atob && document.querySelector,
            e = d ? new XDomainRequest : new XMLHttpRequest,
            f = a.Util.template(this._getUrl(b), {
               s: b
            });
         e.open("GET", f);
         return e.onload = function() {
            c(JSON.parse(e.responseText))
         }, e.onreadystatechange = function() {
            4 === e.readyState && 200 === e.status && this.onload()
         }, e.send(), e
      },
      _recordsFromLayer: function() {
         var c, d = {},
            e = this.options.propertyName;
         return this._layer.eachLayer(function(f) {
            if (!f.hasOwnProperty("_isMarkerSearch"))
               if (f instanceof a.Marker || f instanceof a.CircleMarker) try {
                  if (b(f.options, e)) c = f.getLatLng(), c.layer = f, d[b(f.options, e)] = c;
                  else {
                     if (!b(f.feature.properties, e)) throw new Error("propertyName '" + e + "' not found in marker");
                     c = f.getLatLng(), c.layer = f, d[b(f.feature.properties, e)] = c
                  }
               } catch (g) {
                  console
               } else if (f.hasOwnProperty("feature")) try {
                  if (!f.feature.properties.hasOwnProperty(e)) throw new Error("propertyName '" + e + "' not found in feature");
                  c = f.getBounds().getCenter(), c.layer = f, d[f.feature.properties[e]] = c
               } catch (g) {
                  console
               } else f instanceof a.LayerGroup && f.eachLayer(function(a) {
                  c = a.getLatLng(), c.layer = a, d[a.feature.properties[e]] = c
               })
         }, this), d
      },
      _autoType: function() {
         var a = this._input.value.length,
            b = this._tooltip.firstChild._text,
            c = b.length;
         if (0 === b.indexOf(this._input.value))
            if (this._input.value = b, this._handleAutoresize(), this._input.createTextRange) {
               var d = this._input.createTextRange();
               d.collapse(!0), d.moveStart("character", a), d.moveEnd("character", c), d.select()
            } else this._input.setSelectionRange ? this._input.setSelectionRange(a, c) : this._input.selectionStart && (this._input.selectionStart = a, this._input.selectionEnd = c)
      },
      _hideAutoType: function() {
         var a;
         if ((a = this._input.selection) && a.empty) a.empty();
         else if (this._input.createTextRange) {
            a = this._input.createTextRange(), a.collapse(!0);
            var b = this._input.value.length;
            a.moveStart("character", b), a.moveEnd("character", b), a.select()
         } else this._input.getSelection && this._input.getSelection().removeAllRanges(), this._input.selectionStart = this._input.selectionEnd
      },
      _handleKeypress: function(a) {
         switch (a.keyCode) {
            case 27:
               this.collapse();
               break;
            case 13:
               (1 == this._countertips || this.options.firstTipSubmit && this._countertips > 0) && this._handleArrowSelect(1), this._handleSubmit();
               break;
            case 38:
               this._handleArrowSelect(-1);
               break;
            case 40:
               this._handleArrowSelect(1);
               break;
            case 8:
            case 45:
            case 46:
               this._autoTypeTmp = !1;
               break;
            case 37:
            case 39:
            case 16:
            case 17:
            case 35:
            case 36:
               break;
            default:
               if (this._input.value.length ? this._cancel.style.display = "block" : this._cancel.style.display = "none", this._input.value.length >= this.options.minLength) {
                  var b = this;
                  clearTimeout(this.timerKeypress), this.timerKeypress = setTimeout(function() {
                     b._fillRecordsCache()
                  }, this.options.delayType)
               } else this._hideTooltip()
         }
         this._handleAutoresize()
      },
      searchText: function(b) {
         var c = b.charCodeAt(b.length);
         this._input.value = b, this._input.style.display = "block", a.DomUtil.addClass(this._container, "search-exp"), this._autoTypeTmp = !1, this._handleKeypress({
            keyCode: c
         })
      },
      _fillRecordsCache: function() {
         var b, c = this._input.value,
            d = this;
         this._curReq && this._curReq.abort && this._curReq.abort(), a.DomUtil.addClass(this._container, "search-load"), this.options.layer ? (this._recordsCache = this._recordsFromLayer(), b = this._filterData(this._input.value, this._recordsCache), this.showTooltip(b), a.DomUtil.removeClass(this._container, "search-load")) : (this.options.sourceData ? this._retrieveData = this.options.sourceData : this.options.url && (this._retrieveData = this.options.jsonpParam ? this._recordsFromJsonp : this._recordsFromAjax), this._curReq = this._retrieveData.call(this, c, function(c) {
            d._recordsCache = d._formatData(c), b = d.options.sourceData ? d._filterData(d._input.value, d._recordsCache) : d._recordsCache, d.showTooltip(b), a.DomUtil.removeClass(d._container, "search-load")
         }))
      },
      _handleAutoresize: function() {
         this._input.style.maxWidth != this._map._container.offsetWidth && (this._input.style.maxWidth = a.DomUtil.getStyle(this._map._container, "width")), this.options.autoResize && this._container.offsetWidth + 45 < this._map._container.offsetWidth && (this._input.size = this._input.value.length < this._inputMinSize ? this._inputMinSize : this._input.value.length)
      },
      _handleArrowSelect: function(b) {
         var c = this._tooltip.hasChildNodes() ? this._tooltip.childNodes : [];
         for (i = 0; i < c.length; i++) a.DomUtil.removeClass(c[i], "search-tip-select");
         if (1 == b && this._tooltip.currentSelection >= c.length - 1) a.DomUtil.addClass(c[this._tooltip.currentSelection], "search-tip-select");
         else if (-1 == b && this._tooltip.currentSelection <= 0) this._tooltip.currentSelection = -1;
         else if ("none" != this._tooltip.style.display) {
            this._tooltip.currentSelection += b, a.DomUtil.addClass(c[this._tooltip.currentSelection], "search-tip-select"), this._input.value = c[this._tooltip.currentSelection]._text;
            var d = c[this._tooltip.currentSelection].offsetTop;
            d + c[this._tooltip.currentSelection].clientHeight >= this._tooltip.scrollTop + this._tooltip.clientHeight ? this._tooltip.scrollTop = d - this._tooltip.clientHeight + c[this._tooltip.currentSelection].clientHeight : d <= this._tooltip.scrollTop && (this._tooltip.scrollTop = d)
         }
      },
      _handleSubmit: function() {
         if (this._hideAutoType(), this.hideAlert(), this._hideTooltip(), "none" == this._input.style.display) this.expand();
         else if ("" === this._input.value) this.collapse();
         else {
            var a = this._getLocation(this._input.value);
            a === !1 ? this.showAlert() : (this.showLocation(a, this._input.value), this.fire("search:locationfound", {
               latlng: a,
               text: this._input.value,
               layer: a.layer ? a.layer : null
            }))
         }
      },
      _getLocation: function(a) {
         return this._recordsCache.hasOwnProperty(a) ? this._recordsCache[a] : !1
      },
      _defaultMoveToLocation: function(a, b, c) {
         this.options.zoom ? this._map.setView(a, this.options.zoom) : this._map.panTo(a)
      },
      showLocation: function(a, b) {
         var c = this;
         return c._map.once("moveend zoomend", function(b) {
            c._markerSearch && c._markerSearch.addTo(c._map).setLatLng(a)
         }), c._moveToLocation(a, b, c._map), c.options.autoCollapse && c.collapse(), c
      }
   }), a.Control.Search.Marker = a.Marker.extend({
      includes: a.Mixin.Events,
      options: {
         icon: new a.Icon.Default,
         animate: !0,
         circle: {
            radius: 10,
            weight: 3,
            color: "#e03",
            stroke: !0,
            fill: !1
         }
      },
      initialize: function(b, d) {
         a.setOptions(this, d), d.icon === !0 && (d.icon = new a.Icon.Default), a.Marker.prototype.initialize.call(this, b, d), c(this.options.circle) && (this._circleLoc = new a.CircleMarker(b, this.options.circle))
      },
      onAdd: function(b) {
         a.Marker.prototype.onAdd.call(this, b), this._circleLoc && (b.addLayer(this._circleLoc), this.options.animate && this.animate())
      },
      onRemove: function(b) {
         a.Marker.prototype.onRemove.call(this, b), this._circleLoc && b.removeLayer(this._circleLoc)
      },
      setLatLng: function(b) {
         return a.Marker.prototype.setLatLng.call(this, b), this._circleLoc && this._circleLoc.setLatLng(b), this
      },
      _initIcon: function() {
         this.options.icon && a.Marker.prototype._initIcon.call(this)
      },
      _removeIcon: function() {
         this.options.icon && a.Marker.prototype._removeIcon.call(this)
      },
      animate: function() {
         if (this._circleLoc) {
            var a = this._circleLoc,
               b = 200,
               c = 5,
               d = parseInt(a._radius / c),
               e = this.options.circle.radius,
               f = 2 * a._radius,
               g = 0;
            a._timerAnimLoc = setInterval(function() {
               g += .5, d += g, f -= d, a.setRadius(f), e > f && (clearInterval(a._timerAnimLoc), a.setRadius(e))
            }, b)
         }
         return this
      }
   }), a.Map.addInitHook(function() {
      this.options.searchControl && (this.searchControl = a.control.search(this.options.searchControl), this.addControl(this.searchControl))
   }), a.control.search = function(b) {
      return new a.Control.Search(b)
   }, a.Control.Search
});