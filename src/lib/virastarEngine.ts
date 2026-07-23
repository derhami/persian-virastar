import Virastar from 'virastar';
import { VirastarOptionMeta, VirastarOptions, PresetMode, TextStats, DiffToken, DiffStats } from '../types';

export const VIRASTAR_OPTIONS_META: VirastarOptionMeta[] = [
  // نیم‌فاصله و پیشوند/پسوندها
  {
    key: 'normalize_zwnj',
    nameFa: 'استانداردسازی نیم‌فاصله (ZWNJ)',
    descriptionFa: 'تبدیل کاراکترهای نامرئی هم‌ارز و نیم‌فاصله‌های استاندارد نشده به نیم‌فاصله واقعی',
    category: 'halfSpace',
    defaultValue: true,
  },
  {
    key: 'fix_prefix_spacing',
    nameFa: 'نیم‌فاصله پیشوندها (می / نمی‌)',
    descriptionFa: 'اصلاح فاصله بعد از پیشوندهای «می» و «نمی» (مثال: می روم -> می‌روم)',
    category: 'halfSpace',
    defaultValue: true,
  },
  {
    key: 'fix_suffix_spacing',
    nameFa: 'نیم‌فاصله پسوندها (ها / تر / ترین / ام / ات / اش ...)',
    descriptionFa: 'تنظیم نیم‌فاصله پسوندهای جمع، تفضیلی و ضمیر (مثال: کتاب ها -> کتاب‌ها)',
    category: 'halfSpace',
    defaultValue: true,
  },
  {
    key: 'fix_ezafe',
    nameFa: 'اصلاح اضافه (ه‌ی / هٔ)',
    descriptionFa: 'تبدیل «ه‌ی» به «هٔ» استاندارد با نیم‌فاصله (مثال: خانه ی ما -> خانهٔ ما)',
    category: 'halfSpace',
    defaultValue: true,
  },

  // اعداد و تاریخ
  {
    key: 'fix_english_numeral',
    nameFa: 'تبدیل اعداد انگلیسی به فارسی',
    descriptionFa: 'تبدیل ارقام لاتین (0123...) به ارقام فارسی (۰۱۲۳...)',
    category: 'numbers',
    defaultValue: true,
  },
  {
    key: 'fix_arabic_numeral',
    nameFa: 'تبدیل اعداد عربی به فارسی',
    descriptionFa: 'تبدیل ارقام عربی (٠١٢٣...) به ارقام فارسی (۰۱۲۳...)',
    category: 'numbers',
    defaultValue: true,
  },
  {
    key: 'fix_numeral_symbols',
    nameFa: 'اصلاح علائم عددی و درصد',
    descriptionFa: 'تبدیل % به ٪ و اصلاح فاصله در کنار اعداد و ممیز',
    category: 'numbers',
    defaultValue: true,
  },

  // علائم نگارشی
  {
    key: 'fix_punctuations',
    nameFa: 'تنظیم فاصله علائم نگارشی',
    descriptionFa: 'حذف فاصله قبل از نقطه، ویرگول، دو نقطه و اضافه کردن یک فاصله بعد از آن‌ها',
    category: 'punctuation',
    defaultValue: true,
  },
  {
    key: 'fix_per_punc',
    nameFa: 'اصلاح علامت‌های فارسی (؟ ، ؛)',
    descriptionFa: 'تبدیل علامت سؤال ? و ویرگول , انگلیسی به نمونه فارسی',
    category: 'punctuation',
    defaultValue: true,
  },
  {
    key: 'fix_question_mark',
    nameFa: 'اصلاح علامت علامت سؤال',
    descriptionFa: 'تبدیل ? به ؟ در انتهای جملات فارسی',
    category: 'punctuation',
    defaultValue: true,
  },
  {
    key: 'fix_english_quotes',
    nameFa: 'تبدیل گیومه انگلیسی به فارسی «»',
    descriptionFa: 'تبدیل نقل‌قول‌های " " به گیومه استاندارد فارسی « »',
    category: 'punctuation',
    defaultValue: true,
  },
  {
    key: 'fix_three_dots',
    nameFa: 'اصلاح سه نقطه (...)',
    descriptionFa: 'تبدیل سه نقطه متوالی به کاراکتر تک‌علامتی سه نقطه «…»',
    category: 'punctuation',
    defaultValue: true,
  },
  {
    key: 'fix_dashes',
    nameFa: 'اصلاح خط تیره‌ها (Dash)',
    descriptionFa: 'تبدیل خط تیره‌های دوگانه -- به خط تیره بلند (Em-dash) یا نیم‌خط',
    category: 'punctuation',
    defaultValue: true,
  },

  // فاصله‌گذاری و پرانتزها
  {
    key: 'fix_spacing_for_braces_and_quotes',
    nameFa: 'تنظیم فاصله پرانتز، آکولاد و گیومه',
    descriptionFa: 'حذف فاصله داخلی و تنظیم فاصله بیرونی عبارات داخل ( ) [ ] { } « »',
    category: 'spacing',
    defaultValue: true,
  },
  {
    key: 'fix_arabic_char',
    nameFa: 'اصلاح حروف عربی (ک و ی)',
    descriptionFa: 'تبدیل «ك» و «ي» عربی به «ک» و «ی» استاندارد فارسی',
    category: 'cleanup',
    defaultValue: true,
  },
  {
    key: 'cleanup_kashida',
    nameFa: 'حذف کشیدگی حروف (ـ)',
    descriptionFa: 'پاکسازی کشیده یا همان تـطـویـل در کلمات',
    category: 'cleanup',
    defaultValue: true,
  },
  {
    key: 'cleanup_extra_marks',
    nameFa: 'حذف علائم نگارشی تکراری (!!! / ؟؟؟)',
    descriptionFa: 'کاهش علائم تعجب و سؤال پیاپی به یک عدد',
    category: 'cleanup',
    defaultValue: true,
  },
  {
    key: 'cleanup_spacing',
    nameFa: 'پاکسازی فاصله‌های اضافی',
    descriptionFa: 'تبدیل چند فاصله متوالی به یک فاصله استاندارد',
    category: 'spacing',
    defaultValue: true,
  },
  {
    key: 'cleanup_begin_and_end',
    nameFa: 'حذف فاصله ابتدا و انتهای خطوط',
    descriptionFa: 'پاکسازی Spaceهای بیخود در شروع و پایان سطرها',
    category: 'spacing',
    defaultValue: true,
  },
  {
    key: 'cleanup_line_breaks',
    nameFa: 'حذف خطوط خالی متعدد',
    descriptionFa: 'محدود کردن خطوط خالی متوالی به حداکثر یک خط خالی',
    category: 'spacing',
    defaultValue: false,
  },
  {
    key: 'remove_diacritics',
    nameFa: 'حذف اعراب و حرکات (ً ٌ ٍ َ ُ ِ ّ)',
    descriptionFa: 'پاکسازی حرکت‌گذاری‌ها و اعراب روی حروف',
    category: 'cleanup',
    defaultValue: false,
  },

  // حفاظت از کد و لینک
  {
    key: 'preserve_urls',
    nameFa: 'حفظ آدرس‌های اینترنتی و ایمیل',
    descriptionFa: 'جلوگیری از دستکاری لینک‌های HTTP/HTTPS و آدرس‌های ایمیل',
    category: 'markdown',
    defaultValue: true,
  },
  {
    key: 'preserve_html_tags',
    nameFa: 'حفظ تگ‌های HTML',
    descriptionFa: 'عدم دستکاری کدها و تگ‌های HTML داخل متن',
    category: 'markdown',
    defaultValue: true,
  },
  {
    key: 'preserve_brackets',
    nameFa: 'حفظ محتوای داخل قلاب [ ]',
    descriptionFa: 'جلوگیری از تغییر لینک‌ها یا کدهای مارک‌داون',
    category: 'markdown',
    defaultValue: true,
  },
];

