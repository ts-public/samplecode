import feedparser

FEED_URL = "http://app.infominder.com/webminder/syndication/"
OLD_ETAG = "f13edb622f41c2acabbe3ec8d8b4f8b7" 

def get_feeds(url):
    """

    :param url: feed url
    :return:
    """
    feeds = feedparser.parse(url)
    new_etag = feeds['etag'].replace('"', '')
    # if there are changes then display feeds
    if OLD_ETAG != new_etag:
        for feed in feeds["entries"]:
            print(feed)


import sys

if __name__ == '__main__':
    if len(sys.argv) > 1:
        get_feeds(sys.argv[1])
    else:
        get_feeds(FEED_URL)
