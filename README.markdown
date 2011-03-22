Chat Room Demo for Indy.js using node.js & CouchDB
==================================================

This code is very basic and meant to demonstrate a rough sketch of how one would build a chat kind of thing
using node.js and CouchDB to persist the data.

Currently it is hosted on nodester and uses Cloudant to store the chats.

The code for node.js doesn't handle any errors, and isn't organized into any sort of hierarchy.  Don't use this code
in production.  It runs on node.js 0.4.2 using express 2 as currently written, slight modification is necessary if you're using an older
version of node.js (which would require express 1).

The usage of CouchDB is also very basic, only simple map functions are used to list a type of document.  There is a reduce function
commented out because CouchDB throws an error that it doesn't reduce its output enough.