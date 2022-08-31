import React from 'react';
import { Grid, Typography, Button, Card, CardContent,Box,FormControl,Select,MenuItem,InputLabel, Paper, FormGroup} from '@material-ui/core/'; 

import CallSplit from '@mui/icons-material/CallSplit';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@material-ui/core';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchBar from "material-ui-search-bar";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextareaAutosizeContent from '../../../components/formComponents/TextAreaAutosize';
import Moment from 'moment';
import TableContent from '../../../components/formComponents/DataGrid';
import TextFieldContent from '../../../components/formComponents/TextField'

import TicketManager from '../../../controller/TicketManager';
import DataManager from '../../../controller/datacontroller';

import LoadingModal from '../../../components/Modal/loadingmodal'; 
import AlertModal from '../../../components/Modal/alertModal';
import ModalTitleBar from '../../../components/Modal/Titlebar';

import SelectTechnician from './selectTechnician';
import AddCustomer from './addCustomer';
import NotesModal from './notes';
import DiscountTicketModal from './TicketDiscount';
import TicketTipsModal from './TicketTips';
import VariablePriceModal from './PriceVariable'
import VoidModal from './voidticket';
import SelectCustomer from './selectCustomer';
import CustomerDetailModal from './customerdetail';
import TicketServiceSplitModal from './SplitService';
import PaymentModal from './TicketPayment'; 
import TextField from '@mui/material/TextField'; 
import config  from '../../../config/config';
import TicketController from '../../../controller/TicketController';

const cusDetail ={
    margin:'5px'
}
const amtDetail ={
    margin:'5px'
}

const disDetail ={
    margin:'5px',
    color: 'red'
}

const taxDetail={
    margin:'5px',
    color: '#134163'
}

export default class CreateTicket extends React.Component {

    ticketController = new TicketController();
    
    constructor(props) {
        super(props);
        this.state = {
            isPaidOnOpen:false,
            open: false,
            employeedetail:{},
            businessdetail:{},
            ticketCode:'',
            customer: '',
            customers:[],
            customer_id:'',
            category_list:[],
            services_list:[],
            employee_id:'',
            employee_list:[],
            customer_services:[],
            isServiceAvailable: false,
            service_emp:[],
            openCustomer: false,
            toggleOpen: false,
            handleCloseCustomer: false,
            cusValue: '',
            selected_category: -1,
            totalamount:0,
            totaltax:0,
            grandTotal:0,
            ownerTech:{},
            selectedRowService:{},
            selectedTech: {},
            selectedRowServiceindex:-1,
            isSelectTechnician: false,
            technician_id:'', 
            ticketserviecloseAlert_Open: false,
            priceVariablePopup: false,
            newTicket: false,
            dataManager: new DataManager(),
            createTicketDataManager: new TicketManager(props),
            tax_removed: 0,
            techcategory_list:[,
                {id:9 , label:"Show Menu" }, 
                {id:-1 , label:"Technicians" },
                {id:1 , label:"Transfer" },
                {id:2 , label:"Quantity" },
                {id:3 , label:"Change Price" },
                {id:4 , label:"Void Item" },
                {id:5 , label:"Split Item" },
                {id:6 , label:"Request" },
                {id:7 , label:"Discount" },
                {id:8 , label:"Tax" }
            ],
            snackbarOpen: false,
            ticketSelected:{},
            isEdit: false,
            isDisable: false,
            isDisablePay: false,
            clockin_emp_list:[],
            addNotes_popup: false,
            notes:'',
            openPayment:false,
            ticketDetail: {},
            voidalertOpen:false,
            service_quantity: 1,
            service_price:'',
            menu_selected_id:'',
            tips_type:'equal',
            tips_totalamt:0,
            tips_amt:0,
            tips_percent:0,
            ticketcloseAlert_Open: false,
            discount_list:[],
            total_discount: 0,
            selected_discount: '',
            discount_id:0,
            discount_type:'',
            discount_value:0,
            discount_totalamt:0,
            ticket_discount_selected:{},
            addDiscount_popup: false,
            addTips_popup: false,
            customer_detail:{},
            business_owner:{},
            isSelectCustomerDetail: false,
            servicePrice: 0,
            retailPrice: 0, 
            tipsdiscountEnabled: true,
            ticketrequestAlert_Open: false,
            transferAlert: false,
            
            open_tickets:[],
            selectedservice: {},
            transferpopup:false,
            columns:[ {
                field: 'ticket_code',
                headerName: 'Ticket Code',
                // minWidth: 150,
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
                // minWidth: 150,
                flex: 1,
                editable: false,
                renderCell: (params) => (
                    <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {params.row.customer_name !== null && params.row.customer_name !== '' ? params.row.customer_name : 'NA'}
                      </Typography>
                )
            },  
            {
                field: 'created_at',
                headerName: 'Time',
                // minWidth: 250,
                flex: 1,
                editable: false,
                renderCell: (params) => (
                        <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                      {Moment(params.row.created_at).format('YYYY-MM-DD hh:mm a')}
                      </Typography>


                    // <Typography variant="subtitle2" style={{marginLeft:10,MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center">
                    //   {params.row.created_at.replace("T", " ").substring(0, params.row.created_at.length-5)}
                    //   </Typography>
                )
            },
            ],
            confirmtransfer:false,
            rowToTransfer:{},
            isLoading: false,
            isCombine:false,
            confirmcombine: false, 
            printpopup: false,
            print_data: [], 
            printers_list:[],
            selected_printer: '',
            allcategories:[],
            allservices:[],
            searchtext:'',
            printalert:false,
            disableerror:'',
            services_taken:[],
            alltaxlist:[],
            service_taxlist:[],
            businesstaxes:[],
            combiningid:-1,
            combiningticket:{},
            ticketref_id: '',
            data: [{
                id: 0,
                title: 'Buy a',
                status: 0, // 0 = todo, 1 = done
              },
              {
                id: 1,
                title: 'Buy b',
                status: 0,
              },
              {
                id: 2,
                title: 'Buy c',
                status: 0,
              }
            ],
            dateerror:false
        }


        this.handleCloseVariablePricePopup = this.handleCloseVariablePricePopup.bind(this)
        this.afterSubmitVariablePrice = this.afterSubmitVariablePrice.bind(this)
        this.handlechangeEmp = this.handlechangeEmp.bind(this);
        this.saveTicket = this.saveTicket.bind(this)
        this.handleCloseCustomer_Dialog = this.handleCloseCustomer_Dialog.bind(this) 
        this.handleCloseCustomer = this.handleCloseCustomer.bind(this) 
        this.handlechangeNotes = this.handlechangeNotes.bind(this)
        this.handleClosePayment = this.handleClosePayment.bind(this)  
        this.selectCustomer = this.selectCustomer.bind(this)
        this.onSelectCustomer = this.onSelectCustomer.bind(this)
        this.handleCloseTips = this.handleCloseTips.bind(this) 
        this.handleOpenTicketAlert = this.handleOpenTicketAlert.bind(this)
        this.handleCloseTicketAlert = this.handleCloseTicketAlert.bind(this)
        this.handlechangeDiscount = this.handlechangeDiscount.bind(this)
        this.handleCloseDiscounts = this.handleCloseDiscounts.bind(this)
        this.removeServiceDiscount = this.removeServiceDiscount.bind(this)
        this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this)
        this.openTechnician=this.openTechnician.bind(this)
        this.handleCloseTechnician = this.handleCloseTechnician.bind(this)
        this.onSelectTechnician = this.onSelectTechnician.bind(this)
        this.openCustomerDetail = this.openCustomerDetail.bind(this)
        this.closeCustomerDetail = this.closeCustomerDetail.bind(this)
        this.handleTicketServiceAlert = this.handleTicketServiceAlert.bind(this)
        this.handleCloseTicketServiceAlert = this.handleCloseTicketServiceAlert.bind(this)

        this.makeSpecialRequest = this.makeSpecialRequest.bind(this);
        this.handleSpecialrequest = this.handleSpecialrequest.bind(this);
        this.saveTicketServiceData = this.saveTicketServiceData.bind(this);
        this.getOpenTickets = this.getOpenTickets.bind(this);
        this.getOpenTicketsCombine = this.getOpenTicketsCombine.bind(this);
        this.ontransfer = this.ontransfer.bind(this);
        this.transferService = this.transferService.bind(this);
        this.onCombine = this.onCombine.bind(this);
        this.combineService = this.combineService.bind(this);
        this.handleCloseSplit = this.handleCloseSplit.bind(this); 

