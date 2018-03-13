<template scope='scope'>
    <div class="group container">
        <el-row>
            <h2>我的小组</h2>
            <el-button style="float: right; margin-left: 5px;" type="primary" @click="createGroupModal()">添加小组</el-button>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6" v-for="group in myGroups" v-bind:key="group._id">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">{{group.name}}</span>
                        <el-button style="float: right; margin-left: 5px;" type="success" @click="goDetail(group._id)">详情</el-button>
                        <el-button v-if="isInGroup(group.members)" style="float: right; margin-left: 5px;" type="danger" @click="leaveGroup(group)">退出</el-button>
                        <el-button v-else style="float: right; margin-left: 5px;" type="primary" @click="enroll(group)">报名</el-button>
                    </div>
                    <div class="text item">
                        {{group.description}}
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <h2>可能感兴趣的</h2>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6" v-for="group in groups" v-bind:key="group._id">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">{{group.name}}</span>
                        <el-button style="float: right; margin-left: 5px;" type="success" @click="goDetail(group._id)">详情</el-button>
                        <el-button v-if="isInGroup(group.members)" style="float: right; margin-left: 5px;" type="danger" @click="leaveGroup(group)">退出</el-button>
                        <el-button v-else style="float: right; margin-left: 5px;" type="primary" @click="enroll(group)">报名</el-button>
                    </div>
                    <div class="text item">
                        {{group.description}}
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="创建小组" :visible.sync="groupModalVisible" width="30%">
            <el-form ref="groupForm" :model="groupForm" label-width="80px">
                <el-form-item label="小组名称">
                    <el-input v-model="groupForm.name"></el-input>
                </el-form-item>
                <el-form-item label="小组类型">
                    <el-input v-model="groupForm.type" placeholder="请填写活动类型"></el-input>
                </el-form-item>
                <el-form-item label="小组描述">
                    <el-input v-model="groupForm.description" placeholder="请填写小组描述">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupModalVisible = false">取 消</el-button>
                <el-button type="primary" @click="createGroup">创建小组</el-button>
            </span>
        </el-dialog>
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
export default {
    name: 'group',
    data() {
        return {
            msg: 'Welcome to Hooli Group',
            username: '',
            userId: '',
            groups: [],
            myGroups: [],
            groupForm: {
                name: '',
                description: '',
                type: ''
            },
            groupModalVisible: false
        }
    },
    mounted() {
        this.getGroups()
        this.username = localStorage.getItem('username')
        this.userId = localStorage.getItem('userid')
    },
    methods: {
        isInGroup: function (members) {
            if (members) {
                for (let i = 0; i < members.length; i++) {
                    if (members[i] === this.userId) {
                        return true;
                    }
                }
                //console.log(members);
            }
            return false;
        },
        getGroups() {
            let loadingInstance = Loading.service();
            let that = this
            api.getGroups().then((res) => {
                //TODO: seperate my group API
                if (res.data.length > 0) {
                    that.groups = res.data
                    that.myGroups = that.groups.filter((each) => {
                        return each.members.includes(that.userId) || each.admins.includes(that.userId)
                    })
                }
                loadingInstance.close();
            }, (err) => {
                loadingInstance.close();
            })
        },
        createGroupModal() {
            this.groupModalVisible = true
        },
        createGroup() {
            let that = this
            let request = Object.assign({}, that.groupForm)
            api.createGroup(request).then((data) => {
                that.groupForm = {
                    name: '',
                    type: '',
                    description: ''
                }
                that.groupModalVisible = false
                that.$message({
                    type: 'success',
                    message: '创建成功'
                })
            }, (err) => {
                that.groupModalVisible = false
                that.$message({
                    type: 'info',
                    message: '创建失败'
                })
            })
        },
        logout() {
            this.$store.dispatch('UserLogout')
            if (!this.$store.state.token) {
                this.$router.push('/login')
                this.$message({
                    type: 'success',
                    message: '登出成功'
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '登出失败'
                })
            }
        },
        enroll(group) {
            let request = {}
            request.id = group._id
            api.joinGroup(request).then((data) => {
                group.members.push(this.userId);
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
        leaveGroup(group) {
            let request = {}
            request.id = group._id
            api.leaveGroup(request).then((data) => {
                for (let i = 0; i < group.members.length; i++) {
                    if (group.members[i] === this.userId) {
                        group.members.splice(i, 1);
                        break;
                    }
                }
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
        },
        goDetail(groupId) {
            let url = '/group/' + groupId
            this.$router.push({ path: url })
        }
    }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.container {
  padding: 24px;
}

.container h2 a,
.container h3 a,
.container h4 a,
.container h5 a {
  float: left;
  margin-left: -20px;
  opacity: 0;
  cursor: pointer;
}

.container h2,
.container h3,
.container h4,
.container h5 {
  float: left;
}

a {
  color: #4078c0;
  text-decoration: none;
}
</style>