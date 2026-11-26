// Stand-in third-party script. Loaded as type="text/partytown", so the browser never executes it on
// the main thread; Partytown runs it in a web worker and proxies the DOM write below to the page.
;(function () {
  window.__ftThirdParty = { ran: true } // stays in the worker's sandboxed window
  document.documentElement.setAttribute('data-ft-third-party', 'ran')
})()
