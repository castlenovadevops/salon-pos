import React from 'react';
import { Grid, Typography, Button, Card, CardContent } from '@material-ui/core/'; 

// import CallSplit from '@mui/icons-material/CallSplit';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import { Checkbox } from '@material-ui/core';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import SearchBar from "material-ui-search-bar";
// import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import TextareaAutosizeContent from '../../../components/formComponents/TextAreaAutosize';
import Moment from 'moment';
// import TableContent from '../../../components/formComponents/DataGrid';
// import TextFieldContent from '../../../components/formComponents/TextField' 

import DataManager from '../../../controller/datacontroller';
import TicketController from '../../../controller/TicketController';

import LoadingModal from '../../../components/Modal/loadingmodal'; 
import AlertModal from '../../../components/Modal/alertModal';
import ModalTitleBar from '../../../components/Modal/Titlebar';
import DateErrorComponent from './ticketcommon/dateerror';
import TopBarComponent from './ticketcommon/topbar';
import ServiceMenuComponent from './ticketcommon/servicemenulist';
import ServiceListComponent from './ticketcommon/serviceslist';
import SelectedServicesComponent from './ticketcommon/selectedservices';
import TicketTotalComponent from './ticketcommon/ticketTotal';
import TicketFooterComponent  from './ticketcommon/ticketFooter';
import { QueryFunctions } from './ticketcommon/functions';
import './ticketcommon/css/common.css';  
import { ThirteenMpSharp } from '@mui/icons-material';

export default class CreateTicket extends React.Component {

    ticketController = new TicketController();
    dataManager = new DataManager();
    queryManager = new QueryFunctions();

    constructor(props){
        super(props);
        this.state = {
            isLoading : false, 
            businessDetail:{},
            employeeList:[],
            discountslist: [],
            taxlist:[],
            ticketowner : {},
            clockin_emp_list:[],
            isChanged : false,
            isPaidOnOpen: false,
            customer_detail: {},
            services_taken:[],
            ticketDetail:{},
            ticketcloseAlert : false, 
            servicemenuList:[
                {id:0 , label:"Show Menu" }, 
                {id:1 , label:"Technicians" },
                {id:2 , label:"Transfer" },
                {id:3 , label:"Quantity" },
                {id:4 , label:"Change Price" },
                {id:5 , label:"Void Item" },
                {id:6 , label:"Split Item" },
                {id:7 , label:"Request" },
                {id:8 , label:"Discount" },
                {id:9 , label:"Tax" }
            ],
            selectedMenuIndex:0,
            selectedRowServiceindex: -1,
            selectedRowService:{},
            searchValue:'',
            categoryList:[],
            serviceList:[],
            selectedCategory: 0,
            retailPrice : 0,
            servicePrice: 0,
            subTotal:0,
            taxAmount : 0,
            discountAmount:0,
            grandTotal: 0,
            tipsAmount:0,
            notes:'',
            tipsType:'',
            tipsPercent:'',
            ticketDiscount:{
                discount_id:'',
                discount_type:'',
                discount_value:'',
                discount_amt: 0
            },
            showError: false,
            errormsg:'',
            
            printpopup: false,
            print_data: [], 
            printers_list:[],
            selected_printer: '',
            printalert: false,
            closedticketprint:false,
            printtype:'',
        }
        this.reloadView = this.reloadView.bind(this);
        this.handleCloseTicket = this.handleCloseTicket.bind(this); 
        this.saveTicket= this.saveTicket.bind(this);
        this.selectService = this.selectService.bind(this);
        this.onChangeTechnician = this.onChangeTechnician.bind(this);
        this.onUpdateQuantity = this.onUpdateQuantity.bind(this);
        this.onUpdatePrice = this.onUpdatePrice.bind(this);
        this.onVoidItem= this.onVoidItem.bind(this);
        this.onUpdateSpecialRequest = this.onUpdateSpecialRequest.bind(this);
        this.onUpdateRequestNotes = this.onUpdateRequestNotes.bind(this);
        this.selectServiceDiscount = this.selectServiceDiscount.bind(this);
        this.selectTax = this.selectTax.bind(this);
        this.onSplitClose = this.onSplitClose.bind(this);
        this.UpdateServices = this.UpdateServices.bind(this);
        this.formatService = this.formatService.bind(this);
        this.reloadTicket = this.reloadTicket.bind(this);
        this.saveNotes = this.saveNotes.bind(this);
        this.handleCloseTips = this.handleCloseTips.bind(this);
        this.printTicket = this.printTicket.bind(this)
        this.handleClosePrint = this.handleClosePrint.bind(this)
        this.handleChangePrinter = this.handleChangePrinter.bind(this)
    }

    
    componentDidMount(){ 
        this.reloadView();
    } 

    saveNotes(notes) {
      var details = this.state.ticketDetail;
      details.notes = notes;
      this.setState({ticketDetail: details})
    }

