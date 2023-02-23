<template>
  <div id="Login">
    <LoginContainer></LoginContainer>
    <RegisterContainer></RegisterContainer>
  </div>
</template>

<script>
import LoginContainer from '@/components/LoginContainer';
import RegisterContainer from '@/components/RegisterContainer';
export default {
  name: 'Login',
  components: {
    LoginContainer,
    RegisterContainer,
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
#Login {
  width: 100vw;
  height: 100vh;
  background: rgb(8, 210, 236);
  background: linear-gradient(126deg, rgba(8, 210, 236, 1) 0%, rgba(76, 16, 134, 1) 54%, rgba(255, 0, 0, 1) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-content: space-between;
}
</style>