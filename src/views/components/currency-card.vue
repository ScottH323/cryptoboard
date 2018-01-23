<template>
    <div class="card text-white bg-success mb-3" style="max-width: 18rem;">
        <div class="card-header">{{ cur.name }}</div>
        <div class="card-body">
            <p class="card-text">{{ cur.value }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['cur']
    }
</script>