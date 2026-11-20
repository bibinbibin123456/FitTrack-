import { useState } from "react";

const CONSENT_STORAGE_KEY = "fittrack-cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(
    () => !window.localStorage.getItem(CONSENT_STORAGE_KEY)
  );

  const saveConsent = (choice) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#17191d] p-5 text-white shadow-2xl shadow-black/40 sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:gap-6 sm:p-6"
      aria-label="Cookie preferences"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">
          Your privacy matters
        </p>
        <h2 id="cookie-consent-title" className="mt-2 text-lg font-bold">
          Choose your cookie preference
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/65">
          Essential cookies keep your account session secure. Accept all cookies
          or continue with essential cookies only; your choice is saved on this
          device.
        </p>
      </div>
      <div className="mt-5 flex shrink-0 flex-col gap-2 sm:mt-0 sm:w-44">
        <button
          type="button"
          onClick={() => saveConsent("all")}
          className="min-h-11 rounded-xl bg-lime-300 px-4 text-sm font-bold text-slate-950 hover:bg-lime-200"
        >
          Accept all cookies
        </button>
        <button
          type="button"
          onClick={() => saveConsent("essential")}
          className="min-h-11 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white/80 hover:border-white/40 hover:text-white"
        >
          Essential only
        </button>
      </div>
    </aside>
  );
};

export default CookieConsent;
