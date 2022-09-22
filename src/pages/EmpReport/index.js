import React from "react"; 
import axios from 'axios';
import Moment from 'moment';
import config from '../../config/config'; 
import LoaderContent from '../../components/Modal/loadingmodal'; 
import Close from '@mui/icons-material/Close'
import CloseIcon from '@mui/icons-material/Close'; 
import { Card, CardContent,  Stack, Container, Typography,TextField , Grid,IconButton, Button, 
    Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, FormControl,FormLabel, FormControlLabel, RadioGroup, Radio, InputLabel, Select, Chip, Input,  MenuItem, Checkbox } from '@mui/material';

//import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
 
import {Print, CalendarMonthOutlined} from '@mui/icons-material';    
import SyncIcon from '@mui/icons-material/Sync';
import NumberPad from '../../components/numberpad';
import DataManager from "../../controller/datacontroller"; 
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer'; 
import ModalHeader from '../../components/Modal/Titlebar'; 

import './tabs.css';

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
export default class EmployeeReport extends React.Component {

    dataManager = new DataManager();
  constructor(props) {
    super(props);
    
      this.state={
        oginInfo : true,
        passInfo : false,
        clockInfo: false, 
        isLogin: false,
        msg : '',
        openDialog: false,
        businessdetail:{},
        passcode : '',
        disabled: true,
        unSynced: false,
        codeLength: 4,
        isLoading: false,
        dataManager: new DataManager(),
        isAuthorized: false,
        reportEmps:[],
        restrictionmode:'Owner',
        tabName:'Owner',
        from_date:new Date(),
        to_date:new Date(),
        showDatePopup: false,
        employeelist:[],
        reporttype: 'daily',
        selectedemps: [],
        reportby:'default',
        empReport:[],
        wrongPasscode: false,
        cashdata:[],
        discountdata:[],
        empdiscount:[],
        ownertotal:0,
        isSyncing: false,
        tax_Amount: 0,
        ticketInfo:false,
        selectedData:{},
        ownerdetail : {},
        supplydetail:{},
        profitdetail:{profit:0},
        selectedEmp:0
    }
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeCode = this.handleChangeCode.bind(this);
    this.authorize = this.authorize.bind(this)
    this.handlechangeFromDate = this.handlechangeFromDate.bind(this);
    this.handlechangeToDate = this.handlechangeToDate.bind(this);
    this.handleType = this.handleType.bind(this)
    this.handlechangeSelect = this.handlechangeSelect.bind(this);
    this.logout = this.logout.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this) 
    this.handleClick = this.handleClick.bind(this);
    this.handlePageEvent = this.handlePageEvent.bind(this);
    this.getReport = this.getReport.bind(this);
    this.reloadPage = this.reloadPage.bind(this)
    this.syncData = this.syncData.bind(this)
    this.finishDownloading = this.finishDownloading.bind(this)
    this.onClose = this.onClose.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  onClose() {
    this.props.onChangePage("dashboard");
  }

  handlechangeSelect(event){
    var emps = [];
    emps.push(event.target.value);
    this.setState({selectedemps:emps, selectedEmp: event.target.value}, ()=>{
        this.getReport()
    });
  }

  handleType(e){
    this.setState({reporttype: e.target.value})
  }

  syncData() {
    this.setState({isSyncing: true}) 
  }

  finishDownloading(){
    console.log("finishDownloading in MAIN")
    this.setState({isSyncing: false, unSynced: false}, function() {
        this.getEmpDetails()
    })
  }

  getUnsyncedData() {
    
    var unSynced = false
    var detail = window.localStorage.getItem('businessdetail');
    var businessdetail = JSON.parse(detail);
    var ticketsql = "select t.*,c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.id where t.businessId='"+businessdetail["id"]+"' and t.isDelete!=1 and t.sync_status=0"
 
    /**ticket */
    this.state.dataManager.getData(ticketsql).then(response =>{

        // console.log(response.length>0)
        if(response.length>0) {
            unSynced = true
        }

        this.setState({unSynced: unSynced} )
        // else {
        //     /**ticket_services */
        //     var ticket_servicessql = "select * from ticket_services where sync_status=0"
        //     this.state.dataManager.getData(ticket_servicessql).then(response =>{
        //         if(response.length > 0) {
        //             unSynced = true
        //         }
        //         else {
        //             /**ticket_payment */
        //             var ticket_paymentsql = "select * from ticket_payment where sync_status=0"
        //             this.state.dataManager.getData(ticket_paymentsql).then(response =>{
        //                 if(response.length > 0) {
        //                     unSynced = true
        //                 }
        //                 else {

        //                 }
        //             })
        //         }
        //     })
        // }
      
       
    })
 
  }

  componentDidMount(){ 

    let detail = window.localStorage.getItem("businessdetail");
    this.setState({businessdetail: JSON.parse(detail)}, function(){ 
        var condition = navigator.onLine ?  true: false;
        this.setState({isOnline: condition}, function() {
            if(!this.state.isOnline) {
                
            }
            else { 
                // this.getEmpDetails()
                
            }
        })
        this.dataManager.getData("select * from users where staff_role='Owner'").then(res=>{
            if(res.length > 0){
                this.setState({ownerdetail:res[0]})
            }
            else{
                this.setState({ownerdetail:{firstName:'', lastName:''}})
            }
        })
        
    });


}

