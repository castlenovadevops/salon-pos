import React from 'react';
import axios from 'axios';
import { Typography, Grid } from '@mui/material';
import config from '../../config/config';
// components
import DataManager from '../../controller/datacontroller'; 
import TicketManager from '../../controller/TicketManager';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import LoadingModal from '../../components/Modal/loadingmodal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AppBarContent from '../TopBar';
import DrawerContent from '../Drawer';
import LoaderContent from '../../components/formComponents/LoaderDialog';

import { Card, Stack, Container , Button} from '@mui/material';
import * as Moment from 'moment';
import TicketController from '../../controller/TicketController';

export default class SettingsSync extends React.Component {
    dataManager = new DataManager();
    ticketController = new TicketController()
    constructor(props) {

        super(props)
        this.state = {
            dataManager: new DataManager(), 
            progress: 0,
            isLoading: false,
            isFinished: false,
            downloadinMessage: '',
            isOnline: false,
            businessdetail: {},
            TicketManager: new TicketManager(this.props), 
            mastertables: []
        }
        this.dataManager = new DataManager()
        this.handleClose = this.handleClose.bind(this)
        this.logout = this.logout.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handlePageEvent = this.handlePageEvent.bind(this);
    }

    handleClick() {
        // ////console.log(event.target)
        this.setState({ anchorEl: null, openMenu: true, editForm: false, addForm: false });
    }

    handleClose(msg) {
        this.setState({ addForm: false, editForm: false }, function () {
            if (msg !== '') {

            }

        })
    }
    handleCloseMenu() {
        this.setState({ anchorEl: null, openMenu: false });
    }
    handlePageEvent(pagename) {
        this.props.onChangePage(pagename);
    }


    handleClickInvent(opt) {
        if (opt === 'inventory')
            this.setState({ expand_menu_show: !this.state.expand_menu_show });
        if (opt === 'settings')
            this.setState({ setting_menu_show: !this.state.setting_menu_show });
    }

    logout() {
        window.localStorage.removeItem("employeedetail")
        window.location.reload();
    }

