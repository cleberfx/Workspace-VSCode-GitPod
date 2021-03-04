/*
 * Wallaby.js - v1.0.940
 * https://wallabyjs.com
 * Copyright (c) 2014-2020 Wallaby.js - All Rights Reserved.
 *
 * This source code file is a part of Wallaby.js and is a proprietary (closed source) software.

 * IMPORTANT:
 * Wallaby.js is a tool made by software developers for software developers with passion and love for what we do.
 * Pirating the tool is not only illegal and just morally wrong,
 * it is also unfair to other fellow programmers who are using it legally,
 * and very harmful for the tool and its future.
 */
var __assign=this&&this.__assign||function(){return __assign=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++){t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},__assign.apply(this,arguments)},fs=require("fs"),path=require("path");module.exports={before:function(e,t){memo.jsdom=e("jsdom"),memo.config=t,memo.supportedProperties=supportedProperties.filter(function(e){return"undefined"==typeof global[e]});var n=memo.config.jsdom||{},r=n.config||{},i=n.file||r.file,s=memo.config.filePath.replace(/\.[^.]+$/,".html"),o=path.join(path.dirname(memo.config.filePath),"index.html");memo.fileName=fs.existsSync(i)?i:n.html?void 0:fs.existsSync(s)?s:fs.existsSync(o)?o:void 0},beforeEach:function(){var e=memo.config.jsdom||{},t=__assign({pretendToBeVisual:!0,runScripts:"dangerously"},e.config||{});t.url=t.url||"http://localhost/";var n=(memo.fileName?fs.readFileSync(memo.fileName).toString():"")||e.html||'<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div></body></html>',r=new memo.jsdom.JSDOM(n,t).window.document;memo.supportedProperties.forEach(function(e){"root"!==e&&(global[e]=r.defaultView[e])}),global.navigator={userAgent:e.userAgent||"quokka.js"},global.localStorage||(global.localStorage=createLocalStorage()),global.sessionStorage||(global.sessionStorage=createSessionStorage()),console.debug||(console.debug=console.log)}};var supportedProperties=require("./jsdomSupportedProperties"),memo={},createLocalStorage=function(){var e={};return{setItem:function(t,n){e[t]=n},getItem:function(t){return t in e?e[t]:null},removeItem:function(t){return delete e[t]}}},createSessionStorage=function(){var e={};return{setItem:function(t,n){e[t]=n+""},getItem:function(t){return t in e?e[t]:null},removeItem:function(t){return delete e[t]},clear:function(){e={}}}};