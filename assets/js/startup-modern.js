(function() {
  "use strict"; // Start of use strict

  var consentKey = "asseii-cookie-consent";
  var bannerId = "cookie-consent-banner";
  var styleId = "cookie-consent-banner-style";
  var gaMeasurementId = "G-N48GS12H2Q";

  function getConsentState() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function setConsentState(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
    }
  }

  function hasAcceptedCookies() {
    return getConsentState() === "accepted";
  }

  function injectBannerStyles() {
    if (document.getElementById(styleId)) {
      return;
    }

    var style = document.createElement("style");
    style.id = styleId;
    style.textContent = "#" + bannerId + "{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:1080;max-width:980px;margin:0 auto;padding:1rem 1.1rem;border:1px solid var(--bs-primary-border-subtle);border-radius:1rem;background:var(--bs-primary-bg-subtle);box-shadow:0 1rem 2rem rgba(243,138,82,.18);backdrop-filter:blur(12px);color:var(--bs-body-color)}#" + bannerId + " .cookie-consent__title{font-weight:800;font-size:1rem;margin:0 0 .35rem;color:var(--bs-primary)}#" + bannerId + " .cookie-consent__text{margin:0;color:var(--bs-body-color);line-height:1.5}#" + bannerId + " .cookie-consent__actions{display:flex;flex-wrap:wrap;gap:.65rem;justify-content:flex-end;align-items:center;margin-top:1rem}#" + bannerId + " .cookie-consent__link{color:var(--bs-primary);text-decoration:underline}#" + bannerId + " .cookie-consent__button{border:1px solid transparent;border-radius:999px;padding:.72rem 1.05rem;font-weight:700;cursor:pointer;transition:transform .15s ease,opacity .15s ease,background-color .15s ease,border-color .15s ease}#" + bannerId + " .cookie-consent__button:hover{transform:translateY(-1px)}#" + bannerId + " .cookie-consent__button--accept{background:var(--bs-primary);border-color:var(--bs-primary);color:#fff}#" + bannerId + " .cookie-consent__button--reject{background:#fff;border-color:var(--bs-primary);color:var(--bs-primary)}#" + bannerId + " .cookie-consent__button:focus{outline:2px solid var(--bs-primary);outline-offset:2px}@media (max-width: 576px){#" + bannerId + "{left:.75rem;right:.75rem;bottom:.75rem;padding:.9rem}#" + bannerId + " .cookie-consent__actions{justify-content:stretch}#" + bannerId + " .cookie-consent__button{flex:1 1 100%}}";
    document.head.appendChild(style);
  }

  function copyAllowedAttributes(source, target) {
    Array.prototype.slice.call(source.attributes).forEach(function(attribute) {
      if (attribute.name === "type" || attribute.name.indexOf("data-cookie-consent") === 0) {
        return;
      }

      target.setAttribute(attribute.name, attribute.value);
    });
  }

  function initGoogleAnalytics() {
    if (window.__asseiiGaInitialized) {
      return;
    }

    window.__asseiiGaInitialized = true;
    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId);
  }

  function loadConsentProtectedScripts() {
    var protectedScripts = document.querySelectorAll('script[data-cookie-consent-src]');

    protectedScripts.forEach(function(sourceScript) {
      if (sourceScript.dataset.cookieConsentLoaded === "true") {
        return;
      }

      var loadedScript = document.createElement("script");
      copyAllowedAttributes(sourceScript, loadedScript);
      loadedScript.src = sourceScript.getAttribute("data-cookie-consent-src");
      sourceScript.dataset.cookieConsentLoaded = "true";
      sourceScript.parentNode.insertBefore(loadedScript, sourceScript);
      sourceScript.remove();

      if (loadedScript.src.indexOf("googletagmanager.com/gtag/js") !== -1) {
        initGoogleAnalytics();
      }
    });
  }

  function removeConsentBanner() {
    var banner = document.getElementById(bannerId);

    if (banner) {
      banner.remove();
    }
  }

  function createConsentBanner() {
    if (document.getElementById(bannerId) || hasAcceptedCookies()) {
      return;
    }

    injectBannerStyles();

    var banner = document.createElement("div");
    banner.id = bannerId;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML = '<div class="cookie-consent__title">Cookies y privacidad</div><p class="cookie-consent__text">En este sitio web usamos cookies propias y de terceros para analizar el uso de la página y, si das tu permiso, mostrar contenido de redes sociales. Puedes aceptarlas o limitar su uso a las necesarias. Si quieres más información, consulta el <a class="cookie-consent__link" href="aviso-legal.html">aviso legal</a>.</p><div class="cookie-consent__actions"><button type="button" class="cookie-consent__button cookie-consent__button--reject" data-cookie-consent-action="reject">Solo esenciales</button><button type="button" class="cookie-consent__button cookie-consent__button--accept" data-cookie-consent-action="accept">Aceptar todo</button></div>';

    banner.addEventListener("click", function(event) {
      var actionButton = event.target.closest("[data-cookie-consent-action]");

      if (!actionButton) {
        return;
      }

      if (actionButton.getAttribute("data-cookie-consent-action") === "accept") {
        setConsentState("accepted");
        loadConsentProtectedScripts();
      } else {
        setConsentState("rejected");
      }

      removeConsentBanner();
    });

    document.body.appendChild(banner);
  }

  function initializeCookieConsent() {
    if (hasAcceptedCookies()) {
      loadConsentProtectedScripts();
      return;
    }

    createConsentBanner();
  }

  var mainNav = document.querySelector('#mainNav');

  if (mainNav) {

    // Collapse Navbar
    var collapseNavbar = function() {

      var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

      if (scrollTop > 100) {
        mainNav.classList.add("navbar-shrink");
      } else {
        mainNav.classList.remove("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    collapseNavbar();
    // Collapse the navbar when page is scrolled
    document.addEventListener("scroll", collapseNavbar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCookieConsent);
  } else {
    initializeCookieConsent();
  }

})(); // End of use strict