  getReport(){  
    this.setState({isLoading: true})
    let from_date = Moment(this.state.from_date).format('YYYY-MM-DD');
    let to_date = Moment(this.state.to_date).format('YYYY-MM-DD');
    // let url = config.root+"/report/getReport"
    var input = {
        businessId: this.state.businessdetail.id,
        from_date: from_date,
        to_date: to_date, 
        reportType:this.state.tabName
    }
    if(this.state.tabName === 'Employee'){
        input["employees"] = this.state.selectedemps;
    }
    else{
        var owner = this.state.employeelist.filter(r=>r.staff_role === 'Owner');
        if(owner.length > 0)
            input["employees"] = [owner[0].id]
    }
    var sql = `SELECT strftime('%Y', (select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_year, 
    strftime('%m/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_month,
    strftime('%m/%d/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_date,  
    (select sum(totalamount) from employee_commission_detail where employeeId = ec.employeeId and (cash_type_for='service' or cash_type_for='product')  and  ticketref_id=ec.ticketref_id and isActive=1)  as Amount,
        (select  SUM(cash_amt) from employee_commission_detail where cash_type_for='tips' and ticketref_id=tp.ticketref_id and employeeId=u.id and isActive=1) as Tips,
        ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id  and isActive=1 and ticketserviceref_id is not null) as Discount,
        ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1 and ticketserviceref_id is null) as TicketDiscount, tp.ticketref_id, 
        (select ticket_code from ticket where sync_id=tp.ticketref_id) as ticket_code,
        (select count(ticketref_id) from ticket_services where ticketref_id=tp.ticketref_id and isActive=1 and employee_id=u.id) as ticket_servicescount,
        (select paid_status from ticket where sync_id=tp.ticketref_id) as paid_status,
        (select total_tax from ticket where sync_id=tp.ticketref_id) as total_tax,
        (select grand_total from ticket where sync_id=tp.ticketref_id) as grand_total,
        u.id as employee_id, u.firstName, u.lastName, u.staff_role as role,  tp.pay_mode , tp.card_type
        FROM    ticket_payment as tp
        left join employee_commission_detail as ec   on tp.ticket_id=ec.ticketref_id join users as u on u.id = ec.employeeId 
        WHERE ec.businessId=`+input.businessId+` and ( ec.cash_type_for='service' or ec.cash_type_for='product'  or ec.cash_type_for='tips' 
        or ec.cash_type_for like '%discount%') and  ec.isActive=1 and 
        ec.ticketref_id in (select sync_id from ticket where  sync_id in (select ticketref_id from ticket_payment where  DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and isDelete=0 
        and businessId=`+input.businessId+` and paid_status='paid') and tp.isActive=1 GROUP BY ec.employeeId, ec.ticketref_id, ticket_date order by ec.employeeId ;`


        var discountquery = ` SELECT   SUM(CASE WHEN  cash_type_for = 'owner-discount' THEN cash_amt ELSE 0 END) as OwnerDiscount,
        SUM(CASE WHEN  cash_type_for = 'emp-discount' THEN cash_amt ELSE 0 END) as EmpDiscount,
        SUM(CASE WHEN  cash_type_for = 'owneremp-discount' THEN cash_amt ELSE 0 END) as OwnerEmpDiscount FROM   employee_commission_detail as ec join users as u on u.id = ec.employeeId
                   WHERE ec.businessId=`+input.businessId+` and ec.ticketserviceref_id is null and ec.cash_type_for != 'ownercommission' and  ec.isActive=1 and 
                   ec.ticketref_id in (select sync_id from ticket where  sync_id in (select ticketref_id from ticket_payment where  DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and
                   isDelete=0 and businessId=`+input.businessId+`  and paid_status='paid')`
             
                   
    if(input.from_date === input.to_date){
        sql = `SELECT strftime('%Y', (select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_year, 
        strftime('%m/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_month,
        strftime('%m/%d/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_date,  
        (select sum(totalamount) from employee_commission_detail where employeeId = ec.employeeId  and (cash_type_for='service' or cash_type_for='product')  and  ticketref_id=ec.ticketref_id and isActive=1)  as Amount,
            (select SUM(cash_amt) from employee_commission_detail where cash_type_for='tips' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1) as Tips,
            ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1 and ticketserviceref_id is not null) as Discount,
            ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1 and ticketserviceref_id is null) as TicketDiscount, tp.ticketref_id, 
            (select ticket_code from ticket where sync_id=tp.ticketref_id) as ticket_code,
            (select count(ticketref_id) from ticket_services where ticketref_id=tp.ticketref_id and isActive=1 and employee_id=u.id) as ticket_servicescount,
            (select paid_status from ticket where sync_id=tp.ticketref_id) as paid_status,
            (select total_tax from ticket where sync_id=tp.ticketref_id) as total_tax,
            (select grand_total from ticket where sync_id=tp.ticketref_id) as grand_total,
            u.id as employee_id, u.firstName, u.lastName, u.staff_role as role,  tp.pay_mode , tp.card_type
            FROM    ticket_payment as tp
            left join employee_commission_detail as ec   on tp.ticket_id=ec.ticketref_id join users as u on u.id = ec.employeeId 
        WHERE ec.businessId=`+input.businessId+` and (  ec.cash_type_for='service' or ec.cash_type_for='product'  or ec.cash_type_for='tips' 
        or ec.cash_type_for like '%discount%') and  ec.isActive=1 and 
        ec.ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) = '`+input.from_date+`')  and isDelete=0 
        and businessId=`+input.businessId+` and paid_status='paid') and tp.isActive=1 GROUP BY ec.employeeId, ec.ticketref_id, ticket_date order by ec.employeeId ;
        
        `;

        discountquery = ` SELECT   SUM(CASE WHEN  cash_type_for = 'owner-discount' THEN cash_amt ELSE 0 END) as OwnerDiscount,
        SUM(CASE WHEN  cash_type_for = 'emp-discount' THEN cash_amt ELSE 0 END) as EmpDiscount,
        SUM(CASE WHEN  cash_type_for = 'owneremp-discount' THEN cash_amt ELSE 0 END) as OwnerEmpDiscount FROM   employee_commission_detail as ec join users as u on u.id = ec.employeeId
                   WHERE ec.businessId=`+input.businessId+` and ec.ticketserviceref_id is null and ec.cash_type_for != 'ownercommission' and  ec.isActive=1 and 
                   ec.ticketref_id in (select sync_id from ticket where  sync_id in (select ticketref_id from ticket_payment where  DATE(paid_at) = '`+input.from_date+`') and
                   isDelete=0 and businessId=`+input.businessId+`  and paid_status='paid')`
    }

        if(input["employees"] !== undefined && input.employees.length > 0 && input.reportType !== 'Owner'){
           sql = `SELECT strftime('%Y', (select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_year, 
           strftime('%m/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_month,
           strftime('%m/%d/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_date,  
           (select sum(totalamount) from employee_commission_detail where employeeId = ec.employeeId  and (cash_type_for='service' or cash_type_for='product')  and  ticketref_id=ec.ticketref_id and isActive=1)  as Amount,
               (select SUM(cash_amt) from employee_commission_detail where cash_type_for='tips' and ticketref_id=tp.ticketref_id  and employeeId=u.id and isActive=1) as Tips,
               ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id  and employeeId=u.id  and isActive=1 and  ticketserviceref_id is not null) as Discount,
               ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1 and ticketserviceref_id is null) as TicketDiscount, tp.ticketref_id, 
               (select ticket_code from ticket where sync_id=tp.ticketref_id) as ticket_code,
               (select count(ticketref_id) from ticket_services where ticketref_id=tp.ticketref_id and isActive=1  and employee_id=u.id) as ticket_servicescount,
               (select paid_status from ticket where sync_id=tp.ticketref_id) as paid_status,
               (select total_tax from ticket where sync_id=tp.ticketref_id) as total_tax,
               (select grand_total from ticket where sync_id=tp.ticketref_id) as grand_total,
               u.id as employee_id, u.firstName, u.lastName, u.staff_role as role,  tp.pay_mode , tp.card_type
               FROM    ticket_payment as tp
               left join employee_commission_detail as ec   on tp.ticket_id=ec.ticketref_id join users as u on u.id = ec.employeeId 
            WHERE ec.businessId=`+input.businessId+` and ec.isActive=1 and ec.cash_type_for != 'ownercommission' and 
            ec.ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and
            isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') 
            and ec.employeeId in (`+input.employees+`)  and tp.isActive=1
            GROUP BY ec.employeeId, ec.ticketref_id, ticket_date order by ec.employeeId ;
            `
            discountquery = ` SELECT  employeeId, SUM(CASE WHEN  cash_type_for = 'owner-discount' THEN cash_amt ELSE 0 END) as OwnerDiscount,
        SUM(CASE WHEN  cash_type_for = 'emp-discount' THEN cash_amt ELSE 0 END) as EmpDiscount,
        SUM(CASE WHEN  cash_type_for = 'owneremp-discount' THEN cash_amt ELSE 0 END) as OwnerEmpDiscount FROM   employee_commission_detail as ec join users as u on u.id = ec.employeeId
                   WHERE ec.businessId=`+input.businessId+` and ec.ticketserviceref_id is null and ec.cash_type_for != 'ownercommission' and  ec.isActive=1 and 
                   ec.ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and
                   isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') group by ec.employeeId order by ec.employeeId`


                   if(input.from_date === input.to_date){
                    sql = `SELECT strftime('%Y', (select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_year, 
                    strftime('%m/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_month,
                    strftime('%m/%d/%Y',(select paid_at from ticket where sync_id=tp.ticketref_id)) AS ticket_date,  
                     (select sum(totalamount) from employee_commission_detail where employeeId = ec.employeeId  and (cash_type_for='service' or cash_type_for='product')  and  ticketref_id=ec.ticketref_id and isActive=1) as Amount,
                        (select SUM(cash_amt) from employee_commission_detail where cash_type_for='tips' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1) as Tips,
                        ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1 and  ticketserviceref_id is not null) as Discount,
                        ( select SUM(cash_amt) from employee_commission_detail where cash_type_for like '%discount' and ticketref_id=tp.ticketref_id and employeeId=u.id  and isActive=1 and ticketserviceref_id is null) as TicketDiscount, tp.ticketref_id, 
                        (select ticket_code from ticket where sync_id=tp.ticketref_id) as ticket_code,
                        (select count(ticketref_id) from ticket_services where ticketref_id=tp.ticketref_id and isActive=1  and employee_id=u.id) as ticket_servicescount,
                        (select paid_status from ticket where sync_id=tp.ticketref_id) as paid_status,
                        (select total_tax from ticket where sync_id=tp.ticketref_id) as total_tax,
                        (select grand_total from ticket where sync_id=tp.ticketref_id) as grand_total,
                        u.id as employee_id, u.firstName, u.lastName, u.staff_role as role,  tp.pay_mode , tp.card_type
                        FROM    ticket_payment as tp
                        left join employee_commission_detail as ec   on tp.ticket_id=ec.ticketref_id join users as u on u.id = ec.employeeId 
                     WHERE ec.businessId=`+input.businessId+` and ec.cash_type_for != 'ownercommission' and  ec.isActive=1 and 
                     ec.ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where  DATE(paid_at) = '`+input.from_date+`')  and
                     isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') 
                     and ec.employeeId in (`+input.employees+`)   and tp.isActive=1
                     GROUP BY ec.employeeId, ec.ticketref_id, ticket_date order by ec.employeeId ;
                     `
                     discountquery = ` SELECT  employeeId, SUM(CASE WHEN  cash_type_for = 'owner-discount' THEN cash_amt ELSE 0 END) as OwnerDiscount,
                 SUM(CASE WHEN  cash_type_for = 'emp-discount' THEN cash_amt ELSE 0 END) as EmpDiscount,
                 SUM(CASE WHEN  cash_type_for = 'owneremp-discount' THEN cash_amt ELSE 0 END) as OwnerEmpDiscount FROM   employee_commission_detail as ec join users as u on u.id = ec.employeeId
                            WHERE ec.businessId=`+input.businessId+` and ec.ticketserviceref_id is null and ec.cash_type_for != 'ownercommission' and  ec.isActive=1 and 
                            ec.ticketref_id in (select sync_id from ticket where  DATE(created_at) = '`+input.from_date+`' and
                            isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') group by ec.employeeId order by ec.employeeId`
                   }
        }   


        var cashsql = `select SUM(ticket_amt) as PaidAmount, pay_mode, card_type from ticket_payment where isActive=1 and  ticketref_id in   (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and
        isDelete=0 and businessId=`+input.businessId+` and paid_status='paid')  group by pay_mode, card_type` 

        var taxsql = `select SUM(total_tax) as tax_amount from  ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and
        isDelete=0 and businessId=`+input.businessId+` and paid_status='paid' and sync_id in (select ticket_id from ticket_payment)` 

        var supplysql = `select SUM(service_cost) as PaidAmount from ticket_services as ts join ticket_payment as tp on tp.ticketref_id=ts.ticketref_id where tp.isActive=1 and  tp.ticketref_id in   (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') and ts.service_id in (select sync_id from services where producttype='product')`

        var profitsql= `select sum(cash_amt) as profit from employee_commission_detail as ec where (ec.cash_type_for='ownercommission' or ec.cash_type_for='product') and ec.isActive=1 and  ec.ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and isDelete=0 and businessId=`+input.businessId+` and paid_status='paid')`;


        if(input.from_date === input.to_date){
            cashsql = `select SUM(ticket_amt) as PaidAmount, pay_mode, card_type from ticket_payment where isActive=1 and  ticketref_id in   (select sync_id from ticket where  sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) = '`+input.from_date+`')  and
            isDelete=0 and businessId=`+input.businessId+` and paid_status='paid')  group by pay_mode, card_type` 
    
            taxsql = `select SUM(total_tax) as tax_amount from  ticket where  sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) = '`+input.from_date+`') and
            isDelete=0 and businessId=`+input.businessId+` and paid_status='paid' and sync_id in (select ticket_id from ticket_payment)`

            supplysql = `select SUM(service_cost) as PaidAmount from ticket_services as ts join ticket_payment as tp on tp.ticketref_id=ts.ticketref_id  where tp.isActive=1 and  tp.ticketref_id in   (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) = '`+input.from_date+`') and isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') and ts.service_id in (select sync_id from services where producttype='product')`

            profitsql= `select sum(cash_amt) as profit from employee_commission_detail as ec where (ec.cash_type_for='ownercommission' or ec.cash_type_for='product') and ec.isActive=1  and  ec.ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) = '`+input.from_date+`') and isDelete=0 and businessId=`+input.businessId+` and paid_status='paid')`; 
        }  
        console.log(sql);
        // console.log(discountquery);
        this.dataManager.getData(sql).then(results=>{  
            this.dataManager.getData(discountquery).then(disres=>{ 
                this.dataManager.getData(taxsql).then(taxres=>{  
                    this.dataManager.getData(cashsql).then(cashres=>{ 
                        this.dataManager.getData(supplysql).then(supplyres=>{
                            if(input.reportType.trim()==='Owner'){
                                    var data = {status:200, data:results, discountdata: disres, cashdata: cashres, taxdata: taxres};

                                        this.dataManager.getData(profitsql).then(profitres=>{

                                            this.setState({supplydetail:supplyres, profitdetail:profitres.length >0? profitres[0]:{profit:0}}, ()=>{
                                                console.log("################### supply detail")
                                                console.log(profitres)
                                                console.log("###################")
                                            })
                                            this.formatResponse({
                                                data: data
                                            })
                                        });
                            }
                            else{ 
                                    this.setState({supplydetail:supplyres})
                                    var data = {status:200, data:results, discountdata: disres, cashdata: cashres, taxdata: taxres};
                                    this.formatResponse({
                                        data: data
                                    }) 
                            }
                        })
                    })
                })
            })
        }) 
    // axios.post(url, input).then((res)=>{ 
    //     // console.log(res);
    //     // this.setState({isLoading: false}) 
    //     var data = res.data.cashdata;
    //     var cashdata = [];

    //     if(this.state.tabName === 'Owner'){
    //         var isCash = data.filter(p=>p.pay_mode === 'cash');
    //         var isCredit = data.filter(p=>p.pay_mode === 'card' && p.card_type ==='credit');
    //         var isDebit = data.filter(p=>p.pay_mode === 'card' && p.card_type ==='debit');

    //         var taxamount = 0
    //         if(res.data.taxdata != undefined){
    //             if(res.data.taxdata.length > 0){
    //                 taxamount= res.data.taxdata[0].tax_amount
    //             } 
    //         }

    //         var total = 0;
    //         if(isCash.length === 0){
    //             cashdata.push({
    //                 PaidAmount:0,
    //                 pay_mode:'Cash',
    //                 card_type:''
    //             })
    //         }
    //         else{
    //             total+=isCash[0]['PaidAmount']
    //             cashdata.push({ 
    //                 PaidAmount:isCash[0]['PaidAmount'],
    //                 pay_mode:'Cash',
    //             })
    //         }

    //         if(isCredit.length === 0){
    //             cashdata.push({
    //                 PaidAmount:0,
    //                 pay_mode:'Credit Card',
    //                 card_type:''
    //             })
    //         }
    //         else{
    //             total+=isCredit[0]['PaidAmount']
    //             cashdata.push({ 
    //                 PaidAmount:isCredit[0]['PaidAmount'],
    //                 pay_mode:'Credit Card',
    //             })
    //         }

    //         if(isDebit.length === 0){
    //             cashdata.push({
    //                 PaidAmount:0,
    //                 pay_mode:'Debit Card',
    //                 card_type:''
    //             })
    //         }
    //         else{ 
    //             total+=isDebit[0]['PaidAmount']
    //             cashdata.push({ 
    //                 PaidAmount:isDebit[0]['PaidAmount'],
    //                 pay_mode:'Debit Card',
    //             })
    //         }

    //     }

    //     this.setState({cashdata: cashdata,ownertotal:total, discountdata: res.data.discountdata, empdiscount: res.data.discountdata, tax_Amount: taxamount}, ()=>{
    //         // console.log("resukt disocunt", this.state.empdiscount)
    //         this.dataformat(0, res.data.data, [], []);
    //     })
    // }); 
  }


