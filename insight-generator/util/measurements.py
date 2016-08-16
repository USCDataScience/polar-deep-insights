# coding: utf-8

import chardet
import networkx as nx
import os
import csv
from pycorenlp import StanfordCoreNLP
import matplotlib.pyplot as plt
import pylab
import subprocess
import re
import operator
import tika
from tika import parser
from tika import detector
import nltk.data
import unicodedata

tika.initVM()

"""
REFACTOR NOTES
----------------
add stats for number types
add name for types (not just 1.1.2 -> describe it)
make backup parse optional
don't think I ever have to pass stats
stats.evaluate is now stats.log()
add stats.evaluate to number types
may not need Node class
break regex ifs into separate lines
write out as add-on to CoreNLP JSON output (just like "Tokens")
"""

"""
PARSE NOTES
----------------
Handle decimal ranges without space (NLP struggles to pick these up)
Pool together measurements from adjoining sentences into clusters
handle GAMMA = 1.0 +- .04
work off the = sign for type
label "betweens"
Handle exponenents (The annihilation cross section required to normalize the observed signal...
Tag parameter assignments
Make sure unit is not part of a "location" or "organization" NER
Add cousin for compounds -> "HyPlant has an ultra-high spectral resolution in the red and near-infrared spectral region (0.26 nm FWHM (Full Width at Half Maximum) in the 670780 nm spectral range)"
"The full spectral range would be 500 to 780 nm at high spectral resolution (up to 0.3 nm) in the regions of the uorescence peaks."

"""

"""
WORKFLOW NOTES
----------------
Better sentence splitter
Automatic sentence extraction
Try core nlp without backup (maybe filter non-sentences)
Ignore any sentence with more than 3 "CD" tokens in a row

"""

nlp = StanfordCoreNLP('http://localhost:9000')
# nlp2 = StanfordCoreNLP('http://localhost:9001')
# annotators = 'tokenize,pos,lemma,ner,parse,natlog'
# annotators = "annotators, tokenize, ssplit, parse, lemma, ner, dcoref"
# input_file = "training_sentences.csv"
# input_dir = "docs"

###################################
# Start CoreNLP server
###################################
# cd /users/hundman/src/stanford-corenlp-full-2015-12-09
# java -mx6g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer 9000
# java -mx6g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer --port 9001 -annotators "tokenize,ssplit,parse,lemma,ner,mention,dcoref"

class Stats:
    def __init__(self):
        self.pattern_cnts = {}
        self.pattern_cnts["type"] = {}
        self.pattern_cnts["number"] = {}
        self.total_sentences = 0
        self.total_measurements = 0
        self.types_found = []
        self.encoding_errors = []


    def evaluate(self, sentence, pattern="Unknown", prediction="None", prediction_type=None):
        # print str(prediction_type) + " pattern: " + pattern
        if pattern in self.pattern_cnts[prediction_type]:
            self.pattern_cnts[prediction_type][pattern] += 1
        else:
            self.pattern_cnts[prediction_type][pattern] = 1


    def print_summary(self):
        # All results (make function)
        print "Total Sentences Parsed: " + str(stats.total_sentences)
        print "Total Measurements Parsed: " + str(stats.total_measurements)
        print "Total types: "
        for key, value in stats.pattern_cnts["type"].iteritems():
            print "   " + key + ": " + str(value)

stats = Stats()

class Sentence:
    def __init__(self, text, unit, number, measurement_type, sentence_num):
        self.text = text
        # if line_num == 9 or line_num == 70 or line_num == 31 or line_num == 65 or line_num == 74:
        #     self.text = text[:-1] # Sentence 9 wouldn't parse correctly without removing the period
        self.unit = unit
        self.num = number
        self.measure_type = measurement_type
        self.sentence_num = sentence_num
        self.measure_tokens = []

    def clean(self):
        return self.text.replace("Fig.", "Fig").replace("Eq.", "Eq").replace("Ref.", "Ref")


class Node:
    def __init__(self, idx, word, pos):
        self.idx = idx
        self.word = word
        self.pos = pos


