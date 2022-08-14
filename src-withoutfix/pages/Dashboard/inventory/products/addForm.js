import React from 'react';
// material
import { Stack, FormControl, Chip, Checkbox, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, Input, MenuItem, Box, FormGroup, InputAdornment, Grid, Typography } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom'; 
// components
import TextFieldContent from '../../../../components/formComponents/TextField';
// import TextAreaContent from '../../../../components/formComponents/TextArea';
import ButtonContent from '../../../../components/formComponents/Button';
import LoaderContent from '../../../../components/formComponents/LoaderDialog';
// ListItemText
import config from '../../../../config/config';
import DataManager from '../../../../controller/datacontroller'
import TicketController from '../../../../controller/TicketController';
import NumberFormat from "react-number-format";
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      maxLength="7" 
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      // isNumericString
    />
  );
}


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

// ----------------------------------------------------------------------
export default class ProductForm extends React.Component {
    dataManager = new DataManager();
    ticketController = new TicketController();
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            category_id: '',
            status: 'Active',
            description: '',
            price: '',
            cost: '',
            sku: '',
            pricetype: 'fixed',
            productcode: '',
            producttype: 'service',
            categorylist: [],
            businessdetail: {},
            isDisable: true,
            errorText: '',
            isEmpty: false,
            selectOptions: [],
            serviceSelected: {},
            isEdit: false,
            tax_type: 'default',
            default_taxDetail: [],
            all_taxDetail: [],
            isCustom: false,
            isDefault: true,
            taxes: [],
            service_taxes: [],
            edited_taxes: [],
            selected_category: [],
            selected: [],
            selectedcategory: [],
            isLoading: false,
            isTax_available: false,
            isDefaultTax_available: false,
        };
        this.handlechange = this.handlechange.bind(this);
        this.handleradio = this.handleradio.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleclose = this.handleclose.bind(this);
    }
    handleType(e) {
        this.setState({ producttype: e.target.value })
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.props.serviceToEdit !== undefined) {
                this.setState({ serviceSelected: this.props.serviceToEdit, isEdit: true, isDisable: false }, function () {
                    let statevbl = this.state
                    statevbl = this.state.serviceSelected;
                    this.setState(statevbl);

                    this.getTaxByServices(this.props.serviceToEdit.id);
                    if (this.props.serviceToEdit.tax_type === 'default') {
                        this.setState({ isCustom: false, isDefault: true })
                        this.getDefaultTax()
                    }
                    else if (this.props.serviceToEdit.tax_type === 'custom') {
                        this.setState({ isCustom: true, isDefault: false })
                        this.getAllTax();
                    }
                    else {
                        this.setState({ isCustom: false, isDefault: false });
                    }

                    this.getServiceCategories();
                })
            }
        }, 100);
        this.getAllTax();
        this.getDefaultTax();
        var businessdetail = window.localStorage.getItem('businessdetail');
        if (businessdetail !== undefined && businessdetail !== null) {
            this.setState({ businessdetail: JSON.parse(businessdetail) }, function () {
               
                
                this.getCategoryList()
            })
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        setTimeout(() => {
            if (nextProps.serviceToEdit !== prevState.serviceSelected) {
                return { serviceSelected: nextProps.serviceToEdit };
            }

            return null;
        }, 100);
    }
    getServiceCategories() {  
        this.dataManager.getData(`select * from services_category where service_id='` + this.state.serviceSelected.id + `' and status='active'`).then(res => {
            var categories = [];
            res.forEach((elmt, i) => {
                categories.push(elmt.category_id);
                if (i === res.length - 1) { 
                    console.log(categories)
                    this.setState({ selectedcategory: categories }); 
                }
            })
        }) 
    }
    getCategoryList() {
        this.dataManager.getData(`select sync_id as id, name, status, description,created_at, created_by, updated_at, updated_by,businessId, sync_status from category where status='Active'`).then(res => {
            this.setState({ categorylist: res }, () => { 
                const options = this.state.categorylist.map(d => ({
                    "value": d.sync_id,
                    "label": d.name
                }))
                this.setState({ selectOptions: options })
            });
        }) 
    }
    handlechange(e) {
        if (e.target.name == "price" || e.target.name == "cost") {
            if(e.target.value.length<8) {

          const numberPattern = new RegExp(/^[0-9\b]+$/); 
                console.log("PRICE::", e.keyCode)
                if ((e.target.value.match("^.{" + config.inputprice + "," + config.inputprice + "}$") === null)) {
                    let statevbl = this.state
                    statevbl[e.target.name] = e.target.value;
                    this.setState(statevbl, function(){
                        console.log("1st ")
                    });
                    this.handleValidation();
                }
                else{

                }
            }
            
        }
        else {
            if ((e.target.value.match("^.{" + config.input + "," + config.input + "}$") === null)) {
                let statevbl = this.state
                statevbl[e.target.name] = e.target.value;
                this.setState(statevbl,function(){
                    console.log("2nd ")
                });
                this.handleValidation();

            }

        }

    }
    handleValidation() {
        let formIsValid = true;
        let fields = this.state;
        //name
        if (!fields.name) {
            formIsValid = false;
            this.setState({ isDisable: true });
        }
        // else {
        //     this.setState({ isDisable: false });
        // }
        //price
        else if (!fields.price && fields.pricetype !== 'variable') {
            formIsValid = false;
            this.setState({ isDisable: true });
        }
        // else {
        //     this.setState({ isDisable: false });
        // }

        //category
        else if (fields.selectedcategory.length === 0) {
            formIsValid = false;
            this.setState({ isDisable: true });
        }
        else {
            this.setState({ isDisable: false });
        }
        return formIsValid;
    }

    handlechangeSelect(event) {
        this.setState({ selectedcategory: event.target.value }, () => {
            this.handleValidation();
        });
    }
    handleradio(e) {
        this.setState({ tax_type: e.target.value })
        if (e.target.value === 'default') {
            this.setState({ isCustom: false, isDefault: true })
            this.getDefaultTax()
        }
        else if (e.target.value === 'custom') {
            this.setState({ isCustom: true, isDefault: false })
            this.getAllTax();
        }
        else {
            this.setState({ isCustom: false, isDefault: false });
        }

    }
    handleCheckbox(event) {
        // if (event.target.checked) {
        //     event.target.removeAttribute('checked');
        // } else {
        //     event.target.setAttribute('checked', true);
        // }
        var taxArr = this.state.taxes;
        var arr = this.state.edited_taxes;
        const value =event.target.value
        const index = taxArr.findIndex(day => day === value);

        let servicetax = this.state.service_taxes.filter(item => item.tax_id !== value);

        var deleteTax = this.state.service_taxes.filter(function (item) {
            return !servicetax.includes(item);
        })
        if (deleteTax.length > 0) {
            arr.push(deleteTax[0])
            this.setState({ edited_taxes: arr });
        }
        this.setState({ service_taxes: servicetax });
        if (index > -1) {
            taxArr = [...taxArr.slice(0, index), ...taxArr.slice(index + 1)]
        } else {
            taxArr.push(value);
        }
        console.log(taxArr)
        this.setState({ taxes: taxArr });
    }
    getDefaultTax() {

        this.dataManager.getData(`select sync_id as id, tax_name, tax_type, tax_value, isDefault, created_at, updated_at, status from taxes where isDefault=1 and  status='active'`).then(res => {
            this.setState({ default_taxDetail: res }, () => {
                console.log("default tax",this.state.default_taxDetail);
                if(this.state.default_taxDetail.length > 0){
                    this.setState({isDefaultTax_available: true});
                }else{
                    this.setState({isDefaultTax_available: false});
                }
            });
        })
        // axios.get(config.root + `/tax/default/taxlist/` + this.state.businessdetail.id).then(res => {
        //     this.setState({ default_taxDetail: res.data.data }, function () {
        //         ////console.log(this.state.default_taxDetail)
        //     });
        // })

    }
    getAllTax() {

        this.dataManager.getData(`select sync_id as id, tax_name, tax_type, tax_value, isDefault, created_at, updated_at, status from taxes where status='active'`).then(res => {
            console.log("all taxes", res)
            this.setState({ all_taxDetail: res }, () => {
                console.log("all taxes state", this.state.all_taxDetail)
                if (this.state.all_taxDetail.length > 0) {
                    this.setState({ isTax_available: true });
                } else {
                    this.setState({ isTax_available: false });
                }
            });
        })
    }
    getTaxByServices(serviceId) {   
        this.dataManager.getData(`select * from services_tax where service_id='` + serviceId + `' and status='active'`).then(res => {
            setTimeout(function() { 
                this.setState({service_taxes:res}, function(){
                    var taxes = []
                    this.state.service_taxes.forEach((elmt)=>{
                        taxes.push(elmt.tax_id)
                        this.setState({taxes:taxes}, function(){  
                        })
                    })
                });
                
            }.bind(this), 1000);
        })
    }

    isTaxCheck(tax_id) { 
        let res = this.state.service_taxes.filter(item => item.tax_id === tax_id);
        let res1 = this.state.taxes.filter(item => item === tax_id);
        if (res.length > 0 || res1.length > 0) { 
            console.log("TEASDASDASD", res.length, res1.length)
            return true;
        } else {
            return false;
        }
    }
    saveService() {
        // ////console.log(this.state)
        if (this.handleValidation()) {

            window.api.getSyncUniqueId().then(sync => {
                var syncid = sync.syncid;
                this.setState({ isLoading: true });
                let msg;
                var input = Object.assign({}, this.state)
                delete input["businessdetail"];
                delete input["categorylist"];
                delete input["isDisable"]
                delete input["errorText"];
                delete input["isEmpty"]
                delete input['selectOptions']
                delete input["serviceSelected"];
                delete input["isEdit"];
                delete input["default_taxDetail"];
                delete input["all_taxDetail"];
                delete input["isCustom"];
                delete input["taxes"];
                delete input["service_taxes"];
                delete input["edited_taxes"];
                delete input["isDefault"];
                delete input["selected_category"];
                delete input["selected"];
                delete input["selectedcategory"];
                delete input["isLoading"];
                delete input["isTax_available"];
                delete input["category_name"];
                delete input["isDefaultTax_available"];
                var userdetail = window.localStorage.getItem('employeedetail');
                if (userdetail !== undefined && userdetail !== null) {
                    input["created_by"] = JSON.parse(userdetail).id;
                    input["updated_by"] = JSON.parse(userdetail).id;
                    input["businessId"] = this.state.businessdetail.id;
                }
                input["updated_at"] = new Date().toISOString();
                input["sync_status"] = 0;
                if (this.state.isEdit) {
                    this.ticketController.updateData({ table_name: 'services', data: input, query_field: 'sync_id', query_value: this.state.serviceSelected.id }).then(() => {
                        this.saveCategories(input, input.id);
                    })
                }
                else {
                    input["sync_id"] = syncid;
                    input["mode"] = 'POS';
                    input["created_at"] = new Date().toISOString();
                    input["updated_at"] = new Date().toISOString();
                    this.ticketController.saveData({ table_name: 'services', data: input }).then(r => {
                        this.saveCategories(input,input["sync_id"]);
                    })
                }
            });
        }
    }

    saveCategories(input,serviceid) {
        var categories = Object.assign([], this.state.selectedcategory);
        console.log("CATEGORYSAVE SQL:::", "delete from services_category where service_id='" +serviceid + "'")
        this.dataManager.saveData("update services_category set status='inactive', updated_at='"+new Date().toISOString()+"' where service_id='" + serviceid + "'").then(r => {
            this.saveCategoryData(0, categories, input, serviceid)
        })
    }

    saveCategoryData(idx, cats, input,serviceid) {
        if (idx < cats.length) {
            window.api.getSyncUniqueId().then(sync => {
                var syncid = sync.syncid + idx;

                var userdetail = window.localStorage.getItem('employeedetail');
                var catinput = {
                    service_id: serviceid,
                    sync_status: 0,
                    category_id: cats[idx],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    sync_id: syncid,
                    sync_status: 0,
                    status:'active',
                    mode:'POS'
                }
                if (userdetail !== undefined && userdetail !== null) {
                    catinput["created_by"] = JSON.parse(userdetail).id;
                    catinput["updated_by"] = JSON.parse(userdetail).id;
                }
                catinput["created_at"] = new Date().toISOString();
                catinput["updated_at"] = new Date().toISOString();
                this.ticketController.saveData({ table_name: 'services_category', data: catinput }).then(r => {
                    this.saveCategoryData(idx + 1, cats, input,serviceid);
                })
            })
        }
        else {
            this.saveTaxes(input,serviceid)
        }
    }

    saveTaxes(input,serviceid) {
        var taxes = this.state.taxes; 
        this.dataManager.saveData("update services_tax set status='inactive' where service_id='" +serviceid + "'").then(r => {
            if (this.state.tax_type === 'default' && this.state.isDefaultTax_available) {
                var taxInput1 = {};
                window.api.getSyncUniqueId().then(sync => {
                    var syncid = sync.syncid;
                    var userdetail = window.localStorage.getItem('employeedetail');
                    var taxinput = {
                        service_id: serviceid,
                        sync_status: 0,
                        tax_id: this.state.default_taxDetail[0].id,
                        tax_type: this.state.tax_type,
                        status: 'active',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        sync_id: syncid, 
                        status:'active',
                        mode:'POS'
                    }
                    if (userdetail !== undefined && userdetail !== null) {
                        taxinput["created_by"] = JSON.parse(userdetail).id;
                        taxinput["updated_by"] = JSON.parse(userdetail).id;
                    }
                    taxinput["created_at"] = new Date().toISOString();
                    taxinput["updated_at"] = new Date().toISOString();
                    this.ticketController.saveData({ table_name: 'services_tax', data: taxinput }).then(r => {
                        this.finishSaveData();
                    })
                })
            }
            else if (this.state.tax_type === 'custom') { 
                this.saveTaxData(0, taxes, input,serviceid) 
            }
            else{
                this.finishSaveData()
            }
        })
    }

    saveTaxData(idx, taxes, input,serviceid) {
        if (idx < taxes.length) {

            window.api.getSyncUniqueId().then(sync => {
                var syncid = sync.syncid + idx;

                var userdetail = window.localStorage.getItem('employeedetail');
                var taxinput = {
                    service_id: serviceid,
                    sync_status: 0,
                    tax_id: taxes[idx],
                    tax_type: this.state.tax_type,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    sync_id: syncid, 
                    status:'active',
                    mode:'POS'
                }
                if (userdetail !== undefined && userdetail !== null) {
                    taxinput["created_by"] = JSON.parse(userdetail).id;
                    taxinput["updated_by"] = JSON.parse(userdetail).id;
                }
                console.log("INPUT::::::", input);
                console.log("TAX INPUT:::::", taxinput);
                taxinput["created_at"] = new Date().toISOString();
                taxinput["updated_at"] = new Date().toISOString();
                this.ticketController.saveData({ table_name: 'services_tax', data: taxinput }).then(r => {
                    this.saveTaxData(idx + 1, taxes, input,serviceid)
                })
            })
        }
        else {
            this.finishSaveData()
        }
    }


    finishSaveData() {
        if (this.state.isEdit) {
            this.props.afterSubmit('Updated successfully.');
            this.setState({ isLoading: false });
        }
        else {
            this.props.afterSubmit('Saved successfully.');
            this.setState({ isLoading: false });
        }
    }
    checkCategory(id) {
        return this.state.selectedcategory.indexOf(id) > -1 ? true : false;
    }

    getCategoryName(catid) {
        let category = this.state.categorylist.filter(cat => { return cat.id === catid })
        if (category.length > 0) {
            return category[0].name;
        }
        else {
            return ''
        }
    }

    handleccChange(e) {
        this.setState({ selectedcategory: e.target.value });
    }

    handleclose() {
        this.props.afterSubmit('');
    }

    renderContent() {

        return (<div style={{}}>
            {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
            <div style={{}}>
                <div style={{}}>

                    <form >


                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Item Type</FormLabel>
                                    <RadioGroup style={{ marginLeft: 10 }} row aria-label="tax" name="row-radio-buttons-group">
                                        <FormControlLabel value={this.state.producttype} control={<Radio checked={this.state.producttype === 'product'} value="product" onChange={(e) => {
                                            this.handleType(e)
                                        }} />} label="Product" />
                                        <FormControlLabel value={this.state.producttype} control={<Radio checked={this.state.producttype === 'service'} value="service" onChange={(e) => {
                                            this.handleType(e)
                                        }} />} label="Service" />

                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextFieldContent
                                    fullWidth
                                    required
                                    label="Product / Service Name"
                                    name="name"
                                    id="name"
                                    value={this.state.name}
                                    onChange={this.handlechange}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        labelId=""
                                        id="selectedcategory"
                                        multiple
                                        value={this.state.selectedcategory}
                                        onChange={(e) => {
                                            this.handlechangeSelect(e);
                                        }}
                                        input={<Input id="select-multiple-chip" />}
                                        renderValue={(selected) => (
                                            <div>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={this.getCategoryName(value)} />
                                                ))}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {this.state.categorylist.map(cat => (
                                            <MenuItem value={cat.id}>
                                                <Checkbox checked={this.checkCategory(cat.id)} />
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextFieldContent
                                    fullWidth
                                    label="SKU"
                                    name="sku"
                                    id="sku"
                                    value={this.state.sku}
                                    onChange={this.handlechange}
                                />
                                <TextFieldContent
                                    fullWidth
                                    label="Product Code"
                                    name="productcode"
                                    id="productcode"
                                    value={this.state.productcode}
                                    onChange={this.handlechange}
                                />
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="price_type">Price Type</InputLabel>
                                    <Select
                                        labelId=""
                                        id="price_type"
                                        name="price_type"
                                        value={this.state.pricetype}
                                        label="Price Type"
                                        onChange={(e) => {
                                            var val = e.target.value;
                                            this.setState({ pricetype: val }, ()=>{
                                                this.handleValidation();
                                            })
                                        }}
                                    >
                                        <MenuItem value='fixed'>Fixed</MenuItem>
                                        <MenuItem value='variable'>Variable</MenuItem>
                                        <MenuItem value='perunit'>Per Unit</MenuItem>

                                    </Select>
                                </FormControl>
                                {this.state.pricetype !== 'variable'&& <> <TextFieldContent
                                    fullWidth
                                    required
                                    label="Service/Product Price"
                                    name="price"
                                    id="price"
                                    // type="number"
                                    value={this.state.price}
                                    onChange={this.handlechange}

                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        // inputComponent: NumberFormatCustom
                                    }}
                                />
                                <TextFieldContent
                                    fullWidth
                                    label="Service/Product Cost"
                                    name="cost"
                                    id="cost"
                                    // type="number"
                                    value={this.state.cost}
                                    onChange={this.handlechange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        // inputComponent: NumberFormatCustom
                                    }}
                                /></>}
                                 {this.state.pricetype === 'variable'&& <> <TextFieldContent
                                    fullWidth 
                                    label="Service/Product Price"
                                    name="price"
                                    id="price"
                                    // type="number"
                                    style={{visibility:'hidden'}}
                                    value={this.state.price}
                                    onChange={this.handlechange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        // inputComponent: NumberFormatCustom
                                    }}
                                />
                                <TextFieldContent
                                    fullWidth
                                    label="Service/Product Cost"
                                    name="cost"
                                    id="cost"
                                    style={{visibility:'hidden'}}
                                    // type="number"
                                    value={this.state.cost}
                                    onChange={this.handlechange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        // inputComponent: NumberFormatCustom
                                    }}
                                /></>}

                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <TextFieldContent
                                    label="Category Description"
                                    name="description"
                                    placeholder="Category Description"
                                    rows={1}
                                    fullWidth
                                    multiline={true}
                                    value={this.state.description}
                                    // style={{ width: '100%' , height:'100px' }}
                                    onChange={this.handlechange}
                                />

                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Select Tax</FormLabel>
                                    <RadioGroup row aria-label="tax" name="row-radio-buttons-group" style={{ marginLeft: 10, display: this.state.isTax_available ? 'block' : 'none' }}>
                                        <FormControlLabel value={this.state.tax_type} control={<Radio checked={this.state.tax_type === 'default'} value="default" onChange={(e) => { this.handleradio(e); }} />} label="Default" />
                                        <FormControlLabel value={this.state.tax_type} control={<Radio checked={this.state.tax_type === 'custom'} value="custom" onChange={(e) => { this.handleradio(e); }} />} label="Custom" />
                                        <FormControlLabel value={this.state.tax_type} control={<Radio checked={this.state.tax_type === 'notax'} value="notax" onChange={(e) => { this.handleradio(e); }} />} label="No Tax" />

                                    </RadioGroup>

                                    <FormLabel component="legend" style={{ marginTop: '10px', display: !this.state.isTax_available ? 'block' : 'none' }}>No Tax Found!</FormLabel>
                                </FormControl>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} style={{display: (this.state.isDefault && this.state.isTax_available)  ? 'block':'none'}}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', }}>
                                    {/* <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" > */}
                                    <div style={{display: this.state.isDefaultTax_available ? 'block': 'none'}}>    
                                        {this.state.default_taxDetail.map((v, i) => {
                                            return <><Checkbox 
                                            value={v.id}
                                         checked
                                         disabled
                                         label={v.tax_name + " (" + v.tax_value + " " + v.tax_type + ")"}
                                         onChange={(e) => { this.handleCheckbox(e); }}
                                         inputProps={{ 'aria-label': 'controlled' }}
                                       /> {v.tax_name + " (" + v.tax_value + " " + v.tax_type + ")"}<br/></>
                                            // (<FormGroup>
                                            //     <FormControlLabel
                                            //         control={
                                            //             <Checkbox value={v.id} checked disabled name={v.tax_name} />
                                            //         }
                                            //         label={v.tax_name + " (" + v.tax_value + " " + v.tax_type + ")"}
                                            //     // label={v.tax_name+" ("+v.tax_value + v.tax_type === 'percentage' ? '%' : '$'+")" }
                                            //     />
                                            // </FormGroup>
                                            // )

                                        })}
                                    {/* </FormControl> */}
                                    </div>
                                    <FormLabel component="legend" style={{marginTop:'10px',display: !this.state.isDefaultTax_available  ? 'block': 'none'}}>No Default Tax Found!</FormLabel>
                                </Box>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} style={{display: (this.state.isCustom && this.state.isTax_available)  ? 'block':'none'}}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' , flexDirection:'column'}}>
                                 

                                {  this.state.all_taxDetail.map((v, i) => {
                                    return  <div style={{ display: 'flex', alignItems: 'flex-start' , flexDirection:'row'}}><Checkbox 
                                        value={v.id}
                                     checked={this.isTaxCheck(v.id)}
                                     label={v.tax_name + " (" + v.tax_value + " " + v.tax_type + ")"}
                                     onChange={(e) => { this.handleCheckbox(e); }}
                                     inputProps={{ 'aria-label': 'controlled' }}
                                   /> {v.tax_name + " (" + v.tax_value + " " + v.tax_type + ")"}<br/></div>

                                // <Checkbox value={v.id} checked={this.isTaxCheck(v.id)} name={v.id} onChange={(e) => { this.handleCheckbox(e); }} label={v.name}/>
                                })}
                                    {/* <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        {this.state.all_taxDetail.length > 0 && this.state.all_taxDetail.map((v, i) => {
                                            if (this.state.isEdit) {
                                                return (<FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox value={v.id} checked={this.isTaxCheck(v.id)} name={v.id} onChange={(e) => { this.handleCheckbox(e); }} />
                                                        }
                                                        label={v.tax_name + " (" + v.tax_value + " " + v.tax_type + ")"}
                                                    // label={v.tax_name+" ("+v.tax_value + v.tax_type === 'percentage' ? '%' : '$'+")" }
                                                    />
                                                </FormGroup>
                                                )
                                            } else {
                                                return (<FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox value={v.id} name={v.tax_name} onChange={(e) => { this.handleCheckbox(e); }} />
                                                        }
                                                        label={v.tax_name + " (" + v.tax_value + " " + v.tax_type + ")"}
                                                    />
                                                </FormGroup>
                                                )
                                            }
                                        })}
                                    </FormControl> */}
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                <ButtonContent size="large" variant="contained" disabled={this.state.isDisable} label={this.state.isEdit ? 'Update' : 'Save'} onClick={() => this.saveService()} />
                                <ButtonContent size="large" variant="outlined" label="Cancel" onClick={() => this.handleclose()} />
                            </Stack>
                        </Stack>
                    </form>
                </div>
            </div>
        </div>
        );

    }


    render() {

        return (
            <div style={{boxShadow: " 0 4px 8px 0 rgba(0,0,0,0.2)", transition: "0.3s", padding: 40,height: '80%',background: 'white'}}>

                <Grid item xs={12} style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '80%' }}>
                    <Grid item xs={12} style={{ height: '80%', }}>

                        <div style={{ height: '80%' }}>
                            {/* {this.state.categorylist.map(cat => (
                            <MenuItem value={cat.id}>
                                <Checkbox checked={this.checkCategory(cat.id)} />  
                                {cat.name} 
                            </MenuItem>
                 ))}

{this.state.categorylist.map(cat => (
                            <MenuItem value={cat.id}>
                                <Checkbox checked={this.checkCategory(cat.id)} />  
                                {cat.name} 
                            </MenuItem>
                 ))}

{this.state.categorylist.map(cat => (
                            <MenuItem value={cat.id}>
                                <Checkbox checked={this.checkCategory(cat.id)} />  
                                {cat.name} 
                            </MenuItem>
                 ))}
                 {this.state.categorylist.map(cat => (
                            <MenuItem value={cat.id}>
                                <Checkbox checked={this.checkCategory(cat.id)} />  
                                {cat.name} 
                            </MenuItem>
                 ))} */}
                            {this.renderContent()}
                        </div>



                    </Grid>

                </Grid>



            </div>

        )

        // return (<div style={{}}>
        // {this.state.isLoading && <LoaderContent show={this.state.isLoading} />}
        //     <div style={{  height: '100%',overflowY:'scroll'}}>
        //     <div  style={{ height: window.innerHeight-100+" px",padding: 0}}>

        //   <form >


        //     <Stack spacing={3}>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        //             <FormControl component="fieldset">
        //                 <FormLabel component="legend">Item Type</FormLabel>
        //                 <RadioGroup style={{marginLeft: 10}} row aria-label="tax" name="row-radio-buttons-group">
        //                     <FormControlLabel value={this.state.producttype} control={<Radio checked={this.state.producttype === 'product'} value="product" onChange={(e)=>{ 
        //                         this.handleType(e)
        //                     }}/>} label="Product" />
        //                     <FormControlLabel value={this.state.producttype} control={<Radio checked={this.state.producttype === 'service'} value="service" onChange={(e)=>{ 
        //                     this.handleType(e) }}/>} label="Service" />

        //                 </RadioGroup>
        //             </FormControl>
        //         </Stack>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        //             <TextFieldContent
        //             fullWidth
        //             required
        //             label="Product / Service Name"
        //             name="name"
        //             id="name"
        //             value={this.state.name}
        //             onChange={this.handlechange}
        //             />
        //             <FormControl fullWidth>
        //                     <InputLabel>Category</InputLabel>
        //                     <Select
        //                     labelId=""
        //                     id="selectedcategory"
        //                     multiple
        //                     value={this.state.selectedcategory}
        //                     onChange={(e)=>{
        //                         this.handlechangeSelect(e);
        //                     }}
        //                     input={<Input id="select-multiple-chip" />}
        //                     renderValue={(selected) => (
        //                         <div>
        //                         {selected.map((value) => (
        //                             <Chip key={value} label={this.getCategoryName(value)} />
        //                         ))}
        //                         </div>
        //                     )}
        //                     MenuProps={MenuProps}
        //                     >
        //                     {this.state.categorylist.map(cat => (
        //                         <MenuItem value={cat.id}>
        //                             <Checkbox checked={this.checkCategory(cat.id)} />  
        //                             {cat.name} 
        //                         </MenuItem>
        //                     ))}
        //                     </Select>
        //                 </FormControl>
        //         </Stack>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        //             <TextFieldContent
        //             fullWidth
        //             label="SKU"
        //             name="sku"
        //             id="sku"
        //             value={this.state.sku}
        //             onChange={this.handlechange}
        //             />
        //             <TextFieldContent
        //             fullWidth
        //             label="Product Code"
        //             name="productcode"
        //             id="productcode"
        //             value={this.state.productcode}
        //             onChange={this.handlechange}
        //             />
        //         </Stack>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
        //              <FormControl fullWidth>
        //                     <InputLabel id="price_type">Price Type</InputLabel>
        //                     <Select
        //                     labelId=""
        //                     id="price_type"
        //                     name="price_type"
        //                     value={this.state.pricetype}
        //                     label="Price Type"
        //                     onChange={(e)=>{
        //                         var val = e.target.value;
        //                         this.setState({pricetype: val})
        //                     }}
        //                     >
        //                     <MenuItem value='fixed'>Fixed</MenuItem>
        //                     <MenuItem value='variable'>Variable</MenuItem>
        //                     <MenuItem value='perunit'>Per Unit</MenuItem>

        //                     </Select>
        //                 </FormControl>
        //                 <TextFieldContent
        //                 fullWidth
        //                 required
        //                 label="Service/Product Price"
        //                 name="price"
        //                 id="price"
        //                 type="number"
        //                 value={this.state.price}
        //                 onChange={this.handlechange}
        //                 InputProps={{
        //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
        //                 }}
        //                 />
        //                 <TextFieldContent
        //                 fullWidth
        //                 label="Service/Product Cost"
        //                 name="cost"
        //                 id="cost"
        //                 type="number"
        //                 value={this.state.cost}
        //                 onChange={this.handlechange}
        //                 InputProps={{
        //                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
        //                 }}
        //                 />
        //         </Stack>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        //             <TextFieldContent
        //             label="Category Description"
        //             name="description"
        //             placeholder="Category Description"
        //             rows={1}
        //             fullWidth
        //             multiline={true}
        //             value={this.state.description}
        //             // style={{ width: '100%' , height:'100px' }}
        //             onChange={this.handlechange}
        //             />

        //         </Stack>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        //             <FormControl component="fieldset">
        //                 <FormLabel component="legend">Select Tax</FormLabel>
        //                 <RadioGroup row aria-label="tax" name="row-radio-buttons-group" style={{marginLeft: 10,display: this.state.isTax_available ? 'block': 'none'}}>
        //                     <FormControlLabel value={this.state.tax_type} control={<Radio checked={this.state.tax_type === 'default'} value="default" onChange={(e)=>{ this.handleradio(e); }}/>} label="Default" />
        //                     <FormControlLabel value={this.state.tax_type} control={<Radio checked={this.state.tax_type === 'custom'} value="custom" onChange={(e)=>{ this.handleradio(e); }}/>} label="Custom" />
        //                     <FormControlLabel value={this.state.tax_type} control={<Radio checked={this.state.tax_type === 'notax'}  value="notax" onChange={(e)=>{ this.handleradio(e); }} />} label="No Tax" />

        //                 </RadioGroup>

        //                 <FormLabel component="legend" style={{marginTop:'10px',display: !this.state.isTax_available ? 'block': 'none'}}>No Tax Found!</FormLabel>
        //             </FormControl>
        //         </Stack>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} style={{display: this.state.isDefault ? 'block':'none', }}>
        //             <Box sx={{ display: 'flex', alignItems: 'flex-end',  }}>
        //                 <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" style={{background : 'red', marginTop: -40}}>
        //                 {this.state.default_taxDetail.map((v,i)=>{
        //                     return ( <FormGroup>
        //                                 <FormControlLabel 
        //                                 control={
        //                                     <Checkbox value={v.id} checked disabled name={v.tax_name} />
        //                                 }
        //                                 label={v.tax_name+" ("+v.tax_value +" "+v.tax_type +")"}
        //                                 // label={v.tax_name+" ("+v.tax_value + v.tax_type === 'percentage' ? '%' : '$'+")" }
        //                             />
        //                         </FormGroup>
        //                         )

        //                 })} 
        //                 </FormControl>
        //             </Box>
        //         </Stack>
        //         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} style={{display: this.state.isCustom ? 'block':'none'}}>
        //             <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        //                 <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        //                     {this.state.all_taxDetail.map((v,i)=>{
        //                         if(this.state.isEdit){
        //                             return ( <FormGroup>
        //                                         <FormControlLabel 
        //                                         control={
        //                                             <Checkbox value={v.id} checked={this.isTaxCheck(v.id)} name={v.tax_name} onChange={(e)=>{ this.handleCheckbox(e); }}/>
        //                                         }
        //                                         label={v.tax_name+" ("+v.tax_value+" " + v.tax_type +")"}
        //                                         // label={v.tax_name+" ("+v.tax_value + v.tax_type === 'percentage' ? '%' : '$'+")" }
        //                                     />
        //                                 </FormGroup>
        //                                 )
        //                         }else{
        //                             return ( <FormGroup>
        //                                         <FormControlLabel 
        //                                         control={
        //                                             <Checkbox value={v.id} name={v.tax_name} onChange={(e)=>{ this.handleCheckbox(e); }}/>
        //                                         }
        //                                         label={v.tax_name+" ("+v.tax_value+" " + v.tax_type +")"}
        //                                     />
        //                                 </FormGroup>
        //                                 )
        //                         }
        //                     })} 
        //                 </FormControl>
        //             </Box>
        //         </Stack>
        //         <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        //             <ButtonContent size="large" variant="contained" disabled={this.state.isDisable} label={this.state.isEdit ? 'Update' : 'Save' } onClick={()=>this.saveService()}/>
        //             <ButtonContent size="large" variant="outlined" label="Cancel" onClick={()=>this.handleclose()}/>
        //         </Stack>
        //     </Stack>
        //   </form>
        //   </div>
        //   </div>
        //   </div>
        // );
    }
}
