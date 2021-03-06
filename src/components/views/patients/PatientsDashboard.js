import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import Age from './Age';
import ASA from './ASA';
import OMS from './OMS';
import BMIWL from './BMIWL';
import BMI from './BMI';
import Filter from '../../Filter';
import PatientsAgeApi from '../../../apis/patientsAgeApi';
import PatientsASAApi from '../../../apis/patientsASAApi';
import PatientsOMSApi from '../../../apis/patientsOMSApi';
import PatientsBMIApi from '../../../apis/patientsBMIApi';
import Config from '../../../config/config';
import loading from '../../imgs/loading.gif';

class Patients extends Component {

    constructor (props) {
        super(props);

        this.state = {
            showLoading: true
        }

        // API instances 
        this.patientsAgeApi = new PatientsAgeApi();
        this.patientsASAApi = new PatientsASAApi();
        this.patientsOMSApi = new PatientsOMSApi();
        this.patientsBMIApi = new PatientsBMIApi();

        // this.drIsHidden = true;
        this.drOMS='';

        // Parameters used for api call
        this.params = {
            startDate: '2018-01-01',
            endDate: '2019-01-01',
            formType: 'E',
            userLevel: 0,       //0-doc, 1-unit, 2-all
            userId: Config.userId       //doc-ID from 8/12, unit-ID "3", all"""
        }

        this.params_dr = {
            startDate: '2018-01-01',
            endDate: '2019-01-01',
            formType: 'E',
            userLevel: 0,       //0-doc, 1-unit, 2-all
            userId: Config.userId        //doc-ID from 8/12, unit-ID "3", all"""
        }

        // Filter function will be triggered when date or type is changed
        this.updateFilter = this.updateFilter.bind(this);
        this.updateFilter();
    }

    async componentDidMount() {
        const self = this;

        const age = await self.patientsAgeApi.getPatientsAge(self.params);
        const asa = await self.patientsASAApi.getPatientsASA(self.params);
        const oms = await self.patientsOMSApi.getPatientsOMS(self.params);
        const bmi = await self.patientsBMIApi.getPatientsBMI(self.params);
        const drAGE = await self.patientsAgeApi.getDrAGEPercentage(self.params_dr);
        const drASA = await self.patientsASAApi.getDrASAPercentage(self.params_dr);
        const drOMS = await self.patientsOMSApi.getDrOMSPercentage(self.params_dr);
        const drBMI = await self.patientsBMIApi.getDrBMIPercentage(self.params_dr);
        const drBMILW = await self.patientsBMIApi.getPatientsBMIWlDr(self.params_dr);

        self.setState({
            age,
            asa,
            oms,
            bmi,
            drAGE,
            drASA,
            drOMS,
            drBMI,
            drBMILW,
            drIsHidden: true,
            showLoading: false
        })
    }

    async updateFilter(update) {
        if(update && Object.keys(update)[0] !== null){
            switch(Object.keys(update)[0]) {
                case 'startDate':
                    this.params.startDate = update.startDate;
                    this.params_dr.startDate = update.startDate;
                    break;
                case 'endDate':
                    this.params.endDate = update.endDate;
                    this.params_dr.endDate = update.endDate;
                    break;
                case 'userLevel':
                    if(update.userLevel === 0){
                        this.params.userId = Config.userId;
                        this.setState({
                            drIsHidden: true
                        });
                    } else {
                        if(update.userLevel === 1){
                            this.params.userId = Config.unitId;
                        }
                        this.setState({
                            drIsHidden: false
                        });
                    }
                    this.params.userLevel = update.userLevel;
                    break;
                default:        
            }
        }

        const age = await this.patientsAgeApi.getPatientsAge(this.params);
        const asa = await this.patientsASAApi.getPatientsASA(this.params);
        const oms = await this.patientsOMSApi.getPatientsOMS(this.params);
        const bmi = await this.patientsBMIApi.getPatientsBMI(this.params);
        const drAGE = await this.patientsAgeApi.getDrAGEPercentage(this.params_dr);
        const drASA = await this.patientsASAApi.getDrASAPercentage(this.params_dr);
        const drOMS = await this.patientsOMSApi.getDrOMSPercentage(this.params_dr);
        const drBMI = await this.patientsBMIApi.getDrBMIPercentage(this.params_dr);
        const drBMILW = await this.patientsBMIApi.getPatientsBMIWlDr(this.params_dr);

        this.setState({
            age,
            asa,
            oms,
            bmi,
            drAGE,
            drASA,
            drOMS,
            drBMI,
            drBMILW,
            showLoading: false
        })
    }