class Annotations:
    def __init__(self, tokens, dependencies):
        self.tokens = tokens
        self.deps = dependencies
        self.lookup = {}
        self.combined_nums = []
        self.matches = [] # holds format types, indices, and words for measurement numbers and units found in a sentence
        self.forbidden_units = ["trillion","billion","million", "thousand", "hundred", "fig"]

    def build_lookup(self):
        """ Lookup for a given word idx
        { <index> : {
                "word" : "",
                "pos" : "",
                ...
            }
        }
        """
        self.lookup[0] = {"pos" : "", "word": ""} #0 not included in tokens, but included in dependencies
        for f in self.tokens:
            self.lookup[f["index"]] = {}
            self.lookup[f["index"]]["word"] = f["word"]
            self.lookup[f["index"]]["pos"] = f["pos"]
            self.lookup[f["index"]]["start"] = f["characterOffsetBegin"]
            self.lookup[f["index"]]["end"] = f["characterOffsetEnd"]
            self.lookup[f["index"]]["ner"] = f["ner"]

    def check_for_verb(self):
        """
        Quality control for Tika output / sentence splitting.
        To help ensure that the returned sentence is actually a sentence, make sure it has a verb.
        """
        for x in self.tokens:
            if "VB" in x["pos"]:
                return True
        return False



    def check_for_NER_number(self, idx):
        """
        Leverages CoreNLP's NER to identify ranges of numbers that consist of more than one token.
        Implemented to help compensate for incorrect dependency parses.
        Those ranges that are not identified here are identified later using regex.
        Currently limited to ranges containing no spaces.

        idx : string
        """

        prior_token_num, match, match_end, match_begin = None, None, None, None


        for f in self.tokens:
            if f["ner"] == "NUMBER" and str(f["index"]) == idx and prior_token_num != None:

                # if a range has already been identified, skip
                if prior_token_num + f["word"] in self.combined_nums:
                    return "skip"
                if f["characterOffsetEnd"] == match_begin:
                    self.combined_nums.append(prior_token_num + f["word"])
                    return prior_token_num + f["word"]
            elif f["ner"] == "NUMBER" and match != None:
                if match + f["word"] in self.combined_nums:
                    return "skip"

                if f["characterOffsetBegin"] == match_end:
                    self.combined_nums.append(match + f["word"])
                    return match + f["word"]

            if f["ner"] == "NUMBER" and str(f["index"]) != idx:
                prior_token_num = f["word"]
            else:
                prior_token_num = None

            if f["ner"] == "NUMBER" and str(f["index"]) == idx and prior_token_num == None:
                match = f["word"]
                match_end = f["characterOffsetEnd"]
                match_begin = f["characterOffsetBegin"]
            else:
                match = None
        return None

    def non_range_conj_check(self, node_idx):
        """
        If two numbers have an "and" between them but are not a range (indicated by the word "between"),
        split them into two separate measurements with the same unit and type
        """
        if self.lookup[int(node_idx)+1]["word"] == "and" and self.lookup[int(node_idx)+2]["pos"] == "CD":
            return True
        else:
            return False

    def add_match(self, format, final_unit_idx, final_unit, final_num_idx, final_num):
        """
        Add measurement info to list for further processing.
        """

        self.matches.append({
            "format" : format,
            "unit_idx" : final_unit_idx,
            "unit" : final_unit,
            "num_idx" : final_num_idx,
            "num" : final_num
        })


    def check_compound_tokens(self, node, unit_idx):
        """
        If the dependency type coming from the number is not "nummod" and is "compound",
        determine what format the quantity takes and parse appropriately.

        """
        if re.match("[a-zA-Z]+", node.word) == None and re.match("\d-[a-zA-Z]", node.word) == None:
            if not self.lookup[int(unit_idx)]["word"] in self.forbidden_units:
                self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)



    def check_dobj_tokens(self, node, unit_idx):
        """
        If the dependency type coming from the number is not "nummod" or "compound" and it is "dobj",
        it is likely a "=" sign and indicates a value assigned to a param.

        """
        if re.match("[a-zA-Z]+", node.word) == None and re.match("\d-[a-zA-Z]", node.word) == None:
            if self.lookup[int(unit_idx)]["word"] == "=":
                unit_idx = str(int(unit_idx) - 1)
                self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)


    def check_nsubj_tokens(self, node, unit_idx):
        """
        If the dependency type coming from the number is not "nummod" or "compound" or "dobj" and it is "nsubj",
        process appropriately

        """
        if re.match("[a-zA-Z]+", node.word) == None and re.match("\d-[a-zA-Z]", node.word) == None:
            if "NN" in self.lookup[int(unit_idx)]["pos"]:
                self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)


    def check_conj_tokens(self, node, unit_idx):
        """
        If the dependency type coming from the number is not "nummod" or "compound" or "dobj" or "nsubj" and it is "conj",
        process appropriately

        """
        if re.match("[a-zA-Z]+", node.word) == None and re.match("\d-[a-zA-Z]", node.word) == None:
            if "NN" in self.lookup[int(unit_idx)]["pos"]:
                self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)


    def check_dep_tokens(self, node, unit_idx):
        """
        If the dependency type coming from the number is not "compound", "nummod", or "dobj" and it is "dep",
        determine what format the quantity takes and parse appropriately.

        """
        if re.match("[a-zA-Z]+", node.word) == None and re.match("\d-[a-zA-Z]", node.word) == None:
            if self.lookup[int(unit_idx)]["word"] == "=":
                unit_idx = str(int(unit_idx) - 1)
                self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)
            elif not self.lookup[int(unit_idx)]["word"] in self.forbidden_units:
                self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)
                if self.non_range_conj_check(node.idx) == True:
                    self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], str(int(node.idx) + 2), self.lookup[int(node.idx) + 2]["word"])




    def check_nummod_tokens(self, node, G, unit_idx, edge, num_idx):
        """
        If the dependency type coming from the number is "nummod", determine what format the quantity takes and parse appropriately.

        """

        def check_for_additional_nummod(unit_idx, G, edge):
            """
            If there is an additional number before unit, that is the number that goes with unit.
            Example: "five 90 meter pixel resolution TIR channels"
            """
            other_num_idx = -1
            for e in G.edges(data=True):
                if unit_idx in e and e[2]["dep"] == "nummod" and int(other_num_idx) < int(node.idx):
                    other_num_idx = e[0] if unit_idx == e[1] else e[1]
            return other_num_idx

        def check_for_decimal_issue(unit_idx, G, edge):
            """
            Cases such as "0.316-10.0 GeV" are not handled properly (split into two numbers - 0.316-10 and .0), providing fix here
            """
            if node.word[0] == ".":
                for e in G.edges(data=True):
                    if node.idx in e and e[2]["dep"] == "compound" and self.lookup[int(e[0])]["pos"] == "CD" and self.lookup[int(e[1])]["pos"] == "CD":
                        node.word = self.lookup[int(e[1])]["word"] + node.word if node.idx == e[0] else self.lookup[int(e[0])]["word"] + node.word


        def check_for_compounds(unit_idx, G, other_num_idx, num_idx):
            """
            If token connected to number has one or more "compound" dependencies that follow the number, the first of these compounds is the unit
            Example: ""
            """
            compounds = []
            for e in G.edges(data=True):
                if unit_idx in e and e[2]["dep"] == "compound" and not (e[0] == edge[0] and e[1] == edge[1]):
                    if (unit_idx == e[1] and int(e[0]) > int(num_idx)) or (unit_idx == e[0] and int(e[1]) > int(num_idx)):
                        # neighbors = G.neighbors(e[0]) if unit_idx == e[1] else G.neighbors(e[1])
                        # if len(neighbors) > 1 or len(self.lookup[int(neighbors[0])]["word"]) > 3: # try and make sure it is not a unit with length check
                        compounds.append(e[0]) if unit_idx == e[1] else compounds.append(e[1])
            return compounds

        ###########################
        # "90m"
        ###########################
        if re.match("([\+-]*\d+[a-zA-Z]\d*)", node.word) != None and not "-" in node.word:
            check_for_decimal_issue(unit_idx, G, edge)
            first_letter_idx = re.search("[a-zA-Z]+", node.word).start()
            self.add_match("attached", node.idx, node.word[first_letter_idx:], node.idx, node.word[:first_letter_idx-1])


        ###########################
        # "20 m"
        ###########################
        # ensure no letters or hyphens in the token
        elif re.search("[\+-]*[a-zA-Z]+", node.word) == None and re.search("\d-[a-zA-Z]", node.word) == None:
            check_for_decimal_issue(unit_idx, G, edge)
            other_num_idx = check_for_additional_nummod(unit_idx, G, edge)
            compounds = check_for_compounds(unit_idx, G, other_num_idx, num_idx)
            if len(compounds) > 0:
                if not self.lookup[int(min(compounds))]["word"].lower() in self.forbidden_units and int(min(compounds)) - 1 == int(node.idx):
                    self.add_match("space_between", min(compounds), self.lookup[int(min(compounds))]["word"], node.idx, node.word)
                else:
                    if not self.lookup[int(unit_idx)]["word"].lower() in self.forbidden_units:
                        self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)
            else:
                if not self.lookup[int(unit_idx)]["word"].lower() in self.forbidden_units:
                    self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)


        ###########################
        # "six"
        ###########################
        # ensure no letters and no digits
        elif re.match("[a-zA-Z]+", node.word) != None and re.match("\d", node.word) == None:
            other_num_idx = check_for_additional_nummod(unit_idx, G, edge)
            compounds = check_for_compounds(unit_idx, G, other_num_idx, num_idx)

            if node.word in ["trillion", "billion", "million", "thousand", "hundred"] and self.lookup[int(node.idx)-1]["pos"] == "CD":
                node.word = self.lookup[int(node.idx)-1]["word"] + " " + node.word

            if len(compounds) > 1:
                if not self.lookup[int(min(compounds))]["word"].lower() in self.forbidden_units and int(min(compounds)) - 1 == int(node.idx):
                    self.add_match("space_between", min(compounds), self.lookup[int(min(compounds))]["word"], node.idx, node.word)
                else:
                    if not self.lookup[int(unit_idx)]["word"].lower() in self.forbidden_units:
                        self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)
            else:
                self.add_match("space_between", unit_idx, self.lookup[int(unit_idx)]["word"], node.idx, node.word)



    def find_units_and_formats(self, G):
        """
        Appends measurement number and unit info to self.matches
        """

        for node in G.nodes(data=True):
            node = Node(node[0], node[1]["word"], node[1]["pos"])

            if node.pos == "CD" and self.lookup[int(node.idx)]["ner"] != "DATE" and node.word.count(".") < 2 and not "rd" in node.word and not "st" in node.word and not "th" in node.word: #not currently handling dates, check for too many periods
                # See if NER can help out
                NER_num_check = self.check_for_NER_number(node.idx)
                if NER_num_check == None:
                    pass
                elif NER_num_check == "skip":
                    continue
                else:
                    node.word = NER_num_check

                for edge in G.edges(data=True):
                    unit_idx = edge[0] if node.idx == edge[1] else edge[1]
                    if node.idx in edge and (edge[2]['dep'] == "nummod") and (int(node.idx) < int(unit_idx) or \
                    re.search("(=|>|<)",self.lookup[int(node.idx) - 1]["word"]) != None): # make sure unit is after number unless it is a comparison or assignment (=,<,>)
                        self.check_nummod_tokens(node, G, unit_idx, edge, node.idx)

                for edge in G.edges(data=True):
                    unit_idx = edge[0] if node.idx == edge[1] else edge[1]
                    if node.idx in edge and (edge[2]['dep'] == "compound") and not node.idx in [d["num_idx"] for d in self.matches]:
                        self.check_compound_tokens(node, unit_idx)

                for edge in G.edges(data=True):
                    unit_idx = edge[0] if node.idx == edge[1] else edge[1]
                    if node.idx in edge and (edge[2]['dep'] == "dobj") and not node.idx in [d["num_idx"] for d in self.matches]:
                        self.check_dobj_tokens(node, unit_idx)

                for edge in G.edges(data=True):
                    unit_idx = edge[0] if node.idx == edge[1] else edge[1]
                    if node.idx in edge and (edge[2]['dep'] == "nsubj") and not node.idx in [d["num_idx"] for d in self.matches]:
                        self.check_nsubj_tokens(node, unit_idx)

                for edge in G.edges(data=True):
                    unit_idx = edge[0] if node.idx == edge[1] else edge[1]
                    if node.idx in edge and (edge[2]['dep'] == "dep") and not node.idx in [d["num_idx"] for d in self.matches]:
                        self.check_dep_tokens(node, unit_idx)


            elif (node.pos == "JJ" or node.pos == "NN") and self.lookup[int(node.idx)]["ner"] != "DATE" and node.word.count(".") < 2:

                ###########################
                # 10-m-resolution
                ###########################
                if re.search("\d-[a-zA-Z]+-[a-zA-Z]+", node.word) != None:
                    hyphen_idx = re.search("\d-[a-zA-Z]", node.word).start() + 2
                    self.add_match("double_hyphenated", node.idx, node.word[hyphen_idx:node.word.find("-", hyphen_idx)], node.idx, node.word[:hyphen_idx])

                ###########################
                # 10-m
                ###########################
                elif re.search("\d-[a-zA-Z]+", node.word) != None:
                    hyphen_idx = re.search("-[a-zA-Z]", node.word).start() + 1
                    self.add_match("hyphenated", node.idx, node.word[hyphen_idx:], node.idx, node.word[:hyphen_idx])

                ###########################
                # 1km-resolution
                ###########################
                elif re.search("\d[a-zA-Z]+-[a-zA-Z]+", node.word) != None:
                    first_letter_idx = re.search("\d[a-zA-Z]+-[a-zA-Z]+", node.word).start() + 1
                    hyphen_idx = re.search("-[a-zA-Z]", node.word).start()
                    self.add_match("attached_and_hyphenated", node.idx, node.word[first_letter_idx:hyphen_idx], node.idx, node.word[:first_letter_idx])

                ###########################
                # 10-20 days
                ###########################
                elif self.lookup[int(node.idx)]["ner"] == "DURATION" and "-" in node.word:
                    hyphen_idx = re.search("-[a-zA-Z]", node.word).start() + 1
                    self.add_match("hyphenated", node.idx, node.word[hyphen_idx:], node.idx, node.word[:hyphen_idx])

                ###########################
                # 10-40
                ###########################
                elif re.search("\d+-\d+", node.word) != None:
                    for edge in G.edges(data=True):
                        unit_idx = edge[0] if node.idx == edge[1] else edge[1]
                        if node.idx in edge and (edge[2]['dep'] == "amod") and not node.idx in [d["num_idx"] for d in self.matches]:
                            self.check_nummod_tokens(node, G, unit_idx, edge, node.idx)

                ###########################
                # Years
                ###########################
