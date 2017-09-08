# Leaflet.SpeechBubble
SpeechBubble for direction


# demo

https://sybri.github.io/demo/Leaflet.SpeechBubble/demo.html


Usage
=====

Include `L.SpeechBubble.js` 

```html
    <script src="https://unpkg.com/leaflet-speechbubble@1.0.0/dist/L.SpeechBubble.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-speechbubble@1.0.0/dist/SpeechBubble.css" /> 
```

## Simple initialization
```javascript
 var SpeechBubble = new L.SpeechBubble({
     	background: "#FFF",
		borderThick: 2,
		borderColor: "#000",
    },[51.5, -0.09]).addTo(mymap);
```
## Initialize with options and bind to a marker

```javascript
    var marker = L.marker([51.5, -0.09]).addTo(mymap);
		var options={
			width: 100, //size of main popup
			height: 100, //size of main popup
			top: 20, //top offset of main popup from map
			left: 200, //left offset of main popup from map
			strenth: 50, //length of the arrow
			base: 10,   // width of the base of arrow
			angle:0,    //dyn value don't care
			background: "#FF0", //background color of the speechBublle
			borderThick: 1, // the thickness of the borders' speechbubble
			borderColor: "#0F0",    // color of the border
			borderRadius: 10    // radius for border
		};
		marker.bindSpeechBubble("<b>Hello world!</b><br>I am a speechbubble.",options).openSpeechBubble();
```