    reloadTicket(ticket){
        this.props.reloadTicket(ticket)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.owner!==prevState.ticketowner && !prevState.isChanged){
            return { ticketowner: nextProps.owner};
        } 
        else return null;
     }


    reloadView(){
        this.setState({isLoading: true}, ()=>{
            
        window.api.getprinters().then(list=>{
            var printers = list.printers;
            this.setState({printers_list: printers, selected_printer: printers.length > 0 ? printers[0] : '' }  ) 
        })  

            var detail = window.localStorage.getItem('businessdetail');
            if(detail !== undefined && detail !== null && detail !== ''){
                this.setState({businessDetail: JSON.parse(detail)}, ()=>{ 
                    console.log(this.state.businessDetail);
                    if(this.props.owner !== undefined){
                        this.setState({ticketowner : this.props.owner}, ()=>{
                            this.getClockedInEmployees();
                        })
                        if(this.props.ticketDetail !== undefined){
                            console.log("#########")
                            console.log(this.props.ticketDetail)
                            console.log("#########")
                            var ticketdetails = Object.assign({}, this.props.ticketDetail);
                            ticketdetails.ticketref_id = ticketdetails.sync_id !== undefined  ? ticketdetails.sync_id : ticketdetails.sync_id;
                            if(ticketdetails.paid_status === 'paid'){
                                this.setState({isPaidOnOpen: true})
                            }
                            this.setState({ticketDetail: ticketdetails},()=>{
                                if(this.props.isTicketEdit){
                                    this.setTicketDetails();
                                }
                            })
                        }
                    }
                })
            }
        })
    } 

    setTicketDetails(){
        if(this.state.ticketDetail.customer_id !== undefined && this.state.ticketDetail.customer_id !== null && this.state.ticketDetail.customer_id !== ''){ 
            this.queryManager.getCustomerDetail(this.state.ticketDetail.customer_id).then(res=>{
                if(res.length > 0)
                    this.setState({customer_detail: res[0]})
            })
        }

        this.queryManager.getTicketServices(this.state.ticketDetail.sync_id).then(tres=>{  
            if(tres.length> 0){  
                this.formatService(0, tres)
            }
        }) 
    }

    formatService(idx, services){
        if(idx < services.length){
            var ticketservice = services[idx];
            this.queryManager.getserviceDetail(ticketservice.service_id).then(res=>{
                if(res.length > 0){
                    var service = res[0]; 
                    var obj = {
                        servicedetail : Object.assign({}, service),
                        serviceid: service.id,
                        qty:ticketservice.service_quantity,
                        perunit_cost : ticketservice.perunit_cost,
                        subtotal: ticketservice.service_cost,
                        employee_id: ticketservice.employee_id,
                        discount:{},
                        taxes:[], 
                        taxamount:0,
                        discountamount:ticketservice.total_discount_amount, 
                        isSpecialRequest:  ticketservice.isSpecialRequest,
                        process: ticketservice.process,
                        requestNotes: ticketservice.requestNotes,
                        tips_amount: ticketservice.tips_amount,
                        sort_number: ticketservice.sort_number,
                        serviceref_id: ticketservice.sync_id
                    } 

                    if(ticketservice.discount_id !== null && ticketservice.discount_id !== undefined  && ticketservice.discount_id !== ""){
                        var discountDetail = {"name": ""}
                        this.queryManager.getDiscountDetail(ticketservice.discount_id).then(dres=>{
                            if(dres.length > 0){
                                discountDetail = dres[0]
                                console.log(dres[0], ticketservice)
                            }
                            obj.discount["discount_id"] = ticketservice.discount_id;
                            obj.discount["discount_name"] = discountDetail.name;
                            obj.discount["discount_type"] = ticketservice.discount_type;
                            obj.discount["discount_value"] = ticketservice.discount_value;
                            obj.discount["discount_calculated"] = ticketservice.total_discount_amount;
                            this.queryManager.getServicetax(ticketservice.sync_id).then(res=>{
                                this.formatTax(0, res,obj, idx, services);
                            })
                        })
                    }
                    else{ 
                        this.queryManager.getServicetax(ticketservice.sync_id).then(res=>{
                            this.formatTax(0, res, obj, idx, services);
                        })
                    } 
                }
                else{
                    this.formatService(idx+1, services)
                }
            })
        } 
    }

    formatTax(tidx,serviceTaxes, service, idx, services){
        if(tidx < serviceTaxes.length){ 
            var taxobj = serviceTaxes[tidx];
            service.taxes.push(taxobj); 
            this.formatTax(tidx+1, serviceTaxes, service, idx, services);
        }
        else{ 
            this.calculateTaxForService(0, idx, service, services);
            console.log("TAX CALCULATION START ::: ", service)
        }
    }

    calculateTaxForService(tidx,idx, obj, services){
        if(tidx< obj.taxes.length){
            var taxes = Object.assign([], obj.taxes);
            var t = obj.taxes[tidx];  
            var per_amt = 0;
            var taxamount = obj.taxamount;
            if(t.tax_type === 'percentage'){
                per_amt = (t.tax_value/100) *  Number(obj.subtotal);
                t.tax_calculated = per_amt.toFixed(2); 
                taxamount+=Number(t.tax_calculated);
            }
            else{
                if(t.tax_value !== undefined || t.tax_value !== undefined){ 
                    t.tax_calculated = Number(t.tax_value).toFixed(2);  
                    taxamount+=Number(t.tax_calculated);
                } 
            }  
            taxes[tidx] = t;
            obj.taxes = taxes; 
            obj.taxamount = taxamount;
            this.calculateTaxForService(tidx+1,idx, obj, services);
        }
        else{    
            this.addServiceToTicket(obj);
            this.formatService(idx+1, services) 
        }
    }
    

    getClockedInEmployees(){
        this.queryManager.getClockedInEmployees().then(response=>{
            this.setState({clockin_emp_list: response}, ()=>{ 
                this.getEmployeeList(); 
            })
        })
    }

    getEmployeeList(){
        this.queryManager.getEmployees().then(response=>{
            this.setState({employeeList: response}, ()=>{
                this.getCategories()
            })
        })
    }

    getCategories(){
        this.queryManager.getCategoryList(this.state.searchValue).then(list=>{
            this.setState({categoryList: list, serviceList:[]}, ()=>{
                if(this.state.categoryList.length > 0){
                    this.getServices(this.state.categoryList[0].id);
                }
            });
        })
    }

    getServices(categoryid){
        this.setState({selectedCategory: categoryid}, ()=>{
            this.queryManager.getServiceListByCategory(categoryid, this.state.searchValue).then(results=>{
                this.setState({serviceList: results}, ()=>{
                    this.getDiscounts();
                });
            })
        })
    }


    getDiscounts(){ 
        this.queryManager.getAllDiscounts(this.state.businessDetail.id).then(results=>{
            this.setState({discountslist: results}, ()=>{
                this.getTaxes();
            });
        })
    }
    

    getTaxes(){ 
        this.queryManager.getAllTaxes(this.state.businessDetail.id).then(results=>{
            this.setState({taxlist: results}, ()=>{
                this.setState({isLoading: false})
            });
        })
    }


    addServiceToTicket(service){
        if(!this.props.isTicketEdit)
            service["sort_number"] = this.state.services_taken.length+1;
        var services_taken = Object.assign([], this.state.services_taken);
        services_taken.push(service);
        this.setState({services_taken: services_taken}, ()=>{  
            this.calculateTotal();
        });
    } 

    calculateTotal(){ 
        var price = {
            retailPrice: 0,
            servicePrice: 0,
            subTotal: 0,
            taxAmount: 0,
            grandTotal: 0,
            tipsAmount: 0
        };
        this.calculateTotalindividual(0, price)
    }

    calculateTotalindividual(i, price){
        var retailPrice = Number(price.retailPrice);
        var servicePrice = Number(price.servicePrice);
        var subTotal = Number(price.subTotal);
        var taxamount = Number(price.taxAmount);
        var tipsAmount = Number(price.tipsAmount)
        var grandTotal = Number(price.grandTotal);
        if(i< this.state.services_taken.length){
            var servicedetail = Object.assign({}, this.state.services_taken[i]); 

            if(servicedetail.servicedetail.producttype === 'product'){
                retailPrice +=Number( servicedetail.perunit_cost * servicedetail.qty);
            }
            else {
                servicePrice += Number( servicedetail.perunit_cost * servicedetail.qty);
            }

            subTotal = subTotal + Number( servicedetail.perunit_cost * servicedetail.qty) - Number(servicedetail.discountamount);
            taxamount = taxamount + Number(servicedetail.taxamount);
            tipsAmount = tipsAmount+ Number(servicedetail.tips_amount);
            grandTotal = subTotal + taxamount +tipsAmount;

           var priceupdate = {
                retailPrice: retailPrice,
                servicePrice: servicePrice,
                subTotal: subTotal,
                taxAmount: taxamount,
                tipsAmount: tipsAmount,
                grandTotal: grandTotal
            }; 
            this.calculateTotalindividual(i+1, priceupdate);
        }
        else{
            var ticketdetails = Object.assign({}, this.state.ticketDetail);
            ticketdetails.grand_total = grandTotal;
            ticketdetails.subtotal = subTotal;
            ticketdetails.total_tax = taxamount;
            
            this.setState({
                retailPrice: retailPrice,
                servicePrice: servicePrice,
                subTotal: subTotal,
                taxAmount: taxamount,
                tipsAmount: tipsAmount,
                grandTotal: grandTotal,
                ticketDetail: ticketdetails
            });
        }
        
    }


    
    handleCloseTicket(){
        //check techi 
        const updatedTech = this.state.ticketowner
        const updatedCust = this.state.customer_detail
        const updateServices  = this.state.services_taken 
        if(this.props.isTicketEdit ) { 
            if(this.state.isPaidOnOpen){
                this.props.handleCloseDialog('Saved')
            }
            else if(this.props.ticketDetail.paid_status === "paid") { 
                this.props.handleCloseDialog('Saved')
            }
            else {
                this.saveTicket('close'); 
            }
        } 
        else if(updatedTech.id !==  this.props.owner.id || updatedCust.length>0 || updateServices.length>0) { 
            this.setState({ticketcloseAlert  : true});
        }

        else { 
            this.saveTicket('close');  
        }
    }

    handleCloseTicketAlert(){
        this.setState({ticketcloseAlert: false})
    }

    handleClosePopup(){
        this.props.afterFinished('dashboard');
    }


    selectService(index){
        if(index < this.state.services_taken.length && index >= 0){ 

            var service = this.state.services_taken[index]; 
            if( service.requestNotes === null || service.requestNotes === undefined){
                service["requestNotes"] = '';
            } 
        
            this.setState({ selectedMenuIndex: 1, 
                 selectedRowService:service, 
                 selectedRowServiceindex:index}, function(){  
            })
        }
        else{ 
            this.setState({ selectedMenuIndex: 1, 
                selectedRowService:{}, 
                selectedRowServiceindex:-1}, function(){  
           })
        }
    }

    onChangeTechnician(techid) { 
        var service = this.state.services_taken[this.state.selectedRowServiceindex];
        service.employee_id = techid;
        var services = Object.assign([], this.state.services_taken);
        services[this.state.selectedRowServiceindex] = service;
        this.setState({services_taken: services, selectedRowService: service}); 
    }

    onUpdateQuantity(qty){ 
        var service = this.state.services_taken[this.state.selectedRowServiceindex];
        service.qty = qty;
        service.subtotal = Number(qty) * Number(service.perunit_cost)
        var services = Object.assign([], this.state.services_taken);
        services[this.state.selectedRowServiceindex] = service;
        this.setState({services_taken: services, selectedRowService: service}, ()=>{
            this.calculateTotal()
        }); 
    }

    onUpdatePrice(price){ 
        var service = this.state.services_taken[this.state.selectedRowServiceindex];
        if(price > 0){
            service.perunit_cost = price;
        }
        else{
            service.perunit_cost = service.servicedetail.price
        }
        service.subtotal = Number(service.qty) * Number(service.perunit_cost)
        var services = Object.assign([], this.state.services_taken);
        services[this.state.selectedRowServiceindex] = service;
        this.setState({services_taken: services, selectedRowService: service}, ()=>{
            this.calculateTotal()
        }); 
    }

    onVoidItem(){
        var services = Object.assign([], this.state.services_taken);
        services.splice(this.state.selectedRowServiceindex, 1);
        this.setState({services_taken: services}, ()=>{
            this.selectService(-1)
        });
    }

    onUpdateSpecialRequest(boolval){ 
        var service = this.state.services_taken[this.state.selectedRowServiceindex];
        service.isSpecialRequest = boolval;
        service.requestNotes = '';
        var services = Object.assign([], this.state.services_taken);
        services[this.state.selectedRowServiceindex] = service;
        if(boolval === 0){
            this.setState({selectedMenuIndex: 1})
        }
        this.setState({services_taken: services, selectedRowService: service}); 
    }

    onUpdateRequestNotes(notes){
        var service = this.state.services_taken[this.state.selectedRowServiceindex];
        service.requestNotes = notes;
        var services = Object.assign([], this.state.services_taken);
        services[this.state.selectedRowServiceindex] = service;
        this.setState({services_taken: services, selectedRowService: service}); 
    }

    selectServiceDiscount(discount){
        var discountid = discount.id;
        var service = Object.assign({},this.state.selectedRowService);
        var services = Object.assign([], this.state.services_taken);
        if(this.state.selectedRowService.discount.discount_id !== undefined && this.state.selectedRowService.discount.discount_id === discountid){
            service.discount = {}
            service.discountamount = 0;
            services[this.state.selectedRowServiceindex] = service;
            this.setState({services_taken: services, selectedRowService: service}, ()=>{
                this.calculateTotal();
            });
        }
        else{
            var discountDetail = {
                discount_id: discountid,
                discount_name: discount.name,
                discount_type: discount.discount_type,
                discount_value: discount.discount_value,
                discount_divisiontype: discount.division_type,
                discount_ownerdivision: discount.owner_division,
                discount_empdivision: discount.emp_division,
                discount_calculated: discount.discount_type === 'amount' ? (Number(service.subtotal) - Number(discount.discount_value)) : (Number(service.subtotal) * (Number(discount.discount_value)/100))
            }

            service.discount = discountDetail;
            service.discountamount = discountDetail.discount_calculated;
            service.subTotal = service.subtotal - discountDetail.discount_calculated;

            services[this.state.selectedRowServiceindex] = service;
            this.setState({services_taken: services, selectedRowService: service}, ()=>{
                this.calculateTotal();
            });

        }
    }

    selectTax(tax){
        var service = this.state.selectedRowService
        var existingtaxes = service.taxes.map(t=>t.id.toString());
        if(existingtaxes.indexOf(tax.id) !== -1){
            var idx = existingtaxes.indexOf(tax.id.toString());
            service.taxes.splice(idx,1);
            service.taxamount = 0;
            this.calculateTax(0, service);
        }
        else{
            service.taxes.push(tax);
            service.taxamount = 0;
            this.calculateTax(0, service);
        }
    }

    
    calculateTax(idx, obj){
        if(idx< obj.taxes.length){
            var taxes = Object.assign([], obj.taxes);
            var t = obj.taxes[idx];  
            var per_amt = 0;
            var taxamount = obj.taxamount;
            if(t.tax_type === 'percentage'){
                per_amt = (t.tax_value/100) *  Number(obj.subtotal);
                t.tax_calculated = per_amt.toFixed(2); 
                taxamount+=Number(t.tax_calculated);
            }
            else{
                if(t.tax_value !== undefined || t.tax_value !== undefined){ 
                    t.tax_calculated = Number(t.tax_value).toFixed(2);  
                    taxamount+=Number(t.tax_calculated);
                } 
            }  
            taxes[idx] = t;
            obj.taxes = taxes; 
            obj.taxamount = taxamount;
            this.calculateTax(idx+1, obj);
        }
        else{   
            var services = Object.assign([], this.state.services_taken);
            services[this.state.selectedRowServiceindex] = obj;
            this.setState({services_taken: services, selectedRowService: obj}, ()=>{
                this.calculateTotal();
            });
        }
    }


    onSplitClose(splitted){
        this.setState({isLoading: true}, ()=>{
            if(splitted.length > 0){ 
                var newsplitted =  Object.assign([], splitted);
                var services = Object.assign([], this.state.services_taken);
                services.splice(this.state.selectedRowServiceindex, 1);
                // services.push(...newsplitted)
                newsplitted.forEach((o, i)=>{
                    services.push(o);
                    if(i === newsplitted.length-1){ 
                        this.setState({selectedMenuIndex:0, selectedRowServiceindex: -1, selectedRowService:{},  services_taken:services}, function(){
                            // this.calculateTotal();
                            this.UpdateServices(0);
                        });
                    }
                })
            }
            else{
                this.setState({selectedMenuIndex:0, selectedRowServiceindex: -1, selectedRowService:{}});
            }
        })
    }
    
    UpdateServices(idx){
        if(idx < this.state.services_taken.length){
            var service = Object.assign({}, this.state.services_taken[idx]); 
            service.taxamount = 0; 
            this.calculateServiceTax(0, service, idx);
        }
        else{
            this.setState({selectedMenuIndex:0, selectedRowServiceindex: -1, selectedRowService:{}, isLoading: false});
            this.calculateTotal();
        }
    }

    calculateServiceTax(idx, obj, sidx){
        if(idx< obj.taxes.length){
            var taxes = Object.assign([], obj.taxes);
            var t = Object.assign({}, obj.taxes[idx]); 
            var per_amt = 0;
            var taxamount = obj.taxamount;
            if(t.tax_type === 'percentage'){
                per_amt = (t.tax_value/100) *  Number(obj.subtotal);
                t.tax_calculated = per_amt.toFixed(2); 
                taxamount+=Number(t.tax_calculated);
            }
            else{
                if(t.tax_value !== undefined || t.tax_value !== undefined){ 
                    t.tax_calculated = t.tax_value.toFixed(2);  
                    taxamount+=Number(t.tax_calculated);
                } 
            }  
            taxes[idx] = t;
            obj.taxes = taxes; 
            obj.taxamount = taxamount;
            this.calculateServiceTax(idx+1, obj, sidx);
        }
        else{   
            var services = Object.assign([],this.state.services_taken);
            services[sidx] = obj; 

            this.setState({services_taken: services}, ()=>{
                this.UpdateServices(sidx+1);
            })
        }
    }

    saveTicket(option){ 
        var emps = this.state.services_taken.map(s=>s.employee_id);
        if(emps.indexOf(undefined) !== -1 || emps.indexOf('') !== -1){
            this.setState({errormsg:"Please select technicians."}, ()=>{
                this.setState({showError: true})
            })
        }
        else{
            var obj = Object.assign({}, this.state); 
            this.props.saveTicket(obj, option);
        }
    }

    