#                elif node.pos == "NN" and self.lookup[int(node.idx)] == "YEAR":
#                   matches.append(["space_between", "", "year", node.idx, node.word[:first_letter_idx]])


    def check_output(self, sentence, stats):
        """
        Check to see if coreNLP was able to successfully create a parse tree.
        If the words (dependentGloss/governorGloss) are missing from the dependency objects, the parse was unsuccessful
        """
        for dep in self.deps:
            if not "dependentGloss" in dep or not "governorGloss" in dep:
                stats.parse_error(sentence)
                return False
        return True


class Dependency:
    def __init__(self, governor, governorGloss, dependent, dependentGloss, dep_type):
        self.gov = governorGloss
        self.gov_idx = governor
        self.dep = dependentGloss
        self.dep_idx = dependent
        self.dep_type = dep_type



def build_graph(annotated, show=False):
    """
    Load dependencies into graph using networkx lib. This is used to traverse dependencies for patterns used in parsing.
    One graph is created for each sentence.
    """
    G = nx.Graph()
    node_labels, edge_labels = {}, {}
    for idx, dep in enumerate(annotated.deps):
        dep = Dependency(dep["governor"], dep["governorGloss"], dep["dependent"], dep["dependentGloss"], dep["dep"])

        G.add_node(str(dep.gov_idx), word=dep.gov, pos=annotated.lookup[dep.gov_idx]["pos"])
        G.add_node(str(dep.dep_idx), word=dep.dep, pos=annotated.lookup[dep.dep_idx]["pos"])
        G.add_edge(str(dep.dep_idx), str(dep.gov_idx), dep=dep.dep_type)

        #labels
        node_labels[str(dep.gov_idx)] = dep.gov + " : " + annotated.lookup[dep.gov_idx]["pos"]
        node_labels[str(dep.dep_idx)] = dep.dep + " : " + annotated.lookup[dep.dep_idx]["pos"]
        edge_labels[(str(dep.dep_idx), str(dep.gov_idx))] = dep.dep_type

        # print G.nodes(data=True)

    if show == True:
        pos = nx.spring_layout(G)
        nx.draw_networkx(G,pos=pos, labels=node_labels, node_color="white", alpha=.5)
        nx.draw_networkx_edge_labels(G,pos=pos,edge_labels=edge_labels)
        plt.show()

    return G


