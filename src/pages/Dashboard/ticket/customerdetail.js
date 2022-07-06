import React from 'react';
import { Grid, Typography, Card} from '@material-ui/core/'; 
import Moment from 'moment';
import CloseIcon from '@mui/icons-material/Close'; 

const cusDetail ={
  margin:'10px'
} 
export default function CustomerDetailModal(
    {
        open,
        onClose,
        handleClosePayment,
        customerDetail

}) 

{
  return (
      <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
        </div>
        <Card style={{background:'#fff', width:'40%', margin:'10% auto 0', position:'relative', borderRadius: 10}}>

          <Grid container spacing={2}>
            <Grid item xs={12} style={{display:'flex',marginTop: 20, marginLeft: 10, marginRight: 10, background: 'white'}}>
              <Grid item xs={5} style={{marginLeft: 10, color:'#134163' }}>
              <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold', marginTop: 0}} variant="subtitle2" noWrap >{customerDetail.name}</Typography>
              </Grid>

              <Grid item xs={5}>
                  
              </Grid>
              <Grid item xs={2} style={{marginRight: 20}}>
                 
                  <Typography variant="subtitle2" align="right" style={{cursor:'pointer'}} onClick={onClose}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
              </Grid>      
            </Grid>

          </Grid>
   


        <div style={{marginTop: 20,  justifyContent:'center', alignItems:'center', background: 'white',}} >
       

        <Grid container spacing={0}  direction="column" alignItems="center"  justifyContent="center" style={{background: 'white'}} >

        
        
          <Grid style={{display:"flex", background: 'white', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" noWrap align="left">Member ID : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap >{customerDetail.member_id}</Typography>
          </Grid>   

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" noWrap align="left">Phone : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap >{customerDetail.phone !== ''  && customerDetail.phone !== null ? customerDetail.phone : '--' }</Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" noWrap align="left">Email : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>{customerDetail.email !== '' ? customerDetail.email : '--' }</Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" align="left"noWrap >DOB : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>{customerDetail.dob !== '' && customerDetail.dob !== null ? Moment(customerDetail.dob).format('MM-DD-YYYY') : '--'} </Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" align="left" noWrap >First Visit : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>{customerDetail.created_at !== null ? Moment(customerDetail.created_at).format('MM-DD-YYYY') : '--'} </Typography>
          </Grid>

          <Grid  style={{display:'flex', width: '100%', marginLeft: 20}}>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" color="textSecondary" align="left" noWrap>Last Visit : </Typography>
            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="left" noWrap>--</Typography>
          </Grid>


         
          
        </Grid> 

        
        <Grid container spacing={0}  direction="row" alignItems="center"  justifyContent="center" style={{marginTop: 20, marginBottom: 20}}>

          <Grid style={{display:'column', background: 'white'}} alignItems="center"  justifyContent="center">
                <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="center"> {customerDetail.visit_count !== '' ? customerDetail.visit_count : '--'}</Typography>
                <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold'}} variant="subtitle2"  color="textSecondary" align="center" noWrap >Visit Count</Typography>
              
          </Grid>

          <div style={{marginLeft:10, marginRight: 10,width:1,height: 60, background: '#D7D7D7'}}></div>

          <Grid style={{display:'column', background: 'white'}} alignItems="center"  justifyContent="center">
              <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="center"> $ {customerDetail.total_spent !== '' ? customerDetail.total_spent : 0 }</Typography>
              <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold'}} variant="subtitle2"  color="textSecondary" align="center" noWrap >Total Spent </Typography>
             
          </Grid>

          <div style={{marginLeft:10, marginRight: 10,width:1,height: 60, background: '#D7D7D7'}}></div>


          <Grid style={{display:'column', background: 'white'}} >

            <Typography id="modal-modal-title" style={cusDetail} variant="subtitle2" align="center"> { customerDetail.loyality_point !== null && customerDetail.loyality_point !== '' ? customerDetail.loyality_point : '--'}</Typography>
            <Typography id="modal-modal-title" style={{margin:'10px',  fontWeight: 'bold'}} variant="subtitle2"  color="textSecondary" align="center" noWrap >Loyality Points</Typography>
            
          </Grid>

           
           

        </Grid>
       

        </div>

      </Card>
      </div> 
  );
}
