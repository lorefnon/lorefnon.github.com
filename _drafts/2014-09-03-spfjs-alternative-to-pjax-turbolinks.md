---
layout: post
title: "SPFjs : A better alternative to pjax and turbolinks"
description: ""
categories:
tags: ruby
---

[SPF](https://github.com/youtube/spfjs) from [Youtube](https://youtube.com) engineering team is lightweight framework for asynchronously updating web page
contents through Structured page fragments. Put simply, after an initial page load, on further navigation only parts of a page are updated through HTML fragments rendered on the server.

In the post we argue that SPF.js is a better alternative to alternatives like pjax and turbolinks that are more popular (atleast in ruby world) in several aspects and also outline a few patterns to productively use SPFjs with rails while sticking to the Rails Way as closely as possible.



