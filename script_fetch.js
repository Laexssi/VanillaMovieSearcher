const apiKey = "31a2acbd095355e3b5ac823a2a6f17a4";
const searchForm = document.querySelector("#search-form");
const searchText = document.querySelector(".form-control");
const movies = document.querySelector("#movies");
const urlPoster = "https://image.tmdb.org/t/p/w500";
const noPosterUrl = "https://filmitorrentom.org/films/noposter.jpg";
let page = 1;
let searchTextValue = "";
const trendignUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=ru&page=1`;


const generateMovieCard = (item, index) => {
  const movieCard = document.createElement('div');
  movieCard.classList.add("col-12", "col-md-6", "col-xl-3", "item");



  const movieName = document.createElement('h5');
  const movieTitle = item.name || item.title;
  movieName.innerHTML = movieTitle;


  const moviePoster = document.createElement('img');
  moviePoster.classList.add("img-fluid");
  moviePoster.src = item.poster_path
    ? posterUrl = `${urlPoster + item.poster_path}`
    : posterUrl = noPosterUrl;
  moviePoster.alt = movieTitle;

  if (item.media_type !== "person") {
    movies.appendChild(movieCard);
    movieCard.appendChild(moviePoster);
    movieCard.appendChild(movieName);
  }

  movieCard.setAttribute('index', index);
  movieCard.setAttribute('page', page);
  movieCard.setAttribute('data-id', item.id);
  movieCard.setAttribute('data-type', item.media_type);



  const templateButton = document.querySelector("#load-button-template")

  const cloneTemplateButton = templateButton.content.cloneNode(true);


  if (index >= 19) {
    movies.appendChild(cloneTemplateButton);
  }

  addEventMovies();

 

};

const buttonDecorator = (f) => {
  return function() {
    f.apply(this, arguments);
    document.querySelector(".btn").setAttribute("onclick", "loadNextTrandingPage()");
  }
}

function requestApi(method, url)  {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();

    request.open(method, url);
    request.onload = () => {
      if (request.status !== 200) {
        reject({ status: request.status });
        return;
      }

      resolve(request.response);
    };
    request.onerror = () => {
      reject({ status: request.status });
    };

    request.responseType = "json";
    request.send();
  });
};
const loadContent = (server) => {
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  fetch(server)
    .then(result => {
      console.log(result);
      if (result.status !== 200) {
        return Promise.reject(result);


      }
      return result.json();
    })
    .then(output => {
      movies.innerHTML = "";
      console.log(output);

      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No results</h2>"
        );
      }

      output.results.forEach((item, index) => {

        generateMovieCard(item, index);

      });
    })
    .catch(reason => (movies.innerHTML = `Ошибка: ${reason.status}`));
}

const apiSearch = e => {
  e.preventDefault();
  searchTextValue = searchText.value;
  const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}`;
  page = 1;
  if (searchTextValue.trim().length === 0) {
    movies.insertAdjacentHTML(
      "afterbegin",
      "<h2 class='col-12 text-center text-info'>Empty input</h2>"
    );
    return;
  }
  
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  movies.innerHTML = "";
  loadContent(searchUrl);
};

const loadNextPage = () => {
  page += 1;
  console.log(page);

  const nextPage = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${searchTextValue}&page=${page}`;
  const loadButton = document.querySelector('#load-button');
  loadButton.insertAdjacentHTML("beforebegin", '<div class="spinner"></div>');
  requestApi("GET", nextPage)
  .then(result => {
    const spinner = document.querySelector(".spinner");
    loadButton.remove();
    spinner.remove();
    const output = result;
    console.log(output);

    if (output.results.length == 0) {
      movies.insertAdjacentHTML(
        "afterbegin",
        "<h2 class='col-12 text-center text-info'>No more movies</h2>"
      );
      }
    output.results.forEach((item, index) => {
      generateMovieCard(item, index);
  });
  })
};

const loadTrendContent = (server) => {
  movies.insertAdjacentHTML("afterbegin", '<div class="spinner"></div>');
  fetch(server)
    .then(result => {
      console.log(result);
      if (result.status !== 200) {
        return Promise.reject(result);


      }
      return result.json();
    })
    .then(output => {
      movies.innerHTML = "";
      console.log(output);

      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No results</h2>"
        );
      }

      output.results.forEach((item, index) => {

        generateMovieCard(item, index); 
       
      });
      document.querySelector(".btn").setAttribute("onclick", "loadNextTrandingPage()");
      
    })
    .catch(reason => (movies.innerHTML = `Ошибка: ${reason.status}`));
}
const loadNextTrandingPage = () => {
  
    page += 1;
    console.log(page);
  
    const nextPage = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=ru&page=${page}`;
    const loadButton = document.querySelector('#load-button');
    loadButton.insertAdjacentHTML("beforebegin", '<div class="spinner"></div>');
    requestApi("GET", nextPage)
    .then(result => {
      const spinner = document.querySelector(".spinner");
      loadButton.remove();
      spinner.remove();
      const output = result;
      console.log(output);
  
      if (output.results.length == 0) {
        movies.insertAdjacentHTML(
          "afterbegin",
          "<h2 class='col-12 text-center text-info'>No more movies</h2>"
        );
        }
      output.results.forEach((item, index) => {
        buttonDecorator(generateMovieCard(item, index));
    });
   
    })
  };


const addEventMovies = () => {
  const allCards = document.querySelectorAll(".item");
  allCards.forEach((elem) => {elem.style.cursor = "pointer"; elem.addEventListener("click", showFullInfo)})
};

const isScroll = () => {


  (document.documentElement.scrollTop > 500)
    ? document.querySelector(".button-scroll").classList.add("show")
    : document.querySelector(".button-scroll").classList.remove("show")
};

const scrollToTop = (scrollDuration) => {

  var scrollStep = -window.scrollY / (scrollDuration / 15),
    scrollInterval = setInterval(function () {
      if (window.scrollY != 0) {
        window.scrollBy(0, scrollStep);
      }
      else clearInterval(scrollInterval);
    }, 15);
}

function showFullInfo() {
  console.log(this);
}

searchForm.addEventListener("submit", apiSearch);
document.addEventListener("DOMContentLoaded", loadTrendContent(trendignUrl));





window.onscroll = function () { isScroll() };


