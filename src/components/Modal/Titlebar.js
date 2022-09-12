import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close'; 
import Typography from "@material-ui/core/Typography"; 

export default function ModalAppBar(
    {
    
        onClose,
        title,
    
     
}) 

{
  return ( 
  <AppBar  color="primary" style={{ position: 'relative',background: 'transparent', boxShadow: 'none' }}>
  <Toolbar>
      
      <Typography variant="h6" component="div" style={{color:'#134163', height:'36px', overflow:'hidden', textOverflow:'ellipsis'}}>
      {title}
      </Typography>

      <div style={{marginLeft: "auto",marginRight: -12}}>
    
      <IconButton
      edge="start"
      onClick={onClose}
      aria-label="close"
      style={{"color":'#134163'}}
      >
      <CloseIcon />
      </IconButton>
      </div>
  </Toolbar>
  </AppBar>

  );
}
