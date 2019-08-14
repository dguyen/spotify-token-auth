# Spotify token authentication

Designed to be used in conjunction with [Interactive Wallpaper Application](https://github.com/dguyen/WallpaperWebApp), allowing users to authenticate their [Spotify](https://www.spotify.com) account with the application.

## About

This NodeJS application will allow users to grant permission for the [Interactive Wallpaper Application](https://github.com/dguyen/WallpaperWebApp) to control their music playback. It also returns the user's refresh token which they are required to place back into the application. This application was created seperately due certain constraints revolving around the technology used.

### Build Locally 
 1. Run `npm install` to install packages
 2. Create a [Spotify Application](https://developer.spotify.com/dashboard/applications)
 3. Inside the Spotify Application note down your client_id and client_secret
 4. Inside the Spotify Application settings, add a RedirectURI `http://localhost:3000/api/callback`
 5. Copy spotify-api-settings.js.backup to spotify-api-settings.js
 6. Fill out client_id and client_secret
 7. Run `npm start`
 
