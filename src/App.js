import React, { Fragment, useCallback, useEffect, useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchingDataHandler = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetch("https://fakehttp-3cfce-default-rtdb.firebaseio.com/movies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        return response.json();
      })
      .then((data) => {
        const loaded = [];

        for (const key in data) {
          loaded.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,
          });
        }
        setMovies(loaded);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchingDataHandler();
  }, [fetchingDataHandler]);

  async function  addMovieHandler(movie){
    const response = await fetch("https://fakehttp-3cfce-default-rtdb.firebaseio.com/movies.json", {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type' : "application/json"
      }
    });
    const data = await response.json();
    console.log(data);
  };

  let content = <p>found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchingDataHandler}>Fetch new movie</button>
      </section>
      <section>{content}</section>
    </Fragment>
  );
}

export default App;
