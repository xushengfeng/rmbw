# -*- coding: UTF-8 -*-
import os
import json

filelist=os.listdir('json/')
filelist.sort()
for item in filelist:
    print(item)


newfile=open('map.js','w')
c={}
w2i=json.load(open('word2id.json'))
for item in filelist:
    name=item[3:]
    if(item[-3:]!='txt'):
        c[name]=[]
        list=json.load(open('json/'+item))
        for i in list:
            c[name].append(i['topic_id'])
    else:
        c[name[:-4]]=[]
        list=open('json/'+item).read()
        list=list.split('\n')
        for i in list:
            if(i in w2i):
                c[name[:-4]].append(w2i[i])
    
newfile.write('map='+json.dumps(c)+';')


newfile.close()