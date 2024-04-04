const api_key = "6176204b8a71a693a73a8aa6177c12fd";
const base_url = "https://api.themoviedb.org/3/";
const inputTitle = document.querySelector("input#edit-title-0-value");
const inputSynop = document.querySelector(
  "textarea#edit-field-synopsis-du-film-0-value"
);
const inputActors = document.querySelector("input#edit-field-acteurs-0-value");
const inputPays = document.querySelector("input#edit-field-pays-0-value");
const inputRealisateur = document.querySelector(
  "input#edit-field-realise-par-0-value"
);
const inputYears = document.querySelector("input#edit-field-annee-0-value");
const inputDure = document.querySelector("input#edit-field-fulm-duree-0-value");
const inputAnnonce = document.querySelector("input#edit-field-bande-0-value");
const inputPoster = document.querySelector(
  "input#edit-field-url-image-0-value"
);
const inputGenre = document.querySelector(
  "input#edit-field-genre-du-film-api-0-value"
);
const inputDuration = document.querySelector(
  "input#edit-field-fulm-duree-0-value"
);
const inputvISA = document.querySelector("input#edit-field-visa-0-value");
const inputCode = document.querySelector("input#edit-field-code-0-value");
const inputDistributeur = document.querySelector("input#edit-field-distributeur-0-value");
const inputDernierPorj = document.querySelector("input#edit-field-dernier-projection-possibl-0-value");


let suggestionList = null;

inputTitle.addEventListener("focus", showSuggestions);

let timeoutId;
let movieDataCinedi = {};

inputTitle.addEventListener("input", function () {
  const movieTitle = inputTitle.value.trim();

  // Efface le délai précédent s'il y en a un
  clearTimeout(timeoutId);
  // Lance fetchMovieSuggestions après un délai de 2 secondes
  timeoutId = setTimeout(function () {
    fetchMovieSuggestions(movieTitle);
  }, 1500);
});

function fetchMovieSuggestions(movieTitle) {
  fetch(`/apicinedi/${movieTitle}`)
    .then((response) => response.text())
    .then((dataStr) => {
      const data = JSON.parse(dataStr);
      console.log(data);
      console.log(data.length);
      if (data.length > 0) {
        clearSuggestions();
        displayMovieSuggestions(data);
      } else {
        clearSuggestions();
      }
    })
    .catch((error) => console.log("error", error));
}
function displayMovieSuggestions(movieResults) {
  clearSuggestions();

  suggestionList = document.createElement("ul");
  suggestionList.classList.add("liste-des-films");

  movieResults.forEach((movie) => {
    const listItem = document.createElement("li");
    const movieTitle = movie.TITRE_LONG;
    const movieDate = movie.DATE_SORTIE;
    listItem.textContent = `${movieTitle} (${movieDate})`; // Affichage du titre et de la date
    listItem.addEventListener("click", (event) => {
      // Récupération de l'ID du film
      fetch(`${base_url}search/movie?api_key=${api_key}&query=${movieTitle}&language=fr-FR`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erreur lors de la récupération des données de l'API TMDB");
          }
        })
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const idMovie = data.results[0].id;
            fetchMovieDetails(idMovie, movieTitle);
            movieDataCinedi = movie; // Stockage des données du film sélectionné
          } else {
            clearSuggestions();
          }
        })
        .catch((error) => {
          clearSuggestions();
          console.error(error);
        });
    });
    suggestionList.appendChild(listItem);
  });

  const inputContainer = inputTitle.parentElement;
  inputContainer.appendChild(suggestionList);

  // Gérer l'affichage de la liste de suggestions en fonction de l'état de la case à cocher
  const checkbox = document.querySelector("input#edit-field-util-api-value");
  if (checkbox && !checkbox.checked) {
    clearSuggestions();
  }
}

function checkCheckboxStatus() {
  const checkbox = document.querySelector("input#edit-field-util-api-value");

  if (checkbox) {
    // Vérifier l'état initial de la case à cocher au chargement de la page
    if (checkbox.checked) {
      console.log("La case est cochée.");
      // Si la case est cochée au chargement, afficher les suggestions
      const movieTitle = inputTitle.value.trim();
      fetchMovieSuggestions(movieTitle);
    } else {
      console.log("La case n'est pas cochée.");
      // Si la case n'est pas cochée au chargement, effacer les suggestions
      clearSuggestions();
    }

    // Ajouter un écouteur d'événements pour surveiller les changements d'état de la case à cocher
    checkbox.addEventListener("change", function() {
      if (checkbox.checked) {
        console.log("La case est cochée.");
        const movieTitle = inputTitle.value.trim();
        fetchMovieSuggestions(movieTitle);
      } else {
        console.log("La case n'est pas cochée.");
        clearSuggestions();
      }
    });
  } else {
    console.log("La case à cocher n'a pas été trouvée.");
  }
}

