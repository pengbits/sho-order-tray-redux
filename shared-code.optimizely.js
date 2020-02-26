// this code intended to provide support for metrics in other experiments that target the order tray
window.optimizely = window.optimizely || [];

// track in optimizely and log to console
var trackOptimizelyEvent = (function(e){
  console.log('|optimizely| trackEvent:' + e);
  window.optimizely.push(["trackEvent" , e]);
});

// Provider clicks in sidebar
$(document).delegate('.order-picker .order-picker__provider .input--faux-radio', 'click', function(e){
  var id = $(e.currentTarget).data('provider-id');
  trackOptimizelyEvent('order-tray-provider-pick');
  trackOptimizelyEvent('order-tray-provider-pick-'+id);
});


// Featured Provider Lead Event aka tv provider logo
$(document).delegate('.order-card__partner-logo','click', function(e){
  trackOptimizelyEvent('order-tray-provider-lead-featured');
});

// All Providers List Lead Event
$(document).delegate('.partner-list__link','click', function(e){
  trackOptimizelyEvent('order-tray-provider-lead-alpha');
});


$(document).delegate('.order-card__big-button','click', function(e){
  var btn   = $(e.currentTarget);
  var card  = btn.parents('.order-card');
  var id    = card.data('provider-id');
  
  // Provider Lead Event
  trackOptimizelyEvent('order-tray-provider-lead');
  trackOptimizelyEvent('order-tray-provider-lead-'+id);
  
  // Provider Lead w/ Learn More SITE-15356
  if(card.find('.order-card__details-toggle--active').length){
    trackOptimizelyEvent('order-tray-learn-more');
    trackOptimizelyEvent('order-tray-learn-more-'+ id);
  }
});