export function getDefaultOptions(): VirastarOptions {
  const opts: VirastarOptions = {};
  VIRASTAR_OPTIONS_META.forEach((item) => {
    opts[item.key] = item.defaultValue;
  });
  return opts;
}

export function getPresetOptions(preset: PresetMode): VirastarOptions {
  const base = getDefaultOptions();

  switch (preset) {
    case 'max':
      Object.keys(base).forEach((key) => {
        base[key] = true;
      });
      break;

    case 'minimal':
      Object.keys(base).forEach((key) => {
        base[key] = false;
      });
      base.normalize_zwnj = true;
      base.fix_prefix_spacing = true;
      base.fix_suffix_spacing = true;
      base.fix_arabic_char = true;
      break;

    case 'literary':
      Object.keys(base).forEach((key) => {
        base[key] = true;
      });
      base.fix_english_numeral = false; // Preserve chapter numbers or leave to user preference
      base.remove_diacritics = false;
      base.cleanup_line_breaks = false;
      break;

    case 'academic':
      Object.keys(base).forEach((key) => {
        base[key] = true;
      });
      base.fix_english_quotes = true;
      base.fix_punctuations = true;
      base.preserve_brackets = true;
      base.preserve_urls = true;
      break;

    case 'default':
    default:
      break;
  }

  return base;
}

