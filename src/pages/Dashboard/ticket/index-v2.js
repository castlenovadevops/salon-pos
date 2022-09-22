import React from 'react';
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'; 
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box'; 
import {  Stack, IconButton,TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import Print from '@mui/icons-material/Print';
import Slide from '@material-ui/core/Slide';
import AlertModal from '../../../components/Modal/alertModal';
import axios from 'axios';
import {CalendarMonthOutlined} from '@mui/icons-material';
//import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import ModalHeader from '../../../components/Modal/Titlebar';
import CreateTicket from './createTicket';

import Modal from '@material-ui/core/Modal'; 
import TableContent from '../../../components/formComponents/DataGrid';
import Datamanager from '../../../controller/datacontroller'; 
import TicketManager from '../../../controller/TicketManager'; 
import config from '../../../config/config';
import * as Moment from 'moment';
import LoadingModal from '../../../components/Modal/loadingmodal';
import CommonModal from '../../../components/Modal/commonmodal';
import DrawerContent from '../../Drawer';
import AppBarContent from '../../TopBar'; 
import ClockInOutModal from '../../ClockInOut';
// import CreateTicketModal from './modal'; 
import PaymentModal from './TicketPayment'; 
import TicketController  from '../../../controller/TicketController';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other} style={{ height: 'calc(100% - 40px)'}}
    >
      {value === index && (
        <Box style={{ height:'calc(100% - 40px)', padding:'0' }} sx={{ p: 3 }}>
          <Typography component="div" style={{ height: '100%'}}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}; 

export default class TicketDashboard extends React.Component {
    
  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" />;
  });

