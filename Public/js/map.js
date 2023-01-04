const search = document.getElementById("search");
const loader = document.getElementById("loaderContainer");
const ul = document.getElementById("dropdown-item");

const showLoader = () => {
  loader.classList.add("show");
};
const hideLoader = () => {
  loader.classList.remove("show");
};

// autocomplete everycharater show the similar city
search.addEventListener("keyup", function (e) {
  const inputText = e.target.value;
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputText}.json?access_token=pk.eyJ1IjoiZXNyYWFoOTYiLCJhIjoiY2xjZ2V2OXI4MTZ0MjNxbzQ3YWs1d2Q5YyJ9.nc36w7QDcG5ub-K0Q5e9TQ&autocomplete=true `,
    {
      method: "get",
    }
  )
    .then(handleResponse)
    .then(function (result) {
      ul.style.display = "block";
      ul.innerHTML = "";
      result.features.forEach((element) => {
        var li = document.createElement("li");
        li.addEventListener("click", moveToCity);
        li.innerHTML = element.text;
        ul.appendChild(li);
      });
    });
});

// function with api to search about city

const moveToCity = (event) => {
  showLoader();
  ul.style.display = "none";
  search.value = event.target.innerText;
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.innerText}.json?limit=1&access_token=pk.eyJ1IjoiZXNyYWFoOTYiLCJhIjoiY2xjZ2V2OXI4MTZ0MjNxbzQ3YWs1d2Q5YyJ9.nc36w7QDcG5ub-K0Q5e9TQ&autocomplete=true `,
    {
      method: "get",
    }
  )
    .then(handleResponse)
    .then((result) => {
      showMap(result?.features[0].center[0], result?.features[0].center[1]);
      setTimeout(() => {
        hideLoader();
      }, 1000);
    });
};
const handleResponse = (res) => {
  if (!res.ok) {
    return res
      .showMap((latitude , longitude))
      .then((result) => JSON.parse(result))
      .then((result) =>
        Promise.reject({
          message: result.message,
          errors: result.errors,
        })
      );
  } else {
    return res.json();
  }
};

// to show map in html and make marker with search

const showMap = (latitude , longitude) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZXNyYWFoOTYiLCJhIjoiY2xjZ2V2OXI4MTZ0MjNxbzQ3YWs1d2Q5YyJ9.nc36w7QDcG5ub-K0Q5e9TQ";
  const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/esraah96/clchdphxu000014pcrndzkjl7",
      center: [latitude , longitude],
      zoom: 4,
    })
    new mapboxgl.Marker().setLngLat([latitude , longitude]).addTo(map);
};

showMap(0, 0);
