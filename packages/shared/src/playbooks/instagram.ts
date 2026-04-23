/**
 * Instagram Platform Playbook
 *
 * This is the "moat" — curated knowledge about what works on Instagram.
 * The Strategy Layer (Claude) reads this to generate platform-native content plans.
 * Update regularly based on platform changes and performance data.
 */

export const instagramPlaybook = {
  platform: "instagram" as const,
  updatedAt: "2026-04-23",

  specs: {
    reel: {
      aspectRatio: "9:16",
      minDurationSeconds: 3,
      maxDurationSeconds: 90,
      sweetSpotDurationSeconds: [15, 30],
      maxCaptionLength: 2200,
      maxHashtags: 30,
      recommendedHashtags: [5, 15],
      recommendedHookLength: 60,
    },
    carousel: {
      aspectRatio: "4:5",
      minSlides: 2,
      maxSlides: 10,
      sweetSpotSlides: [5, 8],
      maxCaptionLength: 2200,
    },
    static_post: {
      aspectRatio: "4:5",
      maxCaptionLength: 2200,
    },
    story: {
      aspectRatio: "9:16",
      maxDurationSeconds: 60,
    },
    feed_grid: {
      aspectRatio: "1:1",
      gridSize: 9,
    },
  },

  hookPatterns: [
    {
      pattern: "question",
      examples: [
        "מה הדבר שאף אחד לא מספר לך על X?",
        "You won't believe what happened when I tried X",
      ],
      effectiveness: 0.85,
    },
    {
      pattern: "bold_claim",
      examples: ["X שינה לי את החיים", "Stop doing X immediately"],
      effectiveness: 0.82,
    },
    {
      pattern: "pattern_interrupt",
      examples: ["אל תגללו. זה חייב להישמע.", "Wait — watch this before you scroll"],
      effectiveness: 0.78,
    },
    {
      pattern: "listicle",
      examples: ["3 דברים שלמדתי על X", "5 mistakes I made with X"],
      effectiveness: 0.75,
    },
    {
      pattern: "transformation",
      examples: ["מ-0 ל-X ב-30 יום", "Before vs After"],
      effectiveness: 0.83,
    },
  ],

  contentPillars: [
    "education",
    "entertainment",
    "inspiration",
    "community",
    "behind_the_scenes",
    "transformation",
    "tutorial",
  ],

  captionStructure: {
    hook: { required: true, maxLength: 125, placement: "first_line" },
    body: { required: true, useLineBreaks: true, useEmojis: "moderate" },
    cta: { required: true, examples: ["Save for later", "Share with a friend", "שמור לעצמך"] },
    hashtags: { placement: "end_or_first_comment", useNiche: true },
  },

  hashtagStrategy: {
    mix: {
      broad: { count: 3, followers: ">1M" },
      medium: { count: 5, followers: "100K-1M" },
      niche: { count: 5, followers: "10K-100K" },
      branded: { count: 2, followers: "any" },
    },
    avoid: ["banned", "overly_generic", "spammy"],
  },

  bestPublishTimes: {
    israel: ["08:00", "12:00", "19:00", "21:00"],
    global: ["11:00 UTC", "15:00 UTC", "19:00 UTC"],
  },

  algorithmSignals: {
    mostImportant: [
      "watch_time_percentage",
      "shares",
      "saves",
      "comments_within_first_hour",
    ],
    captionShouldEncourage: ["saves", "shares", "comments"],
  },

  reelSpecific: {
    firstThreeSecondsCritical: true,
    useTextOverlayForSilentWatchers: true,
    captionsAlwaysBurned: true,
    verticalOnly: true,
    musicMatters: true,
    aimForLoopability: true,
  },
} as const;

export type InstagramPlaybook = typeof instagramPlaybook;