        this.printTicket = this.printTicket.bind(this)
        this.handleClosePrint = this.handleClosePrint.bind(this)
        this.handleChangePrinter = this.handleChangePrinter.bind(this)
        this.isTaxCheck = this.isTaxCheck.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        
        this.handleTransferAlert = this.handleTransferAlert.bind(this);
        this.handleCloseTransferAlert  =  this.handleCloseTransferAlert.bind(this)
    } 

    componentDidMount() { 
        this.loadData();
    }
    loadData(){
        window.api.getprinters().then(list=>{
            var printers = list.printers;
            this.setState({printers_list: printers, selected_printer: printers.length > 0 ? printers[0] : '' }  ) 
        })  
        

        var businessdetail = JSON.parse(window.localStorage.getItem('businessdetail'));
        this.setState({businessdetail: businessdetail});
        if(this.props.ticketSelected !== undefined){ 
            var disInput = {};
            var ticket = Object.assign({},this.props.ticketSelected);
            // if(ticket.syncedId !== undefined){
            //     ticket.id  = ticket.syncedId;
            // }

            this.setState({ticketSelected: ticket,isEdit : true}, function(){ 
                console.log(this.state.ticketSelected);
                if(this.state.ticketSelected.paid_status === 'paid'){
                    console.log("isPaidOnOpen settings")
                    this.setState({isPaidOnOpen: true})
                }
                else{
                    this.setState({isPaidOnOpen: false})
                }
                if(this.state.ticketSelected.discount_totalamt !== 0 || this.state.ticketSelected.discount_totalamt !== null){
                    disInput = {
                        discount_id: this.state.ticketSelected.discount_id,
                        discount_type: this.state.ticketSelected.discount_type,
                        discount_value: this.state.ticketSelected.discount_value,
                        discount_totalamt: this.state.ticketSelected.discount_totalamt,
                    }
                }else{
                    disInput = undefined;
                }
                this.setState({
                    ticketCode:  this.state.ticketSelected.ticket_code, 
                    customer_id: this.state.ticketSelected.customer_id,
                    totaltax: Number(this.state.ticketSelected.total_tax),
                    totalamount: Number(this.state.ticketSelected.subtotal),
                    grandTotal: Number(this.state.ticketSelected.grand_total),
                    technician_id : this.state.ticketSelected.technician_id,
                    tips_totalamt: Number(this.state.ticketSelected.tips_totalamt),
                    tips_percent:Number(this.state.ticketSelected.tips_percent),
                    notes: this.state.ticketSelected.notes,
                    tips_type:this.state.ticketSelected.tips_type,
                    total_discount: this.state.ticketSelected.discounts,
                    discount_id: this.state.ticketSelected.discount_id,
                    discount_type: this.state.ticketSelected.discount_type,
                    discount_value: this.state.ticketSelected.discount_value,
                    discount_totalamt: this.state.ticketSelected.discount_totalamt,
                    ticket_discount_selected: disInput ,
                    selected_discount: disInput.discount_id != undefined? disInput.discount_id : '',
                    ticketref_id: this.state.ticketSelected.sync_id
                }, ()=>{
                    //console.log("DISCOUNT", this.state.total_discount);
                }); 

                if(this.state.ticketSelected.paid_status === "paid"){
                    this.setState({ isDisable: true,isDisablePay: true});
                }else{
                    this.setState({ isDisable: false,isDisablePay: false});
                } 
                this.getCustomerList();
                this.getTaxes();
                this.getTicketServices(this.state.ticketSelected.sync_id)
               
                
                var customer_id = this.state.ticketSelected.customer_id
                if(customer_id === 'undefined') {
                    customer_id = " "
                }
                const sql = "select * from users where  id =  '"+this.state.ticketSelected.technician_id+"'"
        
                this.state.dataManager.getData(sql).then(response =>{ 
                    this.setState({ownerTech:  this.props.owner,selectedTech:  response[0], technician_id: this.state.ticketSelected.technician_id}, function(){
                        const sql_cust = "select sync_id as id, member_id, name, email, dob, first_visit, last_visit, visit_count, total_spent, loyality_point, created_at, created_by, updated_at, updated_by, status, phone, businessId, sync_status, sync_id from customers where businessId = '"+JSON.parse(window.localStorage.getItem('businessdetail'))["id"]+"'  and sync_id =  '"+customer_id+"'"
                      
                        this.state.dataManager.getData(sql_cust).then(response =>{
                            if(response.length>0) {
                                this.setState({customers:response,customer_detail: response[0]}, function() {
                                });
                            }
                           
                        })
                    });
               
                })

        
                
                
            });
        }
        else{
            this.generateCode();
            this.getCustomerList();
            this.getTaxes();
            this.setState({ownerTech:  this.props.owner,selectedTech:  this.props.owner, technician_id: this.props.owner.id});
        }

        var employeedetail = window.localStorage.getItem('employeedetail');
        if(employeedetail !== undefined){
            this.setState({employeedetail:JSON.parse(employeedetail)})  
            var emp = JSON.parse(employeedetail);
            //////console.log("owner", this.props.owner)
            if(this.props.owner.id === undefined )
                this.setState({ownerTech:  emp,selectedTech: emp, technician_id: emp.id }) 
        } 
    }

    generateCode(){ 
        window.api.getTicketCode().then(res=>{ 
            console.log(res)
            if(res.ticketid !== ''){
                var ticket_code = String(res.ticketid).padStart(4, '0');
                this.setState({ticketCode:ticket_code, dateerror: false}, ()=>{
                    console.log(this.state.dateerror, "dateerror sfsdfsdf")
                });
            }
            else{
                this.setState({dateerror: true})
            }
        })
        // this.setState({ticketCode:  GenerateRandomCode.NumCode(4)});
    }
    
    getCustomerList(){ 
        const sql = "select sync_id as id, member_id, name, email, dob, first_visit, last_visit, visit_count, total_spent, loyality_point, created_at, created_by, updated_at, updated_by, status, phone, businessId, sync_status, sync_id from customers where businessId =  '"+JSON.parse(window.localStorage.getItem('businessdetail'))["id"]+"' and status = 'Active'"
        this.state.dataManager.getData(sql).then(response =>{ 
            this.setState({customers:response}, function() {
                this.getCategoryList();
            }); 
        }) 

    }

    getCategoryList(){    
        const sql = "select sync_id as id, name, status, description,created_at, created_by, updated_at, updated_by,businessId, sync_status  from category where status = 'Active'" ;
        this.state.dataManager.getData(sql)
        .then(response =>{
            console.log("respoinse")
            console.log(response)
            if (response instanceof Array) {
                this.setState({category_list:response, allcategories: response}, function() {
                    if(response.length>0){
                        this.getServices(response[0].id);
                        // this.testData()
                    } 
                    else{ 
                        this.setState({services_list:[], allservices:[]})
                    }
                });
            }
            this.getEmployeeList();  
        }) 

        
    }

    testData() {
        /**test data */
        var test_arry = []
        for(var i=0;i<50;i++){
            test_arry.push(this.state.services_list[0])
        }
        this.setState({services_list: test_arry})
    }

    getServices(category_id){
        this.setState({selected_category:category_id});
        var sql = "select * from services_category where category_id =  '"+category_id+"' and lower(status) = 'active' and service_id in (select sync_id from services where  status='Active') group by service_id" 
        if(this.state.searchtext !== ''){
            sql = "select * from services_category where service_id in (select sync_id from services where lower(name) like '%"+this.state.searchtext+"%' and status='Active') and category_id =  '"+category_id+"' and  lower(status) = 'active' group by service_id" 
        } 
        console.log(sql);
        this.state.dataManager.getData(sql) 
        .then(async response =>{ 
            ////console.log(response)
            if (response instanceof Array) { 
                this.formatServices(0, response, []);
            }
           
        })

    }

    getUnique(arr, index) {

        const unique = arr
             .map(e => e[index])
      
             // store the keys of the unique objects
             .map((e, i, final) => final.indexOf(e) === i && i)
      
             // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);      
      
         return unique;
      }

    async formatServices(i, data, responsearray){
        if(i < data.length){ 
            var uResponse = data[i]
            uResponse.name = ''
            uResponse.businessId = ''
            uResponse.cost = ''
            uResponse.description = ''
            uResponse.price= ''
            uResponse.pricetype= ''
            uResponse.productcode= ''
            uResponse.producttype= ''
            uResponse.sku= ''
            uResponse.tax_type= ''

            /**get service name */
            var sql = "select  sync_id as id,name, status, description, created_at, created_by, updated_at, updated_by, price, businessId, tax_type, cost, pricetype, sku, producttype, productcode  from services where sync_id =  '"+data[i]["service_id"]+"'  and status = 'Active'"
            await this.state.dataManager.getData (sql,"getServices") 
            .then((result) => { 
                console.log(result)
                uResponse.name = result[0]["name"]
                uResponse.businessId = result[0]["businessId"]
                uResponse.cost = result[0]["cost"]
                uResponse.description = result[0]["description"]
                uResponse.price= result[0]["price"]
                uResponse.pricetype= result[0]["pricetype"]
                uResponse.productcode= result[0]["productcode"]
                uResponse.producttype= result[0]["producttype"]
                uResponse.sku= result[0]["sku"]
                uResponse.tax_type= result[0]["tax_type"];

            
                responsearray.push(uResponse)
                this.formatServices(i+1, data, responsearray);
            }).catch(e=>{ 
                responsearray.push(uResponse)
                this.formatServices(i+1, data, responsearray);
            });
        }
        else{ 
            this.setState({services_list:responsearray, allservices:responsearray}, function() {
                // this.testData()
            });
        }
    }

    getEmployeeList(){
     
        this.state.dataManager.getData(`select u.firstName, u.lastName, u.staff_role, u.id as id, u.clocked_status as ostatus, b.clockin_out as clocked_status from users as u left join staff_clockLog as b on u.id = b.staff_id and b.isActive=1`).then(response =>{ 
            ////console.log("usrslist ")
            ////console.log(response);
            var options = response.map(r=>{
                r.clocked_status = (r.clocked_status !== undefined && r.clocked_status !== null ) ? r.clocked_status : r.ostatus;
                return r;
            });
            ////console.log("oppopop")
            ////console.log(options);
            options = this.getUnique(options,'id')
            this.setState({employee_list: options}, function() {
                this.getClockInEmp();
                this.getDiscountList() 
            });
            
        })
       
        
        
    }


    getDiscountList(){ 
        const sql = "select * from discounts where businessId = '"+JSON.parse(window.localStorage.getItem('businessdetail'))["id"]+"' and status = 'active'"
       
        this.state.dataManager.getData(sql).then(response =>{
            
            this.setState({discount_list: response}, function(){
                this.getBusinessOwner()
            });
        })

    }

    getBusinessOwner(){ 

        var employeedetail = window.localStorage.getItem('employeedetail');
        if(employeedetail !== undefined){
            this.setState({business_owner:{business_owner_id:JSON.parse(employeedetail).id}})  
        }
        // const sql = "select * from user_business"
       
        // this.state.dataManager.getData(sql).then(response =>{ 
        //     this.setState({business_owner: response[0]} );
        // }) 
    }
    

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.owner!==prevState.ownerTech ){
            return { ownerTech: nextProps.owner};
        }
        else return null;
     }


    componentDidUpdate(prevProps, prevState) {
        if(prevProps.owner!==this.props.owner){
            //Perform some operation here 
            this.setState({ownerTech: this.props.owner});
        }
    }


    handleCloseCustomer_Dialog() {
        this.setState({toggleOpen: false, isSelectCustomerEnabled: false});
    };



    handlechangeDiscount(dis,e){ 
        
        //console.log("handlechangeDiscount", this.state.selectedRowServiceindex,this.state.selectedRowService)
        
       var id = dis.id; 
        if(this.state.selectedRowService.discount.discount_id !== undefined && this.state.selectedRowService.discount.discount_id !== '') { 
            //console.log("1")
            if(this.state.selectedRowService.discount.discount_id === id) { 
                //console.log("2")
                this.removeServiceDiscount(dis)
            } 
            else { 
                
                let selected_discount = this.state.discount_list.filter(item => item.id === id);
               
                var tobeupdate = this.state.services_taken.filter((item, index) => index === this.state.selectedRowServiceindex)
                    
                if(tobeupdate.length>0) {
                    var services_taken = [...this.state.services_taken];
                    var discount = {
                        discount_id: selected_discount[0].id,
                        discount_name: selected_discount[0].name,
                        discount_type: selected_discount[0].discount_type,
                        discount_value: selected_discount[0].discount_value
                    }
                    services_taken[this.state.selectedRowServiceindex].discount = discount;
                    this.setState({services_taken: services_taken, selectedRowService:services_taken[this.state.selectedRowServiceindex]}, function() {
                        this.calculateTotal();
                    });

                }


            }
        }
        else { 
            //console.log("else")
            let selected_discount = Object.assign({}, dis);
            var customer__services = Object.assign([],this.state.services_taken);
            var service = Object.assign({}, customer__services[this.state.selectedRowServiceindex]);
            var obj = {
                discount_id : selected_discount.id,
                 discount_name : selected_discount.name,
                discount_type : selected_discount.discount_type,
                 discount_value: selected_discount.discount_value
            }
            //console.log("1.else")
            service["discount"] = obj; 
            // ////console.log(service);
            var per_dis = 0;
            if(selected_discount.discount_type === 'percentage'){
                per_dis = (selected_discount.discount_value/100) *  Number(customer__services[this.state.selectedRowServiceindex].subtotal);
            }else{
                per_dis = selected_discount.discount_value;
            }
            //console.log("2.else")
            var uper_dis = Number(per_dis.toFixed(2))
            service.subtotal = service.subtotal-uper_dis;
            service.discountamount = uper_dis;
            //console.log("3.else")
            customer__services[this.state.selectedRowServiceindex] = service; 
            this.setState({services_taken:customer__services, selectedRowService: service}, function(){
                    //console.log("4.else")
                    this.calculateTotal();
            });
        }
        
    }


    removeServiceDiscount(dis){ 
        var customer_services = this.state.services_taken;
        if(customer_services[this.state.selectedRowServiceindex].discount.discount_id ===  dis.id){
            customer_services[this.state.selectedRowServiceindex].discount = {};  
            customer_services[this.state.selectedRowServiceindex].discountamount = 0;
            this.setState({services_taken:customer_services}, function(){
                this.calculateTotal();
            });            
        }
    }
    
    getTicketServices(ticket_id){ 

        // const sql = "select ts.*,s.*,ts.id as uniquId,ts.syncedid as syncedid, rn.id as notesid, rn.notes as requestNotes, d.name as discount_name from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.Id left join ticketservice_requestnotes as rn on rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1 left join discounts as d on d.id = ts.discount_id where ts.ticketref_id =  '"+ticket_id+"'  and ts.isActive=1" 
        
        const sql = `select ts.*,(select id from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1  )
        as notesid,  (select notes from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1 ) as requestNotes,s.*,ts.sync_id as uniquId,ts.syncedid as syncedid,  d.name as discount_name from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.sync_id  left join discounts as d on d.id = ts.discount_id where ts.ticketref_id =  '`+ticket_id+`'  and ts.isActive=1 ORDER BY sort_number`  
         
        console.log("sql::",sql)
         this.state.dataManager.getData(sql).then(response =>{
       
            //console.log("sql::",response)
            if (response instanceof Array) { 
                this.setState({ticketSelectedServices: response})
                for (var i=0;i < response.length; i++){  //console.log(response[i]);
                    this.addServices(response[i]) 
                    if(i === response.length-1) {
                        this.getCustomerList();
                    }
                }
            }
        })
       
       
    }


    getDataPromise = (data) => new Promise((resolve, reject) => {  
        setTimeout(() => {  
            resolve(data)
        }, 1000);  
     });  

    getCustomerDetail(cust_id){
      
        const sql = "select sync_id as id, member_id, name, email, dob, first_visit, last_visit, visit_count, total_spent, loyality_point, created_at, created_by, updated_at, updated_by, status, phone, businessId, sync_status, sync_id from customers where businessId = '"+JSON.parse(window.localStorage.getItem('businessdetail'))["id"]+"'  and sync_id =  '"+cust_id+"'"
        this.state.dataManager.getData(sql).then(response =>{
            this.setState({customers:response,customer_detail: response[0]}, function() {
                
            });

        })

    }

  
    getTaxes(){
        var businessdetail = JSON.parse(window.localStorage.getItem('businessdetail'));
        const sql = "select sync_id as id, tax_name, tax_type, tax_value, isDefault, created_at, created_by, updated_at, updated_by, status, businessId, sync_status, sync_id from taxes where status='active'"; 
        console.log("getTaxes::",sql)
        this.state.dataManager.getData(sql).then(taxes=>{ 
            this.setState({businesstaxes: taxes}, function(){})
        })
    }

    variablePricePopup() {

    }

    addServices = (servicein) => new Promise((resolve, reject) => {    
        console.log("SERVICEIN:::::", servicein)      
        ////console.log(servicein.service_cost, servicein.service_quantity)
        var obj = {
            "servicedetail": servicein,
            discount:{},
            taxes:[],
            subtotal: servicein.service_cost != undefined ? servicein.service_cost : servicein.price,
            taxamount:0,
            discountamount:servicein.total_discount_amount !== undefined ?  servicein.total_discount_amount :0,
            qty: servicein.service_quantity != undefined ?  servicein.service_quantity : 1,
            perunit_cost:servicein.perunit_cost != undefined ? servicein.perunit_cost : servicein.price,
            employee_id:  (servicein.employee_id !== null && servicein.employee_id !== undefined ? Number(servicein.employee_id) : Number(this.state.technician_id))  ,
            isSpecialRequest: servicein.isSpecialRequest !== undefined ? servicein.isSpecialRequest: 0,
            process:servicein.process !== undefined ? servicein.process : '',
            requestNotes: servicein.requestNotes !== undefined ? servicein.requestNotes : '',
            tips_amount: servicein.tips_amount !== undefined ? servicein.tips_amount : 0,
            sort_number: this.state.services_taken.length+1
        }
        ////console.log(obj);
        console.log("SERVICEIN:::::", servicein)
        var sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.sync_id=st.tax_id and t.status='active' where service_id='"+servicein.service_id+"' and st.status='active'";

        if(this.state.isEdit){
            obj["discount"].discount_id = servicein.discount_id
            obj["discount"].discount_type = servicein.discount_type
            obj["discount"].discount_value = servicein.discount_value
            obj["discount"].discount_name = servicein.discount_name
            obj["discount"].total_discount_amount = servicein.total_discount_amount
            console.log("$$$$$$$$$$$$$$$$$$")
            console.log(servicein.uniquId, servicein.tax_type)
            if((servicein.uniquId === undefined || servicein.uniquId === '')  && servicein.tax_type !=='default'){
                sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.sync_id==st.tax_id and t.status='active' where st.service_id='"+servicein.service_id+"' and st.status='active'"
            }
            else if((servicein.uniquId === undefined || servicein.uniquId === '') && servicein.tax_type ==='default'){
                sql = "SELECT t.sync_id as tax_id,t.tax_name,t.tax_type,t.tax_value from taxes as t where t.isDefault=1 and t.status='active'"
            }
            else if(servicein.uniquId !== undefined){
                sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from ticketservice_taxes as st join taxes as t on t.sync_id==st.tax_id and t.status='active' where st.serviceref_id='"+servicein.uniquId+"' and st.ticketref_id='"+servicein.ticketref_id+"' and st.isActive=1"
            } 
        } 
        else if(servicein.tax_type ==='default'){
            sql = "SELECT t.sync_id as tax_id, t.tax_name,t.tax_type,t.tax_value from taxes as t where t.isDefault=1 and t.status='active'"
        }
        console.log("TAX SQL::::::")
        console.log(sql);
        this.state.dataManager.getData(sql).then(response =>{  
            console.log("tax response :::::: ", response)
            obj.taxes = response.length > 0 ?  response : []; 
            var services = this.state.services_taken;
            services.push(obj);
            this.setState({services_taken: services}, ()=>{ 
                this.setState({tipsdiscountEnabled: false})
                this.calculateTotal();
            })
        });
    }) 

    calculateTotalandpay(){ 
        this.updateServiceTotal(0,0,0,'no'); 
    }

    updateServiceTotal(i,  tax=0, total_discount=0, opt=''){ 
        var services = Object.assign([], this.state.services_taken); 
        var per_dis = 0; 
        var quantity_price = 0; 
        var price_tax = 0; 
        if(services.length === 0){
            var total = 0
           
            this.setState({totalamount : Number(total).toFixed(2), grandTotal: Number(total).toFixed(2), 
                totaltax:Number(total).toFixed(2), servicePrice:Number(total).toFixed(2), retailPrice:Number(total).toFixed(2)}, ()=>{
                if(opt == 'no'){
                    this.saveTicket('no')
                }

                //console.log("updateServiceTotal", this.state.totaltax)
            })
        }
        if(i < services.length){
            var element = services[i]
            element.subtotal =  element.qty*element.perunit_cost;
            quantity_price =  element.subtotal;

            if(element.discount.discount_id !== undefined){
                //Discount Percentage Amt Calculation
                if(element.discount.discount_type === 'percentage'){
                    per_dis = (element.discount.discount_value/100)*  Number(quantity_price);
                }else{
                    per_dis = element.discount.discount_value;
                }
                quantity_price = quantity_price - per_dis;
                var uper_dis = Number(per_dis.toFixed(2))
                //Discount Percentage value for View
                element.discountamount = uper_dis;
                element.subtotal = element.subtotal-uper_dis; 
                services[i] = element;
                this.setState({services_taken: services});
            }
 
            element.taxes.forEach((t, j)=>{
                var per_amt = 0;
                if(t.tax_type === 'percentage'){
                    per_amt = (t.tax_value/100)*  Number(quantity_price);
                    t.tax_calculated = per_amt.toFixed(2);
                    price_tax += per_amt; 
                }
                else{
                    if(t.tax_value !== undefined || t.tax_value !== undefined){ 
                        t.tax_calculated = t.tax_value.toFixed(2);
                        price_tax += t.tax_value;  
                    }
                    
                }

                // //console.log(" element.taxamount", t.tax_calculated)

                if(j === element.taxes.length-1){
                    element.taxamount =  price_tax;  
                }  
                
                


            }) 


            if(element.taxes.length === 0){
                element.taxamount = 0;
            }

            // //console.log(" element.taxamount", element.taxamount)

            this.updateServiceTotal(i+1, services, tax, total_discount);
        }
        else{
            var total = 0;
            var taxamount = 0;
            var servicePrice = 0;
            var retailPrice = 0;
            
            this.state.services_taken.forEach((elmt, j)=>{
                total += Number(elmt.subtotal);
                // if(elmt.taxamount ==  this.state.tax_removed) {
                //     taxamount += Number(elmt.taxamount-this.state.tax_removed); 
                // }
                // else {
                    //console.log(elmt.taxamount, elmt.servicedetail.name)
                    taxamount += Number(elmt.taxamount); 
                // }
               
                
                // taxamount = taxamount-this.state.tax_removed
                // //console.log("elmt.taxamount",elmt.taxamount, this.state.tax_removed)
                if(elmt.servicedetail.producttype === 'service') {
                    servicePrice = Number(servicePrice) +  Number(elmt.subtotal) ;
                    ////console.log(servicePrice);
                }
                else if(elmt.servicedetail.producttype === 'product') {
                    retailPrice = Number(retailPrice)  + Number(elmt.subtotal) 
                }
                if(j === services.length -1){
                    var discount = this.state.total_discount !== undefined ? this.state.total_discount : 0;
                    var tips = this.state.tips_totalamt  !== undefined ? this.state.tips_totalamt : 0;
                    //console.log(this.state.ticket_discount_selected);
                    if(this.state.ticket_discount_selected.discount_id !== 0 && this.state.ticket_discount_selected.discount_id !== undefined && this.state.ticket_discount_selected.discount_id !== null){
                        discount = this.state.ticket_discount_selected.discount_value;
                        if(this.state.ticket_discount_selected.discount_type == 'percentage'){
                            discount = total * (this.state.ticket_discount_selected.discount_value/100);
                        }
                    }

                    var grand_total = total - discount + taxamount + tips;
                    //console.log(total, grand_total, discount, taxamount, this.state.tips_tips_totalamtamt)
                    this.setState({totalamount : Number(total).toFixed(2),isLoading:false, total_discount: discount, grandTotal: Number(grand_total).toFixed(2), 
                        totaltax:Number(taxamount).toFixed(2), servicePrice:Number(servicePrice).toFixed(2), retailPrice:Number(retailPrice).toFixed(2), tax_removed: 0}, ()=>{
                        if(opt == 'no'){
                            this.saveTicket('no')
                        }

                        // //console.log("updateServiceTotal", this.state.totaltax)
                    })
                }
            })
        }       
    }


    calculateTotal(){ 
        this.updateServiceTotal(0, ''); 
    }

    cancelServices(index, service){
        this.setState({ticketserviecloseAlert_Open: true})
    }

    handleTicketServiceAlert(){ 
 
        var services = this.state.services_taken;
        services.splice(this.state.selectedRowServiceindex,1)


      
        this.setState({services_taken: services, ticketserviecloseAlert_Open: false}, function(){
          
            if(this.state.services_taken.length===0){
                this.setState({tipsdiscountEnabled: true})
            }
            this.setState({selectedRowServiceindex: -1});
            this.calculateTotal();
        })
    }

    handleCloseTicketServiceAlert() {
        this.setState({ticketserviecloseAlert_Open: false})
    }

    handlechangeEmp(id,e){   
        var customer_services = this.state.services_taken;
        customer_services[this.state.selectedRowServiceindex].employee_id =  id;
        this.setState({services_taken:customer_services})  
    }
    
    handleSpecialrequest(){ 
        var customer_services = this.state.services_taken;
        customer_services[this.state.selectedRowServiceindex].isSpecialRequest =  1;
        this.setState({services_taken:customer_services, ticketrequestAlert_Open:false})  

        // //console.log("handleSpecialrequest::", this.state.services_taken)
    }

    makeSpecialRequest(){ 
        if(this.state.selectedRowService.isSpecialRequest !== 1)
            this.setState({ticketrequestAlert_Open: true});
        else    
            this.handleSpecialrequest();
    }

    getMenuFunction(id){
        this.setState({menu_selected_id: id});
        if(id === 5){
            console.log("splite", this.state.selectedRowService)
            if(this.state.selectedRowService.perunit_cost <=0.05) {
                this.setState({disableerror:'You cannot split this item'})
            }
            else {
                if(this.state.clockin_emp_list.length <= 1) {
                    this.setState({disableerror:'There is no other clocked-in employees.'})
                }
                 
                else{ 
                    this.setState({disableerror:''})
                }
            }
           
        } 
        //Transfer service
        if(id === 1){
            this.getOpenTickets();
            // this.setState({transferpopup:true,isQuantityPrice_Show : false,isChangePrice_Show : false,isAddTax_Show: false,isEmpList_Show: true,isDiscount_show: false, isSpecialRequest_block:false})
        } 
        //Change Price 
        //void Item
        else if(id === 4){
            this.cancelServices('',this.state.selectedRowService.service);
        }

        //Request
        else if(id ===6){
            this.makeSpecialRequest();
        }  

        else if(id === 9){
            this.setState({selectedRowServiceindex: -1, menu_selected_id:-1})
        }
    } 
    updateServiceQuantity(){

    }
    handlekeypress(e){
        if(e.key == 'e'  || e.key == "+" || e.key == "-" || !RegExp("[0-9]+([\.][0-9]+)?").test(e.target.value)){
            e.preventDefault();
        }
        if(e.key == "."  && (e.target.value=="" || e.target.value.length==0) ) {
            e.preventDefault();
           
        }
    }
    handlechangeService_price(e){ 

        // //console.log("handlechangeService_price::",e.target.value.match( "^.{"+config.inputnumber+","+config.inputnumber+"}$"))

        if((e.target.value.match( "^.{"+7+","+7+"}$")===null)) {
            var service = this.state.services_taken[this.state.selectedRowServiceindex];
            service.perunit_cost = e.target.value >=1 ? e.target.value : '';
            service.subtotal = service.qty*service.perunit_cost;
            var services = this.state.services_taken;
            services[this.state.selectedRowServiceindex] = service;
            this.setState({services_taken: services, selectedRowService:service},  ()=>{
                this.calculateTotal()
            }); 
        }

        
    }    
    
    handleClosePopup(){
        ////console.log("7.afterFinished")
        this.saveTicket('');
        this.props.afterFinished('dashboard')
        // this.props.afterSubmit('');
    }
    

    getClockInEmp(){
        var clockin_emp=[];
        let emp = this.state.employee_list.filter(item => item.clocked_status  !== null && item.clocked_status.toLowerCase() === 'Clock-in'.toLowerCase() && item.staff_role !== 'SA');
        ////console.log(emp);
            this.setState({clockin_emp_list :emp});
      
    }

    handleTicketPayment(){
        
        this.setState({isLoading: true})
       if(this.state.isEdit){
           var detail = Object.assign({}, this.state.ticketSelected);
           detail["ticketref_id"] = detail.sync_id;
           this.saveTicket('savepay')
            this.setState({openPayment:true,ticketDetail:detail,isLoading: false})
       }
       else{
           this.saveTicket('savepay')
       }
    }

    handleClosePayment(msg){
        ////////console.log"after submit")
        if(msg === ''){
            ////////console.log"if",msg)
            this.setState({openPayment:false})
        }else{
             ////////console.log"else",msg)
             ////console.log("8.afterFinished")
            this.props.afterFinished('dashboard')
        }
        
    }
    
    handleCloseTips(msg,tipsInput){
        //////console.log(tipsInput);
        if(this.props.ticketSelected !== undefined) {
            //////console.log("iffffff")
            if(this.props.ticketSelected.paid_status === "paid") {
             
                this.setState({addTips_popup: false, isDisable: true,isDisablePay:true});
                if(tipsInput !== undefined){
                    if(tipsInput["tips_type"] !== undefined){ 
                        this.setState({services_taken:tipsInput["service_selected"],
                        tips_type:tipsInput["tips_type"], tips_totalamt:tipsInput["tips_amount"], tips_percent: tipsInput["tips_percent"], addTips_popup:false}, function(){
                        
                    //console.log(this.state.services_taken);
                            this.calculateTotal();
                            setTimeout(()=>{

                                //////console.log("to be saved")
                                this.saveTicket('no')
                            },200)

                        }); 
                    }
                }
            }
            else{

                this.setState({addTips_popup: false});
                if(tipsInput !== undefined){
                    if(tipsInput["tips_type"] !== undefined){ 
                        this.setState({services_taken:tipsInput["service_selected"],
                        tips_type:tipsInput["tips_type"], tips_totalamt:tipsInput["tips_amount"], tips_percent: tipsInput["tips_percent"], addTips_popup:false}, function(){
                            
                            //console.log(this.state.services_taken);
                            this.calculateTotal(); 

                        }); 
                    }
                }
            }
 
        }

        else {
            //////console.log("elseee")
            this.setState({addTips_popup: false, isDisable: false,isDisablePay:false});
            if(tipsInput["tips_type"] !== undefined){ 
                this.setState({services_taken:tipsInput["service_selected"],
                 tips_type:tipsInput["tips_type"], tips_totalamt:tipsInput["tips_amount"], tips_percent: tipsInput["tips_percent"], addTips_popup:false}, function(){ 
                      this.calculateTotal();
                }); 
            }
        }

       
     }

     handleCloseDiscounts(msg,disInput, opt){

       ////console.log(opt, msg);

         if(msg !== undefined){
            if(opt === ''){
                this.setState({addDiscount_popup: false, 
                    isDisable: false,isDisablePay: false});
             }
             else{
                this.setState({selected_discount : disInput.dis_selected.id});
                var obj = {
                    discount_id: disInput.dis_selected.id||0,
                    discount_type: disInput.dis_selected.discount_type||'',
                    discount_value: disInput.dis_selected.discount_value||0,
                    discount_totalamt: disInput.discount_value||0
                }
                this.setState({ 
                    total_discount:  disInput.discount_value,
                    grandTotal: disInput.ticket_with_discount,
                    discount_id: disInput.dis_selected.id,
                    discount_type: disInput.dis_selected.discount_type,
                    discount_value: disInput.dis_selected.discount_value,
                    discount_totalamt: disInput.discount_value,
                    ticket_discount_selected:obj
                 }, ()=>{
                    console.log("handleCloseDiscounts",msg,disInput, this.state)
                     ////console.log(this.state.ticket_discount_selected)
                     this.calculateTotal();
                 });
             }
         }
         else  {
            this.setState({addDiscount_popup: false, 
                isDisable: false,isDisablePay: false});
         }  
     }


    updateTicketService(serviceinput){ 
        var new_input = {};
        var service_data ={};
        new_input['id'] = serviceinput.servicedetail.uniquId;//data[0].id;
        new_input['isActive'] = 1;
        new_input['updated_at'] =  Moment().format('YYYY-MM-DDTHH:mm:ss');
        new_input["updated_by"] = this.state.employeedetail.id;
        new_input['ticket_id'] = this.state.ticketSelected.id;
        new_input["employee_id"] = serviceinput.servicedetail.employee_id;
        new_input["service_cost"] = serviceinput.qty * serviceinput.perunit_cost;
        new_input["service_quantity"] = serviceinput.qty;
        new_input["istax_selected"] = 0;
        new_input["tips_amount"] = serviceinput.tips_amount !== undefined ? serviceinput.tips_amount : 0;
        new_input["discount_id"] = serviceinput.discount.discount_id !== undefined ? serviceinput.discount.discount_id : 0;
        new_input["discount_type"] = serviceinput.discount.discount_type !== undefined ? serviceinput.discount.discount_type : 0;
        new_input["discount_value"] = serviceinput.discount.discount_value !== undefined ? serviceinput.discount.discount_value : 0;
        new_input["total_discount_amount"] = serviceinput.discountamount;
        new_input["isSpecialRequest"] = serviceinput.isSpecialRequest !== undefined ? serviceinput.isSpecialRequest : 0;
        new_input["isActive"] = 1;
        //console.log("2a.updateTicketService", new_input)
        this.state.createTicketDataManager.updateTicketService("1",new_input).then(res=>{
            var udetail = window.localStorage.getItem('employeedetail');
                var userdetail = {id:0};
                if (udetail !== undefined && udetail !== null) {
                    userdetail = JSON.parse(udetail);
                }
                var requestnotes = serviceinput.requestNotes; 
                var input={
                    notes:requestnotes || '',
                    ticket_id:this.state.ticketSelected.id,
                    service_id:serviceinput.servicedetail.id,
                    addedby:userdetail.id,
                    isActive:1
                } 
                if(serviceinput.servicedetail.notesid !== undefined && serviceinput.servicedetail.notesid !== null&& serviceinput.servicedetail.notesid !== 1){
                    input["id"] = serviceinput.servicedetail.notesid;
                } 
                window.api.getSyncUniqueId().then(syun=>{
                    input["sync_id"] = syun.syncid;
                    input["sync_status"] =0 ;
                    this.state.createTicketDataManager.saveTicketServiceNotes(input).then(res=>{
                        service_data['insertId'] = serviceinput.servicedetail.uniquId ;  
                        this.saveEmpCommission(new_input,service_data, -1, this.state.ticketSelected.id)
                    })
                })
        }) 
    }
    
    saveTicket(option){
        var businessdetail = {}
        var isemp = false
        var  detail = window.localStorage.getItem('businessdetail');
        this.setState({isLoading: true});
        if(detail !== undefined && detail !== 'undefined'){
            businessdetail = JSON.parse(detail);
            if(this.state.isEdit && option !== "empty ticket"){
                var update_input = {
                    id: this.state.ticketSelected.id,
                    ticket_code : this.state.ticketCode,
                    technician_id : this.state.technician_id,
                    customer_id : this.state.customer_detail.id,
                    businessId : businessdetail["id"],
                    subtotal: this.state.totalamount,
                    total_tax: this.state.totaltax,
                    grand_total: this.state.grandTotal,
                    discount_id:this.state.discount_id !== undefined ? this.state.discount_id : 0,
                    discount_type:this.state.discount_type!== undefined ? this.state.discount_type : 0,
                    discount_value:this.state.discount_value !== undefined ? this.state.discount_value : 0,
                    discount_totalamt:this.state.discount_totalamt, 
                    notes: this.state.notes,
                    updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    updated_by: this.state.employeedetail.id,
                    tips_totalamt:this.state.tips_totalamt,
                    tips_type:this.state.tips_type,
                    tips_percent:this.state.tips_percent,
                    sync_id: this.state.ticketref_id,
                    sync_status: 0
                }
                console.log("###########################################")
               console.log(update_input)
               console.log("###########################################")
               this.ticketController.updateData({table_name:'ticket', data:update_input ,query_field: 'sync_id', query_value:update_input.sync_id}).then(res=>{
                    if(this.state.services_taken.length > 0){ 
                        var obj = Object.assign({}, this.state);
                        if(this.state.ticketSelected.paid_status === 'paid'){ 
                            this.state.dataManager.getData(`select * from ticket_payment where ticketref_id='`+update_input.sync_id+`'`).then(res=>{
                                //console.log("PAYMENT RECORD", res);
                                if(res.length > 0){
                                    var payment_input = { 
                                        paid_at : Moment().format('YYYY-MM-DDTHH:mm:ss'),  
                                        ticket_amt: update_input.grand_total, 
                                        updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        updated_by: this.state.employeedetail.id, 
                                        sync_status:0, 
                                        isActive:1
                                    }  
                                    this.setState({isLoading: false});
                        
                                    this.ticketController.updateData({table_name:'ticket_payment', data:payment_input, query_field: 'sync_id' , query_value:res[0].sync_id}).then((resp)=> {
                                        //console.log("Ticket payment updates")
                                    });
                                }
                            }) 
                        }
                        // else{
                            console.log("SAving ticket calling", obj, update_input.sync_id)
                            this.props.saveTicket(obj, update_input.sync_id)
                        // }

                        if(option!=='no' && option!= "savepay"){
                            ////console.log("1.afterFinished", option)
                            // this.props.saveTicket(obj, update_input.sync_id);
                            this.props.afterFinished('dashboard')
                        }
                    }
               })

            } 
            else{
                window.api.getSyncUniqueId().then(syncres=>{
                    var syncid = syncres.syncid
                    this.setState({ticketref_id: syncid}, ()=>{
                        for(var i=0; i < this.state.services_taken.length; i++){
                            if(this.state.services_taken[i].employee_id === undefined){
                                isemp = false
                            }else{
                                isemp = true
                            }
                        }
                        
                        var ticket_input = {
                            ticket_code : this.state.ticketCode,
                            technician_id: this.state.technician_id,
                            customer_id : this.state.customer_detail.id || '' ,
                            businessId : businessdetail["id"],
                            subtotal: this.state.totalamount,
                            total_tax: this.state.totaltax,
                            discounts: this.state.total_discount,
                            grand_total: this.state.grandTotal,
                            tips_totalamt:this.state.tips_totalamt,
                            tips_type:this.state.tips_type,
                            tips_percent:this.state.tips_percent,
                            discount_id:this.state.discount_id !== undefined ? this.state.discount_id : 0,
                            discount_type:this.state.discount_type!== undefined ? this.state.discount_type : 0,
                            discount_value:this.state.discount_value !== undefined ? this.state.discount_value : 0,
                            discount_totalamt:this.state.discount_totalamt,
                            notes: this.state.notes,
                            created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            sync_id: this.state.ticketref_id,
                            sync_status: 0
                        }

                        if(isemp && option !== "empty ticket"){ 

                            this.ticketController.saveData({table_name:'ticket', data: ticket_input}).then(res=>{
                                var ticketid = ticket_input.sync_id//res[0].id; 
                                var obj = Object.assign({}, this.state); 
                                console.log(ticketid);
                                if(option!=='no' && option !== 'savepay') {  
                                    this.props.saveTicket(obj, ticketid) 
                                    this.props.afterFinished('dashboard'); 
                                }
                                else{ 
                                    this.setState({isLoading: true, }, function(){
                                        this.ticketController.saveTicket(obj, ticketid).then(res=>{
                                            this.saveNext('savepay', ticketid, businessdetail); 
                                            this.setState({isLoading: false});
                                        })
                                    });
                                }
                            }); 
                        }
                        else{
                            if(option === "empty ticket") {
                                ticket_input["isDelete"] = 1
                                this.ticketController.saveData({table_name:'ticket', data: ticket_input}).then(res=>{
                                    var ticketid = res[0].id; 
                                    var obj = Object.assign({}, this.state); 
                                    this.props.saveTicket(obj, ticketid) 
                                    this.props.afterFinished('dashboard'); 
                                });
    
                            }
                            else {
                                this.setState({ticketref_id: ''}, ()=>{
                                    this.setState({snackbarOpen:true}) 
                                });
                            }
                            this.setState({isLoading: false});
                          
                        }    
                    })
                })
            }
            
        }
    }


    saveNext(option, ticketid, businessdetail){
        var thisobj = this;
        if(option === 'savepay'){
            var payment_input = {
                id: ticketid,
                ticketref_id: this.state.ticketref_id,
                ticket_code : this.state.ticketCode,
                technician_id: this.state.technician_id,
                customer_id : this.state.customer_detail.id,
                businessId : businessdetail["id"],
                subtotal: this.state.totalamount,
                total_tax: this.state.totaltax,
                discounts: this.state.total_discount,
                grand_total: this.state.grandTotal,
                tips_totalamt:this.state.tips_totalamt,
                tips_type:this.state.tips_type,
                tips_percent:this.state.tips_percent,
                discount_id:this.state.discount_id,
                discount_type:this.state.discount_type,
                discount_value:this.state.discount_value,
                discount_totalamt:this.state.discount_totalamt,
                notes: this.state.notes,
                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                created_by: this.state.employeedetail.id,
                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                updated_by: this.state.employeedetail.id
            } 
            this.setState({openPayment:true,ticketDetail: payment_input,isEdit: true,isDisablePay: false,ticketSelected: payment_input, isLoading: false}); 
        } 
    }  

    saveTicketServiceData(i, ticketid, option){ 
        //console.log("saveTicketServiceData") 


        if(i < this.state.services_taken.length){ 
            var service_input = {
                ticket_id: ticketid,
                service_id: this.state.services_taken[i].servicedetail.id,
                employee_id: this.state.services_taken[i].employee_id,
                service_cost:  this.state.services_taken[i].subtotal,
                service_quantity: this.state.services_taken[i].qty,
                perunit_cost:this.state.services_taken[i].perunit_cost,
                istax_selected: 0, 
                discount_id: this.state.services_taken[i].discount.discount_id !== undefined ? this.state.services_taken[i].discount.discount_id : 0,
                discount_type: this.state.services_taken[i].discount.discount_type !== undefined ? this.state.services_taken[i].discount.discount_type : 0,
                discount_value: this.state.services_taken[i].discount.discount_value !== undefined ? this.state.services_taken[i].discount.discount_value : 0,
                total_discount_amount: this.state.services_taken[i].discountamount,
                tips_amount: this.state.services_taken[i].tips_amount !== undefined ? this.state.services_taken[i].tips_amount : 0, 
                isActive: 1,
                isSpecialRequest:this.state.services_taken[i].isSpecialRequest !== undefined ? this.state.services_taken[i].isSpecialRequest : 0, 
                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                created_by: this.state.employeedetail.id,
                process:this.state.services_taken[i].process !== undefined ? this.state.services_taken[i].process : '',
                previousticketid:this.state.services_taken[i].previousticketid !== undefined ? this.state.services_taken[i].previousticketid : '',
                ticketref_id: this.state.ticketref_id
            } 

            //console.log("saveTicketServiceData",service_input) 

            this.state.createTicketDataManager.saveTicketService( service_input).then(res=>{ 
             
                var udetail = window.localStorage.getItem('employeedetail');
                var userdetail = {id:0};
                if (udetail !== undefined && udetail !== null) {
                    userdetail = JSON.parse(udetail);
                } 
                var selectedservice = this.state.services_taken[i];
                this.saveTaxes(ticketid, res[0].id,selectedservice, 0)
                var requestnotes = this.state.services_taken[i].requestNotes; 
                var input={
                    notes:requestnotes || '',
                    ticket_id:ticketid,
                    service_id:this.state.services_taken[i].id,
                    addedby:userdetail.id,
                    isActive:1
                } 
                window.api.getSyncUniqueId().then(syun=>{
                    input["sync_id"] = syun.syncid;
                    input["sync_status"] =0 ;
                    this.state.createTicketDataManager.saveTicketServiceNotes(input).then(res1=>{
                    //////console.log("service input 2", res);
                    var service_data = {
                        insertId: res[0].id
                    }
                    this.saveEmpCommission(service_input,service_data, i , ticketid, option);
                    
                    })
                });
            })
        }
        else{ 
        //     // const sql = "select * from ticket_services where ticket_id = "+"'"+ticketid+"'"
        //     // // ////////console.log"afrer service sql",sql)
        //     // this.state.dataManager.getData(sql).then(response =>{
        //     //     // ////////console.log"afrer service api",response)

        //     // })


            if(option!=='no' && option!= "savepay"){
            ////console.log("1.afterFinished", option)
                this.props.afterFinished('dashboard')
            }
        }
    }

    saveTaxes(ticketid, tsid,selectedservice,service_input, idx){
        console.log("TAX LENGETH create ticket", selectedservice)
        if(idx < selectedservice.taxes.length){ 
            var t = selectedservice.taxes[idx];
            var taxinput = {
                ticket_id : ticketid,
                ticketservice_id: tsid,
                tax_id: t.tax_id,
                tax_value: t.tax_value,
                tax_type: t.tax_type,
                tax_calculated: t.tax_calculated,
                isActive: 1  ,
                ticketref_id: service_input.ticketref_id,
                serviceref_id: service_input.sync_id,
                sync_status: 1
            }
            ////console.log(taxinput);
            var thisobj = this;
            window.api.getSyncUniqueId().then(csyn=>{
                taxinput["sync_id"] = csyn.syncid+idx;
                this.ticketController.saveData({table_name: 'ticketservice_taxes', data: taxinput}).then(r=>{
                    thisobj.saveTaxes(ticketid, tsid, selectedservice,service_input, idx+1)
                })
            })
        }  
    }
    saveEmpCommission(service_input,service_data, idx, ticketid,option){
        //////console.log("commission called")
        var businessdetail = {}
        var  detail = window.localStorage.getItem('businessdetail');
        businessdetail = JSON.parse(detail);

        // Service Commission Calculation for Employee & owner for ticket services - Start

        const defsql = "select * from default_commission where businessId =  '"+businessdetail["id"]+"'"
       
        this.state.dataManager.getData(defsql).then(defres =>{ 
            if(defres.length > 0){ 
                const sql = "select * from employee_salary where isActive =1 and  employeeId =  '"+service_input.employee_id+"'"
            
                this.state.dataManager.getData(sql).then(response =>{

                    var owner_percentage = defres[0].owner_percentage;
                    var employee_percentage = defres[0].emp_percentage;
                    let per_amt = 0;
                    if(response.length > 0){  
                        owner_percentage = response[0].owner_percentage;
                        employee_percentage = response[0].employee_percentage;
                    }  
                    let emp = this.state.employee_list.filter(item => item.id === service_input.employee_id);
                    //////console.log(employee_percentage, owner_percentage);
                    //Employee Service Commission Calculation
                    if(emp.length>0) { 
                            per_amt = (employee_percentage/100)* service_input.service_cost;
                            var emp_input = {
                                employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'service',
                                cash_amt: per_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id
                            }
                            //////console.log("emp inpout");
                            //////console.log(emp_input);
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_input).then(res=>{
                                //////console.log("1.saved to saveTicketEmployeeCommission")
                            }) 
                    }
                
                    //Owner Service Commission Calculation
                    per_amt = (owner_percentage/100) * service_input.service_cost;
                    var owner_input = {
                        employeeId: this.state.business_owner.business_owner_id,
                        businessId: businessdetail["id"],
                        // ticket_id: service_input.ticket_id,
                        // ticket_serviceId: service_data.insertId,
                        cash_type_for: 'ownercommission',
                        cash_amt: per_amt,
                        created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        created_by: this.state.employeedetail.id,
                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        updated_by: this.state.employeedetail.id,
                        ticketserviceref_id: service_input.sync_id,
                        ticketref_id: this.state.ticketref_id
                    }
                    //////console.log(owner_input);
                    this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_input).then(res=>{
                        //////console.log("2.saved to owner saveTicketEmployeeCommission")
                    })


                })
            
                //Service Commission Calculation for technician_id for ticket - end

                //Tips Calculation -Start
                if(service_input.tips_amount !== 0 && service_input.tips_amount !== undefined){
                    console.log("TIPS SAVING CREATETICKET::::")
                        console.log(service_input);
                    console.log("TIPS SAVING CREATETICKET::::")
                    window.api.getSyncUniqueId().then(r=>{
                        var tsyncid = r.syncid+idx;
                        
                        var emp_inputelse = {
                            employeeId: service_input.employee_id,
                            businessId: businessdetail["id"],
                            // ticket_id: service_input.ticket_id,
                            // ticket_serviceId: service_data.insertId,
                            cash_type_for: 'tips',
                            cash_amt: service_input.tips_amount,
                            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            ticketref_id: this.state.ticketref_id,
                            ticketserviceref_id: service_input.sync_id,
                            sync_id:tsyncid,
                            sync_status:0
                        }
                    
                        this.ticketController.saveData({table_name:'employee_commission_detail', data: emp_inputelse}).then(r=>{
                            //console.log("4.tips_amount saved to saveTicketEmployeeCommission")
                        })
                        // this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_inputelse).then(res=>{
                        //     ////////console.log"4.tips_amount saved to saveTicketEmployeeCommission")
                        // })
                    })
                }
                //Tips Calculation -End

                //Discount Calculation
                if(service_input.discount_id !== 0){
                    let dis = this.state.discount_list.filter(item => item.id === service_input.discount_id);
                    let dis_amt =0
                    if(dis[0].division_type === 'owner'){
                        if(dis[0].discount_type === 'amount'){
                            dis_amt = dis[0].discount_value
                        }else{
                            dis_amt = (dis[0].discount_value/100)* service_input.service_cost;
                        }
                        var disemp_inputif = {
                            employeeId: this.state.business_owner.business_owner_id,
                            // employeeId: service_input.employee_id,
                            businessId: businessdetail["id"],
                            // ticket_id: service_input.ticket_id,
                            // ticket_serviceId: service_data.insertId,
                            cash_type_for: 'owner-discount',
                            cash_amt: dis_amt,
                            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            ticketserviceref_id: service_input.sync_id,
                            ticketref_id: this.state.ticketref_id
                        }

                        this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_inputif).then(res=>{
                            ////////console.log"5.employee_commission/save/")
                        })
                        
                    }
                    else if(dis[0].division_type === 'employee'){
                        if(dis[0].discount_type === 'amount'){
                            dis_amt = dis[0].discount_value
                        }else{
                            dis_amt = (dis[0].discount_value/100)* service_input.service_cost;
                        }
                        var disemp_inputelse = {
                            employeeId: service_input.employee_id,
                            businessId: businessdetail["id"],
                            // ticket_id: service_input.ticket_id,
                            // ticket_serviceId: service_data.insertId,
                            cash_type_for: 'emp-discount',
                            cash_amt: dis_amt,
                            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            ticketserviceref_id: service_input.sync_id,
                            ticketref_id: this.state.ticketref_id
                        }
                    
                        this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_inputelse).then(res=>{
                            ////////console.log"6.employee_commission/save/")
                        })
                    }
                    else{
                        let owner_division = dis[0].owner_division;
                        let emp_division = dis[0].emp_division;
                        if(dis[0].discount_type === 'amount'){
                            dis_amt = dis[0].discount_value/2;
                            //Owner
                            var owner_dis_inputif = {
                                employeeId: this.state.business_owner.business_owner_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'owner-discount',
                                cash_amt: dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id
                            }
                        
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_dis_inputif).then(res=>{
                                ////////console.log"7.employee_commission/save/")
                            })

                            //Employee
                            var emp_dis_inputif = {
                                employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'emp-discount',
                                cash_amt: dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id
                            }
                        

                            this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_dis_inputif).then(res=>{
                                ////////console.log"8.employee_commission/save/")
                            })

                        }else{
                        let owner_dis_amt = (owner_division/100) * dis[0].discount_value;
                        let emp_dis_amt = (emp_division/100) * dis[0].discount_value;
                        //Owner
                            var owner_per_inputelse = {
                                employeeId: this.state.business_owner.business_owner_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'owner-discount',
                                cash_amt: owner_dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id
                            }
                        
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_per_inputelse).then(res=>{
                                ////////console.log"9.employee_commission/save/")
                            })
                            //Employee
                            var emp_per_inputelse = {
                                employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'emp-discount',
                                cash_amt: emp_dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id
                            }
                        
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_per_inputelse).then(res=>{
                                ////////console.log"10.employee_commission/save/")
                            })

                        }
                    }

                }
            }
            else{   
                    //Employee Service Commission Calculation
                    var input = {
                        employeeId: service_input.employee_id,
                        businessId: businessdetail["id"],
                        // ticket_id: service_input.ticket_id,
                        // ticket_serviceId: service_data.insertId,
                        cash_type_for: 'service',
                        cash_amt: service_input.service_cost,
                        created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        created_by: this.state.employeedetail.id,
                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        updated_by: this.state.employeedetail.id,
                        ticketserviceref_id: service_input.sync_id,
                        ticketref_id: this.state.ticketref_id
                    }
                    //////console.log(input);
                    this.state.createTicketDataManager.saveTicketEmployeeCommission(input).then(res=>{
                        //////console.log("3.saved to saveTicketEmployeeCommission")
                    }) 
            
                //Service Commission Calculation for technician_id for ticket - end

                //Tips Calculation -Start
                if(service_input.tips_amount !== 0){
                    window.api.getSyncUniqueId().then(r=>{
                        var tsyncid = r.syncid+idx

                        var emp_input = {
                            employeeId: service_input.employee_id,
                            businessId: businessdetail["id"],
                            // ticket_id: service_input.ticket_id,
                            // ticket_serviceId: service_data.insertId,
                            cash_type_for: 'tips',
                            cash_amt: service_input.tips_amount,
                            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            ticketref_id: this.state.ticketref_id,
                            ticketserviceref_id: service_input.sync_id,
                            sync_id: tsyncid,
                            sync_status:0
                        }
                    

                        this.ticketController.saveData({table_name:'employee_commission_detail', data: emp_input}).then(r=>{
                            //console.log("4.tips_amount saved to saveTicketEmployeeCommission")
                        })
                    })
                    // this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_input).then(res=>{
                    //     ////////console.log"4.tips_amount saved to saveTicketEmployeeCommission")
                    // })
                }
                //Tips Calculation -End

                //Discount Calculation
                console.log("DISCOUNT CALC", service_input.discount_id)
                if(service_input.discount_id !== 0){
                    let dis = this.state.discount_list.filter(item => item.id === service_input.discount_id);
                    let dis_amt =0
                    if(dis[0].division_type === 'owner'){
                        if(dis[0].discount_type === 'amount'){
                            dis_amt = dis[0].discount_value
                        }else{
                            dis_amt = (dis[0].discount_value/100)* service_input.service_cost;
                        }
                        var disemp_input = {
                            employeeId: this.state.business_owner.business_owner_id,
                            // employeeId: service_input.employee_id,
                            businessId: businessdetail["id"],
                            // ticket_id: service_input.ticket_id,
                            // ticket_serviceId: service_data.insertId,
                            cash_type_for: 'owner-discount',
                            cash_amt: dis_amt,
                            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            ticketserviceref_id: service_input.sync_id,
                            ticketref_id: this.state.ticketref_id
                        }

                        this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_input).then(res=>{
                            console.log("5.employee_commission/save/")
                        })
                        
                    }
                    else if(dis[0].division_type === 'employee'){
                        if(dis[0].discount_type === 'amount'){
                            dis_amt = dis[0].discount_value
                        }else{
                            dis_amt = (dis[0].discount_value/100)* service_input.service_cost;
                        }
                        var disemp_inputelseif = {
                            employeeId: service_input.employee_id,
                            businessId: businessdetail["id"],
                            // ticket_id: service_input.ticket_id,
                            // ticket_serviceId: service_data.insertId,
                            cash_type_for: 'emp-discount',
                            cash_amt: dis_amt,
                            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            ticketserviceref_id: service_input.sync_id,
                            ticketref_id: this.state.ticketref_id
                        }
                    
                        this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_inputelseif).then(res=>{
                            ////////console.log"6.employee_commission/save/")
                        })
                    }
                    else{
                        let owner_division = dis[0].owner_division;
                        let emp_division = dis[0].emp_division;
                        if(dis[0].discount_type === 'amount'){
                            dis_amt = dis[0].discount_value/2;
                            //Owner
                            var owner_dis_input = {
                                employeeId: this.state.business_owner.business_owner_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'owner-discount',
                                cash_amt: dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id
                            }
                        
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_dis_input).then(res=>{
                                ////////console.log"7.employee_commission/save/")
                            })

                            //Employee
                            var emp_dis_input = {
                                employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'emp-discount',
                                cash_amt: dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id
                            }
                        

                            this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_dis_input).then(res=>{
                                ////////console.log"8.employee_commission/save/")
                            })

                        }else{
                        let owner_dis_amt = (owner_division/100) * dis[0].discount_value;
                        let emp_dis_amt = (emp_division/100) * dis[0].discount_value;
                        //Owner
                            var owner_per_input = {
                                employeeId: this.state.business_owner.business_owner_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'owner-discount',
                                cash_amt: owner_dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id,
                                updated_by: this.state.employeedetail.id,
                            }
                        
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_per_input).then(res=>{
                                ////////console.log"9.employee_commission/save/")
                            })
                            //Employee
                            var emp_per_input = {
                                employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: service_input.ticket_id,
                                // ticket_serviceId: service_data.insertId,
                                cash_type_for: 'emp-discount',
                                cash_amt: emp_dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketserviceref_id: service_input.sync_id,
                                ticketref_id: this.state.ticketref_id,
                            }
                        
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_per_input).then(res=>{
                                ////////console.log"10.employee_commission/save/")
                            })

                        }
                    }

                }
            } 
            
            if(idx !== -1){
                this.saveTicketServiceData(idx+1, ticketid, option);
            }
    });
    }


