---
layout: post
title: "Gathering and Visualizing metrics from your Rails application using InfluxDB"
tags: [Ruby, Rails, InfluxDB]
---

InfluxDB is a distributed time series database. It is a specialized data store
for saving large volumes of timestamped event data and this makes it especially
suited for storing metrics, lifecycle events and analytics. Fortunately there
is an `influxdb-rails` gem maintained by the InfluxDB team, which provides an
excellent integration with Rails and makes it easy to save various metrics from
a rails application to InfluxDB and visualize it through frontends like
[Graphana](TODO FIXME).

The rest of this post, explores various aspects of a simple setup in which
we build a rudimentary cms based site and monitor it using influxdb and graphana.
Eventually we also briefly look into generation of actionable reports using
InfluxDB APIs. We don't assume prior familiarity with InfluxDB, and elaborate on
relevant aspects of time series databases on the go, but familiarity
with Rails is assumed.

This post also assumes that you have InfluxDB installed as per the official
[installation instructions](http://influxdb.com/docs/v0.8/introduction/installation.html).
On mac you can just run `brew install influxdb` if you already have [Homebrew](http://brew.sh/) setup.

Next, we bootstrap a simple rails application using the
[Comfortable mexican sofa](https://github.com/comfy/comfortable-mexican-sofa)
CMS to quickly setup a site with a few pages we can tinker with. This is not really
important, but it simply helps us work with a reasonably more realistic setup than
a typically crud ui generated through scaffolds.

{% highlight bash %}
rails new influxdb-cms-demo --database=mysql
{% endhighlight %}

In Gemfile:

{% highlight ruby %}
gem 'comfortable_mexican_sofa', '~> 1.12.0'
gem 'influxdb-rails'
{% endhighlight %}

And after running `bundle install`, we need to run:

{% highlight bash %}
rails generate comfy:cms
{% endhighlight %}

This plugs in the content management facilities provided by CMS. And then:

{% highlight bash %}
rails g influxdb
{% endhighlight %}

This sets up basic metrics aggregation facilities offered by influxdb.
The default configuration options in the generated `influxdb-rails.rb`
initializer correspond with the default settings of influxdb. If you
have configured InfluxDB

{% highlight ruby %}
InfluxDB::Rails.configure do |config|
  config.influxdb_database = "rails"
  config.influxdb_username = "root"
  config.influxdb_password = "root"
  config.influxdb_hosts    = ["localhost"]
  config.influxdb_port     = 8086

  # config.series_name_for_controller_runtimes = "rails.controller"
  # config.series_name_for_view_runtimes       = "rails.view"
  # config.series_name_for_db_runtimes         = "rails.db"
end
{% endhighlight %}

The last three lines signify the names of time series where the
corresponding metrics would be stored, and we will use the same
when querying the time series database.

The aforementioned database "rails" is not something that is automatically
created for us, so if we try to run our application at this point, our logs
will contain errors about database not being found. Let us head over to
the InfluxDB dashboard, which runs on port 8083 by default, to setup the
database. Unless we have configured the default settings, We can just
visit [localhost:8083](http://localhost:8083). If all goes well, we will
be greeted with a similar landing page:

![InfluxDB landing page](/images/influxdb_landing_page.png)

The default username/password combination is root/root, which is something
we would want to change if we are deploying this in a production setting.

Creating a database is pretty simple - for now we just fill in the database name
and don't bother with the remaining details.

![InfluxDB creating database](/images/influxdb_create_database.png)

This would be a good point to run `db:migrate` and visit the CMS
dashboard `/admin`

Once we have created a new site, and added a few pages, it is time to
checkout our InfluxDB dashboard and checkout what metrics have
been automagically aggregated for us.

![Add a new page in CMS](/images/new_page_cms.png)


In the list of databases, we should have an option to `Explore Data`. Let
us go ahead and click that:

![InfluxDB database list](/images/influxdb_database_list.png)

We will be presented with a simple interface to read and write points (which
are essentially multi-column timestamped datasets).

![InfluxDB Query interface](/images/influxdb_query_interface.png)

This page also highlights an interesting aspect of InfluxDB - though it is not
a relational database, it does provide an SQL like language to query the database.

A basic query might look something like this:

![InfluxDB Select All Query](/images/influxdb_select_all_query.png)

Besides controllers, we can also run similar queries for our timeseries for views and db:
![InfluxDB Select All from View Query](/images/influxdb_select_all_from_view.png)
![InfluxDB Select All from DB Query](/images/influxdb_select_all_from_db.png)

This concludes our first post in which we try out InfluxDB and see how easy it
is to aggregate basic metrics out of the box, without having to write a lot of code.

In the subsequent posts, we elaborate on more advanced metrics aggreagation,
by using custom criteria and by specific custom metrics. We will also go beyond the basic visualization provided by the dashboard and will see how to create
professional grade dashboards using Grafana.
