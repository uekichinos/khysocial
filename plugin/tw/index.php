<?php
session_start();
require_once("twitteroauth/autoload.php");
use Abraham\TwitterOAuth\TwitterOAuth;

$consumerkey = $_POST['key'];
$consumersecret = $_POST['secretkey'];
$accesstoken = $_POST['token'];
$accesstokensecret = $_POST['secrettoken'];
$limit = $_POST['limit'];
$qtype = $_POST['qtype'];
$qstr = $_POST['qstr'];

$connection = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
if($qtype == "hashtag") {
	$content = $connection->get("search/tweets", array("q" => $qstr, "count" => $limit, "exclude_replies" => true));
}
if($qtype == "handler") {
	$handlers = explode(",", $qstr);
	foreach($handlers as $key => $handler) {
		$content[] = $connection->get("statuses/user_timeline", array("screen_name" => $handler, "count" => $limit));
	}
}

echo json_encode($content);
?>