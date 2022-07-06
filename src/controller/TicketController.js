import DataManager from './datacontroller';
import Moment from 'moment';
import axios from 'axios';

import config from '../config/config';
export default class TicketController {
    dataManager = new DataManager()

    async saveData(obj) {
        return new Promise((resolve, reject) => {
            var keys = '';
            var values = ''
            Object.keys(obj.data).forEach((val, i) => {
                if (obj.data[val] != undefined) {
                    if (i > 0) {
                        keys += ",";
                        values += ",";
                    }
                    keys += val;
                    values += (typeof obj.data[val] == 'string' ? (val != 'password' ? `'${obj.data[val].replace("'", "''").trim()}'` : `'${obj.data[val]}'`) : `${obj.data[val]}`)
                }
            });

            // const sqlQuery = `INSERT INTO `+obj.table_name+`(`+Object.keys(obj.data).join(',')+`) VALUES (` + Object.keys(obj.data).map(val => ((typeof obj.data[val] == 'string') ? `'${obj.data[val].replace("'","''").trim()}'` :  `${obj.data[val] !== undefined ? obj.data[val] : ''}`)).join(',')+`)`;
            const sqlQuery = `INSERT INTO ` + obj.table_name + `(` + keys + `) values(` + values + `)`;
            console.log("INSERT::::", sqlQuery);
            this.dataManager.saveData(sqlQuery).then(res => {
                //console.log(res); 
                this.dataManager.getData("select * from tosync_tables where table_name='" + obj.table_name + "'").then(res1 => {
                    if (res1.length > 0 || obj.table_name === 'tosync_tables' || obj.data.sync_status === 1) {
                        resolve(res)
                    }
                    else {
                        this.saveData({ table_name: 'tosync_tables', data: { table_name: obj.table_name, created_on: new Date().toISOString() } }).then(r => {
                            resolve(res)
                        });
                    }
                })
            })
        });
    }


    async updateData(obj) {
        return new Promise((resolve, reject) => {
            var sqlQuery = `UPDATE ` + obj.table_name + ` set `;
            Object.keys(obj.data).forEach((val, i) => {
                if (obj.data[val] != undefined) {
                    if (i > 0) {
                        sqlQuery += ",";
                    }
                    sqlQuery += val + "=" + (typeof obj.data[val] == 'string' ? (val != 'password' ? `'${obj.data[val].replace("'", "''").trim()}'` : `md5('${obj.data[val]}')`) : `${obj.data[val]}`)
                }
            });
            if (typeof obj.query_value === 'string') {
                sqlQuery += " where " + obj.query_field + "='" + obj.query_value + "'";
            }
            else {
                sqlQuery += " where " + obj.query_field + "=" + obj.query_value;
            }
            console.log("UPDATE:::::",sqlQuery);
            this.dataManager.saveData(sqlQuery).then(res => {
                this.dataManager.getData("select * from tosync_tables where table_name='" + obj.table_name + "'").then(res => {
                    if (res.length > 0 || obj.table_name === 'tosync_tables'  || obj.data.sync_status === 1) {
                        this.updateTicketRefTables(obj, res, resolve)
                    }
                    else {
                        this.saveData({ table_name: 'tosync_tables', data: { table_name: obj.table_name, created_on: new Date().toISOString() } }).then(r => {
                            this.updateTicketRefTables(obj, res, resolve)
                        });
                    }
                })
            })
        });
    }

