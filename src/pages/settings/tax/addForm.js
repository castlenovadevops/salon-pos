import React from 'react';
// material
import { Stack, FormControl, Checkbox, FormControlLabel, FormGroup, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// components
import TextFieldContent from '../../../components/formComponents/TextField';
// import TextAreaContent from '../../../components/TextArea';
import ButtonContent from '../../../components/formComponents/Button';
import LoaderContent from '../../../components/formComponents/LoaderDialog';
import config from '../../../config/config';

import TicketController from '../../../controller/TicketController'
import DataManager from '../../../controller/datacontroller';
// ----------------------------------------------------------------------
export default class TaxForm extends React.Component {
    datamanager = new DataManager();
    ticketController = new TicketController();
    constructor(props) {
        super(props);
        this.state = {
            tax_name: '',
            tax_type: '',
            tax_value: '',
            isDefault: 0,
            status: 'active',
            userdetail: {},
            taxSelected: {},
            isEdit: false,
            open: false,
            isPercentageShow: false,
            isValueShow: false,
            isDisable: true,
        };
        this.handlechange = this.handlechange.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.props.taxToEdit !== undefined) {
                this.setState({ taxSelected: this.props.taxToEdit, isEdit: true, isDisable: false }, function () {
                    let statevbl = this.state
                    statevbl = this.state.taxSelected;
                    this.setState(statevbl);
                })
                if (this.props.taxToEdit.tax_type === 'percentage') {
                    this.setState({ isPercentageShow: true, isValueShow: false })
                }
                else {
                    this.setState({ isPercentageShow: false, isValueShow: true })
                }

            }
        }, 100);
        var userdetail = window.localStorage.getItem('employeedetail');
        if (userdetail !== undefined && userdetail !== null) {
            this.setState({ userdetail: JSON.parse(userdetail) })
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        setTimeout(() => {
            if (nextProps.taxToEdit !== prevState.taxSelected) {
                return { taxSelected: nextProps.taxToEdit };
            }
            return null;
        }, 100);
    }
    handlechange(e) {
        if (e.target.name === "tax_value") {
            if ((e.target.value.match("^.{" + config.inputpercentage + "," + config.inputpercentage + "}$") === null) && e.target.value <= 100) {
                let statevbl = this.state
                statevbl[e.target.name] = e.target.value;
                this.setState(statevbl);
                this.handleValidation();
            }
        }
        else {
            if (e.target.value.match("^.{" + config.input + "," + config.input + "}$") === null) {
                let statevbl = this.state
                statevbl[e.target.name] = e.target.value;
                this.setState(statevbl);
                this.handleValidation();
            }
        }

    }
    handleValidation() {
        let formIsValid = true;
        let fields = this.state;
        //Tax Name
        if (!fields.tax_name) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        // else {
        //     this.setState({ isDisable: false })
        // }
        //Tax tax_type
        else if (!fields.tax_type) {
            formIsValid = false;
            this.setState({ isDisable: true })
        }
        else {
            this.setState({ isDisable: false })
        }
        return formIsValid;
    }

    handleClose() {
        this.setState({ open: false })
    }
    handleChangeType(e) {
        var val = e.target.value;
        this.setState({ tax_type: val })
        if (val === 'percentage') {
            this.setState({ isPercentageShow: true, isValueShow: false })
        }
        else {
            this.setState({ isPercentageShow: false, isValueShow: true })
        }
    }
    handleCheckbox(event) {
        if (event.target.checked) {
            this.setState({ isDefault: 1 });
        } else {
            this.setState({ isDefault: 0 });
        }
    }
    saveTax() {
        if (this.handleValidation()) {

        window.api.getSyncUniqueId().then(sync=>{
            var syncid = sync.syncid; 
            this.setState({ isLoading: true });
            let msg;
            var input = Object.assign({}, this.state);
            if (this.state.isEdit) {
                input["id"] = this.state.taxSelected.id;
                msg = 'Updated successfully.';
            }
            else {
                msg = 'Saved successfully.';
            }
            delete input["userdetail"];
            delete input["taxSelected"];
            delete input["isEdit"];
            delete input["open"];
            delete input["isPercentageShow"];
            delete input["isValueShow"];
            delete input["isDisable"];
            delete input["isNameEmpty"];
            delete input["errorTextName"];
            delete input["isTypeEmpty"];
            delete input["errorTextType"];
            delete input["isLoading"];

            var userdetail = window.localStorage.getItem('employeedetail');
            var businessdetail = window.localStorage.getItem('businessdetail');
            if (userdetail !== undefined && userdetail !== null) {
                input["created_by"] = JSON.parse(userdetail).id;
                input["updated_by"] = JSON.parse(userdetail).id;
                input["businessId"] = JSON.parse(businessdetail).id;
            }
            input["created_at"] = new Date().toISOString();
            input["updated_at"] = new Date().toISOString();
             
            input["sync_status"] = 0;
            // this.datamanager.getData("select * from taxes").then(res=>{
            //     if(res.length === 0){
            //         input["isDefault"] = 1
            //         this.setState({isDefault:1},()=>{
            //             this.updateDefault(input, syncid);
            //         })
            //     }
            //     else{
            //         this.updateDefault(input, syncid);
            //     }
            // })

            this.updateDefault(input, syncid);

            // axios.post(config.root + `/tax/saveorupdate`, input).then(res => {
            //     var status = res.data["status"];
            //     if (status === 200) {
            //         if (this.state.isDefault === 1) {
            //             let taxid;
            //             if (this.props.taxSelected !== undefined) {
            //                 taxid = this.props.taxSelected.id;
            //             } else {
            //                 taxid = res.data["data"].insertId;
            //             }
            //             axios.get(config.root + `/tax/updatedefault/` + taxid).then(res => {
            //                 var status1 = res.data["status"];
            //                 if (status1 === 200) {
            //                     this.props.afterSubmit(msg);
            //                     this.setState({ isLoading: false });
            //                 }
            //             }).catch(err => {
            //             })
            //         } else {
            //             this.props.afterSubmit(msg);
            //             this.setState({ isLoading: false });
            //         }

            //     }
            // }).catch(err => {
            // })

          });
        }
    }

    updateDefault(input, syncid){
        if (this.state.isDefault === 1) {
            this.datamanager.saveData("update taxes set isDefault=0, sync_status=0 where isDefault=1").then(r=>{ 
                this.saveTaxToDB(input, syncid)
            })
        }
        else{
            this.saveTaxToDB(input, syncid)
        }
    }

    saveTaxToDB(input, syncid){
        if(this.state.isEdit){  
            input["id"] = this.state.taxSelected.id;
            this.ticketController.updateData({table_name:'taxes', data: input, query_field:'sync_id', query_value:this.state.taxSelected.id}).then(()=>{ 
            this.props.afterSubmit('Updated successfully.');
            this.setState({isLoading: false});
            })
        }
        else{ 
            input["sync_id"] = syncid;
            input["mode"]= 'POS';
            this.ticketController.saveData({table_name:'taxes', data:input}).then(r=>{ 
                this.props.afterSubmit('Saved successfully.');
                this.setState({isLoading: false});
            }) 
        }
    }


    handleclose() {
        this.props.afterSubmit('');
    }

    render() {
        return (<div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", padding: 40,height: '100%',background: 'white', width: '60%'}}>
            {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
            <form autoComplete="off" noValidate>
                <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextFieldContent
                            fullWidth
                            label="Tax Name"
                            name="tax_name"
                            id="tax_name"
                            required
                            value={this.state.tax_name}
                            onChange={this.handlechange}
                        />
                        <FormControl fullWidth required>
                            <InputLabel id="tax_type">Type</InputLabel>
                            <Select
                                labelId=""
                                id="tax_type"
                                name="tax_type"
                                value={this.state.tax_type}

                                label="Role"
                                onChange={this.handleChangeType}


                            >
                                <MenuItem value='percentage'>Percentage</MenuItem>
                                <MenuItem value='dollar'>Flat fee</MenuItem>

                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} style={{ display: this.state.isPercentageShow ? 'block' : 'none' }}>
                        <TextFieldContent
                            fullWidth
                            label="Tax Percentage"
                            name="tax_value"
                            value={this.state.tax_value} i

                            onChange={this.handlechange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        %
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} style={{ display: this.state.isValueShow ? 'block' : 'none' }}>
                        <TextFieldContent
                            fullWidth
                            label="Tax Value"
                            name="tax_value"
                            value={this.state.tax_value} i
                            onChange={this.handlechange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        $
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            {this.state.isEdit &&
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox value={this.state.isDefault} checked={this.state.isDefault === 1 ? true : false} name="isDefault" onChange={(e) => { this.handleCheckbox(e); }} />
                                        }
                                        label="isDefault"
                                    />
                                </FormGroup>

                            }
                            {!this.state.isEdit &&
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox value={this.state.isDefault} name="isDefault" onChange={(e) => { this.handleCheckbox(e); }} />
                                        }
                                        label="Default"
                                    />
                                </FormGroup>

                            }
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <ButtonContent size="large" variant="contained" disabled={this.state.isDisable} label={this.state.isEdit ? 'Update' : 'Save'} onClick={() => this.saveTax()} />
                        <ButtonContent size="large" variant="outlined" label="Cancel" onClick={() => this.handleclose()} />
                    </Stack>
                </Stack>
            </form>
        </div>
        );
    }
}
