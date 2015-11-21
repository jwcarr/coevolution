<?php

date_default_timezone_set('UTC');
$data_path = '../../../server_data/coevolution/';

if (isset($_REQUEST['download'])) {
  include "zip.php";
  $zip = new recurseZip();
  $filename = $zip->compress($data_path . $_REQUEST['download'], 'downloads/');
  header("Location: $filename");
}

$results = array();
if ($handle = opendir($data_path)) {
  while (false !== ($entry = readdir($handle))) {
    if (($entry != '.') && ($entry != '..')) {
      $last_modified = date("Y-m-d H:i", filemtime($data_path . $entry));
      $results[$last_modified] = $entry;
    }
  }
  closedir($handle);
  ksort($results);
}

?>
<!DOCTYPE HTML>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
<title>CoEvolution Results</title>
</head>
<body>
<table>
  <tr>
    <td></td>
    <td><strong>Time completed</strong></td>
    <td><strong>Session ID</strong></td>
  </tr>
<?php foreach ($results as $last_modified => $session_id) {
  echo '  <tr>
    <td><a href="index.php?download='. $session_id .'"><img src="download.png" height="16" width="16" /></a></td>
    <td>' . $last_modified . '</td>
    <td>' . $session_id . '</td>
  </tr>
';
} ?>
</table>
</body>
</html>