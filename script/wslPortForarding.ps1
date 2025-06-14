# ref. https://kim519620.tistory.com/entry/WSL-%ED%8F%AC%ED%8A%B8-%ED%8F%AC%EC%9B%8C%EB%94%A9-feat-port-forwarding-TCP%EB%A7%8C-%EC%A7%80%EC%9B%90%ED%95%A8
$remote_ip = bash.exe -c "ifconfig eth0 | grep 'inet '"

$found = $remote_ip -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

if( $found )
{
  $remote_ip = $matches[0];
  echo "remote ip is $remote_ip";
} else{
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

$ports=@(5173);
$addr='0.0.0.0';

Invoke-Expression "netsh interface portproxy reset";

for( $i = 0; $i -lt $ports.length; $i++ )
{
  $port = $ports[$i];
  echo "delete forwarded port"
  Invoke-Expression "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr";
  echo "connect $addr : $port to $remote_ip : $port"
  Invoke-Expression "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$remote_ip";
}