<template scope='scope'>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">{{groupInfo.name}}</span>
                            <el-button v-if="isInGroup" style="float: right;" type="danger" @click="leaveGroup(groupInfo._id)">退出</el-button>
                            <el-button v-else style="float: right;" type="primary" @click="enroll(groupInfo._id)">报名</el-button>
                        </div>
                        <div class="text item">
                            {{groupInfo.description}}
                        </div>
                    </el-card>
                </el-row>
                <el-menu :default-active="currentPanel" mode="horizontal" @select="selectPanel">
                    <el-menu-item index="events">活动</el-menu-item>
                    <el-menu-item index="forum">论坛</el-menu-item>
                </el-menu>
                <el-row>
                    <event-list :groupInfo="groupInfo" :isAdmin="isAdmin"></event-list>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">成员列表</span>
                    </div>
                    <div v-for="member in groupInfo.members" v-bind:key="member._id" class="text item">
                        {{ member.name }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
/**
 * @author: wfnuser
 */
import * as types from '../store/types'
import api from '../axios'
import {
    Loading
} from 'element-ui';
import EventList from '../components/pages/GroupDetail/EventList'
export default {
    name: 'group',
    data() {
        return {
            msg: 'Welcome to Hooli Group',
            userId: '',
            username: '',
            indexOfUser: '',
            groupInfo: {},
            isAdmin: false,
            currentPanel: 'events'
        }
    },
    components: {
        EventList
    },
    mounted() {
        this.userId = localStorage.getItem('userid')
        this.username = localStorage.getItem('username')
        this.getGroupInfo()
    },
    computed: {
        isInGroup: function () {
            if (this.groupInfo.members) {
                for (let i = 0; i < this.groupInfo.members.length; i++) {
                    if (this.groupInfo.members[i]._id === this.userId) {
                        this.indexOfUser = i;
                        return true;
                    }
                }
            }
            return false;
        }
    },
    methods: {
        getGroupInfo() {
            let that = this
            let loadingInstance = Loading.service()
            api.getGroupInfo(this.$router.currentRoute.params).then((data) => {
                //TODO: rewrite the code here, and use some config file
                that.groupInfo = data.data
                if (that.groupInfo.admins) {
                    that.groupInfo.admins.forEach(admin => {
                        if (admin._id === that.userId) {
                            that.isAdmin = true
                        }
                    });
                }
                loadingInstance.close()
            }, (err) => {
                loadingInstance.close()
            })
        },
        enroll(groupId) {
            let request = {}
            request.id = groupId
            api.joinGroup(request).then((data) => {
                let newUser = {};
                newUser._id = this.userId;
                newUser.name = this.username;
                this.groupInfo.members.push(newUser)
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
        selectPanel(key, keyPath) {
            this.currentPanel = key
        },  
        leaveGroup(groupId) {
            let request = {}
            request.id = groupId
            api.leaveGroup(request).then((data) => {
                this.groupInfo.members.splice(this.indexOfUser, 1);
                this.$message({
                    type: 'success',
                    message: '退出成功'
                })
            }, (err) => {
                this.$message({
                    type: 'info',
                    message: '退出失败'
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 24px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>