def get_connected(edge, idx, annotated, sentence):
    """
    if an edge connects to "idx", return the index of the word at the other end of that edge
    """
    if edge[0] == idx and annotated.lookup[int(edge[1])]["word"] != sentence.num:
        return edge[1]
    elif edge[1] == idx and annotated.lookup[int(edge[0])]["word"] != sentence.num:
        return edge[0]
    else:
        return None



def evaluate_target_dep(dep_idx, edges, annotations, sentence):
        """
        After target word connected via "dep" dependency type is identified, parse it here.
        Right now it is naively return first "NN" found
        """
        # ToDo -> NOT HANDLING MORE THAN ONE 'NN' COMING FROM 'JJ' RIGHT NOW
        if "NN" in annotations.lookup[int(dep_idx)]["pos"]:
            return annotations.lookup[int(dep_idx)]["word"]
        if "JJ" in annotations.lookup[int(dep_idx)]["pos"] or "CD" in annotations.lookup[int(dep_idx)]["pos"]:
            for edge in edges:
                if "mod" in edge[2]['dep'] and dep_idx == edge[0]:
                    if "NN" in annotations.lookup[int(edge[1])]["pos"]:
                        return annotations.lookup[int(edge[1])]["word"]
                elif "mod" in edge[2]['dep'] and dep_idx == edge[1]:
                    if "NN" in annotations.lookup[int(edge[0])]["pos"]:
                        return annotations.lookup[int(edge[0])]["word"]



