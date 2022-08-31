// import { filter } from 'lodash';
import React from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Stack, Container, Typography, Checkbox, Grid } from '@mui/material';

// components
import ButtonContent from '../../../components/formComponents/Button';
import TableContent from '../../../components/formComponents/DataGrid';
import LoaderContent from '../../../components/formComponents/LoaderDialog';
import CreateTax from './create';
import config from '../../../config/config';

import AppBarContent from '../../TopBar';
import DrawerContent from '../../Drawer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DataManager from '../../../controller/datacontroller'
import TicketController from '../../../controller/TicketController'

export default class Tax extends React.Component {
    dataManager = new DataManager();
    ticketController = new TicketController();
    constructor(props) {
        super(props);
        this.state = {
            taxlist: [],
            addForm: false,
            editForm: false,
            isOnline: false,
            selectedtaxes: {},
            columns: [
                // {
                //     field: 'isDefault',
                //     headerName: '',
                //     minWidth: 50,
                //     editable: false,
                //     renderCell: (params) => (
                //         <div>
                //             <Checkbox value={params.row.isDefault} onChange={() => this.editDefault(params.row)} checked={params.row.isDefault === 1 ? true : false} />
                //         </div>
                //     )
                // },
                {
                    field: 'tax_name',
                    headerName: 'Name',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.tax_name}
                        </div>
                    )
                },
                {
                    field: 'tax_type',
                    headerName: 'Type',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.tax_type}
                        </div>
                    )
                },
                {
                    field: 'tax_value',
                    headerName: 'Value',
                    minWidth: 150,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.tax_value}
                        </div>
                    )
                },
                {
                    field: 'status',
                    headerName: 'Status',
                    minWidth: 100,
                    editable: false,
                    renderCell: (params) => (
                        <div style={{ textTransform: 'capitalize' }}>
                            {params.row.status}
                        </div>
                    )
                },
                {
                    field: 'Action',
                    headerName: 'Action',
                    flex:1,
                    renderCell: (params) => (
                        <strong>
                            {
                                <ButtonContent variant="contained" size="small" onClick={() => this.openEdit(params.row)} label="Edit" />

                            }
                            {params.row.status === 'active' &&
                                <ButtonContent variant="contained" size="small" onClick={() => { this.deleteRecord(params.row, 'inactive') }} label="Inactivate" />
                            }
                            {params.row.status === 'inactive' &&
                                <ButtonContent variant="contained" size="small" onClick={() => { this.deleteRecord(params.row, 'active') }} label="Activate" />
                            }
                            {params.row.isDefault === 1 && <ButtonContent variant="contained" size="small" onClick={() => this.editDefault(params.row)} label="Remove Default" />}
                            {params.row.isDefault !== 1 && <ButtonContent variant="contained" size="small" onClick={() => this.editDefault(params.row)} label="Make Default" />}


                        </strong>

                    ),
                }

            ],
            isLoading: false,
            expand_menu_show: false,
            setting_menu_show: false,
            anchor: "left",
            anchorEl: null,
            openMenu: false,
            businessdetail: {},
            isSuccess: false,
        }

        this.logout = this.logout.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handlePageEvent = this.handlePageEvent.bind(this);
    }
    componentDidMount() {

        let detail = window.localStorage.getItem("businessdetail");
        this.setState({ businessdetail: JSON.parse(detail) }, () => {

        })


        var condition = navigator.onLine ? 'online' : 'offline';
        this.setState({ isOnline: (condition == "online") ? true : false }, function () {
            // if(!this.state.isOnline) {
            //     const dataManager = new DataManager()
            //     dataManager.getData("select * from taxes").then(response =>{
            //         if (response instanceof Array) {
            //             this.setState({taxlist: response}, function(){
            //                 console.log(this.state.employeelist)
            //             })
            //         }

            //     })
            //   }
            //   else {
            this.taxlist();
            //   }
        })


    }

    handleClick() {
        // //console.log(event.target)
        this.setState({ anchorEl: null, openMenu: true, editForm: false, addForm: false });
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

    taxlist() {
        this.setState({ isLoading: true });
        var detail = window.localStorage.getItem('businessdetail');
        if (detail !== undefined && detail !== null) {
            var businessdetail = JSON.parse(detail);
            this.dataManager.getData("select sync_id as id, tax_name, tax_type, tax_value, isDefault, created_at, updated_at, status from taxes where businessId="+businessdetail["id"]).then(response => {
                if (response instanceof Array) {
                    this.setState({ taxlist: response }, function () {
                        this.setState({ isLoading: false });
                    })
                }

            })

            // axios.get(config.root + `/tax/list/` + JSON.parse(businessdetail).id).then(res => {
            //     this.setState({ taxlist: res.data.data }, function () {
            //         this.setState({ isLoading: false });
            //     })
            // });
        }
    }
    editDefault(detail) {

        this.setState({ isLoading: true }, () => {
            if (detail.isDefault == 0) {
                this.dataManager.saveData('update taxes set isDefault =0, sync_status=0 where isDefault=1').then(e => {
                })
            }
            var input = {
                isDefault: detail.isDefault == 1 ? 0 : 1,
                sync_status: 0
            }
            this.ticketController.updateData({ table_name: 'taxes', data: input, query_field: 'sync_id', query_value: detail.id }).then(() => {
                this.setState({ msg: 'Updated successfully.', isLoading: false, }, () => {
                    this.setState({ isSuccess: true });
                    this.taxlist();
                })
            })
        });

        // axios.get(config.root + `/tax/updatedefault/` + detail.id).then(res => {
        //     var status = res.data["status"];
        //     if (status === 200) {

        //         this.setState({ isSuccess: true })


        //         this.taxlist();

        //     }

        // }).catch(err => {
        // })
    }
    deleteRecord(detail, status) {

        this.setState({ isLoading: true }, () => {
            var input = {
                status: status,
                sync_status: 0
            }
            this.ticketController.updateData({ table_name: 'taxes', data: input, query_field: 'sync_id', query_value: detail.id }).then(() => {
                this.setState({ msg: 'Updated successfully.', isLoading: false, }, () => {
                    this.setState({ isSuccess: true });
                    this.taxlist();
                })
            })
        });

        // axios.post(config.root + `/tax/saveorupdate`, { id: detail.id, status: status }).then(res => {
        //     var status = res.data["status"];
        //     if (status === 200) {

        //         this.setState({ isSuccess: true })

        //         this.taxlist();
        //     }
        // }).catch(err => {
        // })
    }
    handleCloseform(msg) {
        this.setState({ editForm: false, addForm: false }, function () {
            if (msg !== '') {

                this.setState({ isSuccess: true })
            }
        })
    }

    openEdit(row) {
        this.setState({ selectedtaxes: row }, function () {
            this.setState({ editForm: true })
        })
    }

    openAdd() {
        this.setState({ addForm: true })
    }



    render() {
        return (
            <div style={{ height: '100%' }}>
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


                    {/* Drawer menu ends */}

                    {/* ResponsiveGridLayout Starts */}

                    <Grid container spacing={3} style={{ height: 'calc(100% - 104px)', padding: 0 }}>
                        <Grid item xs={12} style={{ height: '100%', paddingRight: 0 }}>

                            {!this.state.editForm && !this.state.addForm ?
                                <Container maxWidth="xl" style={{ height: '100%' }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
                                        <Typography variant="h4" gutterBottom>
                                            Taxes & Fees
                                        </Typography>
                                        <ButtonContent
                                            onClick={() => this.openAdd()}
                                            size="large"
                                            variant="contained"
                                           
                                            label="Add Taxes & Fees"
                                            startIcon={<Icon icon={plusFill} />}
                                        />
                                    </Stack>

                                    <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", height: '80%',background: 'white'}}>
      <div className="tabcontent" style={{ height: '100%', width: '100%', background: 'white',  }}>
                                        <TableContent style={{ height: '100%' }} data={this.state.taxlist} columns={this.state.columns} />
                                    </div></div>
                                </Container> : ''
                            }
                            {this.state.editForm ? <CreateTax afterSubmitForm={(msg) => { this.handleCloseform(msg); this.taxlist(); }} taxSelected={this.state.selectedtaxes} /> : ''}
                            {this.state.addForm ? <CreateTax afterSubmitForm={(msg) => { this.handleCloseform(msg); this.taxlist(); }} /> : ''}
                        </Grid>
                    </Grid>

                    <Snackbar open={!this.state.isOnline} style={{ width: '100%', marginBottom: -25 }} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>

                        <MuiAlert elevation={6} variant="filled" severity="error" sx={{ width: '100%' }} style={{ background: 'red', color: 'white' }}>
                            No internet available !
                        </MuiAlert>


                    </Snackbar>


                    <Snackbar autoHideDuration={4000} open={this.state.isSuccess} style={{ width: '50%', marginTop: 50 }} anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        onClose={() => this.setState({ isSuccess: false })}>
                        <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: '50%' }} style={{ background: '#134163', color: 'white' }}>
                            Updated successfully.
                        </MuiAlert>
                    </Snackbar>


                </div>
            </div>
        );
    }
}
