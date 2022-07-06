import { Button } from '@mui/material';
import React from 'react'; 
import Grid from '@material-ui/core/Grid'; 
import Typography from "@material-ui/core/Typography"; 
import CloseIcon from '@mui/icons-material/Close'; 

export default function VoidModal(
    {
    
        handleCloseVoidAlert,
        updateVoidTicket,
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
                                    <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                        <Grid item xs={10}>
                                            <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20}}>{title}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle2" align="center" style={{cursor:'pointer',"color":'#134163'}} onClick={handleCloseVoidAlert}> 
                                            <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                                        </Grid> 

                                    </Grid>
                                    <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                        <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>{msg}</Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                        <Grid item xs={8}></Grid>
                                        <Grid item xs={4} style={{display: 'flex'}}>
                                            <Button style={{marginRight: 10, background:'#134163', color: '#ffffff'}} onClick={updateVoidTicket} variant="contained">Yes</Button>
                                            <Button onClick={handleCloseVoidAlert} style={{ borderColor:'#134163',color: '#134163'}} variant="outlined">No</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                </div>

                            </div>
    </div> 
        
  );
}
