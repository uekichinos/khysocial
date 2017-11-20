# KhySocial

KhySocial is jquery plugin to get social media content. Currently we support Twitter and Facebook.

----
## Twitter
1. Using TwitterOAuth for Twitter engine
2. Sample query as below

**get tweet from single handler**

    query: "@uekichinos"

**get tweet from multiple handler**

    query: "@uekichinos,@bursamktplc,@LisaSurihani"

**get tweet from single handler and filter tweet based on hashtag**

    query: "#informedinvestor from:bursamktplc"

## Facebook
1. Using graph.facebook.com

**get post from single page**

    query: "page:BursaMarketplace"

**get post from multiple pages**

    query: "page:BursaMarketplace,page:manchesterunited"

**get post tweet from single page and filter post based on hashtag**

    query: "page:BursaMarketplace #informedinvestor"

**get post tweet from multiple pages and filter post based on hashtag**

    query: "page:BursaMarketplace #informedinvestor,page:manchesterunited #Pogback"

## Change Log
### [1.3.0] - 2017-11-21
- include social media Facebook
- add in choice of query for Twitter and Facebook