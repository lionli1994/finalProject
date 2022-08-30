<template>
    <div class="container">
        <div class="row">
            <a href="/dashboard" class="btn btn-secondary mb-3" style="width:100px" >Back</a>
            <div class="col-md-12">

                
                <TabNav :tabs="['Doctors']" :selected="selected" @selected="setSelected">
                    <TabTag :isSelected="selected === 'Doctors'">
                       <DoctorsList></DoctorsList>
                    </TabTag>

                </TabNav>

            </div>
        </div>
    </div>
</template>
<script>
import TabTag from "@/components/Tab.vue"
import TabNav from "@/components/TabNav.vue"
import DoctorsList from "@/components/DoctorsList.vue"
export default {
    name: "FindDoctorView",
    components: {
    TabTag,
    TabNav,
    DoctorsList,
},
    data() {
        return {
            selected: "Doctors",
        };
    },
    methods: {
        setSelected(tab) {
            this.selected = tab;
        },
    },
}
</script>

<style scoped>
.container {
    padding-top: 50px;
}
</style>