<template>
    <el-table :data="dynamic_tableData" height="100%"  style="width: 100%;height: 100%;top: 10px;"
    :default-sort = "{prop: 'date', order: 'ascending'}" :row-class-name="judgeIsMe">
        <el-table-column prop="date" label="进入时间" sortable width="150">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.reg_time }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="昵称" width="150">
            <template slot-scope="scope">
                <el-tag size="medium" type="success" effect="dark">{{ scope.row.name }}</el-tag>
            </template>
        </el-table-column>

    </el-table>
</template>
<style>
    .el-table .warning-row{
        background: oldlace;
        font-weight: bolder;
        font-size: larger;
    }
</style>
<script>
export default {
    props:{
        userList:Array,
        nickname:String
    },
    data() {
        return {
            
        }
    },
    methods:{
        judgeIsMe({row,rowIndex}){
            if(row.name===this.nickname){
                return 'warning-row';
            }
        }
    },
    computed:{
        dynamic_tableData(){
            return this.userList;
        }
    },
    created() {
        
    },
}
</script>