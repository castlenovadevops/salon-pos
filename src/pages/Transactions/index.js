import React from "react"; 
import axios from 'axios';
import Moment from 'moment';
import config from '../../config/config'; 
import LoaderContent from '../../components/Modal/loadingmodal'; 

import { Card, CardContent,  Stack, Container, Typography,TextField , Grid,IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, FormControl,FormLabel, FormControlLabel, RadioGroup, Radio, InputLabel, Select, Chip, Input,  MenuItem, Checkbox } from '@mui/material';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns'; 
 
import {Print, CalendarMonthOutlined} from '@mui/icons-material';    
import NumberPad from '../../components/numberpad';
import DataManager from "../../controller/datacontroller"; 
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer'; 
import ModalHeader from '../../components/Modal/Titlebar';
 

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
export default class App extends React.Component {
  constructor(props) {
    super(props);
    
      this.state={ 
        businessdetail:{}, 
        dataManager: new DataManager(), 
        from_date:new Date(),
        to_date:new Date(),
        showDatePopup: false, 
        transactions:[],
        employeelist:[],
        selectedemps:[],
        type:'paid',
        transactiondetail:{},
        showDetail:false
    }
    
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this); 
    this.reloadPage = this.reloadPage.bind(this);
    this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
    this.handlechangeToDate = this.handlechangeToDate.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
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
    getTransactions(){  
        this.setState({isLoading: true})
        let from_date = Moment(this.state.from_date).format('YYYY-MM-DD');
        let to_date = Moment(this.state.to_date).format('YYYY-MM-DD');
        // let url = config.root+"/report/transactions"
        var input = {
            businessId: this.state.businessdetail.id,
            from_date: from_date,
            to_date: to_date, 
            transactiontype:this.state.type
        }  
        // axios.post(url, input).then((res)=>{   
        //     console.log(res.data.data);
        //     this.setState({transactions: res.data.data, isLoading: false})
        // }); 
        var sql = `select t.id as id,t.*, tp.card_type, tp.pay_mode, tp.paid_at, tp.ticket_amt as paid_amount, tp.notes from ticket as t left join ticket_payment as tp on tp.ticketref_id=t.sync_id where  t.sync_id in (select ticketref_id from ticket_payment where  (DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`' )) and tp.isActive=1  and t.businessId=`+input.businessId+``
        // console.log(sql);
        if(input.transactiontype === 'paid'){
            sql += ` and t.paid_status='paid'`;
        }
        sql +=`  order by t.updated_at desc`
        console.log(sql);
        this.state.dataManager.getData(sql).then(res=>{
            // console.log(res);
            this.setState({transactions: res, isLoading: false, showDatePopup:false},function(){
                // var dummy = []
                // for(var i=0;i<10;i++) {
                //     dummy.push(this.state.transactions[0])
                // }
                // this.setState({transactions: dummy})
            })
        })
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

        let detail = window.localStorage.getItem("businessdetail");
        this.setState({businessdetail: JSON.parse(detail)}, function(){ 
            var condition = navigator.onLine ?  true: false;
            // this.setState({isOnline: condition}, function() {
                this.getEmpDetails()
            // })
            
        });


    }

    reloadPage(){
        var condition = navigator.onLine ?  true: false;
        this.setState({isOnline: condition}, function() {
            if(!this.state.isOnline) {
                
            }
            else { 
                this.getEmpDetails()
            }
        })
    } 

    getEmpName(empid){ console.log(this.state.employeelist);
        let emp = this.state.employeelist.filter(emp=>{return emp.id === Number(empid) })
        if(emp.length>0){
            return emp[0].firstName+" "+emp[0].lastName;
        }
        else{
            return ''
        }
    }

    checkEmp(empid){
        return this.state.selectedemps.indexOf(empid) > -1 ? true : false;
    }

