(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const refresh_token = urlParams.get('refresh_token');
  if (refresh_token) {
    tokenFound(refresh_token);
  } else {
    document.getElementById('setupCard').style.width = 'fit-content';
  }
})();

function tokenFound(refresh_token) {
  document.getElementById('tokenReceived').style.display = 'block';
  document.getElementById('spotifyToken').value = refresh_token;
}

function copyToken() {
  var tokenRef = document.getElementById('spotifyToken');
  tokenRef.focus();
  tokenRef.select();
  document.execCommand('copy');
}
