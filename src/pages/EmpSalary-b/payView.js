import React from 'react';
import axios from 'axios';
import config from '../../config/config';
import CloseIcon from '@mui/icons-material/Close';
import { Stack, Container, Typography, Grid,TextField, AppBar, Toolbar, IconButton } from '@mui/material';
import DataManager from '../../controller/datacontroller';
import TicketController from '../../controller/TicketController';
import ButtonContent from '../../components/formComponents/Button';
import Moment from 'moment';

export default class ReportView extends React.Component  {
    dataManager = new DataManager();
    ticketController = new TicketController();
    constructor(props){
        super(props);
        this.state={
            commission:{},
            selected_emp:{},
            from_date:new Date(),
            to_date:new Date(),
            ticket_details:[],
            columns:[
                {
                    field: 'ticket_date',
                    headerName: 'Date',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.ticket_date}
                    </div>
                    )
                },
                {
                    field: 'Amount',
                    headerName: 'Amount',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {Number(params.row.Amount).toFixed(2)}
                    </div>
                    )
                },
                {
                    field: 'Tips',
                    headerName: 'Tips',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div> 
                         {Number(params.row.Tips).toFixed(2)} 
                    </div>
                    )
                },
                {
                    field: 'Discount',
                    headerName: 'Discount',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ {Number(params.row.Discount).toFixed(2)}
                    </div>
                    )
                }, 
            ],
            allcommission:[],
            totalpayable:0,
            cashpay:0,
            checkpay:0,
            selectedTab:'payments',
            paidamount:0, 
            transactions:[],
            disablePay: true,
            topaycash: 0,
            topaycheck:0,
            checknumber:'',
            errorText:'',
            showError: false
        }
    }
    componentDidMount(){ 
        this.getData(); 
    } 

    getData(){
        if(this.props.empSelected !== undefined){ 
            this.setState({allcommission:this.props.allcommission, commission:this.props.commission, selected_emp: this.props.empSelected, ticket_details: this.props.ticketslist, from_date: this.props.from_date, to_date: this.props.to_date}, function() {
                // console.log(this.props)
                // console.log(this.state.ticketslist, this.state.allcommission) 

                var totalpayable  = 0;
                this.state.allcommission.forEach(elmt=>{
                    console.log(elmt)
                    if(elmt.ServiceAmount !== null ){
                        totalpayable += (Number(elmt.ServiceAmount)*(Number(elmt.emp_percent)/100)) ;
                    }
                }) 
                totalpayable = totalpayable+ this.state.selected_emp.Tips - this.state.selected_emp.Discount;
                this.setState({totalpayable: totalpayable}, ()=>{
                    this.setState({
                    //     cashpay: totalpayable*(Number(this.state.commission.cash_percentage)/100),
                    // checkpay: totalpayable*(Number(this.state.commission.check_percentage)/100), 
                    topaycash: totalpayable*(Number(this.state.commission.cash_percentage)/100),
                    topaycheck: totalpayable*(Number(this.state.commission.check_percentage)/100)}, ()=>{
                        this.checkvalidation();
                    })
                })       
                
                    // console.log(this.state.selected_emp)
                    // this.dataManager.getData(`select Sum(amount) as Amount from emp_payment where employeeId=`+this.state.selected_emp.id).then(paid=>{
                    //     if(paid.length > 0){
                    //         console.log(paid)
                    //     this.setState({paidamount:paid[0].Amount !== null ? paid[0].Amount  : 0})
                    //     }
                    //     this.dataManager.getData(`select Sum(amount) as Amount, pay_mode from emp_payment where employeeId=`+this.state.selected_emp.id+` group by pay_mode`).then(detil=>{
                    //         detil.forEach(det=>{
                    //             if(det.pay_mode === 'Cash' && det.Amount !== null && det.Amount > 0){
                    //                 this.setState({  topaycash: this.state.topaycash-det["Amount"]}, ()=>{
                    //                     this.checkvalidation();
                    //                 })
                    //             }

                    //             if(det.pay_mode === 'Check' && det.Amount !== null && det.Amount > 0){
                    //                 this.setState({  topaycheck: this.state.topaycheck - det["Amount"]}, ()=>{
                    //                     this.checkvalidation();
                    //                 })
                    //             }
                    //         })
                    //     })
                    // })
                    
                    this.getTransactions();
            }); 
        }
    }

    getTransactions(){
        this.dataManager.getData(`select ep.*, u.firstName, u.lastName, u.id from emp_payment as ep join users as u on u.id= ep.employeeId where isActive=1`).then(txn=>{
            console.log(txn)
            this.setState({transactions: txn});
        })
    }

    payConfirm(){
        console.log()
        if(Number(this.state.checkpay) >= 1 && this.state.checknumber === ''){
            this.setState({ errorText:"Please enter check number." })
        }
        else{
        this.setState({showPaypopup: true})
        }
    }

    payAmount(){
        // if(this.state.cashpay>0){
            var input = {
                employeeId: this.state.selected_emp.id,
                businessId: JSON.parse(window.localStorage.getItem('businessdetail')).id,
                CashAmount:this.state.cashpay,
                CheckAmount:this.state.checkpay, 
                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                isActive:1,
                fromDate: this.state.from_date.toISOString().substring(0,10),
                toDate: this.state.to_date.toISOString().substring(0,10),
                checknumber:this.state.checknumber
            }
            var userdetail = window.localStorage.getItem('employeedetail');
            if(userdetail !== undefined && userdetail !== null){
                input["created_by"] = JSON.parse(userdetail).id;  
            }
            window.api.getSyncUniqueId().then(sync=>{ 
                input["sync_id"] = sync.syncid;
                this.ticketController.saveData({table_name:'emp_payment', data:input}).then(()=>{
                    this.getData();
                    this.props.onClose();
                })
            })

        // }
        // if(this.state.checkpay>0){
        //     var input = {
        //         employeeId: this.state.selected_emp.id,
        //         businessId: JSON.parse(window.localStorage.getItem('businessdetail')).id,
        //         amount:this.state.checkpay,
        //         pay_mode:'Check',
        //         created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
        //         isActive:1,
        //         sync_status:0
        //     }
        //     var userdetail = window.localStorage.getItem('employeedetail');
        //     if(userdetail !== undefined && userdetail !== null){
        //         input["created_by"] = JSON.parse(userdetail).id;  
        //     }
        //     window.api.getSyncUniqueId().then(sync=>{ 
        //         input["sync_id"] = sync.syncid;
        //         this.ticketController.saveData({table_name:'emp_payment', data:input}).then(()=>{
        //             this.getData()
        //         })
        //     })

        // }
    }

    checkvalidation(){
        this.setState({errorText:''})
        if(this.state.topaycash <= 0 && this.state.topaycheck <= 0){
            console.log("if condi 1")
            this.setState({disablePay: true})
        }
        else if((this.state.cashpay <=0 && this.state.checkpay <=0)){ 
            this.setState({disablePay:true})
        } 
        else if(this.state.cashpay > this.state.topaycash){
            this.setState({disablePay:true, errorText:"Cash amount should be less than $"+this.state.topaycash })
        } 
        else if(this.state.checkpay > this.state.topaycheck){ 
            this.setState({disablePay:true, errorText:"Check amount should be less than $"+this.state.topaycheck })
        }
        else if(Number(this.state.checkpay) > 0 && Number(this.state.checkpay) < 1){
            this.setState({disablePay:true, errorText:"Check amount should not be less than $1"})
        }
        else{
            console.log("if condi 13", this.state.topaycash, this.state.topaycheck, this.state.cashpay, this.state.checkpay)
            this.setState({disablePay: false})
        }
    }
    render(){  
        return (
            <div style={{height: '100%'}}>
                <Container maxWidth="xl" style={{width: "100%", height: '100%'}}>
                {/* <div  style={{width: '100%', height: '48px', display: 'flex',flexDirection:'row', marginLeft:0}}>
                                <div  cursor="pointer" style={{cursor:"pointer",width: '50%',background: (this.state.selectedTab==='payout')? '#134163': '#f0f0f0', height: '48px', textAlign: 'center', alignContent:'center', color: (this.state.selectedTab==='payout')? '#F2F2F2': '#B6B6B6',justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                                onClick={()=>{
                                    this.setState({selectedTab:'payout'})
                                    }
                                }
                                > 
                                <Typography  variant="subtitle2" align="center" noWrap  style={{cursor:"pointer",marginTop:10,marginBottom:10 }}>Payout</Typography>
                                </div>
                                <div  cursor="pointer" style={{cursor:"pointer",width: '50%',background: (this.state.selectedTab==='payments')? '#134163': '#f0f0f0', height: '48px', textAlign: 'center', alignContent:'center', color: (this.state.selectedTab==='payment')? '#F2F2F2': '#B6B6B6',justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                                onClick={()=>{ 
                                    this.setState({selectedTab:'payments'})
                                }}
                                > 
                                <Typography variant="subtitle2" align="center" noWrap  style={{cursor:"pointer",marginTop:10,marginBottom:10 }}>Payments</Typography>
                                </div>
                                
                            </div> */}


                  {this.state.selectedTab === 'payout' && <>

                    <Stack direction={'row'}  style={{
                        height:' calc(100% - 48px)',
                        marginTop: '1rem',
                        overflow: 'auto'}}>
                   <div style={{width:'50%'}}> <Grid container>
                        <Grid item xs={3}><b>Date</b></Grid> 
                        <Grid item xs={3}><b>Amount</b></Grid>
                        <Grid item xs={3}><b>Tip</b></Grid>
                        <Grid item xs={3}><b>Discount</b></Grid> 
                    </Grid>
                    {this.state.ticket_details.map(elmt=>{
                        return <>
                            <Grid container>
                                <Grid item xs={3}>
                                    <b>{elmt.ticket_date}</b>
                                </Grid> 
                                <Grid item xs={3}>{Number(elmt.Amount).toFixed(2)}</Grid>
                                <Grid item xs={3}>{Number(elmt.Tips).toFixed(2)}</Grid>
                                <Grid item xs={3}>{Number(elmt.Discount).toFixed(2)}</Grid> 
                            </Grid>
                        </>
                    })}
                    </div> 

                   <div style={{width:'50%', borderLeft:'1px solid #f0f0f0', paddingLeft:'1rem'}}>
                            <Grid container style={{margin:'1rem 0'}}>
                                <Grid item xs={6}><b>Payroll</b></Grid>
                                <Grid item xs={6}><b></b></Grid>
                            </Grid>

                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}> Amount</Grid>
                                <Grid item xs={6}><b>${Number(this.state.selected_emp.ServiceAmount).toFixed(2)}</b></Grid>
                            </Grid>

                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}>Supply</Grid>
                                <Grid item xs={6}><b>$0.00</b></Grid>
                            </Grid>
                            {this.state.allcommission.map(com=>{ 
                                if(com.emp_percent !== null){
                                return <Grid container style={{margin:'0.5rem 0'}}>
                                    <Grid item xs={6}> Payout({com.emp_percent}%) </Grid>
                                    <Grid item xs={6}><b>${(Number(com.ServiceAmount)*(Number(com.emp_percent)/100)).toFixed(2)}</b></Grid>
                                </Grid>
                                }
                                return <></>
                            })}
                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}> Discounts </Grid>
                                <Grid item xs={6}><b>${Number(this.state.selected_emp.Discount).toFixed(2)}</b></Grid>
                            </Grid>
                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}> Tips </Grid>
                                <Grid item xs={6}><b>${Number(this.state.selected_emp.Tips).toFixed(2)}</b></Grid>
                            </Grid>
                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}><b>Total</b></Grid>
                                <Grid item xs={6}><b>${Number(this.state.totalpayable).toFixed(2)}</b></Grid>
                            </Grid>
                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}><b>Cash({this.state.commission.cash_percentage+"%"})</b></Grid>
                                <Grid item xs={6}><b>${Number(this.state.totalpayable * (this.state.commission.cash_percentage / 100)).toFixed(2)}</b></Grid>
                            </Grid>
                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}><b>Check({this.state.commission.check_percentage+"%"})</b></Grid>
                                <Grid item xs={6}><b>${Number(this.state.totalpayable * (this.state.commission.check_percentage / 100)).toFixed(2)}</b></Grid>
                            </Grid>
                            <Grid container style={{margin:'0.5rem 0'}}>
                                <Grid item xs={6}><b>Paid Amount</b></Grid>
                                <Grid item xs={6}><b>${Number(this.state.paidamount).toFixed(2)}</b></Grid>
                            </Grid>
                    </div> 
                    </Stack> </>}

                    {this.state.selectedTab === 'payments' && <>
                            <Stack direction='row'>
                            <div style={{width:'100%', display:'flex',fontSize:'13px', flexDirection:'column'}}>
                                <b>Total Payable:${Number(this.state.totalpayable).toFixed(2)}</b>
                                <div style={{display:'flex', flexDireciton:'row', justifyContent:'space-between', padding:'0'}}>
                                    <b>By Cash: ${Number(this.state.topaycash).toFixed(2)}</b> 
                                    <b>By Check: ${Number(this.state.topaycheck).toFixed(2)}</b>
                                </div>
                                <div style={{display:'flex',fontSize:'13px', flexDireciton:'row', padding:0}}> 
                                    <TextField
                                        variant="outlined"
                                        value={this.state.cashpay}
                                        onChange={(e)=>{

                                            this.setState({cashpay: e.target.value}, ()=>{
                                                this.checkvalidation();
                                            })
                                        }}
                                        label="By Cash"
                                        placeholder="Cash Amount" 
                                        InputProps={{
                                        startAdornment: <b>$</b>
                                        }}
                                        onKeyDown = {(e)=>{ 
                                            if(e.key === 'e'  || e.key === "+" || e.key === "-" ){ 
                                                e.preventDefault();
                                            } 
                                
                                        if( e.keyCode > 64 && e.keyCode < 91 ) {  
                                            e.preventDefault(); 
                                        }
                                            if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) { 
                                                e.preventDefault();
                                            
                                            } 
                                        }}
                                        style={{margin:'1rem 0'}}
                                    />
                                    <TextField
                                        variant="outlined" 
                                        label="By Cash"
                                        placeholder="Cash Amount" 
                                        InputProps={{
                                        startAdornment: <b>$</b>
                                        }} 
                                        style={{margin:'1rem 0', visibility:'hidden'}}
                                    />
                                </div>
                                <div style={{display:'flex', flexDirection:'row'}}>
                                    
                                    <TextField
                                        variant="outlined"
                                        value={this.state.checkpay}
                                        onChange={(e)=>{
                                            this.setState({checkpay: e.target.value}, ()=>{
                                                this.checkvalidation()
                                            })
                                        }}
                                        label="By Check"
                                        placeholder="Check Amount" 
                                        InputProps={{
                                            startAdornment: <b>$</b>
                                        }}
                                        onKeyDown = {(e)=>{ 
                                            if(e.key === 'e'  || e.key === "+" || e.key === "-" ){ 
                                                e.preventDefault();
                                            } 
                                
                                        else if( e.keyCode > 64 && e.keyCode < 91 ) {  
                                            e.preventDefault(); 
                                        }
                                            else if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) { 
                                                e.preventDefault();
                                            
                                            } 
                                            else{
                                                
                                            }
                                        }}
                                        style={{margin:'1rem 0'}}
                                    />
                                    {this.state.checkpay >= 1 && <TextField
                                        variant="outlined"
                                        value={this.state.checknumber}
                                        onChange={(e)=>{
                                            this.setState({checknumber: e.target.value}, ()=>{
                                                this.checkvalidation();
                                            })
                                        }}
                                        label="Check Number"
                                        placeholder="Check Number"  
                                        onKeyDown = {(e)=>{ 
                                            if(e.target.value.length >= 50){
                                                e.preventDefault()
                                            }
                                        //     if(e.key === 'e'  || e.key === "+" || e.key === "-" ){ 
                                        //         e.preventDefault();
                                        //     } 
                                
                                        // if( e.keyCode > 64 && e.keyCode < 91 ) {  
                                        //     e.preventDefault(); 
                                        // }
                                        //     if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) { 
                                        //         e.preventDefault();
                                            
                                        //     } 
                                        }}
                                        style={{margin:'1rem 0 1rem 1rem'}}
                                    />}

                                    </div>
                                    {this.state.errorText != '' && <div style={{display:'flex', justifyContent:'center', marginBottom:'1rem'}}><span style={{fontSize:'12px', fontWeight:'bold', color:'red'}}>{this.state.errorText}</span></div>}
                                <ButtonContent permission_id = "pos_pay_salary" permission_label="Show Pay salary"
                                    color="success" 
                                    variant="contained" 
                                    size="small" 
                                    style={{width:'200px', margin:'0 auto'}}
                                    disabled={this.state.disablePay}
                                    onClick={()=>this.payConfirm()} 
                                    label="Pay"/>
                            </div>

                            {/* <div style={{width:'50%', paddingLeft:'1rem', borderLeft:'1px solid #f0f0f0'}}>
                                <h3>Transactions</h3>
                                {this.state.transactions.length == 0 && <p style={{padding:'1rem', fontSize:'12px'}}><b>No transactions added yet.</b></p>}
                                {this.state.transactions.length > 0 &&
                                 <Grid container>
                                    <Grid item xs={4}><b>Date</b></Grid> 
                                    <Grid item xs={4}><b>Amount</b></Grid>
                                    <Grid item xs={4}><b>Paid By</b></Grid> 
                                </Grid>
                             }
                                
                                {this.state.transactions.map(txn=>{
                                   return <Grid container style={{fontSize:'12px'}}>
                                        <Grid item xs={4}>{Moment(txn.created_at).format('MM-DD-YYYY')}</Grid> 
                                        <Grid item xs={4}>${Number(txn.Amount).toFixed(2)}</Grid>
                                        <Grid item xs={4}>{txn.pay_mode}</Grid> 
                                    </Grid>
                                })}
                            </div> */}
                            </Stack>
                    </>}
                    {this.state.showPaypopup && <div>
                    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute', zIndex:'999999'}}>
                        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                        </div>
                        <div style={{background:'#fff', height:'100%',  width:'100%', position:'relative'}}>
                        
                        <AppBar  color="primary" style={{ position: 'relative',background: 'transparent', boxShadow: 'none' }}>
  <Toolbar> 

                        <div style={{marginLeft: "auto",marginRight: -12}}>
                        
                            <IconButton
                            edge="start"
                            onClick={()=>{
                                this.setState({showPaypopup: false})
                            }}
                            aria-label="close"
                            style={{"color":'#134163'}}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                    </AppBar>

                            <div style={{overflow:'auto', textAlign:'center'}}>
                                <p>Do you want to confirm the amount?</p>

                                <div style={{display:'flex', flexDirection:'column',padding:'1rem'}}>
                                    <div style={{display:'flex', flexDirection:'row'}}>
                                        <b> Cash : </b>
                                        <b>${this.state.cashpay}</b>
                                    </div>
                                    <div style={{display:'flex', flexDirection:'row'}}>
                                        <b> Check : </b>
                                        <b>${this.state.checkpay} </b>
                                    </div>
                                    <div style={{display:'flex', flexDirection:'row', marginBottom:'2rem'}}>
                                        <b> Check Number: </b>
                                        <b>{this.state.checknumber} </b>
                                    </div>
                                    <div style={{dispaly:'flex', justifyContent:'center'}}>
                                        <ButtonContent permission_id = "pos_pay_salary" permission_label="Show Pay salary"
                                        color="success" 
                                        variant="contained" 
                                        size="small" 
                                        disabled={this.state.disablePay}
                                        onClick={()=>this.payAmount()} 
                                        label="Pay"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                </Container>
            </div>
        )
    }
}