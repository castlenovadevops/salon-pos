import React from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';

// import { DataGrid } from '@mui/x-data-grid';
// material

import { Stack,  List , ListItem, ListItemIcon, ListItemText,Container, Card, Breadcrumbs, Typography,Link,InputAdornment,Grid} from '@mui/material';

import DataManager from '../../../controller/datacontroller'
import ModalTitleBar from '../../../components/Modal/Titlebar';
import TextareaAutosizeContent from '../../../components/formComponents/TextAreaAutosize'
import ButtonContent from '../../../components/formComponents/Button'
import LoaderContent from '../../../components/formComponents/LoaderDialog';
import AppBarContent from '../../TopBar';
import DrawerContent from '../../Drawer';
import { Print } from '@mui/icons-material';
// import TextFieldContent from '../../../components/TextField';
// import TextareaAutosizeContent from '../../../components/TextareaAutosize'

export default class PrinterSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            businessdetail:{},
            printer_name: '',
            select_printer: '',
            saloon_name: '',
            header_text: '',
            footer_text: '',
            billing_width: '',
            isEdit: false,
            billing_height: '',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            line_height: 0,
            gap: 0,
            noof_items:0,
            decimal_point:1,
            printers_list: [],
            defaultprinter:'',
            adddialog:false
        };
        this.savePrinter = this.savePrinter.bind(this);
        this.handleclose = this.handleclose.bind(this);
        this.handlechange = this.handlechange.bind(this)
        this.handlechangePrinter = this.handlechangePrinter.bind(this);
        this.handlechangeDecimal = this.handlechangeDecimal.bind(this)

        this.logout = this.logout.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this) 
        this.handleClick = this.handleClick.bind(this);
        this.handlePageEvent = this.handlePageEvent.bind(this);
        
    }
    componentDidMount(){
        let printer = window.localStorage.getItem("defaultprinter");
        if(printer != undefined && printer != '')
            this.setState({defaultprinter: printer})

        let detail = window.localStorage.getItem("businessdetail");
        window.api.getprinters().then(list=>{
            var printers = list.printers
            console.log("printers:",printers)
            this.setState({printers_list: printers}  ) 
        }) 

        this.setState({businessdetail: JSON.parse(detail)}, ()=>{
         
        })

        var  dataManager = new DataManager()
        dataManager.getData("select * from printer_setting").then(response => {

            if (response instanceof Array) {
                if(response.length>0) {
                    this.setState({isEdit: true})
                    var respose = response[0]
                    this.setState({printer_name: respose.printer_name,
                        select_printer: respose.select_printer,
                        saloon_name: respose.saloon_name,
                        header_text: respose.header_text,
                        footer_text: respose.footer_text,
                        billing_width: respose.billing_width,
                        billing_height: respose.billing_height,
                        top: respose.top,
                        right: respose.right,
                        bottom: respose.bottom,
                        left: respose.left,
                        line_height: respose.line_height,
                        gap: respose.gap,
                        noof_items:respose.noof_items,
                        decimal_point:respose.decimal_point
                    })
                }
            }
        })
    }
  


    handlechange(e){ 
        if(e.target.value.match("^.{26,26}$")==null) {
            this.setState({ [e.target.name]: e.target.value } );
         
        }
    }


    savePrinter(){

        console.log("savePrinter")

     
        var filtered = this.state.printers_list.filter(item => item.displayName == this.state.select_printer )

        console.log(filtered)

        var  dataManager = new DataManager()
        dataManager.getData("select * from printer_setting").then(response => {

            if (response instanceof Array) {
                if(response.length>0) {
                    var respose = response[0]
                    //** to be update */
                    var idv = respose.id
                    // var sql = `UPDATE printer_setting
                    // SET printer_name = `
                    // +`'`+this.state.printer_name+`',`+
                    // `select_printer = `
                    // +`'`+this.state.select_printer+`',`+
                    // `saloon_name = `
                    // +`'`+this.state.saloon_name+`',`+
                    // `header_text = `
                    // +`'`+this.state.header_text+`',`+
                    // `footer_text = `
                    // +`'`+this.state.footer_text+`',`+
                    // `billing_width = `
                    // +`'`+this.state.billing_width+`',`+
                    // `billing_height = `
                    // +`'`+this.state.billing_height+`',`+
                    // `top = `
                    // +`'`+this.state.top+`',`+
                    // `right = `
                    // +`'`+this.state.right+`',`+
                    // `bottom = `
                    // +`'`+this.state.bottom+`',`+

                    // `left = `
                    // +`'`+this.state.left+`',`+
                    // `line_height = `
                    // +`'`+this.state.line_height+`',`+
                    // `gap = `
                    // +`'`+this.state.gap+`',`+
                    // `noof_items = `
                    // +`'`+this.state.noof_items+`',`+
                    // `decimal_point = `
                    // +`'`+this.state.decimal_point+`'`+
                    // " WHERE id = "+"'"+idv+"'"

                    var sql = `UPDATE printer_setting
                    SET printer_name = `
                    +`'`+this.state.printer_name+`',`+
                    `select_printer = `
                    +`'`+JSON.stringify(filtered[0]) +`'`+
                    " WHERE id = "+"'"+idv+"'"

                    const res  = dataManager.saveData(sql)

                    console.log("printer_setting updated",sql)
                    this.props.onChangePage("dashboard");

                }
                else {
                    //** to be insert */
                    // var sql = `insert into printer_setting(printer_name,select_printer,saloon_name,header_text,footer_text,
                    //     billing_width, billing_height,top, right,bottom,left,line_height,gap,noof_items,decimal_point
                    //     ) values('`
                    //     +this.state.printer_name+`','`
                    //     +this.state.select_printer+`','`
                    //     +this.state.saloon_name+`','`
                    //     +this.state.header_text+`','`
                    //     +this.state.footer_text+`','`
                    //     +this.state.billing_width+`','`
                    //     +this.state.billing_height+`','`
                    //     +this.state.top+`','`
                    //     +this.state.right+`','`
                    //     +this.state.bottom+`','`
                    //     +this.state.left+`','`
                    //     +this.state.line_height+`','`
                    //     +this.state.gap+`','`
                    //     +this.state.noof_items+`','`
                    //     +this.state.decimal_point+`')`;


                    var sql = `insert into printer_setting(printer_name,select_printer,saloon_name,header_text,footer_text,
                        billing_width, billing_height,top, right,bottom,left,line_height,gap,noof_items,decimal_point
                        ) values('`
                        +this.state.printer_name+`','`
                        +JSON.stringify(filtered[0])+`','','','','','','','','','','','','','')`; 
                    const res  = dataManager.saveData(sql) 
                    console.log("printer_setting inserted",sql)
                    this.props.onChangePage("dashboard");

                }
            }

        })
        

    }

    handleclose(){
        // this.props.handleClose()
        this.props.onChangePage("dashboard");
    }

    handlechangePrinter(e) {
        this.setState({select_printer: e.target.value})
    }

    handlechangeDecimal(e){
        this.setState({decimal_point: e.target.value})
    }

    handleClick(){
        // console.log(event.target)
        this.setState({anchorEl:null, openMenu:true, editForm:false, addForm:false});
    }
    
    
    handleCloseMenu(){
        this.setState({anchorEl:null, openMenu:false});
    }
    handlePageEvent(pagename){
        console.log("handlePageEvent:::",pagename)
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

    openAdd(){
        window.api.getprinters().then(list=>{ 
            this.setState({adddialog: true, printers_list: list.printers})
        })
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
    
           
             <Container maxWidth="xl">
             <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
                <Typography variant="h4" gutterBottom>
                Default Printer 
                </Typography>
                    <ButtonContent
                    onClick={()=>this.openAdd()}
                    size="large"
                    variant="contained"
                    label="Add Printer"
                    startIcon={<Icon icon={plusFill} />}
                    />
            </Stack>  


           {this.state.defaultprinter != '' && <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={3}>
                <Typography variant="h6" style={{display:'flex', alignItems:'center'}}>
                    <Print />&nbsp;&nbsp;{ window.localStorage.getItem('defaultprinterdisplayname')}
                </Typography> 
            </Stack>  }

            {this.state.adddialog && <div>
                    <div style={{border:'1px solid',right:0, bottom:0,top:'0',left:'0',position:'absolute', zIndex:'999999'}}>
                        <div style={{background:'rgba(0,0,0,0.8)',right:0, bottom:0,top:'0',left:'0',position:'absolute' }}>
                        </div>
                        <div style={{background:'#fff', height:'80%',  width:'60%', margin:'5% auto 0', overflow:'auto', position:'relative'}}>
                        
                            <ModalTitleBar onClose={()=>this.setState({adddialog:false})} title="Add Printer"/>
                            <div style={{  overflow:'hidden auto'}}>
                            <List >
                                {this.state.printers_list.map(p=>{
                                    return (
                                        <ListItem  button   style= {{marginLeft: 10, cursor:'pointer', padding:'1.5rem'}}  onClick={()=>{ 
                                            window.localStorage.setItem('defaultprinterdisplayname', p.displayName);
                                            window.localStorage.setItem('defaultprinter', p.name);
                                            this.setState({defaultprinter: p.displayName, adddialog: false});
                                        }}>
                                            <ListItemIcon><Print /></ListItemIcon>
                                            <ListItemText primary={p.displayName} />
                                        </ListItem> 
                                    )
                                })}

                            </List>
                            </div>
                        </div>
                    </div>
                </div>}


        </Container> 
          </Grid>
          </Grid>
          </div>
          </div>

          
           
        )
    }

}