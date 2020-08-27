import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import { Container } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import Header from './Components/Header';


const APOLLO_CLIENT = new ApolloClient({
  uri: "https://play.dgraph.io/graphql",
  cache: new InMemoryCache()
});

// our queries
const QUERY_FILM_GENRES = gql`{
  queryGenre {
    name
  }
}`;

const QUERY_FIND_FILMS = gql`
  query($name: String!, $genre: GenreFilter) {
    queryFilm(filter:{name: {alloftext: $name}}) @cascade {
      name
      genre(filter: $genre) {
        name
      }
      directed_by {
        name
      }
      initial_release_date
    }
  }`;

// this is for trying to get the genre that the user selected
// maybe this could be called inside another event handler or something...
var handleGenreSelect = (event) => {
  var genreValue = event.target.value;
  return genreValue;
};

function GenreAndSearch() {

  let { loading, error, data } = useQuery(QUERY_FILM_GENRES);
  
  if (loading) {
      return <h2>Loading...</h2>
  } else if (error) {
      return <h2>Error!</h2>
  }

  // populate the array with film genres
  var filmGenres = [];
  data.queryGenre.forEach(
    (genreObject) => filmGenres.push(genreObject.name));
  
  // filter out the null values
  filmGenres = filmGenres.filter(function(genre) { 
    return genre !== null; 
  });
    
  return (
    <Autocomplete 
      id="film-box" 
      options={ filmGenres } 
      onChange={ handleGenreSelect }
      style={{ width: 300 }} 
      getOptionLabel={(option) => option}
      renderInput={
        (params) => <TextField {...params} label="Select genre" variant="outlined" />
      }>
    </Autocomplete>
  );

};

// search and submit component
function UserInput() {
  const [ nameFilter, setNameFilter ] = useState("happy");
  const [ genreFilter, setGenreFilter ] = useState({name: { eq: null}});

  // send query with variables as per user provided
  const { loading, error, data, refetch } = useQuery(QUERY_FIND_FILMS, 
    { variables: {name: nameFilter, genre: genreFilter} });

  /*
  if (loading) {
    return <h2>Loading...</h2>
  } else if (error) {
    console.log(error);
    return <h2>Error!</h2>
  }
  */

  // event handlers
  const handleInputChange = (event) => {
    setNameFilter(event.target.value);
  };
  
  const handleGenre = () => {
    setGenreFilter({name: { eq: handleGenreSelect()}});
  };

  const handleSubmit = (event) => {
    refetch({ 
      variables: {name: nameFilter, genre: genreFilter} 
    })

    var arrayOfFilmNames = [];
    var arrayOfFilmDirectors = [];

    data.queryFilm.forEach((filmObject) => arrayOfFilmNames.push(filmObject.name));
    console.log(arrayOfFilmNames);
  };

  return (
    <form>
      <Input placeholder="Film name" onChange={ handleInputChange }>
      </Input>
      <Button variant="contained" onClick={ handleSubmit } color="primary" style={{ marginLeft: 20 }}>
        Submit
      </Button>
    </form>
  );

};

function App() {
  return (
    <ApolloProvider client={APOLLO_CLIENT}>
      <div>
        <Header />
        <br></br>
        <Container maxWidth="sm" style={ getContainerStyle }>
          <GenreAndSearch />
          <br></br>
          <h3 style={{ marginTop: 50 }}>
            Enter a film name or phrase:
          </h3>
          <UserInput />
        </Container>
      </div>
    </ApolloProvider>
  );
}

export default App;

const getContainerStyle = {
  marginTop: '5rem'
};

/*

columns: [
      { title: 'Name', field: 'name' },
      { title: 'Director', field: 'director' }
    ],
    data: [
      { name: 'Sakib', director: 'Hydrogen' }
    ]



*/

/*
// our query
const QUERY_FILM_LOCATION = gql`
  {
    queryLocation(filter: { name: { eq: "San Francisco" } }) {
      name
      featured_in_films(order: { desc: initial_release_date }, first: 20) {
        name
        directed_by {
          name
        }
      }
    }
  }
`;

var arrayOfFilmNames = [];
var arrayOfFilmDirectors = [];

function FilmLocationsandDirectors() {

  let { loading, error, data } = useQuery(QUERY_FILM_LOCATION);

  if (loading) {
    return (
    <div>
      <CircularProgress />;
    </div>
    )
    //<h3>Loading...</h3>;
  } else if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Sorry, something went wrong!
      </Alert>
    )
  }

  //arrayOfFilmNames = [];
  data.queryLocation.forEach((featureLocation) =>
    featureLocation.featured_in_films.forEach((item) =>
      arrayOfFilmNames.push(item.name)
    )
  );

  //arrayOfFilmDirectors = [];
  data.queryLocation.forEach(featureLocation => 
    featureLocation.featured_in_films.forEach(item => 
      item.directed_by.forEach(item => 
        arrayOfFilmDirectors.push(item.name))));

  //  correct wrong data manually for now
  arrayOfFilmDirectors.splice(arrayOfFilmDirectors.indexOf('Margaret Corkery'), 1);
  arrayOfFilmDirectors.splice(arrayOfFilmDirectors.indexOf('Bobby Farrelly'), 1);
  
  // create an array of objects representing films with corresponding
  // directors
  var objOfFilmsAndDirectors = {};
  arrayOfFilmNames.forEach(function(name, director) {
    objOfFilmsAndDirectors[name] = arrayOfFilmDirectors[director];
  });
  var directorAndFilms = Object.entries(objOfFilmsAndDirectors).map(
    ([name, director]) => ({name, director}));

  return (
    <MaterialTable 
    title=""
    columns={[
      { title: 'Name', field: 'name', width: 200, headerStyle: {
        backgroundColor: '#A5B2FC'
      } },
      { title: 'Director', field: 'director', width: 50, headerStyle: {
        backgroundColor: '#A5B2FC'
      } }
    ]}
    data={
      directorAndFilms
    }
    options={{
      search: true
    }}
    style={ getMaterialTableStyle }>
    </MaterialTable>
  );
}
*/