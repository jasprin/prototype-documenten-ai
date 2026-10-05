// Bladeren met de pijltjestoetsen: links naar het vorige beeld, rechts naar het volgende.
document.addEventListener('keydown', function (event) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  var target = event.target;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
  var rel = event.key === 'ArrowLeft' ? 'prev' : event.key === 'ArrowRight' ? 'next' : null;
  var link = rel && document.querySelector('a[rel="' + rel + '"]');
  if (link) window.location.href = link.href;
});