let cachedVirastarInstance: any = null;

export function processPersianText(text: string, options: VirastarOptions): string {
  if (!text) return '';

  try {
    const VirastarConstructor = typeof Virastar === 'function' ? Virastar : (Virastar as any).default;
    
    // Map custom option keys to native Virastar options
    const vOpts: Record<string, boolean> = {};

    if (options.normalize_zwnj !== undefined) vOpts.cleanup_zwnj = options.normalize_zwnj;
    if (options.fix_prefix_spacing !== undefined) {
      vOpts.fix_perfix_spacing = options.fix_prefix_spacing;
      vOpts.fix_prefix_spacing = options.fix_prefix_spacing;
    }
    if (options.fix_suffix_spacing !== undefined) vOpts.fix_suffix_spacing = options.fix_suffix_spacing;
    if (options.fix_ezafe !== undefined) vOpts.fix_hamzeh = options.fix_ezafe;
    if (options.fix_english_numeral !== undefined) vOpts.fix_english_numbers = options.fix_english_numeral;
    if (options.fix_arabic_numeral !== undefined) vOpts.fix_arabic_numbers = options.fix_arabic_numeral;
    if (options.fix_numeral_symbols !== undefined) vOpts.fix_numeral_symbols = options.fix_numeral_symbols;
    if (options.fix_punctuations !== undefined) vOpts.fix_punctuations = options.fix_punctuations;
    if (options.fix_per_punc !== undefined) vOpts.fix_punctuations = options.fix_per_punc;
    if (options.fix_question_mark !== undefined) vOpts.fix_question_mark = options.fix_question_mark;
    if (options.fix_english_quotes !== undefined) {
      vOpts.fix_english_quotes = options.fix_english_quotes;
      vOpts.fix_english_quotes_pairs = options.fix_english_quotes;
    }
    if (options.fix_three_dots !== undefined) {
      vOpts.fix_three_dots = options.fix_three_dots;
      vOpts.normalize_ellipsis = options.fix_three_dots;
    }
    if (options.fix_dashes !== undefined) vOpts.fix_dashes = options.fix_dashes;
    if (options.fix_spacing_for_braces_and_quotes !== undefined) vOpts.fix_spacing_for_braces_and_quotes = options.fix_spacing_for_braces_and_quotes;
    if (options.fix_arabic_char !== undefined) {
      vOpts.fix_misc_non_persian_chars = options.fix_arabic_char;
      vOpts.fix_persian_glyphs = options.fix_arabic_char;
    }
    if (options.cleanup_kashida !== undefined) vOpts.cleanup_kashidas = options.cleanup_kashida;
    if (options.cleanup_extra_marks !== undefined) vOpts.cleanup_extra_marks = options.cleanup_extra_marks;
    if (options.cleanup_spacing !== undefined) vOpts.cleanup_spacing = options.cleanup_spacing;
    if (options.cleanup_begin_and_end !== undefined) vOpts.cleanup_begin_and_end = options.cleanup_begin_and_end;
    if (options.cleanup_line_breaks !== undefined) vOpts.cleanup_line_breaks = options.cleanup_line_breaks;
    if (options.remove_diacritics !== undefined) vOpts.remove_diacritics = options.remove_diacritics;
    if (options.preserve_urls !== undefined) vOpts.preserve_URIs = options.preserve_urls;
    if (options.preserve_html_tags !== undefined) vOpts.preserve_HTML = options.preserve_html_tags;
    if (options.preserve_brackets !== undefined) vOpts.preserve_brackets = options.preserve_brackets;

    let result = '';
    if (typeof VirastarConstructor === 'function') {
      const instance = new VirastarConstructor(vOpts);
      if (typeof instance.cleanup === 'function') {
        result = instance.cleanup(text);
      } else if (typeof instance === 'function') {
        result = instance(text, vOpts);
      } else {
        result = VirastarConstructor(text, vOpts);
      }
    }

    if (!result && result !== '') {
      result = text;
    }

    // Extra Persian enhancements if enabled
    if (options.fix_arabic_char) {
      result = result.replace(/ك/g, 'ک').replace(/ي/g, 'ی');
    }

    return result;
  } catch (err) {
    console.error('Error running Virastar:', err);
    return text;
  }
}

