kill -9 `ps -fe|grep bpinfo|grep -v grep|awk '{print $2}'`
