 import React from 'react'; 
import { Grid,  Button } from '@material-ui/core/'; 
import ModalTitleBar from '../../../components/Modal/Titlebar'
import TextareaAutosizeContent from '../../../components/formComponents/TextAreaAutosize'; 

export default function NotesModal(
    {
        handleCloseAddNotes,
        notes,
        handlechangeNotes,
        saveNotes,
        

}) 

{
  return (
    
    <div>
        <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
            <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
            </div>
            <div style={{background:'#fff', width:'900px', height:'70%', overflow:'hidden auto', margin:'5% auto 0', position:'relative', borderRadius: 10}}>
            <Grid container spacing={2}>
                
                <ModalTitleBar  title="Add Notes" onClose={handleCloseAddNotes}/>
                <Grid item xs={12} style={{display:'flex',marginTop:0,padding: 30}}>
                        <TextareaAutosizeContent

                            fullWidth
                            label="Ticket Notes"
                            name="Ticket Notes"

                            id="Ticket Notes"
                            rows={5}
                            required
                            multiline
                            value={notes}
                            onChange={(e) => {
                                handlechangeNotes(e.target.value);
                            }}
                          
                        />
                </Grid>
                <Grid item xs={12} style={{display:'flex',marginTop:5,  marginBottom: 20}}>
                    <Grid item xs={8}></Grid>
                    <Grid container item xs={4}    justify="flex-end" style={{marginRight: 20}}>
                        <Button style={{marginRight: 10}} onClick={saveNotes} color="secondary" variant="contained">Save</Button>
                        <Button onClick={handleCloseAddNotes} color="secondary" variant="outlined">Cancel</Button>
                    </Grid>
                </Grid>
            
            </Grid>

            </div>

        </div>
        </div>






  );
}