handleCloseCustomer(){
    this.setState( {toggleOpen: false, isSelectCustomerEnabled: false})
}
handleCloseAlert() {
    this.setState( {snackbarOpen: false})
}
handlechangeNotes(e){
    ////////console.log"handlechangeNotes",e)
    this.setState( {notes: e})
}
saveNotes() {
    this.handleCloseAddNotes()
}
addNotes(){
    this.setState( {addNotes_popup: true})
}
handleCloseAddNotes(){
    this.setState( {addNotes_popup: false})
}
addDiscounts(){
    this.setState( {addDiscount_popup: true})
}
handleCloseAddDiscounts(){
    this.setState( {addDiscount_popup: false})
}
addTips(){
    this.setState( {addTips_popup: true})
}
handleCloseAddTips(){
    this.setState( {addTips_popup: false})
}
voidTicket(){
    this.setState({voidalertOpen : true})
}
handleCloseVoidAlert(){
    this.setState({voidalertOpen : false})
}
updateVoidTicket(){

    if(this.state.isEdit){
        var update_input = { 
            isDelete: 1,
            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
            updated_by: this.state.employeedetail.id,
            sync_id:this.state.ticketSelected.sync_id
        }
         
            this.ticketController.updateData({table_name:'ticket', data: update_input, query_field:"sync_id", query_value:this.state.ticketSelected.sync_id}).then(res=>{
            ////////console.log"delete")
            this.handleCloseVoidAlert();
            ////console.log("2.afterFinished")
            this.props.afterFinished('dashboard')
        })
       
    }

    else {
        ////console.log("3.afterFinished")
        this.props.afterFinished('dashboard')
       
    }
}
handleSubmit = (event) => {
    event.preventDefault();
    this.handleCloseCustomer_Dialog();
};

