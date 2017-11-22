# KhySocial

KhySocial is jquery plugin to get social media content from Twitter and Facebook.

## Plugin Parameters

- **fontsize** - set font size of content. default 14 pixel
- **boxwidth** - set width for content boxes and value can be either pixel or percentage. default 200
- **debug** - enable debug mode for troubleshooting. default false
- **imgthumb** - align image thumb left or right. default left

### Twitter

- **query** - string use to get tweets. sample for usage as below

A) get tweet from single handler

    query: "@uekichinos"

B) get tweet from multiple handler

    query: "@uekichinos,@bursamktplc,@LisaSurihani"

C) get tweet from single handler and filter tweet based on hashtag

    query: "#informedinvestor from:bursamktplc"

- **limit** - limit tweet return for each handlers. default 5
- **key** - twitter consumer key
- **secretkey** - twitter consumer secret
- **token** - twitter access token
- **secrettoken** - twitter access token secret

### Facebook

- **query** - string use to get post. sample for usage as below

A) get post from single page

    query: "page:BursaMarketplace"

B) get post from multiple pages

    query: "page:BursaMarketplace,page:manchesterunited"

C) get post tweet from single page and filter post based on hashtag

    query: "page:BursaMarketplace #informedinvestor"

D) get post tweet from multiple pages and filter post based on hashtag

    query: "page:BursaMarketplace #informedinvestor,page:manchesterunited #Pogback"

- **limit** - limit post return for each pages. default 5
- **appid** - facebook application id
- **appsecret** - facebook application secret

## Change Log

### [1.3.2] - 2017-11-23
- add in parameter 'imgthumb'
- simplify twitter data process

### [1.3.1] - 2017-11-22
- update readme

### [1.3.0] - 2017-11-21
- include social media Facebook
- add in choice of query for Twitter and Facebook