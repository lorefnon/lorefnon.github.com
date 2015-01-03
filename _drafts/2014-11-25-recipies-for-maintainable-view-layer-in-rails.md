---
layout: post
title: "Recipies for a maintainable view layer in Rails"
tags: rails ruby
---

The following post is a distillation of approaches as well as open source resources that I have found helpful for ensuring the maintainability of Rails applications with lifespan of years. This is the first in a series of articles, focussing on the view layer. The latter parts of the series would focus on model and controller layers and deployment solutions.

## Templates should be stateless and logicless

By definition a view is meant to present data. So any buisness logic in view violates MVC. This is something we all know since the day we learned MVC but given the ease of interpolating ruby in erb (or in pretty much most templating libraries eg. haml, slim) what starts out as a few conditional checks in view layer, eventually devolves into a labyrinth of convoluted logic. Very often if a single partial is shared across multipe actions - it is very tempting to resort to `.nil?` checks across the codebase to check which instance variables are defined and hence what to show.

The primary problem with this is that excessive reliance on instance variables in controllers, makes the presentation layer tightly coupled to state of controller and fragile.

A lot of people have proposed logic-less templates like Mustache as a solution for this. I do not consider that a real solution. TODO Elaborate on this.

Another problem is making queries in view. N+1 errors are ridiculously difficult to find when your code is distributed across a dozen or so partials. While gems like `bullet` [TODO Add link] are helpful in this regard, I prefer to avoid the problem altogether.





