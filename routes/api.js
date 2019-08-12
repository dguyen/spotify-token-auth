const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request');
const cors = require('cors');

// Spotify API settings
const client_id = null; // Place Client ID here
const client_secret = null; // Place Client Secret here
const redirect_uri = 'http://localhost:3000/api/callback';
const stateKey = 'spotify_auth_state';

(function checkAPiKeys() {
  if (!client_id) {
    throw new Error('Spotify Client ID required');
  } else if (!client_secret) {
    throw new Error('Spotify Client Secret required');
  }
})();

// Error handling
const sendError = (err, res) => {
  res.status(501).json({
    status: 501,
    message: typeof err == 'object' ? err.message : err
  });
};

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Redirects user to authenticate their account
router.get('/login', function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // Request authorization
  var scope = 'user-read-private user-read-email user-library-read user-read-playback-state user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  );
});

// Requests refresh and access tokens after checking the state parameter
router.get('/callback', function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var refresh_token = body.refresh_token;
        res.redirect('/setup?' +
          querystring.stringify({
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/setup?' +
          querystring.stringify({
            error: 'invalid_token'
          })
        );
      }
    });
  }
});

// Requesting access token from refresh token
router.get('/refresh_token', cors(), function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (error) {
      next(error);
    } else if(body.error) {
      sendError(body.error_description ? body.error_description : body, res);
    } else {
      res.send({
        'access_token': body.access_token,
        'expires_in': body.expires_in
      });
    }
  });
});

module.exports = router;
