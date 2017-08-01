export default {
  order_tray : {
    name : 'direct-from-showtime',
    providers :[{
      "groupId":555555,
      "groupName":"The SHOWTIME App",
      "id":555555,
      "name":"The SHOWTIME App",
      "headline" : "Choose a way to sign up:",
      "logo" : "showtime-direct.png",
      "priceCallout" : `
        $10.99<em>per month</em><br />
        <b>after free trial</b>`,
      "devicesBlurbHeadline" : "Watch seamlessly on all your favorite devices no matter where you subscribe",
      "devicesBlurb" :`
        Choose how you want to watch!  sign-up through the SHOWTIME app on your preferred device you can download the app on other connected TVs, tablets and mobile devices – or go to Showtime.com on your computer – and stream SHOWTIME at NO ADDITIONAL COST.`,
      "hasDevicesList" : true,
      "order":0
    },{
      "id" : 100,
      "groupId" : 100,
      "groupName" : "Amazon Channels",
      "name" : "Amazon Channels",
      "headline": "Prime members can subscribe to SHOWTIME directly on the Amazon Video app with Amazon Channels",
      "description" : "Amazon Prime is needed to get SHOWTIME. Go to the Amazon Video app on your favorite device and add SHOWTIME with Amazon Channels. Find it under the Channels category. You can also sign up on the Amazon website.",
      "logo" : "amazon-channels.png",
      "providerLeadUrl": "https://www.amazon.com/b/ref=dvm_us_hl_pm_shositelink?_encoding=UTF8&benefitId=showtimeSub&node=2858778011",
      "providerLeadText": "Go to Amazon",
      "freeTrial" : "7-Day Free Trial*",
      "priceCallout" : `
        $8.99<em>per month</em><br />
        <b>add on with<br /> Prime membership</b>`,
      "devicesBlurbHeadline" : "Watch on your favorite device",
  		"devicesBlurb" :`
  		  Once you sign up, you can stream SHOWTIME through Amazon Prime on your TV, tablet, phone, and computer.`,
      "hasDevicesList" : false,
  		"order" : 1
    },{
      "id" : 95,
      "groupId" : 95,
      "name" : "Hulu",
      "groupName" : "Hulu",
      "headline" : "Add SHOWTIME to your Hulu subscription",
      "description": "Get SHOWTIME as a Premium Add-on with your Hulu subscription. New Hulu subscribers can add SHOWTIME when you sign-up online or through the Hulu app on select devices. Current Hulu subscribers can add SHOWTIME through your account settings by selecting \"Manage Premium Add-ons\" on select devices. Click here to learn how to add SHOWTIME to your Hulu subscription.",
      "logo" : "hulu.png",
      "providerLeadUrl" : "http://hulu.com/start/showtime?cmp=8062&utm_campaign=Evergreen+Leads+Tracking&utm_source=SHO.com&utm_medium=AFF",
      "providerLeadText" : "Go to Hulu",
      "freeTrial" : "30-Day SHOWTIME Free Trial for Hulu Subscribers*",
      "devicesBlurbHeadline" : "Watch on your favorite device",
  		"devicesBlurb" :`
  		  Once you sign up, you can stream SHOWTIME through Hulu on your TV, tablet, phone, and computer.`,
      "priceCallout" : `
        $8.99<em>per month</em><br />
        <b>add on with<br /> Hulu subscription</b>`,
      "hasDevicesList" : false,
  		"order" : 2
    }, {
      "id" : 94,
      "groupId" : 94,
      "name" : "PlayStation Vue",
      "groupName" : "PlayStation Vue",
      "headline" : "Subscribe to SHOWTIME directly through PlayStation™Vue",
      "description": "Download the PlayStation™Vue app from the PlayStation®Store on your PS4™ or PS3™ console or on the web. Add SHOWTIME to your Vue channel line-up or as a standalone channel.",
      "logo" : "playstation-vue.png",
      "providerLeadUrl":"https://www.playstation.com/en-us/network/vue/showtime/#1", 
      "providerLeadText": "Go to Playstation™Vue",
      "freeTrial" : "30-Day Free Trial*",
      // note: playstation is currently only instance of provider with `short` devicesBlurb headline and `custom/long` devicesBlurb text.. hoping that was an oversight
      "devicesBlurbHeadline" : "Watch on your favorite device",
  		"devicesBlurb" : `
        Once you sign up, you can stream SHOWTIME through PlayStation™Vue on your PS4™ or PS3™ or through the PlayStation™Vue app on Android TV, AppleTV, Fire TV, Roku, iOS and Android Tablets, or on iOS and Android phones. You can also log in through the Showtime Anytime app or on your computer at ShowtimeAnytime.com.`,
      "priceCallout" : [`
        $10.99<em>per month</em><br />
        <b>after free trial</b>
      `,` 
        $8.99<em>per month</em><br />
        <b>for PlayStation®Plus members</b>`],
      "priceCalloutMultiplePrices" : true,
      "hasDevicesList" : false,
  		"order" : 3
    }, {
      "id" : 112,
      "groupId" : 112,
      "name" : "Sling",
      "groupName" : "Sling",
      "headline" : "Add SHOWTIME to your Sling TV subscription",
      "description" : "Get eight SHOWTIME channels for just $10/mo with any Sling TV subscription when you sign up at sling.com/showtime or through the Sling TV app. Restrictions apply.",
      "logo" : "sling.png",
      "providerLeadUrl" : "http://www.sling.com/showtime?cvosrc=indirect.affiliate.showtime&utm_medium=indirect&utm_source=online&utm_campaign=showtime&affiliate=showtime",
      "providerLeadText" : "Go to Sling",
      "freeTrial" : "7-DAY SHOWTIME FREE TRIAL FOR NEW SLING SUBSCRIBERS*",
      "devicesBlurbHeadline" : "Watch on your favorite device",
  		"devicesBlurb" :`
  		  Once you sign up, you can stream SHOWTIME through Sling on your TV, tablet, phone, and computer.`,
      "priceCallout" : `
        $10<em>per month</em><br />
        <b>add on with Sling TV subscription</b>`,
      "hasDevicesList" : false,
  		"order" : 4
    },{
      "id": 110,
      "groupId": 110,
      "name": "YouTube TV",
      "groupName": "YouTube TV",
      "headline": "Add SHOWTIME to your YouTube TV membership",
      "description": "Watch and record live and on-demand SHOWTIME by adding it to your YouTube TV membership. New YouTube TV members can add SHOWTIME when first signing up on a desktop computer. Current YouTube TV members can add SHOWTIME in the \"Membership\" section of account settings on supported devices. Get help adding SHOWTIME to your YouTube TV membership.",
      "logo":"youtube-tv.png",
      "providerLeadUrl" : "https://tv.youtube.com/?utm_source=sho&utm_medium=order&utm_campaign=sho_0317",
      "providerLeadText" : "Go to YouTube TV",
      "freeTrial": "1-MONTH FREE TRIAL FOR YOUTUBE TV MEMBERS*",
      "devicesBlurbHeadline" : "Watch on your favorite device",
  		"devicesBlurb" :`
  		  Once you sign up, you can stream SHOWTIME through YouTube TV on your TV, tablet, phone, and computer.`,
      "priceCallout" : `
        $11<em>per month</em><br />
        <b>after free trial</b>`,
      "hasDevicesList" : false,
  		"order": 5
    },{
      "id" : 0,
      "groupId" : 0,
      "name" : "TV Provider",
      "groupName" : "TV Provider",
      "headline" : "Add SHOWTIME to your pay TV subscription",
      "logo" : "tv-provider.png",
      "freeTrial" : "Prices Vary",
      "isTVProvider" : true,
      "hasDevicesList" : false,
  		"order" : 6,
    }]
  }
}
