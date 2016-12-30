<div class="content">
  <div>
  <form class="pure-form pure-form-aligned"> 
    <fieldset>
      <div class="pure-controls">
        <button type="button" class="pure-button pure-button-primary" onclick="logout()">Logout 登出</button>
      </div>
    </fieldset>
  </form>     
  </div>
</div>

<script>
function logout() {
  ajaxPost("/logout", {});
}
</script>