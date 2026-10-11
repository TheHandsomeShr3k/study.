(() => {
  'use strict';
  const status = document.getElementById('pwa-status');
  const alert = document.getElementById('pwa-alert');
  const detailStatus = document.getElementById('pwa-detail-status');
  const install = document.getElementById('pwa-install');
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const workerURL = new URL('./service-worker.js', document.baseURI);
  let registration;
  let checkSerial = 0;

  function show(kind, text) {
    if (status) {
      status.dataset.state = kind;
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.textContent = text;
    }
    if (detailStatus) {
      detailStatus.dataset.state = kind;
      detailStatus.textContent = text;
    }
    // A verified cache needs no permanent banner. Its status remains available
    // in the footer; setup problems and updates still get a visible notice.
    if (alert) alert.hidden = kind === 'ready';
  }

  if (install) install.textContent = standalone
    ? 'Als Web-App geöffnet. Dein Lernfortschritt wird auf diesem Gerät gespeichert. iOS kann Website-Daten bei Speicherknappheit oder beim Löschen von Browserdaten entfernen.'
    : 'Auf dem iPhone: Diesen Link in Safari öffnen → Teilen → „Zu Home-Bildschirm hinzufügen“ → gegebenenfalls „Als Web-App öffnen“ aktivieren → Hinzufügen. Die App einmal online starten und hier unter „App & Offline“ den Status „Offline bereit“ prüfen. Lernfortschritt bleibt im jeweiligen Browser bzw. in der installierten App; er wird nicht geräteübergreifend synchronisiert.';

  if (location.protocol === 'file:') {
    show('file', 'Lokale HTML-Datei: Die Lern-App funktioniert ohne Netzwerk. Für eine installierbare iPhone-Web-App öffne die HTTPS-Version in Safari.');
    return;
  }
  if (!window.isSecureContext || !('serviceWorker' in navigator)) {
    show('unavailable', 'Offline-Web-App hier nicht verfügbar. Öffne die HTTPS-Adresse direkt in Safari.');
    return;
  }

  function askCache(controller, repair = false) {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Cache status timeout')); }, repair ? 20000 : 8000);
      channel.port1.onmessage = event => {
        clearTimeout(timer);
        channel.port1.close();
        if (event.data?.type !== 'CONTROLLING_CACHE_STATUS') reject(new Error('Unexpected cache response'));
        else resolve(event.data);
      };
      controller.postMessage({type: repair ? 'CONTROLLING_CACHE_REPAIR' : 'CONTROLLING_CACHE_STATUS'}, [channel.port2]);
    });
  }

  async function check() {
    const serial = ++checkSerial;
    const controller = navigator.serviceWorker.controller;
    if (!controller || controller.scriptURL !== workerURL.href) {
      show('preparing', 'Offline-Version wird vorbereitet. Lass die Seite kurz online geöffnet.');
      return;
    }
    try {
      let result = await askCache(controller);
      if (serial !== checkSerial || navigator.serviceWorker.controller !== controller) return;
      if (!result.verified && navigator.onLine) {
        show('preparing', 'Offline-Speicherung wird vervollständigt …');
        result = await askCache(controller, true);
      }
      if (serial !== checkSerial || navigator.serviceWorker.controller !== controller) return;
      if (!result.verified) {
        show('incomplete', 'Offline-Speicherung noch nicht vollständig. Verbinde dich mit dem Internet und öffne die Lern-App erneut.');
        return;
      }
      const update = registration?.waiting ? ' Ein Update ist bereit: Schließe alle Fenster dieser Lern-App und öffne sie erneut.' : '';
      show(update ? 'update' : 'ready', 'Offline bereit · Fragen, Lösungen und Erklärungen sind auf diesem Gerät gespeichert.' + update);
    } catch {
      if (serial === checkSerial) show('error', 'Offline-Status konnte nicht bestätigt werden. Öffne die Lern-App noch einmal online in Safari.');
    }
  }

  navigator.serviceWorker.addEventListener('controllerchange', check);
  window.addEventListener('online', () => {
    if (registration) registration.update().catch(() => {});
    check();
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  show('preparing', 'Offline-Version wird vorbereitet …');
  navigator.serviceWorker.register(workerURL.href, {scope: new URL('./', document.baseURI).href, updateViaCache: 'none'})
    .then(async result => {
      registration = result;
      function watch(worker) {
        if (!worker) return;
        const changed = () => {
          if (worker.state === 'installed' || worker.state === 'activated') check();
          if (worker.state === 'redundant' && !navigator.serviceWorker.controller) show('error', 'Die Offline-Version konnte nicht vollständig gespeichert werden. Prüfe deine Internetverbindung und öffne die HTTPS-Seite erneut.');
        };
        worker.addEventListener('statechange', changed);
        changed();
      }
      registration.addEventListener('updatefound', () => watch(registration.installing));
      await check();
      watch(registration.installing);
    })
    .catch(() => show('error', 'Offline-Web-App konnte nicht eingerichtet werden. Öffne die HTTPS-Adresse direkt in Safari; die normale Übungsseite bleibt nutzbar.'));
})();