interval;
ticketController = new TicketController();
constructor(props){
    super(props);
    this.state={
        businessdetail:{},
        openD : false,
        dateerror: false,
        isTicketEdit: false,
        isOnline: false,
        open: false,
        age: '',
        tech:'',
        value: 0,
        openTicket: false,
        passcode: "",
        clockin: [],
        reason: "",
        clockedout: false,
        printalert:false,
        dataManager: new Datamanager(),
        addDialog: false,
        editDialog: false,
        ticket_list:[],
        isempLogin : true,
        isbusinesslogin:true,
        employeedetail: {},
        createTicketOption: false,
        anchor:"left",
        anchorEl: null,
        openMenu:false,
        openPayment:false,
        ticketDetail:{},
        staff_list:[],
        ticketowner:{},
        selectedTicket:{},
        unsyncedCount: 0,
        unpaid_ticket_list: [],
        paid_ticket_list:[],
        hide: false,
        ticketManager: new TicketManager(this.props),
        
        columns: [

            {
                field: 'ticket_code',
                headerName: 'Ticket Code',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                    <Typography variant="subtitle2" 
                    style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                        {params.row.ticket_code}</Typography>

                )
            },
            {
                field: 'customer_id',
                headerName: 'Customer Name',
                flex: 1,
              
                editable: false,
                renderCell: (params) => (
                    <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {params.row.customer_name !== null && params.row.customer_name !== '' ? params.row.customer_name : 'NA'}
                      </Typography>
                )
            },
            {
                field: 'price',
                headerName: 'Price',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                  
                    <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {params.row.grand_total !== null ? "$"+ Number(params.row.grand_total.toString()).toFixed(2) : 'NA'}
                      </Typography>
                )
            },
            
            {
                field: 'created_at',
                headerName: 'Time',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
                       */} 
                       {Moment(params.row.created_at).format('MM-DD-YYYY hh:mm a')}

                       {/* {params.row.created_at} */}
                       
                      </Typography>
                )
            },
            {
                field: 'payment',
                headerName: 'Payment Mode',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                
                  <div style={{"float":"right", display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {(params.row.paid_status !== 'paid' && this.state.value===0)&&
                     <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className='bgbtn'
                        style={{ marginLeft: 16 }}
                        onClick={(event) => {
                            // event.nativeEvent.stopPropagation()
                            this.handleTicketPayment(params.row)
                            //console.log("payment")
                        }}
                    >
                        Pay
                    </Button>}
                    {(params.row.paid_status === 'paid') && <b style={{textTransform:'capitalize'}}>{params.row.pay_mode}</b>}
                    <Print style={{marginLeft:'1rem'}} onClick={()=>this.handleTicketPrint(params.row)}/>
                  </div>
                )
            },
        ],
        reponsiveColumns: [

            {
                field: 'ticket_code',
                headerName: 'Ticket Code',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                    <Typography variant="subtitle2" 
                    style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                        {params.row.ticket_code}</Typography>

                )
            },
           
            {
                field: 'price',
                headerName: 'Price',
                flex: 0,
                editable: false,
                renderCell: (params) => (
                  
                    <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {params.row.grand_total !== null ? "$"+ Number(params.row.grand_total.toString()).toFixed(2) : 'NA'}
                      </Typography>
                )
            },
            {
                field: 'created_at',
                headerName: 'Time',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
                       */} 
                       {Moment(params.row.created_at).format('YYYY-MM-DD hh:mm a')}

                       {/* {params.row.created_at} */}
                       
                      </Typography>
                )
            },
           
            {
                field: '',
                headerName: 'Payment',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                
                  <div style={{"float":"right", display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {(params.row.paid_status !== 'paid' && this.state.value===0)&&
                     <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className='bgbtn'
                        style={{ marginLeft: 16 }}
                        onClick={(event) => {
                            // event.nativeEvent.stopPropagation()
                            this.handleTicketPayment(params.row)
                            //console.log("payment")
                        }}
                    >
                        Pay
                    </Button>}
                    {(params.row.paid_status === 'paid') && <b style={{textTransform:'capitalize'}}>{params.row.pay_mode}</b>}
                   <Print  style={{marginLeft:'1rem'}} onClick={()=>this.handleTicketPrint(params.row)}/>
                  </div>
                )
            },
        ],
        closedticket_columns: [

            {
                field: 'ticket_code',
                headerName: 'Ticket Code',
                flex: 0,
                minWidth:100,
                editable: false,
                renderCell: (params) => (
                    <div>
                    <Typography variant="subtitle2" 
                    style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', textAlign:'left !important'}} align="left">
                        {params.row.ticket_code}</Typography>
                        {/* <Typography style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',color:'#ccc',fontSize:'12px'}} align="left">
                         {Moment(params.row.created_at).format('MM-DD-YYYY hh:mm a')}                         
                        </Typography> */}
                    </div>

                )
            },
            {
                field: 'customer_id',
                headerName: 'Customer Name',
                flex: 1,
              
                editable: false,
                renderCell: (params) => (
                    <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {params.row.customer_name !== null && params.row.customer_name !== '' ? params.row.customer_name : 'NA'}
                      </Typography>
                )
            },
            {
                field: 'price',
                headerName: 'Price',
                flex: 0,
                minWidth:100,
                editable: false,
                renderCell: (params) => (
                  
                    <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {params.row.grand_total !== null ? "$"+ Number(params.row.grand_total.toString()).toFixed(2) : 'NA'}
                      </Typography>
                )
            },
            {
                field: 'created_at',
                headerName: 'Time',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
                       */} 
                       {Moment(params.row.created_at).format('MM-DD-YYYY hh:mm a')}

                       {/* {params.row.created_at} */}
                       
                      </Typography>
                )
            },
            {
                field: 'paid_at',
                headerName: 'Paid Time',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
                       */} 
                       {Moment(params.row.paid_at).format('MM-DD-YYYY hh:mm a')}

                       {/* {params.row.created_at} */}
                       
                      </Typography>
                )
            },
            {
                field: 'payment',
                headerName: 'Payment',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                
                  <div style={{"float":"right", display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {(params.row.paid_status !== 'paid' && this.state.value===0)&&
                     <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className='bgbtn'
                        style={{ marginLeft: 16 }}
                        onClick={(event) => {
                            // event.nativeEvent.stopPropagation()
                            this.handleTicketPayment(params.row)
                            //console.log("payment")
                        }}
                    >
                        Pay
                    </Button>}
                    {(params.row.paid_status === 'paid') && <b style={{textTransform:'capitalize'}}>{params.row.pay_mode}</b>}
                    <Print style={{marginLeft:'1rem'}} onClick={()=>this.handleTicketPrint(params.row)}/>
                  </div>
                )
            },
        ],
        closedticket_reponsiveColumns: [

            {
                field: 'ticket_code',
                headerName: 'Ticket Code',
                flex: 0,
                minWidth:100,
                editable: false,
                renderCell: (params) => (
                    <div>
                    <Typography variant="subtitle2" 
                    style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                        {params.row.ticket_code}</Typography>
                        {/* <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                         {Moment(params.row.created_at).format('MM-DD-YYYY hh:mm a')}                         
                        </Typography> */}
                    </div>

                )
            },
           
            {
                field: 'price',
                headerName: 'Price',
                flex: 0,
                minWidth:100,
                editable: false,
                renderCell: (params) => (
                  
                    <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {params.row.grand_total !== null ? "$"+ Number(params.row.grand_total.toString()).toFixed(2) : 'NA'}
                      </Typography>
                )
            },
            // {
            //     field: 'created_at',
            //     headerName: 'Time',
            //     flex: 1,
            //     editable: false,
            //     renderCell: (params) => (
            //             <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
            //           {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
            //            */} 
            //            {Moment(params.row.created_at).format('YYYY-MM-DD hh:mm a')}

            //            {/* {params.row.created_at} */}
                       
            //           </Typography>
            //     )
            // },
            {
                field: 'paid_at',
                headerName: 'Paid Time',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {/* {Moment(params.row.created_at).format('ddd DD MMM HH:MM a')}
                       */} 
                       {Moment(params.row.paid_at).format('YYYY-MM-DD hh:mm a')}

                       {/* {params.row.created_at} */}
                       
                      </Typography>
                )
            },
           
            {
                field: 'payment',
                headerName: 'Payment',
                flex: 1,
                editable: false,
                renderCell: (params) => (
                
                  <div style={{"float":"right", display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {(params.row.paid_status !== 'paid' && this.state.value===0)&&
                     <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className='bgbtn'
                        style={{ marginLeft: 16 }}
                        onClick={(event) => {
                            // event.nativeEvent.stopPropagation()
                            this.handleTicketPayment(params.row)
                            //console.log("payment")
                        }}
                    >
                        Pay
                    </Button>}
                    {(params.row.paid_status === 'paid') && <b style={{textTransform:'capitalize'}}>{params.row.pay_mode}</b>}
                   <Print  style={{marginLeft:'1rem'}} onClick={()=>this.handleTicketPrint(params.row)}/>
                  </div>
                )
            },
        ],
        currentTime: "",
        mobileOpen: false, 
        openDialog: false,
        msg: '',
        addEmpReportDialog: false,
        isLoading: false,
        showPage:'',
        isSyncing:false,
        services_taken:[],
        from_date:new Date(),
        to_date:new Date(),
        showDatePopup: false, 
    }
    this.handlePageEvent = this.handlePageEvent.bind(this);
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleOpenTicket = this.handleOpenTicket.bind(this)
    this.handleCloseTicket = this.handleCloseTicket.bind(this)
    this.onClockin = this.onClockin.bind(this)
    this.onClockout = this.onClockout.bind(this)
    this.handleChangeCode = this.handleChangeCode.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.logout = this.logout.bind(this)
    this.handleClick = this.handleClick.bind(this) 
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleTicketPayment = this.handleTicketPayment.bind(this) 
    this.handleClosePayment = this.handleClosePayment.bind(this) 
    this.logoutbusiness = this.logoutbusiness.bind(this) 
    this.editTicket = this.editTicket.bind(this)
    this.handleCloseEmpDialog = this.handleCloseEmpDialog.bind(this)
    this.handleOpenEmployee = this.handleOpenEmployee.bind(this)
    this.handleOpenCategory = this.handleOpenCategory.bind(this)
    this.handleCloseCatDialog = this.handleCloseCatDialog.bind(this)
    this.handleClickInvent = this.handleClickInvent.bind(this)
    this.handleOpenProduct = this.handleOpenProduct.bind(this)
    this.handleCloseProdDialog = this.handleCloseProdDialog.bind(this)
    this.handleCloseTicketAlert = this.handleCloseTicketAlert.bind(this)
    this.handleOpenDiscount = this.handleOpenDiscount.bind(this)
    this.handleCloseDisDialog = this.handleCloseDisDialog.bind(this) 
    this.handleOpenCommision = this.handleOpenCommision.bind(this)
    this.handleOpenDefault_Discount = this.handleOpenDefault_Discount.bind(this)
    this.handleCloseCommisionDialog = this.handleCloseCommisionDialog.bind(this)
    this.handleCloseDefault_DiscountDialog = this.handleCloseDefault_DiscountDialog.bind(this)
    this.handleOpenTax = this.handleOpenTax.bind(this)
    this.handleCloseTax = this.handleCloseTax.bind(this)
    this.handleOpenCustomer = this.handleOpenCustomer.bind(this)
    this.handleCloseCustomer = this.handleCloseCustomer.bind(this)
    this.handleOpenEmpSetting = this.handleOpenEmpSetting.bind(this)
    this.handleOpenSync = this.handleOpenSync.bind(this)
    this.handleCloseEmpSetting = this.handleCloseEmpSetting.bind(this)
    this.handleCloseErrorDialog =this.handleCloseErrorDialog.bind(this)
    this.checkTime = this.checkTime.bind(this)
    this.handleOpenEmpReport = this.handleOpenEmpReport.bind(this)
    this.handleCloseEmpReport = this.handleCloseEmpReport.bind(this)
    this.handleCloseCreateTicketOption = this.handleCloseCreateTicketOption.bind(this)
    this.openCreateTicket = this.openCreateTicket.bind(this)
    this.afterFinishedClockinout = this.afterFinishedClockinout.bind(this)
    this.syncApi = this.syncApi.bind(this)
    this.onRowClick = this.onRowClick.bind(this)
    this.handleOpenClockin = this.handleOpenClockin.bind(this)
    this.onChangePage = this.onChangePage.bind(this);
    this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
    this.handlechangeToDate = this.handlechangeToDate.bind(this);
    this.getClosedTicketsByDate = this.getClosedTicketsByDate.bind(this);
    this.reloadTicket = this.reloadTicket.bind(this)
}

handlechangeFromDate(e){
    this.setState({from_date: e});
}
handlechangeToDate(e){
    this.setState({to_date: e});
}