    getEmpDetails(){
        this.setState({isLoading: true})
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            
            this.state.dataManager.getData("select * from users").then(res=>{
                if(res.length > 0){
                    var empids = res.map(r=>r.id);
                    this.setState({isLoading: false,employeelist:res,selectedemps: empids}, function(){
                        console.log(this.state.employeelist);
                        this.getTransactions()
                    })
                }
                else{
                    this.getTransactions()
                }
            })

            // let url = config.root+"employee/"+JSON.parse(businessdetail).id
            //console.log("1.getEmpDetails",url)

            // axios.get(url).then((res)=>{
            //     //console.log("2.getEmpDetails") 
            //         if(res.data.data.length>0) {
            //             // this.getEmp(res.data.data[0])
            //             var data = res.data.data 
            //             var empids = data.map(r=>r.id);
            //             this.setState({isLoading: false,employeelist:data,selectedemps: empids}, function(){
            //                 this.getTransactions()
            //             })
            //         } 
            //         else{
            //             this.getTransactions()
            //         }
            // });
        }
    }


    renderContent(){
        return <div style={{ background: 'white',height: '100%'}}> 

            
            <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', flexDirection:'row', margin:10}}>
                {/* <FormControl component="fieldset">
                    <RadioGroup row aria-label="card" name="row-radio-buttons-group">
                        <FormControlLabel value={this.state.type} checked={this.state.type === 'paid'} control={<Radio value="paid" />} onChange={(e)=>{ 
                            this.setState({type:'paid'}, ()=>{
                                this.getTransactions();
                            })
                         }} label="Paid" />
                        <FormControlLabel value={this.state.type} checked={this.state.type === 'notpaid'} control={<Radio value="notpaid" />} onChange={(e)=>{ this.setState({type:'notpaid'}, ()=>{
                            this.getTransactions();
                        }) }}  label="Not Paid" />
                    </RadioGroup>
                </FormControl> */}
                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}> 
                    <IconButton onClick={()=>{
                        this.setState({showDatePopup: true})
                    }}><CalendarMonthOutlined/></IconButton>
                </div>

            </div>

            <Card style={{ background: 'white',height: '90%'}}>
            {this.state.type === 'paid' && <div style={{height: "100%"}}><Grid container spacing={3}  style={{height:'40px', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                    Date
                </Grid>
                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                    Ticket
                </Grid>
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                    Transaction #
                </Grid>
                {/* <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                    Transaction Type
                </Grid> */}
                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                    Total
                </Grid>
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', fontWeight:'bold'}}> 
                    Payment Mode
                </Grid> 
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                    Paid On
                </Grid>
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', fontWeight:'bold'}}> 
                    Employee 
                </Grid>
            </Grid>
            <div style={{ width: '100%', height:  'calc(100% - 60px)',overflow: 'hidden', background: 'white'}}>
        
            <div style={{width: '100%', height: 'calc(100% - 0px)',paddingLeft: 0,paddingTop: 0,paddingBottom: 0,overflowY:'auto', overflowX:'hidden', 
            boxSizing: 'content-box', background: 'white'}}>
            {this.state.transactions.map(t=>{ 
                // console.log("transactions:",t)
                return <Grid container spacing={3}  style={{height:'80px', cursor:'pointer', width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}} onClick={()=>{ 
                    this.setState({transactiondetail: t}, ()=>{
                        this.setState({showDetail: true})
                    })
                }}>
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px'}}> 
                    {Moment(t.created_at).format("HH:mm:ss a")}<br/>
                    <span style={{color:'#ccc'}}>{Moment(t.created_at).format("MM/DD/YYYY")}</span>
                </Grid>
                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                     {t.ticket_code}
                </Grid>
                {/* <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                     
                </Grid> */}
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                    <b>Payment</b>
                </Grid>
                <Grid item xs={1} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px'}}> 
                    <b>${Number(t.paid_amount).toFixed(2)}</b>
                </Grid>
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:10, fontSize:'14px', textTransform:'capitalize'}}> 
                    <b>{t.pay_mode !== null && t.pay_mode.toLowerCase() === 'cash' ? 'Cash' : t.card_type}</b>
                </Grid> 
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px'}}> 
                    {Moment(t.paid_at).format("HH:mm:ss a")}<br/>
                    <span style={{color:'#ccc'}}>{Moment(t.paid_at).format("MM/DD/YYYY")}</span>
                </Grid>
                <Grid item xs={2} style={{height:'100%',width:'100%', margin:0, padding:'10px 20px', fontSize:'14px', textTransform:'capitalize'}}> 
                    {this.getEmpName(t.technician_id)}
                </Grid>
            </Grid>
            })}
            </div></div>
           
           
            {this.state.isLoading === false && this.state.transactions.length === 0 && <div>
                <p style={{fontSize:'14px', width:'100%', textAlign:'center'}}>No transactions added yet.</p>
            </div>}
            </div>}
            </Card>
            
            {this.state.type !== 'paid' &&<>
            <Grid container spacing={3}  style={{height:'calc(100% - 100px)', background:'#f0f0f0', width:'100%', margin:'10px 0', padding: 0}}>
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                    Date
                </Grid> 
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                    Ticket code
                </Grid>
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                    Total
                </Grid>
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:10}}> 
                    Employee 
                </Grid>
            </Grid>
            {this.state.transactions.map(t=>{ 
                return <Grid container spacing={3}  style={{height:'calc(100% - 100px)',background:(t.isDelete === 0 ? 'transparent': 'rgba(255,0,0,0.3)'),  width:'100%', margin:0, padding: '10px 0',borderBottom:'1px solid #f0f0f0'}}>
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                    {Moment(t.created_at).format("HH:mm:ss a")}<br/>
                    <span style={{color:'#ccc'}}>{Moment(t.created_at).format("MM/DD/YYYY")}</span>
                </Grid>
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                     {t.ticket_code}
                </Grid> 
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                    <b>${Number(t.grand_total).toFixed(2)}</b>
                </Grid> 
                <Grid item xs={3} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px', textTransform:'capitalize'}}> 
                    {this.getEmpName(t.technician_id)}
                </Grid>
            </Grid>
            })}
            </>}
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
                            <Button variant="contained" onClick={()=>{ this.getTransactions()}}> Get Transactions </Button>
                        </DialogActions>
            </Dialog>  

            <Dialog
                    className="custommodal"
                        open={this.state.showDetail} 
                        onClose={()=>{
                            this.setState({showDetail: false, transactiondetail:{}})
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{borderRadius:'10px', width:'40%', margin:'auto'}}
                    >
                        <DialogTitle id="alert-dialog-title">
                        <ModalHeader title="" onClose={()=>{
                            this.setState({showDetail: false, transactiondetail:{}})
                        }} />
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        
                                <Grid container style={{display:'flex', flexDirection:'row'}}>
                                <Grid item xs={12}>
                                   {this.state.transactiondetail.id !== undefined && <Grid item xs={12} style={{padding:'20px',display:'flex', flexDirection:'row'}}> 
                                        <Grid item xs={3} md={3}><b>Payment</b></Grid>
                                        <Grid item xs={6} md={6}> 
                                            <Grid item xs={12} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                                                {Moment(this.state.transactiondetail.created_at).format("HH:mm:ss a MM/DD/YYYY")} <br/><br/>
                                               <b>Tender:</b> {this.state.transactiondetail.pay_mode.toLowerCase() === 'cash' ? this.state.transactiondetail.pay_mode : this.state.transactiondetail.card_type}<br/>
                                               <b>Ticket Code:</b> {this.state.transactiondetail.ticket_code}<br/>
                                               <b>Employee:</b> {this.getEmpName(this.state.transactiondetail.technician_id)}<br/><br/>
                                               {this.state.transactiondetail.notes && <> <b>Notes:</b><br/> {this.state.transactiondetail.notes}</> }
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={3}  md={3}>
                                            <Grid item xs={12} style={{height:'100%',width:'100%', margin:0, padding:'10px', fontSize:'14px'}}> 
                                                <b>${Number(this.state.transactiondetail.grand_total).toFixed(2)}</b>
                                            </Grid> 
                                        </Grid>
                                    </Grid> }
                                    </Grid>

                                    <Grid item xs={12} style={{position:'absolute', bottom:0, left:0, right:0, borderTop:'1px solid #f0f0f0',display:'flex', flexDirection:'row', padding:10}}>

                                    <Grid item xs={9} md={9}> <h3>Total</h3></Grid>
                                    <Grid item xs={3} md={3}> <h3>${Number(this.state.transactiondetail.grand_total).toFixed(2)}</h3></Grid>

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
