import {XMLParser} from "fast-xml-parser";

export async function fetchFeed(URL: string) {
    const response = await fetch(URL, {
        mode: "cors",
        method: "GET",
        headers: {
            "User-Agent": "gator",
        },
    });
    const data = await response.text();
    const parser = new XMLParser();
    const feed = await parser.parse(data);
    if (feed?.rss.channel) {
        if (
            feed.rss.channel?.title &&
            feed.rss.channel?.link &&
            feed.rss.channel?.description
        ) {
            const RSS: RSSFeed = {
                title: feed.rss.channel.title,
                link: feed.rss.channel.link,
                description: feed.rss.channel.description,
                items: [],
            };
            if (Array.isArray(feed.rss.channel?.item)) {
                feed.rss.channel.item.forEach((item: RSSItem) => {
                    if (item?.link && item?.title && item?.description && item?.pubDate) {
                        RSS.items.push({
                            title: item.title,
                            link: item.link,
                            description: item.description,
                            pubDate: item.pubDate
                        });
                    }
                });
            }
            return RSS;
        } else {
            throw new Error("No feed information found.");
        }
    } else {
        throw new Error("Invalid feed");
    }
}

export type RSSFeed = {
    title: string;
    link: string;
    description: string;
    items: RSSItem[];
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};
