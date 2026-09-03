/**
 * Vercel Speed Insights initialization for static HTML site
 * This script initializes Speed Insights tracking
 */
(function() {
  'use strict';
  
  // Initialize the Speed Insights queue
  if (!window.si) {
    window.si = function() {
      (window.siq = window.siq || []).push(arguments);
    };
  }
  
  // Configuration
  var config = {
    debug: false, // Set to true for development debugging
    // Add other config options as needed
  };
  
  // Inject the Speed Insights script
  function injectScript() {
    if (typeof document === 'undefined') return;
    
    var script = document.createElement('script');
    script.defer = true;
    
    // When deployed on Vercel, the script will be available at this path
    // In development, it uses the debug version
    var scriptSrc = '/_vercel/speed-insights/script.js';
    
    // Check if we're in development mode (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      scriptSrc = 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js';
      config.debug = true;
    }
    
    script.src = scriptSrc;
    
    // Set dataset attributes for configuration
    script.setAttribute('data-sdkn', '@vercel/speed-insights');
    script.setAttribute('data-sdkv', '2.0.0');
    
    if (config.debug) {
      script.setAttribute('data-debug', 'true');
    }
    
    // Insert script into the page
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
    
    // Set up beforeSend if configured
    if (config.beforeSend) {
      window.si('beforeSend', config.beforeSend);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
  } else {
    injectScript();
  }
})();
