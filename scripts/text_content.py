import sys
import matplotlib.pyplot as plt
from os import listdir
from os.path import join
from scipy import spatial

PATH = sys.argv[1]

def read(file):
  f = open(file, "r")
  signature = map(float, f.readline().strip("\n").split(","))
  f.close()
  return signature

def normalize(ls):
  mx = max(ls)
  mx = ( 1 if mx == 0 else mx )
  return map(lambda e: float(e)/mx, ls)

def cosine_similarity(a,b):
  return(1 - spatial.distance.cosine(a,b))

def print_similarity(type, sim):
  print "{0}\t{1}".format(sim, type)


refrence = read("results/text-file-signature-reference")
signature_similarity = [ ]
strict_signature_similarity = [ ]

for f in listdir(PATH):
  sig = read(join(PATH, f))
  sim = cosine_similarity(refrence, sig)
  signature_similarity.append(sim)
  print_similarity(f, sim)

for f in listdir(PATH):
  sig = read(join(PATH, f))
  r2 = refrence[97:123]
  c2 = sig[97:123]
  sim2 = cosine_similarity(r2, c2)
  strict_signature_similarity.append(sim2)
  print_similarity(f, sim2)

fig = plt.figure(1)
fig.suptitle("Histogram of Cosine similarity", fontsize=14, fontweight='bold')
plt.hist(signature_similarity, bins=10)

fig = plt.figure(2)
fig.suptitle("Histogram of Cosine similarity [ Ascii Ranges ]", fontsize=14, fontweight='bold')
plt.hist(strict_signature_similarity, bins=10)

plt.show()
