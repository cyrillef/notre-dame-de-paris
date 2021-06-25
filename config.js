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

module.exports = {

    clientId: process.env.FORGE_CLIENT_ID,
    clientSecret: process.env.FORGE_CLIENT_SECRET,
    callback: process.env.FORGE_CALLBACK,
    PORT: process.env.PORT || 3000,

    // Required scopes for your application on server-side
    scopes: {
        internal: ['viewables:read', 'data:read'/*, 'data:create', 'data:write'*/],
        public: ['viewables:read']
    },

    projectId: 'b.dc4eb726-a823-44bf-b569-0c51d197396c',
    itemId: 'urn:adsk.wipprod:dm.lineage:7aKButAtTo-VRvSJqZl0jg',
    itemurn: 'dXJuOmFkc2sud2lwcHJvZDpkbS5saW5lYWdlOjdhS0J1dEF0VG8tVlJ2U0pxWmwwamc'

};