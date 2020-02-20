/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

const { AuthClientTwoLegged, AuthClientThreeLegged } = require('forge-apis');
const _fs =require('fs');
const _path =require('path');

const config = require('../../config');

function getClient(scope) {
    return new AuthClientThreeLegged(config.clientId, config.clientSecret, config.callback, config.scopes[scope] || config.scopes.public, false);
}

function readFile (filename, enc) {
    return (new Promise((fulfill, reject) => {
        _fs.readFile(filename, enc, (err, res) => {
            if (err)
                reject(err);
            else
                fulfill(res);
        });
    }));
}

let cache = {};
async function getToken(scope) {
    if (cache[scope])
        return cache[scope];
    let credentials =cache.last;
    if (!credentials) // well read it
        credentials =JSON.parse (await readFile(_path.resolve(__dirname, '../../data/credentials.json')));

    console.log(`Refreshing ${scope} token.`);
    const client = getClient(scope);
    credentials = await client.refreshToken(credentials, config.scopes[scope]);
    console.log(`New ${scope} token received.`);
    cache[scope] = credentials;
    cache.last =credentials;
    _fs.writeFile (_path.resolve(__dirname, '../../data/credentials.json'), JSON.stringify(credentials), () => {}); // save it now
    setTimeout(() => { delete cache[scope]; }, credentials.expires_in * 1000);
    return credentials;
}

async function getPublicToken() {
    return await getToken('public');
}

async function getInternalToken() {
    return await getToken('internal');
}

module.exports = {
    getClient,
    getPublicToken,
    getInternalToken
};