printTicket() {
    console.log("printTicket")
    
    var print_data = this.processPrintDetails()
    //////console.log("service_data", service_data)
        var printerName = window.localStorage.getItem('defaultprinter')
        if(printerName !== null &&printerName !== undefined && printerName !== ''){
            this.setState({print_data: print_data}, function() {
                if(this.state.printtype === 'employee'){
                    this.printEmployeeReceipt();
                }
                else{
                    // this.setState({printpopup: true})
                    var subTotal=Number(this.state.totalamount).toFixed(2)
                    var discount=Number(this.state.total_discount).toFixed(2)
                    var tax=Number(this.state.totaltax).toFixed(2)
                    var tips=Number(this.state.tips_totalamt).toFixed(2)
                    var total=Number(this.state.grandTotal).toFixed(2)
                    var ticketid = this.state.ticketCode;
                    ////console.log(printerName);

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
                                value: "<div style='display:flex;flex-direction:column;'><div style='text-align:right;padding-right:10px;'>$"+Number(ser["total"]).toFixed(2)+"</div>"+ser["ratedetails"],
                                css: {  "font-weight": "500","font-size": "12px" },
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
                

                    var data = [];
                    data.push({
                        type: "text", 
                        value: this.state.businessDetail.name,//"TOP PAYMENT SOLUTIONS - Main",
                        style: `text-align:center;`,
                        css: {  "font-weight": "700", "font-size": "16px" },
                        }); 
                    
                    data.push({
                        type: "text", 
                        value: this.state.businessDetail.address1+"<br/>"+ this.state.businessDetail.address2+"<br/>"+this.state.businessDetail.city+"<br/>" +this.state.businessDetail.state+ this.state.businessDetail.zipcode+"<br/>"+ this.state.businessDetail.businessphone, //"3675 CRESTWOOD PKWY STE <br> DULUTH, GA  300965045 <br> 7706804075",
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
                        value:  "<div style='display: flex; justify-content: space-between;'><p >Tips</p> <p>$"+Number(this.state.tips_totalamt).toFixed(2)+"</p> </div>",
                        style: `text-align:left;`,
                        css: { "font-weight": "700", "font-size": "14px","margin-top": -25 },
                    });  

                    data.push({
                        type: "text", 
                        value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+total+"</p> </div>",
                        style: `text-align:left;`,
                        css: { "font-weight": "700", "font-size": "14px","margin-top": -25 },
                    });
                    if(this.state.printtype === 'receipt' || this.state.printtype === 'employee'){//this.state.ticketDetail.paid_status === 'paid'){
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
                        if(this.state.isPaidOnOpen && this.state.printtype === 'employee'){
                            this.printEmployeeReceipt()
                        }
                        // this.setState({closedticketprint: false});
                    })
                }

            })
        }
        else{
            this.setState({closedticketprint:false, printalert:true})
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
            if(printerName !== null &&printerName !== undefined && printerName !== ''){
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
            var tipstotal = response.tipstotal;
            var data = [];
                data.push({
                    type: "text", 
                    value: this.state.businessDetail.name+"<br/>Employee Receipt",//"TOP PAYMENT SOLUTIONS - Main",
                    style: `text-align:center;`,
                    css: {  "font-weight": "700", "font-size": "16px" },
                    }); 
                
                data.push({
                    type: "text", 
                    value: this.state.businessDetail.address1+"<br/>"+ this.state.businessDetail.address2+"<br/>"+this.state.businessDetail.city+"<br/>" +this.state.businessDetail.state+ this.state.businessDetail.zipcode+"<br/>"+ this.state.businessDetail.businessphone, //"3675 CRESTWOOD PKWY STE <br> DULUTH, GA  300965045 <br> 7706804075",
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
                                value: "$"+Number(ser["price"]).toFixed(2),
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
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+Number(total).toFixed(2)+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                });  
                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Tips</p> <p>$"+Number(tipstotal).toFixed(2)+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -25 },
                });  

                data.push({
                    type: "text", 
                    value:  this.state.businessDetail.name+" - Printed: "+Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                    style: `text-align:center;border-bottom:1px dotted #000;margin-top:40px;padding-top:30px;padding-bottom:20px;`,
                    css: {  "font-size": "14px","margin-top":10, "border-bottom":"1px dotted #000"},
                });

                window.api.printdata({printername: printerName, data: data}).then(res=>{ 
                    console.log(res);
                    this.printEmployeeReceiptIndividual(idx+1, emps, printerName)
                })
    }
    else{

        // this.setState({closedticketprint: false});
        console.log("ARRAY COMPLETED")
    }
}