  formatResponse(res){
    
    var data = res.data.cashdata;
    var cashdata = [];

    // if(this.state.tabName === 'Owner'){
        var isCash = data.filter(p=>p.pay_mode === 'cash');
        var isCredit = data.filter(p=>p.pay_mode === 'card' && p.card_type ==='credit');
        var isDebit = data.filter(p=>p.pay_mode === 'card' && p.card_type ==='debit');

        var taxamount = 0
        if(res.data.taxdata != undefined){
            if(res.data.taxdata.length > 0){
                taxamount= res.data.taxdata[0].tax_amount
            } 
        }

        var total = 0;
        if(isCash.length === 0){
            cashdata.push({
                PaidAmount:0,
                pay_mode:'Cash',
                card_type:''
            })
        }
        else{
            total+=isCash[0]['PaidAmount']
            cashdata.push({ 
                PaidAmount:isCash[0]['PaidAmount'],
                pay_mode:'Cash',
            })
        }

        if(isCredit.length === 0){
            cashdata.push({
                PaidAmount:0,
                pay_mode:'Credit Card',
                card_type:''
            })
        }
        else{
            total+=isCredit[0]['PaidAmount']
            cashdata.push({ 
                PaidAmount:isCredit[0]['PaidAmount'],
                pay_mode:'Credit Card',
            })
        }

        if(isDebit.length === 0){
            cashdata.push({
                PaidAmount:0,
                pay_mode:'Debit Card',
                card_type:''
            })
        }
        else{ 
            total+=isDebit[0]['PaidAmount']
            cashdata.push({ 
                PaidAmount:isDebit[0]['PaidAmount'],
                pay_mode:'Debit Card',
            })
        }

    // }

    this.setState({cashdata: cashdata,ownertotal:total, discountdata: res.data.discountdata, empdiscount: res.data.discountdata, tax_Amount: taxamount}, ()=>{
        // console.log("resukt disocunt", this.state.empdiscount)
        this.dataformat(0, res.data.data, [], []);
    })
  }

  dataformat(i, data, results, existids){
      console.log("DATA FORMAT",i, data.length ); 
        if(i < data.length ){
            var obj = data[i];
            var valtocheck = obj.ticket_month+"----"+obj.employee_id;
            if(this.state.tabName === 'Owner' && this.state.reporttype === 'daily'){ 
                valtocheck= obj.ticket_date
            }
            else if(this.state.tabName === 'Employee' && this.state.reporttype === 'daily'){
                valtocheck = obj.ticket_date+"----"+obj.employee_id;
            }
            else if(this.state.tabName === 'Owner' && this.state.reporttype === 'monthly'){ 
                valtocheck= obj.ticket_month
            }
            else if(this.state.tabName === 'Employee' && this.state.reporttype === 'monthly'){
                valtocheck = obj.ticket_month+"----"+obj.employee_id;
            }
            else if(this.state.tabName === 'Owner' && this.state.reporttype === 'annually'){ 
                valtocheck= obj.ticket_year
            }
            else if(this.state.tabName === 'Employee' && this.state.reporttype === 'annually'){
                valtocheck = obj.ticket_year+"----"+obj.employee_id;
            }

            if(this.state.reporttype === 'daily'){
                console.log("index i ", i , results)
                this.getCalculatedData(i, data, results, existids, valtocheck, obj)
            }
            else if(this.state.reporttype === 'monthly'){
                this.getCalculatedData(i, data, results, existids, valtocheck, obj)
            }
            else if(this.state.reporttype === 'annually'){
                this.getCalculatedData(i, data, results, existids, valtocheck, obj)
            } 
        }
        else{ console.log("###############################")
            console.log(results);
            console.log("###############################")
            this.groupEmpData(0, results, [], []) 
        } 
  } 

  groupEmpData(i, data,  results, empids){ 
      if(i < data.length){
        var obj = data[i]; 
        if(empids.indexOf(obj.employee_id) > -1){
            var idx = empids.indexOf(obj.employee_id);
            var eobj = results[idx];
            eobj.tickets.push(obj);
            results[idx]  = eobj;
            this.groupEmpData(i+1, data, results, empids)
        }
        else{ 
            var discountdata= this.state.discountdata[0];
            if(this.state.tabName === 'Employee'){
                var discountdatatemp = this.state.empdiscount.filter(d=>d.employeeId === obj.employee_id);
                discountdata = discountdatatemp.length > 0 ? discountdatatemp[0] : {OwnerDiscount:0, EmpDiscount:0, OwnerEmpDiscount:0}
            } 
            var cobj = {
                employee_id: obj.employee_id,
                firstName:obj.firstName,
                lastName: obj.lastName,
                role:obj.role,
                tickets:[],
                discountdata: discountdata
            }
            cobj.tickets.push(obj);
            empids.push(obj.employee_id);
            results.push(cobj);
            this.groupEmpData(i+1, data, results, empids)
        } 
      } 
      else{  
        if(this.state.tabName === 'Owner'){ 
            console.log(results); 
            var reportresults = results//.filter(f=>f.role==='Owner')
            var totalamount = 0;
            var totalTips = 0;
            var totaldiscount = 0;
            var cdiscountdata= this.state.discountdata[0]; 
            console.log("DISCOUNT DATA")
            console.log(this.state.discountdata)
            if(reportresults.length === 0){
                var owner = this.state.employeelist.filter(r=>r.staff_role === 'Owner');
                if(owner.length > 0){  
                    reportresults.push({
                        employee_id: owner[0].id,
                        firstName: owner[0].firstName,
                        lastName: owner[0].lastName,
                        tickets:[],
                        discountdata: cdiscountdata
                    })
                }
            } 
            // else{
            //     if(this.state.reporttype !== 'daily'){
            //         console.log("report data", results)
            //         results.forEach((r,i)=>{
            //             if(r !== undefined){
            //                 r.tickets.forEach((lr, j)=>{
            //                     totalamount = totalamount + lr.Amount;
            //                     totalTips = totalTips + lr.Tips;
            //                     totaldiscount = totaldiscount + lr.Discount;
            //                     var obj = reportresults[0];
            //                     obj.tickets[0].Amount = totalamount
            //                     obj.tickets[0].Tips = totalTips
            //                     obj.tickets[0].Discount = totaldiscount
            //                     reportresults[0] = obj;
            //                 })
            //             }
            //         })
            //     }
            // }
            this.setState({isLoading: false,  empReport: reportresults, showDatePopup: false})
        }
        else{ 
          var creportresults = results;
          var finalreport = [];
          this.state.selectedemps.forEach((emp, j)=>{
                var empreport = creportresults.filter(e=>e.employee_id === emp);
                var discountdata= this.state.discountdata[0]; 
                var discountdatatemp = this.state.empdiscount.filter(d=>d.employeeId === emp); 
                discountdata = discountdatatemp.length> 0? discountdatatemp[0] : {OwnerDiscount:0, EmpDiscount:0, OwnerEmpDiscount:0} 


                let from_date = Moment(this.state.from_date).format('YYYY-MM-DD');
                let to_date = Moment(this.state.to_date).format('YYYY-MM-DD');
                var input = {
                    businessId: this.state.businessdetail.id,
                    from_date: from_date,
                    to_date: to_date, 
                    reportType:this.state.tabName
                }
                
        var supplysql = `select SUM(service_cost) as PaidAmount from ticket_services as ts join ticket_payment as tp on tp.ticketref_id=ts.ticketref_id where tp.isActive=1 and  tp.ticketref_id in   (select sync_id from ticket where ts.employee_id=`+emp+` and sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') and ts.service_id in (select sync_id from services where producttype='product')`;

        var nettsql= `select sum(cash_amt) as nett from employee_commission_detail as ec where ec.cash_type_for='service' and ec.isActive=1 and ec.employeeId=`+emp+` and  ec.ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and isDelete=0 and businessId=`+input.businessId+` and paid_status='paid')`;
        
        var taxsql = `select SUM(tax_calculated) as tax_amount from  ticketservice_taxes where serviceref_id in (select sync_id from  ticket_services where ticketref_id in (select sync_id from ticket where sync_id in (select ticketref_id from ticket_payment where   DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and
        isDelete=0 and businessId=`+input.businessId+` and paid_status='paid') and employee_id=`+emp+`)` 
        console.log("############")
        console.log(taxsql);
        var discountquery = ` SELECT   SUM(CASE WHEN  cash_type_for = 'owner-discount' THEN cash_amt ELSE 0 END) as OwnerDiscount,
        SUM(CASE WHEN  cash_type_for = 'emp-discount' THEN cash_amt ELSE 0 END) as EmpDiscount,
        SUM(CASE WHEN  cash_type_for = 'owneremp-discount' THEN cash_amt ELSE 0 END) as OwnerEmpDiscount FROM   employee_commission_detail as ec join users as u on u.id = ec.employeeId
                   WHERE ec.businessId=`+input.businessId+` and ec.cash_type_for != 'ownercommission' and  ec.isActive=1 and  ec.employeeId=`+emp+` and
                   ec.ticketref_id in (select sync_id from ticket where  sync_id in (select ticketref_id from ticket_payment where  DATE(paid_at) between '`+input.from_date+`' and '`+input.to_date+`') and
                   isDelete=0 and businessId=`+input.businessId+`  and paid_status='paid')`
             
                this.dataManager.getData(discountquery).then(disdata=>{
                    discountdata = disdata.length> 0? disdata[0] : {OwnerDiscount:0, EmpDiscount:0, OwnerEmpDiscount:0}  
                    this.dataManager.getData(nettsql).then(nett=>{
                        this.dataManager.getData(supplysql).then(da=>{
                            this.dataManager.getData(taxsql).then(taxdata=>{
                                console.log(taxdata, taxsql);
                                var supplyamt = da.length > 0 ? da[0].PaidAmount : 0;
                                var nettamt = nett.length > 0 ? nett[0].nett : 0;
                                var taxamt = taxdata.length > 0 ? taxdata[0].tax_amount : 0;

                                if(empreport.length === 0){
                                    var empdetail = this.state.employeelist.filter(r=>r.id === emp);
                                    finalreport.push({
                                        employee_id: emp,
                                        firstName: empdetail[0].firstName,
                                        lastName: empdetail[0].lastName,
                                        tickets:[],
                                        discountdata: discountdata,
                                        supplies_amt : supplyamt,
                                        nett:nettamt,
                                        taxamount:taxamt
                                    })
                                } 
                                else{
                                    empreport[0].discountdata = discountdata;
                                    empreport[0].supplies_amt = supplyamt;
                                    empreport[0].nett = nettamt;
                                    empreport[0].taxamount = taxamt;
                                    finalreport.push(empreport[0]);
                                }
                                if(j === this.state.selectedemps.length-1 ){ 
                                    console.log("$$$$$$$$$")
                                    console.log(finalreport)
                                    this.setState({isLoading: false,  empReport:finalreport, showDatePopup: false})
                                }
                            });
                        })
                    });   
                });
            })
        }
      }
  }

