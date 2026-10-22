// Demo wiring. The adapter only follows the level, the page owns its actions.
(function () {
  'use strict';
  const doc = document.documentElement;
  const cursor = GameFeelCursor.mount({ requireJuice: true });

  const status = document.getElementById('cursor-status');
  const paint = () => {
    const s = GameFeelCursor.current.stats;
    status.textContent = 'Juega: ' + s.juiceLevel + ' · cursor: ' + s.intensity + ' (' + s.layer + (s.radius ? ', ' + s.radius + ' px' : '') + ')';
  };
  new MutationObserver(paint).observe(doc, { attributes: true, attributeFilter: ['data-jz-level'] });
  paint();

  // Site achievement: the three core actions open Hardcore for this visit.
  // data-jz-hard="open" is the juice 1.2.0 switch for sites without a mascot.
  // It is set only after the visitor earns it and it is not stored.
  const done = new Set();
  function goal(name) {
    const item = document.querySelector('[data-goal="' + name + '"]');
    if (!item || done.has(name)) return;
    done.add(name);
    item.classList.add('is-done');
    if (done.size === 3 && doc.getAttribute('data-jz-hard') !== 'open') {
      doc.setAttribute('data-jz-hard', 'open');
      document.getElementById('unlock-note').textContent = 'Hardcore abierto para esta visita. Búscalo en Juega.';
      document.dispatchEvent(new CustomEvent('jz:unlock-hard'));
    }
  }

  document.getElementById('tap').addEventListener('click', () => goal('tap'));

  const form = document.getElementById('note-form');
  const note = document.getElementById('note');
  const noteStatus = document.getElementById('note-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!note.value.trim()) {
      noteStatus.textContent = '';
      JZ.play('jz-error', note);
      return;
    }
    noteStatus.classList.remove('is-error');
    noteStatus.textContent = 'Nota guardada: ' + note.value.trim();
    JZ.play('impact+burst+success', document.getElementById('save'));
    goal('note');
  });

  for (const tab of document.querySelectorAll('[role=tab]')) {
    tab.addEventListener('click', () => {
      for (const other of document.querySelectorAll('[role=tab]')) {
        const on = other === tab;
        other.setAttribute('aria-selected', String(on));
        document.getElementById(other.getAttribute('aria-controls')).hidden = !on;
      }
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      JZ.play('press', tab);
      JZ.stagger(panel, 'menu');
      goal('tab');
    });
  }
})();