processEmployeePrintDetails(empid) {

    var service_data = []
    var total = 0;
    var tipstotal = 0;
    this.state.services_taken.forEach(( ser,index) => {
        if(ser.employee_id === empid){
            total +=  ser.subtotal;
            tipstotal += ser.tips_amount !== undefined ? Number(ser.tips_amount) : 0;

            service_data.push({
                "name" : ser.servicedetail.name,
                "price":  ser.perunit_cost,
                "total": ser.subtotal, 
                "quantity": ser.qty,
            })
        } 
    })

   return {data: service_data, total:total, tipstotal:tipstotal}

    
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
            tax_detail = (tax_detail.length>0 ? tax_detail  : tax_detail)+"<div style='display:flex;width:100%;justify-content:space-between;'><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+tax["tax_name"]+"</div></div>"
            tax_rate += "<div  style='text-align:right;padding-right:10px;'> $"+tax["tax_percentage"]+"</div>"
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
            discount_detail = (discount_detail.length>0 ? discount_detail : discount_detail)+"<div style='display:flex;width:100%;justify-content:space-between;'><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+tax["discount_name"]+"</div></div>"
            tax_rate += "<div  style='text-align:right;padding-right:10px;'> ($"+Number(tax["discount_price"]).toFixed(2)+")</div>"
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

handleClosePrint() {
    this.setState({printpopup: false})
}

handleChangePrinter(e) {
    var val = e.target.value;
    this.setState({selected_printer: val})
}

handleCloseTips(msg, tipsInput){ 
        //////console.log(tipsInput);
        if(this.props.isTicketEdit !== undefined) {
            //////console.log("iffffff")
            if(this.props.ticketDetail.paid_status === "paid") { 
                if(tipsInput !== undefined){
                    if(tipsInput["tips_type"] !== undefined){ 
                        this.setState({services_taken:tipsInput["service_selected"],
                        tips_type:tipsInput["tips_type"], tips_totalamt:tipsInput["tips_amount"], tips_percent: tipsInput["tips_percent"] }, function(){
                            console.log("TIPS SAEV paid:::::")
                            console.log(this.state.services_taken);
                    //console.log(this.state.services_taken);
                            this.calculateTotal();
                            setTimeout(()=>{ 
                                //////console.log("to be saved")
                                this.saveTicket('')
                            },200)

                        }); 
                    }
                }
            }
            else{
                if(tipsInput !== undefined){
                    if(tipsInput["tips_type"] !== undefined){ 
                        this.setState({services_taken:tipsInput["service_selected"],
                        tips_type:tipsInput["tips_type"], tips_totalamt:tipsInput["tips_amount"], tips_percent: tipsInput["tips_percent"] }, function(){
                            console.log("TIPS SAEV:::::")
                            console.log(this.state.services_taken);
                            this.calculateTotal(); 

                        }); 
                    }
                }
            }
 
        }

        else {
            //////console.log("elseee") 
            if(tipsInput["tips_type"] !== undefined){ 
                this.setState({services_taken:tipsInput["service_selected"],
                 tips_type:tipsInput["tips_type"], tips_totalamt:tipsInput["tips_amount"], tips_percent: tipsInput["tips_percent"], addTips_popup:false}, function(){ 
                      this.calculateTotal();
                }); 
            }
        } 
}

    render(){
        return <div className='fullHeight pagealign' style={{zIndex:9999999}}>

                {this.state.isLoading && <LoadingModal/>} 
                {this.props.dateerror && <DateErrorComponent reloadView={this.reloadView}/>}
                {!this.props.dateerror && <>
                                            <TopBarComponent   isDisabled={this.state.isPaidOnOpen}
                                                ticketDetail={this.state.ticketDetail}
                                                services_taken={this.state.services_taken}
                                                selectedTech={this.state.ticketowner} 
                                                technicianList={this.state.clockin_emp_list} 
                                                setTicketOwner={(empobj)=>{
                                                    this.setState({ isChanged: true}, ()=>{
                                                        this.setState({ticketowner : empobj});
                                                    });
                                                }}
                                                customer_detail={this.state.customer_detail}
                                                selectCustomerDetail={(customer_obj)=>{  
                                                    this.setState({customer_detail : customer_obj}); 
                                                }} 
                                                handleCloseTicket={this.handleCloseTicket} />

                                                <Card className="fullHeight">
                                                    <CardContent className="fullHeight" style={{padding:0}}> 
                                                        <Grid container spacing={0} >

                                                            <Grid item xs={7} style={{background: 'white',height: '100%', }}> 

                                                                {/* /**service & price detail */}
                                                                <Grid item xs={12} spacing={0} style={{  height: '100%',marginRight: -20, width: '100%', background: ''}}>
                                                                    <Grid >
                                                                        <SelectedServicesComponent data={{
                                                                            services_taken: this.state.services_taken,
                                                                            isDisabled: this.state.isPaidOnOpen,
                                                                            selectedRowServiceindex: this.state.selectedRowServiceindex,
                                                                            employeeList: this.state.employeeList,
                                                                            selectService: (index)=>{
                                                                                this.selectService(index)
                                                                            }
                                                                        }} />
                                                                    </Grid>
                                                                    <Grid style={{background: ''}}> 
                                                                       <TicketTotalComponent data={{
                                                                            price:{
                                                                                retailPrice: this.state.retailPrice,
                                                                                servicePrice:  this.state.servicePrice,
                                                                                subTotal:  this.state.subTotal,
                                                                                taxAmount:  this.state.taxAmount,
                                                                                discountAmount:  this.state.discountAmount,
                                                                                tipsAmount:  this.state.tipsAmount,
                                                                                grandTotal:  this.state.grandTotal
                                                                            }
                                                                       }} />
                                                                    </Grid>
                                                                    <Grid>
                                                                        <TicketFooterComponent data={{
                                                                            isDisabled: this.state.isPaidOnOpen,
                                                                            isTicketEdit: this.props.isTicketEdit,
                                                                            services_taken: this.state.services_taken,
                                                                            ticketDetail: this.state.ticketDetail,
                                                                            employee_list: this.state.employeeList, 
                                                                            saveTicket: this.saveTicket,
                                                                            printTicket: (option)=>{
                                                                                this.setState({printtype:option},()=>{
                                                                                    this.printTicket();
                                                                                });
                                                                            },
                                                                            showCloseTicketPrint:()=>{
                                                                                this.setState({closedticketprint: true})
                                                                            },
                                                                            setLoader:(boolval)=>{
                                                                                this.setState({isLoading: boolval})
                                                                            },
                                                                            price:{
                                                                                retailPrice: this.state.retailPrice,
                                                                                servicePrice:  this.state.servicePrice,
                                                                                subTotal:  this.state.subTotal,
                                                                                taxAmount:  this.state.taxAmount,
                                                                                discountAmount:  this.state.discountAmount,
                                                                                tipsAmount:  this.state.tipsAmount,
                                                                                grandTotal:  this.state.grandTotal
                                                                            },
                                                                            closeTicket:()=>{
                                                                                this.props.closeTicket()
                                                                            },
                                                                            saveNotes:(notes)=>{
                                                                                this.saveNotes(notes);
                                                                            },
                                                                            handleCloseTips:(msg, tipsInput)=>{
                                                                                this.handleCloseTips(msg, tipsInput);
                                                                            }
                                                                        }} />
                                                                    </Grid>
                                                                </Grid>

                                                        
                                                            </Grid>

                                                            <Grid item xs={5} style={{background: 'white', height: '100%', overflow: 'hidden'}}>
                                                                {/* /** Services side menu */}

                                                                {this.state.selectedRowServiceindex === -1 &&  
                                                                    <ServiceListComponent data={{
                                                                        employeeId: this.state.ticketowner.id,
                                                                        categoryList: this.state.categoryList,
                                                                        searchValue: this.state.searchValue,
                                                                        serviceList : this.state.serviceList,
                                                                        selectedCategory: this.state.selectedCategory,
                                                                        onSearchText: (text)=>{ 
                                                                            this.setState({searchValue: text}, ()=>{
                                                                                this.getCategories();
                                                                            })
                                                                        },  
                                                                        getServices: (categoryid)=>{
                                                                            this.getServices(categoryid)
                                                                        },
                                                                        isDisabled:this.state.isPaidOnOpen,
                                                                        addServiceToTicket: (service)=>{
                                                                            this.addServiceToTicket(service);
                                                                        }
                                                                    }} />
                                                                } 

                                                               {this.state.selectedRowServiceindex !== -1 &&  <ServiceMenuComponent selectedRowService={this.state.selectedRowService} menulist={this.state.servicemenuList} selectedMenuIndex={this.state.selectedMenuIndex} selectMenu={(index)=>{
                                                                    this.setState({selectedMenuIndex: index});
                                                               }}  data={{
                                                                ticketowner: this.state.ticketowner,
                                                                ticketDetail: this.state.ticketDetail,
                                                                services_taken:this.state.services_taken,
                                                                selectedRowServiceIndex: this.state.selectedRowServiceIndex,
                                                                clockin_emp_list: this.state.clockin_emp_list, 
                                                                discountslist: this.state.discountslist,
                                                                taxlist: this.state.taxlist,
                                                                selectService: this.selectService,
                                                                onChangeTechnician: this.onChangeTechnician,
                                                                onUpdateQuantity : this.onUpdateQuantity,
                                                                onUpdatePrice : this.onUpdatePrice,
                                                                onVoidItem: this.onVoidItem,
                                                                onUpdateRequestNotes: this.onUpdateRequestNotes,
                                                                onUpdateSpecialRequest : this.onUpdateSpecialRequest,
                                                                onSelectServiceDiscount : this.selectServiceDiscount,
                                                                selectTax: this.selectTax,
                                                                onSplitClose: this.onSplitClose,
                                                                reloadTicket: this.reloadTicket
                                                               }} /> }

                                                            </Grid>
                                                        
                                                            
                                                        </Grid>

                                                    </CardContent>
                                                </Card>


                </>}

                                            
                {this.state.ticketcloseAlert && <div>
                     <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container' style={{height:'185px', width:'450px', marginTop:'calc(35% - 92.5px)'}}> 
                                <Grid container spacing={2}>
                                    
                                <ModalTitleBar onClose={()=>this.handleCloseTicketAlert()} title="Confirmation"/> 
                                    <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                        <Typography id="modal-modal-title" variant="subtitle2"  component="h2" align="left" style={{marginLeft:20}}>Are you sure to leave ?</Typography>
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
                </div>
                }

                
                    {this.state.showError &&  
                        <div className="modalbox">
                            <div className='modal_backdrop'>
                            </div>
                            <div className='modal_container' style={{height:'180px', width:'500px'}}> 
                                <ModalTitleBar onClose={()=> this.props.selectMenu(1) } title="Error"/>  
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Typography id="modal-modal-title" variant="subtitle2" component="h2" align="left" style={{marginLeft:20}}>{this.state.errormsg}</Typography>
                                </Grid>
                                <Grid item xs={12} style={{display:'flex',marginTop:10}}>
                                    <Grid item xs={8}></Grid>
                                    <Grid item xs={4} style={{display: 'flex'}}>  
                                        <Button onClick={()=>{this.setState({showError: false, errormsg:''})}} color="secondary" variant="outlined">OK</Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    }

                {/* validations for select printers */}
                {this.state.printalert &&  <AlertModal title="Alert" msg="No printers added yet." handleCloseAlert={()=>this.setState({printalert:false})}/>}

                {this.state.closedticketprint && <div>
                    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute'}}>
                        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                        </div>
                        <div style={{background:'#fff', height:'350px', width:'400px', margin:'calc(25% - 175px) auto 0', position:'relative', borderRadius: 10}}>
                        <Grid container spacing={2}>
                                <Grid item xs={2}></Grid>
                            <Grid item xs={8} style={{display:'flex', flexDirection:'column', alignItems:'center',marginTop:10}}>
                                <Grid item xs={12} style={{margin:'1rem 0', width:'100%', textAlign:'center', cursor:'pointer'}}>
                                    <Button  onClick={()=>{
                                    this.setState({printtype:'bill'}, ()=>{
                                        this.printTicket()
                                    })
                                }} color="secondary" style={{textTransform:'capitalize', width:'100%', height:'75px'}} variant="contained">Print Bill</Button>
                                    {/* <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163', border:'1px solid #f0f0f0', padding:'8px', display:'flex', alignItems:'center', justifyContent:'flex-start'}}>Print Bill</Typography> */}
                                </Grid>  
                                <Grid item xs={12} style={{margin:'1rem 0',width:'100%', textAlign:'center', cursor:'pointer'}}>
                                <Button  onClick={()=>{
                                    this.setState({printtype:'receipt'}, ()=>{
                                        this.printTicket()
                                    })
                                }} color="secondary" style={{textTransform:'capitalize', width:'100%', height:'75px'}} variant="contained">Print Receipt</Button>
                                {/* <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163', border:'1px solid #f0f0f0', padding:'8px', display:'flex', alignItems:'center', justifyContent:'flex-start'}}>Print Receipt</Typography> */}
                                </Grid>  
                                <Grid item xs={12} style={{margin:'1rem 0',width:'100%', textAlign:'center', cursor:'pointer'}}>
                                    <Button  onClick={()=>{
                                    this.setState({printtype:'employee'}, ()=>{
                                        this.printTicket()
                                    })
                                }} color="secondary" style={{textTransform:'capitalize', width:'100%', height:'75px'}} variant="contained">Print Employee Receipt</Button>
                                    {/* <Typography id="modal-modal-title" variant="h6" component="h2" align="left" style={{marginLeft:20, "color":'#134163', border:'1px solid #f0f0f0', padding:'8px', display:'flex', alignItems:'center', justifyContent:'flex-start'}}>Print Employee Receipt</Typography> */}
                                </Grid>  
                            </Grid> 
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="center" style={{cursor:'pointer'}} onClick={()=>this.setState({closedticketprint:false, printtype:''})}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid> 
                        </Grid>

                        </div>

                    </div>
                </div>
                }
                

        </div>
    }




}