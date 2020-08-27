import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

function Header() {
    return (
        <AppBar position="static">
          <Toolbar>
            <h2>Film information</h2>
          </Toolbar>
        </AppBar>
    )
};

export default Header;