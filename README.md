# TUS.Social

TUS.Social is jquery plugin to get social media content from Twitter.
[coffee for me?](https://www.buymeacoffee.com/uekichinos)

## Plugin Parameters

1. **fontsize** - set font size of content. default 14 pixel.
2. **boxwidth** - set width for content boxes and value can be either pixel or percentage. default 200.
3. **debug** - enable debug mode for console.log troubleshooting. default false.
4. **imgthumb** - align image thumb left or right. default left.

## Twitter Parameters

1. **query** - string use to get tweets. sample for usage as below

	A) get tweet from single handler

		query: "@uekichinos"

	B) get tweet from multiple handler

	    query: "@uekichinos,@bursamktplc"

	C) get tweet from single handler and filter tweet based on hashtag

	    query: "#informedinvestor from:bursamktplc"

2. **limit** - limit tweet return for each handlers. default 5

## Sample Code

Below sample code to get twitter **#hsn2021** with limit latest 15 post.
```
$('#content').tussocial({
	fontsize:  12,
	boxwidth:  "300",
	debug:  false,
	imgthumb:  'left',
	social:  {
		twitter:  {
			query:  "#hsn2021",
			limit:  15,
		},
	}
});
```

## Configuration

Create file **config.ini** at root folder and insert below line.

```
[twitter]
consumer_key = 
consumer_secret = 
access_token = 
access_token_secret = 
```

Provide require information as below. 
1. **consumer_key** - twitter API key
2. **consumer_secret** - twitter API secret key
3. **access_token** - twitter access token
4. **access_token_secret** - twitter access token secret
