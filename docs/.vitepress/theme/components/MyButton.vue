<script setup lang="ts">
const handleClick = () => {
    console.log('button clicked')
}
</script>

<template>
    <button @click="handleClick" style="color: red; border: 1px solid red; padding: 5px;">
        <slot></slot>
    </button>
</template>