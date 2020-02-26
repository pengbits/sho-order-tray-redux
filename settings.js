import EasePack from  'gsap';
const fx = 1; // slow everything down while debugging
let Settings = {};
Settings.ease                     = Power2.easeInOut;
// Settings.fade_up_delay         = 0.125 * fx;
// Settings.fade_down_delay       = Settings.fade_up_delay;
// Settings.focus_duration        = 0.25  * fx;
Settings.legal_fade_up_duration   = 0.5   * fx;
Settings.legal_fade_down_duration = 0     * fx;
Settings.legal_delay              = 0.45  * fx;
Settings.wipe_open_delay          = 0     * fx;
Settings.wipe_closed_delay        = 0.25  * fx;
Settings.expand_collapse_duration = 0.25  * fx;
// Settings.scroll_content_duration= 0.25 * fx;
// Settings.card_padding          = 20    ;
Settings.card_hidden_scale        = 0.85  ;
Settings.shim_animation_duration  = 0.5   * fx;
Settings.card_fade_up_duration    = 0.5   * fx;
Settings.card_fade_down_duration  = 0.25  * fx;
Settings.card_margin_top          = 15    ;
Settings.sidebar_percent_of_stage = 0.25  * fx;
// Settings.card_padding             = 40;
// 
Settings.lock_duration            = 0.75
export default Settings;