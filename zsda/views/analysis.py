import pandas as pd
import numpy as np
import json

def zone_analysis(pitch_data):
    data = pd.read_json(json.dumps(pitch_data), orient='records')
    zones = data['zone'].unique().tolist()
    events = data['events'].unique().tolist()
    zones.sort()
    complete = {}
    tot_stats = {}
    tot_stats['pitch_count'] = len(data.index)
    tot_stats['pitch_type_count'] = get_pitch_type_count(data)
    tot_stats['avg'] = get_avg(data)
    tot_stats['whiff'] = get_whiff(data)
    complete['total'] = tot_stats
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
    pitch_types = data['pitch_type'].unique().tolist()
    counts = {}
    for p in pitch_types:
        counts[p] = len(data[data['pitch_type'] == p].index)
    return counts

def get_avg(data):
    outs = ['double_play', 'field_error', 'field_out', 'fielders_choice', 'fielders_choice_out', 'force_out',
       'grounded_into_double_play','strikeout']
    hits = ['single', 'double', 'triple', 'home_run']
    
    at_bats = outs + hits
    ab_data = data[data['events'].isin(at_bats)]
    hit_data = data[data['events'].isin(hits)]

    avg = len(hit_data.index) / len(ab_data.index)
    return round(avg, 3)

def get_whiff(data):
    miss = ['missed_blunt', 'swinging_strike', 'swinging_strike_blocked']
    swing_data = data[data['result'].isin(['X', 'S'])]
    miss_data = data[data['description'].isin(miss)]
    whiff = len(miss_data.index) / len(swing_data.index)
    return round(whiff, 3)