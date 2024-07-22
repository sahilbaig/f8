#!/usr/bin/python3
import sys
from simplepam import authenticate
username=sys.argv[1]
password=sys.argv[2]

def check():
    p=authenticate(username,password)
    print(p)

if __name__ == "__main__":
    check()