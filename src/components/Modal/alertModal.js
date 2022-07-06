import { Button } from '@mui/material';
import React from 'react'; 
import Grid from '@material-ui/core/Grid'; 
import Typography from "@material-ui/core/Typography"; 
import ModalTitleBar from './Titlebar' 
export default function AlertModal(
{
    
        handleCloseAlert,
        title,
        msg 
}) 

{
  return (
    

        <div>
        <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
            <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
            </div>
            <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative', borderRadius: 10}}>
                <Grid container spacing={2}>
                    <ModalTitleBar  title={title} onClose={handleCloseAlert}/>
                    <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                        <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>{msg}</Typography>
                    </Grid>
                    <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                        <Grid item xs={10}></Grid>
                        <Grid item xs={2}>
                           

                            <Button onClick={handleCloseAlert} style={{ borderColor:'#134163',color: '#134163'}} variant="outlined">OK</Button>
                        </Grid>
                      
                    </Grid>
                </Grid>

            </div>

        </div>
        </div>

  );
}
