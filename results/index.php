<?php

date_default_timezone_set('UTC');
$data_path = '../../../server_data/coevolution/';
$temp_path = 'downloads/';

if (isset($_REQUEST['download'])) {
  include "zip.php";
  $zip = new recurseZip();
  $filename = $zip->compress($data_path . $_REQUEST['download'], $temp_path);
  header("Location: $filename");
}

$results = array();
if ($handle = opendir($data_path)) {
  while (false !== ($entry = readdir($handle))) {
    if (($entry != '.') && ($entry != '..')) {
      $last_modified = filemtime($data_path . $entry);
      $results[$last_modified] = $entry;
    }
  }
  closedir($handle);
  krsort($results);
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
    <td style="padding:10px;"><strong>Time completed</strong></td>
    <td style="padding:10px;"><strong>Session ID</strong></td>
  </tr>
<?php foreach ($results as $last_modified => $session_id) {
  if ($session_id[0] !== '.') {
    echo '  <tr>
      <td style="padding:10px;"><a href="index.php?download='. $session_id .'"><img src="download.png" height="16" width="16" /></a></td>
      <td style="padding:10px;">' . date("d M Y H:i", $last_modified) . '</td>
      <td style="padding:10px;">' . $session_id . '</td>
    </tr>
  ';
  }
} ?>
</table>
</body>
</html>