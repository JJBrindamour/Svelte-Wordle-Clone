<script>
  export let alertActive
  export let alertMessage
</script>

<main>
  <p class="alert" style={`display: ${alertActive ? 'block' : 'none'}`}>{alertMessage}</p>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
  }

  .alert{
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: white;
    color: #121213;
    position: absolute;
    top: 54px;
    border-radius: 8px;
  }
</style>