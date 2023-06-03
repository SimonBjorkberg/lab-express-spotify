require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((err) => console.log("access token error", err));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search-results", (req, res) => {
  spotifyApi
    .getArtist("2hazSY4Ef3aB9ATXW7F5w3")
    .then((data) => {
      console.log("artists information", data.body);
      res.render("artist-search-results", {
        data,
        image: data.body.images[2].url,
      });
    })
    .catch((err) => console.log(err));
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums("2hazSY4Ef3aB9ATXW7F5w3")
    .then((data) => {
      const albums = data.body.items.map((album) => {
        return {
          name: album.name,
          image: album.images[2].url,
        };
      });
      res.render("albums", { albums });
    })
    .catch((err) => console.log(err));
});

//
app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
