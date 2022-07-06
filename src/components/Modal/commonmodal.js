 // material
import { Button } from '@mui/material';
import React from 'react'; 
import { Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle } from '@material-ui/core';  
export default function CommonModal({ open, onClose, title, contentText }){
  return ( 
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            
        {contentText} 
        </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}> OK </Button>
        </DialogActions>
    </Dialog>

  );
}
