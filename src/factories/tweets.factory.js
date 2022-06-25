const Tweet = require('../entities/tweet.entity');

exports.makeTweetFromStatus = (tweetStatus) => {
  return new Tweet({
    tweetId: tweetStatus.id,
    text: tweetStatus.text,
    userName: tweetStatus?.user?.name,
    userScreenName: tweetStatus?.user?.screen_name,
    userImage: tweetStatus?.user?.profile_image_url,
    date: tweetStatus.created_at,
    likes: tweetStatus.favorite_count,
    retweetCount: tweetStatus.retweet_count,
  });
};