def space_between_patterns(G, sentence, annotated, unit_idx, num_idx):
    """
    Find the thing being quantified.
    Use for typical patterns when unit and number are separated by a single space (10 m)
    """


    #########################################
    # Subcases for various dependency types
    #########################################
    def nsubj_check(G, sentence, annotated, sibling_idx):
        """
        if the unit has an "nsubj" sibling node and that sibling:
            a. has an "nsubj" sibling
            b. is part of a conjunction
            c. has its own "nummod" sibling
        then the type is the cousin node connected by the "nsubj"

        Example: "Since the spatial resolution of VENuS is 10 m and Sentinel-2 is 10-20 m"
        """

        nummod, nsubj, conj = False, False, False
        p_type = None
        if sentence.unit == G.node[sibling_idx]['word']:
            for edge in G.edges(data=True):
                cousin_idx = get_connected(edge, sibling_idx, annotated, sentence)
                if edge[2]['dep'] == "nsubj" and cousin_idx and G.node[cousin_idx]['word'] != sentence.unit:
                    nsubj = True
                    p_type = G.node[cousin_idx]['word']
                if "conj" in edge[2]['dep'] and cousin_idx:
                    conj = True
                if edge[2]['dep'] == "nummod" and cousin_idx:
                    nummod = True
            if nummod == True and conj == True and nsubj == True:
                return p_type
            else:
                return None


    def conjunction_check(G, sentence, annotated, sibling_idx):
        """
        Add example and justification...
        """
        matches = []
        for edge in G.edges(data=True):
            cousin_idx = get_connected(edge, sibling_idx, annotated, sentence)
            if "conj" in edge[2]['dep'] and cousin_idx:
                if "NN" in annotated.lookup[int(cousin_idx)]['pos']:
                    matches.append(cousin_idx)

        if len(matches) == 1:
            p_type = G.node[matches[0]]['word']
            return p_type

        elif len(matches) > 1:
            for idx in matches:
                for edge in G.edges(data=True):
                    candidate_idx = get_connected(edge, idx, annotated, sentence)
                    if candidate_idx and edge[2]['dep'] == "nummod":
                        p_type = G.node[idx]['word']
                        return p_type
                    else:
                        raise ValueError("NEED TO HANDLE A CASE WITH MULTIPLE CONJUNCTIONS WITHOUT A NUMMOD")
                        return None
        else:
            return None


    def still_inside_parens(G, sentence, annotated, sibling_idx):
        """
        If the unit sibling, connected via "appos" dependency, is still within parenthesis, must go to cousin connected via "appos"
        Example: "high revisit capability (5 days with two satellites)" -> satellites is first "appos" connection, capability is second
        """
        parens = False
        for edge in G.edges(data=True):
            cousin_idx = get_connected(edge, sibling_idx, annotated, sentence)
            if cousin_idx != None and "LRB" in annotated.lookup[int(cousin_idx)]['pos']:
                parens = True

        if parens == True:
            for edge in G.edges(data=True):
                next_idx = get_connected(edge, sibling_idx, annotated, sentence)
                if ("dep" in edge[2]['dep'] or "nmod" in edge[2]['dep']) and next_idx:
                    return G.node[next_idx]['word']
        return None


    def proper_modifier_check(G, sentence, annotated, sibling_idx):
        """
        If there is a modifier of a proper noun, return that modifer and not the propoer noun
        Example: "The spatial resolution of Landsat 8 (30 m) does not support..."
        """
        for edge in G.edges(data=True):
            cousin_idx = get_connected(edge, sibling_idx, annotated, sentence)
            if "mod" in edge[2]['dep'] and cousin_idx:
                return G.node[cousin_idx]['word']
        return None



    def get_cousin(G, annotated, sentence, sibling_idx, dep_type_list, unit_idx=None, before_constraint=False):
        """
        Example: "...changes over nations and continents at spatial resolutions as fine as 10 m"
        """
        for dep_type in dep_type_list:
            for edge in G.edges(data=True):
                cousin_idx = get_connected(edge, sibling_idx, annotated, sentence)
                if cousin_idx and dep_type in edge[2]['dep'] and "NN" in annotated.lookup[int(cousin_idx)]['pos']:
                    if before_constraint == True and unit_idx != None and int(cousin_idx) < int(unit_idx):
                        return G.node[cousin_idx]['word']
                    elif before_constraint == False:
                        return G.node[cousin_idx]['word']
        return None


    ##############################################
    # Top-level cases for various dependency types
    ##############################################
    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotated, sentence)
        num_sibling_idx = get_connected(edge, num_idx, annotated, sentence)
        if sibling_idx:
            if G.node[sibling_idx]["word"] == "=":
                p_type = get_cousin(G, annotated, sentence, sibling_idx, ["nsubj"])
                stats.evaluate(sentence, "1.1.3", p_type, "type")
                return p_type


    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotated, sentence)
        num_sibling_idx = get_connected(edge, num_idx, annotated, sentence)
        if sibling_idx:

            if edge[2]['dep'] == "nsubj":

                #check an "nsubj" coming from the "nsubj"
                _check = nsubj_check(G, sentence, annotated, sibling_idx)
                if _check != None:
                    stats.evaluate(sentence, "1.1.1", _check, "type")
                    return _check

                if "NN" in G.node[sibling_idx]['pos']:
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "1.1.2", p_type, "type")
                    return p_type
                elif "VB" in G.node[sibling_idx]['pos']:
                    p_type = get_cousin(G, annotated, sentence, sibling_idx, ["dobj"])
                    if p_type != None:
                        stats.evaluate(sentence, "1.1.3", p_type, "type")
                        return p_type

    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotated, sentence)
        num_sibling_idx = get_connected(edge, num_idx, annotated, sentence)
        if sibling_idx:
            if edge[2]['dep'] == "nmod:of" and not "VB" in G.node[sibling_idx]["pos"]: #Might need to be more specific than != "VB"
                #check for "conj" phrases like in sentence 80
                conj_check = conjunction_check(G, sentence, annotated, sibling_idx)
                if conj_check != None:
                    stats.evaluate(sentence, "1.2.1", conj_check, "type")
                    return conj_check

                p_type = G.node[sibling_idx]['word']
                stats.evaluate(sentence, "1.2.2", p_type, "type")
                return p_type

    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotated, sentence)
        num_sibling_idx = get_connected(edge, num_idx, annotated, sentence)
        if sibling_idx:

            if edge[2]['dep'] == "nmod:within" and not "VB" in G.node[sibling_idx]["pos"]: #Might need to be more specific than != "VB"
                #check for "conj" phrases like in sentence 80
                conj_check = conjunction_check(G, sentence, annotated, sibling_idx)
                if conj_check != None:
                    stats.evaluate(sentence, "1.2.1", conj_check, "type")
                    return conj_check

                p_type = G.node[sibling_idx]['word']
                stats.evaluate(sentence, "1.2.2", p_type, "type")
                return p_type


    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotated, sentence)
        num_sibling_idx = get_connected(edge, num_idx, annotated, sentence)
        if sibling_idx:

            # eventually will be an indication of inexact value (about)
            if edge[2]['dep'] == "nmod:about":
                p_type = G.node[sibling_idx]['word']
                stats.evaluate(sentence, "1.3", p_type, "type")
                return p_type

            # inspired by sentence on line 9
            elif edge[2]['dep'] == "compound" and "NN" in G.node[sibling_idx]["pos"]:
                # print "sib" + sibling_idx
                # print num_idx
                if int(sibling_idx) + 1 == int(num_idx) or (int(sibling_idx) > int(num_idx) and int(sibling_idx) > int(unit_idx)): #guards against multiple compounds (want the last one)
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "1.4", p_type, "type")
                    return p_type

            # inspired by sentence on line 26
            elif edge[2]['dep'] == "nmod:npmod":
                p_type = evaluate_target_dep(sibling_idx, G.edges(data=True), annotated, stats)
                stats.evaluate(sentence, "1.6", p_type, "type")
                return p_type


            # inspired by sentence on line 31
            elif edge[2]['dep'] == "nmod:as":
                #check for "conj" phrases like in sentence 80
                p_type = G.node[sibling_idx]['word']
                stats.evaluate(sentence, "1.7", p_type, "type")
                return p_type

            elif edge[2]['dep'] == "appos":
                if G.node[sibling_idx]['word'][0].islower() and still_inside_parens(G ,sentence, annotated, sibling_idx) == None:
                    p_type = G.node[sibling_idx]['word']
                    if p_type != sentence.unit:
                        stats.evaluate(sentence, "1.7.1", p_type, "type")
                        return p_type
                # if appos is still inside parenthesis, need to go to cousin idx (sentence 14)
                elif still_inside_parens(G ,sentence, annotated, sibling_idx) != None:
                    outside_parens = still_inside_parens(G ,sentence, annotated, sibling_idx)
                    stats.evaluate(sentence, "1.7.2", outside_parens, "type")
                    return outside_parens

                elif proper_modifier_check(G, sentence, annotated, sibling_idx) != None:
                    prop_mod = proper_modifier_check(G, sentence, annotated, sibling_idx)
                    stats.evaluate(sentence, "1.7.3", prop_mod, "type")
                    return prop_mod

            # inspired by sentence on line 32
            elif edge[2]['dep'] == "amod":
                # TO-DO: Need to check if number is connected via compound
                if not "JJ" in G.node[sibling_idx]['pos'] and not "RRB" in G.node[sibling_idx]['pos'] and not "LRB" in G.node[sibling_idx]['pos']:
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "1.8", p_type, "type")
                    return p_type

            # temporal modifier - sentence 31
            elif edge[2]['dep'] == "nmod:tmod":
                if G.node[sibling_idx]['pos'] == "JJ":
                    p_type = get_cousin(G, annotated, sentence, sibling_idx, "acl")
                    if p_type != None:
                        stats.evaluate(sentence, "1.9.1", p_type, "type")
                        return p_type
                else:
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "1.9.2", p_type, "type")
                    return p_type

            elif edge[2]['dep'] == "nmod:for":
                if  "NN" in G.node[sibling_idx]['pos']:
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "1.9.2", p_type, "type")
                    return p_type

            elif edge[2]['dep'] == "dobj":
                if "VB" in G.node[sibling_idx]['pos']:
                    p_type = get_cousin(G, annotated, sentence, sibling_idx, ["acl", "nsubj"])
                    if p_type != None:
                        stats.evaluate(sentence, "1.10.1", p_type, "type")
                        return p_type

            # elif edge[2]['dep'] == "nmod:to":
            #     if "VB" in G.node[sibling_idx]['pos']:
            #         p_type = get_cousin(G, annotated, sentence, sibling_idx, ["acl", "nsubj"])
            #         if p_type != None:
            #             stats.evaluate(sentence, "1.10.1", p_type, "type")
            #             return p_type

            elif edge[2]['dep'] == "nmod:at":
                if "VB" in G.node[sibling_idx]['pos']:
                    p_type = get_cousin(G, annotated, sentence, sibling_idx, ["acl", "dep"])
                    if p_type != None:
                        stats.evaluate(sentence, "1.11.1", p_type, "type")
                        return p_type
                else:
                    p_type = evaluate_target_dep(sibling_idx, G.edges(data=True), annotated, stats)
                    stats.evaluate(sentence, "1.11.2", p_type, "type")
                    return p_type

            elif edge[2]['dep'] == "nmod:in":
                if "VB" in G.node[sibling_idx]['pos']:
                    p_type = get_cousin(G, annotated, sentence, sibling_idx, ["dobj"], unit_idx, before_constraint=True)
                    if p_type != None:
                        stats.evaluate(sentence, "1.11.1", p_type, "type")
                        return p_type
                # else:
                #     p_type = evaluate_target_dep(sibling_idx, G.edges(data=True), annotated, stats)
                #     stats.evaluate(sentence, "1.11.2", p_type, "type")
                #     return p_type

            # elif edge[2]['dep'] == "nmod:per":
            #     p_type = get_cousin(G, annotated, sentence, sibling_idx, ["nmod:of"])
            #     if p_type != None:
            #         stats.evaluate(sentence, "1.12", p_type, "type")
            #         return p_type

            elif edge[2]['dep'] == "nmod:between":
                if "NN" in G.node[sibling_idx]["pos"]:
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "1.13.1", p_type, "type")
                    return p_type
                elif "VB" in G.node[sibling_idx]["pos"]:
                    p_type = get_cousin(G, annotated, sentence, sibling_idx, ["dobj"])
                    if p_type != None:
                        stats.evaluate(sentence, "1.13.2", p_type, "type")
                        return p_type

            elif edge[2]['dep'] == "nummod" and G.node[sibling_idx]["word"] != G.node[unit_idx]["word"]:
                if "NN" in G.node[sibling_idx]["pos"]:
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "1.14", p_type, "type")
                    return p_type



        elif num_sibling_idx:
            if edge[2]['dep'] == "nmod:between":
                # 'FLORIS will measure the radiance between 500 and 780 nm with a bandwidth between 0.3 nm and 2 nm (depending on wavelength).'
                if "NN" in G.node[num_sibling_idx]["pos"]:
                    p_type = G.node[num_sibling_idx]['word']
                    stats.evaluate(sentence, "1.15.1", p_type, "type")
                    return p_type
                elif "VB" in G.node[num_sibling_idx]["pos"]:
                    p_type = get_cousin(G, annotated, sentence, num_sibling_idx, ["dobj"])
                    if p_type != None:
                        stats.evaluate(sentence, "1.15.2", p_type, "type")
                        return p_type


    return None



