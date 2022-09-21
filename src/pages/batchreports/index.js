import React from "react";  
import Moment from 'moment'; 
import LoaderContent from '../../components/Modal/loadingmodal'; 

import { Card, CardContent,  Stack, Container, Typography,TextField , Grid,IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, FormControl,FormLabel, FormControlLabel, RadioGroup, Radio, InputLabel, Select, Chip, Input,  MenuItem, Checkbox } from '@mui/material';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns'; 
 
import {Print, CalendarMonthOutlined} from '@mui/icons-material';     
import DataManager from "../../controller/datacontroller"; 
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer'; 
import ModalHeader from '../../components/Modal/Titlebar';
 
import AlertModal from '../../components/Modal/alertModal';
import QueryManager from "../../controller/queryManager";
import moment from 'moment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

const section = {
  height: '100%',
  marginTop: 10, 
  display:'flex', 
  justifyContent:'center', 
  alignItems:'center',  
  width:'25%'
};
export default class BatchReports extends React.Component {
    queryManager = new QueryManager();
  constructor(props) {
    super(props);
    
      this.state={ 
        businessdetail:{}, 
        dataManager: new DataManager(), 
        from_date:new Date(),
        to_date:new Date(),
        showDatePopup: false, 
        batches:[],   
        tickets:[],
        batchDetail:{},
        showDetail:false,
        printalert:false
    }
    
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);  
    this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
    this.handlechangeToDate = this.handlechangeToDate.bind(this);
    this.getBatchReports = this.getBatchReports.bind(this);
    this.getBatchTickets = this.getBatchTickets.bind(this);
    this.showBatchDetail = this.showBatchDetail.bind(this);
  }
 
    handlechangeFromDate(e){
        this.setState({from_date: e});
    }
    handlechangeToDate(e){
        this.setState({to_date: e});
    }

    handleClick(){
    // //console.log(event.target)
        this.setState({anchorEl:null, openMenu:true, editForm:false, addForm:false});
    }


    handleCloseMenu(){
        this.setState({anchorEl:null, openMenu:false});
    }
    handlePageEvent(pagename){
        this.props.onChangePage(pagename);
    }
     
    handleClickInvent(opt){
        if(opt === 'inventory')
            this.setState({expand_menu_show : !this.state.expand_menu_show});
        if(opt === 'settings')
            this.setState({setting_menu_show : !this.state.setting_menu_show});
    } 
    
    logout(){ 
        window.localStorage.removeItem("employeedetail")
        window.location.reload();
    }
    

    componentDidMount(){ 
        this.setState({isLoading: true})
        let detail = window.localStorage.getItem("businessdetail");
        this.setState({businessdetail: JSON.parse(detail)}, function(){  
                this.getBatchReports() 
        });
    }


    getBatchReports(){
        this.queryManager.getBatchReports(this.state.from_date, this.state.to_date).then(r=>{
            this.setState({batches: r, isLoading: false, showDatePopup: false})
        })
    }

    getBatchTickets(batch){
        var batchid = batch.sync_id;
        this.queryManager.getBatchTickets(batchid).then(tickets=>{
            this.setState({tickets: tickets, batchDetail: batch })
        })
    }

    showBatchDetail(t){
        this.queryManager.getBatchTickets(t.sync_id).then(tickets=>{
            var obj = t;
            obj["tickets"] = tickets;

            this.setState({batchDetail: obj}, ()=>{
                console.log(this.state.batchDetail)
                this.setState({showDetail: true})
            }) 
        })
    }

    renderContent(){
        return <div style={{ background: 'white',height: '100%'}}>  
            <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', flexDirection:'row', margin:10}}> 
                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}> 
                    <IconButton onClick={()=>{
                        this.setState({showDatePopup: true})
                    }}><CalendarMonthOutlined/></IconButton>
                </div>

            </div>

            <Card style={{ background: 'white',height: '90%'}}>
                <div style={{height: "100%"}}>
                    <Grid container spacing={3}  style={{height:'40px', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                            Date
                        </Grid>
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            Batch ID
                        </Grid> 
                        <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            Batch Name
                        </Grid>
                        <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            Number of Tickets
                        </Grid> 

                        <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                            
                        </Grid> 
                    </Grid>
                    {this.state.batches.length > 0 && <div style={{ width: '100%', height:  'calc(100% - 60px)',overflow: 'hidden', background: 'white'}}>
                
                        <div style={{width: '100%', height: 'calc(100% - 0px)',paddingLeft: 0,paddingTop: 0,paddingBottom: 0,overflowY:'auto', overflowX:'hidden', 
                        boxSizing: 'content-box', background: 'white'}}>
                        {this.state.batches.map(t=>{ 
                            // console.log("transactions:",t)
                            return <Grid container spacing={3}  style={{height:'80px', cursor:'pointer', width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}} >
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px'}} onClick={()=>{ this.showBatchDetail(t)}}> 
                                    {Moment(t.created_at).format("MM/DD/YYYY HH:mm:ss a")}
                                </Grid>
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}} onClick={()=>{ this.showBatchDetail(t); }}> 
                                    {t.batchId}
                                </Grid> 
                                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}} onClick={()=>{  this.showBatchDetail(t); }}> 
                                    <b>{t.batchName}</b>
                                </Grid>
                                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}} onClick={()=>{ this.showBatchDetail(t);}}> 
                                    <b>{t.ticketCount}</b>
                                </Grid> 
                                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', textTransform:'capitalize'}}> 
                                    <Print style={{marginLeft:'1rem'}} onClick={(e)=>{
                                        e.preventDefault();
                                    }}/>
                                </Grid>
                            </Grid>
                        })}
                        </div>
                    </div> }
                
                    {this.state.isLoading === false && this.state.batches.length === 0 && <div>
                        <p style={{fontSize:'14px', width:'100%', textAlign:'center'}}>No batches added yet.</p>
                    </div>}
                </div>
            </Card> 
        </div>
    }
    
    getTickets(){

    }

    render() {
        return(
            <div style={{height:'100%'}}> 

                {this.state.isLoading &&  <LoaderContent show={this.state.isLoading}></LoaderContent>}
                <AppBarContent  businessdetail={this.state.businessdetail} currentTime={this.state.currentTime}  
                handleClick={()=>this.handleClick()}   /> 
                
                <div style={{height:'100%'}}>  
                    <DrawerContent 
                    anchor={this.state.anchor} 
                    open={this.state.openMenu} 
                    expand_menu_show={this.state.expand_menu_show}
                    setting_menu_show={this.state.setting_menu_show}
                    onClose={()=>this.handleCloseMenu()}  
                    onhandleClickInvent={(opt)=>this.handleClickInvent(opt)} 
                    onlogout={()=>this.logout()} 
                    onhandlePageevent= {(pagename)=>this.handlePageEvent(pagename)}
                    /> 
                    <Grid container spacing={3}  style={{height:'calc(100% - 36px)', width:'100%', margin:0, padding: 0}}>
                            <Grid item xs={12} style={{height:'100%',width:'100%', margin:0, padding:0}}> 
                                <div  style={{height: '100%', padding:0}}>
                                    <Container maxWidth="xl" style={{margin: '0', padding:0,  height: '100%'}}>  
                                    
                                    {this.renderContent() }
                                        {/* {this.state.isOnline && this.renderContent() }
                                        {!this.state.isOnline && <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                                <img style={{height:'100px'}} alt="offline" src="./assets/images/offline.png"/>
                                                <Typography variant="h4" style={{color:"#ccc"}}>You are offline.</Typography>
                                                <Typography variant="subtitle2" style={{color:"#ccc", marginBottom:'1rem'}}>Please try again later.</Typography>
                                                <Button variant="contained" onClick={this.reloadPage}>Reload</Button>
                                            </div>
                                        } */}
                                    </Container>
                                </div>
                            </Grid>
                    </Grid> 

                    {this.state.printalert &&  <AlertModal title="Alert" msg="No printers added yet." handleCloseAlert={()=>this.setState({printalert:false})}/>}
            <Dialog
                    className="custommodal"
                        open={this.state.showDatePopup}
                        onClose={()=>{
                            this.setState({showDatePopup: false, from_date: new Date(), to_date:new Date(), reporttype:'daily'})
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{borderRadius:'10px'}}
                    >
                        <DialogTitle id="alert-dialog-title">
                        <ModalHeader title="Select Date" onClose={()=>{
                            this.setState({showDatePopup: false})
                        }} />
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        
                                <Grid container>
                                    
                                    <Grid item xs={12} style={{padding:'20px'}}>
                                        <form autoComplete="off" noValidate> 
                                            <Stack direction={'column'}> 
                                                <div  style={{margin:'10px 0'}}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth >
                                                    <DesktopDatePicker
                                                        label="From"
                                                        inputFormat="MM/dd/yyyy"
                                                        maxDate={new Date()}
                                                        style={{marginRight:'10px'}}
                                                        value={this.state.from_date}
                                                        onChange={this.handlechangeFromDate}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                                </div>
                                                <div  style={{margin:'10px 0'}}>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth 
                                                            style={{marginLeft:'10px'}}>
                                                        <DesktopDatePicker
                                                            label="To"
                                                            inputFormat="MM/dd/yyyy"
                                                            minDate={this.state.from_date}
                                                            maxDate={new Date()}
                                                            value={this.state.to_date} 
                                                            onChange={this.handlechangeToDate}
                                                            style={{marginLeft:'10px'}}
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </LocalizationProvider>    
                                                </div>
                                            </Stack>
                                        </form>  
                                    </Grid> 
                                </Grid>
                        
                        </DialogContentText>
                            </DialogContent>
                        <DialogActions style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}>
                            <Button variant="contained" onClick={()=>{ this.getBatchReports()}}> Get Batches </Button>
                        </DialogActions>
            </Dialog>  
 
            <Dialog
                    className="batchmodal"
                        open={this.state.showDetail} 
                        onClose={()=>{
                            this.setState({showDetail: false, batchdetail:{}})
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{borderRadius:'10px', width:'80%', margin:'auto'}}
                    >
                        <DialogTitle id="alert-dialog-title">
                        <ModalHeader title="" onClose={()=>{
                            this.setState({showDetail: false, batchdetail:{}})
                        }} />
                        </DialogTitle>
                        <DialogContent style={{width:'100%', maxWidth:'100%'}}>
                        <DialogContentText style={{width:'100%', maxWidth:'100%'}} id="alert-dialog-description">
                        
                                <Grid container style={{display:'flex', flexDirection:'row'}}>
                                <Grid item xs={12}>
                                   {this.state.batchDetail.sync_id !== undefined && <>
                                                    <Grid item xs={12} style={{padding:'10px',display:'flex', flexDirection:'row'}}> 
                                                            <Grid item xs={3} md={3}><b>Batch Id</b></Grid>
                                                            <Grid item xs={6} md={6}>  {this.state.batchDetail.batchId} </Grid> 
                                                    </Grid> 
                                                    <Grid item xs={12} style={{padding:'10px',display:'flex', flexDirection:'row'}}> 
                                                        <Grid item xs={3} md={3}><b>Batch Name</b></Grid>
                                                        <Grid item xs={6} md={6}>  {this.state.batchDetail.batchName} </Grid> 
                                                    </Grid>
                                                    <Grid item xs={12} style={{padding:'10px',display:'flex', flexDirection:'row'}}> 
                                                        <Grid item xs={3} md={3}><b>Batch Created Time</b></Grid>
                                                        <Grid item xs={6} md={6}>  {moment(this.state.batchDetail.created_at).format('MM/DD/YYYY HH:mm:ss a')} </Grid> 
                                                    </Grid> 
                                                    <Grid item xs={12} style={{padding:'8px',display:'flex', flexDirection:'row', background:'#ccc'}}> 
                                                            <Grid item xs={3} md={3}><b>Payment Date</b></Grid>
                                                            <Grid item xs={3} md={3}><b>Ticket Code</b></Grid>
                                                            <Grid item xs={3} md={3}><b>Amount</b></Grid>
                                                            <Grid item xs={3} md={3}><b>Payment mode</b></Grid>
                                                    </Grid>
                                            {this.state.batchDetail.tickets.map(t=>{
                                                return <>
                                                    <Grid item xs={12} style={{ display:'flex', flexDirection:'row'}}> 
                                                        <Grid item xs={3} md={3}>{moment(t.paid_at).format('MM/DD/YYYY HH:mm:ss a')} </Grid>
                                                        <Grid item xs={3} md={3}>{t.ticket_code}</Grid>
                                                        <Grid item xs={3} md={3}>{t.ticket_amt}</Grid>
                                                        <Grid item xs={3} md={3} style={{textTransform:'capitalize'}}>{t.card_type+" Card"}</Grid>
                                                    </Grid>
                                                </>
                                            })}</> }
                                    </Grid> 
                                </Grid>
                        
                        </DialogContentText>
                            </DialogContent>
                        <DialogActions style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}> 
                        </DialogActions>
            </Dialog>  

                </div> 
            </div>
        )
    }
 
}
