---
layout: post
title: "Powering a real time feed with paper trail"
tags: rails papertrail
---

[Papertrail](https://github.com/airblade/paper_trail) is a very popular gem for auditing and versioning of Rails models. The primary use cases revolve around providing a recovery mechanism to revert back to prior versions of a models. However this post outlines a somewhat non conventional application of this library wherin we use Papertrail audits to power a real time feed through [Server sent events](http://en.wikipedia.org/wiki/Server-sent_events)

The first step would be to install paper trail. For Rails 4.2, You simply need to add
`gem 'paper_trail', '~> 3.0.5'` in your Gemfile and run `bundle install`. For older versions of Rails please consult the installation instructions. While this post has been written against `Rails 4.2` most of the implementation should work on `Rails 4+`.

Also note that because we want to send real time notifications to client, we would need a server that supports persistent connections - like [puma](todo add link).

The second step is to install Redis, unless you are using it already. We primarily use Redis for its Pub/Sub functionality to communicate the changes incurred in our model. While we could have chosen any of Message Queue libraries out there, we have chosen redis because besides being performant, it is very simple to use and very easy to install on pretty much all operating systems.

A simple way to make redis globally available is to add the following in an initializer:

    $redis = Redis.new(host: 'localhost', port: 6379)

If redis is not running on localhost, or using a different host just replace the corresponding values with your host and port.

For illustration, let us consider a simple scenario where we have a blog with comments. We would like that the index page of the blog, as well as the comments for a post are updated in real time. The source code is available here, I present only the models below:
We deliberately keep the models simple for the sake of brewity, so the schema is not a perfect representative of a real world analogue.

    rails g model post title:string body:text
    rails g model comment body:text commenter:string post_id:integer

{% highlight ruby %}
class Post < ActiveRecord::Base
  has_paper_trail
  has_many :comments
end
{% endhighlight %}

{% highlight ruby %}
class Comment < ActiveRecord::Base
  has_paper_trail
  belongs_to :post
end
{% endhighlight %}

Here the `has_paper_trail` class method invocation instructs paper trail to track versions of the corresponding models. Now when we create, edit or delete a post an entry will be added to a versions table.

    :009 > Post.create title: "I like ruby", body: "Ruby is a really productive language"
      (0.2ms)  BEGIN
     SQL (0.7ms)  INSERT INTO "posts" ("body", "created_at", "title", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id"  [["body", "Ruby is a really productive language"], ["created_at", "2014-09-14 07:43:14.695450"], ["title", "I like ruby"], ["updated_at", "2014-09-14 07:43:14.695450"]]
     SQL (0.8ms)  INSERT INTO "versions" ("created_at", "event", "item_id", "item_type") VALUES ($1, $2, $3, $4) RETURNING "id"  [["created_at", "2014-09-14 07:43:14.768325"], ["event", "create"], ["item_id", 1], ["item_type", "Post"]]
      (0.8ms)  COMMIT
    => #<Post id: 1, title: "I like ruby", body: "Ruby is a really productive language", created_at: "2014-09-14 07:43:14", updated_at: "2014-09-14 07:43:14">

The model that handles `versions` table is `PaperTrail::Version` and because it is a single model that handles the changes for all the tables that have auditing enabled, it is a perfect place to dispatch notifications about changes in the audited models.

Now, in an initializer, we can patch the model to publish change notifications through redis. In `config/initializers/paper_trail.rb`:

{% highlight ruby %}
PaperTrail::Version.class_eval do

  after_commit :dispatch_notification, on: :create

  def dispatch_notification
    $redis.publish "notif:#{item_type.underscore.downcase}:#{event}", { id: id, item_id: item_id }
  end

end
{% endhighlight %}

Redis provides a `MONITOR` command to view operations in real time :

So in another tab of terminal if you run:

    redis-cli
    27.0.0.1:6379> monitor

Redis will start showing you a real time log of operations.

Now let us restart our console (because we added an initializer) and try to create a post:

    :001 > Post.create title: "I love javascript", body: "It works everywhere"
      (0.2ms)  BEGIN
     SQL (0.8ms)  INSERT INTO "posts" ("body", "created_at", "title", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id"  [["body", "It works everywhere"], ["created_at", "2014-09-14 08:32:55.062553"], ["title", "I love javascript"], ["updated_at", "2014-09-14 08:32:55.062553"]]
     SQL (0.7ms)  INSERT INTO "versions" ("created_at", "event", "item_id", "item_type") VALUES ($1, $2, $3, $4) RETURNING "id"  [["created_at", "2014-09-14 08:32:55.127108"], ["event", "create"], ["item_id", 2], ["item_type", "Post"]]
      (0.8ms)  COMMIT
    => #<Post id: 2, title: "I love javascript", body: "It works everywhere", created_at: "2014-09-14 08:32:55", updated_at: "2014-09-14 08:32:55">
    :002 >

We should see something like this in redis-cli:

    127.0.0.1:6379> monitor
    OK
    1410683575.135276 [0 127.0.0.1:57843] "publish" "notif:post:create" "{:id=>2, :item_id=>2}"

Now to communicate these updates in real-time to client, we use a relatively new feature in rails called `ActionController::Live` that allows us to dispatch server sent events to clients who have a persistent connection with the server open.

Let's start with a simple version that just logs the messages it receives:

{% highlight ruby %}
class NotificationsController < ApplicationController
  include ActionController::Live

  def stream
    response.headers['Content-Type'] = 'text/event-stream'
    Redis
      .new(host: 'localhost', port: 6379)
      .psubscribe("notif:#{params[:item_type]}:*") do |on|
        on.message do |channel, msg|
          Logger.info "Recvd -- msg: #{msg}, channel: #{channel}"
        end
      end
    response.stream.close
  end

end
{% endhighlight %}

The reason why we need a new client here, is that Once the client enters the subscribed state it is not supposed to issue any other commands, except for additional `SUBSCRIBE`, `PSUBSCRIBE`, `UNSUBSCRIBE` and `PUNSUBSCRIBE` commands.

