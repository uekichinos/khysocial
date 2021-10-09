<?php
require "../../vendor/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

$config = parse_ini_file("../../config.ini");

$consumerkey = $config['consumer_key'];
$consumersecret = $config['consumer_secret'];
$accesstoken = $config['access_token'];
$accesstokensecret = $config['access_token_secret'];

if (empty($consumerkey)) {
	echo "missing consumer key";
	exit;
}
if (empty($consumersecret)) {
	echo "missing consumer secret";
	exit;
}
if (empty($accesstoken)) {
	echo "access token";
	exit;
}
if (empty($accesstokensecret)) {
	echo "access token secret";
	exit;
}

$limit = $_POST['limit'];
$qtype = $_POST['qtype'];
$qstr = $_POST['qstr'];

$connection = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

if ($qtype == "hashtag") {
	$content = $connection->get("search/tweets", array("q" => $qstr, "count" => $limit, "exclude_replies" => true));
} else if ($qtype == "handler") {
	$handlers = explode(",", $qstr);
	foreach ($handlers as $key => $handler) {
		$content[] = $connection->get("statuses/user_timeline", array("screen_name" => $handler, "count" => $limit));
	}
}

echo json_encode($content);