    componentDidMount() { 
        let detail = window.localStorage.getItem("businessdetail");
        this.setState({ businessdetail: JSON.parse(detail) })
        console.log("did mount")
        this.setState({mastertables:[
            {
                name: "users",
                tablename: 'users',
                progressText: "Synchronizing Staffs...",
                progresscompletion: 10,
                url: config.root + "/employee/" + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/inventory/category/saveorupdate'
            },
            {
                name: "category",
                tablename: 'category',
                progressText: "Synchronizing Categories...",
                progresscompletion: 10,
                url: config.root + "/inventory/category/" + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/inventory/category/saveorupdate'
            },
            {
                name: "default_commission",
                tablename: 'default_commission',
                progressText: "Synchronizing Commission...",
                progresscompletion: 10,
                url: config.root + `/settings/default_commission/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:''
            } ,

            {
                name: "default_discount_division",
                tablename: 'default_discount_division',
                progressText: "Synchronizing Discount Division...",
                progresscompletion: 10,
                url: config.root + `/settings/default_discount/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:''
            } ,

            {
                name: "employee_salary",
                tablename: 'employee_salary',
                progressText: "Synchronizing Salary Division...",
                progresscompletion: 10,
                url: config.root + `/settings/employee_salary/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:''
            } ,
            {
                name: "taxes",
                tablename: 'taxes',
                progressText: "Synchronizing Taxes...",
                progresscompletion: 10,
                url: config.root + `/tax/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/tax/saveorupdate'
            } ,
            {
                name: "customers",
                tablename: 'customers',
                progressText: "Synchronizing Customers...",
                progresscompletion: 10,
                url: config.root + `/customer/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/customer/saveorupdate'
            },
            {
                name: "discounts",
                tablename: 'discounts',
                progressText: "Synchronizing Discounts...",
                progresscompletion: 10,
                url: config.root + `/discount/list/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/discount/saveorupdate'
            },
            {
                name: "services",
                tablename: 'services',
                progressText: "Synchronizing Services...",
                progresscompletion: 10,
                url: config.root + `/inventory/servicesbybusiness/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/inventory/services/saveorupdate'
            } ,
            {
                name: "services_category",
                tablename: 'services_category',
                progressText: "Synchronizing Services...",
                progresscompletion: 10,
                url: config.root + `/inventory/servicescategory/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/inventory/services/category/saveorupdate'
            } ,
            {
                name: "services_tax",
                tablename: 'services_tax',
                progressText: "Synchronizing Services...",
                progresscompletion: 10,
                url: config.root + `/inventory/servicestax/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/inventory/services/tax/saveorupdate'
            },
            {
                name: "ticket",
                tablename: 'ticket',
                progressText: "Synchronizing Ticket...",
                progresscompletion: 10,
                url: config.root + `/ticket/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/ticket/saveorupdate'
            } ,
            {
                name: "ticket_services",
                tablename: 'ticket_services',
                progressText: "Synchronizing Tickets...",
                progresscompletion: 10,
                url: config.root + `/ticket/allservices/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/ticket/service/saveorupdate'
            } ,
            {
                name: "ticketservice_taxes",
                tablename: 'ticketservice_taxes',
                progressText: "Synchronizing Tickets...",
                progresscompletion: 10,
                url: config.root + `/ticket/alltaxes/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/ticket/tax/saveorupdate'
            },
            {
                name: "ticketservice_requestnotes",
                tablename: 'ticketservice_requestnotes',
                progressText: "Synchronizing Tickets...",
                progresscompletion: 10,
                url: config.root + `/ticket/allnotes/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/ticket/service/saveorupdatenotes'
            },
            {
                name: "ticket_payment",
                tablename: 'ticket_payment',
                progressText: "Synchronizing Tickets...",
                progresscompletion: 10,
                url: config.root + `/ticket/payments/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/ticket/payment/saveorupdate'
            },
            {
                name: "employee_commission_detail",
                tablename: 'employee_commission_detail',
                progressText: "Synchronizing Tickets...",
                progresscompletion: 10,
                url: config.root + `/ticket/empcommission/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/employee_commission/save'
            },
            {
                name: "emp_payment",
                tablename: 'emp_payment',
                progressText: "Synchronizing Tickets...",
                progresscompletion: 10,
                url: config.root + `/payment/getPayments/` + JSON.parse(window.localStorage.getItem('businessdetail')).id,
                syncurl:'/payment/savePayment'
            },
            {
                name: "staff_clockLog",
                tablename: 'staff_clockLog',
                progressText: "Synchronizing Logs...",
                progresscompletion: 10,
                url:'',
                syncurl:'/employee/synclog'
            }
        ]}, ()=>{
            
            var condition = navigator.onLine ? 'online' : 'offline';
            this.setState({ isOnline: (condition == "online") ? true : false }, function () {
                if (this.state.isOnline) {
                    this.syncAllData();
                }
            }) 
        })
    }

    syncAllData() {
        this.dataManager.getData("select st.* from tosync_tables as st").then(res => {
            console.log("all length ", res.length);
            if (res.length > 0) {
                var data = [];
                this.setState({downloadinMessage:'Synchronizing local data'})
                res.forEach((elmt,i)=>{
                    var tbldata = this.state.mastertables.filter(item=>item.tablename === elmt.table_name);
                    if(tbldata.length > 0){
                        elmt["syncurl"] = tbldata[0].syncurl
                    }
                    data.push(elmt);
                    if(i === res.length-1){
                        this.syncDatatoServer(0, data);
                    }
                })
            }
            else {
                console.log("sync data")
                this.syncMasterData(0)
            }
        });
    }

    syncMasterData(mindex) {
        if (mindex < this.state.mastertables.length) {
            var tbldata = this.state.mastertables[mindex];
            this.setState({downloadinMessage: tbldata.progressText}, ()=>{
                console.log(mindex, "master index")
                if(tbldata.url !== ''){
                    axios.get(tbldata.url).then((res) => {
                        var data = res.data["data"];
                        if (data instanceof Array) {
                            console.log(tbldata.tablename, data.length)
                            this.syncIndividualEntry(mindex, 0, data, tbldata)
                        }
                    })
                }
                else{
                    this.syncMasterData(mindex + 1)
                }
            })
        }
        else {
            this.setState({ progress: 100 }, function () {
                this.props.onAfterSync()
            })
        }
    }
    
    syncIndividualEntry(mindex, idx, data, tbldata) {
        if (idx < data.length) {
            var input = data[idx]; 
            delete input["category_name"]
            if(tbldata.tablename === 'employee_salary'){
                delete input["firstName"];
                delete input["lastName"];
            }
            if(tbldata.tablename === 'ticket'){
                delete input["name"];
                delete input["email"];
                delete input["pay_mode"];
            }
            input["sync_id"] = input["sync_id"] !== null && input["sync_id"] !== undefined ? input["sync_id"] : input["id"];
            input["id"] = input["id"] !== null && input["id"] !== undefined ? input["id"] : input["sync_id"];
            var sql = `delete from ` + tbldata.tablename+ ` where (sync_status=1 and sync_id='`+input.sync_id+`') or id ='`+input.id+`'`;
            if(tbldata.syncurl === ''){
                var sql = `delete from ` + tbldata.tablename;
            }
            console.log(sql);
            // console.log(`delete from ` + tbldata.tablename+ ` where (sync_status=1 and sync_id='`+input.sync_id+`') or id ='`+input.id+`'`)
            this.dataManager.saveData(sql).then(res => {
                input["sync_status"] = 1;
                this.ticketController.saveData({ table_name: tbldata.name, data: input }).then(r => {
                    this.syncIndividualEntry(mindex, idx + 1, data, tbldata);
                })
            })     
        }
        else {
            this.setState({progress: tbldata.progress}, ()=>{
                console.log(mindex, "master sync index")
                this.syncMasterData(mindex + 1)
            });
        }
    }

    syncDatatoServer(syncindex, synctabledata){
        if(syncindex < synctabledata.length){
            var synctable = synctabledata[syncindex];
            this.dataManager.getData(`select * from `+synctable.table_name+` where sync_status=0`).then(res=>{ 
                console.log(`syncindex`, syncindex, res.length);
                if(res.length > 0){
                    this.syncIndividualDataToServer(0, res, syncindex, synctabledata);
                }
                else{
                    console.log(`delete from tosync_tables where table_name='`+synctable.table_name+`'`);
                    this.state.dataManager.saveData(`delete from tosync_tables where table_name='`+synctable.table_name+`'`).then(res=>{
                        console.log(res)
                        this.syncAllData();
                    });
                }
            })
        }
        else{
            this.syncAllData();
        }
    }

    syncIndividualDataToServer(idx, res, syncindex, synctabledata){
        if(idx< res.length){ 
            var synctable = synctabledata[syncindex];   
            var input = res[idx];
            console.log(`syncinput`,input);
            input["sync_status"] = 1;
            delete input["id"];
            delete input["syncedid"];
            axios.post(config.root+synctable.syncurl, input).then(res=>{ 
                this.state.dataManager.saveData(`update `+synctable.table_name+` set sync_status=1 where sync_id='`+input["sync_id"]+`'`).then(r=>{
                    // this.syncIndividualDataToServer(idx+1, res, syncindex, synctabledata);
                    this.syncDatatoServer(syncindex, synctabledata)
                })
            }).catch(err=>{      
            })
        }
        else{
            this.syncDatatoServer(syncindex, synctabledata);
        }
    }

    renderOfflineContent() {
        return (<div style={{ height: '100%' }}>
            {this.state.isLoading && <LoaderContent show={this.state.isLoading}></LoaderContent>}
            <AppBarContent businessdetail={this.state.businessdetail} currentTime={this.state.currentTime}
                handleClick={() => this.handleClick()} />

            <div style={{ height: '100%' }}>
                <DrawerContent
                    anchor={this.state.anchor}
                    open={this.state.openMenu}
                    expand_menu_show={this.state.expand_menu_show}
                    setting_menu_show={this.state.setting_menu_show}
                    onClose={() => this.handleCloseMenu()}
                    onhandleClickInvent={(opt) => this.handleClickInvent(opt)}
                    onlogout={() => this.logout()}
                    onhandlePageevent={(pagename) => this.handlePageEvent(pagename)}
                />
                <Grid container spacing={3} style={{ height: 'calc(100% - 104px)', padding: 0 }}>
                    <Grid item xs={12} style={{ height: '100%', paddingRight: 0 }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <img style={{ height: '100px' }} alt="offline" src="./assets/images/offline.png" />
                            <Typography variant="h4" style={{ color: "#ccc" }}>You are offline.</Typography>
                            <Typography variant="subtitle2" style={{ color: "#ccc", marginBottom: '1rem' }}>Please try again later.</Typography>
                            <Button variant="contained" onClick={()=>{
                                var condition = navigator.onLine ? 'online' : 'offline';
                                this.setState({ isOnline: (condition == "online") ? true : false }, function () {
                                    if (this.state.isOnline) {
                                        this.syncAllData();
                                    }
                                }) 
                                }}>Reload</Button>
                        </div>

                    </Grid>
                </Grid>

            </div></div>
        );
    }

    renderMain() {

        return (


            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>

                {this.state.isLoading && <LoadingModal show={this.state.isLoading}></LoadingModal>}


                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Grid container spacing={2} >

                        <Grid item xs={2}> </Grid>
                        <Grid item xs={8}>
                            {/* <Grid item xs={12}><Typography variant="h6" noWrap >Please wait until finish..</Typography> </Grid> */}
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12} style={{ marginTop: 20, display: 'flex' }}>
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress variant="determinate" value={this.state.progress} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: 10 }}><Typography variant="subtitle2" noWrap style={{ color: '#808080' }}> {this.state.downloadinMessage}...</Typography> </Grid>
                            <Grid item xs={12}><Typography variant="subtitle2" noWrap style={{ color: ' #808080' }}></Typography> </Grid>

                        </Grid>
                        <Grid item xs={2}> </Grid>
                    </Grid>

                </div>



            </div>
        )

    }

    render() {
        var content = this.renderMain()
        if (!this.state.isOnline) {
            content = this.renderOfflineContent()
        }

        return (<>
            {this.state.isOnline && this.renderMain()}
            {!this.state.isOnline && this.renderOfflineContent()}
            // content
            </>
        )
    }
}