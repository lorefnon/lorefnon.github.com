---
layout: post
title: "Boost your content focussed site with Structured Page Fragments"
description: ""
category: 
tags: [rails, spfjs, javascript]
---

SPF.js a lightweight javascript library to incorporate dynamic page updates that dramatically reduces perceived page latency. Quoting from the Repo Homepage:

> Using progressive enhancement and HTML5, SPF integrates with your site to enable a faster, more fluid user experience by updating just the sections of the page that change during navigation, not the whole page. SPF provides a response format for sending document fragments, a robust system for script and style management, an in-memory cache, on-the-fly processing, and more.

While for complex dynamic sites which have a significant amount of client side logic, I still recommend adopting a client side javascript framework, but for content focussed sites, a nifty utility like SPF.js can be very useful.

## What about turbolinks ?

While yes, turbolinks does enjoy being a part of the default Rails stack, but frankly, it has always seemed like a half baked product. While turbolinks does improve the experience over full page reloads, behind the scenes it still loads the full page content.

SPF.js allows you to just fetch the parts of the page that really need updating. The GIF below, also taken from the official site, explains this much better:

<table>
  <thead>
    <tr>
      <th> Full page re-rerendering </th>
      <th> Partial section replacement with SPF.js </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> <img src="/images/animation-static-340x178.gif"></td>
      <td> <img src="/images/animation-dynamic-340x178.gif"></td>
    </tr>
  </tbody>
</table>

## But doesn't the latest version of turbolinks include support for partial page replacement ?

Yes, but there is a [lack of clarity](https://github.com/rails/turbolinks/issues/628) over when (and if) that feature will be officially released. 

In a nutshell, the version of turbolinks that is scheduled to ship with Rails 5, significantly diverges from what has hitherto been considered as the [official turbolinks repo](https://github.com/rails/turbolinks/), and will probably not contain, among other features, support for partial page replacements. While the future is not set in stone, and as DHH has [put it](https://github.com/rails/turbolinks/issues/628#issuecomment-157376926): 

> But, hey, it's just code. If the current state of this repo serves your
needs, you don't need any official blessing from anyone to use it. You can
use it as-is, you can fork, you can do whatever you want. MIT baby!

While I appreciate the freedom associated with open source licenses, I would rather bet on a well supported library that caters to the exact same use case and which is already being used in production in a wildly popular site - Youtube.

The rest of the post outlines the steps required to integrate SPF.js with a rails application. The code for this tutorial is available in Github.

We will create a dummy blog application. But hey, since this is just a demo application, we can get away with a little [Forgery](https://github.com/sevenwire/forgery):





