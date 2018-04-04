"use strict";

(function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
    	define(['leaflet'], factory);

    // define a Common JS module that relies on 'leaflet'
} else if (typeof exports === 'object') {
	module.exports = factory(require('leaflet'));
}

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
    	window.L.YourPlugin = factory(L);
    }
}(function (L) {

	L.speechBubble = function(options,latlng) {
		if(options) {
			return new L.SpeechBubble(options,latlng);
		} else {
			return new L.SpeechBubble(null,latlng);
		}
	};
	L.SpeechBubble = L.DivOverlay.extend({
		includes: L.Mixin.Events,
		options:{
			width: null,
			height: null,
			top: null,
			left: null,
			strenth: null,
			base: null,
			angle:0,
			background: "#FFF",
			borderThick: 2,
			borderColor: "#000",
			borderRadius: 10
		},
		_toLatLng:function(a, b, c) {
			if (a instanceof L.LatLng) {
				return a;
			}
			if (L.Util.isArray(a) && typeof a[0] !== 'object') {
				if (a.length === 3) {
					return new L.LatLng(a[0], a[1], a[2]);
				}
				if (a.length === 2) {
					return new L.LatLng(a[0], a[1]);
				}
				return null;
			}
			if (a === undefined || a === null) {
				return a;
			}
			if (typeof a === 'object' && 'lat' in a) {
				return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
			}
			if (typeof a === 'object' && 'getLatLng' in a) {
				return a.getLatLng();
			}
			if (b === undefined) {
				return null;
			}
			return new L.LatLng(a, b, c);
		},
		initialize: function (options,source) {
			if(options) {
				L.setOptions(this, options);
			}
			this._source = source;
			this.turn=0;
			this._div = L.DomUtil.create('div','leaflet-speechbubble',this._container);
			this._curs = L.DomUtil.create('div','leaflet-speechbubble-curs',this._div);
			this._anchor = L.DomUtil.create('div','leaflet-speechbubble-anchor',this._container);
			this._arrow = L.DomUtil.create('div','leaflet-speechbubble-arrow',this._curs);
			this._arrow_back = L.DomUtil.create('div','leaflet-speechbubble-arrow-back',this._arrow);
			this._divcontent = L.DomUtil.create('div','leaflet-speechbubble-content',this._div);

			this._latlng = this._toLatLng(source);
			if(this.options.class){
				this.setClassName(this.options.class);
			}

		},


		className: 'leaflet-speechbubble',
		setClassName: function(newClassName) {
			if(newClassName && typeof newClassName === 'string') {
				this.className = newClassName;
				this._div.className = this.className;
			}
		},
		addClass: function(newClassName) {
			if(newClassName && typeof newClassName === 'string') {
				this._div.classList.add(newClassName);

			}
		},
		removeClass: function(classToRemove) {
			if(classToRemove && typeof classToRemove === 'string' && this._div.classList.contains(classToRemove)) {
				this._div.classList.remove(classToRemove);

			}
		},
		_setDefaultDim: function(){
			var center_x=this._container.clientWidth/2;
			var center_y=this._container.clientHeight/2;
			if(!this.options.height)
			{
				this.options.height=this._container.clientHeight*2/4; 
			}
			if(!this.options.width)
			{
				this.options.width=this._container.clientWidth*2/4; 
			}
			if(!this.options.strenth)
			{
				var deltaY=this._container.clientHeight-this.options.height
				var deltaX=this._container.clientWidth-this.options.width
				this.options.strenth=Math.min(deltaX,deltaY)/2;
				this.options.base=this.options.strenth/20*3;
			}


			
			if(!this.options.top)
			{
				this.options.top=center_y-this.options.height/2;
			}
			if(!this.options.left)
			{
				this.options.left=center_x-this.options.width/2;
			}

		},
		_update_autoplacement: function (){

			var center=this._map.getCenter();
			var dx=this._latlng.lng-center.lng;
			var dy=this._latlng.lat-center.lat;
			this.options.angle=Math.atan2(dy,dx) * 180.0 / Math.PI;
			var rad=this._deg2rad(this.options.angle%360 );
			var hypotenus_total=this._getLineLengthInRect(this.options.angle,this._container.clientWidth,this._container.clientHeight);
			var border={
				x:(Math.cos(-rad)*(hypotenus_total))+(this._container.clientWidth/2),
				y:(Math.sin(-rad)*(hypotenus_total))+(this._container.clientHeight/2)
				
			}
			var _anchor_arrow={
				x: border.x-  (Math.cos(rad)*(this.options.strenth/2)) ,
				y: border.y + (Math.sin(rad)*(this.options.strenth/2)) ,
			};

			var delta=this._getLineLengthInRect(this.options.angle,this.options.width,this.options.height);
			
			
			this._anchor_center={
				x: _anchor_arrow.x-  (Math.cos(rad)*delta) ,
				y: _anchor_arrow.y + (Math.sin(rad)*delta) ,
			};
				
				
			
			this.options.top=this._anchor_center.y-(this.options.height/2);
			this.options.left=this._anchor_center.x-(this.options.width/2);
			this._div.style.top=this.options.top+"px";
			this._div.style.left=this.options.left+"px";
			return;
			if(this.options.autoPlacement)
			{
				
				var center_x=this._container.clientWidth/2;
				var center_y=this._container.clientHeight/2;
				var alpha_trigger=Math.atan2(this._container.clientHeight,this._container.clientWidth) * 180.0 / Math.PI;
				var phase=(this.options.angle+360)%360;
				//console.log("_update_autoplacement",phase,alpha_trigger)
				switch(true)
				{
					case phase >=-phase <(alpha_trigger+270) && phase <alpha_trigger:
					this.options.top=center_y-this.options.height/2;
					this.options.left=center_x-(this.options.width/2) +(this.options.strenth/2); 
					//console.log("Est")

					break;
					case phase >=alpha_trigger && phase <(alpha_trigger+90):
					this.options.top=center_y-this.options.height/2-(this.options.strenth/2);
					this.options.left=center_x-(this.options.width/2) ; 
					//console.log("Nord")
					break;
					case phase >=phase <(alpha_trigger+90) && phase  <(alpha_trigger+180):
					this.options.top=center_y-this.options.height/2;
					this.options.left=center_x-(this.options.width/2) -(this.options.strenth/2); 
					//console.log("Ouest")
					break;
					case phase >=phase <(alpha_trigger+180) && phase  <(alpha_trigger+270):
					this.options.top= this._container.clientHeight -this.options.height-(this.options.strenth/2);
					this.options.left=center_x-(this.options.width/2) ; 
					//console.log("Sud")
					break;
				}
			}
			this._div.style.top=this.options.top+"px";
			this._div.style.left=this.options.left+"px";
		},
		_update_cursor: function(){
			var center=this._map.getCenter();
			if(this._anchor_center){
				var  _anchor_center_point = L.point(this._anchor_center.x, this._anchor_center.y);
				center=this._map.containerPointToLatLng(_anchor_center_point);
			}
			var dx=this._latlng.lng-center.lng;
			var dy=this._latlng.lat-center.lat;
			this.options.angle=Math.atan2(dy,dx) * 180.0 / Math.PI;
			var hypotenus=this._getLineLengthInRect(this.options.angle,this.options.width,this.options.height);

			var rad=this._deg2rad(this.options.angle%360 );
			var x=(Math.cos(-rad)*(hypotenus))+(this.options.width/2);
			var y=(Math.sin(-rad)*(hypotenus))+(this.options.height/2)
			var point = L.point(x+this.options.left, y+this.options.top);
			this._offsetCenter=this._map.containerPointToLatLng(point);

			this._curs.style.position="absolute";
			this._curs.style.top=y +"px";
			this._curs.style.left=x + "px";


		},
		_update_arrow: function() {
			var dx=this._latlng.lng-this._offsetCenter.lng;
			var dy=this._latlng.lat-this._offsetCenter.lat;
			this.options.angle=Math.atan2(dy,dx) * 180.0 / Math.PI;

			if((this.options.angle%360) - this.options.lastAngle > 180		)
				this.turn--;
			if( this.options.lastAngle - (this.options.angle%360) > 180		)
				this.turn++;


			this.options.lastAngle=this.options.angle;
			this.options.angle=(this.turn*360)+this.options.angle;
			this._curs.style.transform= "rotate("+(this.options.angle*-1)+"deg) ";
		},
		
		update: function(){
			if (!this._map) { return; }

			//console.log("speechbubble update")
			this._setDefaultDim();

			this._divcontent.innerHTML=this._content;

			this._update_autoplacement();
			this._update_cursor();
			this._update_arrow();

			if(!this._firstUpdate)
			{

				
				
				
				
				
				
    
				this._div.style.height=this.options.height+"px";
				this._div.style.background=this.options.borderColor;
				this._div.style.width=this.options.width+"px";
				this._div.style.zIndex=10000;
				this._div.style.borderRadius=this.options.borderRadius+"px";
				this._div.style.position="absolute";
				this._arrow.style.position="absolute";
				this._arrow.style.border= this.options.base+"px solid transparent"
				this._arrow.style.borderRight= "none";
				this._arrow.style.borderLeft= (this.options.strenth)+"px solid "+this.options.borderColor;
				this._arrow.style.transform= "translate(-"+(this.options.base*3)+"px,-50%)";
				this._arrow.style.borderBottomLeftRadius=this.options.base+"px";
				this._arrow.style.borderTopLeftRadius=this.options.base+"px";


				this._arrow_back.style.position="absolute";
				this._arrow_back.style.border= this.options.base+"px solid transparent";
				this._arrow_back.style.borderRight= "none";
				this._arrow_back.style.borderLeft= (this.options.strenth)+"px solid "+this.options.background;
				var offset=(this.options.borderThick*5);
				this._arrow_back.style.transform= "translate("+(-(this.options.strenth)-offset)+"px,-"+this.options.base+"px)";
				this._arrow_back.style.borderBottomLeftRadius=this.options.base+"px";
				this._arrow_back.style.borderTopLeftRadius=this.options.base+"px";

				this._divcontent.style.position="absolute";
				this._divcontent.style.top=this.options.borderThick+"px";
				this._divcontent.style.left=this.options.borderThick+"px";
				this._divcontent.style.right=this.options.borderThick+"px";
				this._divcontent.style.bottom=this.options.borderThick+"px";
				this._divcontent.style.background=this.options.background;
				this._divcontent.style.borderRadius=(this.options.borderRadius-this.options.borderThick)+"px";
				this._firstUpdate=true;
			}













		//this._arrow.style.transformOrigin= "translate(-50%,-50%)";
		

	},
	remove: function(keepMapInteractionsOff) {
		this.onRemove(this._map, keepMapInteractionsOff);
		return this;
	},

	onAdd: function (map) {
		this._map = map;
		this._container=map.getContainer();
		map.getContainer().appendChild(this._div);	
		
		
		
		
		map._speechbubble = this;
			if(this._speechbubble && typeof(this._speechbubble.update))
		{
		map.on("move ",this._speechbubble.update);
			
		}
		
		if(typeof(map._speechbubble.update)=="function")
				map._speechbubble.update();
		
	},
	addTo: function (map) {
		this.onAdd(map);
		return this;
	},
	onRemove: function (map, keepMapInteractionsOff) {
		if(this.timer) clearInterval(this.timer);
		map.getContainer().removeChild(this._div);
		

		
		
		this._map = null;
	},
	_animateZoom: function(e){
			//console.log("_animateZoom");
	},
	_adjustPan: function(e){
			//console.log("_adjustPan");

	},
	getEvents: function () {
			return {};
	},
	
	_setStrenth: function(strenth)
	{
		this.options.strenth=strenth;
		this.update();
	},
	_setAngle: function(deg)
	{
		this.options.deg=deg;
		this.update();
	},
	_deg2rad: function(deg){
		var rad=deg*2.0*Math.PI/360.0;
		return rad;
	},
	_rad2deg: function(rad){
		var deg=rad*180/Math.PI;
		
		return deg
	},
	_getLineLengthInRect: function(deg,width,height)
	{
		deg=deg%360;
		var rad=Math.abs(this._deg2rad(deg));
		var max_width=width/2;
		var max_height=height/2;
		var deg_trigger=Math.atan(max_height/max_width);
		if((rad>=deg_trigger && rad <= (Math.PI -deg_trigger) )|| rad>=(Math.PI+deg_trigger)  &&  rad <= ((2*Math.PI) -deg_trigger))
		{
			var width=Math.abs(max_height/Math.sin(rad));

		}
		else{
			var width=Math.abs(max_width/Math.cos(rad));
		}
		return width;
	}
})

L.Layer.include({
	bindSpeechBubble: function (content, options) {
		//console.log("bindSpeechBubble")

		if (content instanceof L.SpeechBubble) {
			setOptions(content, options);
			this._speechbubble = content;
			content._source = this;
		} else {
			if (!this._speechbubble || options) {
				this._speechbubble = new L.SpeechBubble(options, this);
			}
			this._speechbubble.setContent(content);
		}
		

		return this;
	},

	speechBubbleMove: function (e) {
		//console.log("speechBubbleMove")
		if(typeof(e.pinch)!="undefined" && e.pinch===true)
			return e;
		if (this._speechbubble)
		{
			var bound=this._speechbubble._map.getBounds()
			if (bound.contains(this._speechbubble.getLatLng()))
			{
				this._speechbubble._map.closeSpeechBubble();
			}
			else
			{
					this._speechbubble.update();
			}
		}
	},
	unbindSpeechBubble: function () {
		//console.log("unbindSpeechBubble")
		if (this._speechbubble) {
			this.off({
				//zoom: this._speechbubble.update,
				move: this._speechbubble.update
			});
			this._speechbubbleHandlersAdded = false;
			this._speechbubble = null;
		}
		return this;
	},
	openSpeechBubble: function (layer, latlng) {
		//console.log("openSpeechBubble")
		if (!(layer instanceof L.Layer)) {
			latlng = layer;
			layer = this;
		}

		if (layer instanceof L.FeatureGroup) {
			for (var id in this._layers) {
				layer = this._layers[id];
				break;
			}
		}

		if (!latlng) {
			latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
		}

		if (this._speechbubble && this._map) {
			// set popup source to this layer
			this._speechbubble._source = layer;

			// update the popup (content, layout, ect...)
			this._speechbubble.update();

			// open the popup on the map
			this._map.openSpeechBubble(this._speechbubble, latlng);
			if (!this._speechbubbleHandlersAdded) {
			this._map.on({
				
				zoom: this.speechBubbleMove,
				move: this.speechBubbleMove
			});
			this._speechbubbleHandlersAdded = true;
		}
		}

		return this;
	}
	
})

L.Map.include({
	// @method openPopup(popup: Popup): this
	// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
	// @alternative
	// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
	// Creates a popup with the specified content and options and opens it in the given point on a map.
	openSpeechBubble: function (speechbubble, latlng, options) {
		//console.log("openSpeechBubble (map)")
		if(typeof(this._speechbubble)!="undefined" && this._speechbubble)
		{
			this.closeSpeechBubble(this._speechbubble);
		}

		if (!(speechbubble instanceof L.SpeechBubble)) {
			speechbubble = new L.SpeechBubble(options).setContent(speechbubble);
		}

		if (latlng) {
			speechbubble.setLatLng(latlng);
		}

		if (this.hasLayer(speechbubble)) {
			return this;
		}

		this._speechbubble = speechbubble;
		this._speechbubble.update();
		return this.addLayer(speechbubble);
	},

	// @method closePopup(popup?: Popup): this
	// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
	closeSpeechBubble: function (speechbubble) {
		//console.log("closeSpeechBubble (map)")
		if (!speechbubble || speechbubble === this._speechbubble) {
			speechbubble = this._speechbubble;
			this._speechbubble = null;
		}
		if (speechbubble) {
			this.removeLayer(speechbubble);
		}
		return this;
	}
});

return L.SpeechBubble;
}, window));