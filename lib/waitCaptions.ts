/**
 * Rotating wait captions for AI processing overlays.
 * Plain, general English (no technical jargon, no dashes).
 * A shared download pool is used while the AI model files are being
 * fetched (first visit only).
 * Captions are bucketed by real progress bands so the copy never lies
 * about where the job actually is.
 */

type CaptionBand = 'download' | 'early' | 'mid' | 'late' | 'final';

const DOWNLOAD_CAPTIONS: string[] = [
  'Fetching the AI model, one time only...',
  'Saving it in your browser so the next visit starts instantly...',
  'Downloading AI files. This happens just once...',
];

const UPSCALER_CAPTIONS: Record<Exclude<CaptionBand, 'download'>, string[]> = {
  early: [
    'Warming up the AI engine...',
    'Taking a close look at your photo...',
    'Hold tight, the first pass is the slow one...',
    'Getting every part of your image ready...',
    'Quality first, so this takes a moment...',
  ],
  mid: [
    'Adding crisp detail to every corner...',
    'Sharpening fine textures...',
    'Enhancing clarity pixel by pixel...',
    'Rebuilding your photo in higher resolution...',
    'The AI is doing its push-ups, building strength...',
    'Teaching your photo a few new tricks...',
    'Bringing out natural, true to life colors...',
  ],
  late: [
    'Almost there, final polish underway...',
    'Refining edges and small details...',
    'Boosting sharpness and depth...',
    'Giving every detail a last polish...',
  ],
  final: [
    'Finishing touches in progress...',
    'Wrapping up, nearly done...',
    'Making every detail count...',
  ],
};

function poolFor(percent: number, isDownload: boolean, dict?: Record<string, string>): string[] {
  if (dict) {
    if (isDownload) {
      return [
        dict.waitCaption1 || DOWNLOAD_CAPTIONS[0],
        dict.waitCaption2 || DOWNLOAD_CAPTIONS[1],
        dict.waitCaption3 || DOWNLOAD_CAPTIONS[2],
      ];
    }
    if (percent < 25) {
      return [
        dict.waitCaption4 || UPSCALER_CAPTIONS.early[0],
        dict.waitCaption5 || UPSCALER_CAPTIONS.early[1],
        dict.waitCaption6 || UPSCALER_CAPTIONS.early[2],
        dict.waitCaption7 || UPSCALER_CAPTIONS.early[3],
        dict.waitCaption8 || UPSCALER_CAPTIONS.early[4],
      ];
    }
    if (percent < 60) {
      return [
        dict.waitCaption9 || UPSCALER_CAPTIONS.mid[0],
        dict.waitCaption10 || UPSCALER_CAPTIONS.mid[1],
        dict.waitCaption11 || UPSCALER_CAPTIONS.mid[2],
        dict.waitCaption12 || UPSCALER_CAPTIONS.mid[3],
        dict.waitCaption13 || UPSCALER_CAPTIONS.mid[4],
        dict.waitCaption14 || UPSCALER_CAPTIONS.mid[5],
      ];
    }
    if (percent < 90) {
      return [
        dict.waitCaption15 || UPSCALER_CAPTIONS.late[0],
        dict.waitCaption16 || UPSCALER_CAPTIONS.late[1],
        dict.waitCaption17 || UPSCALER_CAPTIONS.late[2],
        dict.waitCaption18 || UPSCALER_CAPTIONS.late[3],
      ];
    }
    return [
      dict.waitCaption19 || UPSCALER_CAPTIONS.final[0],
      dict.waitCaption20 || UPSCALER_CAPTIONS.final[1],
      dict.waitCaption21 || UPSCALER_CAPTIONS.final[2],
    ];
  }

  if (isDownload) return DOWNLOAD_CAPTIONS;
  const pools = UPSCALER_CAPTIONS;
  if (percent < 25) return pools.early;
  if (percent < 60) return pools.mid;
  if (percent < 90) return pools.late;
  return pools.final;
}

/** Deterministic per tick → no flicker from rerenders; rotates on interval. */
export function pickCaption(percent: number, isDownload: boolean, tick: number, dict?: Record<string, string>): string {
  const pool = poolFor(percent, isDownload, dict);
  const index = ((tick % pool.length) + pool.length) % pool.length;
  return pool[index];
}