getClosedTicketsByDate(){
    this.setState({isLoading: true})
    let from_date = Moment(this.state.from_date).format('YYYY-MM-DD');
    let to_date = Moment(this.state.to_date).format('YYYY-MM-DD');
    var detail = window.localStorage.getItem('businessdetail');
    var businessdetail = JSON.parse(detail);
    


    var sql = `select t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value,t.sync_id, t.discount_totalamt, t.sync_id, c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.sync_id where t.businessId='`+businessdetail["id"]
    +`' and t.isDelete!=1 and t.sync_status=0`
    // console.log("1",sql)
 
  
   this.state.dataManager.getData(sql).then(response =>{
       if (response instanceof Array) {
      
           this.setState({unsyncedCount: response.length}, function() { 
            var sql = "select t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value, t.discount_totalamt, t.sync_id,c.name as customer_name, tp.pay_mode,tp.paid_at,tp.card_type, tp.notes as  payment_notes from ticket as t left join customers as c on t.customer_id=c.sync_id left join ticket_payment as tp on tp.ticketref_id=t.sync_id where t.businessId='"+businessdetail["id"]+"' and t.isDelete!=1 and DATE(tp.paid_at) between '"+from_date+"' and '"+to_date+"' order by tp.paid_at desc" 
            this.state.dataManager.getData(sql).then(response =>{
                
                if (response instanceof Array) { 
                    
                    let selected_ticket = response.filter(item => item.paid_status !== "paid")
                    let selected_paid_ticket = response.filter(item => item.paid_status === "paid")
                    this.setState({ticket_list: response,isLoading: false, unpaid_ticket_list:selected_ticket,paid_ticket_list: selected_paid_ticket, showDatePopup: false}, function() { 
                        // this.state.unpaid_ticket_list.map((data)=>{
                        //     this.getTicketService(data.id)
                        // })
                    })
                }
                
            })

           })
       }
      
   })
}

handleTicketPrint(row){ 

    console.log("handleTicketPrint",row.id)

    var printerName = window.localStorage.getItem('defaultprinter')
        if(printerName !== undefined && printerName !== ''){

        this.setState({ticketDetail:row, services_taken:[]}, ()=>{
        var ticket_id = this.state.ticketDetail.id;
        this.setState({isLoading: true})
        const sql = "select ts.*,s.*,ts.sync_id as uniquId, rn.id as notesid, rn.notes as requestNotes, d.name as discount_name from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.sync_id left join ticketservice_requestnotes as rn on rn.ticket_id=ts.ticket_id and rn.service_id=ts.service_id and rn.isActive=1 left join discounts as d on d.id = ts.discount_id where ts.ticketref_id =  '"+ticket_id+"'  and ts.isActive=1" 

        console.log("handleTicketPrint, handleTicketPrint",sql)
        this.state.dataManager.getData(sql).then(response =>{ 
            if (response instanceof Array) { 
                console.log("handleTicketPrint",response.length)
                for (var i=0;i < response.length; i++){ 
                    this.addServices(response[i], i, response)  
                    if(i === response.length-1){
                        this.setState({isLoading: false})
                    }
                }
                if(response.length ===0){

                    this.setState({isLoading: false})
                }
            }
        })
    
    
    })
}
else{
    this.setState({printalert:true})
}


} 

// processPrintDetails() {

//     var service_data = []
    
//     this.state.services_taken.forEach(( ser,index) => {
//         var tax_detail = ""
//         var discount_detail = ""
//         var tax_data = []
//         var discount_data=[]
//         ser.taxes.forEach( (tax) => {
//             tax_data.push({ 
//                 "tax_name": tax.tax_name+"("+(tax.tax_type === 'percentage' ? '%' : '$')+tax.tax_value+")",
//                 "tax_percentage": tax.tax_percentage
//             })
//         })

//         tax_data.forEach((tax) => {
//             tax_detail = (tax_detail.length>0 ? tax_detail+"<br>" : tax_detail)+tax["tax_name"]+" - $"+tax["tax_percentage"]
//         })

        

//         if( ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 ) {
//             discount_data.push({ 
//                 "discount_name": ser.discount.discount_name+"("+(ser.discount.discount_type === 'percentage'? ser.discount.discount_value+'%' : '$'+ser.discount.discount_value)+")",
//                 "discount_price":ser.discount.discount_price ,
//                 "price_with_discount":ser.discount.price_with_discount
//             })
//         }

//         discount_data.forEach   ((tax) => {
//             discount_detail = (discount_detail.length>0 ? discount_detail+"<br>" : discount_detail)+tax["discount_name"]+" - $"+tax["discount_price"]+""
//         }) 
//         service_data.push({
//             "name" : ser.servicedetail.name,
//             "price":  ser.perunit_cost,
//             "total": ser.subtotal,
//             "tax": tax_detail,
//             "discount":discount_detail,
//             "quantity": ser.qty
//         })
       

//     })

//    return service_data
    
// }

addServices = (servicein, i, response) => new Promise((resolve, reject) => {   
    // console.log("addServices")
    var obj = {
        "servicedetail": servicein,
        discount:{},
        taxes:[],
        subtotal: Number(servicein.perunit_cost)*Number(servicein.service_quantity),
        taxamount:0,
        discountamount: servicein.total_discount_amount !== undefined ?  servicein.total_discount_amount :0,
        qty:1,
        perunit_cost:servicein.perunit_cost,
        employee_id: servicein.employee_id,
        isSpecialRequest: 0,
        process:''
    }
    // console.log("2.addServices")
    var sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.id=st.tax_id and t.status='active' where st.service_id='"+servicein.sync_id+"' and st.status='active'";

        obj["discount"].discount_id = servicein.discount_id
        obj["discount"].discount_type = servicein.discount_type
        obj["discount"].discount_value = servicein.discount_value
        obj["discount"].discount_name = servicein.discount_name
        obj["discount"].total_discount_amount = servicein.total_discount_amount

        sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from ticketservice_taxes as st join taxes as t on t.sync_id==st.tax_id and t.status='active' where st.serviceref_id='"+servicein.uniquId+"' and st.ticketref_id='"+servicein.ticketref_id+"' and st.isActive=1"
        console.log("TAX SQL::::", sql)
        // sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from ticketservice_taxes as st join taxes as t on t.id=st.tax_id and t.status='active' where st.ticketservice_id='"+servicein.uniquId+"' and st.isActive=1"
        // console.log("3.addServices")
    this.state.dataManager.getData(sql).then(responsew =>{  
        obj.taxes = responsew; 
        var services = this.state.services_taken;
        services.push(obj);

        console.log("addServices", obj)
        this.setState({services_taken: services}, ()=>{
            if(i === response.length -1){ 
                setTimeout(this.printTicket(), 1000);
            }
        })
    });
}) 

