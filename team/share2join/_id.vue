<template>
  <div>
    我是邀请后的访问页面
  </div>
</template>

<script>
export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  }
}
</script>

