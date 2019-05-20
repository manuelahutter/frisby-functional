
const request = require('request');
const Task = require('data.task');
const Either = require('data.either');

const httpGet = url =>
    new Task((rej, res) =>
        request(url, (error, response, body) =>
           error ? rej(error) : res(body)));

const first = arr =>
    Either.fromNullable(arr[0]);

const eitherToTask = e =>
    e.fold(Task.rejected, Task.of);

const parse = Either.try(JSON.parse);

const getJSON = url =>
    httpGet(url)
    .map(parse)
    .chain(eitherToTask);

const findArtist = name =>
    getJSON(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
    .map(result => result.artist.items)
    .map(first)
    .chain(eitherToTask);

const relatedArtists = id =>
    getJSON(`https://api.spotify.com/v1/artists/${id}/related-artists`)
    .map(result => result.artists);

module.exports = {findArtist, relatedArtists};
