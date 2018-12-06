kill -9 `ps -fe|grep bpinfo|grep -v grep|awk '{print $2}'`
nohup node index.js >> /dev/null 2>&1 &