handleDeleteCustomer() {
    this.setState({customer: "",  customer_detail: {}})
}

selectServiceTech(index, e){ 
    var service = this.state.services_taken[index]; 
    if( service.requestNotes === null || service.requestNotes === undefined){
        service["requestNotes"] = '';
    } 

    this.setState({ menu_selected_id: -1, 
         selectedRowService:this.state.services_taken[index], 
         selectedRowServiceindex:index}, function(){  

        })
}

getEmployeeName(id){
    // ////////console.log"getEmployeeName---", this.state.employee_list)
    var empname = '';
    for(var i=0;i<this.state.employee_list.length;i++){


        var obj = this.state.employee_list[i];
        if(obj["id"] === id){
            empname = obj['firstName']+" "+obj['lastName'];
            // ////////console.log"equals")
        }
        // ////////console.log"getEmployeeName---", empname)
    }
    return empname;
}

onSelectCustomer(customer) {
    this.setState({customer: customer.name, isSelectCustomerEnabled: false, customer_detail: customer})

}

selectCustomer() {
    this.setState({isSelectCustomerEnabled: true})
}


// working...
handleOpenTicketAlert(){
    //check techi
    const updatedTech = this.state.selectedTech
    const updatedCust = this.state.customer
    const updateServices  = this.state.services_taken
    if(this.props.ticketSelected !== undefined) {
        if(this.state.isPaidOnOpen){
            this.props.handleCloseDialog('Saved')
        }
        else if(this.props.ticketSelected.paid_status === "paid") {
            ////console.log("4.afterFinished")
            this.props.afterFinished('dashboard')
        }
        else {
            this.saveTicket('');
            ////console.log("5.afterFinished")
            this.props.afterFinished('dashboard')
        }
    }

    else if(updatedTech !==  this.props.owner || updatedCust.length>0 || updateServices.length>0) {
        this.setState({ticketcloseAlert_Open : true});
    }

    else {
        // if(this.state.grandTotal > 0){
            this.saveTicket('');
        // }
        ////////console.log"close create...")
        ////console.log("6.afterFinished")
        this.props.afterFinished('dashboard')
        
    }
}


handleCloseTicketAlert(){
    this.setState({ticketcloseAlert_Open : false});
}


openTechnician() {
    this.setState({isSelectTechnician : true});
    
}

handleCloseTechnician() {
    this.setState({isSelectTechnician : false});
}

onSelectTechnician(tech) {
    // ////////console.log"onSelectTechnician::",tech)
    this.setState({selectedTech: tech,technician_id : tech.id, isSelectTechnician: false})
}


openCustomerDetail() {
    ////////console.log"openCustomerDetail")
    this.setState({isSelectCustomerDetail: true })
}

closeCustomerDetail() {
    this.setState({isSelectCustomerDetail: false})
}

handleCloseSplit(splitted){ 
    if(splitted.length > 0){ 
        var newsplitted =  Object.assign([], splitted);
        var services = Object.assign([], this.state.services_taken);
        services.splice(this.state.selectedRowServiceindex, 1);
        // services.push(...newsplitted)
        newsplitted.forEach((o, i)=>{
            services.push(o);
            if(i == newsplitted.length-1){ 
                this.setState({menu_selected_id:-1,selectedRowService:{}, selectedRowServiceindex: -1,  services_taken:services}, function(){
                    this.calculateTotal();
                });
            }
        })
    }
    else{
        this.setState({menu_selected_id:-1});
    }
}

onCombine(rowdata){
    this.setState({confirmcombine:true,combiningticket:rowdata.row, rowToTransfer:  rowdata.row,  combiningid: rowdata.row.id });
}

combineService(i=0){ 
    ////console.log("cimnbine")
    this.setState({selectedRowServiceindex:0,selectedRowService:this.state.services_taken[0], isLoading:true}, function(){
        this.transferService(false);
    });
}




transferService(value){
    if(this.state.selectedRowService.servicedetail.sync_id !==  undefined){
        var updateinput = { 
            process:this.state.isCombine ? "combine" : "transfer",
            previousticketid:this.state.ticketSelected.id,
            isActive:0,
            ticket_id:this.state.ticketSelected.id,
            sync_status:0
        }
        this.ticketController.updateData({table_name:'ticket_services', data: updateinput, query_field:'sync_id', query_value:this.state.selectedRowService.servicedetail.sync_id}).then(res=>{
            this.state.dataManager.saveData("delete from employee_commission_detail where ticketref_id='"+this.state.selectedRowService.servicedetail.ticketref_id+"' and ticketserviceref_id='"+this.state.selectedRowService.servicedetail.sync_id+"'").then(r=>{
                this.transferTicketService(value);
            })
        });
    } 
    else{
        this.transferTicketService(value);
    }
}

transferTicketService(isVoid){
    console.log("transfer serviuce ticket11111", this.state.selectedRowService);
    this.setState({isLoading:true})
    window.api.getSyncUniqueId().then(syn=>{
        var servicesyncid = syn.syncid;
        var service_input = {
            ticket_id: this.state.rowToTransfer.id,
            service_id: this.state.selectedRowService.servicedetail.service_id,
            employee_id: this.state.selectedRowService.employee_id,
            service_cost:  this.state.selectedRowService.subtotal,
            service_quantity: this.state.selectedRowService.qty, 
            istax_selected:0, 
            discount_id: this.state.selectedRowService.discount.discount_id !==  undefined ? this.state.selectedRowService.discount.discount_id : 0,
            discount_type: this.state.selectedRowService.discount.discount_type !==  undefined ? this.state.selectedRowService.discount.discount_type : 0,
            discount_value: this.state.selectedRowService.discount.discount_value !==  undefined ? this.state.selectedRowService.discount.discount_value : 0,
            total_discount_amount: this.state.selectedRowService.discountamount,
            tips_amount: this.state.selectedRowService.tips_amount !==  undefined ? this.state.selectedRowService.tips_amount : 0, 
            isActive: 1,
            isSpecialRequest:this.state.selectedRowService.isSpecialRequest !==  undefined ? this.state.selectedRowService.isSpecialRequest : 0, 
            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
            created_by: this.state.employeedetail.id, 
            process:this.state.isCombine ? "combine": "transfer",
            previousticketid:this.state.ticketSelected.id,
            tips_amount: this.state.selectedRowService.tips_amount !==  undefined ? this.state.selectedRowService.tips_amount : 0, 
            ticketref_id: this.state.rowToTransfer.sync_id,
            sync_id: this.state.selectedRowService.servicedetail.sync_id,
            sync_status:0,
            perunit_cost: this.state.selectedRowService.perunit_cost,
            sync_id: servicesyncid
        }  
        
        var serviceprice = this.state.selectedRowService.subtotal + this.state.selectedRowService.taxamount  - this.state.selectedRowService.discountamount; 

        if(this.state.ticketSelected.sync_id !== undefined){
            var existupdate_input = { 
                subtotal: Number(this.state.ticketSelected.subtotal)-this.state.selectedRowService.subtotal ,
                total_tax: this.state.selectedRowService.taxamount,
                grand_total: Number(this.state.ticketSelected.grand_total)-serviceprice , 
                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                updated_by: this.state.employeedetail.id,
                sync_id:this.state.ticketSelected.sync_id,
                sync_status:0
            }
            this.ticketController.updateData({table_name:'ticket', data:existupdate_input, query_field:'sync_id', query_value:this.state.ticketSelected.sync_id});
        }

        var update_input = {
            id: this.state.rowToTransfer.id, 
            subtotal: Number(this.state.rowToTransfer.subtotal)+this.state.selectedRowService.subtotal - this.state.selectedRowService.discountamount,
            total_tax: Number(this.state.rowToTransfer.total_tax)+this.state.selectedRowService.taxamount,
            grand_total: Number(this.state.rowToTransfer.grand_total)+serviceprice ,
            discount_id:this.state.rowToTransfer.discount_id,
            discounts: this.state.rowToTransfer.discounts,
            discount_type:this.state.rowToTransfer.discount_type,
            discount_value:this.state.rowToTransfer.discount_value, 
            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
            updated_by: this.state.employeedetail.id,
            sync_id:this.state.rowToTransfer.sync_id,
            sync_status:0
        }    
        //console.log(update_input);
        if(update_input.discount_type === 'percentage'){
            update_input["discount_totalamt"] = update_input["subtotal"] * (update_input["discount_value"]/100);
            update_input["discounts"] = update_input["discount_totalamt"];
            update_input["grand_total"] =   update_input["subtotal"] - update_input["discount_totalamt"] + this.state.selectedRowService.taxamount + this.state.rowToTransfer.total_tax ;
        }

        var thisobj  = this;  
        // ////console.log(service_input);
        // ////console.log(this.state.selectedRowService.service);
        //console.log("UPDATE INPUT TICKET ::::::::")
        //console.log(update_input);
        //console.log("UPDATE INPUT TICKET ::::::::")
        this.state.createTicketDataManager.saveTicketService( service_input).then(res=>{ 
            // //console.log("1");
            var udetail = window.localStorage.getItem('employeedetail');
            var userdetail = {id:0};
            var service_data = {
                insertId: res[0].id
            } 
            if (udetail !== undefined && udetail !== null) {
                userdetail = JSON.parse(udetail);
            }   
            // //console.log("2");
            window.api.getSyncUniqueId().then(csync=>{
                // //console.log("3");
                var csyncid = csync.syncid;

                    thisobj.state.createTicketDataManager.updateTicketTransfer(update_input).then(tres=>{ 
                        
                        // //console.log("4");
                        var selectedservice = Object.assign({}, this.state.selectedRowService);
                        selectedservice.servicedetail.sync_id = servicesyncid;
                        this.setState({selectedRowService: selectedservice}, ()=>{
                            this.saveTaxes(service_input.ticket_id,service_data.insertId, selectedservice,service_input, 0 );
                            var requestnotes = thisobj.state.selectedRowService.requestNotes; 
                            if(requestnotes !==  undefined && requestnotes !==  ''){
                                var input={
                                    notes:requestnotes || '',
                                    ticket_id:thisobj.state.rowToTransfer.id,
                                    service_id:thisobj.state.selectedRowService.servicedetail.service_id,
                                    addedby:userdetail.id,
                                    ticketref_id: service_input.ticketref_id,
                                    serviceref_id: service_input.sync_id,
                                    sync_status:0,
                                    isActive:1,
                                } 
                                // //console.log("5");
        
                                window.api.getSyncUniqueId().then(syun=>{
                                    input["sync_id"] = syun.syncid;
                                    input["sync_status"] =0 ;
                                        thisobj.state.createTicketDataManager.saveTicketServiceNotes(input).then(res1=>{
                                        })
                                    });
                            } 
                            var businessdetail = {}
                            var  detail = window.localStorage.getItem('businessdetail');
                            businessdetail = JSON.parse(detail);
        
                            // Service Commission Calculation for Employee & owner for ticket services - Start
        
                            const defsql = "select * from default_commission where businessId = '"+businessdetail["id"]+"'"
                        
                            thisobj.state.dataManager.getData(defsql).then(defres =>{
                                //console.log("6");
                                //console.log("defres", defres);
                                if(defres.length > 0){ 
                                    const sql = "select * from employee_salary where isActive =1 and  employeeId = '"+service_input.employee_id+"'"
                                
                                    thisobj.state.dataManager.getData(sql).then(response =>{
                                        //console.log("7");
                                        var owner_percentage = defres[0].owner_percentage;
                                        var employee_percentage = defres[0].emp_percentage;
                                        let per_amt = 0;
                                        if(response.length > 0){  
                                            owner_percentage = response[0].owner_percentage;
                                            employee_percentage = response[0].employee_percentage;
                                        }  
                                        let emp = thisobj.state.employee_list.filter(item => item.id === service_input.employee_id); 
                                        //Employee Service Commission Calculation
                                        if(emp.length>0) { 
                                                per_amt = (employee_percentage/100)* service_input.service_cost;
                                                var emp_input = {
                                                    employeeId: service_input.employee_id,
                                                    businessId: businessdetail["id"],
                                                    ticket_id: service_input.ticket_id,
                                                    ticket_serviceId: service_data.insertId,
                                                    cash_type_for: 'service',
                                                    cash_amt: per_amt,
                                                    created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                    created_by: this.state.employeedetail.id,
                                                    updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                    updated_by: this.state.employeedetail.id,
                                                    ticketref_id: service_input.ticketref_id,
                                                    ticketserviceref_id: service_input.sync_id,
                                                    sync_status:0,
                                                    sync_id:csyncid+"service"
                                                }
                                                //////console.log("emp inpout");
                                                //////console.log(emp_input);
                                                //console.log("8");
                                                thisobj.state.createTicketDataManager.saveTicketEmployeeCommission(emp_input).then(res=>{
                                                    //////console.log("1.saved to saveTicketEmployeeCommission empinput")
                                                    //console.log("9");
                                    
                                                    //Owner Service Commission Calculation
                                                    per_amt = (owner_percentage/100) * service_input.service_cost;
                                                    var owner_input = {
                                                        employeeId: thisobj.state.business_owner.business_owner_id,
                                                        businessId: businessdetail["id"],
                                                        ticket_id: service_input.ticket_id,
                                                        ticket_serviceId: service_data.insertId,
                                                        cash_type_for: 'ownercommission',
                                                        cash_amt: per_amt,
                                                        created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                        created_by: thisobj.state.employeedetail.id,
                                                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                        updated_by: thisobj.state.employeedetail.id,
                                                        ticketref_id: service_input.ticketref_id,
                                                        ticketserviceref_id: service_input.sync_id,
                                                        sync_status:0,
                                                        sync_id:csyncid+"ownercommission"
                                                    } 
                                                    //////console.log("1.saved to saveTicketEmployeeCommission owner input called")
                                                    thisobj.state.createTicketDataManager.saveTicketEmployeeCommission(owner_input).then(res=>{
                                                        //////console.log("1.saved to saveTicketEmployeeCommission owner input ended")
                                                        //Tips Calculation -Start
                                                        //console.log("10");
                                                        if(service_input.tips_amount !== 0){
                                                            var emp_input = {
                                                                employeeId: service_input.employee_id,
                                                                businessId: businessdetail["id"],
                                                                ticket_id: service_input.ticket_id,
                                                                ticket_serviceId: service_data.insertId,
                                                                cash_type_for: 'tips',
                                                                cash_amt: service_input.tips_amount,
                                                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                created_by: thisobj.state.employeedetail.id,
                                                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                updated_by: thisobj.state.employeedetail.id,
                                                                ticketref_id: service_input.ticketref_id,
                                                                ticketserviceref_id: service_input.sync_id,
                                                                sync_status:0,
                                                                sync_id:csyncid+"tips"+this.state.selectedRowServiceindex
                                                            }
                                                        
                                
                                                            thisobj.state.createTicketDataManager.saveTicketEmployeeCommission(emp_input).then(res=>{
                                                                //////console.log("1.saved to saveTicketEmployeeCommission tips input")
                        
                                                                thisobj.discountCalculation(businessdetail, service_input, service_data, isVoid)
                                                            })
                                                        }
                                                        else{
                                                            thisobj.discountCalculation(businessdetail, service_input, service_data, isVoid)
                                                        }
                                                        //Tips Calculation -End
                                                    })
                                                }) 
                                        }
        
        
                                    }) 
                                    //Service Commission Calculation for technician_id for ticket - end
        
                                }
                                else{   
                                        //Employee Service Commission Calculation
                                        var input = {
                                            employeeId: service_input.employee_id,
                                            businessId: businessdetail["id"],
                                            ticket_id: service_input.ticket_id,
                                            ticket_serviceId: service_data.insertId,
                                            cash_type_for: 'service',
                                            cash_amt: service_input.service_cost,
                                            created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            created_by: thisobj.state.employeedetail.id,
                                            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            updated_by: thisobj.state.employeedetail.id,
                                            ticketref_id: service_input.ticketref_id,
                                            ticketserviceref_id: service_input.sync_id,
                                            sync_status:0,
                                            sync_id:csyncid+"service"
                                        }
                                        //console.log("else emp service commission caled");
                                        //console.log("10");
                                        thisobj.ticketController.saveData({table_name:'employee_commission_detail', data:input}).then(res=>{
                                            //console.log("else emp service commission ended", res);
                                            //Tips Calculation -Start
                                            //console.log("11");
                                            if(service_input.tips_amount !== 0){
                                                var emp_input = {
                                                    employeeId: service_input.employee_id,
                                                    businessId: businessdetail["id"],
                                                    ticket_id: service_input.ticket_id,
                                                    ticket_serviceId: service_data.insertId,
                                                    cash_type_for: 'tips',
                                                    cash_amt: service_input.tips_amount,
                                                    created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                    created_by: thisobj.state.employeedetail.id,
                                                    updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                    updated_by: thisobj.state.employeedetail.id,
                                                    ticketref_id: service_input.ticketref_id,
                                                    ticketserviceref_id: service_input.sync_id,
                                                    sync_status:0,
                                                    sync_id:csyncid+"tips"+this.state.selectedRowServiceindex
                                                }
                                            
                                                //console.log("11..1");
                                                thisobj.state.createTicketDataManager.saveTicketEmployeeCommission(emp_input).then(res=>{
                                                    //console.log("11..2");
                                                    thisobj.discountCalculation(businessdetail, service_input, service_data, isVoid)
                                                })
                                            }
        
                                            else {
                                                thisobj.discountCalculation(businessdetail, service_input, service_data, isVoid)
                                            }
                                            //Tips Calculation -End
        
                                            // //console.log("12");
                                        }) 
                                
                                    //Service Commission Calculation for technician_id for ticket - end
        
        
                                }  
                            });
                        })
                    });
            })

        }) 

        
            
    })

}

discountCalculation(businessdetail, service_input, service_data, isVoid){
//console.log("Discount calculation called");
                    //Discount Calculation
        window.api.getSyncUniqueId().then(csyn=>{
            var csyncid = csyn.syncid;
                    if(service_input.discount_id !== 0){
                        let dis = this.state.discount_list.filter(item => item.id === service_input.discount_id);
                        let dis_amt =0
                        if(dis[0].division_type === 'owner'){
                            if(dis[0].discount_type === 'amount'){
                                dis_amt = dis[0].discount_value
                            }else{
                                dis_amt = (dis[0].discount_value/100)* service_input.service_cost;
                            }
                            var disemp_input = {
                                employeeId: this.state.business_owner.business_owner_id,
                                // employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                ticket_id: service_input.ticket_id,
                                ticket_serviceId: service_data.insertId,
                                cash_type_for: 'owner-discount',
                                cash_amt: dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketref_id: service_input.ticketref_id,
                                ticketserviceref_id: service_input.sync_id,
                                sync_status:0,
                                sync_id:csyncid+"ownerdiscount"
                            }

                            this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_input).then(res=>{
                               this.TicketdiscountCalculation(businessdetail, service_input, service_data, isVoid)
                            })
                            
                        }
                        else if(dis[0].division_type === 'employee'){
                            if(dis[0].discount_type === 'amount'){
                                dis_amt = dis[0].discount_value
                            }else{
                                dis_amt = (dis[0].discount_value/100)* service_input.service_cost;
                            }
                            var disemp_input1 = {
                                employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                ticket_id: service_input.ticket_id,
                                ticket_serviceId: service_data.insertId,
                                cash_type_for: 'emp-discount',
                                cash_amt: dis_amt,
                                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: this.state.employeedetail.id,
                                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: this.state.employeedetail.id,
                                ticketref_id: service_input.ticketref_id,
                                ticketserviceref_id: service_input.sync_id,
                                sync_status:0,
                                sync_id:csyncid+"empdiscount"
                            }
                        
                            this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_input1).then(res=>{
                                this.TicketdiscountCalculation(businessdetail, service_input, service_data, isVoid)
                            })
                        }
                        else{
                            let owner_division = dis[0].owner_division;
                            let emp_division = dis[0].emp_division;

                            var owner_dis_amt = (owner_division/100) * (dis[0].discount_value/100);
                            var emp_dis_amt = (emp_division/100) * (dis[0].discount_value/100);

                            if(dis[0].discount_type === 'amount'){
                                dis_amt = owner_dis_amt;
                                //Owner
                                var owner_dis_input = {
                                    employeeId: this.state.business_owner.business_owner_id,
                                    businessId: businessdetail["id"],
                                    ticket_id: service_input.ticket_id,
                                    ticket_serviceId: service_data.insertId,
                                    cash_type_for: 'owner-discount',
                                    cash_amt: dis_amt,
                                    created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    created_by: this.state.employeedetail.id,
                                    updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    updated_by: this.state.employeedetail.id,
                                    ticketref_id: service_input.ticketref_id,
                                    ticketserviceref_id: service_input.sync_id,
                                    sync_status:0,
                                    sync_id:csyncid+"ownerdiscount"
                                }
                            
                                this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_dis_input).then(res=>{ 
                                    //Employee
                                    var emp_dis_input = {
                                        employeeId: service_input.employee_id,
                                        businessId: businessdetail["id"],
                                        ticket_id: service_input.ticket_id,
                                        ticket_serviceId: service_data.insertId,
                                        cash_type_for: 'emp-discount',
                                        cash_amt: emp_dis_amt,
                                        created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        created_by: this.state.employeedetail.id,
                                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        updated_by: this.state.employeedetail.id,
                                        ticketref_id: service_input.ticketref_id,
                                        ticketserviceref_id: service_input.sync_id,
                                        sync_status:0,
                                        sync_id:csyncid+"emp-discount"
                                    }
                                

                                    this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_dis_input).then(res=>{
                                        this.TicketdiscountCalculation(businessdetail, service_input, service_data, isVoid)
                                    })
                                })

                            }
                            else{
                                owner_dis_amt = owner_dis_amt * service_input.service_cost ;
                                emp_dis_amt = emp_dis_amt * service_input.service_cost ;
                            //Owner
                                var owner_per_input = {
                                    employeeId: this.state.business_owner.business_owner_id,
                                    businessId: businessdetail["id"],
                                    ticket_id: service_input.ticket_id,
                                    ticket_serviceId: service_data.insertId,
                                    cash_type_for: 'owneremp-discount',
                                    cash_amt: owner_dis_amt,
                                    created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    created_by: this.state.employeedetail.id,
                                    updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    updated_by: this.state.employeedetail.id,
                                    ticketref_id: service_input.ticketref_id,
                                    ticketserviceref_id: service_input.sync_id,
                                    sync_status:0,
                                    sync_id:csyncid+"ownerempdiscount"
                                }
                            
                                this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_per_input).then(res=>{
                                    //Employee
                                    var emp_per_input = {
                                        employeeId: service_input.employee_id,
                                        businessId: businessdetail["id"],
                                        ticket_id: service_input.ticket_id,
                                        ticket_serviceId: service_data.insertId,
                                        cash_type_for: 'owneremp-discount',
                                        cash_amt: emp_dis_amt,
                                        created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        created_by: this.state.employeedetail.id,
                                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        updated_by: this.state.employeedetail.id,
                                        ticketref_id: service_input.ticketref_id,
                                        ticketserviceref_id: service_input.sync_id,
                                        sync_status:0,
                                        sync_id:csyncid+"owneremp-discountemp"
                                    }
                                
                                    this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_per_input).then(res=>{
                                      this.TicketdiscountCalculation(businessdetail, service_input, service_data, isVoid)
                                    })
                                })

                            }
                        }

                    }
                    else{
                        this.TicketdiscountCalculation(businessdetail, service_input, service_data, isVoid)
                    }
                })
}