export function computeTextStats(text: string): TextStats {
  if (!text) {
    return {
      chars: 0,
      charsNoSpace: 0,
      words: 0,
      lines: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
    };
  }

  const chars = text.length;
  const charsNoSpace = text.replace(/\s+/g, '').length;
  
  // Persian word splitting
  const words = text.trim() === '' ? 0 : (text.match(/[\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g) || []).length;
  
  const lines = text.split(/\r\n|\r|\n/).length;
  const sentences = (text.match(/[.!?؟]+(\s|$)/g) || []).length || (text.trim().length > 0 ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim().length > 0 ? 1 : 0);

  // Average reading speed for Persian is ~180-200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 180));

  return {
    chars,
    charsNoSpace,
    words,
    lines,
    sentences,
    paragraphs,
    readingTimeMinutes,
  };
}

export function computeDiff(original: string, modified: string): { tokens: DiffToken[]; stats: DiffStats } {
  const tokens: DiffToken[] = [];
  let additionsCount = 0;
  let deletionsCount = 0;
  let halfSpacesAdded = 0;
  let digitsConverted = 0;
  let punctuationsFixed = 0;

  // Count half spaces added
  const origZwnj = (original.match(/\u200c/g) || []).length;
  const modZwnj = (modified.match(/\u200c/g) || []).length;
  halfSpacesAdded = Math.max(0, modZwnj - origZwnj);

  // Simple tokenized diff for display
  const origLines = original.split('\n');
  const modLines = modified.split('\n');

  const maxLines = Math.max(origLines.length, modLines.length);

  for (let i = 0; i < maxLines; i++) {
    const oLine = origLines[i] ?? '';
    const mLine = modLines[i] ?? '';

    if (oLine === mLine) {
      tokens.push({ type: 'unchanged', value: mLine + (i < maxLines - 1 ? '\n' : '') });
    } else {
      // Find character level diff inside line
      if (oLine.length > 0) {
        tokens.push({ type: 'removed', value: oLine + '\n' });
        deletionsCount += oLine.length;
      }
      if (mLine.length > 0) {
        tokens.push({ type: 'added', value: mLine + (i < maxLines - 1 ? '\n' : '') });
        additionsCount += mLine.length;
      }
    }
  }

  // Count Persian digit conversions
  const origDigits = (original.match(/[0-9]/g) || []).length;
  const modDigits = (modified.match(/[۰-۹]/g) || []).length;
  digitsConverted = Math.min(origDigits, modDigits);

  const totalLen = Math.max(1, original.length);
  const changedPercent = Math.min(100, Math.round(((additionsCount + deletionsCount) / totalLen) * 50));

  return {
    tokens,
    stats: {
      additionsCount,
      deletionsCount,
      halfSpacesAdded,
      digitsConverted,
      punctuationsFixed,
      changedPercent,
    },
  };
}