    render() {

        let Content;
        if (this.state.showLoading) {
            Content = 
            <Grid className ='patient_grid'>
                <Row><Col xs={10} md={10}><div className="loading"><img src={loading} alt="loading..."/></div></Col></Row>
            </Grid>
        } else {
            Content = 
            <Grid className ='patient_grid'>
                <Row>
                    <Col xs={4} md={4}>
                        <div>
                            { this.state && this.state.age.data && this.state.age.gt70 && this.state.age.total &&
                                <Age data={this.state.age.data} 
                                    centerText={this.state.age.gt70} 
                                    centerText2={this.state.age.total}
                                    missing={this.state.age.missing}
                                    gt70= {this.state.age.gt70}
                                    lt70={this.state.age.lt70}
                                    total={this.state.age.total}
                                    hide_dr = {this.state.drIsHidden}
                                    drAGE = {this.state.drAGE.percentageStr}
                                />
                            }
                        </div>
                    </Col>
                    <Col xs={4} md={4}>
                        <div>
                            { this.state && this.state.asa.data && this.state.asa.gt2 && this.state.asa.total &&
                                <ASA data={this.state.asa.data} 
                                    centerText={this.state.asa.gt2} 
                                    centerText2={this.state.asa.total}
                                    gt2={this.state.asa.gt2} 
                                    total={this.state.asa.total}
                                    lt2={this.state.asa.lt2} 
                                    missing = {this.state.asa.missing}
                                    hide_dr = {this.state.drIsHidden}
                                    drASA = {this.state.drASA.percentageStr}
                                />
                            }
                        </div>
                    </Col>
                    <Col xs={4} md={4}>
                        <div>
                            { this.state && this.state.oms.data && this.state.oms.gt1 && this.state.oms.total &&
                                <OMS data={this.state.oms.data} 
                                    centerText={this.state.oms.gt1} 
                                    centerText2={this.state.oms.total}
                                    gt1={this.state.oms.gt1} 
                                    total={this.state.oms.total}
                                    lt1={this.state.oms.lt1} 
                                    missing={this.state.oms.missing}
                                    hide_dr = {this.state.drIsHidden}
                                    drOMS = {this.state.drOMS.percentageStr}
                                />
                            }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={5} md={5}>
                        <div>
                            { this.state && this.state.bmi.data1 && this.state.bmi.data2 &&
                                <BMI data1={this.state.bmi.data1} 
                                    data2={this.state.bmi.data2} 
                                    centerText={this.state.bmi.gt30 + this.state.bmi.lt18} 
                                    centerText2={this.state.bmi.total}
                                    lt18 = {this.state.bmi.lt18}
                                    gt30 = {this.state.bmi.gt30}
                                    other = {this.state.bmi.other}
                                    total = {this.state.bmi.total}
                                    missing = {this.state.bmi.missing}
                                    hide_dr = {this.state.drIsHidden}
                                    drBMI = {this.state.drBMI.percentageStr}
                                />
                            }
                        </div>
                    </Col>
                    <Col xs={5} md={5}>
                        <div>
                            { this.state && this.state.bmi.data1 && this.state.bmi.data2 && this.state.drBMILW &&
                                <BMIWL 
                                    lt10 = {this.state.bmi.wlosslt10per}
                                    lt18 = {this.state.bmi.lt18}
                                    gt10 = {this.state.bmi.wlossgt10per}
                                    total = {this.state.bmi.total}
                                    missing = {this.state.bmi.missingwloss}
                                    max = {this.state.bmi.max}
                                    hide_dr = {this.state.drIsHidden}
                                    dr = {this.state.drBMILW}
                                />
                            }                  
                        </div>
                        
                    </Col>
                </Row>
            </Grid>
        }

        return (
            <div>
                <Filter updateFilter = {this.updateFilter}/>
                {Content}
            </div>
        );
    }
  }

  export default Patients;