// Appelez la fonction pour vérifier l'état initial de la case à cocher
checkCheckboxStatus();



function fetchMovieDetails(movieId) {
  fetch(
    `${base_url}movie/${movieId}?api_key=${api_key}&language=fr-FR&append_to_response=credits,release_dates,genres,production_countries,videos`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert(
          "Erreur lors de la récupération des détails du film de l'API TMDB"
        );
        throw new Error(
          "Erreur lors de la récupération des détails du film de l'API TMDB"
        );
      }
    })
    .then((data) => {
      console.log(data);
      const title = data.title;
      const releaseFRDateISO = data.release_dates.results.find(
        (date) => date.iso_3166_1 === "FR"
      );
      if (releaseFRDateISO) {
        var releaseDateISO = releaseFRDateISO.release_dates[0].release_date;
      } else {
        var dateAutreLang = data.release_dates.results[0];
        console.log(dateAutreLang);
        var releaseDateISO = dateAutreLang.release_dates[0].release_date;
      }

      // Convertir la date ISO en objet Date JavaScript
      const releaseDate = new Date(releaseDateISO);

      // Formater la date en "jour mois année"
      const options = { day: "numeric", month: "long", year: "numeric" };
      const formattedReleaseDate = movieDataCinedi.DATE_SORTIE;
      const synopsis = data.overview;
      const countries = data.production_countries
        .map((country) => country.name)
        .join(", ");
      const actors = data.credits.cast.map((actor) => actor.name).join(", ");
      const director = data.credits.crew.find(
        (person) => person.job === "Director"
      ).name;
      const releaseYear = movieDataCinedi.DATE_SORTIE;
      const posterPath = data.poster_path;
      const genres = data.genres.map((genre) => genre.name).join(", ");
      const duration = data.runtime;
      const video = data.videos.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      const visa = movieDataCinedi.NUM_VISA;
      const code = movieDataCinedi.DIST_CODE;
      const distributeur = movieDataCinedi.DIST_RS;
      const dernierProj = movieDataCinedi.DATE_DER_PROJ;

      const confirmation = window.confirm(
        `Voulez-vous sélectionner le film suivant ?\n\nTitre: ${title}\nDate de sortie: ${formattedReleaseDate}\nRéalisateur: ${director}`
      );

      if (confirmation) {
        //Vos actions de traitement du film sélectionné

        if(inputDernierPorj){
          inputDernierPorj.value = dernierProj;
        }

        if(inputDistributeur){
          inputDistributeur.value = distributeur;
        }

        if(inputCode){
          inputCode.value = code;
        }
        
        //VISA
        if (inputvISA) {
          // Si défini, attribue la valeur de visa
          inputvISA.value = visa;
        } else {
          // Si non défini, attribue une chaîne de 10 zéros
          inputvISA = "0000000000";
        }

        /* TITRE */
        if (inputTitle) {
          inputTitle.value = title;
        }
        /* Synopsis */
        if (inputSynop) {
          inputSynop.value = synopsis;
        }
        /* Anné */
        if (inputYears) {
          inputYears.value = releaseYear;
        }
        /* Réalisateur */
        if (inputRealisateur) {
          inputRealisateur.value = director;
        }
        /* Pays */
        if (inputPays) {
          inputPays.value = countries;
        }
        /* visa */
        if (inputvISA) {
          inputvISA.value = visa;
        }

        /* Acteur*/
        if (inputActors) {
          const firstFiveActors = data.credits.cast
            .slice(0, 5) // Obtenir les 5 premiers acteurs
            .map((actor) => actor.name)
            .join(", ");

          inputActors.value = firstFiveActors;
        }
        /* PSTER*/
        if (inputPoster) {
          inputPoster.value = `https://image.tmdb.org/t/p/w500${posterPath}`;
        }
        if (inputGenre) {
          inputGenre.value = genres;
        }
        if (inputDuration) {
          const hours = Math.floor(duration / 60); // Calcul des heures
          const minutes = duration % 60; // Calcul des minutes restantes
          inputDuration.value = `${hours}h${minutes}`; // Affichage en format "h mm min"
        }

        if (video) {
          // Vérifiez d'abord si la vidéo existe
          if (inputAnnonce) {
            const videoUrl = `https://www.youtube.com/watch?v=${video.key}`;
            inputAnnonce.value = videoUrl;
          } else {
            inputAnnonce.value = "Aucune vidéo disponible";
          }
        }
        clearSuggestions();
      } else {
        if (inputTitle) {
          inputTitle.value = "";
        }
        clearSuggestions();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function clearSuggestions() {
  if (suggestionList) {
    suggestionList.remove();
    suggestionList = null;
  }
}

function showSuggestions() {
  // Rien à faire ici car la liste est affichée lors de sa création dans displayMovieSuggestions
}