    updateTicketRefTables(obj, res, resolve) {
        if (obj.table_name === 'ticket') {
            console.log(obj);
            this.updateData({ table_name: 'ticket_services', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {

                this.updateData({ table_name: 'ticketservice_taxes', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {

                    this.updateData({ table_name: 'ticketservice_requestnotes', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {

                        this.updateData({ table_name: 'ticket_payment', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {

                            this.updateData({ table_name: 'employee_commission_detail', data: { sync_status: 0 }, query_field: 'ticketref_id', query_value: obj.data.sync_id }).then(r => {
                                resolve(res)
                            })
                        })
                    })
                })
            })
        }
        else {
            resolve(res)
        }
    }


    async saveTicket(stateinput, ticketid) {
        var udetail = window.localStorage.getItem('employeedetail');
        var userdetail = { id: 0 };
        if (udetail !== undefined && udetail !== null) {
            userdetail = JSON.parse(udetail);
        }
        this.dataManager.getData("select * from ticket where sync_id='" + ticketid + "'").then(res => {
            if (res.length > 0) {
                var ticketDetail = res[0];
                this.dataManager.saveData("delete from ticket_services where ticketref_id='" + ticketDetail.sync_id + "'").then(res => {
                    this.dataManager.saveData("delete from ticketservice_taxes where ticketref_id='" + ticketDetail.sync_id + "'").then(res => {
                        this.dataManager.saveData("delete from ticketservice_requestnotes where ticketref_id='" + ticketDetail.sync_id + "'").then(res => {
                            this.dataManager.saveData("delete from employee_commission_detail where ticketref_id='" + ticketDetail.sync_id + "'").then(res => {
                                this.TicketdiscountCalculation(ticketid, ticketDetail, stateinput, userdetail)
                            });
                        });
                    });
                });
            }
        })
    }


    TicketdiscountCalculation(ticketid, ticketDetail, stateinput, userdetail) {
        //console.log("Ticket Discount calculation called");
        var detail = window.localStorage.getItem("businessdetail");
        if (detail !== undefined && detail !== '') {
            var businessdetail = JSON.parse(detail);
            //Discount Calculation
            this.dataManager.saveData("delete from employee_commission_detail where ticketref_id='" + ticketDetail.sync_id + "'").then(r => {

                window.api.getSyncUniqueId().then(csyn => {
                    var csyncid = csyn.syncid;
                    if (stateinput.selected_discount !== 0 && stateinput.selected_discount !== '' && stateinput.selected_discount !== undefined) {
                        let dis = stateinput.discount_list.filter(item => item.id === stateinput.selected_discount);
                        let dis_amt = stateinput.total_discount;
                        //console.log(stateinput.discount_list,stateinput.selected_discount, dis);
                        if (dis[0].division_type === 'owner') {
                            var disemp_input = {
                                employeeId: stateinput.business_owner.business_owner_id,
                                // employeeId: service_input.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: ticketid,
                                cash_type_for: 'owner-discount',
                                cash_amt: dis_amt,
                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: userdetail.id,
                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: userdetail.id,
                                ticketref_id: ticketDetail.sync_id,
                                sync_status: 0,
                                sync_id: csyncid + "ownerdiscount",
                                isActive:1
                            }

                            this.saveData({ table_name: "employee_commission_detail", data: disemp_input }).then(res => {
                                this.saveTicketService(0, ticketid, ticketDetail, stateinput.services_taken, userdetail);
                            })

                        }
                        else if (dis[0].division_type === 'employee') {

                            let emp_dis_amt = dis_amt / stateinput.services_taken.length;
                            this.saveEmployeeTicketDiscount('emp-discount', 0, emp_dis_amt, businessdetail, csyncid, ticketid, ticketDetail, stateinput, userdetail)

                        }
                        else {
                            let owner_division = dis[0].owner_division;
                            let emp_division = dis[0].emp_division;


                            let owner_dis_amt = (owner_division / 100) * stateinput.total_discount;
                            let emp_dis_amt = (emp_division / 100) * stateinput.total_discount;
                            dis_amt = owner_dis_amt;
                            //Owner
                            var owner_dis_input = {
                                employeeId: stateinput.business_owner.business_owner_id,
                                businessId: businessdetail["id"],
                                // ticket_id: ticketid, 
                                cash_type_for: 'owneremp-discount',
                                cash_amt: dis_amt,
                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: userdetail.id,
                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: userdetail.id,
                                ticketref_id: ticketDetail.sync_id,
                                sync_status: 0,
                                sync_id: csyncid + "ownerempdiscountowner",
                                isActive:1
                            }

                            this.saveData({ table_name: "employee_commission_detail", data: owner_dis_input }).then(res => {
                                this.saveEmployeeTicketDiscount('owneremp-discount', 0, emp_dis_amt, businessdetail, csyncid, ticketid, ticketDetail, stateinput, userdetail)
                            })
                        }

                    }
                    else {
                        //console.log("")
                        this.saveTicketService(0, ticketid, ticketDetail, stateinput.services_taken, userdetail);
                    }
                })

            })

        }
    }


    saveEmployeeTicketDiscount(discounttype, ei, dis_amt, businessdetail, csyncid, ticketid, ticketDetail, stateinput, userdetail) {
        //console.log(stateinput.services_taken)
        if (ei < stateinput.services_taken.length) {
            var service_input = Object.assign({}, stateinput.services_taken[ei]);
            //Employee
            var emp_dis_input = {
                employeeId: service_input.employee_id,
                businessId: businessdetail["id"],
                // ticket_id: ticketid,
                cash_type_for: discounttype,
                cash_amt: dis_amt,
                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                created_by: userdetail.id,
                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                updated_by: userdetail.id,
                ticketref_id: ticketDetail.sync_id,
                sync_status: 0,
                sync_id: csyncid + "empdiscount",
                isActive:1
            }


            this.saveData({ table_name: "employee_commission_detail", data: emp_dis_input }).then(res => {
                this.saveEmployeeTicketDiscount(discounttype, ei + 1, dis_amt, businessdetail, csyncid, ticketid, ticketDetail, stateinput, userdetail)
            })
        }
        else {
            this.saveTicketService(0, ticketid, ticketDetail, stateinput.services_taken, userdetail);
        }
    }

    async saveTicketService(idx, ticketid, ticketDetail, services_taken, userdetail) {

        window.api.invoke('evantcall', 'saveTicketService save called ' + idx).then(r => {

        })
        console.log("SAVE TICKET SERTIC#E: idx ", idx, services_taken)
        if (idx < services_taken.length) {
            console.log("IF SAVE TICKET SERTIC#E: idx ", idx )
            var obj = services_taken[idx];
            obj["ticket_id"] = ticketid;
            obj["service_id"] = obj.servicedetail.service_id
            obj["ticketref_id"] = ticketDetail.sync_id
            window.api.getSyncUniqueId().then(syncres => {
                var syncid = syncres.syncid;
                var service_input = {
                    // ticket_id: ticketid,
                    service_id: obj.servicedetail.service_id,
                    employee_id: obj.employee_id,
                    service_cost: obj.subtotal,
                    service_quantity: obj.qty,
                    istax_selected: 0,
                    perunit_cost: obj.perunit_cost,
                    discount_id: obj.discount.discount_id !== undefined ? obj.discount.discount_id : 0,
                    discount_type: obj.discount.discount_type !== undefined ? obj.discount.discount_type : 0,
                    discount_value: obj.discount.discount_value !== undefined ? obj.discount.discount_value : 0,
                    total_discount_amount: obj.discountamount,
                    tips_amount: obj.tips_amount !== undefined ? obj.tips_amount : 0,
                    isActive: 1,
                    isSpecialRequest: obj.isSpecialRequest !== undefined ? obj.isSpecialRequest : 0,
                    created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    created_by: userdetail.id,
                    process: obj.process !== undefined ? obj.process : '',
                    previousticketid: obj.previousticketid !== undefined ? obj.previousticketid : '',
                    ticketref_id: ticketDetail.sync_id,
                    sync_id: syncid,
                    sync_status: 0,
                    sort_number: idx + 1,
                }
                this.saveData({ table_name: 'ticket_services', data: service_input }).then(sres => {
                    console.log("table_name: 'ticket_services'", sres)
                    if (sres.length > 0) {
                        var ticketservice_id = sres[0].id;
                        obj["id"] = ticketservice_id;
                        obj["sync_id"] = syncid;
                        this.saveTaxes(ticketid, ticketservice_id, obj, 0, idx, ticketDetail, services_taken, userdetail)
                    }
                })

            })
        }
        else {

        }

    }


    saveTaxes(ticketid, tsid, selectedservice, tidx, idx, ticketDetail, services_taken, userdetail) {
        console.log(selectedservice.taxes.length, ":::::Tax ,length")

        console.log("TAX LENGETH ticket ctrler", selectedservice)
        if (tidx < selectedservice.taxes.length) {
            var t = selectedservice.taxes[tidx];

            window.api.getSyncUniqueId().then(syncres => {
                var syncid = syncres.syncid;
                var taxinput = {
                    // ticket_id : ticketid,
                    // ticketservice_id: tsid,
                    tax_id: t.tax_id,
                    tax_value: t.tax_value,
                    tax_type: t.tax_type,
                    tax_calculated: t.tax_calculated,
                    isActive: 1,
                    ticketref_id: selectedservice.ticketref_id,
                    serviceref_id: selectedservice.sync_id,
                    sync_id: syncid,
                    sync_status: 0
                }
                ////console.log(taxinput);
                var thisobj = this;
                this.saveData({ table_name: 'ticketservice_taxes', data: taxinput }).then(r => {
                    thisobj.saveTaxes(ticketid, tsid, selectedservice, tidx + 1, idx, ticketDetail, services_taken, userdetail)
                })
            });
        }
        else {
            this.saveRequestNotes(ticketid, selectedservice, idx, ticketDetail, services_taken, userdetail)
        }
    }

    async saveRequestNotes(ticketid, selectedservice, idx, ticketDetail, services_taken, userdetail) {
        var requestnotes = selectedservice.requestNotes;
        var thisobj = this;
        //console.log("Saviong requestnotes")
        if (requestnotes !== undefined && requestnotes !== '') {
            var input = {
                notes: requestnotes || '',
                // ticket_id:ticketid,
                // service_id:selectedservice.id,
                addedby: userdetail.id,
                ticketref_id: selectedservice.ticketref_id,
                serviceref_id: selectedservice.sync_id,
                isActive: 1
            }
            window.api.getSyncUniqueId().then(syun => {
                input["sync_id"] = syun.syncid;
                input["sync_status"] = 0;
                this.saveData({ table_name: 'ticketservice_requestnotes', data: input }).then(r => {
                    //console.log("saved requestnotes")
                    thisobj.saveEmpCommission(ticketid, selectedservice, idx, ticketDetail, services_taken, userdetail)
                })
            });
        }
        else {
            thisobj.saveEmpCommission(ticketid, selectedservice, idx, ticketDetail, services_taken, userdetail)
        }
    }

    async saveEmpCommission(ticketid, selectedservice, idx, ticketDetail, services_taken, userdetail) {
        var businessdetail = {}
        var detail = window.localStorage.getItem('businessdetail');
        businessdetail = JSON.parse(detail);
        var employeedetail = {}
        var detail1 = window.localStorage.getItem('employeedetail');
        employeedetail = JSON.parse(detail1);

        // Service Commission Calculation for Employee & owner for ticket services - Start
        window.api.getSyncUniqueId().then(syndata => {
            var csyncid = syndata.syncid;
            const defsql = "select * from default_commission where businessId =  '" + businessdetail["id"] + "'"
            this.dataManager.getData(defsql).then(defres => {
                var ownerid = '';
                this.dataManager.getData("select * from user_business where role='Owner'").then(own => {
                    console.log("OPWNER DETAIL")
                    console.log(defres)
                    if (own.length > 0)
                        ownerid = own[0].business_owner_id;

                    if (defres.length > 0) {
                        const sql = "select * from employee_salary where employeeId =  '" + selectedservice.employee_id + "'"

                        this.dataManager.getData(sql).then(response => {

                            var owner_percentage = defres[0].owner_percentage;
                            var employee_percentage = defres[0].emp_percentage;
                            var per_amt = 0;
                            if (response.length > 0) {
                                owner_percentage = response[0].owner_percentage;
                                employee_percentage = response[0].employee_percentage;
                            }

                            console.log("owner employee perccent",employee_percentage, owner_percentage);
                            //Employee Service Commission Calculation 
                            per_amt = (employee_percentage / 100) * selectedservice.qty * selectedservice.perunit_cost;
                            var emp_input = {
                                employeeId: selectedservice.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: selectedservice.ticket_id,
                                // ticket_serviceId: selectedservice.id,
                                cash_type_for: 'service',
                                cash_amt: per_amt,
                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: employeedetail.id,
                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: employeedetail.id,
                                ticketref_id: selectedservice.ticketref_id,
                                ticketserviceref_id: selectedservice.sync_id,
                                sync_status: 0,
                                sync_id: csyncid + "service",
                                isActive:1
                            }
                            window.api.invoke('evantcall', emp_input)
                            //////console.log("emp inpout");
                            //////console.log(emp_input);
                            this.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => {
                                //////console.log("1.saved to saveTicketEmployeeCommission")
                            })
                            //Owner Service Commission Calculation
                            per_amt = (owner_percentage / 100) * selectedservice.qty * selectedservice.perunit_cost;
                            var owner_input = {
                                employeeId: ownerid,
                                businessId: businessdetail["id"],
                                // ticket_id: selectedservice.ticket_id,
                                // ticket_serviceId: selectedservice.id,
                                cash_type_for: 'ownercommission',
                                cash_amt: per_amt,
                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: employeedetail.id,
                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: employeedetail.id,
                                ticketref_id: selectedservice.ticketref_id,
                                ticketserviceref_id: selectedservice.sync_id,
                                sync_status: 0,
                                sync_id: csyncid + "ownercommission",
                                isActive:1
                            }
                            window.api.invoke('evantcall', owner_input)
                            console.log("OWNER INPUT ##########")
                            console.log(owner_input);
                            console.log("OWNER INPUT ##########")
                            this.saveData({ table_name: 'employee_commission_detail', data: owner_input }).then(res => {
                                //console.log("2.saved to owner saveTicketEmployeeCommission")
                            })


                        })

                        //Service Commission Calculation for technician_id for ticket - end

                        //Tips Calculation -Start
                        if (selectedservice.tips_amount !== 0) {
                            //console.log("TIPS SAVING TICKETCONTROLLER::::")
                            //console.log(selectedservice);
                            //console.log("TIPS SAVING TICKETCONTROLLER::::")

                            var emp_inputelse = {
                                employeeId: selectedservice.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: selectedservice.ticket_id,
                                // ticket_serviceId: selectedservice.id,
                                cash_type_for: 'tips',
                                cash_amt: selectedservice.tips_amount,
                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: employeedetail.id,
                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: employeedetail.id,
                                ticketref_id: selectedservice.ticketref_id,
                                ticketserviceref_id: selectedservice.sync_id,
                                sync_status: 0,
                                sync_id: csyncid + "tips",
                                isActive:1
                            }


                            this.saveData({ table_name: 'employee_commission_detail', data: emp_inputelse }).then(res => {
                                ////////console.log"4.tips_amount saved to saveTicketEmployeeCommission")
                            })
                        }
                        //Tips Calculation -End

                        console.log(" CTRL DISCOUNT CALC", selectedservice, selectedservice.discount_id)
                        //Discount Calculation
                        if (selectedservice.discount.discount_id !== 0 && selectedservice.discount.discount_id !== undefined) {


                            this.dataManager.getData("select * from discounts where id=" + selectedservice.discount.discount_id).then(disres => {
                                var selectedDiscount = [];
                                if (disres.length > 0) {
                                    let dis = disres;

                                    let dis_amt = 0
                                    if (dis[0].division_type === 'owner') {
                                        if (dis[0].discount_type === 'amount') {
                                            dis_amt = dis[0].discount_value
                                        } else {
                                            dis_amt = (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;
                                        }
                                        var disemp_inputif = {
                                            employeeId: ownerid,
                                            // employeeId: service_input.employee_id,
                                            businessId: businessdetail["id"],
                                            // ticket_id: selectedservice.ticket_id,
                                            // ticket_serviceId: selectedservice.id,
                                            cash_type_for: 'owner-discount',
                                            cash_amt: dis_amt,
                                            created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            created_by: employeedetail.id,
                                            updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            updated_by: employeedetail.id,
                                            ticketref_id: selectedservice.ticketref_id,
                                            ticketserviceref_id: selectedservice.sync_id,
                                            sync_status: 0,
                                            sync_id: csyncid + "owner-discount",
                                            isActive:1
                                        }

                                        this.saveData({ table_name: 'employee_commission_detail', data: disemp_inputif }).then(res => {
                                            ////////console.log"5.employee_commission/save/")
                                        })

                                    }
                                    else if (dis[0].division_type === 'employee') {
                                        if (dis[0].discount_type === 'amount') {
                                            dis_amt = dis[0].discount_value
                                        } else {
                                            dis_amt = (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;
                                        }
                                        var disemp_inputelse = {
                                            employeeId: selectedservice.employee_id,
                                            businessId: businessdetail["id"],
                                            // ticket_id: selectedservice.ticket_id,
                                            // ticket_serviceId: selectedservice.id,
                                            cash_type_for: 'emp-discount',
                                            cash_amt: dis_amt,
                                            created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            created_by: employeedetail.id,
                                            updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            updated_by: employeedetail.id,
                                            ticketref_id: selectedservice.ticketref_id,
                                            ticketserviceref_id: selectedservice.sync_id,
                                            sync_status: 0,
                                            sync_id: csyncid + "owner-discount",
                                            isActive:1
                                        }

                                        this.saveData({ table_name: 'employee_commission_detail', data: disemp_inputelse }).then(res => {
                                            ////////console.log"6.employee_commission/save/")
                                        })
                                    }
                                    else {
                                        let owner_division = dis[0].owner_division;
                                        let emp_division = dis[0].emp_division;
                                        if (dis[0].discount_type === 'amount') {
                                            dis_amt = dis[0].discount_value * (owner_division / 100);
                                            var emp_dis_amt = dis[0].discount_value * (emp_division / 100)
                                            //Owner
                                            var owner_dis_inputif = {
                                                employeeId: ownerid,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'owneremp-discount',
                                                cash_amt: dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "owneremp-discountowner",
                                                isActive:1
                                            }

                                            this.saveData({ table_name: 'employee_commission_detail', data: owner_dis_inputif }).then(res => {
                                                ////////console.log"7.employee_commission/save/")
                                            })

                                            //Employee
                                            var emp_dis_inputif = {
                                                employeeId: selectedservice.employee_id,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'emp-discount',
                                                cash_amt: emp_dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "emp-discount",
                                                isActive:1
                                            }


                                            this.saveData({ table_name: 'employee_commission_detail', data: emp_dis_inputif }).then(res => {
                                                ////////console.log"8.employee_commission/save/")
                                            })

                                        } else {
                                            let owner_dis_amt = (owner_division / 100) * (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;
                                            let emp_dis_amt = (emp_division / 100) * (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;


                                            //Owner
                                            var owner_per_inputelse = {
                                                employeeId: ownerid,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'owner-discount',
                                                cash_amt: owner_dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "owner-discount",
                                                isActive:1
                                            }

                                            this.saveData({ table_name: 'employee_commission_detail', data: owner_per_inputelse }).then(res => {
                                                ////////console.log"9.employee_commission/save/")
                                            })
                                            //Employee
                                            var emp_per_inputelse = {
                                                employeeId: selectedservice.employee_id,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'owneremp-discount',
                                                cash_amt: emp_dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "owneremp-discountemp",
                                                isActive:1
                                            }

                                            this.saveData({ table_name: 'employee_commission_detail', data: emp_per_inputelse }).then(res => {
                                                ////////console.log"10.employee_commission/save/")
                                            })

                                        }
                                    }
                                }
                            });

                        }
                    }
                    else {
                        console.log("EMP RES CAKKKKKKK")
                        //Employee Service Commission Calculation
                        var input = {
                            employeeId: selectedservice.employee_id,
                            businessId: businessdetail["id"],
                            // ticket_id: selectedservice.ticket_id,
                            // ticket_serviceId: selectedservice.id,
                            cash_type_for: 'service',
                            cash_amt: selectedservice.qty * selectedservice.perunit_cost,
                            created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            created_by: employeedetail.id,
                            updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                            updated_by: employeedetail.id,
                            ticketref_id: selectedservice.ticketref_id,
                            ticketserviceref_id: selectedservice.sync_id,
                            sync_status: 0,
                            sync_id: csyncid + "service",
                            isActive:1
                        }
                        //////console.log(input);
                        this.saveData({ table_name: 'employee_commission_detail', data: input }).then(res => {
                            //////console.log("3.saved to saveTicketEmployeeCommission")
                        })

                        //Service Commission Calculation for technician_id for ticket - end

                        //Tips Calculation -Start
                        if (selectedservice.tips_amount !== 0) {
                            var emp_input = {
                                employeeId: selectedservice.employee_id,
                                businessId: businessdetail["id"],
                                // ticket_id: selectedservice.ticket_id,
                                // ticket_serviceId: selectedservice.insertId,
                                cash_type_for: 'tips',
                                cash_amt: selectedservice.tips_amount,
                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                created_by: employeedetail.id,
                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                updated_by: employeedetail.id,
                                ticketref_id: selectedservice.ticketref_id,
                                ticketserviceref_id: selectedservice.sync_id,
                                sync_status: 0,
                                sync_id: csyncid + "tips",
                                isActive:1
                            }


                            this.saveData({ table_name: 'employee_commission_detail', data: emp_input }).then(res => {
                                ////////console.log"4.tips_amount saved to saveTicketEmployeeCommission")
                            })
                        }
                        //Tips Calculation -End

                        console.log(" CTRL DISCOUNT CALC asdasd",selectedservice, selectedservice.discount_id)
                        //Discount Calculation
                        if (selectedservice.discount.discount_id !== 0 && selectedservice.discount.discount_id !== undefined) {

                            this.dataManager.getData("select * from discounts where id=" + selectedservice.discount.discount_id).then(disres => {
                                var selectedDiscount = [];
                                if (disres.length > 0) {
                                    let dis = disres;
                                    let dis_amt = 0
                                    if (dis[0].division_type === 'owner') {
                                        if (dis[0].discount_type === 'amount') {
                                            dis_amt = dis[0].discount_value
                                        } else {
                                            dis_amt = (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;
                                        }
                                        var disemp_input = {
                                            employeeId: ownerid,
                                            // employeeId: service_input.employee_id,
                                            businessId: businessdetail["id"],
                                            // ticket_id: selectedservice.ticket_id,
                                            // ticket_serviceId: selectedservice.id,
                                            cash_type_for: 'owner-discount',
                                            cash_amt: dis_amt,
                                            created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            created_by: employeedetail.id,
                                            updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            updated_by: employeedetail.id,
                                            ticketref_id: selectedservice.ticketref_id,
                                            ticketserviceref_id: selectedservice.sync_id,
                                            sync_status: 0,
                                            sync_id: csyncid + "owner-discount",
                                            isActive:1
                                        }

                                        this.saveData({ table_name: 'employee_commission_detail', data: disemp_input }).then(res => {
                                            ////////console.log"5.employee_commission/save/")
                                            console.log("5 ctrl.employee_commission/save/")
                                        })

                                    }
                                    else if (dis[0].division_type === 'employee') {
                                        if (dis[0].discount_type === 'amount') {
                                            dis_amt = dis[0].discount_value
                                        } else {
                                            dis_amt = (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;
                                        }
                                        var disemp_inputelseif = {
                                            employeeId: selectedservice.employee_id,
                                            businessId: businessdetail["id"],
                                            // ticket_id: selectedservice.ticket_id,
                                            // ticket_serviceId: selectedservice.id,
                                            cash_type_for: 'emp-discount',
                                            cash_amt: dis_amt,
                                            created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            created_by: employeedetail.id,
                                            updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                            updated_by: employeedetail.id,
                                            ticketref_id: selectedservice.ticketref_id,
                                            ticketserviceref_id: selectedservice.sync_id,
                                            sync_status: 0,
                                            sync_id: csyncid + "owner-discount",
                                            isActive:1
                                        }

                                        this.saveData({ table_name: 'employee_commission_detail', data: disemp_inputelseif }).then(res => {
                                            ////////console.log"6.employee_commission/save/")
                                        })
                                    }
                                    else {
                                        let owner_division = dis[0].owner_division;
                                        let emp_division = dis[0].emp_division;
                                        if (dis[0].discount_type === 'amount') {
                                            dis_amt = dis[0].discount_value * (owner_division / 100);
                                            var emp_dis_amt = dis[0].discount_value * (emp_division / 100)
                                            //Owner
                                            var owner_dis_input = {
                                                employeeId: ownerid,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'owner-discount',
                                                cash_amt: dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "owner-discount",
                                                isActive:1
                                            }

                                            this.saveData({ table_name: 'employee_commission_detail', data: owner_dis_input }).then(res => {
                                                ////////console.log"7.employee_commission/save/")
                                            })

                                            //Employee
                                            var emp_dis_input = {
                                                employeeId: selectedservice.employee_id,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'emp-discount',
                                                cash_amt: emp_dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "owner-discount",
                                                isActive:1
                                            }


                                            this.saveData({ table_name: 'employee_commission_detail', data: emp_dis_input }).then(res => {
                                                ////////console.log"8.employee_commission/save/")
                                            })

                                        } else {
                                            let owner_dis_amt = (owner_division / 100) * (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;
                                            let emp_dis_amt = (emp_division / 100) * (dis[0].discount_value / 100) * selectedservice.qty * selectedservice.perunit_cost;
                                            //Owner
                                            var owner_per_input = {
                                                employeeId: ownerid,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'owneremp-discount',
                                                cash_amt: owner_dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "owneremp-discountowner",
                                                isActive:1
                                            }

                                            this.saveData({ table_name: 'employee_commission_detail', data: owner_per_input }).then(res => {
                                                ////////console.log"9.employee_commission/save/")
                                            })
                                            //Employee
                                            var emp_per_input = {
                                                employeeId: selectedservice.employee_id,
                                                businessId: businessdetail["id"],
                                                // ticket_id: selectedservice.ticket_id,
                                                // ticket_serviceId: selectedservice.id,
                                                cash_type_for: 'owneremp-discount',
                                                cash_amt: emp_dis_amt,
                                                created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                created_by: employeedetail.id,
                                                updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                updated_by: employeedetail.id,
                                                ticketref_id: selectedservice.ticketref_id,
                                                ticketserviceref_id: selectedservice.sync_id,
                                                sync_status: 0,
                                                sync_id: csyncid + "owneremp-discountemp",
                                                isActive:1
                                            }

                                            this.saveData({ table_name: 'employee_commission_detail', data: emp_per_input }).then(res => {
                                                ////////console.log"10.employee_commission/save/")
                                            })

                                        }
                                    }

                                }
                            })
                        }
                    }
                    window.api.invoke('evantcall', 'saveTicketService before save called').then(r => {

                    })
                    this.saveTicketService(idx + 1, ticketid, ticketDetail, services_taken, userdetail);
                })
            });

        })
    }



    async syncTicket() {
        this.dataManager.getData("select * from ticket where sync_status=0").then(syncdata => {
            ////console.log("syncdata.length", syncdata.length)
            if (syncdata.length > 0) {
                this.syncIndividualTicket(syncdata);
            }
            else {
                this.syncTicketServices();
            }
        })
    }

    async syncIndividualTicket(syncdata) {
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedId"];
        delete data["sync_status"];
        delete data["id"];
        delete data["pay_mode"];
        delete data["services"];
        ////console.log("sync individual ticket")
        axios.post(config.root + 'ticket/saveorupdate', data).then(res => {
            console.log(res.data);
            var syncticketid = res.data.data.ticketid;
            thisobj.dataManager.saveData("update ticket set sync_status=1 where sync_id='" + data.sync_id + "'").then(r => {
                thisobj.syncTicket();
            })
            // thisobj.dataManager.saveData("update employee_commission_detail set ticket_id=" + syncticketid + " where ticketref_id='" + data.sync_id + "'").then(res1 => {
            //     thisobj.dataManager.saveData("update ticketservice_taxes set ticket_id=" + syncticketid + " where ticketref_id='" + data.sync_id + "'").then(res2 => {
            //         thisobj.dataManager.saveData("update ticketservice_requestnotes set ticket_id=" + syncticketid + "  where ticketref_id='" + data.sync_id + "'").then(res2 => {
            //             thisobj.dataManager.saveData("update ticket_services set ticket_id=" + syncticketid + " where ticketref_id='" + data.sync_id + "'").then(ree => {
            //                 thisobj.dataManager.saveData("update ticket_payment set ticket_id=" + syncticketid + " where ticketref_id='" + data.sync_id + "'").then(ree => {
            //                     thisobj.dataManager.saveData("update ticket set sync_status=1, syncedId=" + syncticketid + " where sync_id='" + data.sync_id + "'").then(r => {
            //                         thisobj.syncTicket();
            //                     })
            //                 });
            //             });
            //         });
            //     });
            // });
        })
    }

    syncTicketServices() {
        this.dataManager.getData("select * from ticket_services where sync_status=0").then(syncdata => {
            ////console.log("syncdata.length", syncdata.length)
            if (syncdata.length > 0) {
                this.syncIndividualTicketService(syncdata);
            }
            else {
                this.syncTicketServiceTaxes();
            }
        })
    }


    async syncIndividualTicketService(syncdata) {
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"];
        delete data["id"]; 
        axios.post(config.root + 'ticket/service/saveorupdate', data).then(res => { 
            var serviceid = res.data.data.insertId;
            thisobj.dataManager.saveData("update employee_commission_detail set ticket_serviceId=" + serviceid + " where ticketserviceref_id='" + data.sync_id + "'").then(res1 => {
                thisobj.dataManager.saveData("update ticketservice_taxes set ticketservice_id=" + serviceid + " where serviceref_id='" + data.sync_id + "'").then(res2 => {
                    thisobj.dataManager.saveData("update ticketservice_requestnotes set service_id=" + serviceid + "  where serviceref_id='" + data.sync_id + "'").then(res2 => {
                        thisobj.dataManager.saveData("update ticket_services set sync_status=1  where sync_id='" + data.sync_id + "'").then(r => {
                            thisobj.syncTicketServices();
                        })
                    });
                });
            });
        })
    }




    syncTicketServiceTaxes() {
        this.dataManager.getData("select * from ticketservice_taxes where sync_status=0").then(syncdata => {
            ////console.log("syncdata trax.length", syncdata.length)
            if (syncdata.length > 0) {
                this.syncIndividualTicketServiceTax(syncdata);
            }
            else {
                this.syncTicketServiceNotes()
            }
        })
    }


    async syncIndividualTicketServiceTax(syncdata) {
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"];
        delete data["id"];
        ////console.log("sync individual ticket service tax")
        axios.post(config.root + 'ticket/tax/saveorupdate', data).then(res => {
            thisobj.dataManager.saveData("update ticketservice_taxes set sync_status=1  where sync_id='" + data.sync_id + "'").then(r => {
                thisobj.syncTicketServiceTaxes();
            })
        })
    }




    syncTicketServiceNotes() {
        this.dataManager.getData("select * from ticketservice_requestnotes where sync_status=0").then(syncdata => {
            ////console.log("syncdata ticketservice_requestnotes.length", syncdata.length)
            if (syncdata.length > 0) {
                this.syncIndividualTicketServiceNotes(syncdata);
            }
            else {
                this.syncEmpCommission();
            }
        })
    }


    async syncIndividualTicketServiceNotes(syncdata) {
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"];
        delete data["id"];
        ////console.log("sync individual ticket ticketservice_requestnotes")
        axios.post(config.root + 'ticket/service/saveorupdatenotes', data).then(res => {
            thisobj.dataManager.saveData("update ticketservice_requestnotes set sync_status=1  where sync_id='" + data.sync_id + "'").then(r => {
                thisobj.syncTicketServiceNotes();
            })
        })
    }





    syncEmpCommission() {
        this.dataManager.getData("select * from employee_commission_detail where sync_status=0").then(syncdata => {
            ////console.log("syncdata employee_commission_detail.length", syncdata.length)
            if (syncdata.length > 0) {
                this.syncIndividualEmpCommission(syncdata);
            }
            else {
                this.syncPayment()
            }
        })
    }


    async syncIndividualEmpCommission(syncdata) {
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"];
        delete data["id"];
        ////console.log("sync individual ticket employee_commission_detail")
        axios.post(config.root + 'employee_commission/save', data).then(res => {
            thisobj.dataManager.saveData("update employee_commission_detail set sync_status=1  where sync_id='" + data.sync_id + "'").then(r => {
                thisobj.syncEmpCommission();
            })
        })
    }



    syncPayment() {
        this.dataManager.getData("select * from ticket_payment where sync_status=0").then(syncdata => {
            ////console.log("syncdata ticket_payment.length", syncdata.length)
            if (syncdata.length > 0) {
                this.syncIndividualPayment(syncdata);
            }
            else {
                this.clearSyncStatus()
            }
        })
    }


    async syncIndividualPayment(syncdata) {
        var data = syncdata[0];
        var thisobj = this;
        delete data["url"];
        delete data["input"];
        delete data["method"];
        delete data["syncedid"];
        delete data["sync_status"];
        delete data["id"];
        ////console.log("sync individual syncIndividualPayment")
        axios.post(config.root + 'ticket/payment/saveorupdate', data).then(res => {
            thisobj.dataManager.saveData("update ticket_payment set sync_status=1  where sync_id='" + data.sync_id + "'").then(r => {
                thisobj.syncPayment();
            })
        })
    }

    clearSyncStatus() {
        window.localStorage.removeItem("isSyncing");
    }
}