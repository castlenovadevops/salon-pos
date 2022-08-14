import React from 'react'; 
import Grid from '@material-ui/core/Grid'; 
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box'; 
import ClockInOut from './page';
import ModalAppBar from '../../components/Modal/Titlebar'; 

export default function ClockInOutModal(
{ 
        open,
        onClose,
        afterFinished,
        selectedTechi
        
}) 

{
  return (
    

    <Modal  open={open}
                            onClose={onClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
        <Grid container justify = "center">
        <Box style={{backgroundColor: "#ffffff", marginTop:'10%', paddingBottom:'16px', borderRadius:'10px', width:'500px'}} >

        <ModalAppBar onClose={onClose} title='Clock In/Out'/>
                            

        <ClockInOut afterFinished={afterFinished}  selectedTechi={selectedTechi}/>
        </Box>
        </Grid>
    </Modal>

  );
}