TicketdiscountCalculation(businessdetail, service_input, service_data, isVoid){
    //console.log("Ticket Discount calculation called");

    // this.state.dataManager.saveData("delete from employee_commission_detail where ticketref_id='"+service_input.ticketref_id+"'").then(r=>{
                        //Discount Calculation
            window.api.getSyncUniqueId().then(csyn=>{
                var csyncid = csyn.syncid;
                        if(this.state.selected_discount !== 0 && this.state.selected_discount !== ''  && this.state.selected_discount !== undefined){
                            let dis = this.state.discount_list.filter(item => item.id === this.state.selected_discount);
                            let dis_amt = this.state.total_discount;

                            if(dis[0].division_type === 'owner'){ 
                                var disemp_input = {
                                    employeeId: this.state.business_owner.business_owner_id,
                                    // employeeId: service_input.employee_id,
                                    businessId: businessdetail["id"],
                                    ticket_id: service_input.ticket_id,
                                    ticket_serviceId: service_data.insertId,
                                    cash_type_for: 'owner-discount',
                                    cash_amt: dis_amt,
                                    created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    created_by: this.state.employeedetail.id,
                                    updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    updated_by: this.state.employeedetail.id,
                                    ticketref_id: service_input.ticketref_id,
                                    ticketserviceref_id: service_input.sync_id,
                                    sync_status:0,
                                    sync_id:csyncid+"ownerdiscount"
                                }
    
                                this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_input).then(res=>{
                                   this.closeTransfer(isVoid);
                                })
                                
                            }
                            else if(dis[0].division_type === 'employee'){ 
                                var disemp_input1 = {
                                    employeeId: service_input.employee_id,
                                    businessId: businessdetail["id"],
                                    ticket_id: service_input.ticket_id,
                                    ticket_serviceId: service_data.insertId,
                                    cash_type_for: 'emp-discount',
                                    cash_amt: dis_amt,
                                    created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    created_by: this.state.employeedetail.id,
                                    updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                    updated_by: this.state.employeedetail.id,
                                    ticketref_id: service_input.ticketref_id,
                                    ticketserviceref_id: service_input.sync_id,
                                    sync_status:0,
                                    sync_id:csyncid+"empdiscount"
                                }
                            
                                this.state.createTicketDataManager.saveTicketEmployeeCommission(disemp_input1).then(res=>{
                                    this.closeTransfer(isVoid)
                                })
                            }
                            else{
                                let owner_division = dis[0].owner_division;
                                let emp_division = dis[0].emp_division;


                                let owner_dis_amt = (owner_division/100) * this.state.total_discount;
                                let emp_dis_amt = (emp_division/100) * this.state.total_discount;

                                if(dis[0].discount_type === 'amount'){
                                    dis_amt = owner_dis_amt;
                                    //Owner
                                    var owner_dis_input = {
                                        employeeId: this.state.business_owner.business_owner_id,
                                        businessId: businessdetail["id"],
                                        ticket_id: this.state.ticketDetail.ticket_id, 
                                        cash_type_for: 'owner-discount',
                                        cash_amt: dis_amt,
                                        created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        created_by: this.state.employeedetail.id,
                                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        updated_by: this.state.employeedetail.id,
                                        ticketref_id:  this.state.ticketDetail.sync_id, 
                                        sync_status:0,
                                        sync_id:csyncid+"ownerdiscount"
                                    }
                                
                                    this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_dis_input).then(res=>{ 
                                        this.saveEmployeeTicketDiscount(isVoid, 0, emp_dis_amt, businessdetail, service_data, csyncid )
                                    })
    
                                }
                                else{
                                //Owner
                                    var owner_per_input = {
                                        employeeId: this.state.business_owner.business_owner_id,
                                        businessId: businessdetail["id"],
                                        ticket_id: service_input.ticket_id,
                                        ticket_serviceId: service_data.insertId,
                                        cash_type_for: 'owneremp-discount',
                                        cash_amt: owner_dis_amt,
                                        created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        created_by: this.state.employeedetail.id,
                                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                        updated_by: this.state.employeedetail.id,
                                        ticketref_id: service_input.ticketref_id,
                                        ticketserviceref_id: service_input.sync_id,
                                        sync_status:0,
                                        sync_id:csyncid+"owneremp-discountowner"
                                    }
                                
                                    this.state.createTicketDataManager.saveTicketEmployeeCommission(owner_per_input).then(res=>{
                                        //Employee
                                        this.saveEmployeeTicketDiscount(isVoid, 0, emp_dis_amt, businessdetail, service_data, csyncid )
                                    })
    
                                }
                            }
    
                        }
                        else{
                            this.closeTransfer(isVoid)
                        }
                    })
                // });
    }


    saveEmployeeTicketDiscount(  isVoid, ei, dis_amt, businessdetail, service_data, csyncid){
        if(ei < this.state.services_taken.length){
            var service_input = Object.assign({}, this.state.services_taken[ei]);
            //Employee
            var emp_dis_input = {
                employeeId: service_input.employee_id,
                businessId: businessdetail["id"],
                ticket_id: service_input.ticket_id,
                ticket_serviceId: service_data.insertId,
                cash_type_for: 'owneremp-discount',
                cash_amt: dis_amt,
                created_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                created_by: this.state.employeedetail.id,
                updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                updated_by: this.state.employeedetail.id,
                ticketref_id: service_input.ticketref_id,
                ticketserviceref_id: service_input.sync_id,
                sync_status:0,
                sync_id:csyncid+"owneremp-discountemp"
            }
        

            this.state.createTicketDataManager.saveTicketEmployeeCommission(emp_dis_input).then(res=>{
                this.saveTicketEmployeeCommission(isVoid, ei+1, dis_amt, businessdetail, service_data, csyncid )
            })
        }
        else{
            this.closeTransfer(isVoid)
        }
    }


closeTransfer(isVoid){

    console.log("closeTransfer called", isVoid);

    if(this.state.isCombine){  


        setTimeout(() => {
            var services = this.state.services_taken;
            services.splice(this.state.selectedRowServiceindex, 1);
            this.setState({services_taken:services, selectedRowServiceindex:-1, selectedRowService:{}}, function(){
                this.setState({confirmcombine:false })
                if(services.length > 0){
                    this.combineService();
                }
                else{ 

                    if(isVoid) {
                        this.voidExistingTicket("from alread existing")
                        // //console.log("after transfer -- to be delete")
                    }
                    
        window.api.invoke('evantcall', 'combine'+JSON.stringify(this.state)).then(r => {

        })
                if(this.state.ticketSelected.id !== undefined){
                    var update_input = {
                        id: this.state.ticketSelected.id,
                        subtotal: 0,
                        total_tax: 0,
                        grand_total: 0,
                        updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        updated_by: this.state.employeedetail.id,
                        isDelete:1,
                        sync_status:0,
                        sync_id:this.state.ticketSelected.sync_id
                    }

                    this.ticketController.updateData({table_name:'ticket', data:update_input, query_field:'sync_id', query_value:this.state.ticketSelected.sync_id}).then(res=>{
                    // this.state.createTicketDataManager.updateTicket(update_input).then(res=>{  
                        this.setState({ticketSelected: this.state.rowToTransfer,isEdit : true}, function(){   
                            
                            var disInput = {};
                            if(this.state.ticketSelected.discount_totalamt !== 0 || this.state.ticketSelected.discount_totalamt !== null){
                                disInput = {
                                    discount_id: this.state.ticketSelected.discount_id,
                                    discount_type: this.state.ticketSelected.discount_type,
                                    discount_value: this.state.ticketSelected.discount_value,
                                    discount_totalamt: this.state.ticketSelected.discount_totalamt,
                                } 
                            }
                            else{
                                disInput = undefined;
                            }
            
                            if(this.state.ticketSelected.paid_status === "paid"){
                                this.setState({ isDisable: true,isDisablePay: true});
                            }else{
                                this.setState({ isDisable: false,isDisablePay: false});
                            } 

                            this.setState({
                                ticketCode:  this.state.ticketSelected.ticket_code, 
                                customer_id: this.state.ticketSelected.customer_id,
                                totaltax: Number(this.state.ticketSelected.total_tax),
                                totalamount: Number(this.state.ticketSelected.subtotal),
                                grandTotal: Number(this.state.ticketSelected.grand_total),
                                technician_id : this.state.ticketSelected.technician_id,
                                tips_totalamt: Number(this.state.ticketSelected.tips_totalamt),
                                tips_percent:Number(this.state.ticketSelected.tips_percent),
                                notes: this.state.ticketSelected.notes,
                                tips_type:this.state.ticketSelected.tips_type,
                                total_discount: this.state.ticketSelected.discounts,
                                discount_id: this.state.ticketSelected.discount_id,
                                discount_type: this.state.ticketSelected.discount_type,
                                discount_value: this.state.ticketSelected.discount_value,
                                discount_totalamt: this.state.ticketSelected.discount_totalamt,
                                ticket_discount_selected: disInput ,
                                selected_discount: disInput.discount_id != undefined? disInput.discount_id : '',
                                ticketref_id: this.state.ticketSelected.sync_id,
                                isLoading:false
                            }, ()=>{
                                console.log("DISCOUNT", this.state);
                                this.calculateTotalandpay();
                            }); 

                            this.setState({isCombine:false,confirmcombine:false, transferpopup:false, isLoading:false}, function(){
                                this.loadTicket();
                            })
                        })
                    });
                }
                else{
                    this.setState({ticketSelected: this.state.rowToTransfer,isEdit : true}, function(){   
                            
                        var disInput = {};
                        if(this.state.ticketSelected.discount_totalamt !== 0 || this.state.ticketSelected.discount_totalamt !== null){
                            disInput = {
                                discount_id: this.state.ticketSelected.discount_id,
                                discount_type: this.state.ticketSelected.discount_type,
                                discount_value: this.state.ticketSelected.discount_value,
                                discount_totalamt: this.state.ticketSelected.discount_totalamt,
                            } 
                        }
                        else{
                            disInput = undefined;
                        }
        
                        if(this.state.ticketSelected.paid_status === "paid"){
                            this.setState({ isDisable: true,isDisablePay: true});
                        }else{
                            this.setState({ isDisable: false,isDisablePay: false});
                        } 

                        this.setState({
                            ticketCode:  this.state.ticketSelected.ticket_code, 
                            customer_id: this.state.ticketSelected.customer_id,
                            totaltax: Number(this.state.ticketSelected.total_tax),
                            totalamount: Number(this.state.ticketSelected.subtotal),
                            grandTotal: Number(this.state.ticketSelected.grand_total),
                            technician_id : this.state.ticketSelected.technician_id,
                            tips_totalamt: Number(this.state.ticketSelected.tips_totalamt),
                            tips_percent:Number(this.state.ticketSelected.tips_percent),
                            notes: this.state.ticketSelected.notes,
                            tips_type:this.state.ticketSelected.tips_type,
                            total_discount: this.state.ticketSelected.discounts,
                            discount_id: this.state.ticketSelected.discount_id,
                            discount_type: this.state.ticketSelected.discount_type,
                            discount_value: this.state.ticketSelected.discount_value,
                            discount_totalamt: this.state.ticketSelected.discount_totalamt,
                            ticket_discount_selected: disInput ,
                            selected_discount: disInput.discount_id != undefined? disInput.discount_id : '',
                            ticketref_id: this.state.ticketSelected.sync_id,
                            isLoading:false
                        }, ()=>{
                            console.log("DISCOUNT", this.state);
                            this.calculateTotalandpay();
                        }); 

                        this.setState({isCombine:false,confirmcombine:false, transferpopup:false, isLoading:false}, function(){
                            this.loadTicket();
                        })
                    })
                }
                }
            })
        }, 1000);
    }
    else{
        setTimeout(() => {
            var services = this.state.services_taken;
            services.splice(this.state.selectedRowServiceindex, 1); 
            this.setState({services_taken:services, selectedRowServiceindex:-1, selectedRowService:{}}, function(){
                    this.setState({confirmtransfer:false,rowToTransfer:{},  open_tickets:[],transferpopup:false, isLoading:false})
                    this.calculateTotalandpay(); 
                    if(isVoid) {
                        this.voidExistingTicket("from alread existing")
                        // //console.log("after transfer -- to be delete")
                    }
            }); 
        }, 1000);
    }
}

loadTicket(){
    console.log("load ticket called");
    var disInput = {};
            if(this.state.ticketSelected.discount_totalamt !== 0 || this.state.ticketSelected.discount_totalamt !== null){
                disInput = {
                    discount_id: this.state.ticketSelected.discount_id,
                    discount_type: this.state.ticketSelected.discount_type,
                    discount_value: this.state.ticketSelected.discount_value,
                    discount_totalamt: this.state.ticketSelected.discount_totalamt,
                }
            }else{
                disInput = undefined;
            }
            this.setState({
                ticketCode:  this.state.ticketSelected.ticket_code, 
                customer_id: this.state.ticketSelected.customer_id,
                totaltax: Number(this.state.ticketSelected.total_tax),
                totalamount: Number(this.state.ticketSelected.subtotal),
                grandTotal: Number(this.state.ticketSelected.grand_total),
                technician_id : this.state.ticketSelected.technician_id,
                tips_totalamt: Number(this.state.ticketSelected.tips_totalamt),
                tips_percent:Number(this.state.ticketSelected.tips_percent),
                notes: this.state.ticketSelected.notes,
                tips_type:this.state.ticketSelected.tips_type,
                total_discount: this.state.ticketSelected.discounts,
                discount_id: this.state.ticketSelected.discount_id,
                discount_type: this.state.ticketSelected.discount_type,
                discount_value: this.state.ticketSelected.discount_value,
                discount_totalamt: this.state.ticketSelected.discount_totalamt,
                ticket_discount_selected: disInput,
                isLoading:false
                
            });
            if(this.state.ticketSelected.customer_id !== null){
                // this.getCustomerDetail(this.state.ticketSelected.customer_id);
            }
            if(this.state.ticketSelected.paid_status === "paid"){
                this.setState({ isDisable: true,isDisablePay: true});
            }else{
                this.setState({ isDisable: false,isDisablePay: false});
            } 
            this.getTicketServices(this.state.ticketSelected.sync_id)
           
            
            var customer_id = this.state.ticketSelected.customer_id
            if(customer_id === 'undefined') {
                customer_id = " "
            }
            const sql = "select * from users where  id =  '"+this.state.ticketSelected.technician_id+"'"
    
            this.state.dataManager.getData(sql).then(response =>{
               
               
                this.setState({ownerTech:  this.props.owner,selectedTech:  response[0], technician_id: this.state.ticketSelected.technician_id}, function(){
                    const sql_cust = "select sync_id as id, member_id, name, email, dob, first_visit, last_visit, visit_count, total_spent, loyality_point, created_at, created_by, updated_at, updated_by, status, phone, businessId, sync_status, sync_id from customers where businessId =  '"+JSON.parse(window.localStorage.getItem('businessdetail'))["id"]+"' and sync_id =  '"+
                    customer_id+"'"
                  
                    this.state.dataManager.getData(sql_cust).then(response =>{
                        if(response.length>0) {
                            this.setState({customers:response,customer_detail: response[0]}, function() {
                            });
                        }
                       
                    })
                });
           
            })  
}


createNewTicketWithTransfer(){ 

    if(this.state.services_taken.length == 1) {
        this.setState({transferAlert:true, newTicket: true})
    }
    else {
        this.createTicketForTransfer(false)
    }


   
}


createTicketForTransfer(toBeDelete) {
    var businessdetail = {} 
    var  detail = window.localStorage.getItem('businessdetail');
    if(detail !== undefined && detail !== 'undefined'){
        businessdetail = JSON.parse(detail);

            window.api.getTicketCode().then(res=>{
                if(res.ticketid !== '' && res.error !== undefined){
                    this.setState({dateerror: true})
                }
                else{
                    window.api.getSyncUniqueId().then(csync=>{
                        var syncid = csync.syncid
                        var ticketid = res.ticketid;
                        if(!this.state.isEdit){
                            ticketid = Number(res.ticketid)+1;
                        }
                        var ticket_input = {
                            ticket_code : String(ticketid).padStart(4, '0'),
                            technician_id: this.state.technician_id,
                            customer_id : this.state.customer_detail.id || '' ,
                            businessId : businessdetail["id"],
                            subtotal: 0,
                            total_tax: 0,
                            discounts: 0,
                            grand_total: 0,
                            tips_totalamt:0,
                            tips_type:0,
                            tips_percent:0,
                            discount_id:0,
                            discount_type:0,
                            discount_value:0,
                            discount_totalamt:0,
                            notes: '',
                            isDelete:0,
                            created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: this.state.employeedetail.id,
                            updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: this.state.employeedetail.id,
                            sync_id: syncid,
                            sync_status:0
                        } 
                        // this.state.createTicketDataManager.saveEditTicket(false, ticket_input).then(res=>{
                            this.ticketController.saveData({table_name:'ticket', data:ticket_input}).then(res=>{
                            const sql = "select t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value,t.sync_id, t.discount_totalamt, t.sync_id, c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.sync_id where t.sync_id = '"+syncid+"'"
                            this.state.dataManager.getData(sql).then(response =>{ 
                                console.log("saveEditcreateTicket:::", sql,response) 
                                this.setState({rowToTransfer: response[0]}, function(){
                                    this.transferService(toBeDelete);
                                });
                            });
                        })  
                    })
                }
            }); 
    }

    // if(toBeDelete) {
    //     this.voidExistingTicket("from new ticket")

    // }
}


ontransfer(rowdata){

    // //console.log("ontransfer:::",this.state.services_taken.length)
    if(this.state.services_taken.length == 1) {
        this.setState({transferAlert:true, rowToTransfer:rowdata.row})
    }
    else {
        this.setState({confirmtransfer:true,rowToTransfer:rowdata.row });
    }

    
    
}

handleTransferAlert() {
    //console.log("chandleTransferAlert",this.state.newTicket)
    if(this.state.newTicket) {
        // //console.log("create ticket and void existing")
        this.createTicketForTransfer(true)
    }
    else {
        this.transferService(true) 
    }
  
}

voidExistingTicket(value) {


    //console.log("voidExistingTicket",value)


    if(this.state.ticketSelected.id == undefined) {

        this.setState({transferAlert: false, newTicket: false}, function() {
            this.saveTicket("empty ticket")
            //console.log("empty ticket to be saved in void state")
        })
        // this.setState({transferAlert: false, newTicket: false}, function() {
        //     this.props.afterFinished('dashboard')
        // })
        
    }
    else {
        var update_input = { 
            isDelete: 1,
            updated_at:  Moment().format('YYYY-MM-DDTHH:mm:ss'),
            updated_by: this.state.employeedetail.id,
            sync_id:this.state.ticketSelected.sync_id
        }
    
        //console.log("voidExistingTicket",update_input)
        
    
        this.ticketController.updateData({table_name:'ticket', data: update_input, query_field:'sync_id', query_value:this.state.ticketSelected.sync_id}).then(res=>{
            this.setState({transferAlert: false, newTicket: false, isLoading:false}, function() {
                this.props.afterFinished('dashboard')
            }) 
        })
    }
   
}

handleCloseTransferAlert() {
    this.setState({transferAlert:false, rowToTransfer: {}})
}

getOpenTickets(){
    var detail = window.localStorage.getItem('businessdetail');
    var businessdetail = JSON.parse(detail);
    var sql = "select  t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value,t.sync_id, t.discount_totalamt, t.sync_id,c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.sync_id where t.businessId= '"+businessdetail["id"]+"' and t.isDelete!=1"

    // //////console.log("getticketlist:",sql)
   
    this.state.dataManager.getData(sql).then(response =>{
        
        if (response instanceof Array) { 
            if(this.props.ticketSelected !== undefined){
                let selected_ticket = response.filter(item => ((item.paid_status !== "paid") && item.id !== this.props.ticketSelected.id)) 
                this.setState({ open_tickets:selected_ticket,transferpopup:true});
            }
            else{
                let selected_ticket = response.filter(item => ((item.paid_status !== "paid"))) 
                this.setState({ open_tickets:selected_ticket,transferpopup:true});
            }
        }
        
    })
}
getOpenTicketsCombine(){
    var detail = window.localStorage.getItem('businessdetail');
    var businessdetail = JSON.parse(detail);
    var sql = "select  t.sync_id as id,t.ticket_code, t.customer_id, t.technician_id, t.services, t.type, t.subtotal, t.discounts, t.paid_status, t.created_at, t.created_by, t.updated_at, t.updated_by, t.businessId,t.total_tax, t.grand_total, t.notes, t.isDelete, t.tips_totalamt, t.tips_type, t.tips_percent, t.discount_id, t.discount_type, t.discount_value,t.sync_id, t.discount_totalamt, t.sync_id,c.name as customer_name from ticket as t left join customers as c on t.customer_id=c.sync_id where t.businessId= '"+businessdetail["id"]+"' and t.isDelete!=1"

    // //////console.log("getticketlist:",sql)
   
    this.state.dataManager.getData(sql).then(response =>{
        ////console.log(response);
        if (response instanceof Array) { 
            if(this.props.ticketSelected !== undefined){
                let selected_ticket = response.filter(item => ((item.paid_status !== "paid") && item.id !== this.props.ticketSelected.id)) 
                this.setState({ open_tickets:selected_ticket,isCombine:true}, ()=>console.log(this.state.open_tickets));
            }
            else{
                let selected_ticket = response.filter(item => ((item.paid_status !== "paid"))) 
                this.setState({ open_tickets:selected_ticket,isCombine:true}, ()=>console.log(this.state.open_tickets));
            }
        }
        
    })
}

