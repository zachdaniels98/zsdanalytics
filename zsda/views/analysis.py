"""Contains calculations on baseball data

Takes in data from MySQL database and returns it as dictionary
The data is returned by the API in JSON format to be fetched by front end code."""

import pandas as pd
import numpy as np
import json

def zone_analysis(pitch_data, position):
    """Take in the pitch level data and return calculated stats for each of the 14 zones and the stats for the entire zone"""

    data = pd.read_json(json.dumps(pitch_data), orient='records')
    if data.empty:
        return None
    events = data['events'].unique().tolist()
    complete = {}
    tot_stats = {}
    tot_stats['pitch_count'] = len(data.index)
    tot_stats['pitch_type_count'] = get_pitch_type_count(data)
    tot_stats['avg'] = get_avg(data)
    tot_stats['whiff'] = get_whiff(data)
    complete['Total'] = tot_stats
    zones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14]
    for zone in zones:
        zone_data = data[data['zone'] == zone]
        zone_stats = {}
        zone_stats['pitch_count'] = len(zone_data.index)
        zone_stats['pitch_type_count'] = get_pitch_type_count(zone_data)
        zone_stats['avg'] = get_avg(zone_data)
        zone_stats['whiff'] = get_whiff(zone_data)
        complete[zone] = zone_stats

    return complete

def get_pitch_type_count(data):
    """Return counts of each type of pitch (Fastball, Changeup, etc.)"""

    pitch_types = data['pitch_type'].unique().tolist()
    counts = {}
    for p in pitch_types:
        counts[p] = len(data[data['pitch_type'] == p].index)
    return counts

def get_avg(data):
    """Return batting average for given data"""

    outs = ['double_play', 'field_error', 'field_out', 'fielders_choice', 'fielders_choice_out', 'force_out',
       'grounded_into_double_play','strikeout']
    hits = ['single', 'double', 'triple', 'home_run']
    
    at_bats = outs + hits
    ab_data = data[data['events'].isin(at_bats)]
    hit_data = data[data['events'].isin(hits)]

    avg = None
    if ab_data.empty:
        avg = 0.0
    else:
        avg = len(hit_data.index) / len(ab_data.index)
    return round(avg, 3)

def get_whiff(data):
    """Return whiff percentage for given data"""
    
    miss = ['missed_blunt', 'swinging_strike', 'swinging_strike_blocked']
    swing_data = data[data['result'].isin(['X', 'S'])]
    miss_data = data[data['description'].isin(miss)]
    whiff = None
    if swing_data.empty:
        whiff = 0.0
    else:
        whiff = len(miss_data.index) / len(swing_data.index)
    return round(whiff, 3)