class Tweet {
  tweetId;
  text;
  userName;
  userScreenName;
  userImage;
  date;
  likes;
  retweetCount;

  constructor({
    tweetId,
    text,
    userName,
    userScreenName,
    userImage,
    date,
    likes,
    retweetCount,
  }) {
    this.tweetId = tweetId;
    this.text = text;
    this.userName = userName;
    this.userScreenName = userScreenName;
    this.userImage = userImage;
    this.date = date;
    this.likes = likes;
    this.retweetCount = retweetCount;
  }
}

module.exports = Tweet;
