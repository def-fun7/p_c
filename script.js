var map = L.map('map').setView([0, 0], 1);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
Esri_WorldImagery.addTo(map);

var cN = []
for (const feature of countries.features) {
  cN.push(feature.properties.ADMIN);
}

var cLay = L.geoJSON(countries, {
  style: function(feature) {
    return {
      fillColor: getRandomColor(), 
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.6
    };
  },
  onEachFeature: function(feature, layer) {
    layer.on({
      click: function(e) {
        const previousZoom = map.getZoom(); 

        map.fitBounds(e.target.getBounds());

        // Create a popup with buttons
        const popupContent = `
          <p><b>IS THIS IT?</b></p> 
          <button id="chooseButton">Choose</button> 
          <button id="goBackButton">Go Back</button>
        `;

        layer.bindPopup(popupContent).openPopup();

        const chooseButton = document.getElementById('chooseButton');
        const goBackButton = document.getElementById('goBackButton');

        chooseButton.onclick = function() {
          
          if (ranCN === feature.properties.ADMIN) {
                message = "WOW, You Found " + ranCN;
                addItemToList(message)
                countNum('win')
                var gifUrl = 'https://bestanimations.com/media/fireworks2/367172827red-green-firework-explosions.gif'; 

                showTemporaryGIF(gifUrl, 7)
          } else if (typeof ranCN === "undefined" ) {
            message = "At least Shuffle first, IDIOT!!!";
            addItemToList("You chose before shuffling.")
            var gifUrl = 'https://c.tenor.com/-isbpihSHoQAAAAd/idiot-stupid.gif'; 

            showTemporaryGIF(gifUrl, 7)
          
          } else {
            message = "You picked the Wrong Country...";
            addItemToList("you picked " + feature.properties.ADMIN +" as " + ranCN)
            countNum('lose')
            var gifUrl = 'https://gifdb.com/images/high/tongue-out-teasing-playful-goofy-bear-fart-hjx2tcoixrtq09vi.gif'; 

            showTemporaryGIF(gifUrl, 4.8)
          }

          // Append the h3 element to the map container (assuming you have a container element with an ID)
          document.getElementById("ans").innerText = message;
        
          // Close any existing popups (optional)
          layer.closePopup();
        };
        
        goBackButton.onclick = function() {
          map.setZoom(1); 
          layer.closePopup(); 
        };
      }
    });
  }
}
).addTo(map)

let ranCN;
function shuffle() {
  map.setView([0, 0], 1);
  map.closePopup();
  if (document.getElementById('ans').innerText = "waiting") {
      countNum('skip')
  }
    const randomIndex = Math.floor(Math.random() * cN.length);
    const randomcN= cN[randomIndex];
    ranCN = randomcN
    document.getElementById('randomcN').innerText = "Find "+ randomcN;
    document.getElementById('ans').innerText = "Click on the Country";
    addItemToList("You shuffled and got " + ranCN);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  while (color === '#FFFFFF' || color === '#000000') {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }
  return color;
}

function showTemporaryGIF(gifUrl, time) {
  // Calculate bounds for the entire map
  var southWest = map.getBounds().getSouthWest();
  var northEast = map.getBounds().getNorthEast();
  var bounds = L.latLngBounds(southWest, northEast);

  // Create an ImageOverlay to display the GIF
  var gifOverlay = L.imageOverlay(gifUrl, bounds).addTo(map);

  setTimeout(function() {
    map.removeLayer(Esri_WorldImagery);
    map.removeLayer(gifOverlay);
    map.addLayer(Esri_WorldImagery);
  }, time*1000);
}  

function countNum(id){
  var count = document.getElementById(id);
  var currentC = parseInt(count.innerText);

  currentC ++;

  count.innerText = currentC
}

function showAnswer(){
  countNum('lose')
  addItemToList("You gave up Looking for " + ranCN + " !!!")
  var featureToZoom = cLay.getLayers().find(function(layer) {
    return layer.feature.properties.ADMIN === ranCN; // Replace with the desired feature name
  });
  map.fitBounds(featureToZoom.getBounds());
  featureToZoom.bindPopup(ranCN + 'is HERE dude').openPopup()
  document.getElementById('randomcN').innerText = "Shuffle Again";
  document.getElementById('ans').innerText = "Shuffle to Restart!"
}

function addItemToList(text) {
  var list = document.getElementById("hist");
  var li = document.createElement("li");
  var textNode = document.createTextNode(text); 

  li.appendChild(textNode);

  list.appendChild(li);
}