printTicket() {
    var print_data = this.processPrintDetails()
    //console.log("service_data", service_data)
        // var businessdetail = this.state.businessdetail;
        var printerName = window.localStorage.getItem('defaultprinter')
        if(printerName !== undefined && printerName !== ''){
            this.setState({print_data: print_data}, function() {
                // this.setState({printpopup: true}) 
                var total=Number(this.state.ticketDetail.grand_total).toFixed(2)
                var ticketid = this.state.ticketDetail.ticket_code;
                console.log(printerName);
                var data = [];



                var bodydata = []

                print_data.forEach((ser,index)=>{
                    bodydata.push([
                        {
                            type: "text", 
                            value: "<div style='display:flex;flex-direction:column;'><div style='text-align:left;'>"+ser["quantity"]+"&nbsp;&nbsp;&nbsp;&nbsp;"+ser["name"]+"</div>"+
                            ((ser["tax"] === "") ? "":ser["tax"])+
                            ((ser["discount"] === "") ? "":ser["discount"]), 
                            css: {  "font-size": "12px" },
                        },
                        {
                            type: "text", 
                            value: "<div style='display:flex;flex-direction:column;'><div >$"+Number(ser["total"]).toFixed(2)+"</div>"+ser["ratedetails"],
                            css: {  "font-weight": "500","font-size": "14px" },
                        },
                        // {
                        //     type: "text", 
                        //     value:  "$"+ser["total"],
                        //     style: `text-align:left;`,
                        //     css: {  "font-weight": "500","font-size": "14px" },
                        // },
                    ]
                    );  
                    
                })
            
            
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.name,//"TOP PAYMENT SOLUTIONS - Main",
                    style: `text-align:center;`,
                    css: {  "font-weight": "700", "font-size": "16px" },
                    }); 
                
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.address1+"<br/>"+ this.state.businessdetail.address2+"<br/>"+this.state.businessdetail.city+"<br/>" +this.state.businessdetail.state+ this.state.businessdetail.zipcode+"<br/>"+ this.state.businessdetail.businessphone, //"3675 CRESTWOOD PKWY STE <br> DULUTH, GA  300965045 <br> 7706804075",
                    style: `text-align:center;`,
                    css: { "font-size": "12px","margin-top": 2 },
                    }); 
                data.push({
                    type: "text", 
                    value: "",//"http://toppaymentsolutions.com",
                    style: `text-align:center;`,
                    css: { "font-size": "10px","margin-top": 2 },
                    }); 

                data.push({
                    type: "text", 
                    value: "ORDER: "+JSON.parse(window.localStorage.getItem('businessdetail')).name+" - Ticket "+ ticketid,
                    style: `text-align:center;`,
                    css: { "font-weight": "700", "font-size": "18px","margin-top": 10 },
                    }); 
                data.push({
                    type: "text", 
                    value: "Cashier: "+JSON.parse(window.localStorage.getItem('employeedetail')).firstName,
                    style: `text-align:left;`,
                    css: {  "font-size": "12px","margin-top": 5 },
                    });
                data.push({
                    type: "text", 
                    value:  Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                    style: `text-align:left;`,
                    css: {  "font-size": "12px","margin-top": 5 },
                    });
                
                data.push({
                    type: 'table',
                    // style: 'border: 0px solid #ddd',
                    css: {"margin-left": 10,"margin-top": 10,"margin-bottom": 10},
                    tableBody: bodydata,
                    tableBodyStyle: 'border: 0.0px solid #ddd',
                    tableSeperatorStyle: 'border: 0.0px solid #ddd'
                })
                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Discount</p> <p>$"+(this.state.ticketDetail.discount_totalamt !== null && this.state.ticketDetail.discount_totalamt !== undefined ? Number(this.state.ticketDetail.discount_totalamt).toFixed(2) : '$0.00')+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                })
                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+Number(total).toFixed(2)+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                }); 
                if(this.state.value === 1){
                    data.push({
                        type: "text", 
                        value: "<div style='display: flex; justify-content: space-between;'><p style='text-transform:uppercase;'>"+this.state.ticketDetail.pay_mode+" SALE</p> <p>$"+Number(total).toFixed(2)+"</p> </div>",
                        style: `text-align:left;`,
                        css: {  "font-size": "14px","margin-top": -25 },
                    });
                    if(this.state.ticketDetail.pay_mode.toLowerCase() === 'cash'){
                        data.push({
                            type: "text", 
                            value:  "<div style='display: flex; justify-content: space-between;'><p >Cash tendered</p> <p>$"+Number(total).toFixed(2)+"</p> </div>",
                            style: `text-align:left;`,
                            css: { "font-size": "14px","margin-top": -25 },
                        }); 
                    }
                    else{
                        data.push({
                            type: "text", 
                            value:  "<div style='display: flex; justify-content: space-between;'><p style='text-transform:uppercase;'>"+this.state.ticketDetail.card_type+"&nbsp;&nbsp;"+this.state.ticketDetail.payment_notes+"</p> <p>$"+Number(total).toFixed(2)+"</p> </div>",
                            style: `text-align:left;`,
                            css: { "font-size": "14px","margin-top": -25 },
                        }); 
                    }
                }
                data.push({
                    type: "text", 
                    value:  "Enjoy!",
                    style: `text-align:left;`,
                    css: { "font-size": "14px","margin-top": 0 },
                });

                window.api.printdata({printername: printerName, data: data}).then(res=>{ 
                    console.log(res); 
                })


            })
        }
        else{
        alert("No printer selected"); 
        }


}
 
processPrintDetails() {

    var service_data = []
    
    this.state.services_taken.forEach(( ser,index) => {
        var tax_detail = ""
        var discount_detail = ""
        var tax_data = []
        var tax_rate = ""
        var discount_data=[]
        console.log(ser.taxes);
        ser.taxes.forEach( (tax) => {
            tax_data.push({ 
                "tax_name": tax.tax_name+"("+(tax.tax_type === 'percentage' ? '%' : '$')+tax.tax_value+")",
                "tax_percentage": tax.tax_calculated
            })
        })

        tax_data.forEach((tax) => {
            tax_detail = (tax_detail.length>0 ? tax_detail  : tax_detail)+"<div style='display:flex;width:100%;justify-content:space-between;'><div>"+tax["tax_name"]+"</div></div>"
            tax_rate += "<div> $"+tax["tax_percentage"]+"</div>"
        })

        

        if( ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 ) {
            console.log(ser.discount)
            discount_data.push({ 
                "discount_name": ser.discount.discount_name+"("+(ser.discount.discount_type === 'percentage'? ser.discount.discount_value+'%' : '$'+ser.discount.discount_value)+")",
                "discount_price":ser.discount.total_discount_amount ,
                "price_with_discount":ser.discount.price_with_discount
            })
        }

        discount_data.forEach   ((tax) => {
            console.log(tax)
            discount_detail = (discount_detail.length>0 ? discount_detail : discount_detail)+"<div style='display:flex;width:100%;justify-content:space-between;'><div>"+tax["discount_name"]+"</div></div>"
            tax_rate += "<div> ($"+tax["discount_price"]+")</div>"
        }) 
        console.log(ser)
        service_data.push({
            "name" : ser.servicedetail.name,
            "price":  ser.perunit_cost,
            "total": ser.subtotal,
            "tax": tax_detail,
            taxes:tax_data,
            discounts: discount_data,
            ratedetails: tax_rate,
            "discount":discount_detail,
            "quantity": ser.servicedetail.service_quantity
        })
    

    })

return service_data

    
}

handlePageEvent(pagename){ 
  this.props.onChangePage(pagename);
}

syncApi() {
    this.setState({isSyncing:true})
    //console.log("syncApi")
   
   this.state.ticketManager.syncTicket().then(res=>{
    this.setState({isSyncing:false})
    })
} 

componentDidMount() {
    // this.checkTime(this)
   
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    var condition = navigator.onLine ? 'online' : 'offline';
    this.setState({isOnline: (condition==="online") ? true: false}, function() {
        // console.log("componentDidMount",this.state.isOnline)
        this.getStaffList();
    })

   

    // ipcRenderer.on('synced-after', function (evt, message) {

    //   //console.log("synced....",message)
    //   this.setState({unsyncedCount:0});
    //     // window.location.reload();

    // }) 
}

resize() {
    this.setState({hide: window.innerWidth <= 1100});
}

componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("resize", this.resize.bind(this));
}




checkTime(that) {
    fetch('https://www.google.com', {method: 'POST',body: ''})
        .then( 
            function(response) { 
                var servertime =  new Date(response.headers.get('Date')).toLocaleTimeString('en-US')
                var localtime = new Date().toLocaleTimeString('en-US')
                servertime = servertime.split(':')[0]+":"+servertime.split(':')[1]+localtime.split(' ')[1]
                localtime = localtime.split(':')[0]+":"+localtime.split(':')[1]+localtime.split(' ')[1]
                //console.log("servertime",servertime,localtime);

                if(servertime !== localtime) {
                    //console.log("mismatch")
                    that.setState({msg: 'Server time does not match with your system time. Please try again.',openDialog: true})
                }

                else {
                    that.interval = setInterval(() => that.setState({ currentTime: new Date().toLocaleTimeString('en-US') }), 1000);
                    that.getStaffList();
                    var employeedetail = window.localStorage.getItem('employeedetail');
                    if(employeedetail !== undefined){
                        that.setState({employeedetail:JSON.parse(employeedetail), ticketowner:JSON.parse(employeedetail) })
                    }
            
                }

  
            }
            
        )
        .catch(function(err) {
            //console.log('Fetch Error', err);

        }); 
}
  
