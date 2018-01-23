<style>
    #sideNav {
        position: absolute;
        top: 0;
        bottom: 0;
        float: left;
        padding-right: 8%;
        border-right: 1px solid #dddddd;
        width: 150px;
        display: none;
    }
</style>

<template>

    <section id="sideNav">
        <ul class="nav flex-column">
            <li class="nav-item">
                <router-link to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/logout">Logout</router-link>
            </li>
        </ul>
    </section>
</template>

<script>
    export default {}
</script>