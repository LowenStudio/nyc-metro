export interface Station { id: string; name: string; x: number; y: number; borough: 'The Bronx' | 'Manhattan' | 'Brooklyn' | 'Queens' | 'Staten Island'; longitude: number; latitude: number; gtfsStopId: string; interchange?: boolean }
// North-to-south 1 service. Original schematic coordinates, not geographic data.
export const stations: Station[] = [
  {
    "id": "1-242",
    "name": "Van Cortlandt Park–242 St",
    "x": 1158,
    "y": -1115,
    "borough": "The Bronx",
    "interchange": true,
    "longitude": -73.898583,
    "latitude": 40.889248,
    "gtfsStopId": "101S"
  },
  {
    "id": "1-238",
    "name": "238 St",
    "x": 1140,
    "y": -1060,
    "borough": "The Bronx",
    "longitude": -73.90087,
    "latitude": 40.884667,
    "gtfsStopId": "103S"
  },
  {
    "id": "1-231",
    "name": "231 St",
    "x": 1122,
    "y": -1005,
    "borough": "The Bronx",
    "longitude": -73.904834,
    "latitude": 40.878856,
    "gtfsStopId": "104S"
  },
  {
    "id": "1-225",
    "name": "Marble Hill–225 St",
    "x": 1104,
    "y": -950,
    "borough": "Manhattan",
    "longitude": -73.909831,
    "latitude": 40.874561,
    "gtfsStopId": "106S"
  },
  {
    "id": "1-215",
    "name": "215 St",
    "x": 1086,
    "y": -895,
    "borough": "Manhattan",
    "longitude": -73.915279,
    "latitude": 40.869444,
    "gtfsStopId": "107S"
  },
  {
    "id": "1-207",
    "name": "207 St",
    "x": 1068,
    "y": -840,
    "borough": "Manhattan",
    "longitude": -73.918822,
    "latitude": 40.864621,
    "gtfsStopId": "108S"
  },
  {
    "id": "1-dyckman",
    "name": "Dyckman St",
    "x": 1050,
    "y": -785,
    "borough": "Manhattan",
    "longitude": -73.925536,
    "latitude": 40.860531,
    "gtfsStopId": "109S"
  },
  {
    "id": "1-191",
    "name": "191 St",
    "x": 1032,
    "y": -730,
    "borough": "Manhattan",
    "longitude": -73.929412,
    "latitude": 40.855225,
    "gtfsStopId": "110S"
  },
  {
    "id": "1-181",
    "name": "181 St",
    "x": 1014,
    "y": -675,
    "borough": "Manhattan",
    "longitude": -73.933596,
    "latitude": 40.849505,
    "gtfsStopId": "111S"
  },
  {
    "id": "1-168",
    "name": "168 St–Washington Hts",
    "x": 996,
    "y": -620,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -73.940133,
    "latitude": 40.840556,
    "gtfsStopId": "112S"
  },
  {
    "id": "1-157",
    "name": "157 St",
    "x": 978,
    "y": -565,
    "borough": "Manhattan",
    "longitude": -73.94489,
    "latitude": 40.834041,
    "gtfsStopId": "113S"
  },
  {
    "id": "1-145",
    "name": "145 St",
    "x": 960,
    "y": -510,
    "borough": "Manhattan",
    "longitude": -73.95036,
    "latitude": 40.826551,
    "gtfsStopId": "114S"
  },
  {
    "id": "1-137",
    "name": "137 St–City College",
    "x": 942,
    "y": -455,
    "borough": "Manhattan",
    "longitude": -73.953676,
    "latitude": 40.822008,
    "gtfsStopId": "115S"
  },
  {
    "id": "1-125",
    "name": "125 St",
    "x": 924,
    "y": -400,
    "borough": "Manhattan",
    "longitude": -73.958372,
    "latitude": 40.815581,
    "gtfsStopId": "116S"
  },
  {
    "id": "1-116",
    "name": "116 St–Columbia University",
    "x": 906,
    "y": -345,
    "borough": "Manhattan",
    "longitude": -73.96411,
    "latitude": 40.807722,
    "gtfsStopId": "117S"
  },
  {
    "id": "1-110",
    "name": "Cathedral Pkwy (110 St)",
    "x": 888,
    "y": -290,
    "borough": "Manhattan",
    "longitude": -73.966847,
    "latitude": 40.803967,
    "gtfsStopId": "118S"
  },
  {
    "id": "1-103",
    "name": "103 St",
    "x": 870,
    "y": -235,
    "borough": "Manhattan",
    "longitude": -73.968379,
    "latitude": 40.799446,
    "gtfsStopId": "119S"
  },
  {
    "id": "1-96",
    "name": "96 St",
    "x": 852,
    "y": -180,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -73.972323,
    "latitude": 40.793919,
    "gtfsStopId": "120S"
  },
  {
    "id": "1-86",
    "name": "86 St",
    "x": 834,
    "y": -125,
    "borough": "Manhattan",
    "longitude": -73.976218,
    "latitude": 40.788644,
    "gtfsStopId": "121S"
  },
  {
    "id": "1-79",
    "name": "79 St",
    "x": 816,
    "y": -70,
    "borough": "Manhattan",
    "longitude": -73.979917,
    "latitude": 40.783934,
    "gtfsStopId": "122S"
  },
  {
    "id": "1-72",
    "name": "72 St",
    "x": 798,
    "y": -15,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -73.98197,
    "latitude": 40.778453,
    "gtfsStopId": "123S"
  },
  {
    "id": "1-66",
    "name": "66 St–Lincoln Center",
    "x": 780,
    "y": 40,
    "borough": "Manhattan",
    "longitude": -73.982209,
    "latitude": 40.77344,
    "gtfsStopId": "124S"
  },
  {
    "id": "1-59",
    "name": "59 St–Columbus Circle",
    "x": 762,
    "y": 95,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -73.981929,
    "latitude": 40.768247,
    "gtfsStopId": "125S"
  },
  {
    "id": "1-50",
    "name": "50 St",
    "x": 730,
    "y": 158,
    "borough": "Manhattan",
    "longitude": -73.983849,
    "latitude": 40.761728,
    "gtfsStopId": "126S"
  },
  {
    "id": "1-42",
    "name": "Times Sq–42 St",
    "x": 696,
    "y": 226,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -73.987495,
    "latitude": 40.75529,
    "gtfsStopId": "127S"
  },
  {
    "id": "1-34",
    "name": "34 St–Penn Station",
    "x": 661,
    "y": 294,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -73.991057,
    "latitude": 40.750373,
    "gtfsStopId": "128S"
  },
  {
    "id": "1-28",
    "name": "28 St",
    "x": 636,
    "y": 345,
    "borough": "Manhattan",
    "longitude": -73.993365,
    "latitude": 40.747215,
    "gtfsStopId": "129S"
  },
  {
    "id": "1-23",
    "name": "23 St",
    "x": 611,
    "y": 396,
    "borough": "Manhattan",
    "longitude": -73.995657,
    "latitude": 40.744081,
    "gtfsStopId": "130S"
  },
  {
    "id": "1-18",
    "name": "18 St",
    "x": 586,
    "y": 447,
    "borough": "Manhattan",
    "longitude": -73.997871,
    "latitude": 40.74104,
    "gtfsStopId": "131S"
  },
  {
    "id": "1-14",
    "name": "14 St",
    "x": 561,
    "y": 498,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -74.000201,
    "latitude": 40.737826,
    "gtfsStopId": "132S"
  },
  {
    "id": "1-christopher",
    "name": "Christopher St–Stonewall",
    "x": 527,
    "y": 549,
    "borough": "Manhattan",
    "longitude": -74.002906,
    "latitude": 40.733422,
    "gtfsStopId": "133S"
  },
  {
    "id": "1-houston",
    "name": "Houston St",
    "x": 493,
    "y": 600,
    "borough": "Manhattan",
    "longitude": -74.005367,
    "latitude": 40.728251,
    "gtfsStopId": "134S"
  },
  {
    "id": "1-canal",
    "name": "Canal St",
    "x": 478,
    "y": 655,
    "borough": "Manhattan",
    "longitude": -74.006277,
    "latitude": 40.722854,
    "gtfsStopId": "135S"
  },
  {
    "id": "1-franklin",
    "name": "Franklin St",
    "x": 463,
    "y": 710,
    "borough": "Manhattan",
    "longitude": -74.006886,
    "latitude": 40.719318,
    "gtfsStopId": "136S"
  },
  {
    "id": "1-chambers",
    "name": "Chambers St",
    "x": 448,
    "y": 765,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -74.009266,
    "latitude": 40.715478,
    "gtfsStopId": "137S"
  },
  {
    "id": "1-wtc",
    "name": "WTC Cortlandt",
    "x": 433,
    "y": 820,
    "borough": "Manhattan",
    "longitude": -74.012188,
    "latitude": 40.711835,
    "gtfsStopId": "138S"
  },
  {
    "id": "1-rector",
    "name": "Rector St",
    "x": 418,
    "y": 875,
    "borough": "Manhattan",
    "longitude": -74.013783,
    "latitude": 40.707513,
    "gtfsStopId": "139S"
  },
  {
    "id": "1-south-ferry",
    "name": "South Ferry",
    "x": 403,
    "y": 930,
    "borough": "Manhattan",
    "interchange": true,
    "longitude": -74.013664,
    "latitude": 40.702068,
    "gtfsStopId": "142S"
  }
];
