import React from 'react';
import {
    Autocomplete,
    Alert,
    AlertTitle
} from '@material-ui/lab';
import {
    useQuery,
    gql
} from "@apollo/client";
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

const QUERY_FILM_GENRES = gql`{
  queryGenre @cascade{
      name
  }
}`;

function Genre({handleGenreSelect}) {

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

export default Genre;