printTicket() {
    console.log("printTicket")
    
    var print_data = this.processPrintDetails()
    //////console.log("service_data", service_data)
        var printerName = window.localStorage.getItem('defaultprinter')
        if(printerName != undefined && printerName != ''){
            this.setState({print_data: print_data}, function() {
                // this.setState({printpopup: true})
                var subTotal=Number(this.state.totalamount).toFixed(2)
                var discount=Number(this.state.total_discount).toFixed(2)
                var tax=Number(this.state.totaltax).toFixed(2)
                var tips=Number(this.state.tips_totalamt).toFixed(2)
                var total=Number(this.state.grandTotal).toFixed(2)
                var ticketid = this.state.ticketCode;
                ////console.log(printerName);
                var data = [];
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
                
                    tableBody: print_data.map((ser,index)=>{
                    
                        return [
                            {
                                type: "text", 
                                value: ser["quantity"]+"&nbsp;&nbsp;&nbsp;&nbsp;"+ser["name"]+"<br>"+
                                ((ser["tax"] === "") ? "":ser["tax"]) +"\n<br>"+
                                ((ser["discount"] === "") ? "":ser["discount"]),
                                style: `text-align:left;`,
                                css: {  "font-size": "12px" },
                            },
                            {
                                type: "text", 
                                value: "$"+ser["price"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                            {
                                type: "text", 
                                value:  "$"+ser["total"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                        ]

                    }),
                
                    tableBodyStyle: 'border: 0.0px solid #ddd',
                    tableSeperatorStyle: 'border: 0.0px solid #ddd'
                
                })

                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Discount</p> <p>$"+(this.state.ticketSelected.discount_totalamt !== null && this.state.ticketSelected.discount_totalamt !== undefined ? Number(this.state.ticketSelected.discount_totalamt).toFixed(2) : '$0.00')+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                })

                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+total+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                });
                if(this.state.ticketSelected.paid_status === 'paid'){
                    data.push({
                        type: "text", 
                        value: "<div style='display: flex; justify-content: space-between;'><p >CASH SALE</p> <p>$"+total+"</p> </div>",
                        style: `text-align:left;`,
                        css: {  "font-size": "14px","margin-top": -25 },
                    });

                    data.push({
                        type: "text", 
                        value:  "<div style='display: flex; justify-content: space-between;'><p >Cash tendered</p> <p>$"+total+"</p> </div>",
                        style: `text-align:left;`,
                        css: { "font-size": "14px","margin-top": -25 },
                    });
                }

                data.push({
                    type: "text", 
                    value:  "Enjoy!",
                    style: `text-align:left;`,
                    css: { "font-size": "14px","margin-top": 0 },
                });

                window.api.printdata({printername: printerName, data: data}).then(res=>{ 
                    ////console.log(res);
                    if(!this.state.isPaidOnOpen){
                        this.printEmployeeReceipt()
                    }
                })


            })
        }
        else{
            this.setState({printalert:true})
        }


}

printEmployeeReceipt(){
    var emps = []
    var thisobj = this;
    this.state.services_taken.forEach((e, i)=>{
        if(emps.indexOf(e.employee_id) === -1){
            emps.push(e.employee_id)
        }
        if(i=== thisobj.state.services_taken.length-1){
            console.log("PRINT EMP RECEIPT")
            var printerName = window.localStorage.getItem('defaultprinter')
            if(printerName != undefined && printerName != ''){
                thisobj.printEmployeeReceiptIndividual(0, emps, printerName);
            }
            else{
                thisobj.setState({printtalert:true})
            }

        }
    });
}

printEmployeeReceiptIndividual(idx, emps, printerName){
    if(idx < emps.length){
            var emp = emps[idx];
            var response = this.processEmployeePrintDetails(emp);
            var print_data = response.data;
            var total = response.total;
            var data = [];
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.name+"<br/>Employee Receipt",//"TOP PAYMENT SOLUTIONS - Main",
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
                    value: "<div style='display: flex; justify-content: space-between;'><p >Employee: "+this.getEmployeeName(emp)+"</p><p>Ticket:"+this.state.ticketCode+"</p>",
                    style: `text-align:left;`,
                    css: {  "font-size": "12px","margin-top": 5 },
                    }); 
                
                data.push({
                    type: 'table',
                    // style: 'border: 0px solid #ddd',
                    css: {"margin-left": 10,"margin-top": 10,"margin-bottom": 10},
                
                    tableBody: print_data.map((ser,index)=>{
                    
                        return [
                            {
                                type: "text", 
                                value: ser["quantity"]+"&nbsp;&nbsp;&nbsp;&nbsp;"+ser["name"] ,
                                style: `text-align:left;`,
                                css: {  "font-size": "12px" },
                            },
                            {
                                type: "text", 
                                value: "$"+ser["price"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                            {
                                type: "text", 
                                value:  "$"+ser["total"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                        ]

                    }),
                
                    tableBodyStyle: 'border: 0.0px solid #ddd',
                    tableSeperatorStyle: 'border: 0.0px solid #ddd'
                
                }) 
                
                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+total+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                });  

                data.push({
                    type: "text", 
                    value:  this.state.businessdetail.name+" - Printed: "+Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                    style: `text-align:center;border-bottom:1px dotted #000;margin-top:40px;padding-top:30px;padding-bottom:20px;`,
                    css: {  "font-size": "14px","margin-top":10, "border-bottom":"1px dotted #000"},
                });

                window.api.printdata({printername: printerName, data: data}).then(res=>{ 
                    console.log(res);
                    this.printEmployeeReceiptIndividual(idx+1, emps, printerName)
                })
    }
    else{
        console.log("ARRAY COMPLETED")
    }
}



processEmployeePrintDetails(empid) {

    var service_data = []
    var total = 0;
    this.state.services_taken.forEach(( ser,index) => {
        if(ser.employee_id === empid){
            total +=  ser.subtotal;
            service_data.push({
                "name" : ser.servicedetail.name,
                "price":  ser.perunit_cost,
                "total": ser.subtotal, 
                "quantity": ser.qty
            })
        } 
    })

   return {data: service_data, total:total}

    
}

processPrintDetails() {

    var service_data = []
    
    this.state.services_taken.forEach(( ser,index) => {
        var tax_detail = ""
        var discount_detail = ""
        var tax_data = []
        var discount_data=[]
        ser.taxes.forEach( (tax) => {
            tax_data.push({ 
                "tax_name": tax.tax_name+"("+(tax.tax_type === 'percentage' ? '%' : '$')+tax.tax_value+")",
                "tax_percentage": tax.tax_calculated
            })
        })

        tax_data.forEach((tax) => {
            tax_detail = (tax_detail.length>0 ? tax_detail+"<br>" : tax_detail)+tax["tax_name"]+" - $"+tax["tax_percentage"]
        })

        

        if( ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 ) {
            discount_data.push({ 
                "discount_name": ser.discount.discount_name+"("+(ser.discount.discount_type === 'percentage'? ser.discount.discount_value+'%' : '$'+ser.discount.discount_value)+")",
                "discount_price":ser.discount.total_discount_amount ,
                "price_with_discount":ser.discount.price_with_discount
            })
        }

        discount_data.forEach   ((tax) => {
            discount_detail = (discount_detail.length>0 ? discount_detail+"<br>" : discount_detail)+tax["discount_name"]+" - $"+tax["discount_price"]+""
        }) 
        service_data.push({
            "name" : ser.servicedetail.name,
            "price":  ser.perunit_cost,
            "total": ser.subtotal,
            "tax": tax_detail,
            "discount":discount_detail,
            "quantity": ser.qty
        })
       

    })

   return service_data

    
}

handleClosePrint() {
    this.setState({printpopup: false})
}

handleChangePrinter(e) {
    var val = e.target.value;
    this.setState({selected_printer: val})
}



renderButtons(isDisabled) {
    var defaultprinter = window.localStorage.getItem('defaultprinter') || ''
    return(
        <div style={{ marginLeft: 0}}>
            {!this.state.isEdit && <div>
                            <Grid item xs={12} style={{display:'flex'}}>
                                <Grid item xs={5} className="footerbtn">
                                    <Grid item xs={12} style={{display:'flex'}}  className='nobottomborder'>
                                        <Grid xs={3}><Button disabled={this.state.isDisable || this.state.services_taken.length == 0} fullWidth  onClick={()=>this.voidTicket()} variant="outlined">Void</Button> </Grid>
                                        <Grid xs={5}><Button disabled={this.state.isDisable || this.state.services_taken.length == 0} onClick={()=>{ 
                                            this.getOpenTicketsCombine() 
                                            }} fullWidth variant="outlined">Combine</Button> </Grid>
                                        <Grid xs={4}><Button style={{borderRadius: 0}} onClick={()=>this.addTips()} fullWidth variant="outlined" disabled={this.state.tipsdiscountEnabled || this.state.services_taken.length == 0}>Tips</Button> </Grid>
                                    </Grid>
                                    <Grid item xs={12} style={{display:'flex'}}>
                                        <Grid xs={3}><Button onClick={()=>this.printTicket()} disabled={ this.state.services_taken.length == 0} fullWidth variant="outlined">Print</Button> </Grid>
                                        <Grid xs={5}><Button onClick={()=>this.addDiscounts()} fullWidth variant="outlined"  disabled={this.state.tipsdiscountEnabled || this.state.services_taken.length == 0}>Discount</Button> </Grid> 
                                        <Grid xs={4}><Button disabled={isDisabled || this.state.services_taken.length == 0} onClick={()=>this.addNotes()} fullWidth variant="outlined" >Notes</Button> </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={7} style={{border:'2px solid #f0f0f0'}}>
                                    
                                    <Grid item xs={12} style={{display:'flex',height:'100%'}}> 
                                        <Grid xs={6}>
                                            <Button style={{height:'100%', background:'#134163', borderRadius:'0 !important'}} onClick={()=>this.saveTicket('yes')} disabled={this.state.isDisable} color="secondary" fullWidth variant="contained"> {this.state.isEdit ? 'Update' : 'Save' } </Button>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Button style={{height:'100%', borderRadius:'0 !important'}} onClick={()=>this.handleTicketPayment()} disabled={this.state.isDisablePay} fullWidth variant="outlined">Pay</Button> 
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
            </div>}

           {this.state.isEdit && <div>
                <Grid item xs={12} style={{display:'flex'}}>
                    <Grid item xs={5} className="footerbtn" >
                        <Grid item xs={12} style={{display:'flex'}} className='nobottomborder'>
                            <Grid xs={3}><Button fullWidth onClick={()=>this.voidTicket()} variant="outlined" disabled={this.state.isDisable}>Void</Button> </Grid>
                            <Grid xs={5}><Button fullWidth disabled={this.state.isDisable || this.state.services_taken.length == 0}  onClick={()=>{ 
                                    this.getOpenTicketsCombine()  
                            }} variant="outlined">Combine</Button> </Grid>
                            <Grid xs={4}><Button disabled={this.state.isDisable || this.state.services_taken.length == 0} fullWidth variant="outlined" onClick={()=>this.handleTicketPayment()} >Close</Button> </Grid>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex'}}>
                            <Grid xs={3}><Button onClick={()=>this.printTicket()} disabled={  this.state.services_taken.length == 0} fullWidth variant="outlined">Print</Button> </Grid>
                            <Grid xs={5}><Button onClick={()=>this.addDiscounts()} fullWidth variant="outlined" disabled={this.state.isDisable  || this.state.services_taken.length == 0 ? true: (this.state.tipsdiscountEnabled) ? true: false}
                            >Discount</Button> </Grid>
                            <Grid xs={4}><Button onClick={()=>this.addNotes()} fullWidth variant="outlined" disabled={this.state.isDisable  || this.state.services_taken.length == 0}>Notes</Button> </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={7} style={{border:'2px solid #f0f0f0'}}>
                        <Grid item xs={12} style={{display:'flex',height:'100%'}}>
                            <Grid xs={4}>
                                <Button style={{height:'100%', borderRadius:0}} disabled={this.state.isDisable? false: (this.state.tipsdiscountEnabled) ? true: false || this.state.services_taken.length === 0} onClick={()=>this.addTips()} fullWidth variant="outlined">Tips</Button> 
                            </Grid>
                           
                            <Grid xs={4}>
                                <Button style={{height:'100%', borderRadius:0}} onClick={()=>this.saveTicket('yes')} disabled={this.state.isDisable || this.state.services_taken.length === 0} color="secondary" fullWidth variant="contained"> Save </Button>
                            </Grid>
                            <Grid xs={4}>
                                <Button style={{height:'100%', borderRadius:0}} onClick={()=>this.handleTicketPayment()} disabled={this.state.isDisablePay || this.state.services_taken.length === 0} fullWidth variant="outlined">Pay</Button> 
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </div>}
        </div>
        
    )
}

renderPriceDetails() {
    return(
    <div style={{background: '', marginLeft: -20,border:'2px solid #f0f0f0',borderRight:0,borderBottom:0}}>
    <Grid item xs={12} style={{display:'flex', background: ''}}>
        <Grid item xs={6} style={{ borderRight:0,paddingLeft: 20,paddingTop: 10, paddingBottom: 10}}>
            <Typography id="modal-modal-title" variant="subtitle2" align="left"> </Typography>
            <Typography id="modal-modal-title" variant="subtitle2" align="left" style={cusDetail}>Retail : ${Number(this.state.retailPrice).toFixed(2)}</Typography>
            <Typography id="modal-modal-title" variant="subtitle2" align="left" style={cusDetail}>Services : ${Number(this.state.servicePrice).toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Grid item xs={12} style={{display:'flex'}}>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:0, borderRight:0, borderTop: 0}}>
                    <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Subtotal </Typography></Grid>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0',  borderBottom:'0'}}>
                    <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="right">$ {Number(this.state.totalamount).toFixed(2)}  </Typography></Grid>
            </Grid>

            <Grid item xs={12} style={{display:'flex'}}>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0', borderRight:0}}><Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Discount </Typography></Grid>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0'}}><Typography style={disDetail} id="modal-modal-title" variant="subtitle2" align="right"> - ${Number(this.state.total_discount).toFixed(2)}  </Typography></Grid>
            </Grid>

            <Grid item xs={12} style={{display:'flex'}}>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0', borderRight:0}}><Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Tax </Typography></Grid>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0'}}><Typography style={taxDetail} id="modal-modal-title" variant="subtitle2" align="right"> + ${Number(this.state.totaltax).toFixed(2)}  </Typography></Grid>
            </Grid>

            <Grid item xs={12} style={{display:'flex'}}>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0', borderRight:0}}>
                    <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">
                    Tips </Typography></Grid>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0'}}><Typography style={taxDetail} id="modal-modal-title" variant="subtitle2" align="right"> + ${Number(this.state.tips_totalamt).toFixed(2)}  </Typography></Grid>
            </Grid> 
            <Grid item xs={12} style={{display:'flex'}}>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0', borderRight:0}}>
                    <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="left">Total </Typography></Grid>
                <Grid item xs={6} style={{border:'2px solid #f0f0f0', borderBottom:'0'}}>
                    <Typography style={amtDetail} id="modal-modal-title" variant="subtitle2" align="right">${this.state.grandTotal} </Typography></Grid>
            </Grid>
        </Grid>
    </Grid>
    </div>
   
    )
}

renderSelectedServices(isDisabled) {
    // //console.log("renderSelectedServices::",this.state.services_taken)
    return(
        // <Grid item xs={12} style={{'height':'100px',
        //             'background':(this.state.selected_category==category.id ? '#bee1f7':(index%2==0) ? 'transparent':'#F5F5F5'), textTransform:'capitalize','color':(this.state.selected_category==category.id ? '#000':'#000')}} >
        //                 <div style={{borderBottom:'2px solid #f0f0f0', borderRight:'0',   cursor:'pointer',  display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}} 
        //                 onClick={() => {
        //                     if(!isDisabled) {
        //                         this.getServices(category.id)}
        //                     }
        //                 }>
        //                     <div   style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center', userSelect: 'none'}}>
        //                         <Typography style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
        //                                 'overflow': 'hidden',
        //                                 'white-space': 'pre-wrap',fontSize:'14px',
        //                                 'text-overflow': 'ellipsis',textTransform:'capitalize',
        //                                 'height': '80px'}} id="modal-modal-title" variant="subtitle2"  align="center">
        //                                     {category.name}
        //                         </Typography>
        //                     </div>
        //                 </div>
        //             </Grid>
        <div style={{overflow: 'hidden',  background: '',  height: '100%',}}> 

            <Grid container spacing={1}  xs={12} style={{ marginLeft:'0', background: '#F5F5F5', marginTop:20, marginRight: '0px',paddingTop: 10,paddingBottom: 10, height:'50px' }}>
            
                <Grid item xs={12} container justify="flex-start" style={{ paddingLeft: 20}}>

                <Grid item xs={3} container  justify="flex-start" direction='column'>
                    <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold',maxWidth: 200}}  variant="subtitle2" align="left" noWrap >Service Name</Typography>
                </Grid>

                <Grid item xs={2} container justify="flex-start">
                    <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left">Qty </Typography>
                </Grid>

                <Grid item xs={4} container justify="flex-start"> 
                    <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left">Technician</Typography>
                </Grid>

                <Grid item xs={3} container justify="flex-start">
                    <Typography style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', fontWeight: 'bold'}}  variant="subtitle2" align="left"><span style={{padding:'0 10px', visibility:'hidden'}}>(+)</span>Price</Typography>
                </Grid> 
                </Grid>

            </Grid>

             <div style={{ width: '100%', height: '100%',overflow: 'hidden'}}>
        
             <div style={{width: '100%', height: window.innerHeight-410,paddingLeft: 0,paddingTop: 10,paddingBottom: 10,overflowY:'auto', overflowX:'hidden', boxSizing: 'content-box'}}>


             {this.state.services_taken.map( (ser,index) => 
                        <Grid container xs={12} justify="flex-start" style={{borderBottom:'2px solid #f0f0f0',position:'relative', cursor: 'pointer',
                         paddingTop: 10, paddingBottom:10, paddingLeft: 0,
                        background:(this.state.selectedRowServiceindex === index) ? '#2E83BB' :  (index%2 === 0) ? '#ffffff' : '#F5F5F5',
                        color: (this.state.selectedRowServiceindex === index) ? 'white' :'black',
                        
                        }} 
                    
                        color={(this.state.selectedRowServiceindex === index) ? 'white' :'balck'}
                        onClick={(e)=>{
                            if(!isDisabled) {
                                e.preventDefault();
                                e.stopPropagation(); 
                                this.selectServiceTech(index,e)}
                            }
                            
                        } >

                                <Grid item xs={3} spacing={10}  justify="flex-start" direction='column' style={{padding:'10px 0 10px 10px', height:'auto', position:'relative',}}>
                                    <Typography id="modal-modal-title" variant="subtitle2" noWrap style={{width:'100%', paddingBottom: 10,wordBreak:'break-word', display:'flex', alignItems:'center',}}>
                                       {ser.process  === 'Splitted' &&  <CallSplit style={{height:'16px'}}/>} {ser.servicedetail.name}</Typography>
                                                  
                                    <Typography variant="subtitle2" style={{maxWidth: 200, marginTop: 20 , textAlign:'left'}}>
                                        {ser.isSpecialRequest === 1 ?( ser.requestNotes !== '' && ser.requestNotes !== undefined && ser.requestNotes !== null ? ser.requestNotes.substring(0,200) :'(Special Request)'):''}</Typography>                
                                </Grid>

                                <Grid item xs={2} container justify="flex-start"  style={{padding:'10px 0 10px 10px'}}>
                                    <Typography id="modal-modal-title" variant="subtitle2"  style={{height:'auto'}} align="center">{ser.qty} </Typography>
                                </Grid>
                                
                                <Grid item xs={4} container justify="flex-start"  style={{padding:'10px 0 10px 10px', display:'flex', flexDirection:'row'}}> 
                                <Typography id="modal-modal-title" variant="div" align="center" style={{display:'flex', width:'100%', flex:'1', justifyContent:'space-between'}}> 
                                       <span style={{fontSize:'14px'}}> {this.getEmployeeName(ser.employee_id)}  </span>
                                        <span style={{fontSize:'14px'}}>{ser.servicedetail.producttype==='product' ? '(R)' :''}</span>
                                        </Typography>   
                                        {ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 &&  
                                            <Grid item xs={12} style={{ padding:'5px 0'}}>
                                                    <Typography id="modal-modal-title" variant="subtitle2" align="left" >{ser.discount.discount_name} ({ser.discount.discount_type === 'percentage'? '%' : '$' }{ser.discount.discount_value}) </Typography>
                                            </Grid>
                                        } 
                                        {ser.taxes.map( (tax) => 
                                            <Grid item xs={12} style={{ padding:'5px 0' }}> 
                                                            <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>{tax.tax_name} 
                                                            ({tax.tax_type === 'percentage'? tax.tax_value+'%' : '$'+tax.tax_value })</Typography>  
                                            </Grid>
                                        
                                        )}

                                </Grid>
                                
                                <Grid item xs={3} container justify="flex-start"  style={{padding:'10px 0 10px 10px', display:'flex', flexDirection:'row'}}>
                                    
                                    <Typography id="modal-modal-title" variant="subtitle2" align="center"><span style={{padding:'0 10px', visibility:'hidden'}}>(+)</span>${ Number(Number(ser.perunit_cost) * Number(ser.qty)).toFixed(2) }</Typography> 
                                     
                                   {ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 &&  
                                        <Grid item xs={12} style={{padding:'5px 0'}}>
                                                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',}} ><span style={{padding:'0 10px'}}>(-)</span>${Number(ser.discountamount).toFixed(2) } </Typography>
                                        </Grid>
                                    }    
                                    {ser.taxes.map( (tax) => 
                                        <Grid item xs={12} style={{  padding:'5px 0' }}> 
                                                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',}}><span style={{padding:'0 10px'}}>(+)</span>${ Number(tax.tax_calculated).toFixed(2)}</Typography> 
                                        </Grid>
                                    
                                    )}
                                </Grid>


                        </Grid>

             )}  
            </div>
        
        </div>
        </div>
        
    )
}

