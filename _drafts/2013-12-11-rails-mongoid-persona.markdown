---
layout: post
title: "Simple authentication in Rails with Mongoid and Persona"
date: 2013-12-11
---

# Background

[Persona](http://www.mozilla.org/en-US/persona/) is a simple and
minimal sign in system offered by [Mozilla](http://www.mozilla.org) 
that eliminates the need to maintain passwords per site. 
Unlike other, more popular solutions offering sign-in systems 
Persona does not track user behaviour across the internet and 
allows users to share personal information on an as needed basis.

Rest of this post elaborates on integrating Persona with Rails and
Mongoid. We follow a test driven approach, using Rspec. The workflow
is fairly straightforward and can be adapted to other backends. [Mozilla
Developer docs](https://developer.mozilla.org/persona) are fairly 
comprehensive and provide a wide array of examples and sample code.

# Getting hands dirty

Lets get started with a fresh rails application. We skip active-record
and test-unit as we will be using Mongoid and Rspec instead.

{% highlight sh %}
rails new persona_app --skip-active-record --skip-test-unit
{% endhighlight %}