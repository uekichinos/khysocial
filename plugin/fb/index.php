<?php
$appid = $_POST['appid'];
$appsecret = $_POST['appsecret'];
$limit = $_POST['limit'];
$query = $_POST['query'];

$queries = explode(",", $query);
if(count($queries) == 1) {
	$queries[0] = $query;
}

$count = 0;
$records = array();
foreach ($queries as $key => $query) {
	$hashtag = $targetid = "";
	if(substr($query, 0, 5 ) === "page:") {
		$query = explode(" ", str_replace("page:", "", $query));

		if(count($query) > 1) $hashtag = $query[1];
		$targetid = $query[0];
	}

	if($targetid !== "") {
		$page_feed = "https://graph.facebook.com/".$targetid."/feed?access_token=".$appid."|".$appsecret."";
		$page_picture = "https://graph.facebook.com/".$targetid."/picture";
		$posts = json_decode(file_get_contents($page_feed, true));
		$picture = base64_encode(file_get_contents($page_picture));

		foreach ($posts->data as $key => $post) {
			if (isset($post->message)) {
				if($hashtag != "") {
					if (strpos($post->message, $hashtag) !== false) {
						$records[$count]['created_time'] = $post->created_time;
						$records[$count]['id'] = $post->id;
						$records[$count]['message'] = $post->message;
						$records[$count]['picture'] = $page_picture;
						$records[$count]['handler'] = $targetid;

						$count++;
						if($count == $limit) break;
					}
				}
				else {
					$records[$count]['created_time'] = $post->created_time;
					$records[$count]['id'] = $post->id;
					$records[$count]['message'] = $post->message;
					$records[$count]['picture'] = $page_picture;
					$records[$count]['handler'] = $targetid;

					$count++;
					if($count == $limit) break;
				}
			}
		}
	}
}
echo json_encode($records);
?>