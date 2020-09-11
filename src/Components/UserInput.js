import React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

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

export default UserInput;