import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  gql
} from "@apollo/client";
import Container  from "@material-ui/core/Container";
import TextField from '@material-ui/core/TextField';
import {
  Autocomplete,
  Alert,
  AlertTitle
} from '@material-ui/lab';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from './Components/Header';


const APOLLO_CLIENT = new ApolloClient({
  uri: "https://play.dgraph.io/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          queryFilm: {
            merge(_ignored, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  })
});

// our queries
const QUERY_FILM_GENRES = gql`{
  queryGenre {
    name
  }
}`;

const QUERY_FIND_FILMS = gql`
  query($name: FilmFilter, $genre: GenreFilter) {
    queryFilm(filter: $name) @cascade {
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

function GenreAndSearch({handleGenreSelect}) {

  let { loading, error, data } = useQuery(QUERY_FILM_GENRES);
  
  if (loading) {
      return <CircularProgress />
  } else if (error) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Sorry, something might not be working at the moment!
        </Alert>
      )
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
      onChange={ (event, selectedGenre) => handleGenreSelect(event, selectedGenre) }
      style={{ width: 300 }} 
      getOptionLabel={(option) => option}
      renderInput={
        (params) => <TextField {...params} label="Select genre" variant="outlined" />
      }>
    </Autocomplete>
  );

};

// search and submit component
function UserInput({handleInputChange, handleSubmit}) {

  return (
    <form>
      <Input placeholder="Film name" onChange={ handleInputChange }>
      </Input>
      <Button type="submit" variant="contained" onClick={ handleSubmit } color="primary" style={{ marginLeft: 20 }}>
        Submit
      </Button>
    </form>
  );

};

function App() {

  const [ nameFilter, setNameFilter ] = useState({name: {alloftext: "Summer"}});
  const [ genreFilter, setGenreFilter ] = useState(null);
  const [ dataForRender, setDataForRender ] = useState([]);

  // send query with variables as per user provided
  const { loading, error, data, refetch } = useQuery(QUERY_FIND_FILMS, 
    { variables: {name: nameFilter, genre: genreFilter} });

  // variable with data for table
  var filmsAndDirectors;
  var arrayOfFilmNames = [];
  var arrayOfFilmDirectors = [];
  var multipleDirectors = "";
  
  // event handlers
  const handleGenreSelect = (event, selectedGenre) => {
    if(selectedGenre) {
      setGenreFilter({name: { eq: selectedGenre }});
    } else {
      setGenreFilter(null);
    }
  };

  const handleInputChange = (event) => {
    if (event.target.value) {
      setNameFilter({name: {alloftext: event.target.value}});
    } else {
      setNameFilter(null);
    }
  };

  
  
  // event handlers
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data: newData } = await refetch({ 
      variables: {name: nameFilter, genre: genreFilter} 
    });

    /* if (loading) {
      return <h2>Loading...</h2>
    } else if (error) {
      return <h2>Error!</h2>
    } */

    // get film names
    newData.queryFilm.forEach((filmObject) => arrayOfFilmNames.push(filmObject.name));

    // get corresponding directors
    newData.queryFilm.forEach((filmObject) => {
      // for multiple directors show in comma-separated list
      if (filmObject.directed_by.length > 1) {
        filmObject.directed_by.forEach((dirObject) => {
          multipleDirectors += dirObject.name + ", ";
        })
        arrayOfFilmDirectors.push(
          multipleDirectors.trim().substr(0, multipleDirectors.length - 2));
        multipleDirectors = "";
      } else {
        filmObject.directed_by.forEach((dirObject) => arrayOfFilmDirectors.push(dirObject.name))
      }
    });

    // create array of objects of film and their directors
    filmsAndDirectors = [];
    var tempObj = {};
    arrayOfFilmNames.forEach((key, i) => {
      tempObj.name = key;
      tempObj.director = arrayOfFilmDirectors[i];
      filmsAndDirectors.push(tempObj);
      tempObj = {};
    });
    setDataForRender(filmsAndDirectors);
  };


  return (
    <div>

      <Header />
      <br></br>
      <Container maxWidth="xs" style={ getContainerStyle }>

        <GenreAndSearch handleGenreSelect={handleGenreSelect} />
        <br></br>

        <h3 style={{ marginTop: 50 }}>
          Enter a film name or phrase:
        </h3>

        <UserInput handleInputChange={handleInputChange} handleSubmit={handleSubmit} />

      </Container>
      <MaterialTable 
          title=""
          columns={[
            { title: 'Name', field: 'name', align: 'center', headerStyle: {
              backgroundColor: '#A5B2FC'
            } },
            { title: 'Director', field: 'director', align: 'center', headerStyle: {
              backgroundColor: '#A5B2FC'
            } }
          ]}
          data={
            dataForRender
          }
          options={{
            search: true
          }}
          style={{ margin: '5rem' }}>
      </MaterialTable>
    </div>
  );
}

export { App, APOLLO_CLIENT };

const getContainerStyle = {
  marginTop: '5rem'
};
