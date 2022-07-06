 // material
import React from 'react'; 
import Dialog from '@material-ui/core/Dialog'; 
import { DialogContent} from '@material-ui/core/'; 
import CircularProgress from '@mui/material/CircularProgress'; 
export default function LoadingModal(
{
    show, 
}) 

{
  return ( 
    <Dialog
        open={true}
        style={{width: '100%',height: '100%',top: '50%',left: '50%',transform: 'translate(-50%, -50%)'}}
        title= 'Loading'
        disablePortal={false}
        PaperProps={{
            style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            },
        }} 
    >
    <DialogContent style={{background: '#ffffff00'}}>
        <CircularProgress style= {{display: 'inline-block',color: '#134163'}}  size={50} />
    </DialogContent>
</Dialog>

  );
}