    getCalculatedData(index, data, results, existids, valtocheck, obj){ 
        console.log(valtocheck);
        if(existids.indexOf(valtocheck) > -1){
            var idx = existids.indexOf(valtocheck);
            var c_obj = Object.assign({},results[idx]); 
            console.log("DISCOUNT")
            console.log(c_obj.Discount, obj.Discount)
            var Tips = Number(c_obj.Tips)//+Number(obj.Tips) ;
            var Discount = Number(c_obj.Discount)//+Number(obj.Discount); 
            var ticketslist = c_obj.ticketslist;
            var ticketcodes = ticketslist.map(t=>t.ticket_code);
            var ticketcount = Number(c_obj.ticketcount);
            var ticketservicecount = c_obj.ticketservicecount+obj.ticket_servicescount;

            var Amount = Number(c_obj.Amount);
            Tips = Number(c_obj.Tips)+Number(obj.Tips) ;
            Discount = Number(c_obj.Discount)+Number(obj.Discount); 
            Amount = Number(c_obj.Amount)+Number(obj.Amount);
            if(ticketcodes.indexOf(obj.ticket_code) === -1){
                ticketcount += 1;  
                ticketslist.push(obj);
            }
            var resultobj = {
                Amount: Amount,
                Discount: Discount,
                Tips: Tips,
                date: valtocheck, 
                employee_id: c_obj.employee_id,
                firstName:c_obj.firstName,
                role:c_obj.role,
                lastName: c_obj.lastName,
                ticket_date: valtocheck.split("----")[0],
                ticketcount: ticketcount,
                ticketslist:ticketslist,
                ticketservicecount:ticketservicecount
            };
            results[idx] = resultobj;
            // console.log("if contidio",idx, resultobj) 
            this.dataformat(index+1, data, results, existids);
        }
        else{
            var c_obj1 = {
                employee_id: obj.employee_id,
                firstName:obj.firstName,
                role:obj.role,
                lastName: obj.lastName,
                ticket_date: valtocheck.split("----")[0]
            };
            c_obj1.Amount = Number(obj.Amount);
            console.log( obj)
            c_obj1.Tips = Number(obj.Tips);
            c_obj1.Discount = Number(obj.Discount);
            c_obj1.date = valtocheck;
            c_obj1.ticketcount = 1; 
            c_obj1.ticketslist = [];
            c_obj1.ticketslist.push(obj);
            c_obj1.ticketservicecount = obj.ticket_servicescount;
            // console.log(Number(c_obj1.Amount), Number(obj.Amount)); 
            results.push(c_obj1);
            existids.push(valtocheck); 
            this.dataformat(index+1, data, results, existids);
        }
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
 
    handleCloseDialog(){
        this.setState({openDialog:false, msg: '',isLoading: false}, function(){
            this.clearPasscode()
        })
    }

    authorize(){ 
        this.setState({isLoading: true})

        this.dataManager.getData(`select * from users where passcode = '`+this.state.passcode+`'`).then(res => {
            if(res.length > 0 ){  
                var msg = "Authorized successfully";
                if(res[0].staff_role == 'Owner'){
                    this.dataManager.getData("select id from users where status='active'").then(empres=>{
                        var emps = empres.map(r=>r.id);
                        this.setState({isLoading: false,isAuthorized : true, restrictionmode: res[0].staff_role, reportEmps: emps}, function(){
                            if(res[0].staff_role !== 'Owner'){
                                this.setState({tabName:'Employee'})
                            }
                            this.getEmpDetails();
                            this.getUnsyncedData()
                        })
                    })
                }
                else{
                    var emps = [];
                    emps.push(res[0].id);
                    this.setState({isLoading: false,isAuthorized : true, restrictionmode: res[0].staff_role, reportEmps: emps}, function(){
                        if(res[0].staff_role !== 'Owner'){
                            this.setState({tabName:'Employee'})
                        }
                        this.getEmpDetails();
                        this.getUnsyncedData()
                    })
                } 
            }
            else{
                this.setState({openDialog:true, msg: msg,isLoading: false, isAuthorized: false, passcode:'', wrongPasscode: true}, function() { })
            }
        });
        // axios.post(config.root+"report/checkpasscode/", {passcode:this.state.passcode, businessId:this.state.businessdetail.id}).then(res=>{
        //     var status = res.data["status"];
        //     var msg = res.data["msg"];
        
        //     if(status === 200){ 
        //         this.setState({isLoading: false,isAuthorized : true, restrictionmode: res.data.role, reportEmps:res.data.emps}, function(){
        //             if(res.data.role !== 'Owner'){
        //                 this.setState({tabName:'Employee'})
        //             }
        //             this.getEmpDetails();
        //             this.getUnsyncedData()
        //         })

        //     }else{
        //         this.setState({openDialog:true, msg: msg,isLoading: false, isAuthorized: false, passcode:'', wrongPasscode: true}, function() {
                    
        //         })
        //     }
        // })
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

    getEmpDetails(){
        this.setState({isLoading: true})
        var businessdetail = window.localStorage.getItem('businessdetail');
        if(businessdetail !== undefined && businessdetail !== null){
            
            let url = config.root+"employee/"+JSON.parse(businessdetail).id
            //console.log("1.getEmpDetails",url)
            this.dataManager.getData("select * from users").then(res=>{
                var data = res.filter(r=>this.state.reportEmps.indexOf(r.id) !== -1);
                var empids = data.map(r=>r.id);
                this.setState({isLoading: false,employeelist:data,selectedemps: empids}, function(){
                    this.getReport();
                })
            })
            // axios.get(url).then((res)=>{
            //     //console.log("2.getEmpDetails") 
            //         if(res.data.data.length>0) {
            //             // this.getEmp(res.data.data[0])
            //             var data = res.data.data.filter(r=>this.state.reportEmps.indexOf(r.id) !== -1);
            //             var empids = data.map(r=>r.id);
            //             this.setState({isLoading: false,employeelist:data,selectedemps: empids}, function(){
            //                 this.getReport();
            //             })
            //         } 
            // });
        }
    }

 
    handleChangeCode(code){
        // this.setState({passcode:code});
        if(code === "remove") {
            this.setState({passcode: code, disabled: true});
        }
        else if(code.length === this.state.codeLength) {
            const stringData = code.reduce((result, item) => {
                return `${result}${item}`
            }, "") 
            this.setState({passcode: stringData, disabled: false}); 
        }
    } 
    clearData() {

        window.localStorage.removeItem("employeedetail")
        window.localStorage.removeItem("businessdetail")
        window.localStorage.removeItem("synced")
        setTimeout(()=>{
            window.location.reload();
        })

    } 
    getEmpName(empid){
        let emp = this.state.employeelist.filter(emp=>{return emp.id === empid })
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

    showDetails(ticket){ 
        var ticketslist = [];
        ticket.ticketslist.forEach((elmt, i)=>{
            console.log("ticketcode", elmt.ticket_code);

            var sql = `select u.firstName, u.lastName,t.total_tax, t.grand_total, t.discount_totalamt,tp.pay_mode, ts.service_cost as service_amount,ts.*, s.name as service_name,(select id from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1  )
            as notesid,  (select notes from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1 ) as requestNotes,s.*,ts.sync_id as uniquId,ts.syncedid as syncedid,  d.name as discount_name from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.sync_id inner join ticket as t on t.sync_id=ts.ticketref_id join ticket_payment as tp on tp.ticketref_id=t.sync_id  left join discounts as d on d.id = ts.discount_id left join employee_commission_detail as ec on ec.ticketserviceref_id=ts.sync_id and ec.cash_type_for='service' and ec.isActive=1 join users as u on u.id = ts.employee_id where ts.ticketref_id =  '`+elmt.ticketref_id+`'  and ts.isActive=1 ORDER BY sort_number`  
             

    if(this.state.tabName === 'Employee'){
        sql = `select u.firstName, u.lastName,t.total_tax, t.grand_total,t.discount_totalamt,tp.pay_mode, ts.service_cost as service_amount,ts.*, s.name as service_name,(select id from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1  )
        as notesid,  (select notes from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1 ) as requestNotes,s.*,ts.sync_id as uniquId,ts.syncedid as syncedid,  d.name as discount_name from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.sync_id inner join ticket as t on t.sync_id=ts.ticketref_id join ticket_payment as tp on tp.ticketref_id=t.sync_id  left join discounts as d on d.id = ts.discount_id left join employee_commission_detail as ec on ec.ticketserviceref_id=ts.sync_id and ec.cash_type_for='service' and ec.isActive=1 join users as u on u.id = ts.employee_id where ts.ticketref_id =  '`+elmt.ticketref_id+`' and ts.employee_id in (`+this.state.selectedemps+`)  and ts.isActive=1 ORDER BY sort_number`;
    }

            // console.log("sql::",sql)
            this.dataManager.getData(sql).then(res=>{
                var obj = elmt;
                if(res.length > 0){
                    obj["ticketdiscount"] = res[0].discount_totalamt;
                }
                elmt.services = res;
                ticketslist.push(obj);
                if(i === ticket.ticketslist.length-1){ 
                    ticket.ticketslist = ticketslist;
                    this.setState({selectedData: ticket}, ()=>{
                        this.setState({ticketInfo:true});
                        console.log("#######################")
                        console.log(ticket.ticketslist);
                        console.log("#######################")
                    })
                }
            })
        })
    }

    renderOwnerReport(){
        var reportdetail = [];
        reportdetail.push(<div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <Typography variant="h4">{this.state.businessdetail.name}</Typography>
                <Typography variant="h5" style={{textTransform:'capitalize'}}>Owner {this.state.reporttype} Report</Typography>
                <Typography variant="subtitle2" style={{textTransform:'capitalize', fontWeight:'400'}}>{Moment(this.state.from_date).format("MM/DD/YYYY")+" - "+Moment(this.state.to_date).format("MM/DD/YYYY")}</Typography>
            </div>);

        reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
                <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>Owner : <b>{this.state.ownerdetail.firstName+" "+this.state.ownerdetail.lastName}</b></Typography>
        </div>) 
        
        if(this.state.empReport[0].tickets.length > 0){
            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', fontSize:'12px', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000'}}> 
                <Grid container>
                    <Grid item xs={2}><b>{this.state.reporttype === 'annually' ? 'Year' : (this.state.reporttype === 'monthly') ? 'Month' : 'Date'}</b></Grid>
                    <Grid item xs={2} style={{alignItems:'center', display:'flex', justifyContent:'center'}}><b>Tickets</b></Grid>
                    <Grid item xs={2}><b>Service</b></Grid>
                    <Grid item xs={2}><b>Amount</b></Grid>
                    <Grid item xs={1}><b>Tip</b></Grid>
                    <Grid item xs={1}><b>Discount</b></Grid>
                    <Grid item xs={2}><b>Total</b></Grid>
                </Grid>
            </div>)
            var discounttotal = 0
            var totalAmount = 0
            var totalTips = 0
            this.state.empReport[0].tickets.forEach(t=>{
                discounttotal = discounttotal+ Number(t.Discount);
                totalAmount = totalAmount+ Number(t.Amount);
                totalTips = totalTips+ Number(t.Tips);
                reportdetail.push(<div style={{display:'flex',width:'100%', fontSize:'12px', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000', padding:'2px 0'}}> 
                    <Grid container>
                        <Grid item xs={2}>{t.ticket_date}</Grid>
                        <Grid item xs={2} style={{alignItems:'center', display:'flex',flexDirection:'column', justifyContent:'center', textDecoration:'underline', cursor:'pointer'}} onClick={()=>{
                            this.showDetails(t)
                        }}>{t.ticketcount} </Grid>
                        <Grid item xs={2}>{t.ticketservicecount}</Grid>
                        <Grid item xs={2}>{Number(t.Amount) > 0 ? "$"+Number(t.Amount).toFixed(2) : '-' }</Grid>
                        <Grid item xs={1}>{Number(t.Tips) > 0 ? "$"+Number(t.Tips).toFixed(2) : '-' }</Grid>
                        <Grid item xs={1}>{Number(t.Discount) > 0 ? "$"+Number(t.Discount).toFixed(2) : '-' }</Grid>
                        <Grid item xs={2}>{(Number(t.Amount)+Number(t.Tips)-Number(t.Discount)) > 0 ? "$"+(Number(t.Amount)+Number(t.Tips)-Number(t.Discount)).toFixed(2) : '-' }</Grid>
                    </Grid>
                </div>)
            })

            var discountdata= this.state.discountdata[0]; 

            var tdiscounttotal = discountdata !==undefined ?  discountdata.OwnerDiscount+discountdata.EmpDiscount+discountdata.OwnerEmpDiscount : 0;
            reportdetail.push(<div style={{display:'flex',width:'100%',fontSize:'12px', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
                <Grid container>
                    <Grid item xs={2}><b>Total</b></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}><b>{"$"+Number(totalAmount).toFixed(2)}</b></Grid>
                    <Grid item xs={1}><b>{"$"+Number(totalTips).toFixed(2)}</b></Grid>
                    <Grid item xs={1}><b>{"$"+Number(discounttotal).toFixed(2)}</b></Grid>
                    <Grid item xs={2}><b>{"$"+(Number(totalAmount) + Number(totalTips) - Number(discounttotal)).toFixed(2)}</b></Grid>
                </Grid>
            </div>)

            reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'column', marginTop:'2rem'}}>

                    <Typography variant="h6" style={{textTransform:'capitalize', fontWeight:'700'}}>Discounts</Typography>

                    {/* <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>#</Grid>
                        <Grid item xs={4}>{Number(discounttotal).toFixed(2)}</Grid>
                    </Grid> */}

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Owner</Grid>
                        <Grid item xs={4}>{Number(this.state.empReport[0].discountdata.OwnerDiscount).toFixed(2)}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Employee</Grid>
                        <Grid item xs={4}>{Number(this.state.empReport[0].discountdata.EmpDiscount).toFixed(2)}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Grid item xs={8}>Owner & Employee</Grid>
                        <Grid item xs={4}>{Number(this.state.empReport[0].discountdata.OwnerEmpDiscount).toFixed(2)}</Grid>
                    </Grid>
                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',}}>
                        <Grid item xs={8}>Total</Grid>
                        <Grid item xs={4}>${Number(tdiscounttotal).toFixed(2)}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Tax Amount</Grid>
                        <Grid item xs={4}>${Number(this.state.tax_Amount).toFixed(2)}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Supplies</Grid>
                        <Grid item xs={4}>${this.state.supplydetail.length > 0 ? Number(this.state.supplydetail[0].PaidAmount).toFixed(2) : '0.00'}</Grid>
                    </Grid>

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Payment Methods</Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>

                    {this.state.cashdata.map(csh=>{
                    return <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                        <Grid item xs={8}>{csh.pay_mode}</Grid>
                        <Grid item xs={4}>${Number(csh.PaidAmount).toFixed(2)}</Grid>
                    </Grid> })}

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                        <Grid item xs={8}>Amount Collected</Grid>
                        <Grid item xs={4}>${Number(this.state.ownertotal).toFixed(2)}</Grid>
                    </Grid> 

                    <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Profit</Grid>
                        <Grid item xs={4}>${ Number(Number(this.state.profitdetail.profit) - Number(discounttotal)).toFixed(2)}</Grid>
                    </Grid>
                </div>)
        }
        else{ 
            reportdetail.push(<div style={{display:'flex',marginTop:'1rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
                <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>No tickets made during this time period by {this.state.empReport[0].firstName+" "+this.state.empReport[0].lastName}</Typography>
            </div>) 
        }

        reportdetail.push(<div style={{display:'flex',marginTop:'1.5rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
            <Typography variant="body" style={{ paddingBottom:'1rem',fontWeight:'400'}}>{this.state.businessdetail.name} - Reported: {Moment().format("MM/DD/YYYY hh:mm a")}</Typography>
        </div>) 

        return  <div style={{borderBottom:'1px dotted #000', paddingBottom:'1rem', width:'100%'}}>
            {reportdetail}
            </div>;
    }

    renderEmployeeReport(){
         
            var reportdetail = [];
            this.state.empReport.forEach(emp=>{ 
                reportdetail.push(<div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                    <Typography variant="h4">{this.state.businessdetail.name}</Typography>
                    <Typography variant="h5" style={{textTransform:'capitalize'}}>Employee {this.state.reporttype} Report</Typography>
                    <Typography variant="subtitle2" style={{textTransform:'capitalize', fontWeight:'400'}}>{Moment(this.state.from_date).format("MM/DD/YYYY")+" - "+Moment(this.state.to_date).format("MM/DD/YYYY")}</Typography>
                </div>);

                reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row'}}> 
                        <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>Employee : <b>{emp.firstName+" "+emp.lastName}</b></Typography>
                </div>) 
                if(emp.tickets.length > 0){
                    reportdetail.push(<div style={{display:'flex',width:'100%',fontSize:'12px', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000'}}> 
                        <Grid container>
                            <Grid item xs={2}><b>{this.state.reporttype === 'annually' ? 'Year' : (this.state.reporttype === 'monthly') ? 'Month' : 'Date'}</b></Grid>
                            <Grid item xs={2}><b>Tickets</b></Grid>
                            <Grid item xs={2}><b>Service</b></Grid>
                            <Grid item xs={2}><b>Amount</b></Grid>
                            <Grid item xs={2}><b>Tip</b></Grid>
                            <Grid item xs={2}><b>Total</b></Grid>
                        </Grid>
                    </div>)
                    var discounttotal = 0
                    var totalAmount = 0;
                    var totalTips = 0;
                    emp.tickets.map(t=>{
                        return  reportdetail.push(<div style={{display:'flex',width:'100%',fontSize:'12px', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000', padding:'2px 0'}}> 
                            <Grid container style={{padding:'0.5rem 0'}}>
                                <Grid item xs={2}>{t.ticket_date}</Grid>
                                <Grid item xs={2} style={{alignItems:'center', display:'flex', textDecoration:'underline', cursor:'pointer'}} onClick={()=>{
                                    this.showDetails(t)
                                }}>{t.ticketcount}</Grid>
                                <Grid item xs={2}>{t.ticketservicecount }</Grid>
                                <Grid item xs={2}>{Number(t.Amount) > 0 ? "$"+Number(t.Amount).toFixed(2) : '-' }</Grid>
                                <Grid item xs={2}>{Number(t.Tips) > 0 ? "$"+Number(t.Tips).toFixed(2) : '-' }</Grid>
                                <Grid item xs={2}>{Number(t.Amount)+Number(t.Tips) > 0 ? "$"+(Number(t.Tips)+Number(t.Amount)).toFixed(2) : '-' }</Grid>
                            </Grid>
                        </div>)
                    }) 
                    var cashdata = [];
                    var total = 0;
                    emp.tickets.forEach(t=>{ 
                        var isCash = t.ticketslist.filter(p=>p.pay_mode === 'cash');
                        var isCredit = t.ticketslist.filter(p=>p.pay_mode === 'card' && p.card_type ==='credit');
                        var isDebit = t.ticketslist.filter(p=>p.pay_mode === 'card' && p.card_type ==='debit');
                        if(isCash.length === 0){
                            var isCashdata = cashdata.filter(t=>t.pay_mode === 'Cash');
                            if(isCashdata.length === 0 ){
                                cashdata.push({
                                    PaidAmount:0,
                                    pay_mode:'Cash',
                                    card_type:''
                                })
                            }
                        }
                        else{
                            var damount = 0;
                            var pamount = 0; 
                            isCash.forEach((e,ti)=>{
                                damount += Number(e.Discount)+Number(e.TicketDiscount);
                                pamount += Number(e.Amount)+ Number(e.Tips); 
                                if(ti === isCash.length-1){ 
                                    total+=Number(pamount);
                                    
                                    var isCashdata = cashdata.filter(t=>t.pay_mode === 'Cash');
                                    if(isCashdata.length === 0 ){
                                        cashdata.push({ 
                                            PaidAmount:pamount-damount,
                                            pay_mode:'Cash',
                                        })
                                    }
                                    else{
                                        var finaldata = [];
                                        cashdata.forEach((element, cidx) => {
                                            if(element.pay_mode === 'Cash'){
                                                element["PaidAmount"] = Number(element["PaidAmount"]) + pamount-damount
                                            }
                                            finaldata.push(element);
                                            if(cidx === cashdata.length -1){
                                                cashdata = finaldata;
                                            }
                                        });
                                    }
                                }
                            }) 
                        }
                
                        if(isCredit.length === 0){ 
                            var isCreditdata = cashdata.filter(t=>t.pay_mode === 'Credit Card');
                            if(isCreditdata.length === 0 ){
                                cashdata.push({
                                    PaidAmount:0,
                                    pay_mode:'Credit Card',
                                    card_type:''
                                })
                            }
                        }
                        else{ 
                            var dccamount = 0
                            var pccamount = 0
                            isCredit.forEach((e,ti)=>{
                                pccamount += Number(e.Amount)+ Number(e.Tips); 
                                dccamount += Number(e.Discount)+Number(e.TicketDiscount); 
                                if(ti === isCredit.length-1){ 
                                    total+=Number(pccamount);

                                    var isCashdata = cashdata.filter(t=>t.pay_mode === 'Credit Card');
                                    if(isCashdata.length === 0 ){
                                            
                                        cashdata.push({ 
                                            PaidAmount:pccamount-dccamount,
                                            pay_mode:'Credit Card',
                                        })
                                    }
                                    else{
                                        var finaldata = [];
                                        cashdata.forEach((element, cidx) => {
                                            if(element.pay_mode === 'Credit Card'){
                                                element["PaidAmount"] = Number(element["PaidAmount"]) + pccamount-dccamount
                                            }
                                            finaldata.push(element);
                                            if(cidx === cashdata.length -1){
                                                cashdata = finaldata;
                                            }
                                        });
                                    }
                                }
                            }) 
                        }
                
                        if(isDebit.length === 0){ 

                            var isDebitdata = cashdata.filter(t=>t.pay_mode === 'Debit Card');
                            if(isDebitdata.length === 0 ){
                                cashdata.push({
                                    PaidAmount:0,
                                    pay_mode:'Debit Card',
                                    card_type:''
                                })
                            } 
                        }
                        else{ 
                            var ddamount = 0;
                            var pdamount = 0
                            isDebit.forEach((e,ti)=>{
                                pdamount += Number(e.Amount)+ Number(e.Tips); 
                                ddamount += Number(e.Discount)+Number(e.TicketDiscount);
                                if(ti === isDebit.length-1){ 
                                    total+=Number(pdamount);
                                    var isCashdata = cashdata.filter(t=>t.pay_mode === 'Cash');
                                    if(isCashdata.length === 0 ){
                                        cashdata.push({ 
                                            PaidAmount:pdamount-ddamount,
                                            pay_mode:'Debit Card',
                                        })
                                    }
                                    else{
                                        var finaldata = [];
                                        cashdata.forEach((element, cidx) => {
                                            if(element.pay_mode === 'Cash'){
                                                element["PaidAmount"] = Number(element["PaidAmount"]) + pdamount-ddamount
                                            }
                                            finaldata.push(element);
                                            if(cidx === cashdata.length -1){
                                                cashdata = finaldata;
                                            }
                                        });
                                    }
                                    
                                }
                            }) 
                        }
 
                        totalAmount = total;
                        totalTips = totalTips+ Number(t.Tips); 
                    })

                    

                    discounttotal += emp.discountdata.OwnerDiscount+emp.discountdata.EmpDiscount+emp.discountdata.OwnerEmpDiscount;
                    
                    reportdetail.push(
                        <div style={{display:'flex',width:'100%',fontSize:'12px', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000',fontWeight:'700', padding:'2px 0'}}> 
                            <Grid container>
                                <Grid item xs={2}>Total</Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}>{Number(totalAmount) > 0 ? "$"+Number(Number(totalAmount)-Number(totalTips)).toFixed(2) : '-' }</Grid>
                                <Grid item xs={2}>{Number(totalTips) > 0 ? "$"+Number(totalTips).toFixed(2) : '-' }</Grid>
                                <Grid item xs={2}>{ Number(totalAmount) > 0 ? "$"+( Number(totalAmount)).toFixed(2) : '-' }</Grid>
                            </Grid>
                        </div>)
                        totalAmount += emp.taxamount 
                    reportdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'column', marginTop:'2rem'}}>

                            <Typography variant="h6" style={{textTransform:'capitalize', fontWeight:'700'}}>Discounts</Typography>

                            <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                                <Grid item xs={8}>#</Grid>
                                <Grid item xs={4}>{Number(discounttotal).toFixed(2)}</Grid>
                            </Grid>
                            <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                                <Grid item xs={8}>Owner</Grid>
                                <Grid item xs={4}>{Number(emp.discountdata.OwnerDiscount).toFixed(2)}</Grid>
                            </Grid>

                            <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                                <Grid item xs={8}>Employee</Grid>
                                <Grid item xs={4}>{Number(emp.discountdata.EmpDiscount).toFixed(2)}</Grid>
                            </Grid>

                            <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                                <Grid item xs={8}>Owner & Employee</Grid>
                                <Grid item xs={4}>{Number(emp.discountdata.OwnerEmpDiscount).toFixed(2)}</Grid>
                            </Grid>
                            <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',}}>
                                <Grid item xs={8}>Total</Grid>
                                <Grid item xs={4}>${Number(discounttotal).toFixed(2)}</Grid>
                            </Grid> 


                            {/* <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                        <Grid item xs={8}>Supplies</Grid>
                        <Grid item xs={4}>${emp.supplies_amt !== null ? Number(emp.supplies_amt).toFixed(2) : '0.00'}</Grid>
                        
                    </Grid> */}
                        <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                            <Grid item xs={8}>Tax Amount</Grid>
                            <Grid item xs={4}>${emp.taxamount !== null ? Number(emp.taxamount).toFixed(2) : '0.00'}</Grid>
                        </Grid> 

                        <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', width:'100%',}}>
                            <Grid item xs={8}>Payment Methods</Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>

                        
                        {cashdata.map(csh=>{
                        return <Grid container style={{textTransform:'capitalize', fontWeight:'400', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                            <Grid item xs={8}>{csh.pay_mode}</Grid>
                            <Grid item xs={4}>${Number(csh.PaidAmount).toFixed(2)}</Grid>
                        </Grid> })}


                        <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                            <Grid item xs={8}>Amount Collected</Grid>
                            <Grid item xs={4}>${Number(totalAmount-discounttotal).toFixed(2)}</Grid>
                        </Grid> 



                        <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                            <Grid item xs={8}>Net</Grid>
                            <Grid item xs={4}>${emp.nett !== null ? Number(Number(emp.nett) - Number(discounttotal)).toFixed(2) : '0.00'}</Grid>
                        </Grid> 
                        <Grid container style={{textTransform:'capitalize', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'space-between',  width:'100%',}}>
                            <Grid item xs={8}>Net Total</Grid>
                            <Grid item xs={4}>${emp.nett !== null ? Number(Number(emp.nett) - Number(discounttotal) + Number(totalTips)).toFixed(2) : '0.00'}</Grid>
                        </Grid> 
                        </div>)
                }
                else{ 
                    reportdetail.push(<div style={{display:'flex',marginTop:'1rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}> 
                        <Typography variant="body" style={{textTransform:'capitalize', fontWeight:'400'}}>No tickets made during this time period by {emp.firstName+" "+emp.lastName}</Typography>
                    </div>) 
                }

                reportdetail.push(<div style={{display:'flex',marginTop:'1.5rem',width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row',borderBottom:'1px dotted #000', marginBottom:'1rem'}}> 
                    <Typography variant="body" style={{ paddingBottom:'1rem',fontWeight:'400'}}>{this.state.businessdetail.name} - Reported: {Moment().format("MM/DD/YYYY hh:mm a")}</Typography>
                </div>) 
            })

      
            return  <div style={{ width:'100%'}}>
            {reportdetail}
            </div>;    

    }
 
    printData(){ 
        var businessdetail = window.localStorage.getItem('businessdetail');
        var printername = window.localStorage.getItem('defaultprinter');
        if(businessdetail !== undefined && businessdetail !== null && this.state.tabName === 'Owner' && printername !== undefined && printername !== ''){ 
                var columns = ["Year", "Amount", "Tips", "Discount"];
                if(this.state.reporttype === 'monthly'){
                    columns = ["Month", "Amount", "Tips", "Discount"]
                }
                if(this.state.reporttype === 'daily'){
                    columns = ["Date", "Amount", "Tips", "Discount"]
                }
                let from_date = Moment(this.state.from_date).format('MM-DD-YYYY');
                let to_date = Moment(this.state.to_date).format('MM-DD-YYYY');
                
            var discountdata= this.state.discountdata[0]; 

            var tdiscounttotal = discountdata !==undefined ?  discountdata.OwnerDiscount+discountdata.EmpDiscount+discountdata.OwnerEmpDiscount : 0;

                var data = [];
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.name,
                    style: `text-align:center;`,
                    css: { "font-weight": "700", "font-size": "24px" },
                    }); 
                data.push({
                    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
                    value:  this.state.reporttype === 'annually' ? "Owner Annual Report" : (this.state.reporttype === 'monthly' ? 'Owner Monthly Report' : 'Owner Daily Report'),
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
                    value: "Owner: <b>"+this.state.empReport[0].firstName+" "+this.state.empReport[0].lastName,
                    style: `text-align:left;`,
                    css: {  "font-size": "14px","margin-top": 10, "margin-left": 0 },
                    });

                    var discounttotal = 0
                    var totalAmount = 0
                    var totalTips = 0
                    this.state.empReport[0].tickets.forEach(t=>{
                        discounttotal = discounttotal+ Number(t.Discount);
                        totalAmount = totalAmount+ Number(t.Amount);
                        totalTips = totalTips+ Number(t.Tips);
                    });
                if(this.state.empReport[0].tickets.length > 0){
                    data.push({
                        type: 'table',
                        // style the table
                        style: 'border: 0px solid #ddd',
                        css: {  "font-size": "14px","margin-top": 10 },
                        tableBody: this.state.empReport[0].tickets.map(e=>{ 
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
                        value: "Discounts",
                        style: `text-align:left;`,
                        css: {  "font-size": "18px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                        });

                    data.push({
                        type: "text", 
                        value: "<div style='width:70%;float:left;'>Owner</div><div style='width:30%;float:left;'>$"+(this.state.empReport[0].discountdata.OwnerDiscount !== undefined ? Number(this.state.empReport[0].discountdata.OwnerDiscount).toFixed(2) : "0.00")+"</div>",
                        style: `text-align:left;`,
                        css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                        });

                    data.push({
                        type: "text", 
                        value: "<div style='width:70%;float:left;'>Employee</div><div style='width:30%;float:left;'>$"+(this.state.empReport[0].discountdata.EmpDiscount !== undefined ? Number(this.state.empReport[0].discountdata.EmpDiscount).toFixed(2) : "0.00")+"</div>",
                        style: `text-align:left;`,
                        css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                        });

                    data.push({
                        type: "text", 
                        value: "<div style='width:70%;float:left;'>Owner & Employee</div><div style='width:30%;float:left;'>$"+(this.state.empReport[0].discountdata.OwnerEmpDiscount !== undefined ? Number(this.state.empReport[0].discountdata.OwnerEmpDiscount).toFixed(2) : "0.00")+"</div>",
                        style: `text-align:left;`,
                        css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                        });

                    data.push({
                        type: "text", 
                        value: "<div style='width:70%;float:left;'>Total</div><div style='width:30%;float:left;'>$"+Number(tdiscounttotal).toFixed(2)+"</div>",
                        style: `text-align:left;font-weight:bold;`,
                        css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                        });

                    data.push({
                        type: "text", 
                        value: "<div style='width:70%;float:left;'>Supplies</div><div style='width:30%;float:left;'>$"+(this.state.supplydetail.length > 0 ? Number(this.state.supplydetail[0].PaidAmount).toFixed(2) : '0.00')+"</div>",
                        style: `text-align:left;font-weight:bold;`,
                        css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                        });
                    data.push({
                        type: "text", 
                        value: "Payment Collections",
                        style: `text-align:left;font-weight:bold;`,
                        css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                        });
                    // data.push({
                    //     type: "text", 
                    //     value: "<div style='width:70%;float:left;'>Cash</div><div style='width:30%;float:left;'>"+this.state.empReport[0].tickets[0].Discount+"</div>",
                    //     style: `text-align:left;font-weight:bold;`,
                    //     css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                    //     });
                    // data.push({
                    //     type: "text", 
                    //     value: "<div style='width:70%;float:left;'>Card</div><div style='width:30%;float:left;'>"+this.state.empReport[0].tickets[0].Discount+"</div>",
                    //     style: `text-align:left;font-weight:bold;`,
                    //     css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                    //     });

                    {this.state.cashdata.map(csh=>{
                        data.push({
                            type: "text", 
                            value: "<div style='textTransform:capitalize;width:70%;float:left;'>"+csh.pay_mode+"</div><div style='width:30%;float:left;'>"+csh.PaidAmount+"</div>",
                            style: `text-align:left;font-weight:bold;`,
                            css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                            }) 
                    })}

                    data.push({
                        type: "text", 
                        value: "<div style='width:70%;float:left;'>Amount Collected</div><div style='width:30%;float:left;'>$"+Number(this.state.ownertotal).toFixed(2)+"</div>",
                        style: `text-align:left;font-weight:bold;`,
                        css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
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
                    
                })

        }
        else  if(businessdetail !== undefined && businessdetail !== null && this.state.tabName === 'Employee' && printername !== undefined && printername !== ''){ 
                var ccolumns = ["Year", "Tickets", "Amount", "Tips"];
                if(this.state.reporttype === 'monthly'){
                    ccolumns = ["Month","Tickets", "Amount", "Tips"]
                }
                if(this.state.reporttype === 'daily'){
                    ccolumns = ["Date","Tickets", "Amount", "Tips"]
                }
                let from_date = Moment(this.state.from_date).format('MM-DD-YYYY');
                let to_date = Moment(this.state.to_date).format('MM-DD-YYYY');
                var tbldata = [];


                this.state.empReport.forEach(emp=>{

                    var discounttotal = 0;
                    var amounttotal = 0;
                    var tipstotal = 0;

                    emp.tickets.forEach(t=>{
                        discounttotal = Number(discounttotal)+Number(t.Discount);
                        amounttotal = Number(amounttotal)+Number(t.Amount);
                        tipstotal = Number(tipstotal)+Number(t.Tips);
                    })
                    
                    tbldata.push({
                        type: "text", 
                        value: this.state.businessdetail.name,
                        style: `text-align:center;`,
                        css: { "font-weight": "700", "font-size": "24px" },
                        }); 
                    tbldata.push({
                        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
                        value:  this.state.reporttype === 'annually' ? "Employee Annual Report" : (this.state.reporttype === 'monthly' ? 'Employee Monthly Report' : 'Employee Daily Report'),
                        style: `text-align:center;`,
                        css: { "font-weight": "700", "font-size": "14px" },
                        });

                    tbldata.push({
                        type: "text", 
                        value: from_date+" to "+to_date, // Moment(new Date()).format('DD-MM-YYYY hh:mm A'),
                        style: `text-align:center;`,
                        css: {  "font-size": "14px","margin-top": 5 },
                        });

                    tbldata.push({
                        type: "text", 
                        value: "Employee:  <b>"+emp.firstName+" "+emp.lastName,
                        style: `text-align:left;`,
                        css: {  "font-size": "14px","margin-top": 10, "margin-left": 0 },
                        });
                        
                    var cashdata = [];
                    var total = 0;
                    emp.tickets.forEach(t=>{ 
                        var isCash = t.ticketslist.filter(p=>p.pay_mode === 'cash');
                        var isCredit = t.ticketslist.filter(p=>p.pay_mode === 'card' && p.card_type ==='credit');
                        var isDebit = t.ticketslist.filter(p=>p.pay_mode === 'card' && p.card_type ==='debit');
                        if(isCash.length === 0){
                            var isCashdata = cashdata.filter(t=>t.pay_mode === 'Cash');
                            if(isCashdata.length === 0 ){
                                cashdata.push({
                                    PaidAmount:0,
                                    pay_mode:'Cash',
                                    card_type:''
                                })
                            }
                        }
                        else{
                            var damount = 0;
                            var pamount = 0; 
                            isCash.forEach((e,ti)=>{
                                damount += Number(e.Discount)+Number(e.TicketDiscount);
                                pamount += Number(e.Amount)+ Number(e.Tips); 
                                if(ti === isCash.length-1){ 
                                    total+=Number(pamount);
                                    
                                    var isCashdata = cashdata.filter(t=>t.pay_mode === 'Cash');
                                    if(isCashdata.length === 0 ){
                                        cashdata.push({ 
                                            PaidAmount:pamount-damount,
                                            pay_mode:'Cash',
                                        })
                                    }
                                    else{
                                        var finaldata = [];
                                        cashdata.forEach((element, cidx) => {
                                            if(element.pay_mode === 'Cash'){
                                                element["PaidAmount"] = Number(element["PaidAmount"]) + pamount-damount
                                            }
                                            finaldata.push(element);
                                            if(cidx === cashdata.length -1){
                                                cashdata = finaldata;
                                            }
                                        });
                                    }
                                }
                            }) 
                        }
                
                        if(isCredit.length === 0){ 
                            var isCreditdata = cashdata.filter(t=>t.pay_mode === 'Credit Card');
                            if(isCreditdata.length === 0 ){
                                cashdata.push({
                                    PaidAmount:0,
                                    pay_mode:'Credit Card',
                                    card_type:''
                                })
                            }
                        }
                        else{ 
                            var dccamount = 0
                            var pccamount = 0
                            isCredit.forEach((e,ti)=>{
                                pccamount += Number(e.Amount)+ Number(e.Tips); 
                                dccamount += Number(e.Discount)+Number(e.TicketDiscount); 
                                if(ti === isCredit.length-1){ 
                                    total+=Number(pccamount);

                                    var isCashdata = cashdata.filter(t=>t.pay_mode === 'Credit Card');
                                    if(isCashdata.length === 0 ){
                                            
                                        cashdata.push({ 
                                            PaidAmount:pccamount-dccamount,
                                            pay_mode:'Credit Card',
                                        })
                                    }
                                    else{
                                        var finaldata = [];
                                        cashdata.forEach((element, cidx) => {
                                            if(element.pay_mode === 'Credit Card'){
                                                element["PaidAmount"] = Number(element["PaidAmount"]) + pccamount-dccamount
                                            }
                                            finaldata.push(element);
                                            if(cidx === cashdata.length -1){
                                                cashdata = finaldata;
                                            }
                                        });
                                    }
                                }
                            }) 
                        }
                
                        if(isDebit.length === 0){ 

                            var isDebitdata = cashdata.filter(t=>t.pay_mode === 'Debit Card');
                            if(isDebitdata.length === 0 ){
                                cashdata.push({
                                    PaidAmount:0,
                                    pay_mode:'Debit Card',
                                    card_type:''
                                })
                            } 
                        }
                        else{ 
                            var ddamount = 0;
                            var pdamount = 0
                            isDebit.forEach((e,ti)=>{
                                pdamount += Number(e.Amount)+ Number(e.Tips); 
                                ddamount += Number(e.Discount)+Number(e.TicketDiscount);
                                if(ti === isDebit.length-1){ 
                                    total+=Number(pdamount);
                                    var isCashdata = cashdata.filter(t=>t.pay_mode === 'Cash');
                                    if(isCashdata.length === 0 ){
                                        cashdata.push({ 
                                            PaidAmount:pdamount-ddamount,
                                            pay_mode:'Debit Card',
                                        })
                                    }
                                    else{
                                        var finaldata = [];
                                        cashdata.forEach((element, cidx) => {
                                            if(element.pay_mode === 'Cash'){
                                                element["PaidAmount"] = Number(element["PaidAmount"]) + pdamount-ddamount
                                            }
                                            finaldata.push(element);
                                            if(cidx === cashdata.length -1){
                                                cashdata = finaldata;
                                            }
                                        });
                                    }
                                    
                                }
                            }) 
                        }
 
                        totalAmount = total;
                        totalTips = totalTips+ Number(t.Tips); 
                    })

                    

                    discounttotal += emp.discountdata.OwnerDiscount+emp.discountdata.EmpDiscount+emp.discountdata.OwnerEmpDiscount;


                    if(emp.tickets.length > 0){
                        tbldata.push({
                            type: 'table',
                            // style the table
                            style: 'border: 0px solid #ddd',
                            css: {  "font-size": "14px","margin-top": 10, "border":'0' },
                            tableBody: emp.tickets.map(e=>{ 
                                return [
                                    {
                                        type: "text",  
                                        value: e.ticket_date,
                                        style: `text-align:center;`,
                                        css: {  "font-size": "12px" },
                                    }, 
                                    {
                                        type: "text", 
                                        value:  e.ticketcount,
                                        style: `text-align:center;`,
                                        css: {  "font-weight": "500","font-size": "14px", marginTop: -40 },
                                    },
                                    {
                                        type: "text", 
                                        value:  "$"+Number(e.Amount).toFixed(2),
                                        style: `text-align:center;`,
                                        css: {  "font-weight": "500","font-size": "14px", marginTop: -40 },
                                    },
                                    {
                                        type: "text", 
                                        value:  "$"+Number(e.Tips).toFixed(2),
                                        style: `text-align:center;`,
                                        css: {  "font-weight": "500","font-size": "14px", marginTop: -40 },
                                    }
                                ]

                            }),
                            tableHeader: ccolumns,
                            tableBodyStyle: 'border: 0px',
                            tableFooter: ['', 'Total', "$"+Number(amounttotal).toFixed(2), "$"+Number(tipstotal).toFixed(2)],
                        })

                        tbldata.push({
                            type: "text", 
                            value: "Discounts",
                            style: `text-align:left;`,
                            css: {  "font-size": "18px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                            });

                        tbldata.push({
                            type: "text", 
                            value: "<div style='width:70%;float:left;'>Owner</div><div style='width:30%;float:left;'>$"+Number(emp.discountdata.OwnerDiscount).toFixed(2)+"</div>",
                            style: `text-align:left;`,
                            css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                            });

                        tbldata.push({
                            type: "text", 
                            value: "<div style='width:70%;float:left;'>Employee</div><div style='width:30%;float:left;'>$"+Number(emp.discountdata.OwnerEmpDiscount).toFixed(2)+"</div>",
                            style: `text-align:left;`,
                            css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                            });

                        tbldata.push({
                            type: "text", 
                            value: "<div style='width:70%;float:left;'>Owner & Employee</div><div style='width:30%;float:left;'>$"+Number(emp.discountdata.OwnerEmpDiscount).toFixed(2)+"</div>",
                            style: `text-align:left;`,
                            css: {  "font-size": "16px","margin-top": 10, "margin-left": 0 },
                            });

                        tbldata.push({
                            type: "text", 
                            value: "<div style='width:70%;float:left;'>Total</div><div style='width:30%;float:left;'>$"+Number(discounttotal).toFixed(2)+"</div>",
                            style: `text-align:left;font-weight:bold;`,
                            css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                            });

                        // tbldata.push({
                        //     type: "text", 
                        //     value: "<div style='width:70%;float:left;'>Supplies</div><div style='width:30%;float:left;'>$0.00</div>",
                        //     style: `text-align:left;font-weight:bold;padding-bottom:20px;`,
                        //     css: {  "font-size": "16px","font-weight":"bold","margin-top": 10, "margin-left": 0 },
                        //     });  
                    }
                    else{ 
                        tbldata.push({
                            type: "text", 
                            value: "No tickets made during this time period by "+this.state.empReport[0].firstName+" "+this.state.empReport[0].lastName,
                            style: `text-align:center;`,
                            css: {  "font-size": "14px","margin-top": 10, "margin-left": 0 },
                        });
                    }

                    tbldata.push({
                        type: "text", 
                        value:  this.state.businessdetail.name+" - Reported: "+Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                        style: `text-align:center;border-bottom:1px dotted #000;margin-top:40px;padding-top:30px;padding-bottom:20px;`,
                        css: {  "font-size": "14px","margin-top":10, "border-bottom":"1px dotted #000"},
                    });

                })

                var printinput1 = {printername: window.localStorage.getItem('defaultprinter'), data: tbldata}; 
                // console.log(printinput)
                window.api.printdata(printinput1).then(res=>{
                    
                })

        }
        else{
            alert("No printer selected")
        }
    }

    renderTicketDetails(){
        var ticketdetail = []
        ticketdetail.push(<div style={{marginBottom:'1rem'}}><b>Date : {this.state.selectedData.ticket_date}</b></div>)
        ticketdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000'}}> 
        <Grid container>
            <Grid item xs={2}><b>TID #</b></Grid>
            <Grid item xs={10}><b>Service</b></Grid> 
        </Grid>
    </div>)
        this.state.selectedData.ticketslist.forEach((elmt)=>{

            var totalamount = 0;
            var cashamount = 0;
            var cardamount = 0;
            var ticketdiscount = elmt.ticketdiscount;
            
            totalamount = totalamount - ticketdiscount;
            if(elmt.services[0].pay_mode === 'cash'){
                cashamount = cashamount - ticketdiscount
            }
            else{
                cardamount = cardamount - ticketdiscount
            }
            ticketdetail.push(<div style={{display:'flex',width:'100%', alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', borderBottom:'1px solid #000'}}> 
                <Grid container>
                    <Grid item xs={2}>
                        <b>{elmt.ticket_code}</b>
                    </Grid>
                    <Grid item xs={10}>
                        {elmt.services.map(ser=>{
                            if(elmt.pay_mode === 'cash'){
                                cashamount += (Number(ser.service_amount)+Number(ser.tips_amount)-Number(ser.total_discount_amount));
                            }
                            else{
                                cardamount += (Number(ser.service_amount)+Number(ser.tips_amount)-Number(ser.total_discount_amount));
                            }
                            totalamount += (Number(ser.service_amount)+Number(ser.tips_amount)-Number(ser.total_discount_amount));
                            return <> 
                                    <Grid container style={{padding:'5px 0'}}>
                                        <Grid item xs={6}>
                                            {ser.service_name}
                                            <p style={{fontSize:'12px', fontStyle:'italic', color:"#767676"}}>{ser.firstName+" "+ser.lastName}</p>
                                        </Grid>
                                        <Grid item xs={3}><b>Service Amount</b></Grid>
                                        <Grid item xs={3}>${Number(ser.service_amount).toFixed(2)}</Grid>  
                                    </Grid>
                                    <Grid container style={{padding:'5px 0'}}>
                                        <Grid item xs={6}>
                                            
                                        </Grid>
                                        <Grid item xs={3}><b>Tips</b></Grid>
                                        <Grid item xs={3}>${Number(ser.tips_amount).toFixed(2)}</Grid>  
                                    </Grid>

                                    <Grid container style={{padding:'5px 0'}}>
                                        <Grid item xs={6}> 
                                        </Grid>
                                        <Grid item xs={3}><b>Service Discount</b></Grid>
                                        <Grid item xs={3}>${Number(ser.total_discount_amount).toFixed(2)}</Grid>  
                                    </Grid>

                                    <Grid container style={{borderBottom:'1px solid #f0f0f0', padding:'5px 0', background:'#f0f0f0'}}><Grid item xs={6}> 
                                        </Grid>
                                        <Grid item xs={3}><b>Sub Total</b> </Grid>
                                        <Grid item xs={3}>${(Number(ser.service_amount)+Number(ser.tips_amount)-Number(ser.total_discount_amount)).toFixed(2)}</Grid>  
                                    </Grid>
                            </>
                        })}  
                        <Grid container style={{padding:'5px 0'}}>
                                        <Grid item xs={6}> 
                                        </Grid>
                                        <Grid item xs={3}><b>ticket Discount</b></Grid>
                                        <Grid item xs={3}>${Number(ticketdiscount).toFixed(2)}</Grid>  
                                    </Grid>

                        <Grid container style={{padding:'5px 0', background:"#dfdfdf"}}>
                            <Grid item xs={6}> 
                            </Grid>
                            <Grid item xs={3}><b>Grand Total</b></Grid>
                            <Grid item xs={3}>${Number(totalamount).toFixed(2)}</Grid>  
                        </Grid>
                        <Grid container style={{padding:'5px 0', borderTop:'1px solid #f0f0f0'}}>
                            <Grid item xs={6}> 
                            </Grid>
                            <Grid item xs={3}><b>Cash</b></Grid>
                            <Grid item xs={3}>${Number(cashamount).toFixed(2)}</Grid>  
                        </Grid>

                        <Grid container style={{padding:'5px 0'}}>
                            <Grid item xs={6}> 
                            </Grid>
                            <Grid item xs={3}><b>Card</b></Grid>
                            <Grid item xs={3}>${Number(cardamount).toFixed(2)}</Grid>  
                        </Grid>

                        {/* <Grid container style={{padding:'5px 0'}}>
                            <Grid item xs={6}> 
                            </Grid>
                            <Grid item xs={3}><b>Tax Amount</b></Grid>
                            <Grid item xs={3}>${Number(elmt.total_tax).toFixed(2)}</Grid>  
                        </Grid>
                        <Grid container style={{borderTop:'1px solid #f0f0f0', padding:'5px 0'}}>
                            <Grid item xs={6}> 
                            </Grid>
                            <Grid item xs={3}><b>Total</b></Grid>
                            <Grid item xs={3}>${Number(elmt.grand_total).toFixed(2)}</Grid>  
                        </Grid> */}
                    </Grid>
                </Grid>
            </div>)
        })

        return (<>
            {ticketdetail}
        </>)
    }

    renderAuthorizedContent(){
        return (<>
            <div className="tab">
            {this.state.restrictionmode === 'Owner' && <button className={this.state.tabName === 'Owner' ? "active tablinks": "tablinks"} onClick={()=>{
                this.setState({tabName:'Owner', isLoading:true, selectedemps:[],selectedEmp:0}, function(){
                    this.getEmpDetails()
                })
            }} >Owner Report</button>}

            <button className={this.state.tabName === 'Employee' ? "active tablinks": "tablinks"} onClick={()=>{
                this.setState({tabName:'Employee',ticketInfo: false, selectedemps:[],selectedEmp:0}, function(){
                    this.getEmpDetails()
                })
            }} >Employee Report</button> 
            </div>

            {this.state.tabName === 'Owner' &&  !this.state.ticketInfo && 
            <div  class="tabcontent">
                    <Grid container  style={{marginTop:'1rem', maxHeight:'80px'}}>
                            <Grid item xs={12} md={8}>
                                <span style={{textDecoration:'underline', fontSize:'13px', cursor: 'pointer'}} onClick={()=>{
                                    this.setState({isAuthorized: false, 
                                        empReport:[],
                                        cashdata:[],
                                        discountdata:[],
                                        empdiscount:[],
                                        ownertotal:0})
                                }}>Switch Account</span>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}>

                                {/* {this.state.unSynced && 
                                <IconButton onClick={()=>{
                                    this.syncData()
                                }}><SyncIcon style={{color: 'red'}}/></IconButton>} */}


                                    <IconButton onClick={()=>{
                                        this.printData();
                                    }}><Print/></IconButton>
                                    <IconButton onClick={()=>{
                                        this.setState({showDatePopup: true})
                                    }}><CalendarMonthOutlined/></IconButton>
                                </div>
                            </Grid>
                    </Grid>

                    {/* {this.state.unSynced && 
                    <Grid container  style={{marginTop:'0px'}}>
                             <span style={{ fontSize:'12px', cursor: 'pointer'}}>Report may vary as you have unsynced data please sync before viewing report.</span>
                    </Grid> 
                    } */}


                    <Grid container  style={{marginTop:'1rem'}}>
                            <Grid item xs={12} md={12}>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:'2rem 1rem'}}> 
                                    {this.state.empReport.length > 0 && !this.state.isLoading && this.renderOwnerReport()}
                                    {this.state.empReport.length === 0 &&  !this.state.isLoading  && <div><Typography variant="subtitle2">No records found.</Typography></div>}
                                </div>
                            </Grid>
                    </Grid>
            </div> }


            {this.state.ticketInfo && 
            <div  class="tabcontent">
                    <Grid container  style={{marginTop:'1rem', maxHeight:'80px'}}>
                            <Grid item xs={12} md={8}>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}> 
                                    <IconButton onClick={()=>{
                                    this.setState({selectedData:{}, selectedEmp:0, selectedemps:[], ticketInfo: false}, ()=>{
                                        this.getEmpDetails();
                                    })
                                    }} ><Close/></IconButton> 
                                </div>
                            </Grid>
                    </Grid>  
                    <Grid container  style={{marginTop:'1rem'}}>
                            <Grid item xs={12} md={12}>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:'2rem 1rem'}}> 
                                    {this.state.selectedData.ticketslist.length > 0 && this.renderTicketDetails()}
                                    {this.state.selectedData.ticketslist.length === 0 && !this.state.isLoading  && <div><Typography variant="subtitle2">No records found.</Typography></div>}
                                </div>
                            </Grid>
                    </Grid>
            </div> }

            {this.state.tabName === 'Employee' &&  !this.state.ticketInfo && <div class="tabcontent">
                
            <Grid container style={{marginTop:'1rem', display:'flex',  maxHeight:'80px'}}>
                            <Grid item xs={12} md={8}>
                                <span style={{textDecoration:'underline', fontSize:'13px'}} onClick={()=>{
                                    this.setState({isAuthorized: false, 
                                        empReport:[],
                                        cashdata:[],
                                        discountdata:[],
                                        empdiscount:[],
                                        ownertotal:0})
                                }}>Switch Account</span><br/><br/>
                               {this.state.restrictionmode !== 'Employee' &&  <FormControl fullWidth>
                                    <InputLabel>Employees</InputLabel>
                                    <Select
                                    labelId=""
                                    id="selectedemps"
                                    multiple={false}
                                    // value={this.state.selectedemps}
                                    onChange={(e)=>{
                                        this.handlechangeSelect(e);
                                    }}
                                    input={<Input id="select-multiple-chip" />}
                                    // renderValue={(selected) => (
                                    //     <div>
                                    //     {selected.map((value) => (
                                    //         <Chip key={value} label={this.getEmpName(value)} />
                                    //     ))}
                                    //     </div>
                                    // )}
                                    MenuProps={MenuProps}
                                    >
                                    {this.state.employeelist.map(emp => (
                                        <MenuItem value={emp.id}>
                                            {/* <Checkbox checked={this.checkEmp(emp.id)} />   */}
                                            {emp.firstName+" "+emp.lastName} 
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
                                    <IconButton onClick={()=>{
                                        this.printData();
                                    }}><Print/></IconButton>
                                    <IconButton onClick={()=>{
                                        this.setState({showDatePopup: true})
                                    }}><CalendarMonthOutlined/></IconButton>
                                </div>
                            </Grid> 
                    </Grid>

                <Grid container  style={{marginTop:'1rem'}}>
                        <Grid item xs={12} md={12}>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 5rem'}}> 
                                {this.state.empReport.length > 0 && this.renderEmployeeReport()}
                                {this.state.empReport.length === 0 && !this.state.isLoading && <div><Typography variant="subtitle2">No records found.</Typography></div>}
                            </div>
                        </Grid>
                </Grid>

            </div> } 


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
                                    
                                    <Grid item xs={8} style={{padding:'20px'}}>
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
                                    <Grid item xs={4} style={{padding:'20px'}}> 
                                        <Stack direction={{ xs: 'column', sm: 'column' }} spacing={2}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Report Type</FormLabel>
                                                <RadioGroup  column aria-label="tax" name="row-radio-buttons-group">
                                                    <FormControlLabel   style={{margin:'10px 0'}} value={this.state.reporttype} control={<Radio checked={this.state.reporttype === 'daily'} value="daily" onChange={(e)=>{ 
                                                        this.handleType(e)
                                                    }}/>} label="Daily" />
                                                    <FormControlLabel   style={{margin:'10px 0'}} value={this.state.reporttype} control={<Radio checked={this.state.reporttype === 'monthly'} value="monthly" onChange={(e)=>{ 
                                                    this.handleType(e) }}/>} label="Monthly" />
                                                    <FormControlLabel   style={{margin:'10px 0'}} value={this.state.reporttype} control={<Radio checked={this.state.reporttype === 'annually'} value="annually" onChange={(e)=>{ 
                                                    this.handleType(e) }}/>} label="Annually" />
                                                        
                                                </RadioGroup>
                                            </FormControl>
                                        </Stack>
                                    </Grid> 
                                </Grid>
                        
                        </DialogContentText>
                            </DialogContent>
                        <DialogActions style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}>
                            <Button variant="contained" onClick={()=>{this.setState({reportby:'changed'});this.getReport()}}> Get Report </Button>
                        </DialogActions>
            </Dialog>  

        </>
        )
    }

    requestAuthorizeContent(){
        return <div>
                <div className='container synccontainer'>
                    <div style={section} > 
                    </div>
                    <div  style={{display:'flex', justifyContent:'center', alignItems:'flex-start', flexDirection:'column', width:'50%'}}> 
                        <Card style={{borderRadius: 16, boxShadow:'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}}>
                            <CardContent style={{marginTop: 10, marginBottom: 10}}>
                                <div style={{display:'flex', width: '100%',margin: "0 auto"}}> 
                                

                                <Typography variant="h6" align="center" textAlign="center" color="textSecondary" style={{background:'white', width: '100%', color: '#134163'}}> Enter the passcode to access reports 
                                
                                </Typography>

                                <IconButton
                                edge="start"
                                onClick={()=>this.onClose()}
                                aria-label="close"
                                style={{"color":'#134163', marginLeft: 'auto',marginRight: 0}}
                                >
                                <CloseIcon />
                                </IconButton>
                                </div>
                                <form>
                                    <Grid container spacing={3} style={{marginTop: 20}}>
                                        <Grid item xs={12}>
                                            <NumberPad numbercode={this.state.passcode} codeLength='4' textLabel='Enter code' handleChangeCode={this.handleChangeCode} 
                                            onSubmit={()=>this.authorize()} clearPasscode={clearPasscode => this.clearPasscode  = clearPasscode}/>
                                        </Grid> 
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                        
                        <Dialog
                                    open={this.state.openDialog}
                                    onClose={this.handleCloseDialog}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    style={{borderRadius:'10px'}}
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        You are not authorized to access reports.
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <Typography variant="subtitle2" >Please Try Again Later</Typography>
                                    </DialogContentText>
                                        </DialogContent>
                                    <DialogActions>
                                        <Button variant="contained" onClick={()=>this.handleCloseDialog()}> OK </Button>
                                    </DialogActions>
                        </Dialog>  
                    </div>  
                    <div style={section} > 
                    </div>
                </div> 
            </div>
    } 

    render() {
        // console.log("isSyncing:",this.state.isSyncing)
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
                                        {this.state.isOnline && !this.state.isAuthorized &&  this.requestAuthorizeContent() }
                                        {this.state.isOnline && this.state.isAuthorized && this.renderAuthorizedContent() }
                                        {!this.state.isOnline && <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                                <img style={{height:'100px'}} alt="offline" src="./assets/images/offline.png"/>
                                                <Typography variant="h4" style={{color:"#ccc"}}>You are offline.</Typography>
                                                <Typography variant="subtitle2" style={{color:"#ccc", marginBottom:'1rem'}}>Please try again later.</Typography>
                                                <Button variant="contained" onClick={this.reloadPage}>Reload</Button>
                                            </div>
                                        }
                                    </Container>
                                </div>
                            </Grid>
                    </Grid> 
                </div> 

              
            </div>
        )
    }
 
}
