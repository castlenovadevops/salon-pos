import React from 'react';
import axios from 'axios'; 
import Moment from 'moment';
import { Card, Stack, Container, Typography,TextField, Grid } from '@mui/material';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close'; 
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns'; 
import config from '../../config/config';
// components
import ButtonContent from '../../components/formComponents/Button';
import TableContent from '../../components/formComponents/DataGrid';
import ModalTitleBar from '../../components/Modal/Titlebar';
import ReportView from './detailView';

import LoaderContent from '../../components/formComponents/LoaderDialog';
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TicketController from '../../controller/TicketController';
import DataManager from '../../controller/datacontroller';


export default class EmployeeReport extends React.Component {
    ticketController = new TicketController();
    dataManager = new DataManager();
     constructor(props) {
         super(props);
         this.state = {
             businessdetail:{},
              employee_reportlist:[],
              isEmpSelected: false,
              handleCloseReport: false,
              isLoading: false,
              selectedEmp:{},
              columns:[
                {
                    field: 'firstName',
                    headerName: 'Employee',
                    minWidth: 200,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.firstName} {params.row.lastName}
                    </div>
                    )
                },
                // {
                //     field: 'staff_role',
                //     headerName: 'Role',
                //     minWidth: 100,
                //     editable: false,
                //     renderCell: (params) => (
                //     <div>
                //          {params.row.staff_role !== null ? params.row.staff_role !== '' ? params.row.staff_role : '--' : '--'} 
                //     </div>
                //     )
                // },
                {
                    field: 'totalservice_price',
                    headerName: 'Service Price',
                    minWidth: 120,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ { Number(params.row.ServiceAmount).toFixed(2)}
                    </div>
                    )
                },
                {
                    field: 'total_tips',
                    headerName: 'Tips',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $ { Number(params.row.Tips).toFixed(2)} 
                    </div>
                    )
                },
                {
                    field: 'total_discount',
                    headerName: 'Discount',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $  { Number(params.row.Discount).toFixed(2)}  
                    </div>
                    )
                },
                {
                    field: 'totalsalary',
                    headerName: 'Payout',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        $  { Number(params.row.totalsalary/100).toFixed(2)}  
                    </div>
                    )
                },
                // {
                //     field: 'totalsalarygiven',
                //     headerName: 'Paid',
                //     minWidth: 100,
                //     editable: false,
                //     renderCell: (params) => (
                //     <div>
                //         $  { Number(params.row.totalsalarygiven).toFixed(2)}  
                //     </div>
                //     )
                // },
                // {
                //     field: '',
                //     headerName: 'Balance',
                //     minWidth: 100,
                //     editable: false,
                //     renderCell: (params) => (
                //     <div>
                //         $  { Number((params.row.totalsalary/100)-params.row.totalsalarygiven).toFixed(2)}  
                //     </div>
                //     )
                // },
                {
                    field: 'Action',
                    headerName:'Action',
                    minWidth:200,
                    renderCell: (params) => (
                    <strong>    
                        {
                        // <ButtonContent permission_id = "pos_view_salary" permission_label="Show view salary"
                        // color="success" 
                        // variant="contained" 
                        // size="small" 
                        // onClick={()=>this.openReport(params.row)} 
                        // label="View"/> 

                        <ButtonContent permission_id = "pos_view_salary" permission_label="Show view salary"
                        color="success" 
                        variant="contained" 
                        size="small" 
                        onClick={()=>this.printReport(params.row)} 
                        label="Print"/> 

                        }    
                         {/* { Number(params.row.ServiceAmount-params.row.totalsalarygiven) > 0 &&  <ButtonContent permission_id = "pos_pay_salary" permission_label="Show Pay salary"
                        color="success" 
                        variant="contained" 
                        size="small" 
                        onClick={()=>this.payAmount(params.row)} 
                        label="Pay"/> } */}
                    
                    </strong>
                    ),
                }
                ],
            from_date:new Date(),
            to_date:new Date(),
            employee_details:[],
            showPaypopup:false,
            commission: {},
            ticketslist:[],
            allcommission:[]
         };
         this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
         this.handlechangeToDate = this.handlechangeToDate.bind(this);
         this.submiteReport = this.submiteReport.bind(this)
         this.payAmount = this.payAmount.bind(this);
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);

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
      

      printReport(row){
        this.setState({isLoading:true}, ()=>{
            this.dataManager.getData("select * from default_commission").then(defres=>{
                var commission = defres.length > 0 ? defres[0] : {owner_percentage:0, employee_percentage:100, cash_percentage: 50, check_percentage: 50};
                if(defres.length > 0)
                commission["employee_percentage"] = commission["emp_percentage"]
                this.dataManager.getData("select * from employee_salary where employeeId="+row.id).then(com=>{
                    if(com.length > 0){
                        commission = com[0]
                    } 

                    this.dataManager.getData(`select strftime('%m/%d',(select created_at from ticket where sync_id=ts.ticketref_id)) AS ticket_date, ts.service_cost as Amount, ts.tips_amount as Tips, ts.total_discount_amount as Discount from ticket_services as ts where ts.ticketref_id in (select sync_id from ticket where DATE(created_at) between '`+this.state.from_date.toISOString().substring(0,10)+`' and '`+this.state.to_date.toISOString().substring(0,10)+`' and isDelete=0)  and ts.employee_id = `+row.id).then(res=>{
                        console.log(commission);
                        var businessdetail = window.localStorage.getItem('businessdetail');
                        var printername = window.localStorage.getItem('defaultprinter');
                        if(businessdetail !== undefined && businessdetail !== null &&  printername !== undefined && printername !== ''){ 
                                var columns = ["Date", "Amount", "Tips", "Discount"]; 

                                let from_date = Moment(this.state.from_date).format('MM-DD-YYYY');
                                let to_date = Moment(this.state.to_date).format('MM-DD-YYYY');
                                var totalpayable = (Number(row.ServiceAmount)*(Number(commission.employee_percentage)/100)) + row.Tips - row.Discount;

                                var data = [];
                                data.push({
                                    type: "text", 
                                    value: this.state.businessdetail.name,
                                    style: `text-align:center;`,
                                    css: { "font-weight": "700", "font-size": "24px" },
                                    }); 
                                data.push({
                                    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
                                    value:  'Salary Report',
                                    style: `text-align:center;`,
                                    css: { "font-weight": "700", "font-size": "14px" },
                                    });

                                data.push({
                                    type: "text", 
                                    value: from_date+" to "+to_date, // Moment(new Date()).format('DD-MM-YYYY hh:mm A'),
                                    style: `text-align:center;`,
                                    css: {  "font-size": "14px","margin-top": 5 },
                                    });

                                data.push({
                                    type: "text", 
                                    value: "Employee: <b>"+row.firstName+" "+row.lastName,
                                    style: `text-align:left;`,
                                    css: {  "font-size": "14px","margin-top": 10, "margin-left": 0 },
                                    });

                                if(res.length > 0){
                                    data.push({
                                        type: 'table',
                                        // style the table
                                        style: 'border: 0px solid #ddd',
                                        css: {  "font-size": "14px","margin-top": 10 },
                                        tableBody: res.map(e=>{ 
                                            return [
                                                {
                                                    type: "text",  
                                                    value: e.ticket_date,
                                                    style: `text-align:left;`,
                                                    css: {  "font-size": "12px" },
                                                }, 
                                                {
                                                    type: "text", 
                                                    value:  "$"+e.Amount,
                                                    style: `text-align:left;`,
                                                    css: {  "font-weight": "500","font-size": "14px", marginTop: -40 },
                                                },
                                                {
                                                    type: "text", 
                                                    value:  "$"+e.Tips,
                                                    style: `text-align:left;`,
                                                    css: {  "font-weight": "500","font-size": "14px", marginTop: -40 },
                                                },
                                                {
                                                    type: "text", 
                                                    value:  "$"+e.Discount,
                                                    style: `text-align:left;`,
                                                    css: {  "font-weight": "500","font-size": "14px", marginTop: -40 },
                                                }
                                            ]

                                        }),
                                        tableHeader: columns,
                                        tableBodyStyle: 'border: 0px solid #ddd',
                                        
                                    })

                                    data.push({
                                        type: "text", 
                                        value: "Payroll",
                                        style: `text-align:left;`,
                                        css: {  "font-size": "18px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                                        });

                                    data.push({
                                        type: "text", 
                                        value: "<div style='width:70%;float:left;'>Amount</div><div style='width:30%;float:left;'>$"+row.ServiceAmount+"</div>",
                                        style: `text-align:left;`,
                                        css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                                        });

                                    data.push({
                                        type: "text", 
                                        value: "<div style='width:70%;float:left;'>Supply</div><div style='width:30%;float:left;'>$0.00</div>",
                                        style: `text-align:left;`,
                                        css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                                        });

                                    data.push({
                                        type: "text", 
                                        value: "<div style='width:70%;float:left;'>Commission("+commission.employee_percentage+"%)</div><div style='width:30%;float:left;'>$"+(Number(row.ServiceAmount)*(Number(commission.employee_percentage)/100)).toFixed(2)+"</div>",
                                        style: `text-align:left;`,
                                        css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                                        });

                                    data.push({
                                            type: "text", 
                                            value: "<div style='width:70%;float:left;'>Discounts</div><div style='width:30%;float:left;'>"+Number(row.Discount).toFixed(2)+"</div>",
                                            style: `text-align:left;font-weight:bold;`,
                                            css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                                            });
                                    data.push({
                                            type: "text", 
                                            value: "<div style='width:70%;float:left;'>Tips</div><div style='width:30%;float:left;'>$"+Number(row.Tips).toFixed(2)+"</div>",
                                            style: `text-align:left;font-weight:bold;`,
                                            css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                                            });
            
            
                                    data.push({
                                        type: "text", 
                                        value: "<div style='width:70%;float:left;'>Total</div><div style='width:30%;float:left;'>"+Number(totalpayable).toFixed(2)+"</div>",
                                        style: `text-align:left;font-weight:bold;`,
                                        css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                                        });

                                    data.push({
                                        type: "text", 
                                        value: "<div style='width:70%;float:left;'>Cash("+commission.cash_percentage+"%)</div><div style='width:30%;float:left;'>$"+Number(totalpayable * (commission.cash_percentage / 100)).toFixed(2)+"</div>",
                                        style: `text-align:left;font-weight:bold;`,
                                        css: {  "font-size": "16px" ,"margin-top": 10, "margin-left": 0 },
                                        });
                                    data.push({
                                            type: "text", 
                                            value: "<div style='width:70%;float:left;'>Check("+commission.check_percentage+"%)</div><div style='width:30%;float:left;'>$"+Number(totalpayable * (commission.check_percentage / 100)).toFixed(2)+"</div>",
                                            style: `text-align:left;font-weight:bold;`,
                                            css: {  "font-size": "16px" ,"margin-top": 10, "margin-left": 0 },
                                            });    
                                }
                                else{ 
                                    data.push({
                                        type: "text", 
                                        value: "No tickets made during this time period by "+this.state.empReport[0].firstName+" "+this.state.empReport[0].lastName,
                                        style: `text-align:center;`,
                                        css: {  "font-size": "14px","margin-top": 10, "margin-left": 0 },
                                    });
                                }

                                data.push({
                                    type: "text", 
                                    value:  this.state.businessdetail.name+" - Reported: "+Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                                    style: `text-align:center;border-bottom:1px dotted #000;margin:10px 0 20px;`,
                                    css: {  "font-size": "14px","margin": '10px 0 20px', "border-bottom":"1px dotted #000"},
                                });

                                var printinput = {printername: window.localStorage.getItem('defaultprinter'), data: data}; 
                                console.log(printinput)
                                window.api.printdata(printinput).then(res=>{
                                    this.setState({isLoading:false})
                                })

                        } 
                        else{
                            alert("No printer selected")
                        }
                    })
                })
            })
        })
      }

      payAmount(row){
        var empid = row.id;
        console.log(empid)
        this.setState({ selectedEmp: row }, ()=>{
            var commissiondetail = {owner_percentage:0, employee_percentage:100, cash_percentage: 50, check_percentage: 50};
            var sql = `select ts.id,strftime('%m/%d', (select created_at from ticket where sync_id=ts.ticketref_id)) AS ticket_date, (select totalamount from employee_commission_detail where ticketserviceref_id = ts.sync_id) as Amount, ts.tips_amount as Tips, ts.total_discount_amount as Discount from ticket_services as ts where ts.ticketref_id in (select  ticketref_id from ticket_payment where DATE(paid_at) between '`+ this.state.from_date.toISOString().substring(0,10)+`' and '`+ this.state.to_date.toISOString().substring(0,10)+`' and ticketref_id in (select sync_id from ticket where isDelete=0 and paid_status='paid') ) and ts.isActive=1 and ts.employee_id = `+empid;
            var commsql = `select sum(ec.totalamount) as ServiceAmount,sum(ec.cash_amt) as CashAmount, ec.owner_percent, ec.emp_percent from employee_commission_detail as ec join ticket_services as ts on ts.sync_id=ec.ticketserviceref_id and ts.isActive=1 where ec.cash_type_for='service' and ec.employeeId=`+empid+` and ts.ticketref_id in (select ticketref_id from ticket_payment where DATE(paid_at)  between '`+ this.state.from_date.toISOString().substring(0,10)+`' and '`+ this.state.to_date.toISOString().substring(0,10)+`') and ts.isActive=1  group by ec.owner_percent, ec.emp_percent`;
            if(this.state.from_date === this.state.to_date){
                sql = `select ts.id,strftime('%m/%d', (select created_at from ticket where sync_id=ts.ticketref_id)) AS ticket_date, (select totalamount from employee_commission_detail where ticketserviceref_id = ts.sync_id) as Amount, ts.tips_amount as Tips, ts.total_discount_amount as Discount from ticket_services as ts where ts.ticketref_id in (select  ticketref_id from ticket_payment where DATE(paid_at) = '`+ this.state.from_date.toISOString().substring(0,10)+`' and ticketref_id in (select sync_id from ticket where isDelete=0 and paid_status='paid') ) and ts.isActive=1 and ts.employee_id = `+empid
                commsql = `select sum(ec.totalamount) as ServiceAmount,sum(ec.cash_amt) as CashAmount, ec.owner_percent, ec.emp_percent from employee_commission_detail as ec join ticket_services as ts on ts.sync_id=ec.ticketserviceref_id and ts.isActive=1 where ec.cash_type_for='service' and ec.employeeId=`+empid+` and ts.ticketref_id in (select ticketref_id from ticket_payment where DATE(paid_at) = '`+ this.state.from_date.toISOString().substring(0,10)+`') and ts.isActive=1  group by ec.owner_percent, ec.emp_percent`
            } 
            this.dataManager.getData(`select * from default_commission`).then(defcom=>{
                if(defcom.length > 0){
                    commissiondetail = defcom[0];
                    commissiondetail["employee_percentage"] = commissiondetail["emp_percentage"];
                }
                this.dataManager.getData(`select * from employee_salary where employeeId=`+row.id).then(empsal=>{
                    if(empsal.length > 0){
                        commissiondetail = empsal[0];
                    }
                    this.dataManager.getData(sql ).then(res=>{
                        this.dataManager.getData(commsql).then(comm=>{
                            console.log("tickets list", res)
                            this.setState({ticketslist : res, commission: commissiondetail, allcommission:comm }, ()=>{
                                this.setState({showPaypopup:true})
                            })
                        })
                    })
                })
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
       
      });

        var condition = navigator.onLine ? 'online' : 'offline';
        this.setState({isOnline: (condition=="online") ? true: false}, function() {
            if(!this.state.isOnline) {

            }
            else {
                this.getEmpDetails()
                this.getEmpReportList()
            }
        })
    }



    getEmpDetails() {
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            this.setState({isLoading: true})
            axios.get(config.root+"/employee/"+JSON.parse(businessdetail).id).then((res)=>{
                this.setState({isLoading: false,employee_details:res.data.data}, function(){
                })
            });
        }
      }


    getEmpReportList(){
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            this.setState({isLoading: true}) 
            // this.dataManager.getData(`select u.id as id, u.*,(select sum(totalamount) from employee_commission_detail where isActive=1 and ticketserviceref_id in (select sync_id from ticket_services where employee_id=u.id and  isActive=1 and  ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where DATE(paid_at) between '`+this.state.from_date.toISOString().substring(0,10)+`' and '`+this.state.to_date.toISOString().substring(0,10)+`') and isDelete=0 and paid_status='paid'))) as ServiceAmount,(select sum((totalamount*emp_percent)) from employee_commission_detail where cash_type_for='service' and  employeeId=u.id and ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where DATE(paid_at) between '`+this.state.from_date.toISOString().substring(0,10)+`' and '`+this.state.to_date.toISOString().substring(0,10)+`') and isDelete=0 and paid_status='paid')) as totalsalary,(select sum(Amount) from emp_payment where employeeId=u.id) as totalsalarygiven, sum(ts.tips_amount) as Tips, sum(ts.total_discount_amount) as Discount from users AS u left join  ticket_services as ts on ts.employee_id= u.id where ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where DATE(paid_at) between '`+this.state.from_date.toISOString().substring(0,10)+`' and '`+this.state.to_date.toISOString().substring(0,10)+`') and isDelete=0 and paid_status='paid') group by u.id`).then(res=>{  
              this.dataManager.getData(`select u.id as id, u.*, sum(ts.service_cost) as ServiceAmount,(select sum((totalamount*emp_percent)) from employee_commission_detail where cash_type_for='service' and  employeeId=u.id and ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where DATE(paid_at) between '`+this.state.from_date.toISOString().substring(0,10)+`' and '`+this.state.to_date.toISOString().substring(0,10)+`') and isDelete=0 and paid_status='paid')) as totalsalary,(select sum(Amount) from emp_payment where employeeId=u.id) as totalsalarygiven, sum(ts.tips_amount) as Tips, sum(ts.total_discount_amount) as Discount from users AS u left join  ticket_services as ts on ts.employee_id= u.id where ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where DATE(paid_at) between '`+this.state.from_date.toISOString().substring(0,10)+`' and '`+this.state.to_date.toISOString().substring(0,10)+`') and isDelete=0 and paid_status='paid') group by u.id`).then(res=>{  
                console.log(res);
                    this.setState({isLoading: false, employee_reportlist: res}) 
            })

            // axios.get(config.root+"/employee_commission/list/"+JSON.parse(businessdetail).id).then((res)=>{  
            //     this.setState({employee_reportlist:res.data.data}, function(){
            //         if(this.state.employee_reportlist.length >0){
            //             var updateInput = [];
            //             updateInput = this.state.employee_reportlist;
            //             for(var k=0;k<this.state.employee_reportlist.length;k++){
            //                 let selected_emp = this.state.employee_details.filter(item => item.id === this.state.employee_reportlist[k].id);
            //                 // updateInput[k].staff_role =   selected_emp[0].staff_role != null ? selected_emp[0].staff_role : '';

            //                 var staff_role = ""
            //                 if(selected_emp.length> 0) {
            //                     if(selected_emp[0].staff_role !=null) {
            //                         staff_role = selected_emp[0].staff_role
            //                     }
                               
            //                 }
            //                 updateInput[k].staff_role = staff_role
            //             }
            //             this.setState({isLoading: false,employee_reportlist: updateInput });                        
            //         }
            //     });
            // })
        }
    }
    openReport(empdetail){
        this.setState({selectedEmp: empdetail}, function(){
          this.setState({isEmpSelected: true});
        })
    }
    handleCloseReport(){
        this.setState({isEmpSelected: false, showPaypopup: false}, ()=>{ 
            this.getEmpDetails()
            this.getEmpReportList()
        });
    }
    handlechangeFromDate(e){
        this.setState({from_date: e});
    }
    handlechangeToDate(e){
        this.setState({to_date: e});
    }



    submiteReport() {
        //console.log(this.state.from_date,this.state.to_date)
        this.getEmpReportList()
    }

    render() {
        return (
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

        
        {/* Drawer menu ends */}

          {/* ResponsiveGridLayout Starts */}

        <Grid container spacing={3}  style={{height:'calc(100% - 104px)', padding: 0}}>
            <Grid item xs={12} style={{height:'100%', paddingRight:0}}> 


            <div  style={{height: '100%'}}>
                <Container maxWidth="xl" style={{marginTop: '2%',  height: '100%'}}>
                    <Stack direction="column" alignItems="left" mb={5}>
                        <Typography variant="h5" gutterBottom> Employee Salary </Typography>
                     </Stack>

                   
                    {/* {this.state.isOnline && */}
                    <div style={{height: '100%'}}>
                     <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="From"
                                    inputFormat="MM/dd/yyyy"
                                    
                                    maxDate={new Date()}
                                    value={this.state.from_date}
                                    onChange={this.handlechangeFromDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="To"
                                    inputFormat="MM/dd/yyyy"
                                    minDate={this.state.from_date}
                                    maxDate={new Date()}
                                    value={this.state.to_date}
                                    onChange={this.handlechangeToDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <ButtonContent permission_id = "pos_get_salary" permission_label="Show get salary"
                            color="success" 
                            size="large" 
                            variant="contained" 
                            label="Submit" 
                            onClick={()=>this.submiteReport()}/>
                        </Stack>

                     </Stack>
                     <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white', marginTop: 20}}>
                    <div className="tabcontent" style={{ height: '80%', width: '100%', background: 'white',  }}>
                    {/* <Card sx={{mt:2}}  style={{height: '80%'}}> */}
                        <TableContent  permission_id = "pos_list_salary" permission_label="Show list salary"
                        style={{height: '100%'}}  onRowClick={(data)=>{this.payAmount(data.row)}}
                        data={this.state.employee_reportlist} 
                        columns={this.state.columns} />
                    </div></div> 
                    </div>
                    {/* } */}


                </Container> 

                {/* Employee Report popup */}
                {this.state.isEmpSelected && <div>
                    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute', zIndex:'999999'}}>
                        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                        </div>
                        <div style={{background:'#fff', height:'80%',  width:'80%', margin:'10% auto 0', position:'relative'}}> 
                        <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5} style={{ marginTop: 0, marginBottom:0}}>
                        
                    <Typography variant="title" gutterBottom> <b>{this.state.selected_emp.businessName}</b></Typography>
                        <Typography variant="subtitle2" gutterBottom><b>Salary Report</b></Typography>
                        <Typography variant="subtitle2" gutterBottom> {this.state.from_date.toISOString().substring(0,10).replace(/-/g,"/")} - {this.state.to_date.toISOString().substring(0,10).replace(/-/g,"/")}</Typography>
                         <Typography variant="subtitle2" gutterBottom>Employee: <b> {this.state.selected_emp.firstName+" "+this.state.selected_emp.lastName} </b></Typography>
                       {/* <Typography variant="subtitle2" gutterBottom>Total Tips: $ {this.state.selected_emp.total_tips}</Typography> */}

                    </Stack>
                            {/* <ModalTitleBar onClose={()=>this.handleCloseReport()} title="Report Details"/> */}
                            <div style={{height:'600px', overflow:'auto'}}>
                                <ReportView empSelected={this.state.selectedEmp}/>
                            </div>
                        </div>
                    </div>
                </div>}

                {this.state.showPaypopup && <div>
                    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute', zIndex:'999999'}}>
                        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                        </div>
                        <div style={{background:'#fff', height:'90%',  width:'90%', margin:'0 auto', position:'relative'}}>
                        
                        <AppBar  color="primary" style={{ position: 'relative',background: 'transparent', boxShadow: 'none' }}>
  <Toolbar>
      
  <Stack direction="row" alignItems="center" justifyContent="space-between"  mb={5} style={{ marginTop: 0, marginBottom:0,width:'80%'}}>
                        
                        {/* <Typography variant="title"  gutterBottom> <b>{this.state.selectedEmp.businessName}</b></Typography> */}
                            <Typography variant="subtitle2" style={{color:"#000", fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif'}} gutterBottom><b>{this.state.selectedEmp.firstName+" "+this.state.selectedEmp.lastName} Salary Report</b></Typography>
                            <Typography variant="subtitle2" style={{color:"#000", fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif'}} gutterBottom> {this.state.from_date.toISOString().substring(0,10).replace(/-/g,"/")} - {this.state.to_date.toISOString().substring(0,10).replace(/-/g,"/")}</Typography> 
    
                        </Stack>

                        <div style={{marginLeft: "auto",marginRight: -12}}>
                        
                        <IconButton
                        edge="start"
                        onClick={()=>this.handleCloseReport()}
                        aria-label="close"
                        style={{"color":'#134163'}}
                        >
                        <CloseIcon />
                        </IconButton>
                        </div>
                    </Toolbar>
                    </AppBar>

                            <div style={{height:'600px', overflow:'auto'}}>
                            <ReportView allcommission={this.state.allcommission} commission={this.state.commission} empSelected={this.state.selectedEmp} ticketslist={this.state.ticketslist} from_date={this.state.from_date} to_date={this.state.to_date}/>
                            </div>
                        </div>
                    </div>
                </div>}

            </div>
            </Grid>
            </Grid>


      <Snackbar open={!this.state.isOnline} style={{width:'100%', marginBottom: -25}} anchorOrigin={{ vertical: "bottom", horizontal:  "center" }}>

<MuiAlert elevation={6}  variant="filled" severity="error" sx={{ width: '100%' }} style={{background: 'red', color: 'white'}}>
No internet available !
</MuiAlert>


</Snackbar>


            </div>
            </div>
        )
    }

}