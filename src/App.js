import React, { useState } from "react";
import {
  useQuery,
  gql
} from "@apollo/client";
import Container  from "@material-ui/core/Container";
import MaterialTable from 'material-table';

import Header from './Components/Header';
import Genre from './Components/Genre';
import UserInput from './Components/UserInput';

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

const getContainerStyle = {
  marginTop: '5rem'
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

        <Genre handleGenreSelect={handleGenreSelect} />
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

export default App;
