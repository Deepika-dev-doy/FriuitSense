
const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const READ_API_KEY = process.env.THINGSPEAK_READ_API_KEY;

async function requestThingSpeak(path, options = {}) {
  if (!CHANNEL_ID) {
    throw new Error("THINGSPEAK_CHANNEL_ID is missing in server .env");
  }

  if (!READ_API_KEY) {
    throw new Error("THINGSPEAK_READ_API_KEY is missing in server .env");
  }

  const url = new URL(
    `https://api.thingspeak.com/channels/${CHANNEL_ID}/${path}`
  );

  url.searchParams.set("api_key", READ_API_KEY);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ThingSpeak returned HTTP ${response.status}`);
  }

  const data = await response.json();

  if (options.expectFeeds && !Array.isArray(data.feeds)) {
    throw new Error("ThingSpeak history response has no feeds array");
  }

  return options.expectFeeds ? data.feeds : data;
}

function normalizeFeed(feed) {
  if (!feed) return null;

  const stageNumber = Number(feed.field6);

  const stages = {
    0: "RAW",
    1: "RIPE",
    2: "ROTTEN",
  };

  return {
    createdAt: feed.created_at,
    temperature: Number(feed.field1),
    humidity: Number(feed.field2),
    mq3: Number(feed.field3),
    mq135: Number(feed.field4),
    ripenessScore: Number(feed.field5),
    stageNumber,
    stage: stages[stageNumber] || "UNKNOWN",
  };
}

export async function fetchLatestReading() {
  const feed = await requestThingSpeak("feeds/last.json");
  return normalizeFeed(feed);
}

export async function fetchHistory(results) {
  const feeds = await requestThingSpeak("feeds.json", {
    params: { results },
    expectFeeds: true,
  });

  return feeds.map(normalizeFeed).filter(Boolean);
}
