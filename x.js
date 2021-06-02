const http = require("http");
const fs = require("fs");

const port = 9900;

function docu(word){
    return '<iframe id="bing" src="https://cn.bing.com/dict/search?q='+word+'></iframe>'
  }

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const data = JSON.parse(fs.readFileSync('notedata.txt', 'utf8'))

  word = req.url.replace(/\/(\w+)/, '$1')
  console.log(req.url.replace(/\/(\w+)/, '$1'))
  if(word=='list'){
    list=JSON.stringify(data)
    res.write(list)
  }

  
  css='<style>html,body{margin:0}iframe{width:100%;height:100%;border:none}</style>'
  if (data[word] != undefined) {
    data[word] = data[word] + 1
    res.write(css+'<iframe id="bing" src="https://cn.bing.com/dict/search?q='+word+'"></iframe>')
  } else {
    data[word] = 1
    res.write(css+'<iframe id="bing" src="https://cn.bing.com/dict/search?q='+word+'"></iframe>')
  }
  delete data['favicon.ico']
  delete data['list']
  list=[]
  ndata={}
  for(i in data){
    list[list.length]=i
  }
  list.sort((a,b)=>data[a]-data[b])
  for(i in list){
    ndata[list[i]]=data[list[i]]
  }
  file = JSON.stringify(ndata)

  fs.writeFile('notedata.txt', file, err => {
    if (err) {
      console.error(err)
      return
    }
  })
  res.end('');
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Server is running on http://127.0.0.1:${port}/`);
});