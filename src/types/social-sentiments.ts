export interface SocialSentimentItem {
  score: number;
  positiveMention: number;
  negativeMention: number;
  atTime: string;
}

export interface SocialSentiments {
  reddit: SocialSentimentItem[];
  twitter: SocialSentimentItem[];
}
