
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

  const timeoutMs = Number(process.env.THINGSPEAK_TIMEOUT_MS) || 10000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`ThingSpeak request timed out after ${timeoutMs}ms`);
    }
    throw new Error(`ThingSpeak request failed: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }

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

  const numberFromField = (field) => {
    if (field === null || field === undefined || field === "") return null;
    const value = Number(field);
    return Number.isFinite(value) ? value : null;
  };
  const stageNumber = numberFromField(feed.field6);

  const stages = {
    0: "RAW",
    1: "RIPE",
    2: "ROTTEN",
  };
  const fruitCodes = {
    1: "BANANA",
    2: "TOMATO",
    3: "MANGO",
  };
  const fruitCode = numberFromField(feed.field7);
  const fruit = fruitCodes[fruitCode] || "UNKNOWN";

  return {
    createdAt: feed.created_at,
    temperature: numberFromField(feed.field1),
    humidity: numberFromField(feed.field2),
    mq3: numberFromField(feed.field3),
    mq135: numberFromField(feed.field4),
    ripenessScore: numberFromField(feed.field5),
    stageNumber,
    stage: stages[stageNumber] || "UNKNOWN",
    fruitCode,
    fruit,
    classificationSource: "ESP32_RULE_BASED_FIELD6",
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