def uncertain_parse_patterns(G, sentence, annotations, stats, unit_idx):
    """
    If none of typical patterns exist for measurements with space between number and unit (10 m),
    the dependency type coming from the unit will be "dep", and a different set of patterns
    will be evaluated here.
    """

    def get_dep_nodes(edges, annotations, sibling_idx):
        """
        Find all of the unit's sibling nodes that are connected via a "dep" dependency type.
        """
        dep_nodes = []
        for edge in edges:
            if edge[2]["dep"] == "dep" and sibling_idx == edge[0]:
                dep_nodes.append(edge[0])
            elif edge[2]["dep"] == "dep" and sibling_idx == edge[1]:
                dep_nodes.append(edge[1])
        return dep_nodes


    def determine_target_dep(dep_indices, stats, annotations, edges):
        """
        If there are multiple words connected to the unit word via the "dep" dependency type,
        check and see if any words connected via "dep" dependency have been found already in patterns with more certainty.
        If not, choose the one with fewer edges coming from it.
        ToDo -> if multiple "dep" words have been found already, choose the most common
        """
        counts = {}
        for dep_idx in dep_indices:
            if annotations.lookup[int(dep_idx)]["word"] in stats.types_found:
                return dep_idx
            else:
                for edge in edges:
                    if dep_idx in edge[0] or dep_idx in edge[1]:
                        if dep_idx in counts:
                            counts[dep_idx] += 1
                        else:
                            counts[dep_idx] = 1
                return min(counts.iteritems(), key=operator.itemgetter(1))[0]


    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotations, sentence)

        if sibling_idx and edge[2]['dep'] == "dep":
            p_type = None
            dep_indices = get_dep_nodes(G.edges(data=True), annotations, sibling_idx)
            if len(dep_indices) == 1:
                p_type = evaluate_target_dep(dep_indices[0], G.edges(data=True), annotations, sentence)
                stats.evaluate(sentence, "1.5.1", p_type, "type")
                return p_type
            else:
                dep_idx = determine_target_dep(dep_indices, stats, annotations, G.edges(data=True))
                p_type = evaluate_target_dep(dep_idx, G.edges(data=True), annotations, sentence)
                stats.evaluate(sentence, "1.5.2", p_type, "type")
                return p_type


def hyphenated_patterns(G, sentence, annotated, stats, unit_idx):
    """
    Parse typical patterns when unit and number are attached with a hyphen (10-m)
    ToDo -> refine proper noun checking (use NER)
    """
    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotated, sentence)
        if sibling_idx:
            if edge[2]['dep'] == "amod":
                p_type = G.node[sibling_idx]['word']
                stats.evaluate(sentence, "2.1", p_type, "type")
                return p_type

            elif edge[2]['dep'] == "appos":
                if G.node[sibling_idx]['word'][0].islower(): #similar to "space between" number/measurement format, type shouldn't be propoer
                    p_type = G.node[sibling_idx]['word']
                    stats.evaluate(sentence, "2.2.1", p_type, "type")
                    return p_type
                else:
                    prop_mod = proper_modifier_check(G, sentence, annotated, sibling_idx)
                    if prop_mod != None:
                        stats.evaluate(sentence, "2.2.2", prop_mod, "type")
                        return prop_mod

            elif edge[2]['dep'] == "compound":
                p_type = G.node[sibling_idx]['word']
                stats.evaluate(sentence, "2.3", p_type, "type")
                return p_type

    stats.evaluate(sentence, "Hyphenated", "None", "type")
    return None



def attached_patterns(G, sentence, annotated, unit_idx):
    """
    parse typical patterns when unit and number are attached (10m)
    """
    for edge in G.edges(data=True):
        sibling_idx = get_connected(edge, unit_idx, annotated, sentence)
        if sibling_idx:
            if edge[2]['dep'] == "nummod":
                p_type = G.node[sibling_idx]['word']
                stats.evaluate(sentence, "2.1", p_type, "type")
                return p_type

    stats.evaluate(sentence, "Attached", "None", "type")
    return None



