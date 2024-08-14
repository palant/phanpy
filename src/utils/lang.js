import { i18n } from '@lingui/core';
import {
  detect,
  fromNavigator,
  fromStorage,
  fromUrl,
} from '@lingui/detect-locale';
import Locale from 'intl-locale-textinfo-polyfill';

import { DEFAULT_LANG, LOCALES } from '../locales';
import { messages } from '../locales/en.po';
import localeMatch from '../utils/locale-match';

const { PHANPY_DEFAULT_LANG } = import.meta.env;

i18n.load(DEFAULT_LANG, messages);
i18n.on('change', () => {
  const lang = i18n.locale;
  if (lang) {
    // LTR or RTL
    const { direction } = new Locale(lang).textInfo;
    document.documentElement.dir = direction;
  }
});

export async function activateLang(lang) {
  if (!lang || lang === DEFAULT_LANG) {
    i18n.activate(DEFAULT_LANG);
    console.log('💬 ACTIVATE LANG', DEFAULT_LANG, lang);
  } else {
    try {
      const { messages } = await import(`../locales/${lang}.po`);
      i18n.loadAndActivate({ locale: lang, messages });
      console.log('💬 ACTIVATE LANG', lang, messages);
    } catch (e) {
      // Fallback to default language
      i18n.activate(DEFAULT_LANG);
      console.log('💬 ACTIVATE LANG', DEFAULT_LANG, lang);
    }
  }
}

export function initActivateLang() {
  const lang = detect(
    fromUrl('lang'),
    fromStorage('lang'),
    fromNavigator(),
    PHANPY_DEFAULT_LANG,
    DEFAULT_LANG,
  );
  const matchedLang = localeMatch(lang, LOCALES);
  activateLang(matchedLang);

  // const yes = confirm(t`Reload to apply language setting?`);
  // if (yes) {
  //   window.location.reload();
  // }
}
