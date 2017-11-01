<template>

</template>

<script>
export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  }
}
</script>

<style>

</style>