editTicket(row){ 
    this.setState({showPage: 'dashboard'})
    var ticketowner = this.state.staff_list.filter(t=>{ return t.id.toString() === row.technician_id});
    this.setState({selectedTicket: row, isTicketEdit: true, ticketowner: ticketowner.length > 0 ? ticketowner[0] : this.state.ticketowner, dateerror: false}, function(){  
        console.log(this.state.dateerror)
        window.api.invoke('log', "Edit Ticket clicked - Ticket code : "+row.ticket_code ).then(r=>{
            this.setState({showPage: 'editTicket'})
        })
    })
}

reloadTicket(ticket){
    this.editTicket(ticket);
}
handleCloseErrorDialog(){
    // //console.log()
}

getStaffList(){ 
    this.setState({isLoading: true})
    var businessdetail = {}
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== 'undefined'){
        businessdetail = JSON.parse(detail);
        this.setState({businessdetail:businessdetail}, function(){
            document.title = this.state.businessdetail.name + ' - The Finest Salon Management Platform (Development)';
        })
        // if(this.state.isOnline) {
        //     axios.get(config.root+"employee/"+businessdetail["id"]).then(res=>{
        //         // var status = res.data["status"];
        //         var data = res.data["data"];
                
        //         console.log("getStaffListserve", data)
        //     })
        // }
        // else {
        //     // this.getStaffListLocal()
        //     // this.getTicketList(true);
        // }

        this.getStaffListLocal()
        this.getTicketList(true);
        
    }
    
}

getStaffListLocal() {
    this.state.dataManager.getData(`select * from users`).then(response =>{ 
        this.setState({staff_list: response}, function() {
            console.log("getStaffListLocal", this.state.staff_list)
        });
    })

    // this.state.dataManager.getData(`select u.firstName, u.lastName, u.staff_role, u.id as id, u.clocked_status as clocked_status, b.clockin_out as uclocked_status from users as u left join staff_clockLog as b on u.id = b.staff_id and b.isActive=1`).then(response =>{ 
    
    //     this.setState({staff_list: response}, function() {
    //         console.log("getStaffListLocal", this.state.staff_list)
    //     });
        
    // })
   
}

handleTicketPayment(details){
    details["ticketref_id"] = details.sync_id;
    this.setState({openPayment:true,ticketDetail:details})
}
handleClosePayment(){
    this.setState({openPayment:false})
    this.getTicketList(true);
} 

handleClick(){
    // //console.log(event.target)
    this.setState({anchorEl:null, openMenu:true});
}


handleCloseMenu(){
    this.setState({anchorEl:null, openMenu:false});
}

handleCloseTicketAlert(){
    this.setState({ticketcloseAlert_Open : false});
}


handleCloseDialog(msg){
    this.setState({addDialog:false,editDialog: false, showPage:'dashboard'}, function(){
        this.getTicketList(false);
        
      })
}

closeTicket(){

}

handleOpenEmployee(){ 
    this.setState({addEmpDialog:true})
}

handleCloseEmpDialog(msg){
this.setState({addEmpDialog:false}, function(){
   
})
}
handleClickInvent(opt){
    if(opt === 'inventory')
      this.setState({expand_menu_show : !this.state.expand_menu_show});
    if(opt === 'settings')
      this.setState({setting_menu_show : !this.state.setting_menu_show});
} 

handleOpenCategory(){
    this.setState({addCatDialog:true})
}

handleCloseCatDialog(msg){
    this.setState({addCatDialog:false}, function(){
       
    })
}

handleOpenDiscount(){
    //console.log("handleOpenDiscount")
    this.setState({addDiscDialog: true})
}

handleCloseDisDialog(msg){
    this.setState({addDiscDialog:false}, function(){
       
    })
}

handleOpenProduct(){
    this.setState({addProdDialog:true})
}

handleCloseProdDialog(msg){
    this.setState({addProdDialog:false}, function(){
     
    })
}
handleOpenCommision(){
    this.setState({addCommissionDialog :true})
}
handleCloseCommisionDialog(msg){
    this.setState({addCommissionDialog:false}, function(){
       
    })
} 

handleOpenDefault_Discount(){
    this.setState({addDefault_DisDialog :true})
}
handleCloseDefault_DiscountDialog(msg){
    this.setState({addDefault_DisDialog:false}, function(){
       
    })
} 
handleOpenTax(){
    this.setState({addTaxDialog :true})
}
handleCloseTax(msg){
    this.setState({addTaxDialog:false}, function(){
       
    })
}
handleOpenCustomer(){
    this.setState({addCustomerDialog :true})
}
handleCloseCustomer(msg){
    this.setState({addCustomerDialog:false}, function(){
       
    })
}
handleOpenEmpSetting(){
    this.setState({addEmpSettingDialog :true})
}

handleOpenSync() {
    this.setState({addSyncDialog :true})
}

handleCloseSync() {
    this.setState({addSyncDialog :false})
}

handleCloseEmpSetting(msg){
    this.setState({addEmpSettingDialog:false}, function(){
       
    })
}
handleOpenEmpReport(){
    this.setState({addEmpReportDialog :true})
}
handleCloseEmpReport(msg){
    this.setState({addEmpReportDialog:false}, function(){
       
    })
}

getClockInDetails() {
    var employeedetail = window.localStorage.getItem("employeedetail") 
    axios.post(config.root+"employee/getClockInDetails/", {"staff_id": JSON.parse(employeedetail).id}).then(res=>{
        var status = res.data["status"];
        var data = res.data["data"];
        //console.log("getClockInDetails",data)
        
        if(status === 200){
            if(data.length>0) {
                if(data[data.length-1].clockin_out === "Clock-out"){
                    this.setState({clockedout: true})
                }
            }
            
            this.setState({clockin: data})
        }else{
            alert('Something Went Wrong !')
            
        }
    })
}
onClockin() {
    var employeedetail = window.localStorage.getItem("employeedetail") 
   
    let loginpasscode = JSON.parse(employeedetail).passcode 
    if(this.state.passcode === loginpasscode) {
        this.saveClockinDetails()
    }
    else {
        alert("Please enter correct Passcode!")
    }
    
}

handleChangeCode(passcode){
    // //console.log("parent", passcode)
    this.setState({passcode: passcode});

}


afterFinishedClockinout() {
    
    //console.log("afterFinishedClockinout")
    this.setState({open: false}, function() {
        this.getStaffList()
    })
   


}

onClockout() {
    var employeedetail = window.localStorage.getItem("employeedetail") 
   
    let loginpasscode = JSON.parse(employeedetail).passcode
    //console.log(loginpasscode, this.state.passcode)
    if(this.state.passcode === loginpasscode) {
        this.saveClockoutDetails()
    }
    else {
        alert("Please enter correct Passcode!")
    }
    
}



// handleChange = (event, newValue) => {
//     //console.log("newValue:",newValue)
//     this.setState({value: newValue})
// };

handleChange(uvalue) {
    //console.log("newValue:",newValue)
    this.setState({value: uvalue, ticket_list:[], paid_ticket_list:[]}, ()=>{
        this.getTicketList(true);
    })
};

