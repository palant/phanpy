import './settings.css';

import { useRef } from 'preact/hooks';
import { useSnapshot } from 'valtio';

import logo from '../assets/logo.svg';
import RelativeTime from '../components/relative-time';
import targetLanguages from '../data/lingva-target-languages';
import getTranslateTargetLanguage from '../utils/get-translate-target-language';
import localeCode2Text from '../utils/localeCode2Text';
import states from '../utils/states';
import store from '../utils/store';

function Settings({ onClose }) {
  const snapStates = useSnapshot(states);
  const currentTheme = store.local.get('theme') || 'auto';
  const themeFormRef = useRef();
  const targetLanguage =
    snapStates.settings.contentTranslationTargetLanguage || null;
  const systemTargetLanguage = getTranslateTargetLanguage();
  const systemTargetLanguageText = localeCode2Text(systemTargetLanguage);

  return (
    <div id="settings-container" class="sheet" tabIndex="-1">
      <header>
        <h2>Settings</h2>
      </header>
      <main>
        <section>
          <ul>
            <li>
              <div>
                <label>Appearance</label>
              </div>
              <div>
                <form
                  ref={themeFormRef}
                  onInput={(e) => {
                    console.log(e);
                    e.preventDefault();
                    const formData = new FormData(themeFormRef.current);
                    const theme = formData.get('theme');
                    const html = document.documentElement;

                    if (theme === 'auto') {
                      html.classList.remove('is-light', 'is-dark');
                    } else {
                      html.classList.toggle('is-light', theme === 'light');
                      html.classList.toggle('is-dark', theme === 'dark');
                    }
                    document
                      .querySelector('meta[name="color-scheme"]')
                      .setAttribute(
                        'content',
                        theme === 'auto' ? 'dark light' : theme,
                      );

                    if (theme === 'auto') {
                      store.local.del('theme');
                    } else {
                      store.local.set('theme', theme);
                    }
                  }}
                >
                  <div class="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        defaultChecked={currentTheme === 'light'}
                      />
                      <span>Light</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        defaultChecked={currentTheme === 'dark'}
                      />
                      <span>Dark</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="auto"
                        defaultChecked={
                          currentTheme !== 'light' && currentTheme !== 'dark'
                        }
                      />
                      <span>Auto</span>
                    </label>
                  </div>
                </form>
              </div>
            </li>
          </ul>
        </section>
        <h3>Experiments</h3>
        <section>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={snapStates.settings.boostsCarousel}
                  onChange={(e) => {
                    states.settings.boostsCarousel = e.target.checked;
                  }}
                />{' '}
                Boosts carousel
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={snapStates.settings.contentTranslation}
                  onChange={(e) => {
                    states.settings.contentTranslation = e.target.checked;
                  }}
                />{' '}
                Post translation
              </label>
              {snapStates.settings.contentTranslation && (
                <div class="sub-section">
                  <label>
                    Translate to{' '}
                    <select
                      value={targetLanguage}
                      onChange={(e) => {
                        states.settings.contentTranslationTargetLanguage =
                          e.target.value || null;
                      }}
                    >
                      <option value="">
                        System language ({systemTargetLanguageText})
                      </option>
                      <option disabled>──────────</option>
                      {targetLanguages.map((lang) => (
                        <option value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </label>
                  <p>
                    <small>
                      Note: This feature uses an external API to translate,
                      powered by{' '}
                      <a
                        href="https://github.com/thedaviddelta/lingva-translate"
                        target="_blank"
                      >
                        Lingva Translate
                      </a>
                      .
                    </small>
                  </p>
                </div>
              )}
            </li>
            <li>
              <button
                type="button"
                class="light"
                onClick={() => {
                  states.showDrafts = true;
                  states.showSettings = false;
                }}
              >
                Unsent drafts
              </button>
            </li>
          </ul>
        </section>
        <h3>About</h3>
        <section>
          <p>
            <img
              src={logo}
              alt=""
              width="20"
              height="20"
              style={{
                aspectRatio: '1/1',
                verticalAlign: 'middle',
              }}
            />{' '}
            <a
              href="https://hachyderm.io/@phanpy"
              // target="_blank"
              onClick={(e) => {
                e.preventDefault();
                states.showAccount = 'phanpy@hachyderm.io';
              }}
            >
              @phanpy
            </a>
            .
          </p>
          <p>
            <a href="https://github.com/cheeaun/phanpy" target="_blank">
              Built
            </a>{' '}
            by{' '}
            <a
              href="https://mastodon.social/@cheeaun"
              // target="_blank"
              onClick={(e) => {
                e.preventDefault();
                states.showAccount = 'cheeaun@mastodon.social';
              }}
            >
              @cheeaun
            </a>
            .{' '}
            <a
              href="https://github.com/cheeaun/phanpy/blob/main/PRIVACY.MD"
              target="_blank"
            >
              Privacy Policy
            </a>
            .
          </p>
          {__BUILD_TIME__ && (
            <p>
              Last build: <RelativeTime datetime={new Date(__BUILD_TIME__)} />{' '}
              {__COMMIT_HASH__ && (
                <>
                  (
                  <a
                    href={`https://github.com/cheeaun/phanpy/commit/${__COMMIT_HASH__}`}
                    target="_blank"
                  >
                    <code>{__COMMIT_HASH__}</code>
                  </a>
                  )
                </>
              )}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Settings;
