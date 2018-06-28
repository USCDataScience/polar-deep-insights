import sys, re, nltk, os, json, requests, urllib, urllib2, traceback


PATH          = sys.argv[1]
OUTPUT_PATH   = sys.argv[2]

for l in open(PATH):
	l = l[l.index('"docs":['):]
	l1 = l.replace('"docs":[','').replace('},','}\n').replace('}]}}','}').replace('""','"no data"')
	f = open(OUTPUT_PATH, "w")
	f.write(l1)
f.close()