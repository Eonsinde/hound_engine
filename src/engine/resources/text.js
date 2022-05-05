/*
 * File: text.js
 *
 * logics for loading a text file into the resource_map
 */
"use strict";

import * as map from "../core/resource_map.js";

// functions from resource_map
let unload = map.unload;
let has = map.has;
let get = map.get;

const decodeText = (data) => {
    return data.text();
}

const parseText = (text) => {
    return text;
}

const load = (path) => {
    return map.loadDecodeParse(path, decodeText, parseText);
}

export {has, get, load, unload}