handleOpenTicket(){
    window.api.getTicketCode().then(res=>{ 
           console.log(res)
           if(res.ticketid !== ''){
               var ticket_code = String(res.ticketid).padStart(4, '0');
               var ticketDetail = {
                   ticket_code : ticket_code
               }
               this.setState({selectedTicket:ticketDetail, dateerror: false, isTicketEdit: false}, ()=>{
                    window.api.invoke('log', "Create Ticket clicked - Ticket code : "+ticket_code ).then(r=>{
                        this.setState({showPage:'createTicket'})
                    })
               });
           }
           else{
               this.setState({dateerror: true, isTicketEdit: false}, ()=>{
                    this.setState({showPage:'createTicket'})
               })
           }
   })
}

openCreateTicket() {
    //console.log("openCreateTicket")
    this.setState({createTicketOption: false}, function() {
        this.setState({addDialog:true})
      
    })
}


handleCloseCreateTicketOption() {
    this.setState({createTicketOption: false})
}

getTicketList(loading){ 
    if(loading){
        this.setState({isLoading: true})
    }
    var detail = window.localStorage.getItem('businessdetail');
    var businessdetail = JSON.parse(detail);
    // var todayDate = Moment(new Date()).format('YYYY-MM-DD');


    let from_date = Moment(this.state.from_date).format('YYYY-MM-DD');
    let to_date = Moment(this.state.to_date).format('YYYY-MM-DD');

    var sql = `select t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value,t.sync_id, t.discount_totalamt, t.sync_id, c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.sync_id where t.businessId='`+businessdetail["id"]
    +`' and t.isDelete!=1 and t.sync_status=0 order by t.created_at desc`
 
  
   this.state.dataManager.getData(sql).then(response =>{
       if (response instanceof Array) {
      
           this.setState({unsyncedCount: response.length}, function() {
            var sql = "select t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value, t.discount_totalamt, t.sync_id,c.name as customer_name, tp.pay_mode,tp.paid_at, tp.card_type, tp.notes as payment_notes from ticket as t left join customers as c on t.customer_id=c.sync_id left join ticket_payment as tp on tp.ticketref_id=t.sync_id where t.businessId='"+businessdetail["id"]+"' and t.isDelete!=1 and DATE(tp.paid_at) between '"+from_date+"' and '"+to_date+"' order by tp.paid_at desc" 
           
            if(this.state.value === 0){
                sql = "select t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value, t.discount_totalamt, t.sync_id,c.name as customer_name, tp.pay_mode, tp.paid_at,tp.card_type, tp.notes as payment_notes from ticket as t left join customers as c on t.customer_id=c.sync_id left join ticket_payment as tp on tp.ticketref_id=t.sync_id where t.businessId='"+businessdetail["id"]+"' and t.isDelete!=1 order by  t.created_at desc"
            }
           console.log(sql);
            this.state.dataManager.getData(sql).then(response =>{
                console.log("response", response)
                if (response instanceof Array) { 
                    let selected_ticket = response.filter(item => item.paid_status !== "paid")
                    let selected_paid_ticket = response.filter(item => item.paid_status === "paid" && item.paid_at !== null && item.paid_at !== undefined  )
                    this.setState({ticket_list: response, unpaid_ticket_list:selected_ticket,paid_ticket_list: selected_paid_ticket, isLoading: false}, function() { 
                        // this.state.unpaid_ticket_list.forEach((data)=>{
                        //     this.getTicketService(data.id)
                        // })
                    })
                }
                
            })

           })
       }
      
   })

}

getTicketService(ticket_id){
    var process=[]
    const sql = "select ts.*,s.*,ts.id as uniquId, rn.id as notesid, rn.notes as requestNotes from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.Id left join ticketservice_requestnotes as rn on rn.ticket_id=ts.ticket_id and rn.service_id=ts.service_id and rn.isActive=1 where ts.ticketref_id =  '"+ticket_id+"'  and ts.isActive=1"
    this.state.dataManager.getData(sql).then(response =>{
  
       if (response instanceof Array) {
        if(response.length>0) {
            response.forEach(data=>{
                process.push(data.process)
            })
           
        }
        //  console.log("getTicketService:::",process)
       }
   })
}

handleCloseTicket(msg){ 
    this.setState({openTicket:false}, function(){


       
      })
}

handleOpen(){ 
    this.setState({open: true})
}
handleClose(){
    this.setState({open: false, ticketowner: {}})
}

logout(){ 
    window.localStorage.removeItem("employeedetail")
    window.location.reload();
}
logoutbusiness(){
    window.localStorage.clear();
     this.setState({isempLogin: false, isbusinesslogin:false})
}
handleChangeTech = (event) => {
    this.setState({tech: event.target.value})
};

toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
};

onRowClick(rowData) {
    var detail = window.localStorage.getItem('businessdetail');
    var businessdetail = JSON.parse(detail); 
    var sql = "select t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value, t.discount_totalamt,t.sync_id,  c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.sync_id where t.businessId='"+businessdetail["id"]+"' and t.isDelete!=1 and t.sync_id='"+rowData.row.id+"'"
    this.state.dataManager.getData(sql).then(response =>{ 
        console.log(response);
        if (response instanceof Array) {
          if(response.length>0) {
              this.editTicket(response[0])
          }
        }
        
    })

}

onChangePage(pagename){
    this.props.onChangePage(pagename);
}