requestSearch(searchVal) {
    const sql = "select c.sync_id as id,c.sync_id, c.name, c.status, c.description,c.created_at, c.created_by, c.updated_at, c.updated_by,c.businessId, c.sync_status from category as c where (c.sync_id in (select category_id from services_category where service_id in (select sync_id from services where lower(name) like '%"+searchVal+"%' and status='Active' ) ) or lower(c.name) like '%"+searchVal+"%') and c.businessId =  '"+JSON.parse(window.localStorage.getItem('businessdetail'))["id"]+"'  and c.status = 'Active'" 
    this.setState({searchtext:searchVal});
    this.state.dataManager.getData(sql)
    .then(response =>{ 
        if (response instanceof Array) {
            this.setState({category_list:response}, function() { 
                if(response.length > 0){
                    this.getServices(response[0].id)
                } 
                else{
                    console.log("else condition")
                    this.setState({services_list:[], allservices:[]})
                }
            });
        }  
    })  
}

cancelSearch() {
    this.setState({searchtext:''}, function(){
        this.getCategoryList();
    })
}
getCategoryName(){
    var category = this.state.category_list.filter(e=>e.id === this.state.selected_category);
    return category.length > 0 ? category[0].name : ''
}

handleCloseVariablePricePopup() {
    this.setState({priceVariablePopup: false})
}


afterSubmitVariablePrice(value) {
    if(value == "cancel") {
      
        this.setState({priceVariablePopup: false})
      
    }
    else {
        var servicein = this.state.selectedservice
        console.log("change price", servicein)
        // var obj = {
        //     "servicedetail": servicein,
        //     discount:{},
        //     taxes:[],
        //     subtotal: servicein.service_cost != undefined ? servicein.service_cost : servicein.price,
        //     taxamount:0,
        //     discountamount:servicein.total_discount_amount !== undefined ?  servicein.total_discount_amount :0,
        //     qty: servicein.service_quantity != undefined ?  servicein.service_quantity : 1,
        //     perunit_cost: value,
        //     employee_id:  (servicein.employee_id !== null && servicein.employee_id !== undefined ? Number(servicein.employee_id) : Number(this.state.technician_id))  ,
        //     isSpecialRequest: 0,
        //     process:''
        // }
      
        // var sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.id=st.tax_id and t.status='active' where service_id='"+servicein.id+"' and st.status='active'";
        
        // if(this.state.isEdit){
        //     obj["discount"].discount_id = servicein.discount_id
        //     obj["discount"].discount_type = servicein.discount_type
        //     obj["discount"].discount_value = servicein.discount_value
        //     obj["discount"].discount_name = servicein.discount_name
        //     obj["discount"].total_discount_amount = servicein.total_discount_amount
           
        // } 

        // console.log(sql)
        // this.state.dataManager.getData(sql).then(response =>{  
        //     console.log("tax response", response)
        //     obj.taxes = response; 
        //     var services = this.state.services_taken;
        //     services.push(obj);
        //     this.setState({services_taken: services, priceVariablePopup: false}, ()=>{ 
        //         this.setState({tipsdiscountEnabled: false})
        //         this.calculateTotal();
            
        //     })
        // });
        var obj = {
            "servicedetail": servicein,
            discount:{},
            taxes:[],
            subtotal: servicein.service_cost != undefined ? servicein.service_cost : servicein.price,
            taxamount:0,
            discountamount:servicein.total_discount_amount !== undefined ?  servicein.total_discount_amount :0,
            qty: servicein.service_quantity != undefined ?  servicein.service_quantity : 1,
            perunit_cost: value,
            employee_id:  (servicein.employee_id !== null && servicein.employee_id !== undefined ? Number(servicein.employee_id) : Number(this.state.technician_id))  ,
            isSpecialRequest: servicein.isSpecialRequest !== undefined ? servicein.isSpecialRequest: 0,
            process:servicein.process !== undefined ? servicein.process : '',
            requestNotes: servicein.requestNotes !== undefined ? servicein.requestNotes : '',
            tips_amount: servicein.tips_amount !== undefined ? servicein.tips_amount : 0,
            sort_number: this.state.services_taken.length+1
        }
        ////console.log(obj);
        console.log("SERVICEIN:::::", servicein)
        var sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.sync_id=st.tax_id and t.status='active' where service_id='"+servicein.service_id+"' and st.status='active'";

        if(this.state.isEdit){
            obj["discount"].discount_id = servicein.discount_id
            obj["discount"].discount_type = servicein.discount_type
            obj["discount"].discount_value = servicein.discount_value
            obj["discount"].discount_name = servicein.discount_name
            obj["discount"].total_discount_amount = servicein.total_discount_amount
            console.log("$$$$$$$$$$$$$$$$$$")
            console.log(servicein.uniquId, servicein.tax_type)
            if((servicein.uniquId === undefined || servicein.uniquId === '')  && servicein.tax_type !=='default'){
                sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.sync_id==st.tax_id and t.status='active' where st.service_id='"+servicein.service_id+"' and st.status='active'"
            }
            else if((servicein.uniquId === undefined || servicein.uniquId === '') && servicein.tax_type ==='default'){
                sql = "SELECT t.sync_id as tax_id,t.tax_name,t.tax_type,t.tax_value from taxes as t where t.isDefault=1 and t.status='active'"
            }
            else if(servicein.uniquId !== undefined){
                sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from ticketservice_taxes as st join taxes as t on t.sync_id==st.tax_id and t.status='active' where st.serviceref_id='"+servicein.uniquId+"' and st.ticketref_id='"+servicein.ticketref_id+"' and st.isActive=1"
            } 
        } 
        else if(servicein.tax_type ==='default'){
            sql = "SELECT t.sync_id as tax_id, t.tax_name,t.tax_type,t.tax_value from taxes as t where t.isDefault=1 and t.status='active'"
        }
        console.log("TAX SQL::::::")
        console.log(sql);
        this.state.dataManager.getData(sql).then(response =>{  
            console.log("tax response :::::: ", response)
            obj.taxes = response.length > 0 ?  response : []; 
            var services = this.state.services_taken;
            services.push(obj);
            this.setState({services_taken: services}, ()=>{ 
                this.setState({tipsdiscountEnabled: false,priceVariablePopup: false})
                this.calculateTotal();
            })
        });

    }

    
}

renderServicesList(isDisabled) {
    return(
    <Grid item xs={12} style={{border:'2px solid #f0f0f0', height:  window.innerHeight-100}} >
        <Grid item xs={12} style={{border:'0px solid #f0f0f0',borderBottom:'1px solid #f0f0f0',padding: 10}}> 
            <SearchBar 
                style={{background: 'transparent', boxShadow: 'none' }}
                value={this.state.searched}
                onChange={(searchVal) => this.requestSearch(searchVal)}
                onCancelSearch={() => this.cancelSearch()} 
                />

        </Grid> 
        <Grid item xs={12}  style={{display:'flex', flexWrap:'wrap', height:'calc(100% - 70px)'}}>
            
            <Grid item xs={4} style={{height:'100%',overflow:'auto'}}>
            <div style={{ width: '100%', height: '100%',overflow: 'hidden',borderRight:'5px solid #f0f0f0', }}>
            <div style={{width: '100%', height: window.innerHeight-180,padding: 0,overflowY:'scroll',
             boxSizing: 'content-box',borderRight:'2px solid #f0f0f0', overflow: 'auto', scrollbarWidth: 'none'}}>

                {this.state.category_list.length=== 0 && <div style={{padding:'10px', display:'flex', alignItems:'center', width:'100%'}}><p style={{fontSize:'12px', textAlign:'center'}}>No categories found.</p></div>}
                {this.state.category_list.map((category,index) => (
                    <Grid item xs={12} style={{'height':'100px',
                    'background':(this.state.selected_category==category.id ? '#bee1f7':(index%2==0) ? 'transparent':'#F5F5F5'), textTransform:'capitalize','color':(this.state.selected_category==category.id ? '#000':'#000')}} >
                        <div style={{borderBottom:'2px solid #f0f0f0', borderRight:'0',   cursor:'pointer',  display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}} 
                        onClick={() => {
                            if(!isDisabled) {
                                this.getServices(category.id)}
                            }
                        }>
                            <div   style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center', userSelect: 'none'}}>
                                <Typography style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                                        'overflow': 'hidden',
                                        'white-space': 'pre-wrap',fontSize:'14px',
                                        'text-overflow': 'ellipsis',textTransform:'capitalize',
                                        'height': '80px'}} id="modal-modal-title" variant="subtitle2"  align="center">
                                            {category.name}
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                ))}
                {/* </div> */}

                </div>
                </div>

            </Grid>
       

            <Grid item xs={8} style={{height:'100%',overflow:'auto'}}>
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap' }}>
                {this.state.services_list.length=== 0 && <div style={{padding:'10px', display:'flex', alignItems:'center', width:'100%'}}><p style={{fontSize:'12px', textAlign:'center'}}>No services found.</p></div>}
                
                    {this.state.services_list.map(service => ( 
                        <Grid item xs={6} onClick={() => {
                                if(!isDisabled) {
                                    // //console.log("service--onclick",service.pricetype)
                                    if(service.pricetype=="variable") {
                                        this.setState({priceVariablePopup: true,selectedservice: service }, function() {
                                            console.log("variable",service, this.state.selectedservice)
                                        })
                                    }
                                    else {
                                        this.addServices(service)
                                    }
                                    
                                }
                            }} 
                            style={{border:'2px solid #f0f0f0',padding: '10px',margin: '10px',maxWidth: '40%',height: '70px',cursor:'pointer'}}
                            // style={{border:'2px solid #f0f0f0', borderLeft:0,borderTop:0, height:'100px', cursor:'pointer',padding:'20px'}}
                            >
                                {/* style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center',height:'100%' }} */}
                            <div style={{ userSelect: 'none', display:'flex', alignItems:'center', justifyContent:'center',height:'100%' }}>
                                <Typography  style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                                    'overflow': 'hidden', textTransform:'capitalize',
                                    'white-space': 'pre-wrap',
                                    'text-overflow': 'ellipsis',fontSize:'14px',
                                    'height': '80px'}}  id="modal-modal-title" variant="subtitle2" align="center" >
                                        {service.name}{service.producttype==='product' ? '(R)' :''}
                                    </Typography>
                            </div>
                        </Grid> 
                    ))}
                </Grid>
            </Grid>
        
        </Grid>
       

    </Grid> 
        
     
    )
}
 

getMenuItem(index){
    var cat = this.state.techcategory_list[index];
    var splitteddisable = [5] //[2, 3,5,7]
    if(this.state.selectedRowService.process !== 'Splitted'){
         return <Grid item xs={12} style={{
            'background':(cat.id===(this.state.menu_selected_id)) ? '#bee1f7' : ((index%2===0) ? 'transparent':'#F5F5F5'),
            'color':(cat.id===(this.state.menu_selected_id)) ? '#000': '#000', textTransform:'capitalize',
            height: 100
        }} >
              <div style={{borderBottom:(cat.id===(this.state.menu_selected_id)) ? '2px solid #bee1f7': '2px solid #f0f0f0', textTransform:'capitalize',  cursor:'pointer',   
              padding: 10,height: '100%'}}  onClick={() => {  
                        this.getMenuFunction(cat.id)  
                }}>
                    <div   style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>

                    <Typography style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                            'overflow': 'hidden',
                            'white-space': 'pre-wrap',fontSize:'14px',
                            'text-overflow': 'ellipsis',textTransform:'capitalize',
                            'height': '80px'}} id="modal-modal-title" variant="subtitle2"  align="center">
                             {cat.label}
                    </Typography>
                    {/* <Typography noWrap id="modal-modal-title" variant="subtitle2" align="center">{cat.label}</Typography> */}
                    </div>
                </div>
            </Grid>
    }
    else{
        return <Grid item xs={12} style={{
            'background':(cat.id===(this.state.menu_selected_id)) ? '#bee1f7' : ((index%2===0) ? 'transparent':'#F5F5F5'),
            'color':(cat.id===(this.state.menu_selected_id)) ? '#000': '#000', textTransform:'capitalize',
            height: 100
        }} >
                <div style={{borderBottom:'2px solid #f0f0f0',   cursor:'pointer',   padding: 10,height: '100%'}}  onClick={() => {  
                    if(splitteddisable.indexOf(cat.id) === -1){
                        this.getMenuFunction(cat.id) 
                    }
                    else{
                        if(cat.id === 2){
                            this.setState({disableerror:"You cannot change the quantity of splitted service."})
                        }
                        if(cat.id === 3){
                            this.setState({disableerror:"You cannot change the price of splitted service."})
                        }
                        if(cat.id === 5){
                            this.setState({disableerror:"You cannot split the splitted service."})
                        }
                        if(cat.id === 7){
                            this.setState({disableerror:"You cannot apply discount on the splitted service."})
                        }
                    }
                }}>
                    <div   style={{MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none',height: '100%'}}>
                    <Typography style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                            'overflow': 'hidden',
                            'white-space': 'pre-wrap',fontSize:'14px',
                            'text-overflow': 'ellipsis',textTransform:'capitalize',
                            'height': '80px'}} id="modal-modal-title" variant="subtitle2"  align="center">{cat.label}</Typography>
                    </div>
                </div> 
            </Grid> 
    } 
}

handleCheckbox(e,selectedtax ){ 

    var service =  Object.assign({}, this.state.services_taken[this.state.selectedRowServiceindex]);
   
    var taxes = service.taxes; 
    var taxids = taxes.map(t=>t.tax_id)  
    var updateTaxes = []
    service.taxes.map((value)=>{
        updateTaxes.push(value)
    })
    if(taxids.indexOf(selectedtax.id) === -1){  
        console.log("handleCheckbox")
        selectedtax["tax_id"] = selectedtax["id"];
        // taxes.push(selectedtax);
        updateTaxes.push(selectedtax)
        service.taxes = taxes; 
        var services =  Object.assign([], this.state.services_taken);

        // //console.log("services",services)

        var services_taken = [...this.state.services_taken];
        // var taxes = taxes
        services_taken[this.state.selectedRowServiceindex].taxes = updateTaxes;
        this.setState({services_taken:services_taken,selectedRowService: service}, function() {
            this.calculateTotal();
        });


        
        // this.setState({services_taken: services, selectedRowService: service}, ()=>{
        //     this.calculateTotal();
        // });

       
        

    }
    else{   
        console.log("2.handleCheckbox")
        var idx = taxids.indexOf(selectedtax.id);
        taxes.splice(idx, 1);
        service.taxes = taxes;
       
        var services = Object.assign([], this.state.services_taken);
       

        updateTaxes.splice(idx, 1);
        var services_taken = [...this.state.services_taken]
        services_taken[this.state.selectedRowServiceindex].taxes = updateTaxes;

        // var tax_calculated = 0
        // if(selectedtax.tax_type === 'percentage'){
        //     let per_amt = (selectedtax.tax_value/100)*  Number(this.state.services_taken[this.state.selectedRowServiceindex].quantity_price);
        //     tax_calculated = per_amt.toFixed(2);
          
        // }
        // else{
        //     if(selectedtax.tax_value !== undefined || selectedtax.tax_value !== undefined){ 
        //         tax_calculated = selectedtax.tax_value.toFixed(2);
               
        //     }
            
        // }

        // //console.log("tax_calculated",tax_calculated)

        this.setState({services_taken: services_taken,selectedRowService: service, tax_removed: this.state.services_taken[this.state.selectedRowServiceindex].taxamount}, function() {
            //console.log("taxes remove--", this.state.services_taken)
            this.calculateTotal();
        });

        // this.setState({services_taken: services, selectedRowService: service}, ()=>{
           
        //     this.calculateTotal();
        // }); 
    }

    // //console.log("services_taken",this.state.services_taken)
}

isTaxCheck(tid){
    var service =  this.state.services_taken[this.state.selectedRowServiceindex];
    var taxes =service.taxes;
    var taxids = taxes.map(t=>t.tax_id);
    console.log(service.taxes, taxids, tid, taxids.indexOf(tid) === -1 ? false : true);
    return taxids.indexOf(tid) === -1 ? false : true;
}

