/**
 * Standardized Multi-Touch Gesture Handler Script for Visu AI Sandboxed Simulations
 * Injected automatically into every generated HTML5 Canvas simulation.
 * 
 * Features:
 * - Multi-touch pinch-to-zoom with focal point tracking
 * - Multi-touch 2-finger pan & translation
 * - Trackpad pinch (Ctrl+Wheel) & trackpad pan support
 * - Double-tap / double-touch reset to 100% zoom and origin
 * - Seamless 1-finger passthrough for physics object dragging & on-screen UI controls
 * - Bidirectional postMessage bridge with parent VisualSandbox React component
 * - Subtle on-canvas HUD indicator showing zoom level with quick reset button
 */

export const STANDARDIZED_TOUCH_GESTURE_SCRIPT = `
<script id="visu-touch-gesture-handler">
(function() {
  if (window.__visuTouchGestureInstalled) return;
  window.__visuTouchGestureInstalled = true;

  var currentZoom = 1.0;
  var currentPanX = 0;
  var currentPanY = 0;
  var MIN_ZOOM = 0.35;
  var MAX_ZOOM = 8.0;

  var touchState = {
    isPinching: false,
    startDist: 0,
    startMidX: 0,
    startMidY: 0,
    initialZoom: 1.0,
    initialPanX: 0,
    initialPanY: 0,
    lastTapTime: 0,
    lastTapX: 0,
    lastTapY: 0
  };

  // Helper to find all target canvas elements
  function getCanvasTargets() {
    return document.querySelectorAll('canvas');
  }

  function getPrimaryCanvas() {
    return document.querySelector('canvas');
  }

  // Create or retrieve HUD indicator element
  var hudEl = null;
  var toastEl = null;
  var toastTimeout = null;

  function initHud() {
    if (hudEl || !document.body) return;

    // Mini Zoom HUD in top-right corner of canvas container
    hudEl = document.createElement('div');
    hudEl.id = 'visu-touch-hud';
    hudEl.style.cssText = [
      'position: fixed',
      'top: 14px',
      'right: 14px',
      'z-index: 9999',
      'display: none',
      'align-items: center',
      'gap: 8px',
      'padding: 6px 12px',
      'background: rgba(11, 15, 23, 0.85)',
      'backdrop-filter: blur(12px)',
      '-webkit-backdrop-filter: blur(12px)',
      'border: 1px solid rgba(255, 255, 255, 0.12)',
      'border-radius: 9999px',
      'color: #e2e8f0',
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      'font-size: 11px',
      'font-weight: 600',
      'letter-spacing: 0.5px',
      'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      'user-select: none',
      '-webkit-user-select: none',
      'pointer-events: auto',
      'transition: opacity 0.2s ease, transform 0.2s ease'
    ].join(';');

    hudEl.innerHTML = [
      '<span id="visu-zoom-text" style="color:#38bdf8;">100%</span>',
      '<button id="visu-zoom-reset" style="background:rgba(255,255,255,0.1); border:none; color:#f1f5f9; border-radius:9999px; padding:2px 8px; font-size:10px; cursor:pointer; font-weight:600; transition:background 0.15s;">Reset</button>'
    ].join('');

    document.body.appendChild(hudEl);

    var resetBtn = document.getElementById('visu-zoom-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        animateReset();
      });
      resetBtn.addEventListener('touchend', function(e) {
        e.stopPropagation();
        animateReset();
      });
    }

    // Touch gesture hint toast
    toastEl = document.createElement('div');
    toastEl.id = 'visu-gesture-toast';
    toastEl.style.cssText = [
      'position: fixed',
      'bottom: 80px',
      'left: 50%',
      'transform: translateX(-50%)',
      'z-index: 9998',
      'display: none',
      'align-items: center',
      'gap: 6px',
      'padding: 6px 14px',
      'background: rgba(15, 23, 42, 0.92)',
      'backdrop-filter: blur(12px)',
      'border: 1px solid rgba(56, 189, 248, 0.3)',
      'border-radius: 9999px',
      'color: #94a3b8',
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 11px',
      'pointer-events: none',
      'user-select: none',
      'box-shadow: 0 10px 25px rgba(0,0,0,0.5)',
      'transition: opacity 0.3s ease'
    ].join(';');
    toastEl.innerHTML = '<span style="color:#38bdf8;">✦</span> Multi-touch: Pinch to zoom · 2 fingers to pan';
    document.body.appendChild(toastEl);
  }

  function showToastHint() {
    if (!toastEl) return;
    toastEl.style.display = 'flex';
    toastEl.style.opacity = '1';
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function() {
      if (toastEl) {
        toastEl.style.opacity = '0';
        setTimeout(function() {
          if (toastEl) toastEl.style.display = 'none';
        }, 300);
      }
    }, 2800);
  }

  function updateHudIndicator() {
    if (!hudEl) initHud();
    if (!hudEl) return;

    var textEl = document.getElementById('visu-zoom-text');
    if (textEl) {
      textEl.textContent = Math.round(currentZoom * 100) + '%';
    }

    var isTransformed = Math.abs(currentZoom - 1.0) > 0.01 || Math.abs(currentPanX) > 1 || Math.abs(currentPanY) > 1;
    if (isTransformed) {
      hudEl.style.display = 'flex';
      hudEl.style.opacity = '1';
    } else {
      hudEl.style.opacity = '0';
      setTimeout(function() {
        if (Math.abs(currentZoom - 1.0) <= 0.01 && Math.abs(currentPanX) <= 1 && Math.abs(currentPanY) <= 1 && hudEl) {
          hudEl.style.display = 'none';
        }
      }, 200);
    }
  }

  // Apply CSS transform to all canvas elements
  function applyTransform(zoom, panX, panY, notifyParent) {
    currentZoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
    currentPanX = panX;
    currentPanY = panY;

    var targets = getCanvasTargets();
    for (var i = 0; i < targets.length; i++) {
      var c = targets[i];
      c.style.transformOrigin = '0 0';
      c.style.transform = 'translate3d(' + currentPanX.toFixed(2) + 'px, ' + currentPanY.toFixed(2) + 'px, 0px) scale(' + currentZoom.toFixed(4) + ')';
    }

    updateHudIndicator();

    if (notifyParent !== false) {
      try {
        window.parent.postMessage({
          type: 'VISU_TRANSFORM_CHANGE',
          zoom: currentZoom,
          panX: currentPanX,
          panY: currentPanY
        }, '*');
      } catch(e) {}
    }
  }

  // Smooth animated reset
  function animateReset() {
    var startZ = currentZoom;
    var startX = currentPanX;
    var startY = currentPanY;
    var duration = 240;
    var startTime = performance.now();

    function step(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1.0);
      // Ease out cubic
      var ease = 1 - Math.pow(1 - progress, 3);

      var z = startZ + (1.0 - startZ) * ease;
      var px = startX + (0 - startX) * ease;
      var py = startY + (0 - startY) * ease;

      applyTransform(z, px, py, progress === 1.0);

      if (progress < 1.0) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Zoom centered around a specific screen point (cx, cy)
  function zoomAtPoint(targetZoom, cx, cy) {
    targetZoom = Math.min(Math.max(targetZoom, MIN_ZOOM), MAX_ZOOM);
    var scaleRatio = targetZoom / currentZoom;
    var newPanX = cx - (cx - currentPanX) * scaleRatio;
    var newPanY = cy - (cy - currentPanY) * scaleRatio;
    applyTransform(targetZoom, newPanX, newPanY);
  }

  // Zoom centered on viewport center
  function zoomAtCenter(delta) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    zoomAtPoint(currentZoom * (1 + delta), cx, cy);
  }

  // Map pointer coordinates when transformed so standard single-touch/click physics works
  function patchEventCoordinates(e) {
    if (Math.abs(currentZoom - 1.0) < 0.001 && Math.abs(currentPanX) < 1 && Math.abs(currentPanY) < 1) return;
    var canvas = getPrimaryCanvas();
    if (!canvas) return;

    var rect = canvas.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;

    // If 1-finger touch
    if (e.touches && e.touches.length === 1) {
      var t = e.touches[0];
      var adjustedX = rect.left + (t.clientX - rect.left) / currentZoom;
      var adjustedY = rect.top + (t.clientY - rect.top) / currentZoom;
      try {
        Object.defineProperty(t, 'clientX', { value: adjustedX, configurable: true });
        Object.defineProperty(t, 'clientY', { value: adjustedY, configurable: true });
      } catch(err) {}
    } else if (!e.touches && typeof e.clientX === 'number') {
      var adjustedX = rect.left + (e.clientX - rect.left) / currentZoom;
      var adjustedY = rect.top + (e.clientY - rect.top) / currentZoom;
      try {
        Object.defineProperty(e, 'clientX', { value: adjustedX, configurable: true });
        Object.defineProperty(e, 'clientY', { value: adjustedY, configurable: true });
      } catch(err) {}
    }
  }

  // --- MULTI-TOUCH LISTENERS ---
  window.addEventListener('touchstart', function(e) {
    // If user touched UI controls, sliders, or buttons, let them interact normally
    var targetTag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
    if (['BUTTON', 'INPUT', 'SELECT', 'A'].indexOf(targetTag) !== -1 || (e.target && e.target.closest && e.target.closest('.controls-panel, #visu-touch-hud'))) {
      return;
    }

    if (e.touches.length >= 2) {
      // Start of 2-finger gesture (pinch or pan)
      e.preventDefault();
      var t0 = e.touches[0];
      var t1 = e.touches[1];
      touchState.isPinching = true;
      touchState.startDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      touchState.startMidX = (t0.clientX + t1.clientX) / 2;
      touchState.startMidY = (t0.clientY + t1.clientY) / 2;
      touchState.initialZoom = currentZoom;
      touchState.initialPanX = currentPanX;
      touchState.initialPanY = currentPanY;
      showToastHint();
    } else if (e.touches.length === 1) {
      touchState.isPinching = false;
      // Double tap detection
      var now = Date.now();
      var t = e.touches[0];
      var dist = Math.hypot(t.clientX - touchState.lastTapX, t.clientY - touchState.lastTapY);
      if (now - touchState.lastTapTime < 300 && dist < 35) {
        if (Math.abs(currentZoom - 1.0) > 0.05 || Math.abs(currentPanX) > 10 || Math.abs(currentPanY) > 10) {
          e.preventDefault();
          animateReset();
        }
        touchState.lastTapTime = 0;
      } else {
        touchState.lastTapTime = now;
        touchState.lastTapX = t.clientX;
        touchState.lastTapY = t.clientY;
      }

      // Patch coordinates for single touch physics interaction
      patchEventCoordinates(e);
    }
  }, { passive: false, capture: true });

  window.addEventListener('touchmove', function(e) {
    if (touchState.isPinching && e.touches.length >= 2) {
      e.preventDefault();
      var t0 = e.touches[0];
      var t1 = e.touches[1];
      var currentDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
      var currentMidX = (t0.clientX + t1.clientX) / 2;
      var currentMidY = (t0.clientY + t1.clientY) / 2;

      if (touchState.startDist > 5) {
        var scaleRatio = currentDist / touchState.startDist;
        var targetZoom = Math.min(Math.max(touchState.initialZoom * scaleRatio, MIN_ZOOM), MAX_ZOOM);

        // Focal zoom mathematics: preserves point under centroid
        var actualRatio = targetZoom / touchState.initialZoom;
        var targetPanX = currentMidX - (touchState.startMidX - touchState.initialPanX) * actualRatio;
        var targetPanY = currentMidY - (touchState.startMidY - touchState.initialPanY) * actualRatio;

        applyTransform(targetZoom, targetPanX, targetPanY);
      }
    } else if (e.touches.length === 1) {
      // Patch 1-finger movement coordinates for physics object dragging
      patchEventCoordinates(e);
    }
  }, { passive: false, capture: true });

  window.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
      touchState.isPinching = false;
    }
    if (e.touches.length === 1) {
      patchEventCoordinates(e);
    }
  }, { passive: true, capture: true });

  window.addEventListener('touchcancel', function() {
    touchState.isPinching = false;
  }, { passive: true });

  // --- MOUSE & TRACKPAD LISTENERS ---
  window.addEventListener('mousedown', function(e) {
    patchEventCoordinates(e);
  }, { capture: true });

  window.addEventListener('mousemove', function(e) {
    patchEventCoordinates(e);
  }, { capture: true });

  // Trackpad pinch (Ctrl + Wheel) or trackpad 2-finger pan when zoomed
  window.addEventListener('wheel', function(e) {
    // If target is inside a scrollable panel or slider, let default scroll happen
    if (e.target && e.target.closest && e.target.closest('.controls-panel, input[type=range]')) {
      return;
    }

    if (e.ctrlKey) {
      // Trackpad pinch-to-zoom
      e.preventDefault();
      var zoomDelta = -e.deltaY * 0.008;
      var targetZoom = currentZoom * (1 + zoomDelta);
      zoomAtPoint(targetZoom, e.clientX, e.clientY);
    } else if (e.shiftKey || (currentZoom > 1.05 && (Math.abs(e.deltaX) > 2 || Math.abs(e.deltaY) > 2))) {
      // 2-finger pan on trackpad when zoomed
      e.preventDefault();
      applyTransform(currentZoom, currentPanX - e.deltaX, currentPanY - e.deltaY);
    }
  }, { passive: false });

  // --- PARENT MESSAGES (from VisualSandbox React component) ---
  window.addEventListener('message', function(event) {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'VISU_RESET_TRANSFORM') {
      animateReset();
    } else if (event.data.type === 'VISU_STEP_ZOOM') {
      var delta = Number(event.data.delta) || 0.25;
      zoomAtCenter(delta);
    } else if (event.data.type === 'VISU_SET_ZOOM') {
      var targetZoom = Number(event.data.zoom) || 1.0;
      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      zoomAtPoint(targetZoom, cx, cy);
    }
  });

  // Initialize UI on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHud);
  } else {
    initHud();
  }

  // Expose transform state and utilities to simulation scripts
  window.__visuTransform = {
    getZoom: function() { return currentZoom; },
    getPan: function() { return { x: currentPanX, y: currentPanY }; },
    reset: animateReset,
    setZoom: function(z) { zoomAtCenter(z - currentZoom); }
  };
})();
</script>
`;
