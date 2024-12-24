from flask import Blueprint, jsonify, request, session 
import json, os, hashlib

# Create the blueprint
views = Blueprint('views', __name__)