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

const express = require('express');

const { getClient, getPublicToken, getInternalToken, initiateLogin, createTokens } = require('./common/oauth');
const Forge = require('forge-apis');

const config = require('../config');

let router = express.Router();

// GET /thewaywebuild/token - generates a public access token (required by the Forge viewer).
router.get('/token', async (req, res, next) => {
    try {
        const token = await getPublicToken();
        res.json({
            access_token: token.access_token,
            expires_in: token.expires_in
        });
    } catch (err) {
        next(err);
    }
});

router.get('/start', (req, res, next) => {
    try {
        const url = initiateLogin();
        res.redirect(url);
    } catch (err) {
        next(err);
    }
});

router.get('/callback', async (req, res, next) => {
    try {
        if (req.query.code)
            await createTokens(req);
        //res.status(200).end();
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

function safeBase64encode (st) {
    return (Buffer.from(st).toString('base64')
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        .replace(/=+$/, '')
    );
}

router.get('/urn', async (req, res, next) => {
    try {
        let api = new Forge.ItemsApi();
        let response = await api.getItemVersions(config.projectId, config.itemId, {}, getClient(), await getInternalToken());
        let versions = response.body.data.filter((elt) => elt.attributes.extension.data.processState === 'PROCESSING_COMPLETE');
        res.json({
            urn: safeBase64encode(versions[0].id /*response.body.data[0].id*/),
            version: versions[0].attributes.versionNumber /*response.body.data[0].attributes.versionNumber*/
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
