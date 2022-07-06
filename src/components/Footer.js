// material
import { Button } from '@mui/material';
import React from 'react'; 
import Grid from '@material-ui/core/Grid'; 
import Typography from "@material-ui/core/Typography"; 
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone'; 
export default function Footer() 
{
    const clearData = function(){ 
        window.localStorage.removeItem("employeedetail")
        window.localStorage.removeItem("businessdetail")
        window.localStorage.removeItem("synced")
        setTimeout(()=>{
            window.location.reload();
        })
    }

  return (
    <div style={{margin:0, position: 'fixed', width: '100%', bottom: 0, 
    background: '#ffffff',
    lineHeight: 2,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'sans-serif',
    boxShadow: '0 0 15px #F0F0F0',
    display: 'inline-block',
    height:'60px'
    }}>
    <div style={{marginBottom: 10, marginTop: 10, textAlign: 'center', marginLeft: 'auto',marginRight: 'auto',width: '100%'}}>
        <div style={{ width: 'calc(100% - 200px)',display:' inline-block',textAlign: 'center', background: 'white'}}>
            <Grid style={{display:'flex'}}>
                <Grid item style={{display:'flex', marginLeft: 20}}>
                    {/* <Typography id="modal-modal-title" variant="subtitle2">
                                    Need Quick Help
                    </Typography>
                    <Typography variant="subtitle2" align="right" style={{cursor:'pointer', marginRight:10, marginLeft:10}}> <PhoneIcon color='secondary' fontSize="small" style={{color:'#134163'}}/></Typography>
                    <Typography  variant="subtitle2" style={{color:'#134163'}}>+10000000000</Typography> */}
                </Grid>
                <Grid item style={{display:'flex', marginLeft: 80}}>
                        {/* <Typography id="modal-modal-title" variant="subtitle2">
                        Contact for support
                        </Typography>
                        <Typography variant="subtitle2" align="right" style={{cursor:'pointer',marginRight:10, marginLeft:10}}> <MailIcon fontSize="small" style={{color:'#134163'}}/></Typography>
                        <Typography variant="subtitle2" style={{color:'#134163'}}>support@castlenova.com</Typography> */}
                    
                </Grid>
            </Grid>
        </div>
         <div style={{ position:'absolute', right:0, top:'10px', display: 'flex',alignItems: 'center'}}>
        {/* <Button variant="text"  onClick={()=>clearData()} fullWidth>Clear</Button> */}
        <Typography variant="subtitle2" style={{color:'#929292', marginRight:10, marginTop:10, whiteSpace:'nowrap' }}>
                Version Beta 2.2</Typography>
                </div>

    
    </div>
    </div>

  );
}
