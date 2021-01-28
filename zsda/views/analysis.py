import pandas as pd
import numpy as np
import json

def zone_analysis(pitch_data):
    data = pd.read_json(json.dumps(pitch_data), orient='records')
    zones = data['zone'].unique().tolist()
    zones.sort()
    # sorted = data.sort_values(by='zone', axis=0)
    print(zones)
    return 'check'