def find_range(sentence, match, annotations, range_words, leading):
    _range = None
    # num = "(\+|-)*\d+\.*\d*"
    num = "[+|-]*(\d{1,3}(,\d{3})*)(\.\d+)*(-(\d{1,3}(,\d{3})*)(\.\d+)*)*(\s+(trillion|billion|million|thousand|hundred))*"
    attached_first_num_unit = "([a-zA-Z]+)*\d*"
    detached_first_num_unit = "(\s[a-zA-Z]+)*\d*"

    # compounds connected by "to"
    attached = re.compile(leading + num + attached_first_num_unit + "\s+" + range_words + "\s+" + num + "[a-zA-Z]+\d*(\\[a-zA-Z]+\d*)*")
    attached_match_beg = re.compile(leading + num + attached_first_num_unit)
    attached_add_beg = re.compile(num + attached_first_num_unit + "\s+" + range_words + "\s+")
    attached_match_end = re.compile(range_words + "\s+" + num + "[a-zA-Z]+\d*")
    attached_add_end = re.compile("\s+" + range_words + "\s+" + num + "[a-zA-Z]+\d*")

    detached = re.compile(leading + num + detached_first_num_unit + "\s+" + range_words + "\s+" + num)
    detached_match_beg = re.compile(leading + num + detached_first_num_unit + "\s+" + range_words + "\s+")
    detached_add_beg = re.compile(num + detached_first_num_unit + "\s+" + range_words + "\s+")
    detached_match_end = re.compile(range_words + "\s+" + num)
    detached_add_end = re.compile("\s+" + range_words + "\s+" + num)

    # compounds connected by "and" (can't have two units listed, likely is two separate measurements not a range)

    def get_attached_unit(range_match):
        last_digit_idx = 0
        for i,c in enumerate(range_match.group(0)):
            if c.isdigit() and i != len(range_match.group(0)) - 1: # handle km2 (dont want 2 to be cutoff to find unit)
                last_digit_idx = i
        return range_match.group(0)[last_digit_idx+1:]

    def check_double_unit(match):
        """
        removes inside unit from range
        Example: "4 m to 10" becomes "4 to 10"
        """
        if match["num"].count(" ") > 2 and len(re.findall("(trillion|billion|million|thousand|hundred)", match["num"])) == 0:
            new, space_cnt, first_space = "", 0, False
            for i in match["num"]:
                if i == " ":
                    space_cnt += 1
                if i == " " and space_cnt == 1:
                    first_space = True
                else:
                    first_space = False
                if space_cnt == 1:
                    pass
                else:
                    new += i
            match["num"] = new

        return match

    # self.matches.append({
    #               "format" : format,
    #               "unit_idx" : final_unit_idx,
    #               "unit" : final_unit,
    #               "num_idx" : final_num_idx,
    #               "num" : final_num
    #             })

    if len(attached.findall(sentence)) > 0:
        for range_match in attached.finditer(sentence):
            if match["num"] in attached_match_end.search(range_match.group(0)).group(0) and annotations.lookup[int(match["num_idx"])]["start"] >= range_match.start() and annotations.lookup[int(match["num_idx"])]["end"] <= range_match.end():
                # match["num"] = str(re.search("(\+|-)*\d+\.*\d*(\s[a-zA-Z]+)*\s+(to)\s+", range_match.group(0)).group(0)) + match["num"]
                match["unit"] = get_attached_unit(range_match)
                match["num"] = range_match.group(0)[:-len(match["unit"])].strip()
                if match["num"][0] == "(":
                    match["num"] = match["num"][1:]
                _range = range_match.group(0)

            # elif match["num"] in attached_match_beg.search(range_match.group(0)).group(0) and annotations.lookup[int(match["num_idx"])]["start"] >= range_match.start() and annotations.lookup[int(match["num_idx"])]["end"] <= range_match.end():
            #     match["num"] = match["num"] + str(attached_add_beg.search(range_match.group(0)).group(0))
            #     last_digit_idx = 0
            #     for i,c in enumerate(range_match.group(0)):
            #         if c.isdigit() and i != len(range_match.group(0)) - 1: # handle km2 (dont want 2 to be cutoff to find unit)
            #             last_digit_idx = i
            #     match["unit"] = range_match.group(0)[last_digit_idx+1:]
            #     _range = range_match.group(0)

    elif len(detached.findall(sentence)) > 0:
        for range_match in detached.finditer(sentence):
            if match["num"] in detached_match_end.search(range_match.group(0)).group(0) and annotations.lookup[int(match["num_idx"])]["start"] >= range_match.start() and annotations.lookup[int(match["num_idx"])]["end"] <= range_match.end():
                match["num"] = str(detached_add_beg.search(range_match.group(0)).group(0)) + match["num"]
                if match["num"][0] == "(":
                    match["num"] = match["num"][1:]
                _range = range_match.group(0)
            # elif match["num"] in detached_match_beg.search(range_match.group(0)).group(0) and annotations.lookup[int(match["num_idx"])]["start"] >= range_match.start() and annotations.lookup[int(match["num_idx"])]["end"] <= range_match.end():
            #     match["num"] = match["num"] + str(detached_add_end.search(range_match.group(0)).group(0))
            #     _range = range_match.group(0)

    match = check_double_unit(match)
    return (match, _range)