renderServiceContent() {
    return(
        <Grid item xs={12} style={{border:'2px solid #f0f0f0'}} > 
        <Grid item xs={12}  style={{display:'flex', flexWrap:'wrap'}}>
            <Grid item xs={4}>
            <div style={{ width: '100%', height: '100%',overflow: 'hidden',borderRight:'2px solid #f0f0f0'}}>
           

            <div style={{width: '100%', height: window.innerHeight-160,padding: 0,overflowY:'auto', boxSizing: 'content-box'}}>
                {this.state.techcategory_list.map((cat, index) => (
                    <Grid item xs={12}>  
                        {this.getMenuItem(index)}
                    </Grid>
                ))}
            </div>
            </div>

            </Grid>
            { this.state.menu_selected_id===-1 && <Grid item xs={8}> 
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap', height:'100px'}}>
                    {this.state.clockin_emp_list.map((emp, index) => ( 
                         <>{ emp.staff_role !== 'SA' && <Grid item xs={6} 
                         onClick={(e) => this.handlechangeEmp(emp.id, e)} 
                         style={{border:'2px solid #f0f0f0',display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', alignItems:'center', justifyContent:'center',cursor:'pointer'}}>
                            
                             <Typography  style={{ display:'flex', alignItems:'center', justifyContent:'center',fontWeight:'500',
                                    'overflow': 'hidden', textTransform:'capitalize',
                                    'white-space': 'pre-wrap',
                                    'text-overflow': 'ellipsis',fontSize:'14px',
                                    }}  id="modal-modal-title" variant="subtitle2" align="center" >
                                {emp.firstName+" "+emp.lastName} </Typography></Grid> }
                    </>))}
                </Grid>
            </Grid>}

            {this.state.menu_selected_id===2  && <Grid item xs={8}>
                <Grid item xs={12} style={{flexWrap:'wrap',padding: 20}}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <FormControl fullWidth>  
                                    <TextField  fullWidth 
                                        id="qty"  
                                        type="number"
                                        name="qty"  
                                        placeholder="Enter Quantity" 
                                        value={this.state.selectedRowService.qty}
                                        color="secondary"   
                                        variant="outlined" 
                                        style={{textAlign:'center', border:0}}
                                        InputProps={{
                                            startAdornment:<Button
                                            title="+1"
                                            aria-label="+1"
                                            size="medium" 
                                            style={{border:0}}
                                            onClick={()=>{ 
                                                var service = this.state.services_taken[this.state.selectedRowServiceindex];
                                                service.qty = Number(service.qty) >= 1 ? Number(service.qty)+1 : 1;
                                                service.subtotal = service.qty*service.perunit_cost;
                                                var services = this.state.services_taken;
                                                services[this.state.selectedRowServiceindex] = service;
                                                this.setState({services_taken: services, selectedRowService:service}, ()=>{
                                                    this.calculateTotal()
                                                });
                                            }}
                                            variant="outlined"
                                        >
                                            +  
                                        </Button>,
                                            endAdornment: <Button
                                                        title="-1"
                                                        aria-label="-1"
                                                        size="medium" 
                                                        style={{border:0}}
                                                        onClick={()=>{
                                                            var service = this.state.services_taken[this.state.selectedRowServiceindex];
                                                            service.qty = service.qty > 1 ? Number(service.qty)-1 : 1;
                                                            service.subtotal = service.qty*service.perunit_cost;
                                                            var services = this.state.services_taken;
                                                            services[this.state.selectedRowServiceindex] = service;
                                                            this.setState({services_taken: services, selectedRowService:service}, ()=>{
                                                                this.calculateTotal()
                                                            });
                                                        }}
                                                        variant="outlined"
                                                    >
                                                        -  
                                                    </Button>
                                          ,
                                        }} 
                                    />

                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={12} style={{display:'flex',marginTop: 20}}> 
                    </Grid>
                    
                </Grid>
            </Grid>}
            {this.state.menu_selected_id===3 && <Grid item xs={8}>
                <Grid item xs={12} style={{ flexWrap:'wrap',padding: 20}}>
                    <Grid item xs={12}>
                        <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{maxHeight:'70px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}>
                        <b>Original Price: &nbsp; {this.state.selectedRowService.servicedetail.price}</b> 
                         <br/><br/>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <TextFieldContent id="service_price" 
                        required 
                        type="number"
                        name="service_price"  
                        label="Service Price" 
                        value={this.state.selectedRowService.perunit_cost} 
                        onChange={(e)=>{
                            this.handlechangeService_price(e);
                        }}
                        onKeyDown={(e)=>{
                            this.handlekeypress(e)
                        }}
                        fullWidth 
                        style={{color:  '#134163'}}
                        
                        />
                    </Grid> 
                </Grid>
            </Grid> }

            
            { this.state.menu_selected_id===6  && <Grid item xs={8}>
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap', marginTop:'1rem' , padding:'10px'}}> 
                    <TextareaAutosizeContent 
                        fullWidth
                        label="Service Notes"
                        name="Service Notes" 
                        id="Service Notes"
                        rows={20}
                        required
                        multiline
                        variant="standard"
                        value={this.state.selectedRowService.requestNotes}
                        onChange={(e) => {
                            var service = Object.assign({},this.state.selectedRowService);
                            //////console.log(service);
                            service["requestNotes"]=e.target.value.substring(0,200);
                            var services = Object.assign([], this.state.services_taken);
                            services[this.state.selectedRowServiceindex] = service;
                            this.setState({services_taken: services, selectedRowService:service}, function() {

                                // //console.log("saving notes...",this.state.services_taken)
                            });
                        }} 
                    />
                </Grid>  

                <Grid item xs={12}>
                        <Button style={{marginLeft: 10 , background:'#134163', color:'#fff'}} onClick={()=>{
                            var list = this.state.services_taken;
                            var service = this.state.services_taken[this.state.selectedRowServiceindex];
                            service["isSpecialRequest"] = 0;
                            service["requestNotes"] = '';
                            list[this.state.selectedRowServiceindex] = service;
                            this.setState({services_taken : list, selectedRowService: service, menu_selected_id: -1});
                        }}  variant="contained">Remove Request</Button>
                </Grid>
            </Grid>}


            {this.state.menu_selected_id===7 && <Grid item xs={8}>
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap'}}>
                    {this.state.discount_list.map((dis, index) => (   
                            <Grid item xs={6} onClick={(e) => this.handlechangeDiscount(dis, e)}
                            //  style={{height: 98, display:'flex', alignItems:'center', justifyContent:'center',
                            //  border:this.state.selectedRowService.discount.discount_id === dis.id ? '2px solid #bee1f7': '2px solid #f0f0f0',
                            //  padding: 5,cursor:'pointer',background: this.state.selectedRowService.discount.discount_id === dis.id ? '#bee1f7':'transparent', 
                             
                            //  textTransform:'capitalize', color: '#000'}}>

                            style={{border:'2px solid #f0f0f0',display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', 
                            alignItems:'center', justifyContent:'center',cursor:'pointer', border:this.state.selectedRowService.discount.discount_id === dis.id ? '2px solid #bee1f7': '2px solid #f0f0f0',background: this.state.selectedRowService.discount.discount_id === dis.id ? '#bee1f7':'transparent'}}>

                                    <Typography id="modal-modal-title" variant="subtitle2"  style={{maxHeight:'60px', overflow:'hidden', 
                                    
                                    textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                                    align="center"> 
                                        {dis.name}<br/>
                                        {dis.discount_type === 'percentage' ? dis.discount_value+"%" : "$"+dis.discount_value}
                                    </Typography>
                             </Grid>  
                             
                    ))}
                </Grid>  
            </Grid> }

            {this.state.menu_selected_id===8 && <Grid item xs={8}>
                <Grid item xs={12} style={{display:'flex', flexWrap:'wrap',padding: 0}}>  
                    {this.state.businesstaxes.map ((v,index)=>(
                        <Grid item xs={6}   alignItems='center'
                        justify="center" justifyContent="center" onClick={(e) => this.handleCheckbox(e, v)} 
                        // style={{height: 98,  display: "flex", flexDirection: 'column',alignItems:'center', justifyContent:'center',
                        // border:this.isTaxCheck(v.id) ? '2px solid #f0f0f0': '2px solid #f0f0f0',
                        // padding: 5,cursor:'pointer',background: this.isTaxCheck(v.id) ? '#bee1f7':'transparent', textTransform:'capitalize', color: '#000'}}>
                        style={{border:'2px solid #f0f0f0',display:'flex',maxHeight:'70px', padding: '10px',margin: '10px',maxWidth: '40%',height: '70px', background: this.isTaxCheck(v.id) ? '#bee1f7':'transparent',
                        alignItems:'center', justifyContent:'center',cursor:'pointer'}}>
                        
                        <Grid item  style={{background: 'transparent'}}>
                            <Typography id="modal-modal-title" variant="subtitle2"  
                            style={{maxHeight:'60px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                            align="center"> 
                            {v.tax_name} 
                            </Typography>

                            <Typography id="modal-modal-title" variant="subtitle2"  
                            style={{maxHeight:'60px', overflow:'hidden', textOverflow:'ellipsis', MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
                            align="center"> 
                            {(v.tax_type=="percentage")?v.tax_value+"%":"$"+v.tax_value} 
                            </Typography>
                            </Grid>

                        </Grid>  
                    ))}
                </Grid>
            </Grid>}

        </Grid>
    </Grid> 
        
    )
}

renderCloseButton() {
    return(
        <IconButton
        edge="end"
        
        onClick={()=>this.handleOpenTicketAlert()}
        aria-label="close"
        style={{"color":'#8C8C8C',marginLeft: 20}}
        >
        <CloseIcon />
        </IconButton>
    )
}

render() {
    var isDisabled = false
   
   var defaultprinter =  window.localStorage.getItem('defaultprinter') || ''

   if(this.props.ticketSelected !== undefined) {
       if(this.props.ticketSelected.paid_status === "paid") {
        isDisabled = true 
       } 
   }

    return (
       
        <div style={{height:'100%'}}>
            {!this.state.dateerror && <div>

                    <Grid item xs={12} spacing={2} style={{display:'flex',paddingTop: 20, paddingLeft: 20, paddingRight: 20, background:'#fff'}}   alignItems="center">

                        <Grid item xs={9}  style={{display:'flex'}} alignItems="center">
                        

                        <span style={{display: 'inline-block',whiteSpace: 'nowrap',overflow: "hidden",textOverflow: "ellipsis",maxWidth: 150,background: isDisabled? '#DCDCDC':'#134163', color: isDisabled?'#9C9C9C':'#ffffff',
                        borderRadius: 10,paddingLeft: 30, paddingRight: 30,paddingTop: 20,paddingBottom: 20,cursor: 'pointer', fontSize: 16,fontFamily: 'sans-serif'}}  onClick={()=>{
                            if(!isDisabled) {
                                this.openTechnician()
                            }
                        }}  > 
                            {(this.state.selectedTech != undefined || this.state.selectedTech != null) ? this.state.selectedTech.firstName+" "+this.state.selectedTech.lastName: ""}
                        </span>

                        <span style={{marginLeft: 20,display: 'inline-block',whiteSpace: 'nowrap',overflow: "hidden",textOverflow: "ellipsis",maxWidth: 200,background: isDisabled?
                        '#DCDCDC':'#134163', color: isDisabled?'#9C9C9C':'#ffffff',
                        borderRadius: 10,paddingLeft: 30, paddingRight: 30,paddingTop: 20,paddingBottom: 20,cursor: 'pointer', fontSize: 14,fontFamily: 'sans-serif'}}  onClick={()=>{
                            if(!isDisabled){
                                if(Object.keys(this.state.customer_detail).length>0) {
                                    this.openCustomerDetail()
                                }
                                else {
                                    this.selectCustomer()
                                }
                            } 
                        }}  
                        >
                        {Object.keys(this.state.customer_detail).length===0 ? "Select Customer": this.state.customer_detail.name}
                        </span>

                        <AccountCircleIcon fontSize="large" style={{marginLeft: 20, cursor: 'pointer', color: isDisabled?'#DCDCDC':'#000000'}} 
                        onClick={()=>{
                                if(!isDisabled) {
                                    this.selectCustomer()
                                }
                                
                        }}/>

                        
                        </Grid>

                        <Grid item xs={3} style={{display:'flex', background: 'white'}} justify="flex-end" alignItems="center">
                        {/* TICKET ID starts*/}
                            
                            {/* <div style={{marginLeft: 20,paddingTop: 15,paddingBottom: 15,paddingLeft: 20, background: '#E8E8E8',borderWidth:2,borderStyle: 'solid',borderColor: '#DFDFDF',
                                paddingRight: 20,textTransform: 'none', borderRadius: 10, fontSize: 15}}>
                                <Typography id="modal-modal-title" variant="h6"  align="center" >
                                    TID - # {this.state.ticketCode}
                                </Typography>
                            </div> */}

                            <div style={{marginLeft: 20, fontSize: 12}}>
                                <Typography  fontSize="14"  align="center" maxWidth="90 px">
                                    TID - # {this.state.ticketCode}
                                </Typography>
                            </div>
                            
                            
                            {this.renderCloseButton()}
                            
                        </Grid>  
                    </Grid>             
                <Card>
                    <CardContent style={{paddingBottom:'0', paddingLeft:0, paddingRight:0}}>
                        
                    {/* select technician */}
                    <Grid container spacing={0}>

                        <Grid item xs={7} style={{background: 'white',height: '100%', }}>

                        

                            {/* /**service & price detail */}
                            <Grid item xs={12} spacing={0} style={{marginTop: -20, height: '100%',marginRight: -20, width: '100%', background: ''}}>
                                <Grid >
                                    {this.renderSelectedServices(isDisabled)}
                                </Grid>
                                <Grid style={{background: ''}}>
                                
                                    {this.renderPriceDetails()}
                                </Grid>
                                <Grid>
                                    {this.renderButtons(isDisabled)}
                                </Grid>
                            </Grid>

                    
                        </Grid>

                        <Grid item xs={5} style={{background: 'white', height: '100%', overflow: 'hidden'}}>
                            {/* /** Services side menu */}
                            {this.state.selectedRowServiceindex === -1 && 
                                    this.renderServicesList(isDisabled)
                            }
                            {/* technicians side menu */}
                            {this.state.selectedRowServiceindex !== -1 && 
                                    this.renderServiceContent()
                            }
                        </Grid>
                    
                        
                    </Grid>

                    </CardContent>
                </Card>


                

                
        {this.state.toggleOpen && <div>
            <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                </div>
                <div style={{background:'#fff', height:'80%', width:'700px', margin:'5% auto 0', position:'relative', borderRadius: 10}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={10}>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="center"  style={{"color":'#134163'}}>Add New Customer</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="center" style={{cursor:'pointer'}} onClick={() => this.handleCloseCustomer()}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid> 

                        </Grid>
                    </Grid>
                    
                    <AddCustomer afterSubmit={()=>{this.handleCloseCustomer(); this.getCustomerList()}}/>
                </div>
            </div>
        </div> }

        {/* validations for select service , technicians */}
        {this.state.snackbarOpen &&  <AlertModal title="Alert" msg="Please Select Services !" handleCloseAlert={()=>this.handleCloseAlert()}/>}

        {/* validations for select service , technicians */}
        {this.state.printalert &&  <AlertModal title="Alert" msg="No printers added yet." handleCloseAlert={()=>this.setState({printalert:false})}/>}
            
            {this.state.ticketcloseAlert_Open && <div>
                                <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                                    </div>
                                    <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative', borderRadius: 10}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Grid item xs={10}>
                                                <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163'}}>Confirmation</Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography variant="subtitle2" align="center" style={{cursor:'pointer'}} onClick={()=>this.handleCloseTicketAlert()}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                                            </Grid> 

                                        </Grid>
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to leave ?</Typography>
                                        </Grid>
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Grid item xs={8}></Grid>
                                            <Grid item xs={4} style={{display: 'flex'}}>
                                                <Button style={{marginRight: 10 , background:'#134163', color:'#fff'}} onClick={()=>this.handleClosePopup()}  variant="contained">Yes</Button>
                                                <Button style={{marginRight: 10 , background:'#134163', color:'#fff'}} onClick={()=>this.handleCloseTicketAlert()}  variant="contained">No</Button>
                                            </Grid> 
                                        </Grid>
                                    </Grid>

                                    </div>

                                </div>
                            </div> }



            {this.state.ticketserviecloseAlert_Open && <div>
                <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                    </div>
                    <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative', borderRadius: 10}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={10}>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163'}}>Confirmation</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="center" style={{cursor:'pointer'}} onClick={()=>this.handleCloseTicketServiceAlert()}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid> 

                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to remove this service ?</Typography>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4} style={{display: 'flex'}}>
                            
                                <Button style={{marginRight: 10}} onClick={()=>this.handleTicketServiceAlert()} color="secondary" variant="contained">Yes</Button>
                                <Button onClick={()=>this.handleCloseTicketServiceAlert()} color="secondary" variant="outlined">No</Button>
                            </Grid>
                            {/* <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="right" style={{marginRight:20}}>Please Select Technicians for your Services !</Typography> */}
                        </Grid>
                    </Grid>

                    </div>

                </div>
            </div> }

        {/* Notes popup */}
        {this.state.addNotes_popup &&
        <NotesModal handleCloseAddNotes={()=>this.handleCloseAddNotes()} notes={this.state.notes} handlechangeNotes={(e)=>this.handlechangeNotes(e)} saveNotes={()=>this.saveNotes()}/>
        }

        {/* Discounts popup */}
        {this.state.addDiscount_popup &&
        <DiscountTicketModal handleCloseAddDiscounts={()=>this.handleCloseAddDiscounts()} ticket_discount_selected={this.state.ticket_discount_selected} ticket_grandTotal={this.state.totalamount} discount_list={this.state.discount_list} afterSubmitDiscount={(msg,disInput, opt)=>{this.handleCloseDiscounts(msg,disInput, opt); }}/>
        }

        {/* Tips popup */}
        {this.state.addTips_popup &&
        <TicketTipsModal handleCloseAddTips={()=>this.handleCloseAddTips()} 
        employee_list={this.state.employee_list} afterSubmitTips={(msg,tipsInput)=>{this.handleCloseTips(msg,tipsInput); }} 
        service_selected={this.state.services_taken} total_tips={this.state.tips_totalamt} tips_percent={this.state.tips_percent} tips_type={this.state.tips_type}/>
        }

        {/* Vaiable price popup */}
        {this.state.priceVariablePopup &&
        <VariablePriceModal handleClose={()=>this.handleCloseVariablePricePopup()} service={this.state.selectedservice} afterSubmitVariablePrice={(value)=>{this.afterSubmitVariablePrice(value) }}/>
        }


        {/* Within service void button popup */}
        {this.state.voidalertOpen && <VoidModal handleCloseVoidAlert={() => this.handleCloseVoidAlert()} updateVoidTicket={()=>this.updateVoidTicket()} 
        title="Alert" msg="Are You Sure To Void This Ticket ?"/> } 

        {/* Select cusotmer popup */}
        {this.state.isSelectCustomerEnabled && <div>
            <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                </div>
                <div style={{background:'#fff', height:'80%', width:'900px', margin:'5% auto 0', position:'relative', borderRadius: 10}}> 
                    <SelectCustomer customerDetail={this.state.customer_detail} handleCloseCustomer={()=>this.handleCloseCustomer()} afterSubmit={()=>{this.handleCloseCustomer()}} onSelectCustomer={this.onSelectCustomer}/>
                </div>
            </div>
        </div>}


        {/* Select technician popup */}
        {this.state.isSelectTechnician && <div>
            <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                </div>
                <div style={{background:'#fff', height:'80%', width:'900px', margin:'5% auto 0', position:'relative', borderRadius: 10}}>
                
                    <ModalTitleBar onClose={()=>this.handleCloseTechnician()} title="Select Technician"/>

                    <SelectTechnician afterSubmit={()=>{this.handleCloseTechnician()}} onSelectTech={this.onSelectTechnician} technician={this.state.clockin_emp_list}/>
                </div>
            </div>
        </div>}

        {/* Select customer detail popup */}
        {this.state.isSelectCustomerDetail &&
            <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
            </div>
            <div style={{background:'#fff', width:'900px', margin:'10% auto 0', position:'relative'}}>
                
                {/* <ModalTitleBar onClose={()=>this.closeCustomerDetail()} title="Customer Detail"/> */}
            
                <CustomerDetailModal open={this.state.isSelectCustomerDetail} onClose={()=>this.closeCustomerDetail()} 
                    handleClosePayment={(msg)=>this.closeCustomerDetail()} customerDetail={this.state.customer_detail}></CustomerDetailModal>

            </div>
            </div>
        }
        {/* </div>} */}
        {/* Split Item popup */} 
        {this.state.menu_selected_id === 5 && this.state.clockin_emp_list.length > 1 && this.state.disableerror === '' &&
        <TicketServiceSplitModal handleCloseSplit={()=>this.handleCloseSplit([])} employee_list={this.state.clockin_emp_list} 
        afterSubmit={(splitted)=>{  this.handleCloseSplit(splitted); }} service_selected={this.state.selectedRowService} />
        }
        {/** Make special request */}
        {this.state.menu_selected_id === 6 && this.state.ticketrequestAlert_Open && <div>
                <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                    </div>
                    <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative', borderRadius:10}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={10}>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163'}}>Confirmation</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="center" style={{cursor:'pointer'}} onClick={()=>this.setState({ticketrequestAlert_Open:false, menu_selected_id:-1})}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid> 

                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to make this service to special request ?</Typography>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4} style={{display: 'flex'}}>
                            
                                <Button style={{marginRight: 10}} onClick={()=>this.handleSpecialrequest()} color="secondary" variant="contained">Yes</Button>
                                <Button onClick={()=>this.setState({ticketrequestAlert_Open:false, menu_selected_id:-1})} color="secondary" variant="outlined">No</Button>
                            </Grid>
                            {/* <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="right" style={{marginRight:20}}>Please Select Technicians for your Services !</Typography> */}
                        </Grid>
                    </Grid>

                    </div>

                </div>
            </div> }
            {this.state.transferpopup && <div>
        <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                    </div>
                    <div style={{background:'#fff', height:'80%', width:'80%', margin:'5% auto 0', position:'relative', borderRadius: 10}}>
                    <Grid container spacing={2} style={{height: '100%'}}>
                    
                        <ModalTitleBar style={{height: 60}} title={"Open Tickets"} onClose={()=>this.setState({transferpopup:false})}/>
                        <Grid item xs={12} style={{padding:10, height: '80%'}}>

                            <div style={{marginRight: 20,width: '100%', textAlign: 'right', float: 'right'}}>
                            <Button style={{marginRight: 10}} onClick={()=>this.createNewTicketWithTransfer()} color="secondary" variant="contained">Create New Ticket</Button>
                            </div>
                        

                            
                            <TableContent style={{ height: '100%', background: ''}}  onRowClick={ this.ontransfer} data={this.state.open_tickets} columns={this.state.columns} />
                        </Grid> 
                    </Grid>

                    </div>

                </div>
        </div>}


        {this.state.confirmtransfer && <div>
                                <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                                    </div>
                                    <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative'}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Grid item xs={10}>
                                                <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20}}>Confirmation</Typography>
                                            </Grid>
                                            <Grid item xs={2}> 
                                            </Grid> 

                                        </Grid>
                                        
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to transfer this service to this ticket ({this.state.rowToTransfer.ticket_code})?</Typography>
                                        </Grid>
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Grid item xs={8}></Grid>
                                            <Grid item xs={4} style={{display: 'flex'}}>
                                                <Button style={{marginRight: 10}} onClick={()=>this.transferService(false)} color="secondary" variant="contained">Yes</Button>
                                                <Button onClick={()=>this.setState({confirmtransfer:false, rowToTransfer:{}})} color="secondary" variant="outlined">No</Button>
                                            </Grid>
                                            {/* <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="right" style={{marginRight:20}}>Please Select Technicians for your Services !</Typography> */}
                                        </Grid>
                                    </Grid>

                                    </div>

                                </div>
                            </div> }
        {this.state.isCombine  && <div>
        <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                    </div>
                    <div style={{background:'#fff', height:'80%', width:'80%', margin:'5% auto 0', position:'relative', borderRadius: 10}}>
                    <Grid container spacing={2}  style={{height: '100%'}}>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={10}>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163'}}>Open Tickets</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="right" style={{cursor:'pointer', marginRight:'1rem'}} onClick={()=>this.setState({isCombine:false})}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid> 

                        </Grid>
                        <Grid item xs={12} style={{padding:10, height: '80%'}}> 
                            <TableContent  style={{ height: '100%', background: ''}}  onRowClick={ this.onCombine} data={this.state.open_tickets} columns={this.state.columns} />
                        </Grid> 
                    </Grid>

                    </div>

                </div>
        </div>}

        {this.state.confirmcombine && <div>
                                <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                                    </div>
                                    <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative'}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Grid item xs={10}>
                                                <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20}}>Confirmation</Typography>
                                            </Grid>
                                            <Grid item xs={2}> 
                                            </Grid> 

                                        </Grid>
                                        
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Are you sure to combine all the services to this ticket ({this.state.rowToTransfer.ticket_code})?</Typography>
                                        </Grid>
                                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                            <Grid item xs={8}></Grid>
                                            <Grid item xs={4} style={{display: 'flex'}}>
                                                <Button style={{marginRight: 10}} onClick={()=>this.combineService()} color="secondary" variant="contained">Yes</Button>
                                                <Button onClick={()=>this.setState({confirmcombine:false, rowToTransfer:{}})} color="secondary" variant="outlined">No</Button>
                                            </Grid>
                                            {/* <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="right" style={{marginRight:20}}>Please Select Technicians for your Services !</Typography> */}
                                        </Grid>
                                    </Grid>

                                    </div>

                                </div>
                            </div> }
        {this.state.disableerror != '' && <div>
                    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                    </div>
                    <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative', borderRadius:10}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Grid item xs={10}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163'}}>Error</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography variant="subtitle2" align="center" style={{cursor:'pointer'}} onClick={()=>this.setState({ticketrequestAlert_Open:false, menu_selected_id:-1})}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                                    </Grid> 

                                </Grid>
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>{this.state.disableerror}</Typography>
                                </Grid>
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Grid item xs={8}></Grid>
                                    <Grid item xs={4} style={{display: 'flex', justifyContent:'flex-end'}}>
                                        <Button style={{marginRight: 10}} onClick={()=>this.setState({disableerror:''})} color="secondary" variant="contained">OK</Button> 
                                    </Grid>
                                    {/* <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="right" style={{marginRight:20}}>Please Select Technicians for your Services !</Typography> */}
                                </Grid>
                            </Grid>
                    </div>

                </div>
                            </div> }
        {/* Payment popup */}
        {/* <PaymentModal open={this.state.openPayment} onClose={()=>this.handleClosePayment('')} 
        handleClosePayment={(msg)=>this.handleClosePayment(msg)} ticketDetail={this.state.ticketDetail}>
            
        </PaymentModal>  */}

        {/* Discounts popup */}
        {this.state.openPayment &&
        <PaymentModal open={this.state.openPayment} onClose={()=>this.handleClosePayment('')} 
        handleClosePayment={(msg)=>this.handleClosePayment(msg)} ticketDetail={this.state.ticketDetail}>
            
        </PaymentModal> 
        }

        {/* /*** Transfer single service */ }

        {this.state.transferAlert && <div>
                <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                    <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                    </div>
                    <div style={{background:'#fff', height:'180px', width:'500px', margin:'20% auto 0', position:'relative', borderRadius: 10}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={10}>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163'}}>Confirmation</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="center" style={{cursor:'pointer'}} onClick={()=>this.handleCloseTransferAlert()}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid> 

                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>Transfering this service will void the existing ticket (TID - # {this.state.ticketCode}) ? </Typography>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4} style={{display: 'flex'}}>
                            
                                <Button style={{marginRight: 10}} onClick={()=>this.handleTransferAlert()} color="secondary" variant="contained">Yes</Button>
                                <Button onClick={()=>this.handleCloseTransferAlert()} color="secondary" variant="outlined">No</Button>
                            </Grid>
                            {/* <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="right" style={{marginRight:20}}>Please Select Technicians for your Services !</Typography> */}
                        </Grid>
                    </Grid>

                    </div>

                </div>
            </div> }
            </div>}
            {this.state.dateerror &&  <Card style={{height:'100%', display:'flex' , alignItems:'center', justifyContent:'center'}}>
                    <CardContent style={{paddingBottom:'0', paddingLeft:0, paddingRight:0}}>
                   <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                                <Typography variant="h4" style={{color:"#999"}}>There's an issue with your system clock.</Typography>
                                                <Typography variant="subtitle2" style={{color:"#999", marginBottom:'1rem'}}>We recommend that you check your system settings, adjust date and time and then try again.  </Typography>
                                                <Button variant="contained" onClick={()=>{
                                                    this.loadData()
                                                }}>Reload</Button>
                                            </div>
                                            </CardContent>
                                            </Card>
                                        }

{this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
</div>
       
    )
}


}