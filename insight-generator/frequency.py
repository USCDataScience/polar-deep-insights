import sys, json

# PATH    = sys.argv[1]
# OP_PATH = sys.argv[2]

# ENTITIES = [
#   "dates",
#   "entities",
#   "places",
#   "people",
#   "organizations",
#   "money",
#   "percentages",
#   "time",
#   "locations",
# ]

# def addTF(d, e):
#   cTotal = reduce(lambda s, c: s + c["count"], d[e], 0)
#   eTotal = len(d[e])
#   d[e] = map(lambda x: x.update({ 'tf' : float(x["count"]) / cTotal, 'tf-alpha' : float(1) / eTotal }) or x, d[e])
#   d[e + "-occuranceCount"] = cTotal
#   d[e + "-typeCount"]      = eTotal
#   return d

############# TF ##########################
# f = open(PATH, "r")
# op = open(OP_PATH, "w+")
# for line in f:
#   d = json.loads(line.strip('\n'))
#   d = reduce(lambda d, e: addTF(d,e), ENTITIES, d)
#   op.write(json.dumps(d))
#   op.write("\n")
# f.close()
# op.close()
# print "SUCCESSFULLY UPDAETD DOCS WITH TF"
############################################

############## IDF ##########################
# DS = reduce(lambda m, e: m.update({ e: { } }) or m, ENTITIES, { })
# f = open(PATH, "r")

# def updateList(D, d, e):
#   for ele in map(lambda x: x["name"], d[e]):
#     if ele not in D[e]:
#       D[e][ele] = 0

#     D[e][ele] = D[e][ele] + 1

#   return D

# for line in f:
#   d = json.loads(line.strip('\n'))
#   DS = reduce(lambda D,e: updateList(D, d, e), ENTITIES, DS)

# f.close()

# op = open(OP_PATH, "w+")
# op.write(json.dumps(DS))
# op.close()