handleOpenClockin() { 
    this.setState({open: true})
}
render()  {    
    // console.log("window.innerWidth",this.state.hide)
    return <div style={{height:'100%'}}> 
                    {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
                   <AppBarContent  businessdetail={this.state.businessdetail} currentTime={this.state.currentTime}  
                   handleClick={()=>this.handleClick()} logoutbusiness={()=>this.logoutbusiness()}  logout={()=>this.logout()} syncApi={()=>this.syncApi()}
                   unsyncedCount={''+this.state.unsyncedCount} 
                   /> 
                    
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
  
                    
                    {/* Drawer menu ends */}

                     {/* ResponsiveGridLayout Starts */}

                    <Grid container spacing={3}  style={{height:'calc(100% - 104px)', padding: 0}}>
                        <Grid item xs={4} style={{height:'100%', paddingRight:0}}>
                            <div key="1" data-grid={{x: 0, y: 0,w: 4, h: 4.8}} style={{ padding:'5px 0',overflow:'auto', height:'100%'}}>
                            {/* style={{marginTop:10,maxHeight:'calc(50% - 20px)',height:'calc(50% - 20px)',overflow:'auto',padding:'0 0.75rem', boxShadow:'none', border:'1px solid #f0f0f0', borderBottom:0}} */}
                                <Card style={{marginTop:-10,maxHeight:'50%',height:'50%',overflow:'auto',  boxShadow:'none', border:'1px solid #f0f0f0', borderBottom:0}}>
                                    <CardContent style={{padding:'0 0 16px 0', height:'100%'}}>
                                            <Typography style={{borderBottom:'1px solid #f0f0f0',background:'#134163',color:'#fff', padding:'0.5rem 0'}} variant="h6" align="center"> 
                                            Clocked-In Technicians</Typography> 
                                            <div style={{display: 'flex', marginTop: 10, flexWrap:'wrap' ,padding:'0 0.75rem', height:'calc(100% - 60px)', overflow:'auto', alignContent:'baseline'}}>
                                                {this.state.staff_list.map((staff,i)=>{
                                                    let value;
                                                    
                                                    if(staff.clocked_status !== null && staff.clocked_status.toLowerCase() === 'Clock-in'.toLowerCase() && staff.staff_role !== 'SA'){ 
                                                        value =  
                                                        <Grid className='techbtn'  item xs={4} style={{background:"",paddingRight: 2,paddingLeft: 2, paddingTop:2,paddingBottom:2,minWidth:(this.state.hide)?'90%':'33.33%', cursor:'pointer'}}> 
                                                        <div style={{background: '#bee1f7', textTransform:'capitalize',height:65,borderBottom: '0px solid #bee1f7', borderRadius: 10,display:'flex',alignItems:'center', justifyContent:'center'}} onDoubleClick={()=>{
                                                                this.setState({ticketowner:staff});this.handleOpenTicket()
                                                        }}>
                                                        <div style={{display:'flex',alignItems:'center', justifyContent:'center', height:'100%',overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}}>
                                                        <Typography
                                                          variant="subtitle2"
                                                          component="h2"
                                                          overflow="hidden"    
                                                          textOverflow="ellipsis"
                                                          display='-webkit-box'
                                                          align="center"
                                                          style={{display:'flex',alignItems:'center', justifyContent:'center', verticalAlign: 'middle',background:"", textAlign: 'center', width: '100%',height: 60,marginLeft:2,marginRight:2, overflow:'hidden' , wordWrap: "break-word" ,textOverflow: "ellipsis", WebkitLineClamp: 3, WebkitBoxOrient: ''}}  
                                                        >
                                                         {staff.firstName+" "+staff.lastName} 
                                                        </Typography>
                                                        </div>
                                                        </div>
                                                        </Grid>
                                                    }
                                                    return value;
                                                    
                                                })}          
                                            </div>
                                        </CardContent>
                                </Card>
                                <Card style={{maxHeight:'50%',height:'50%',overflow:'auto', boxShadow:'none', border:'1px solid #f0f0f0', borderBottom:0}}>
                                    <CardContent style={{padding:'0 0 16px 0', height:'100%'}}>
                                            <Typography style={{borderBottom:'1px solid #f0f0f0',background:'#134163',color:'#fff', padding:'0.5rem 0'}} variant="h6" align="center"> 
                                            Technicians</Typography>
                                            <div style={{display: 'flex', marginTop: 10, flexWrap:'wrap',padding:'0 0.75rem', height:'calc(100% - 60px)', overflow:'auto', alignContent:'baseline'}}>
                                                {this.state.staff_list.map((staff,i)=>{
                                                    let value;
                                                    if((staff.clocked_status === null ||  staff.clocked_status.toLowerCase() !== 'Clock-in'.toLowerCase() )&& staff.staff_role !== 'SA' ){ 
                                                        value = 
                                                        <Grid className='techbtn'  item xs={4} style={{background:"",paddingRight: 2,paddingLeft: 2, paddingTop:2,paddingBottom:2,minWidth:(this.state.hide)?'90%':'33.33%', cursor:'pointer'}}> 
                                                        <div style={{background: '#F2F2F2',height:65,borderBottom: '0px solid #bee1f7', borderRadius: 10,display:'flex',alignItems:'center', justifyContent:'center', }} 
                                                        onDoubleClick={()=>{
                                                                 this.setState({ticketowner:staff})
                                                                 this.handleOpenClockin()
                                                        }}>
                                                        <div style={{display:'flex',alignItems:'center', justifyContent:'center', height:'100%',overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}}>
                                                        <Typography
                                                          variant="subtitle2"
                                                          component="h2"
                                                          overflow="hidden"    
                                                          textOverflow="ellipsis"
                                                          display='-webkit-box'
                                                          align="center"
                                                          style={{display:'flex',alignItems:'center', justifyContent:'center', verticalAlign: 'middle',background:"", textAlign: 'center', width: '100%',height: 60,marginLeft:2,marginRight:2, overflow:'hidden' , wordWrap: "break-word" ,textOverflow: "ellipsis", WebkitLineClamp: 3, WebkitBoxOrient: ''}}  
                                                        >
                                                        {staff.firstName+" "+staff.lastName}
                                                        </Typography>
                                                        </div>
                                                         

                                                        </div>
                                                        </Grid>
                                                    }
                                                    return value;
                                                    
                                                })} 
                                            </div>
                                        </CardContent>
                                </Card>
                            </div>
                        </Grid>

                        <Grid item xs={8} style={{height:'100%'-10, padding:0, width: '100%', marginLeft:0,marginBottom: 10}}>
                            
                            <Box style={{ height: 'calc(100% - 65px)', width: '100%',borderBottom: 1, marginLeft:0,borderColor: 'divider', marginTop: 10, marginBottom: 20, background: 'white'}}>
                                
                            <div  style={{width: '100%', height: '48px', display: 'flex',flexDirection:'row', marginLeft:0}}>
                                <div  cursor="pointer" style={{cursor:"pointer",width: '50%',background: (this.state.value===0)? '#134163': '#f0f0f0', height: '48px', textAlign: 'center', alignContent:'center', color: (this.state.value===0)? '#F2F2F2': '#B6B6B6',justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                                onClick={()=>{
                                    this.handleChange(0)
                                    }
                                }
                                > 
                                <Typography  variant="subtitle2" align="center" noWrap  style={{cursor:"pointer",marginTop:10,marginBottom:10 }}>Open Tickets</Typography>
                                </div>
                                <div  cursor="pointer" style={{cursor:"pointer",width: '50%',background: (this.state.value===1)? '#134163': '#f0f0f0', height: '48px', textAlign: 'center', alignContent:'center', color: (this.state.value===1)? '#F2F2F2': '#B6B6B6',justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20}}
                               
                                 onClick={()=>{
                                    this.handleChange(1)
                                    }
                                }
                                > 
                                <Typography variant="subtitle2" align="center" noWrap  style={{cursor:"pointer",marginTop:10,marginBottom:10 }}>Closed Tickets</Typography>
                                </div>
                                
                            </div>


                            {(this.state.value ===0 && this.state.hide) && 
                            <TableContent style={{ marginBottom: 10}}
                            data={this.state.unpaid_ticket_list} 
                            columns={this.state.reponsiveColumns}
                            onRowClick={ this.onRowClick}
                            />
                            }

                            {(this.state.value ===0 && this.state.hide===false) && 
                           <TableContent style={{ marginBottom: 10}}
                           data={this.state.unpaid_ticket_list} 
                           columns={this.state.columns}
                           onRowClick={ this.onRowClick}
                           />
                           }

                            {(this.state.value ===1) && <div style={{position:'relative', height:'100%'}}>
                                    <div style={{display:'flex', alignItems:'right', justifyContent:'flex-end', marginRight: 10, position:'absolute', right:0, zIndex:99999}}> 
                                        <IconButton onClick={()=>{
                                            this.setState({showDatePopup: true})
                                        }}><CalendarMonthOutlined/></IconButton>
                                    </div> 
                                    {(this.state.value === 1 &&  this.state.hide) && 
                                        <TableContent style={{ marginBottom: 10}}
                                        data={this.state.paid_ticket_list} 
                                        columns={this.state.closedticket_reponsiveColumns}
                                        onRowClick={ this.onRowClick}
                                    />
                                    }


                                    {(this.state.value ===1 &&  this.state.hide===false) && 
                                        <TableContent style={{  marginBottom: 10}}
                                        data={this.state.paid_ticket_list} 
                                        columns={this.state.closedticket_columns}
                                        onRowClick={ this.onRowClick}
                                    />
                                }
                                </div>
                            }

                            </Box>
                          
                        </Grid>
                    </Grid>
                    
                    {/* </ResponsiveGridLayout> ends*/}

                    {/* Bottom button Starts */} 

                    <Grid container style={{borderTop:'1px solid #f0f0f0', marginLeft: 0 }}>
                    
                        <Grid item xs={12} style={{display: 'flex', padding:0 }} className="dashboard footerbtn">
                                <Grid item xs={2}>
                                    <Button className='btmbtn' style={{borderColor:'#fff !important',borderTop:0, borderBottom:0}} onClick={this.handleOpen}   fullWidth variant="outlined">Clock In/Out</Button>
                                </Grid>
                                <Grid item xs={3}>
                                {/* onClick={handleOpenTicket} */}
                                    <Button className='btmbtn' style={{borderColor:'#fff',borderTop:0, borderBottom:0}} onClick={()=>{ 

                                        var employeedetail = window.localStorage.getItem('employeedetail');
                                        if(employeedetail !== undefined){
                                            this.setState({ ticketowner:JSON.parse(employeedetail) },()=>{ 
                                                this.handleOpenTicket();
                                            })
                                        }
                                    }} fullWidth variant="outlined">Create Ticket</Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button className='btmbtn' style={{borderColor:'#fff',borderTop:0, borderBottom:0}}  disabled onClick={this.logout} fullWidth variant="outlined">Check-In</Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button className='btmbtn' style={{borderColor:'#fff',borderTop:0, borderBottom:0}} fullWidth disabled variant="outlined">Waiting List</Button>
                                </Grid> 
                                <Grid item xs={2}>
                                    <Button  className='btmbtn' style={{borderColor:'#fff',borderTop:0, borderBottom:0}} fullWidth variant="outlined" onClick={()=>{ 
                                        this.handlePageEvent('empreport');
                                    }} >Report</Button>
                                </Grid>
                        </Grid>
                
                    </Grid>

                    {/* Top button ends */}  


                    {/* CommonModal Modal modal starts */}
                    <CommonModal open={this.state.openDialog} onClose={()=>this.handleCloseErrorDialog()} title="Error" contentText={this.state.msg} />
                    {/* CommonModal modal ends */}


                    {/* Clockin out modal starts */}
                         <ClockInOutModal errormsg={"Invalid passcode. Please try again."} open={this.state.open} onClose={()=>this.handleClose()} 
                         afterFinished={()=>this.afterFinishedClockinout()} 
                         selectedTechi={this.state.ticketowner}/>
                    {/* Clockin out modal ends */}

                    {/* CreateTicketModal modal starts */}
                    
    <Modal fullScreen open={this.state.showPage === 'createTicket' || this.state.showPage === 'editTicket' } onClose={()=>{this.handleCloseDialog("success")}}>  
        {/* <CreateTicket saveTicket={(data, ticketid)=>{
                          console.log("data from dashboard", data, ticketid);
                          this.props.saveTicket(data,ticketid);
                      }} afterFinished={(pagename)=>{
                          console.log("pagename", pagename)
                          this.setState({showPage:'dashboard'},function(){ 
                            this.getTicketList(false)
                             this.handlePageEvent(pagename)
                            })} }  
                             handleCloseDialog={()=>this.handleCloseDialog("success") } owner={this.state.ticketowner}  ticketDetail={this.state.selectedTicket} 
                             dateerror={this.state.dateerror}
                             isTicketEdit={this.state.isTicketEdit} />  */}

                    <CreateTicket reloadTicket={this.reloadTicket} saveTicket={(data, option)=>{ 
                        console.log(data.ticketDetail);
                        if(data.ticketDetail.grand_total > 0){
                            this.props.saveTicket(data);
                        }
                                if(option === 'close'){
                                    setTimeout(() => { 
                                      this.setState({showPage:'dashboard'},function(){ 
                                          this.getTicketList(false);
                                          this.setState({selectedTicket: {}, isTicketEdit: false, dateerror: false});
                                          this.handlePageEvent('dashboard')
                                      })
                                    }, 1000);
                                    this.setState({showPage:'dashboard'},function(){ 
                                        this.getTicketList(false);
                                        this.setState({selectedTicket: {}, isTicketEdit: false, dateerror: false});
                                        this.handlePageEvent('dashboard')
                                    })
                                } 
                          }
                      }   afterFinished={(pagename)=>{
                            this.setState({showPage:'dashboard'},function(){ 
                                this.getTicketList(false)
                                this.setState({selectedTicket: {}, isTicketEdit: false, dateerror: false});
                                this.handlePageEvent('dashboard')
                            })

                       }} handleCloseDialog={()=>this.handleCloseDialog("success") } owner={this.state.ticketowner}  ticketDetail={this.state.selectedTicket} 
                             dateerror={this.state.dateerror}
                             isTicketEdit={this.state.isTicketEdit}
                             closeTicket={()=>{
                                this.setState({showPage:'dashboard'},function(){ 
                                    this.getTicketList(false)
                                    this.setState({selectedTicket: {}, isTicketEdit: false, dateerror: false});
                                    this.handlePageEvent('dashboard')
                                })
                             }} /> 

                             
                             
    </Modal> 
    

                      {/* <CreateTicketModal open={this.state.showPage === 'createTicket' || this.state.showPage === 'editTicket' } saveTicket={(data, ticketid)=>{
                          console.log("data from dashboard", data, ticketid);
                          this.props.saveTicket(data,ticketid);
                      }} afterFinished={(pagename)=>{
                          console.log("pagename", pagename)
                          this.setState({showPage:'dashboard'},function(){ 
                            this.getTicketList(false)
                             this.handlePageEvent(pagename)
                            })} }  
                             handleCloseDialog={()=>this.handleCloseDialog("success") } ticketowner={this.state.ticketowner}  ticketDetail={this.state.selectedTicket} 
                             dateerror={this.state.dateerror}
                             isTicketEdit={this.state.isTicketEdit} /> */}
                             
                          
                         
                    {/* CreateTicketModal modal ends */}


                    {/* EditTicketModal modal starts */}
                    {/* <EditTicketModal open={this.state.showPage === 'editTicket'}  saveTicket={(data, ticketid)=>{
                          console.log("edit data from dashboard", data, ticketid);
                          this.props.saveTicket(data,ticketid);
                      }} handleCloseDialog={(pagename)=>this.setState({showPage:'dashboard'},function(){this.handleCloseDialog("success")})}  afterFinished={(pagename)=>{

                        console.log("pagename", pagename)
                        this.setState({showPage:'dashboard'},function(){ 
                          this.getTicketList(false)
                           this.handlePageEvent(pagename)
                          });
                      }} ticketowner={this.state.ticketowner} selectedTicket={this.state.selectedTicket}/> */}
                    {/* EditTicketModal modal ends */}
                        

                        {/* TicketPaymentModal modal starts */}
                        {/* <TicketPaymentModal open={this.state.openPayment} onClose={()=>this.handleClosePayment()} 
                        handleClosePayment={()=>this.handleClosePayment()} ticketDetail={this.state.ticketDetail}/> */}

                        {this.state.openPayment &&
                        <PaymentModal open={this.state.openPayment} onClose={()=>this.handleClosePayment()} 
                        handleClosePayment={()=>this.handleClosePayment()} ticketDetail={this.state.ticketDetail}>
                            
                        </PaymentModal> 
                        }

                        {/* TicketPaymentModal modal ends */}
                    </div>


            {/* validations for select service , technicians */}
            {this.state.printalert &&  <AlertModal title="Alert" msg="No printers added yet." handleCloseAlert={()=>this.setState({printalert:false})}/>}
            <Dialog
                    className="custommodal"
                        open={this.state.showDatePopup}
                        onClose={()=>{
                            this.setState({showDatePopup: false, from_date: new Date(), to_date:new Date()})
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
                            <Button variant="contained" onClick={()=>{ this.getClosedTicketsByDate()}}> Get Tickets </Button> 
                        </DialogActions>
            </Dialog>
        
        </div> 
  }

}
  