def extract_measurements(content=None, input_dir=None, output_file="measurements_output", show_graph=False, encoding=None, verbose=False):

    def cleanup(content):
        # print str(chardet.detect(content))
        # if chardet.detect(content)['confidence'] > .9:
        if encoding != None:
            content = content.decode(encoding)
        else:
            test = content.decode(chardet.detect(content)["encoding"])
            try:
                nlp.annotate(test, properties={'outputFormat':'json', 'timeout':'5000'})
                content = test
            except:
                try:
                    content = content.decode("utf-8")
                except:
                    pass

        replacements = {
            8764 : "approximately ",
            181 : " MU",
            967 : " CHI",
            8221 : '"',
            8220 : '"',
            8771 : "=",
            8733 : " proportional to ",
            8801 : "=",
            8710 : " DELTA",
            8217 : "'",
            9702 : " degrees",
            947 : " GAMMA",
            945 : " APLHA",
            968 : " PSI",
            8730 : "square root of ",
            956 : " MU",
            2013 : "-",
            8722 : "-",
            226 : "-",
            8211 : "-",
            8727 : "",
            215 : " by ",
            963 : " SIGMA",
            961 : " RHO",
            175 : "REPEATING",
            233 : "e",
            177 : "+-",
            772 : "REPEATING",
            964 :"TAU"
        }

        cleaned = ""
        for x in content:
            # print x + " " + str(ord(x))
            if ord(x) in replacements:
                cleaned += replacements[ord(x)]
            else:
                cleaned += x
        return re.sub("\[\d+(\,\s*\d+)*(-\d+)*\]","",cleaned.replace("-\n","").replace("\n"," ").replace("Fig.", "Fig")\
        .replace("Eq.", "Eq").replace("Ref.", "Ref").replace("MUm", "micron").replace(" ' ", " ").replace("  "," ")\
            .replace("| ", " ").replace(" |", " ABS").replace("(|", "(ABS"))


    def remove_trailing_punct(match):
        """
        ToDo -> fix this where it occurs
        """
        if match["num"][-1:] == "-":
            match["num"] = match["num"][:-1]
        if match["unit"][-1:] == ".":
            match["unit"] = match["unit"][:-1]
        return match


    def parse_type(G, sentence, annotations, stats, match):
        """
        Parse the thing being quantified based on dependency patterns and format of number/unit.
        """
        if match["format"] == "space_between":
            p_type = space_between_patterns(G, sentence, annotations, match["unit_idx"], match["num_idx"])
            if p_type == None:
                p_type = uncertain_parse_patterns(G, sentence, annotations, stats, match["unit_idx"])
        elif match["format"] == "hyphenated":
            p_type = hyphenated_patterns(G, sentence, annotations, stats, match["unit_idx"])
        elif match["format"] == "attached":
            p_type = attached_patterns(G, sentence, annotations, match["unit_idx"])
        elif match["format"] == "attached_and_hyphenated":
            full = annotations.lookup[int(match["unit_idx"])]["word"]
            num_hyphens = full.count("-")
            p_type = full.split("-")[num_hyphens]
        elif match["format"] == "double_hyphenated":
            full = annotations.lookup[int(match["unit_idx"])]["word"]
            num_hyphens = full.count("-")
            p_type = full.split("-")[num_hyphens]
        else:
            p_type = space_between_patterns(G, sentence, annotations, match["unit_idx"], match["num_idx"])
            if p_type == None:
                stats.evaluate(sentence, "Unknown", "None", "type")
        return p_type



    def split_and_extract(content, stats, out):
        sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')
        sentences = list(sent_detector.tokenize(cleanup(content)))
        sentences1= list(map(lambda v : unicodedata.normalize('NFKD', v).encode('ascii','ignore'), sentences))
        measurements = [ ]
        for i in range(0, len(sentences1)):
            sent = sentences1[i]

            try:
                output = nlp.annotate(sent, properties={'outputFormat':'json', 'timeout':'5000'})
            except:
                print "ENCODING ERROR: " + sent
                return []
            if "sentences" in output and type(output["sentences"]) is list:
                dep_key = "collapsed-ccprocessed-dependencies"
                if not "collapsed-ccprocessed-dependencies" in output["sentences"][0]:
                    dep_key = "enhanced-plus-plus-dependencies"

                annotations = Annotations(output["sentences"][0]["tokens"], output["sentences"][0][dep_key])
                # Check for legitimate output from coreNLP
                if annotations.check_output(output["sentences"][0], stats) != True and nlp2:
                    output = nlp2.annotate(sent, properties={'outputFormat':'json', 'timeout':'50000'})
                    annotations = Annotations(output["sentences"][0]["tokens"], output["sentences"][0][dep_key])

                if annotations.check_output(output["sentences"][0], stats) == True:
                    stats.total_sentences += 1
                    annotations.build_lookup()

                    G = build_graph(annotations, show=show_graph)

                    annotations.find_units_and_formats(G)
                    matches = annotations.matches

                    if matches != None:
                        sentence_written = False
                        ranges_found = []
                        results = []
                        for match in matches:
                            stats.total_measurements += 1

                            range_check = find_range(sent, match, annotations, "(to|by|-)", "(\s|\()")
                            if range_check[1] == None:
                                range_check = find_range(sent, match, annotations, "(and|&)", "between\s")

                            match = remove_trailing_punct(range_check[0])
                            range_found = range_check[1]
                            # final checks
                            # print re.search("[a-zA-Z]|\%", match["unit"])
                            if (range_found == None or (range_found != None and not range_found in ranges_found)) and \
                            re.search("[a-zA-Z]|\%", match["unit"]) != None and re.search(match["unit"] + " (by|to|-) ", sent) == None and \
                            re.search("[A-Z]", match["num"][1:]) == None:
                            # annotations lookup used to make sure that a match isn't part of a range to be found later
                            #add verb check back in for actual implementation (used for quality control when sentence splitting) -> "and annotations.check_for_verb() == True"
                                if range_found != None:
                                    ranges_found.append(range_found)

                                if sentence_written == False:
                                    out.write("\n" + str(i) + ": " + sent + "\n")
                                    sentence_written = True
                                # print match
                                sentence = Sentence(sent, match["unit"], match["num"], None, i)

                                match["type"] = parse_type(G, sentence, annotations, stats, match)
                                match["type"] = "" if match["type"] == None else match["type"]

                                results.append(match)

                        for idx, x in enumerate(results):
                            for y in results:
                                if x["unit_idx"] == y["unit_idx"] and x["num"] in y["num"] and len(x["num"]) < len(y["num"]):
                                    del results[idx] #quality control -> make sure a measurement is not part of a range that was found after
                                if x["num"] in y["num"] and sentence.text.count(x["num"]) == 1 and len(x["num"]) < len(y["num"]):
                                    del results[idx] # more quality control, added to ensure even if unit was different, still could catch duplicates

                        if verbose == True:
                            print(sentence.text)

                        for match in results:
                            out.write("(")
                            out.write(match["num"].encode("utf-8"))
                            out.write(", ")
                            out.write(match["unit"].encode("utf-8"))
                            out.write(", ")
                            out.write(match["type"].encode("utf-8"))
                            out.write(")\n")

                            if verbose == True:
                                print("(" + match["num"].encode("utf-8") + ", " + match["unit"].encode("utf-8") + ", " + match["type"].encode("utf-8") + ")\n")

                            measurements = measurements + results

            else:
                print "Core NLP Failed"

        stats.print_summary()
        return measurements



    with open(os.path.join(output_file), "w") as out:

        if content == None and input_dir != None:
            for input_file in os.listdir(os.path.join(input_dir)):
                if input_file != ".DS_Store":
                    # Content Extraction
                    content = open(os.path.join(input_dir, input_file)).read()
                    return split_and_extract(content, stats, out)

        elif content != None and input_dir == None:
            return split_and_extract(content, stats, out)







print extract_measurements(content=None, input_dir="/Users/nithinkrishna/Desktop/test", output_file="measurements_output")


