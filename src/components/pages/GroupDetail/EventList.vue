<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">活动列表</span>
                <el-button style="float: right;" type="primary" @click="showEventModal" v-if="isAdmin">创建活动</el-button>
            </div>
            <div v-for="event in orderedEvents" v-bind:key="event._id" class="text item">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">{{event.name}}</span>
                        <el-button style="float: right; margin-left: 5px;" type="success" @click="goDetail(event._id)">详情</el-button>
                        <el-button style="float: right; margin-left: 5px;" type="primary" @click="enrollEvent(event._id)">报名</el-button>
                    </div>
                    <div class="text item">
                        报名截止时间：{{event.enroll_end_time | formatDate}}
                        <br/> 活动时间：{{event.begin_time | formatDate}} 至 {{event.end_time | formatDate}}
                        <br/> 活动地点： {{event.location}}
                        <br/> 活动简介：{{event.description}}
                    </div>
                </el-card>
            </div>
        </el-card>
        <el-dialog title="创建活动" :visible.sync="eventModalVisible" width="30%">
            <el-form ref="eventForm" :model="eventForm" label-width="80px">
                <el-form-item label="活动名称">
                    <el-input v-model="eventForm.name"></el-input>
                </el-form-item>
                <el-form-item label="活动地点">
                    <el-input v-model="eventForm.location" placeholder="请选择活动区域"></el-input>
                </el-form-item>
                <el-form-item label="报名截止时间">
                    <el-date-picker v-model="eventForm.enroll_end_time" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动开始时间">
                    <el-date-picker v-model="eventForm.begin_time" type="datetime" placeholder="选择日期时间" @change="verifyDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动截止时间">
                    <el-date-picker v-model="eventForm.end_time" type="datetime" placeholder="选择日期时间" @change="verifyDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动简介">
                    <el-input type="textarea" v-model="eventForm.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="eventModalVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="isDisabled" @click="createEvent">创建活动</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/**
 * @author: wfnuser
 */
import * as types from '../../../store/types'
import _ from 'lodash'
import api from '../../../axios'
import {
    Loading
} from 'element-ui';
export default {
    name: 'EventList',
    data() {
        return {
            userId: '',
            eventForm: {
                name: '',
                location: '',
                begin_time: '',
                enroll_begin_time: '',
                enroll_end_time: ''
            },
            isDisabled: true,
            eventModalVisible: false
        }
    },
    props: {
        groupInfo: {
            type: Object
        },
        isAdmin: {
            type: Boolean
        }
    },
    watch: {
        groupInfo: function(newVal){
            this.orderedEvents = _.orderBy(newVal.events, 'begin_time');
        }
    },
    mounted() {
        this.userId = localStorage.getItem('userid')
    },
    computed: {
        isInGroup: function () {
            if (this.groupInfo.members) {
                for (let i = 0; i < this.groupInfo.members.length; i++) {
                    if (this.groupInfo.members[i]._id === this.userId) {
                        return true;
                    }
                }
            }
            return false;
        },
        orderedEvents: {
            get: function(){
                return _.orderBy(this.groupInfo.events, 'begin_time');
            },
            set: function(newVal) {
                return newVal;
            }
        }
    },
    methods: {
        enrollEvent(eventId) {
            let request = {}
            request.id = eventId
            api.joinEvent(request).then((data) => {
                this.$message({
                    type: 'success',
                    message: '报名成功'
                })
            }, (err) => {
                this.$message({
                    type: 'info',
                    message: '报名失败'
                })
            })
        },
        goDetail(eventId) {
            let url = '/event/' + eventId
            this.$router.push({
                path: url
            })
        },
        showEventModal() {
            this.eventModalVisible = true
        },
        verifyDate() {
            if(typeof(this.eventForm.begin_time)!="undifined" && typeof(this.eventForm.end_time)!="undifined"){
                if(Date.parse(this.eventForm.begin_time)<Date.parse(this.eventForm.end_time)){
                    this.isDisabled=false;
                }
                else{
                    this.isDisabled=true;
                }
            }
            else{
                this.isDisabled=true;
            }
        },
        createEvent() {
            let that = this
            let request = Object.assign({}, that.eventForm)
            request.group = this.$router.currentRoute.params.id
            api.createEvent(request).then((data) => {
                that.eventForm = {
                    name: '',
                    location: '',
                    begin_time: '',
                    enroll_begin_time: '',
                    enroll_end_time: '',
                    description: ''
                }
                that.eventModalVisible = false
                that.isDisabled =  true
                that.$message({
                    type: 'success',
                    message: '创建成功'
                });
                that.groupInfo.events.push(request);
            }, (err) => {
                that.eventModalVisible = false
                that.$message({
                    type: 'info',
                    message: '创建失败'
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>