var fs = require('fs')

// a=[]
// for(i=1;i<=9;i++){
//   fs.readFile('dict'+i+'.json','utf8',function (err, data) {
//     if(err) console.log(err);
//     fs.appendFile('data.js',data,'utf8',function (err) {
//       if(err) console.log(err);
//     })
//     });
// }

list = ''
o = {}
map = {
  "CET-4精选": "5",
  "剑桥PET": "407",
  "必修一": "414",
  "必修二": "415",
  "必修三": "416"
}
for (key in map) {
  list = ''
  fs.readFileSync('map_' + map[key] + '.json', 'utf8', function (err, data) {
    // list = JSON.parse(data)
    // map[key]=list
    // list=JSON.stringify(list)
    fs.appendFileSync('map.json', data, function (err) {
      if (err) console.log(err);
    })
  })


}