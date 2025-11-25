export interface TelegramAdItem {
  ad_id: number;
  title: string;
  text: string;
  trg_type: string;
  views: number;
  opens: number | null;
  clicks: number;
  actions: number | null;
  action: string;
  date: number;
  ctr: number | false;
  cvr: number | false;
  cpm: number;
  cpc: number | false;
  cpa: number | false;
  budget: number;
  spent: number;
  daily_budget: number | false;
  daily_spent: number | false;
  target: string;
  tme_path: string;
  status: string;
  status_url: string;
}

export interface TelegramAdsData {
  ok: boolean;
  items: TelegramAdItem[];
  has_more?: boolean;
}

export interface TelegramAdsResponse {
  success: boolean;
  message?: string;
  hasMore?: boolean;
  data?: TelegramAdsData;
  error?: string;
}
